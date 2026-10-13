import { writeFile } from 'node:fs/promises'
import { items } from './data.js'
import { byCategory, search, total, top, categories } from './catalog.js'

const [cmd, arg] = process.argv.slice(2)

if (cmd === 'report') {
  const reportData = {
    count: items.length,
    total: Number(total(items).toFixed(2)),
    categories: categories(items),
    top3: top(items, 3)
  }

  await writeFile('report.json', JSON.stringify(reportData, null, 2))
  console.log('Relatório gravado em report.json com sucesso.')
} else if (cmd === 'search' && arg) {
  console.log(search(items, arg))
} else if (cmd === 'top' && arg) {
  console.log(top(items, Number(arg)))
} else if (cmd) {
  console.log(byCategory(items, cmd))
} else {
  console.log(items)
}
