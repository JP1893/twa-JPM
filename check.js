import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  byCategory, search, total, top, categories,
  withDiscount, sortByPrice
} from './src/catalog.js'

const items = JSON.parse(await readFile(new URL('./public/items.json', import.meta.url), 'utf8'))
const original = structuredClone(items)

assert.deepEqual(byCategory(items, 'gaming').map(item => item.id), [4, 7])
assert.deepEqual(search(items, 'GAMING').map(item => item.id), [1, 4, 5, 7])
assert.equal(Number(total(items).toFixed(2)), 462.03)
assert.deepEqual(top(items, 3).map(item => item.id), [3, 1, 4])
assert.deepEqual(categories(items), ['acessorios', 'gaming', 'tech'])
assert.equal(Number(withDiscount(items, 10)[0].price.toFixed(2)), 80.91)

assert.deepEqual(sortByPrice(items, 'asc').map(item => item.id), [5, 2, 8, 6, 7, 4, 1, 3])
assert.deepEqual(sortByPrice(items, 'desc').map(item => item.id), [3, 1, 4, 7, 6, 8, 2, 5])
assert.notStrictEqual(sortByPrice(items, 'asc'), items)
assert.deepEqual(items, original)
