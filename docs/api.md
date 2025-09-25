# API Documentation - Casa da Pedra

## Visão Geral

O Casa da Pedra utiliza uma arquitetura de API híbrida, combinando:

- **Nuxt 4.1 Server API Routes** para proxies e transformações
- **StarHub Solutions API** como backend principal
- **$fetch** para comunicação HTTP nativa

## Estrutura de APIs

### 1. API Routes do Nuxt (Proxies)

#### Tours API
```typescript
// server/api/tours/[...].ts
GET /api/tours/{id}                    // Buscar tour por ID
GET /api/tours/{id}/availability       // Disponibilidade do tour
GET /api/tours/{id}/pricing            // Preços do tour
GET /api/tours/{id}/slots              // Horários disponíveis
```

#### Products API
```typescript
// server/api/products/[...].ts
GET /api/products                      // Listar produtos
GET /api/products/{id}                 // Buscar produto por ID
GET /api/products/extended             // Produtos estendidos
GET /api/products/extended/{id}        // Produto estendido por ID
```

#### Accommodations API
```typescript
// server/api/accommodations/[...].ts
GET /api/accommodations                // Listar acomodações
GET /api/accommodations/{id}           // Buscar acomodação por ID
GET /api/accommodations/{id}/availability // Disponibilidade
```

#### StarHub Proxy
```typescript
// server/api/starhub/[...].ts
GET /api/starhub/**                    // Proxy geral para StarHub
POST /api/starhub/**                   // Proxy para POST requests
PUT /api/starhub/**                    // Proxy para PUT requests
DELETE /api/starhub/**                 // Proxy para DELETE requests
```

## Endpoints Principais

### Tours

#### Buscar Tour por ID/Slug
```typescript
GET /api/tours/{idOrSlug}

// Resposta
{
  "data": {
    "id": "uuid",
    "slug": "tour-slug",
    "name": "Nome do Tour",
    "description": "Descrição",
    "price": 150.00,
    "duration": "4 horas",
    "capacity": 20,
    "images": ["url1", "url2"],
    "features": ["feature1", "feature2"],
    "availability": {
      "status": "available",
      "nextAvailable": "2024-01-15"
    }
  }
}
```

#### Disponibilidade do Tour
```typescript
GET /api/tours/{id}/availability?year=2024&month=1

// Resposta
{
  "data": [
    "2024-01-15",
    "2024-01-16",
    "2024-01-17"
  ]
}
```

#### Preços do Tour
```typescript
GET /api/tours/{id}/pricing?date=2024-01-15&adults=2&children=1

// Resposta
{
  "data": {
    "adult_price": 150.00,
    "child_price": 75.00,
    "subtotal": 375.00,
    "taxes": 0.00,
    "fees": 0.00,
    "total": 375.00,
    "currency": "BRL"
  }
}
```

### Products/Accommodations

#### Buscar Produto por ID/Slug
```typescript
GET /api/products/extended/{idOrSlug}

// Resposta
{
  "data": {
    "id": "uuid",
    "slug": "accommodation-slug",
    "name": "Nome da Acomodação",
    "description": "Descrição",
    "price": 200.00,
    "type": "hotel",
    "amenities": ["wifi", "pool", "gym"],
    "images": ["url1", "url2"],
    "location": {
      "address": "Endereço",
      "city": "Cidade",
      "state": "Estado",
      "coordinates": {
        "lat": -22.9068,
        "lng": -43.1729
      }
    },
    "policies": {
      "checkin": "14:00",
      "checkout": "12:00",
      "minNights": 1,
      "maxNights": 30
    }
  }
}
```

#### Disponibilidade da Acomodação
```typescript
GET /api/accommodations/{id}/availability?from=2024-01-15&to=2024-01-20

// Resposta
{
  "data": {
    "available": true,
    "nights": 5,
    "rates": [
      {
        "date": "2024-01-15",
        "rate": 200.00,
        "available": true
      },
      {
        "date": "2024-01-16",
        "rate": 200.00,
        "available": true
      }
    ]
  }
}
```

## Composables de API

### useAvailability

```typescript
// composables/useAvailability.ts
export function useAvailability(type: 'tour' | 'stay', idOrUuid: string) {
  const { getMonth, getRange, getSlots, isDateAvailable } = useAvailability(type, idOrUuid)
  
  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getMonth,
    getRange,
    getSlots,
    isDateAvailable,
    clearCache
  }
}
```

### usePricing

```typescript
// composables/usePricing.ts
export function usePricing(type: 'tour' | 'stay', idOrUuid: string) {
  const { getPricing, calculateNights, formatPrice } = usePricing(type, idOrUuid)
  
  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getPricing,
    calculateNights,
    formatPrice,
    clearCache
  }
}
```

## Autenticação

### Headers de Autenticação

```typescript
// Configuração automática nos proxies
headers: {
  'Content-Type': 'application/json',
  'x-starhub-token': 'e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca'
}
```

### Configuração de Runtime

```typescript
// nuxt.config.ts
runtimeConfig: {
  starhubSecret: process.env.STARHUB_SECRET || '',
  public: {
    starhubBase: 'https://api.starhubsolutions.com/v1'
  }
}
```

## Tratamento de Erros

### Estrutura de Erro Padrão

```typescript
{
  "error": {
    "code": "TOUR_NOT_FOUND",
    "message": "Tour não encontrado",
    "details": "O tour com ID 'uuid' não foi encontrado",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Códigos de Erro Comuns

- `TOUR_NOT_FOUND` (404) - Tour não encontrado
- `ACCOMMODATION_NOT_FOUND` (404) - Acomodação não encontrada
- `AVAILABILITY_ERROR` (500) - Erro na disponibilidade
- `PRICING_ERROR` (500) - Erro no cálculo de preços
- `VALIDATION_ERROR` (400) - Erro de validação
- `AUTHENTICATION_ERROR` (401) - Erro de autenticação

## Cache e Performance

### Cache de Disponibilidade

```typescript
// Cache por mês para tours
const availabilityCache = ref<Map<string, AvailabilityMonth>>(new Map())

// Cache por data para slots
const timeSlotsCache = ref<Map<string, TimeSlot[]>>(new Map())
```

### Cache de Preços

```typescript
// Cache baseado em parâmetros
const pricingCache = ref<Map<string, PricingBreakdown>>(new Map())
```

## Rate Limiting

### Configuração de Rate Limit

```typescript
// server/api/[...].ts
export default defineEventHandler(async (event) => {
  // Implementar rate limiting se necessário
  const rateLimit = await checkRateLimit(event)
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests'
    })
  }
  
  // Continuar com a requisição
})
```

## Monitoramento

### Logs de API

```typescript
// Logging automático
console.log(`API Request: ${method} ${path}`)
console.log(`API Response: ${statusCode} ${statusMessage}`)
```

### Métricas

- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erro por endpoint
- **Cache Hit Rate**: Taxa de acerto do cache
- **Request Volume**: Volume de requisições

## Testes

### Testes de API

```typescript
// tests/api/tours.test.ts
describe('Tours API', () => {
  test('should fetch tour by ID', async () => {
    const response = await $fetch('/api/tours/test-id')
    expect(response.data).toBeDefined()
    expect(response.data.id).toBe('test-id')
  })
})
```

### Mock de APIs

```typescript
// tests/mocks/api.ts
export const mockTourResponse = {
  data: {
    id: 'test-id',
    name: 'Test Tour',
    price: 150.00
  }
}
```

## Documentação Interativa

### Swagger/OpenAPI

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Casa da Pedra API
  version: 1.0.0
paths:
  /api/tours/{id}:
    get:
      summary: Buscar tour por ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tour encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Tour'
```

## Segurança

### Validação de Entrada

```typescript
// Validação de parâmetros
const { id } = getRouterParam(event, 'id')
if (!id || !isValidUUID(id)) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid ID format'
  })
}
```

### Sanitização

```typescript
// Sanitização de dados
const sanitizedData = sanitizeInput(data)
```

### CORS

```typescript
// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://casadapedra.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```