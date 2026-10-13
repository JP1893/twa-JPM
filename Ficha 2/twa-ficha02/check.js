import assert from 'node:assert/strict'
import { items } from './data.js'
import { byCategory, search, total, top, categories, withDiscount } from './catalog.js'

const original = structuredClone(items)

assert.deepEqual(byCategory(items, 'gaming').map(item => item.id), [4, 7])
assert.deepEqual(search(items, 'GAMING').map(item => item.id), [1, 4, 5, 7])
assert.equal(Number(total(items).toFixed(2)), 462.03)
assert.deepEqual(top(items, 3).map(item => item.id), [3, 1, 4])
assert.deepEqual(categories(items), ['acessorios', 'gaming', 'tech'])

const discounted = withDiscount(items, 10)
assert.equal(Number(discounted[0].price.toFixed(2)), 80.91)
assert.notStrictEqual(discounted[0], items[0])
assert.deepEqual(items, original)
