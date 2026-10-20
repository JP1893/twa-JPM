// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import data from '../public/items.json'
import App from './App.vue'

let wrapper
function success(items = data) {
  return { ok: true, json: async () => structuredClone(items) }
}
async function start(response = success()) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
  wrapper = mount(App, { attachTo: document.body })
  await flushPromises()
  return wrapper
}
const sortButton = () => wrapper.findAll('button').find(button => button.text().startsWith('Ordenar:'))
afterEach(() => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
})

describe('Catálogo em Vue', () => {
  it('mostra loading e desativa controlos até receber os dados', async () => {
    let resolve
    vi.stubGlobal('fetch', vi.fn(() => new Promise(done => { resolve = done })))
    wrapper = mount(App)
    expect(wrapper.text()).toContain('A carregar produtos...')
    expect(wrapper.get('#query').element.disabled).toBe(true)
    resolve(success())
    await flushPromises()
    expect(fetch).toHaveBeenCalledWith('/items.json')
    expect(wrapper.findAll('#list li')).toHaveLength(8)
    expect(wrapper.text()).toContain('8 de 8 itens')
    expect(wrapper.get('#query').element.disabled).toBe(false)
  })

  it('combina pesquisa e categoria, mantém foco e limpa a pesquisa', async () => {
    await start()
    const input = wrapper.get('#query')
    input.element.focus()
    await input.setValue('GAMING')
    expect(wrapper.findAll('#list li')).toHaveLength(4)
    expect(document.activeElement).toBe(input.element)
    await wrapper.get('#category').setValue('gaming')
    expect(wrapper.findAll('#list li')).toHaveLength(2)
    expect(wrapper.text()).toContain('2 de 8 itens')
    await input.setValue('inexistente')
    expect(wrapper.text()).toContain('Sem resultados.')
    await wrapper.findAll('button').find(button => button.text() === 'Limpar pesquisa').trigger('click')
    expect(input.element.value).toBe('')
    expect(wrapper.get('#category').element.value).toBe('gaming')
    expect(wrapper.findAll('#list li')).toHaveLength(2)
  })

  it('ordena e conserva a seleção por id, com detalhe aninhado', async () => {
    await start()
    expect(wrapper.findAll('#list li')[0].text()).toContain('Monitor')
    await wrapper.findAll('#list li button')[0].trigger('click')
    expect(wrapper.get('#detail').text()).toContain('Marca: LG')
    expect(wrapper.get('#detail').text()).toContain('Garantia: 3 ano(s)')
    expect(wrapper.get('#detail').text()).toContain('hardware, ecra')
    await sortButton().trigger('click')
    expect(wrapper.findAll('#list li')[0].text()).toContain('Tapete')
    expect(wrapper.get('li.selected').text()).toContain('Monitor')
    expect(wrapper.get('li.selected button').attributes('aria-pressed')).toBe('true')
    await wrapper.get('#detail button').trigger('click')
    expect(wrapper.find('#detail').exists()).toBe(false)
  })

  it('escapa HTML nos nomes da lista e no detalhe', async () => {
    const items = structuredClone(data)
    items[0].name = '<b>olá</b><img src=x onerror="alert(1)">'
    await start(success(items))
    const button = wrapper.findAll('#list li button').find(button => button.text().includes('<b>olá</b>'))
    expect(button.find('b').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
    await button.trigger('click')
    expect(wrapper.get('#detail h2').text()).toBe(items[0].name)
    expect(wrapper.find('#detail img').exists()).toBe(false)
  })

  it('trata HTTP 404 e recupera com Tentar de novo', async () => {
    await start({ ok: false, status: 404 })
    expect(wrapper.get('[role="alert"]').text()).toContain('HTTP 404')
    expect(wrapper.find('#list').exists()).toBe(false)
    fetch.mockResolvedValueOnce(success())
    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.findAll('#list li')).toHaveLength(8)
  })

  it.each([
    ['JSON inválido / fallback HTML do Vite', { ok: true, json: async () => { throw new SyntaxError('Unexpected token <') } }, 'Unexpected token <'],
    ['resposta que não é uma lista', success({}), 'não são uma lista'],
  ])('trata %s', async (_, response, message) => {
    await start(response)
    expect(wrapper.get('[role="alert"]').text()).toContain(message)
  })

  it('trata falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Sem rede')))
    wrapper = mount(App)
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Sem rede')
  })

  it('mostra lista vazia e reage a alterações diretas do ref query', async () => {
    await start(success([]))
    expect(wrapper.text()).toContain('0 de 0 itens')
    expect(wrapper.text()).toContain('Sem resultados.')
    wrapper.unmount()
    await start()
    wrapper.vm.query = 'usb'
    await nextTick()
    expect(wrapper.findAll('#list li')).toHaveLength(1)
    expect(wrapper.get('#query').element.value).toBe('usb')
  })
})
