import './style.css'
import { byCategory, search, categories, sortByPrice } from './catalog.js'

const input = document.querySelector('#q')
const select = document.querySelector('#category')
const sortButton = document.querySelector('#sort')
const list = document.querySelector('#list')
const detail = document.querySelector('#detail')
const message = document.querySelector('#message')

const state = {
  status: 'loading',
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null
}

function render(state) {
  list.replaceChildren()
  detail.replaceChildren()
  message.replaceChildren()

  input.disabled = state.status !== 'ready'
  select.disabled = state.status !== 'ready'
  sortButton.disabled = state.status !== 'ready'
  sortButton.textContent = state.sortDir === 'desc'
    ? 'Ordenar: preço mais alto'
    : 'Ordenar: preço mais baixo'

  if (state.status === 'loading') {
    message.textContent = 'A carregar produtos...'
    return
  }

  if (state.status === 'error') {
    message.textContent = `Erro ao carregar os produtos: ${state.error}`
    const retry = document.createElement('button')
    retry.type = 'button'
    retry.textContent = 'Tentar de novo'
    retry.addEventListener('click', load)
    message.append(' ', retry)
    return
  }

  const options = [
    { value: '', label: 'Todas' },
    ...categories(state.items).map(cat => ({ value: cat, label: cat }))
  ]
  select.replaceChildren(...options.map(option => {
    const element = document.createElement('option')
    element.value = option.value
    element.textContent = option.label
    return element
  }))
  select.value = state.category

  const filtered = state.category
    ? byCategory(state.items, state.category)
    : state.items
  const visible = sortByPrice(search(filtered, state.query), state.sortDir)
  message.textContent = `${visible.length} produto(s) encontrado(s)`

  if (visible.length === 0) {
    const empty = document.createElement('li')
    empty.textContent = 'Sem resultados.'
    list.append(empty)
  } else {
    list.replaceChildren(...visible.map(item => {
      const li = document.createElement('li')
      li.dataset.id = item.id
      if (item.id === state.selectedId) li.classList.add('selected')
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = `${item.name} — ${item.price.toFixed(2)} €`
      li.append(button)
      return li
    }))
  }

  const selected = state.items.find(item => item.id === state.selectedId)
  if (selected) {
    const title = document.createElement('h2')
    title.textContent = selected.name
    const price = document.createElement('p')
    price.textContent = `Preço: ${selected.price.toFixed(2)} €`
    const tags = document.createElement('p')
    tags.textContent = `Tags: ${selected.tags.join(', ')}`
    const brand = document.createElement('p')
    brand.textContent = `Marca: ${selected.details.brand}`
    const warranty = document.createElement('p')
    warranty.textContent = `Garantia: ${selected.details.warrantyYears} ano(s)`
    detail.replaceChildren(title, price, tags, brand, warranty)
  }
}

async function load() {
  state.status = 'loading'
  state.error = null
  render(state)

  try {
    const res = await fetch('/items.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const items = await res.json()
    if (!Array.isArray(items)) throw new Error('Os dados recebidos não são uma lista.')

    state.items = items
    state.status = 'ready'
  } catch (err) {
    state.status = 'error'
    state.error = err.message
    state.items = []
  } finally {
    render(state)
  }
}

input.addEventListener('input', event => {
  state.query = event.target.value
  render(state)
})

select.addEventListener('change', event => {
  state.category = event.target.value
  render(state)
})

sortButton.addEventListener('click', () => {
  state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc'
  render(state)
})

list.addEventListener('click', event => {
  const li = event.target.closest('li[data-id]')
  if (!li || !list.contains(li)) return
  state.selectedId = Number(li.dataset.id)
  render(state)
})

load()
