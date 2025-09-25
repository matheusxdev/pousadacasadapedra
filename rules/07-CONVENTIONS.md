# Convenções do Projeto

## i18n (Internacionalização)
- **Chaves estruturadas**: `home.featured.title`, `home.featured.subtitle`
- **Arquivos**: `locales/pt.json`, `locales/en.json`, `locales/es.json`
- **Uso**: `{{ $t('common.viewDetails') }}`
- **Chaves obrigatórias**:
  - `home.featured.title`
  - `home.featured.subtitle`
  - `home.featured.viewAllTours`
  - `common.viewDetails`
  - `common.from`
  - `common.perNight`
  - `common.reserveNow`

## CSS BEM (Block Element Modifier)
- **Formato**: `.block__element--modifier`
- **Exemplos**:
  - `.fcard` (block)
  - `.fcard__title` (element)
  - `.fcard__title--large` (modifier)
- **Nomenclatura**: kebab-case para classes
- **Aninhamento**: máximo 2 níveis

## Imports
- **Composables**: `~/composables/useFeatured`
- **Stores**: `~/stores/cart`
- **Components**: `@/components/FeaturedCard`
- **Utils**: `@/utils/formatters`
- **Evitar**: `~` em imports (preferir `@/`)

## Rotas Nomeadas
- **Tours**: `tours-slug` → `/tours/[slug]`
- **Stays**: `accommodations-slug` → `/accommodations/[slug]`
- **Uso**: `{ name: 'tours-slug', params: { slug: 'city-tour' } }`

## Fetch e API
- **Client**: `useFetch` ou `$fetch`
- **Server**: proxies em `/server/api`
- **Headers**: sempre incluir `x-starhub-token`
- **Error handling**: try/catch com mensagens amigáveis

## TypeScript
- **Sem `any`**: sempre tipar props/retornos
- **Interfaces**: definir para dados da API
- **Props**: usar `defineProps<Interface>()`
- **Emits**: usar `defineEmits<{event: [payload]}>()`

## Nomenclatura de Arquivos
- **Componentes**: PascalCase (`FeaturedCard.vue`)
- **Páginas**: kebab-case (`tours/[slug].vue`)
- **Composables**: camelCase (`useFeatured.ts`)
- **Stores**: camelCase (`useCartStore.ts`)
- **Utils**: camelCase (`formatters.ts`)

## Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── FeaturedCard.vue
│   ├── HeroSlider.vue
│   └── CalendarAvailability.vue
├── pages/               # Roteamento automático
│   ├── index.vue
│   ├── tours/
│   │   ├── index.vue
│   │   └── [slug].vue
│   └── accommodations/
│       ├── index.vue
│       └── [slug].vue
├── composables/         # Lógica reutilizável
│   ├── useFeatured.ts
│   ├── useAvailability.ts
│   └── usePricing.ts
├── stores/              # Estado global
│   └── cart.ts
├── server/api/          # Proxies para StarHub
│   ├── tours.ts
│   └── accommodations.ts
└── locales/             # Traduções
    ├── pt.json
    ├── en.json
    └── es.json
```

## Commits
- **Formato**: `feat(scope): descrição`
- **Exemplos**:
  - `feat(home): hero slider autoplay + setas`
  - `fix(tours): correção do calendário de disponibilidade`
  - `style(cards): alinhamento de botões com margin-top auto`
