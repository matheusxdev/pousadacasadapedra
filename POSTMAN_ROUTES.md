# 🚀 Rotas da API StarHub - Postman

## 📋 Configuração Base

### Headers Obrigatórios:
```
x-starhub-token: SEU_TOKEN_AQUI
Content-Type: application/json
```

⚠️ **IMPORTANTE**: Substitua `SEU_TOKEN_AQUI` pelo seu token real da API StarHub.

### Base URL:
```
https://api.starhubsolutions.com/v1
```

---

## 🎯 Rotas Principais para Testar

### 1. **Listar Tours/Passeios**
```
GET /tours?limit=10&page=1
```

**Parâmetros opcionais:**
- `limit`: 1-100 (padrão: 10)
- `page`: número da página (padrão: 1)
- `category`: filtrar por categoria
- `location`: filtrar por localização
- `min_price`: preço mínimo
- `max_price`: preço máximo
- `search`: busca por texto

**Exemplo completo:**
```
GET /tours?limit=5&category=passeio&location=Búzios&min_price=100&max_price=500
```

### 2. **Detalhes de um Tour**
```
GET /tours/{id}
```

**Exemplo:**
```
GET /tours/3
```

### 3. **Detalhes Completos de um Tour**
```
GET /tours/{id}/details
```

**Exemplo:**
```
GET /tours/3/details
```

### 4. **Preços e Políticas**
```
GET /tours/{id}/pricing?date=2025-01-20
```

**Parâmetros:**
- `date`: data específica (opcional)

**Exemplo:**
```
GET /tours/3/pricing?date=2025-01-20
```

### 5. **Datas Disponíveis**
```
GET /tours/{id}/availability?year=2025&month=1
```

**Parâmetros obrigatórios:**
- `year`: ano (2020-2030)
- `month`: mês (1-12)

**Exemplo:**
```
GET /tours/3/availability?year=2025&month=9
```

### 6. **Disponibilidade Detalhada**
```
GET /tours/{id}/availability/detailed?start_date=2025-01-20&end_date=2025-01-30
```

**Parâmetros obrigatórios:**
- `start_date`: data inicial (YYYY-MM-DD)
- `end_date`: data final (YYYY-MM-DD)

**Exemplo:**
```
GET /tours/3/availability/detailed?start_date=2025-01-20&end_date=2025-01-30
```

### 7. **Verificar Disponibilidade Específica**
```
GET /tours/{id}/availability/check?date=2025-01-20&adults=2&children=1
```

**Parâmetros obrigatórios:**
- `date`: data desejada (YYYY-MM-DD)
- `adults`: número de adultos (mínimo: 1)

**Parâmetros opcionais:**
- `children`: número de crianças (padrão: 0)

**Exemplo:**
```
GET /tours/3/availability/check?date=2025-01-20&adults=2&children=1
```

### 8. **Calcular Preço Total**
```
GET /tours/{id}/calculate-price?date=2025-01-20&adults=2&children=1
```

**Parâmetros obrigatórios:**
- `date`: data desejada (YYYY-MM-DD)
- `adults`: número de adultos (mínimo: 1)

**Parâmetros opcionais:**
- `children`: número de crianças (padrão: 0)

**Exemplo:**
```
GET /tours/3/calculate-price?date=2025-01-20&adults=2&children=1
```

### 9. **Categorias Disponíveis**
```
GET /tours/categories
```

### 10. **Localizações Disponíveis**
```
GET /tours/locations
```

---

## 🏨 Rotas de Reservas

### 11. **Listar Reservas**
```
GET /reservations?page=1&limit=10
```

**Parâmetros opcionais:**
- `page`: número da página
- `limit`: itens por página
- `status`: pending, confirmed, cancelled
- `tour_id`: ID do tour
- `date_from`: data inicial
- `date_to`: data final

### 12. **Criar Nova Reserva**
```
POST /reservations
```

**Body (JSON):**
```json
{
  "tour_id": 3,
  "date": "2025-01-20",
  "adults": 2,
  "children": 1,
  "customer_info": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+55 21 99999-9999"
  },
  "special_requests": "Quarto com vista para o mar"
}
```

### 13. **Buscar Reserva por Código**
```
GET /reservations/{code}
```

**Exemplo:**
```
GET /reservations/SH-12345678
```

### 14. **Atualizar Reserva**
```
PUT /reservations/{code}
```

**Body (JSON):**
```json
{
  "adults": 3,
  "children": 0,
  "customer_name": "João Silva Santos",
  "customer_phone": "+55 21 99999-9999"
}
```

### 15. **Cancelar Reserva**
```
POST /reservations/{code}/cancel
```

**Body (JSON):**
```json
{
  "reason": "Mudança de planos"
}
```

---

## 💳 Rotas de Pagamentos

### 16. **Processar Pagamento**
```
POST /payments/process
```

**Body (JSON):**
```json
{
  "reservation_id": "SH-12345678",
  "payment_method": "credit_card",
  "card_info": {
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123",
    "name": "João Silva"
  }
}
```

### 17. **Verificar Status do Pagamento**
```
GET /payments/{id}/status
```

**Exemplo:**
```
GET /payments/PAY-123456789/status
```

### 18. **Solicitar Reembolso**
```
POST /payments/refund
```

**Body (JSON):**
```json
{
  "reservation_id": "SH-12345678",
  "reason": "Cancelamento do cliente"
}
```

---

## 👥 Rotas de Clientes

### 19. **Criar/Atualizar Cliente**
```
POST /customers
```

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+55 21 99999-9999",
  "document": "123.456.789-00",
  "birth_date": "1990-01-15",
  "address": {
    "street": "Rua das Flores, 123",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "zip_code": "20000-000",
    "country": "Brasil"
  }
}
```

### 20. **Buscar Cliente por Email**
```
GET /customers/search?email=joao@email.com
```

---

## 🏢 Rotas de Produtos Estendidos

### 21. **Listar Produtos Estendidos**
```
GET /products/extended?limit=10&page=1
```

**Parâmetros opcionais:**
- `limit`: itens por página
- `page`: número da página
- `type`: tour, accommodation, package
- `location`: localização

### 22. **Detalhes de Produto Estendido**
```
GET /products/extended/{uuid}
```

**Exemplo:**
```
GET /products/extended/5f78306a-92a1-11f0-9942-525400e981bd
```

---

## 🧪 Testes Recomendados

### **Teste Básico (comece aqui):**
1. `GET /tours?limit=3` - Listar tours
2. `GET /tours/categories` - Categorias
3. `GET /tours/locations` - Localizações

### **Teste de Disponibilidade:**
1. `GET /tours/3/availability?year=2025&month=9`
2. `GET /tours/3/availability/check?date=2025-01-20&adults=2`

### **Teste de Reserva Completa:**
1. `POST /reservations` - Criar reserva
2. `GET /reservations/{code}` - Verificar reserva
3. `POST /payments/process` - Processar pagamento

---

## ⚠️ Observações Importantes

- **Reviews**: Temporariamente removidos da API
- **Rate Limiting**: 1000 requests/hora por IP
- **Timeout**: 30 segundos por requisição
- **Cache**: 5min (listagens), 30min (detalhes)
- **Bypass Cache**: Adicione `?nocache=1` na URL

---

## 🔧 Status Codes Esperados

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

---

## 📱 Exemplo de Resposta de Sucesso

```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Pousada JP • 3 Noites (2 Pessoas)",
    "subtitle": "Armação dos Búzios",
    "price": 1800.00,
    "images": ["https://example.com/image1.jpg"],
    "description": "Pousada com vista para o mar...",
    "duration": "3 dias / 2 noites",
    "location": "Armação dos Búzios, RJ"
  }
}
```
