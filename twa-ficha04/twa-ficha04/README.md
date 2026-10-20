# Ficha 04 — Catálogo em Vue

Tecnologias Web Avançadas · JP1893 · 20/10/2026

## Instalar e executar

É necessário Node.js 20.19+ ou 22.12+ e npm (testado com Node 24.19.0).
Na raiz do repositório:

```sh
cd twa-ficha04
npm install
npm run dev
```

Abrir o endereço indicado pelo Vite. Vue, Vite e ferramentas de testes são
instalados pelo npm; não é necessária uma API nem uma base de dados.
A extensão Vue.js devtools no browser permite inspecionar os refs do App.

```sh
npm run check     # check.js original da Ficha 03
npm test          # check.js + nove testes do componente
npm run build     # build de produção em dist/
npm run preview   # servir o build localmente
```

O ficheiro `pnpm-lock.yaml` fixa as versões usadas na verificação com pnpm 11.25.0:
`pnpm install --frozen-lockfile`, `pnpm test` e `pnpm build` reproduzem esse ambiente.

## O que está feito

Template oficial Vite `vue`, em JavaScript, com um único `App.vue`:
sete refs pedidos; `load()` com fetch, res.ok, try/catch/finally e estados
loading/error/ready; computed visible/cats/selected; pesquisa e categoria com
v-model; ordenação por preço com setas; estados condicionais; lista com chaves
por id e seleção; detalhe com tags, marca e garantia; CSS scoped.
O finally termina o estado de carregamento, sem chamar render().
Bónus B: contador computed “N de M itens” e botão Limpar pesquisa.
O texto é interpolado e escapado; não há manipulação manual do DOM na aplicação.
Os bónus opcionais A e C não foram incluídos.

`src/catalog.js`, `public/items.json` e `check.js` foram copiados sem alterações
da Ficha 03 de [JP1893/twa-JPM](https://github.com/JP1893/twa-JPM), commit
`489c18d3e771035e380b9c68833e2ccc4a5c0c11`. As fichas anteriores não foram alteradas.

## Verificação

Passaram o check.js original, os nove testes Vitest e o build Vite.
Os testes cobrem loading, filtros e foco, ordenação e seleção, detalhe,
HTML escapado, HTTP 404 e nova tentativa, JSON inválido (incluindo fallback HTML),
resposta não array, falha de rede, lista vazia e alteração direta de query.
Os pedidos dos testes são simulados. No navegador foram confirmados os oito
produtos, pesquisa gaming, filtro gaming, ordenação ascendente e detalhe.
Para repetir manualmente: pesquisar, mudar categoria, ordenar, selecionar e limpar.
No Vue DevTools, alterar query também deve atualizar a lista.

## Perguntas de reflexão

1. **O que desapareceu do main.js e para onde foi?** O estado passou para refs no script setup de App.vue; render() e a criação manual do DOM deram lugar ao template e à atualização automática do Vue; os handlers passaram para @click e v-model, alterando apenas o estado.
2. **Porquê items.value no script e items no template?** ref devolve um objeto que guarda o valor em .value, permitindo ao Vue acompanhar leituras e escritas; no template, o Vue desembrulha automaticamente os refs de topo.
3. **Porquê visible ser computed?** É um valor derivado e em cache, recalculado quando as dependências mudam; num ref atualizado em cada handler, esquecer uma atualização deixa resultados desatualizados e duplica a lógica de sincronização.
4. **O que evita :key e porquê não usar o índice?** A chave estável permite associar cada item ao seu nó e estado ao reordenar; com índices, o Vue associa por posição e pode reutilizar inputs ou estado de componentes para o item errado.

## Declaração de IA

Foi usado OpenAI Codex em casa para consultar os PDFs, reutilizar os ficheiros
da Ficha 03, preparar a migração para Vue, escrever testes, documentação e
respostas de reflexão e executar verificações. Devo rever e compreender o
código e as respostas antes de entregar e de os explicar no teste.

## Publicar e entregar

Copiar apenas esta pasta para a raiz do mesmo repositório e executar:

```sh
git add twa-ficha04
git commit -m "ficha 04"
git push
```

Não incluir node_modules/ nem dist/ (ignorados no .gitignore).
Entregar no Moodle o URL https://github.com/JP1893/twa-JPM até **20/10/2026, 23:59**
(hora de Lisboa). Se privado, dar acesso a davidmgvaz.
O push e a submissão no Moodle não foram efetuados nesta preparação.
