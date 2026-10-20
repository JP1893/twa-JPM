Ficha 04 — Catálogo em Vue

Como correr

É necessário ter Node.js e npm instalados. Dentro da pasta twa-ficha04:

npm install
npm run dev

Para executar os testes e gerar o build:

npm test
npm run build

Funcionalidades

Carregamento dos produtos a partir de items.json, com mensagem de erro e botão para tentar novamente.

Pesquisa por nome ou tag e filtro por categoria.

Ordenação por preço, crescente ou decrescente.

Seleção de um produto para consultar preço, tags, marca e garantia.

Contador de resultados e botão para limpar a pesquisa.

Foram reutilizados catalog.js, items.json e check.js da Ficha 03. A interface está em App.vue, com refs, computed e CSS scoped.

Perguntas de reflexão

O que desapareceu do main.js da Ficha 03 e para onde foi cada parte? O estado passou para refs no App.vue. O render() foi substituído pelo template e pelas atualizações automáticas do Vue. Os handlers passaram para @click e v-model.

Porque se escreve items.value no script e items no template? No script, o valor de um ref é acedido através de .value. No template, o Vue faz esse acesso automaticamente.

Porque é visible um computed e não um ref atualizado em cada handler? Porque depende dos produtos, da pesquisa, da categoria e da ordenação. O computed acompanha essas dependências; com um ref, esquecer uma atualização num handler podia deixar a lista desatualizada.

O que evita ? E se usarmos o índice numa lista que reordena? Uma chave estável identifica cada item durante as atualizações. Com o índice, a chave identifica a posição, podendo fazer com que o estado de um elemento seja associado ao produto errado após reordenar.
