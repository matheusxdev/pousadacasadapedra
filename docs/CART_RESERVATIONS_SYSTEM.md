# Sistema de Carrinho com Reservas

## Visão Geral

O sistema de carrinho com reservas permite que clientes adicionem produtos do tipo **tour** e **accommodation** ao carrinho com dados específicos de reserva, como datas, número de participantes, tipo de quarto, etc. Este sistema integra-se perfeitamente com o sistema de reservas existente.

## Funcionalidades Principais

### 🛒 Carrinho Inteligente
- **Suporte a múltiplos tipos**: produtos, tours e hospedagem
- **Dados específicos por tipo**: cada tipo de produto tem campos específicos
- **Validação automática**: valida dados obrigatórios conforme o tipo
- **Persistência**: mantém dados mesmo após logout/login

### 📅 Reservas Flexíveis
- **Tours**: data da reserva, participantes, ponto de encontro
- **Hospedagem**: check-in/out, noites, tipo de quarto
- **Produtos**: quantidade tradicional

### 🔄 Conversão Automática
- **Checkout inteligente**: converte itens em reservas reais
- **Múltiplas reservas**: um carrinho pode gerar várias reservas
- **Rastreamento**: mantém histórico de conversões

## Estrutura do Banco de Dados

### Tabela `cart_items` (Atualizada)

```sql
-- Novos campos adicionados
ALTER TABLE `cart_items` 
ADD COLUMN `reservation_data` JSON DEFAULT NULL COMMENT 'Dados específicos da reserva (JSON flexível)',
ADD COLUMN `item_type` ENUM('product','tour','accommodation') DEFAULT 'product' COMMENT 'Tipo do item no carrinho',
ADD COLUMN `reservation_date` DATE DEFAULT NULL COMMENT 'Data da reserva (para tours)',
ADD COLUMN `check_in_date` DATE DEFAULT NULL COMMENT 'Data de check-in (para hospedagem)',
ADD COLUMN `check_out_date` DATE DEFAULT NULL COMMENT 'Data de check-out (para hospedagem)',
ADD COLUMN `adults` INT DEFAULT '1' COMMENT 'Número de adultos',
ADD COLUMN `children` INT DEFAULT '0' COMMENT 'Número de crianças',
ADD COLUMN `total_participants` INT DEFAULT '1' COMMENT 'Total de participantes',
ADD COLUMN `special_requests` TEXT COMMENT 'Solicitações especiais do cliente',
ADD COLUMN `nights` INT DEFAULT NULL COMMENT 'Número de noites (para hospedagem)',
ADD COLUMN `room_type` VARCHAR(100) DEFAULT NULL COMMENT 'Tipo de quarto (para hospedagem)',
ADD COLUMN `meeting_point` TEXT COMMENT 'Ponto de encontro (para tours)',
ADD COLUMN `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do item',
ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de atualização do item';
```

### Tabela `cart_reservation_conversions`

```sql
CREATE TABLE `cart_reservation_conversions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cart_uuid` VARCHAR(100) NOT NULL COMMENT 'UUID do carrinho convertido',
  `conversion_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data da conversão',
  `customer_name` VARCHAR(255) DEFAULT NULL COMMENT 'Nome do cliente',
  `customer_email` VARCHAR(255) DEFAULT NULL COMMENT 'Email do cliente',
  `customer_phone` VARCHAR(30) DEFAULT NULL COMMENT 'Telefone do cliente',
  `total_items` INT DEFAULT '0' COMMENT 'Total de itens convertidos',
  `total_reservations` INT DEFAULT '0' COMMENT 'Total de reservas criadas',
  `total_amount` DECIMAL(10,2) DEFAULT '0.00' COMMENT 'Valor total convertido',
  `status` ENUM('pending','completed','failed') DEFAULT 'pending' COMMENT 'Status da conversão',
  `error_message` TEXT COMMENT 'Mensagem de erro se falhou',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversions_cart` (`cart_uuid`),
  KEY `idx_conversions_status` (`status`),
  KEY `idx_conversions_date` (`conversion_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci 
COMMENT='Histórico de conversões de carrinho em reservas';
```

## Endpoints da API

### 1. Adicionar Item com Reserva

```http
POST /cart/reservations/add
```

**Exemplo para Tour:**
```json
{
  "product_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "item_type": "tour",
  "quantity": 1,
  "reservation_data": {
    "reservation_date": "2025-01-20",
    "adults": 2,
    "children": 1,
    "meeting_point": "Porto de Búzios",
    "special_requests": "Preferência por horário da manhã"
  }
}
```

**Exemplo para Hospedagem:**
```json
{
  "product_uuid": "660e8400-e29b-41d4-a716-446655440001",
  "item_type": "accommodation",
  "quantity": 1,
  "reservation_data": {
    "check_in_date": "2025-01-20",
    "check_out_date": "2025-01-23",
    "nights": 3,
    "room_type": "Suíte Deluxe",
    "adults": 2,
    "children": 0,
    "special_requests": "Quarto com vista para o mar"
  }
}
```

### 2. Listar Carrinho com Reservas

```http
GET /cart/reservations/{cart_uuid}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "uuid": "cart_65a1b2c3d4e5f6_1705123456",
      "status": "open",
      "subtotal": 360.00,
      "total": 360.00,
      "item_count": 2
    },
    "items": [
      {
        "id": 123,
        "product_uuid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Passeio de Barco em Búzios",
        "item_type": "tour",
        "reservation_date": "2025-01-20",
        "adults": 2,
        "children": 1,
        "total_participants": 3,
        "meeting_point": "Porto de Búzios",
        "special_requests": "Preferência por horário da manhã"
      }
    ]
  }
}
```

### 3. Atualizar Item

```http
PUT /cart/reservations/items/{item_id}
```

**Exemplo:**
```json
{
  "quantity": 2,
  "reservation_data": {
    "adults": 4,
    "children": 2,
    "special_requests": "Grupo com crianças pequenas"
  }
}
```

### 4. Converter em Reservas

```http
POST /cart/reservations/convert
```

**Exemplo:**
```json
{
  "cart_uuid": "cart_65a1b2c3d4e5f6_1705123456",
  "customer_data": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+55 11 99999-9999"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Carrinho convertido em reservas com sucesso",
  "data": {
    "conversion_id": 456,
    "total_reservations": 2,
    "reservations": [
      {
        "reservation_id": 789,
        "reservation_code": "SH-A1B2C3D4",
        "item_type": "tour",
        "product_name": "Passeio de Barco em Búzios",
        "reservation_date": "2025-01-20",
        "total_price": 360.00,
        "adults": 2,
        "children": 1
      }
    ]
  }
}
```

## Fluxo de Uso

### 1. Adicionar Produtos ao Carrinho

```javascript
// Adicionar tour
const tourResponse = await fetch('/cart/reservations/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_uuid: 'tour-uuid',
    item_type: 'tour',
    reservation_data: {
      reservation_date: '2025-01-20',
      adults: 2,
      children: 1
    }
  })
});

// Adicionar hospedagem
const accommodationResponse = await fetch('/cart/reservations/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_uuid: 'accommodation-uuid',
    item_type: 'accommodation',
    reservation_data: {
      check_in_date: '2025-01-20',
      check_out_date: '2025-01-23',
      nights: 3,
      room_type: 'Suíte Deluxe'
    }
  })
});
```

### 2. Visualizar Carrinho

```javascript
const cartResponse = await fetch('/cart/reservations/cart-uuid');
const cart = await cartResponse.json();

// Exibir itens com dados de reserva
cart.data.items.forEach(item => {
  if (item.item_type === 'tour') {
    console.log(`Tour: ${item.name} - ${item.reservation_date}`);
  } else if (item.item_type === 'accommodation') {
    console.log(`Hospedagem: ${item.name} - ${item.check_in_date} a ${item.check_out_date}`);
  }
});
```

### 3. Finalizar Reservas

```javascript
const convertResponse = await fetch('/cart/reservations/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart_uuid: 'cart-uuid',
    customer_data: {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '+55 11 99999-9999'
    }
  })
});

const result = await convertResponse.json();
// result.data.reservations contém todas as reservas criadas
```

## Validações

### Tours
- ✅ `reservation_date` é obrigatório
- ✅ `adults` deve ser >= 1
- ✅ `children` deve ser >= 0
- ✅ Data não pode ser no passado
- ✅ Verifica disponibilidade na data

### Hospedagem
- ✅ `check_in_date` é obrigatório
- ✅ `check_out_date` é obrigatório
- ✅ `check_out_date` deve ser posterior a `check_in_date`
- ✅ Calcula `nights` automaticamente
- ✅ Verifica disponibilidade no período

### Produtos Tradicionais
- ✅ Funciona como antes
- ✅ Apenas `quantity` é necessário

## Integração com Sistema Existente

### Compatibilidade
- ✅ **100% compatível** com carrinho atual
- ✅ **Não quebra** funcionalidades existentes
- ✅ **Campos opcionais** para produtos tradicionais

### Migração
- ✅ **Migração automática** de dados existentes
- ✅ **Campos padrão** para itens antigos
- ✅ **Zero downtime** durante atualização

## Monitoramento e Logs

### Métricas Importantes
- Total de conversões por dia
- Taxa de sucesso das conversões
- Tempo médio de conversão
- Tipos de produtos mais convertidos

### Logs de Auditoria
- Todas as operações são logadas
- Rastreamento completo de conversões
- Histórico de alterações nos itens

## Troubleshooting

### Problemas Comuns

**1. Erro de Validação de Data**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Data de reserva não pode ser no passado"
  }
}
```

**2. Produto Não Encontrado**
```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Produto não encontrado"
  }
}
```

**3. Carrinho Vazio na Conversão**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Carrinho não possui itens de reserva"
  }
}
```

### Soluções

1. **Verificar UUID do produto**
2. **Validar datas no frontend**
3. **Confirmar que há itens no carrinho**
4. **Verificar logs de erro detalhados**

## Próximos Passos

### Melhorias Futuras
- [ ] **Cache inteligente** para disponibilidade
- [ ] **Notificações** de mudanças de preço
- [ ] **Sugestões** de produtos relacionados
- [ ] **Integração** com sistema de pagamentos
- [ ] **Relatórios** avançados de conversão

### Integrações Planejadas
- [ ] **WhatsApp** para confirmações
- [ ] **Email marketing** pós-conversão
- [ ] **CRM** para follow-up
- [ ] **Analytics** avançado

---

**Atualizado em:** 2025-01-17  
**Versão:** 1.0.0  
**Status:** ✅ Implementado e Funcional
