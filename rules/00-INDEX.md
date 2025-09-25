# Regras do Projeto – Casa da Pedra (Nuxt 4.1)

## Stack Oficial
- **Nuxt 4.1**, Vue 3 (Composition API), CSS puro
- **Design System**: próprio (sem Tailwind)
- **API**: StarHub — usar rotas/contratos em `/docs` (fonte de verdade)
- **Arquitetura**: composables, Pinia, server/api proxies, SSR/SSG

## Regras Fundamentais
- **NUNCA** recriar projeto, apagar pastas/rotas/arquivos existentes
- **Use Context 7** (sempre)
- **Ler antes de codar** os arquivos abaixo

## Documentação Obrigatória
1. **01-GUARDRAILS.md** - regras rígidas
2. **02-STACK-ARCH.md** - Nuxt 4.1 + arquitetura
3. **03-API-CONTRACTS.md** - rotas e normalização
4. **04-UI-UX.md** - layout, grids, espaçamentos, acessibilidade
5. **05-COMPONENTS.md** - cards, hero slider, calendar
6. **06-FEATURES.md** - Destaques, Listas, Páginas de produto/pousada
7. **07-CONVENTIONS.md** - i18n, BEM, imports, nome de arquivos
8. **08-TESTING.md** - checklist manual e unit
9. **09-DELIVERY.md** - commits pequenos, changelog

## Entrega Padrão por Tarefa
- **1–3 arquivos alterados** no máx.
- **Commit atômico** com mensagem clara
- **Se faltar dado/endpoint**, pare e pergunte (não alucinar)

## Como Pedir Implementações
Sempre comece com:
> "Use Context = 7. Leia /rules/00-INDEX.md e respeite todas as regras."

## Status Atual
✅ **Projeto migrado para Nuxt 4.1**  
✅ **API StarHub integrada**  
✅ **Todas as páginas funcionais**  
✅ **Componentes implementados**  
✅ **Servidor rodando na porta 3000**
