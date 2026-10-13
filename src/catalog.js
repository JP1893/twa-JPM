export const byCategory = (list, cat) =>
  list.filter(item => item.category === cat)

export const search = (list, text) => {
  const query = text.toLowerCase()
  return list.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.tags.some(tag => tag.toLowerCase().includes(query))
  )
}

export const total = (list) =>
  list.reduce((acc, item) => acc + item.price, 0)

export const top = (list, n) =>
  list.toSorted((a, b) => b.price - a.price).slice(0, n)

export const categories = (list) =>
  [...new Set(list.map(item => item.category))].sort()

export const withDiscount = (list, pct) =>
  list.map(item => ({
    ...item,
    price: item.price * (1 - pct / 100)
  }))

export const sortByPrice = (list, dir) =>
  list.toSorted((a, b) => dir === 'asc' ? a.price - b.price : b.price - a.price)
