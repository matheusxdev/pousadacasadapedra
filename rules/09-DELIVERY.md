# Delivery - Entrega e Commits

## Commits Pequenos
- **Máximo 3 arquivos** por commit
- **Mensagem clara**: `feat(scope): descrição`
- **Atômico**: uma funcionalidade por commit
- **Exemplos**:
  - `feat(home): hero slider autoplay + setas`
  - `fix(tours): correção do calendário de disponibilidade`
  - `style(cards): alinhamento de botões com margin-top auto`
  - `feat(api): proxy para endpoint de pricing`

## Changelog
- **Atualizar** `/CHANGELOG.md` a cada entrega
- **Formato**: data + versão + mudanças
- **Seções**: Added, Changed, Fixed, Removed
- **Exemplo**:
  ```markdown
  ## [0.2.0] - 2024-01-15
  
  ### Added
  - Hero slider com autoplay e navegação
  - Páginas de tours e acomodações
  - Integração completa com API StarHub
  
  ### Changed
  - Migração para Nuxt 4.1
  - Componentes usando CSS puro (sem Tailwind)
  
  ### Fixed
  - Alinhamento de cards na home
  - Navegação entre páginas
  ```

## Quando Parar e Perguntar
- **Endpoint não existe** no contrato da API
- **Dados não casam** com a UI esperada
- **Funcionalidade ambígua** ou não especificada
- **Mudança arquitetural** não solicitada
- **Refactor grande** sem pedido explícito

## Não Inventar
- **Dados**: sempre usar API real
- **Endpoints**: consultar /docs quando em dúvida
- **Funcionalidades**: implementar apenas o solicitado
- **Design**: seguir especificações existentes
- **Arquitetura**: manter consistência

## Processo de Entrega
1. **Implementar** funcionalidade solicitada
2. **Testar** manualmente (checklist)
3. **Commit** com mensagem clara
4. **Atualizar** changelog
5. **Verificar** se não há erros de linting
6. **Confirmar** que servidor está rodando

## Exemplos de Prompts
### Hero Slider
> "Use Context = 7. Leia /rules/00-INDEX.md e respeite todas as regras. Implemente src/components/HeroSlider.vue conforme 04-UI-UX e 05-COMPONENTS. Use CSS puro (BEM). Sem Tailwind. Só edite esse arquivo e, se necessário, crie src/components/HeroSlide.vue. Não altere rotas. Teste setas, dots e autoplay."

### Destaques
> "Use Context = 7. Leia /rules/00-INDEX.md e respeite todas as regras. Em src/pages/index.vue, renderize a seção Destaques como em 06-FEATURES (passeios + pousadas, aleatório), CTA 'Ver todos os passeios →'. Consuma /server/api/tours e /server/api/accommodations (proxies). Grids iguais às outras seções."

### Página de Passeio
> "Use Context = 7. Leia /rules/00-INDEX.md e respeite todas as regras. Em src/pages/tours/[slug].vue, integrar CalendarAvailability (dia único) e PriceSummary com as rotas de availability/pricing. Respeitar 06-FEATURES. Sem mudar design global."

### Página de Pousada
> "Use Context = 7. Leia /rules/00-INDEX.md e respeite todas as regras. Em src/pages/accommodations/[slug].vue, ativar range (check-in/checkout) com mínimo de noites. Bloqueie check-out inválido. Preço final via pricing da API (quando houver)."

## Dicas Anti-Alucinação
- **"Se faltar endpoint, pare e pergunte; não inventar."** (Regra 01)
- **"Dados e contratos sempre conforme /docs"** (Regra 03)
- **"Respeitar Nuxt 4.1 e arquitetura oficial, composables, server/api proxies."** (Regra 02)
- **"Não apagar arquivos/rotas existentes; sem refactor grande sem pedido."** (Regra 01)
