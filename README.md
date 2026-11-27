# Travel Blog (nome provisório)

Blog de viagens multidestino em Astro + Sanity. Ver a especificação do projeto.

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

## Pasta `_migration-reference/`

Conteúdo e componentes específicos do antigo Cappadocia.guide (estações, "plan your trip", cards de viagem, FAQ da home, imagens). Fica fora do build e serve de referência para a migração (etapa 10: `featuredGroups`, `bookingSection`). Apagar depois da migração.

## Sanity Studio (`/studio`)

Studio e schemas do projeto Sanity (`ravcarwx`, dataset `production`).

```bash
cd studio
npm install
npm run dev      # http://localhost:3333
npm run deploy   # publica o Studio em <nome>.sanity.studio (exige `npx sanity login`)
```

Tipos: Country, Destination, Post (corpo único em Portable Text), Category, Author e SiteSettings (os dois últimos são singletons). O front-end (`src/lib/sanity.ts`) ainda lê o modelo antigo de seções e é reescrito na etapa 4.
