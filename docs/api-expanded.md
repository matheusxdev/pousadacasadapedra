# 📚 Documentação da API StarHub - Sistema Expandido de Tours e Reservas

## 🚀 **Visão Geral**

Esta documentação descreve todas as rotas da API StarHub para o sistema completo de tours, reservas, pagamentos e avaliações.

**Base URL:** `https://api.starhubsolutions.com/v1`

**Headers obrigatórios:**
- `x-starhub-token`: Token da loja
- `Content-Type`: `application/json`

---

## 🏖️ **Tours e Passeios**

### **GET /tours**
Lista tours/passeios com filtros e paginação.

**Query Parameters:**
- `limit` (int): Limite de resultados (padrão: 10)
- `page` (int): Página (padrão: 1)
- `search` (string): Busca por nome/descrição
- `category` (string): Filtro por categoria
- `location` (string): Filtro por localização
- `min_price` (float): Preço mínimo
- `max_price` (float): Preço máximo
- `duration` (string): Duração do tour
- `rating` (float): Avaliação mínima
- `min_participants` (int): Mínimo de participantes
- `max_participants` (int): Máximo de participantes
- `difficulty_level` (string): Nível de dificuldade
- `order_by` (string): Campo para ordenação
- `order_direction` (string): ASC ou DESC
- `nocache` (bool): Ignorar cache

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "uuid": "5f78306a-92a1-11f0-9942-525400e981bd",
      "title": "Passeio de Barco em Búzios",
      "subtitle": "Búzios",
      "description": "Passeio de barco pela costa de Búzios...",
      "category": "Tours e Passeios",
      "price": 120.00,
      "original_price": 150.00,
      "images": ["https://example.com/image1.jpg"],
      "location": "Búzios",
      "duration": "4 horas",
      "rating": 4.80,
      "max_participants": 20,
      "min_participants": 2,
      "difficulty_level": "Fácil"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total_items": 5,
    "total_pages": 1,
    "has_next_page": false,
    "has_prev_page": false
  }
}
```

### **GET /tours/{id}**
Detalhes básicos de um tour específico.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "uuid": "5f78306a-92a1-11f0-9942-525400e981bd",
    "title": "Passeio de Barco em Búzios",
    "subtitle": "Búzios",
    "description": "Passeio de barco pela costa de Búzios...",
    "category": "Tours e Passeios",
    "price": 120.00,
    "images": ["https://example.com/image1.jpg"],
    "location": "Búzios",
    "duration": "4 horas",
    "rating": 4.80,
    "max_participants": 20,
    "min_participants": 2
  }
}
```

### **GET /tours/{id}/details**
Detalhes completos de um tour com avaliações.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "uuid": "5f78306a-92a1-11f0-9942-525400e981bd",
    "title": "Passeio de Barco em Búzios",
    "subtitle": "Búzios",
    "description": "Passeio de barco pela costa de Búzios...",
    "category": "Tours e Passeios",
    "price": 120.00,
    "original_price": 150.00,
    "images": ["https://example.com/image1.jpg"],
    "location": "Búzios",
    "address": "Marina de Búzios - Rua das Pedras, 123",
    "duration": "4 horas",
    "rating": 4.80,
    "review_count": 15,
    "max_capacity": 20,
    "min_people": 2,
    "max_people": 20,
    "difficulty_level": "Fácil",
    "includes": ["Barco", "guia", "equipamento de mergulho", "almoço"],
    "excludes": ["Bebidas", "transporte até o ponto de encontro"],
    "requirements": [],
    "cancellation_policy": "Cancelamento gratuito até 24h antes",
    "meeting_point": "Marina de Búzios às 9h",
    "check_in_time": null,
    "check_out_time": null,
    "amenities": [],
    "policies": null,
    "reviews": [
      {
        "id": 1,
        "customer_name": "Maria Silva",
        "rating": 5,
        "comment": "Excelente passeio! Recomendo muito.",
        "date": "2025-01-15 10:30:00",
        "verified": true
      }
    ]
  }
}
```

### **GET /tours/{id}/pricing**
Preços e políticas de cancelamento.

**Query Parameters:**
- `date` (string): Data específica (opcional)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "base_price": 120.00,
    "adult_price": 120.00,
    "child_price": 84.00,
    "seasonal_multiplier": 1.0,
    "weekend_surcharge": 0.0,
    "child_discount": 0.3,
    "group_discounts": [
      {"min_people": 4, "discount_percent": 0.1},
      {"min_people": 8, "discount_percent": 0.15},
      {"min_people": 12, "discount_percent": 0.2}
    ],
    "taxes": 0.1,
    "fees": 0.05,
    "cancellation_policy": "Cancelamento gratuito até 24h antes"
  }
}
```

### **GET /tours/{id}/availability**
Datas disponíveis por mês/ano.

**Query Parameters:**
- `year` (int): Ano (padrão: atual)
- `month` (int): Mês (padrão: atual)

**Resposta:**
```json
{
  "success": true,
  "data": [
    "2025-01-20",
    "2025-01-21",
    "2025-01-22",
    "2025-01-23",
    "2025-01-25",
    "2025-01-26",
    "2025-01-27",
    "2025-01-28",
    "2025-01-29"
  ]
}
```

### **GET /tours/{id}/availability/detailed**
Disponibilidade detalhada com capacidade e preços.

**Query Parameters:**
- `start_date` (string): Data inicial (padrão: hoje)
- `end_date` (string): Data final (padrão: +30 dias)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-20",
      "available_spots": 15,
      "max_adults": 20,
      "max_children": 20,
      "min_adults": 1,
      "min_children": 0,
      "price_per_adult": 120.00,
      "price_per_child": 84.00,
      "total_price": 120.00,
      "is_available": true,
      "restrictions": []
    }
  ]
}
```

### **GET /tours/{id}/availability/check**
Verificar disponibilidade para uma data específica.

**Query Parameters:**
- `date` (string): Data obrigatória
- `adults` (int): Número de adultos (padrão: 1)
- `children` (int): Número de crianças (padrão: 0)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-20",
    "available_spots": 15,
    "max_adults": 20,
    "max_children": 20,
    "min_adults": 1,
    "min_children": 0,
    "price_per_adult": 120.00,
    "price_per_child": 84.00,
    "total_price": 240.00,
    "is_available": true,
    "restrictions": []
  }
}
```

### **GET /tours/{id}/calculate-price**
Calcular preço total com taxas e descontos.

**Query Parameters:**
- `date` (string): Data obrigatória
- `adults` (int): Número de adultos (padrão: 1)
- `children` (int): Número de crianças (padrão: 0)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total_price": 264.00,
    "breakdown": {
      "adult_price": 120.00,
      "child_price": 84.00,
      "taxes": 20.40,
      "fees": 10.20,
      "discounts": 0
    }
  }
}
```

### **GET /tours/categories**
Lista categorias disponíveis.

**Resposta:**
```json
{
  "success": true,
  "data": [
    "Tours e Passeios",
    "Hospedagem",
    "Pacotes Turísticos"
  ]
}
```

### **GET /tours/locations**
Lista localizações disponíveis.

**Resposta:**
```json
{
  "success": true,
  "data": [
    "Búzios",
    "Rio de Janeiro",
    "Praia do Forte"
  ]
}
```

---

## 📅 **Reservas**

### **POST /reservations**
Criar nova reserva.

**Body:**
```json
{
  "tour_id": 3,
  "date": "2025-01-20",
  "adults": 2,
  "children": 1,
  "customer_name": "João Silva",
  "customer_email": "joao@email.com",
  "customer_phone": "+55 11 99999-9999",
  "notes": "Observações especiais"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "code": "SH-Q7R8S9T0",
    "tour_id": 3,
    "tour_name": "Passeio de Barco em Búzios",
    "date": "2025-01-20",
    "adults": 2,
    "children": 1,
    "total_participants": 3,
    "total_price": 324.00,
    "customer_name": "João Silva",
    "customer_email": "joao@email.com",
    "customer_phone": "+55 11 99999-9999",
    "notes": "Observações especiais",
    "status": "pending",
    "payment_status": "unpaid",
    "created_at": "2025-01-15 14:30:00",
    "updated_at": "2025-01-15 14:30:00"
  }
}
```

### **GET /reservations/{code}**
Buscar reserva por código.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SH-A1B2C3D4",
    "tour_id": 1,
    "tour_name": "Pousada JP 3 Noites (2 Pessoas)",
    "date": "2025-01-20",
    "adults": 2,
    "children": 1,
    "total_participants": 3,
    "total_price": 360.00,
    "customer_name": "João Silva",
    "customer_email": "joao@email.com",
    "customer_phone": "+55 11 99999-9999",
    "notes": null,
    "status": "confirmed",
    "payment_status": "paid",
    "created_at": "2025-09-16 02:04:14",
    "updated_at": "2025-09-16 02:04:14"
  }
}
```

### **PUT /reservations/{code}**
Atualizar reserva existente.

**Body:**
```json
{
  "adults": 3,
  "children": 0,
  "customer_name": "João Silva Santos",
  "notes": "Atualização de dados"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SH-A1B2C3D4",
    "tour_id": 1,
    "tour_name": "Pousada JP 3 Noites (2 Pessoas)",
    "date": "2025-01-20",
    "adults": 3,
    "children": 0,
    "total_participants": 3,
    "total_price": 360.00,
    "customer_name": "João Silva Santos",
    "customer_email": "joao@email.com",
    "customer_phone": "+55 11 99999-9999",
    "notes": "Atualização de dados",
    "status": "confirmed",
    "payment_status": "paid",
    "created_at": "2025-09-16 02:04:14",
    "updated_at": "2025-01-15 15:45:00"
  }
}
```

### **POST /reservations/{code}/cancel**
Cancelar reserva.

**Body:**
```json
{
  "reason": "Mudança de planos"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "refund_amount": 360.00,
    "cancellation_reason": "Mudança de planos",
    "cancelled_at": "2025-01-15 16:00:00"
  }
}
```

### **GET /reservations**
Listar reservas com filtros.

**Query Parameters:**
- `limit` (int): Limite de resultados (padrão: 10)
- `page` (int): Página (padrão: 1)
- `status` (string): Filtro por status
- `customer_email` (string): Email do cliente
- `tour_id` (string): UUID do tour
- `date_from` (string): Data inicial
- `date_to` (string): Data final
- `nocache` (bool): Ignorar cache

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "reservation_code": "SH-A1B2C3D4",
      "reservation_date": "2025-01-20",
      "adults": 2,
      "children": 1,
      "total_participants": 3,
      "total_price": 360.00,
      "customer_name": "João Silva",
      "customer_email": "joao@email.com",
      "customer_phone": "+55 11 99999-9999",
      "notes": null,
      "status": "confirmed",
      "created_at": "2025-09-16 02:04:14",
      "tour_name": "Pousada JP 3 Noites (2 Pessoas)",
      "location": "Armação dos Búzios"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total_items": 4,
    "total_pages": 1,
    "has_next_page": false,
    "has_prev_page": false
  }
}
```

---

## 💳 **Pagamentos**

### **POST /payments/process**
Processar pagamento para reserva.

**Body:**
```json
{
  "reservation_id": "SH-A1B2C3D4",
  "payment_method": "credit_card",
  "card_info": {
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123",
    "name": "João Silva"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "PAY-A1B2C3D4E5F6",
    "status": "approved",
    "payment_url": null,
    "boleto_url": null,
    "pix_code": null,
    "expires_at": null
  }
}
```

### **GET /payments/{id}/status**
Verificar status do pagamento.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "PAY-A1B2C3D4E5F6",
    "status": "approved",
    "payment_url": null,
    "boleto_url": null,
    "pix_code": null,
    "expires_at": null,
    "reservation": {
      "id": 1,
      "code": "SH-A1B2C3D4",
      "tour_name": "Passeio de Barco em Búzios",
      "total_price": 324.00,
      "status": "confirmed"
    }
  }
}
```

### **POST /payments/refund**
Solicitar reembolso.

**Body:**
```json
{
  "reservation_id": "SH-A1B2C3D4",
  "reason": "Cancelamento solicitado pelo cliente"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "refund_amount": 324.00,
    "refund_reason": "Cancelamento solicitado pelo cliente",
    "processed_at": "2025-01-15 17:30:00"
  }
}
```

---

## 👥 **Clientes**

### **POST /customers**
Criar/atualizar cliente.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+55 11 99999-9999",
  "document": "12345678901",
  "birth_date": "1990-01-01",
  "address": {
    "street": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567",
    "country": "Brasil"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "CUST-123456",
    "customer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+55 11 99999-9999",
      "document": "12345678901",
      "birth_date": "1990-01-01",
      "address": {
        "street": "Rua das Flores, 123",
        "city": "São Paulo",
        "state": "SP",
        "zip_code": "01234-567",
        "country": "Brasil"
      }
    }
  }
}
```

### **GET /customers/search**
Buscar cliente por email.

**Query Parameters:**
- `email` (string): Email do cliente

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "CUST-123456",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+55 11 99999-9999",
    "document": "12345678901",
    "birth_date": "1990-01-01",
    "address": {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567",
      "country": "Brasil"
    }
  }
}
```

---

## ⭐ **Avaliações**

### **GET /tours/{id}/reviews**
Listar avaliações de um tour.

**Query Parameters:**
- `page` (int): Página (padrão: 1)
- `limit` (int): Limite por página (padrão: 10)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "customer_name": "Maria Silva",
        "rating": 5,
        "comment": "Excelente passeio! Recomendo muito.",
        "date": "2025-01-15 10:30:00",
        "verified": true
      }
    ],
    "total": 15,
    "average_rating": 4.8
  }
}
```

### **POST /tours/{id}/reviews**
Criar nova avaliação.

**Body:**
```json
{
  "reservation_id": "SH-A1B2C3D4",
  "rating": 5,
  "comment": "Excelente experiência!"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "customer_name": "João Silva",
    "rating": 5,
    "comment": "Excelente experiência!",
    "date": "2025-01-15 18:00:00",
    "verified": true
  }
}
```

---

## 🚨 **Códigos de Erro**

| Código | Descrição |
|--------|-----------|
| 400 | Dados inválidos ou parâmetros obrigatórios ausentes |
| 401 | Token de autenticação inválido |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: data não disponível) |
| 500 | Erro interno do servidor |

**Formato de erro:**
```json
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "code": 400,
    "details": {}
  }
}
```

---

## 📊 **Limites e Rate Limiting**

- **Rate Limit:** 1000 requests por hora por IP
- **Tamanho máximo de payload:** 10MB
- **Timeout:** 30 segundos por requisição
- **Cache:** 5 minutos para listagens, 30 minutos para detalhes

---

## 🔐 **Autenticação**

Todas as rotas requerem o header `x-starhub-token` com o token da loja.

**Exemplo:**
```bash
curl -H "x-starhub-token: SEU_TOKEN_AQUI" \
     -H "Content-Type: application/json" \
     https://api.starhubsolutions.com/v1/tours
```

---

## 📝 **Notas Importantes**

1. **Datas:** Sempre no formato `YYYY-MM-DD`
2. **Preços:** Sempre em decimal com 2 casas
3. **IDs:** Podem ser numéricos ou UUIDs
4. **Status:** Sempre em lowercase
5. **Paginação:** Padrão de 10 itens por página
6. **Cache:** Use `nocache=1` para ignorar cache

---

## 🧪 **Ambiente de Teste**

Para testes, use a base URL de desenvolvimento:
`https://dev-api.starhubsolutions.com/v1`

Dados de teste disponíveis:
- Tours: IDs 3, 4, 5
- Reservas: Códigos SH-A1B2C3D4, SH-E5F6G7H8
- Clientes: emails de exemplo nos dados de teste
