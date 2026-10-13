# Ficha 03 — Catálogo no browser

Página do catálogo da Ficha 02, agora com Vite e JavaScript no browser.

## Como correr

Requer Node.js 22 e npm. Na pasta `twa-ficha03`:

```bash
npm install
npm run dev
```

Abrir o endereço indicado pelo Vite (normalmente `http://localhost:5173`).

Para executar os testes das funções puras:

```bash
node check.js
```

## O que está feito

- Produtos carregados de `public/items.json` com `fetch`, `async/await` e tratamento de erros.
- Estados `loading`, `error` e `ready`, com botão **Tentar de novo** em caso de erro.
- Pesquisa pelo nome ou tags, filtro por categoria e ordenação por preço.
- Clique num produto para ver o detalhe (incluindo tags, marca e garantia).
- DOM criado com `createElement` e `textContent`, sem `innerHTML`.
- Nova função pura `sortByPrice()` e testes em `check.js`.
- Delegação de eventos no `#list`.

## Utilização de IA

Foi utilizado o ChatGPT, fora da aula, como apoio na preparação do código e dos testes. O código deve ser revisto e compreendido antes da entrega.
