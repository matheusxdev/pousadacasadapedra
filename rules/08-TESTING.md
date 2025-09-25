# Testing - Checklist Manual

## Checklist por Entrega

### Home Page
- [ ] **Cards alinhados** na seção Destaques
- [ ] **Hero Slider**: autoplay + setas + dots funcionando
- [ ] **Category Cards**: ícone não some no hover
- [ ] **Responsive**: grid adapta corretamente
- [ ] **Loading states**: skeleton durante carregamento
- [ ] **Error states**: mensagem + botão retry

### Lista de Tours (/tours)
- [ ] **Filtros funcionais**: busca, local, categoria, preço
- [ ] **Grid consistente**: mesmo layout da home
- [ ] **Paginação**: navegação entre páginas
- [ ] **Cards**: FeaturedCard com dados corretos
- [ ] **Estados**: loading, error, empty
- [ ] **Links**: navegação para detalhes funciona

### Lista de Acomodações (/accommodations)
- [ ] **Filtros funcionais**: busca, tipo, local, preço
- [ ] **Grid consistente**: mesmo layout da home
- [ ] **Paginação**: navegação entre páginas
- [ ] **Cards**: FeaturedCard com dados corretos
- [ ] **Estados**: loading, error, empty
- [ ] **Links**: navegação para detalhes funciona

### Página de Tour (/tours/[slug])
- [ ] **Calendário**: escolher um dia disponível
- [ ] **Pricing**: soma correta dos preços
- [ ] **Participantes**: controles funcionais
- [ ] **Price Summary**: breakdown detalhado
- [ ] **Botão Reservar**: habilitado quando válido
- [ ] **Breadcrumb**: navegação correta
- [ ] **Responsive**: layout adapta para mobile

### Página de Acomodação (/accommodations/[slug])
- [ ] **Range picker**: selecionar check-in/checkout
- [ ] **Mínimo de noites**: bloqueia checkout inválido
- [ ] **Preço total**: cálculo correto por noites
- [ ] **Participantes**: controles funcionais
- [ ] **Amenities**: lista completa
- [ ] **Políticas**: informações claras
- [ ] **Botão Reservar**: habilitado quando válido

### Funcionalidades Gerais
- [ ] **Erros de rota**: não ocorrem (links usam named routes)
- [ ] **i18n**: todas as strings traduzidas
- [ ] **Loading**: skeleton em todas as páginas
- [ ] **Error handling**: mensagens amigáveis
- [ ] **Empty states**: quando não há resultados
- [ ] **Responsive**: funciona em mobile/tablet/desktop
- [ ] **Performance**: carregamento rápido
- [ ] **SEO**: meta tags dinâmicas

### API Integration
- [ ] **Endpoints reais**: sem dados mockados
- [ ] **Headers corretos**: x-starhub-token incluído
- [ ] **Error handling**: tratamento de 404/500
- [ ] **Cache**: quando apropriado
- [ ] **Retry**: em caso de erro de rede

## Testes Unitários (Futuro)
- [ ] **Composables**: useFeatured, useAvailability, usePricing
- [ ] **Components**: FeaturedCard, HeroSlider, CalendarAvailability
- [ ] **Utils**: formatters, validators
- [ ] **Stores**: cart, auth, language

## Testes E2E (Futuro)
- [ ] **Fluxo completo**: home → lista → detalhes → reserva
- [ ] **Filtros**: funcionamento em todas as páginas
- [ ] **Paginação**: navegação entre páginas
- [ ] **Responsive**: em diferentes dispositivos
- [ ] **Performance**: tempo de carregamento
