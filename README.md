# Tecnologias Web Avançadas - Ficha 01

Exercícios da primeira aula: módulos ES, utilização de uma API com `fetch` e um projeto Vite.

## 1. Ferramentas

Verificar as versões instaladas no terminal:

```bash
node --version
npm --version
git --version
```

O exercício foi preparado para Node.js 22, npm e Git.

## 2. Primeiro módulo ES

Na pasta `twa-ficha01`, o `package.json` tem `"type": "module"`.
O ficheiro `utils.js` exporta a função `slug`, usada em `app.js`.

```bash
cd twa-ficha01
node app.js
```

Resultado esperado: `tecnologias-web-avançadas`

## 3. API pública

Ainda em `twa-ficha01`:

```bash
node api.js
```

O programa consulta o repositório do Node.js na API do GitHub, mostra o nome e o número de estrelas e guarda alguns campos em `repo.json`. É preciso ter ligação à Internet para executar este passo.

## 4. Projeto Vite

Na pasta `twa-vite`:

```bash
npm install
npm run dev
```

Abrir o endereço indicado no terminal. O contador começa em 10, diminui um número por clique e atualiza o título do separador. Quando chega a 0, deixa de diminuir.

Para testar a compilação:

```bash
npm run build
```

## 5. Publicar no GitHub ou GitLab

Criar um repositório chamado `twa-<nome>` e, na pasta principal deste trabalho, executar:

```bash
git init
git add .
git commit -m "Ficha 01"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

Substituir `URL_DO_REPOSITORIO` pelo endereço fornecido pelo GitHub/GitLab. Entregar esse URL no Moodle. Se o repositório for privado, dar acesso ao utilizador `davidmgvaz` (no GitLab, com papel Reporter).
