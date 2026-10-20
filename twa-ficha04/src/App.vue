<script setup>
import { computed, ref } from 'vue'
import { byCategory, categories, search, sortByPrice } from './catalog.js'

const status = ref('loading')
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

const visible = computed(() => {
  let list = search(items.value, query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})
const cats = computed(() => categories(items.value))
const selected = computed(() => items.value.find(item => item.id === selectedId.value))
const count = computed(() => `${visible.value.length} de ${items.value.length} itens`)

async function load() {
  status.value = 'loading'
  error.value = null
  selectedId.value = null
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}items.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Os dados recebidos não são uma lista.')
    items.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    items.value = []
  } finally {
    // O Vue atualiza o template quando os refs mudam.
    status.value = error.value === null ? 'ready' : 'error'
  }
}

load()
</script>

<template>
  <main>
    <header>
      <p class="eyebrow">TWA · Ficha 04</p>
      <h1>Catálogo em Vue</h1>
      <p>Pesquisa, filtra e explora os produtos.</p>
    </header>
    <div class="controls">
      <label for="query">Pesquisar por nome ou tag
        <input id="query" v-model="query" type="search" :disabled="status !== 'ready'" placeholder="Ex.: gaming">
      </label>
      <label for="category">Categoria
        <select id="category" v-model="category" :disabled="status !== 'ready'">
          <option value="">Todas</option>
          <option v-for="cat in cats" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </label>
      <button type="button" :disabled="status !== 'ready'" @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'">
        Ordenar: {{ sortDir === 'desc' ? '↓ preço mais alto' : '↑ preço mais baixo' }}
      </button>
      <button type="button" :disabled="status !== 'ready'" @click="query = ''">Limpar pesquisa</button>
    </div>
    <p v-if="status === 'loading'" role="status">A carregar produtos...</p>
    <div v-else-if="status === 'error'" role="alert">
      <p>Erro ao carregar os produtos: {{ error }}</p>
      <button type="button" @click="load">Tentar de novo</button>
    </div>
    <template v-else>
      <p role="status">{{ count }}</p>
      <p v-if="visible.length === 0">Sem resultados.</p>
      <ul id="list">
        <li v-for="item in visible" :key="item.id" :class="{ selected: item.id === selectedId }">
          <button type="button" :aria-pressed="item.id === selectedId" @click="selectedId = item.id">
            <span>{{ item.name }}</span><strong>{{ item.price.toFixed(2) }} €</strong>
          </button>
        </li>
      </ul>
      <section v-if="selected" id="detail" aria-labelledby="detail-title">
        <h2 id="detail-title">{{ selected.name }}</h2>
        <p>Preço: {{ selected.price.toFixed(2) }} €</p>
        <p>Categoria: {{ selected.category }}</p>
        <p>Tags: {{ selected.tags.join(', ') }}</p>
        <p>Marca: {{ selected.details.brand }}</p>
        <p>Garantia: {{ selected.details.warrantyYears }} ano(s)</p>
        <button type="button" @click="selectedId = null">Fechar detalhe</button>
      </section>
    </template>
  </main>
</template>

<style scoped>
:global(body) { font-family: Arial, sans-serif; background: #f5f5f5; color: #222; margin: 0; }
:global(*) { box-sizing: border-box; }
main { max-width: 850px; margin: 40px auto; padding: 24px; background: white; border: 1px solid #ddd; border-radius: 8px; }
h1 { color: #5b1f2e; margin-bottom: 8px; }
.eyebrow { color: #654b54; font-weight: bold; font-size: .85rem; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; margin-top: 24px; }
label { display: grid; gap: 6px; font-size: .9rem; }
input, select, button { font: inherit; padding: 8px; border: 1px solid #999; border-radius: 4px; }
button { cursor: pointer; background: #f6f4f5; color: #222; }
button:disabled { cursor: default; opacity: .6; }
:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
#list { padding: 0; list-style: none; }
#list li { margin: 7px 0; }
#list li button { width: 100%; text-align: left; display: flex; justify-content: space-between; gap: 16px; }
#list li.selected button { background: #dbeafe; border: 1px solid #2563eb; }
strong { white-space: nowrap; }
#detail { margin-top: 20px; padding: 12px; border-top: 1px solid #ddd; }
@media (max-width: 600px) { main { margin: 12px; padding: 16px; } label, input, select { width: 100%; } }
</style>

