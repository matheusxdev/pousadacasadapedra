# Contratos da API StarHub

## Base URL e Headers
- **Base**: `https://api.starhubsolutions.com/v1`
- **Headers obrigatórios**:
  - `x-starhub-token`: token de autenticação
  - `Content-Type: application/json`

## Endpoints Principais

### Tours
- `GET /tours` - listagem de tours
- `GET /tours/{id}` - detalhes do tour
- `GET /tours/{id}/availability` - disponibilidade mensal
- `GET /tours/{id}/pricing` - cálculo de preços

### Accommodations (Stays)
- `GET /products/extended?type=accommodation` - listagem de acomodações
- `GET /products/extended/{id}` - detalhes da acomodação
- `GET /products/extended/{id}/availability` - disponibilidade
- `GET /products/extended/{id}/pricing` - cálculo de preços

## Formato de Dados

### Datas
- **Formato**: ISO (YYYY-MM-DD)
- **Timezone**: UTC

### Normalização para Frontend

#### Tour/Stay
```typescript
interface FeaturedItem {
  id: string
  uuid: string
  slug?: string
  title: string
  subtitle: string // location
  description: string
  images: string[]
  rating?: number
  reviewsCount?: number
  price: number
  current_price?: number
  original_price?: number
  category: string
  location: string
  duration?: string
  max_people?: number
  min_people?: number
  type: 'tour' | 'stay'
}
```

#### Availability
```typescript
interface DayAvailability {
  date: string // YYYY-MM-DD
  status: 'available' | 'unavailable' | 'partial'
  minNights?: number // para stays
}
```

#### Pricing
```typescript
interface PricingBreakdown {
  base: number
  adult: number
  child: number
  taxes: number
  fees: number
  discounts: number
  total: number
  breakdown: {
    subtotal: number
    taxes: number
    fees: number
    total: number
  }
}
```

## Paginação
- **Parâmetros**: `page`, `limit`
- **Resposta**: sempre com metadados de paginação
- **Padrão**: `limit=12` para listagens

## Regras
- **Sem endpoints inventados**
- **Consulte /docs** quando em dúvida
- **Tratamento de erros** padronizado
- **Cache** quando apropriado
