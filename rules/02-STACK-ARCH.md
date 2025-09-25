# Stack e Arquitetura

## Stack Oficial
- **Nuxt 4.1** com SSR/SSG habilitado
- **Vue 3** Composition API
- **CSS puro** (sem Tailwind)
- **TypeScript** para tipagem

## Composables
- `useAvailability` - disponibilidade de tours/stays
- `usePricing` - cálculo de preços
- `useFeatured` - dados em destaque
- `useListing` - listagens paginadas
- `useStarhubApi` - cliente base da API

## Estado (Pinia)
- **Carrinho** - itens selecionados
- **Idioma** - i18n ativo
- **Auth** - autenticação do usuário

## Server API (Nitro)
- **Proxies** em `/server/api` para StarHub
- **Headers obrigatórios**: `x-starhub-token`
- **Cache leve** para performance
- **Tratamento de erros** padronizado

## Estrutura de Pastas
```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Roteamento automático
├── layouts/       # Layouts da aplicação
├── composables/   # Lógica reutilizável
├── stores/        # Estado global (Pinia)
├── server/api/    # Proxies para StarHub
└── locales/       # Arquivos de tradução
```

## Configuração Nuxt
- **SSR/SSG** habilitado
- **File-based routing**
- **Auto-imports** de composables
- **TypeScript** estrito
- **i18n** configurado
