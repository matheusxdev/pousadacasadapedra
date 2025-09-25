# Features - Casa da Pedra

## Visão Geral das Funcionalidades

O Casa da Pedra oferece uma plataforma completa para reservas de turismo e hospedagem, com foco em experiência do usuário e funcionalidades modernas.

## Funcionalidades Principais

### 1. Sistema de Reservas

#### Tours (Passeios)
- **Seleção de Data**: Calendário interativo com disponibilidade
- **Horários**: Slots de horário disponíveis (manhã/tarde)
- **Participantes**: Controle de adultos e crianças
- **Preços Dinâmicos**: Cálculo automático baseado em data e participantes
- **Validação**: Verificação de capacidade e disponibilidade

#### Acomodações (Hospedagem)
- **Check-in/Check-out**: Seleção de datas de entrada e saída
- **Número de Noites**: Cálculo automático de estadia
- **Políticas**: Respeito a políticas de mínimo/máximo de noites
- **Preços por Noite**: Cálculo baseado em tarifas diárias
- **Disponibilidade**: Verificação de disponibilidade no período

### 2. Sistema de Calendário

#### CalendarAvailability Component
- **Modo Tour**: Seleção de data única
- **Modo Stay**: Seleção de intervalo de datas
- **Estados Visuais**: Disponível, indisponível, selecionado, em intervalo
- **Navegação por Teclado**: Suporte completo a acessibilidade
- **Indicadores**: Dots para disponibilidade parcial
- **Validação**: Regras de mínimo/máximo de noites

#### Funcionalidades do Calendário
```typescript
// Estados do calendário
type CalendarState = 
  | 'unavailable'      // Data indisponível
  | 'available'         // Data disponível
  | 'selected-start'    // Data de início selecionada
  | 'selected-end'      // Data de fim selecionada
  | 'in-range'          // Data dentro do intervalo
  | 'blocked-by-rule'   // Bloqueada por regra
```

### 3. Sistema de Preços

#### PriceSummary Component
- **Breakdown Detalhado**: Preços por adulto/criança
- **Taxas e Impostos**: Cálculo de taxas adicionais
- **Descontos**: Aplicação de descontos automáticos
- **Total Final**: Cálculo do valor total
- **Moeda**: Suporte a múltiplas moedas (BRL, USD, EUR)

#### Cálculo de Preços
```typescript
// Estrutura de preços
interface PricingBreakdown {
  adults: {
    count: number
    pricePerPerson: number
    total: number
  }
  children: {
    count: number
    pricePerPerson: number
    total: number
  }
  subtotal: number
  taxes: number
  fees: number
  discount?: {
    amount: number
    percentage: number
    reason: string
  }
  total: number
  currency: string
}
```

### 4. Internacionalização (i18n)

#### Idiomas Suportados
- **Português (pt)**: Idioma padrão
- **Inglês (en)**: Tradução completa
- **Espanhol (es)**: Tradução completa

#### Funcionalidades i18n
- **Roteamento por Idioma**: URLs com prefixo de idioma
- **Detecção Automática**: Detecção do idioma do navegador
- **Persistência**: Salvar idioma selecionado
- **Fallback**: Idioma padrão quando tradução não existe

#### Estrutura de Tradução
```json
{
  "common": {
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "cancel": "Cancelar",
    "confirm": "Confirmar"
  },
  "tours": {
    "title": "Passeios",
    "bookNow": "Reservar Agora",
    "selectDate": "Selecionar Data",
    "selectTime": "Selecionar Horário"
  }
}
```

### 5. Sistema de Navegação

#### Roteamento Inteligente
- **Slug First**: Prioridade para URLs amigáveis
- **UUID Fallback**: Fallback para UUIDs quando slug não existe
- **404 Handling**: Páginas de erro personalizadas
- **SEO Friendly**: URLs otimizadas para SEO

#### Estrutura de Rotas
```typescript
// Rotas principais
/tours/{slug}           // Detalhes do tour
/accommodations/{slug}  // Detalhes da acomodação
/booking               // Página de reserva
/profile               // Perfil do usuário
/login                 // Login
/register              // Registro
```

### 6. Sistema de Estado (Pinia)

#### Stores Principais
- **authStore**: Autenticação e sessão do usuário
- **cartStore**: Carrinho de compras e reservas
- **languageStore**: Idioma selecionado
- **localeStore**: Configurações de localização

#### Estrutura do Store
```typescript
// Exemplo: cartStore
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((sum, item) => sum + item.total, 0))
  
  const addItem = (item: CartItem) => {
    items.value.push(item)
  }
  
  const removeItem = (id: string) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }
  
  return { items, total, addItem, removeItem }
})
```

### 7. Sistema de Componentes

#### Componentes de UI
- **Button**: Botões com estados e variantes
- **Input**: Campos de entrada com validação
- **Select**: Seletores com busca
- **Card**: Cards de conteúdo
- **Calendar**: Calendário de disponibilidade

#### Componentes de Layout
- **NavHeader**: Cabeçalho de navegação
- **Footer**: Rodapé da aplicação
- **ErrorBoundary**: Tratamento de erros
- **ErrorPage**: Páginas de erro

#### Componentes de Negócio
- **FeaturedCard**: Card de item em destaque
- **FeaturedSection**: Seção de itens em destaque
- **SearchBar**: Barra de busca
- **ListingCard**: Card de listagem
- **PriceSummary**: Resumo de preços

### 8. Sistema de Busca

#### Funcionalidades de Busca
- **Busca por Texto**: Pesquisa em nome e descrição
- **Filtros**: Filtros por tipo, preço, localização
- **Ordenação**: Ordenação por relevância, preço, data
- **Sugestões**: Sugestões automáticas de busca

#### Componente SearchBar
```typescript
// Funcionalidades da busca
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)

const performSearch = async () => {
  isLoading.value = true
  try {
    const results = await $fetch('/api/search', {
      query: { q: searchQuery.value }
    })
    searchResults.value = results.data
  } finally {
    isLoading.value = false
  }
}
```

### 9. Sistema de Imagens

#### Nuxt Image Integration
- **Otimização Automática**: Redimensionamento e compressão
- **Lazy Loading**: Carregamento sob demanda
- **WebP/AVIF**: Formatos modernos de imagem
- **Responsive**: Imagens responsivas

#### Configuração de Imagens
```typescript
// nuxt.config.ts
modules: ['@nuxt/image']

// Uso em componentes
<NuxtImg
  src="/images/tour.jpg"
  alt="Tour description"
  width="400"
  height="300"
  loading="lazy"
  format="webp"
/>
```

### 10. Sistema de Acessibilidade

#### Funcionalidades de Acessibilidade
- **Navegação por Teclado**: Suporte completo a teclado
- **Screen Readers**: Compatibilidade com leitores de tela
- **ARIA Labels**: Labels descritivos para elementos
- **Contraste**: Contraste adequado de cores
- **Foco Visível**: Indicadores de foco claros

#### Implementação de Acessibilidade
```typescript
// Exemplo: Navegação por teclado no calendário
const handleKeydown = (event: KeyboardEvent, day: CalendarDay) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectDay(day)
      break
    case 'ArrowLeft':
      navigateToDay(day, -1)
      break
    case 'ArrowRight':
      navigateToDay(day, 1)
      break
  }
}
```

### 11. Sistema de Performance

#### Otimizações de Performance
- **Code Splitting**: Divisão automática de código
- **Lazy Loading**: Carregamento sob demanda
- **Caching**: Cache de APIs e componentes
- **Preloading**: Pré-carregamento de recursos críticos

#### Métricas de Performance
- **Core Web Vitals**: LCP, FID, CLS
- **Lighthouse Score**: Pontuação de performance
- **Bundle Size**: Análise de tamanho do bundle
- **Load Time**: Tempo de carregamento

### 12. Sistema de Responsividade

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Design Responsivo
- **Mobile First**: Design focado em mobile
- **Flexible Grid**: Grid flexível
- **Responsive Images**: Imagens responsivas
- **Touch Friendly**: Interface amigável ao toque

### 13. Sistema de Validação

#### Validação de Formulários
- **Validação em Tempo Real**: Validação durante digitação
- **Mensagens de Erro**: Mensagens claras e úteis
- **Validação de Servidor**: Validação no backend
- **Sanitização**: Limpeza de dados de entrada

#### Exemplo de Validação
```typescript
// Validação de formulário
const validateForm = (data: FormData) => {
  const errors: Record<string, string> = {}
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email inválido'
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Telefone inválido'
  }
  
  return errors
}
```

### 14. Sistema de Notificações

#### Tipos de Notificação
- **Success**: Confirmações de sucesso
- **Error**: Mensagens de erro
- **Warning**: Avisos importantes
- **Info**: Informações gerais

#### Implementação de Notificações
```typescript
// Sistema de notificações
const notifications = ref<Notification[]>([])

const addNotification = (notification: Notification) => {
  notifications.value.push(notification)
  setTimeout(() => {
    removeNotification(notification.id)
  }, 5000)
}
```

### 15. Sistema de Analytics

#### Métricas Coletadas
- **Page Views**: Visualizações de página
- **User Interactions**: Interações do usuário
- **Conversion Rates**: Taxas de conversão
- **Performance Metrics**: Métricas de performance

#### Implementação de Analytics
```typescript
// Tracking de eventos
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  if (process.client) {
    // Enviar para serviço de analytics
    analytics.track(eventName, properties)
  }
}
```

## Roadmap de Funcionalidades

### Próximas Funcionalidades
- **Sistema de Pagamento**: Integração com gateways de pagamento
- **Chat em Tempo Real**: Suporte ao cliente via chat
- **Sistema de Avaliações**: Avaliações e comentários
- **Programa de Fidelidade**: Sistema de pontos e recompensas
- **Notificações Push**: Notificações em tempo real
- **Modo Offline**: Funcionalidade offline básica
- **PWA**: Progressive Web App
- **Integração com Redes Sociais**: Login social e compartilhamento
