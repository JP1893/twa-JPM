import { writeFile } from 'node:fs/promises'

const res = await fetch('https://api.github.com/repos/nodejs/node')

if (!res.ok) {
  throw new Error(`HTTP ${res.status}`)
}

const repo = await res.json()
console.log(repo.name, repo.stargazers_count)

const dados = {
  name: repo.name,
  description: repo.description,
  html_url: repo.html_url,
  stargazers_count: repo.stargazers_count
}

await writeFile('repo.json', JSON.stringify(dados, null, 2))
console.log('Ficheiro repo.json criado.')
