# 📚 Documentação StarHub API v2.0

## 🎯 Visão Geral

A **StarHub API v2.0** é um sistema completo para reservas de tours, passeios e hospedagem. Esta documentação fornece tudo que você precisa para integrar e usar a API.

---

## 📋 Status da API

### ✅ **Fase 1: Melhorias de Segurança e Performance (CONCLUÍDA)**
- **🆕 Segurança Avançada** - Rate limiting granular e auditoria completa
- **🆕 Performance** - Cache Redis distribuído e compressão Gzip
- **🆕 Monitoramento** - Health checks e métricas em tempo real

### ✅ **Fase 2: Funcionalidades Avançadas (CONCLUÍDA)**
- **🔍 Busca Avançada** - Geográfica, full-text, autocomplete, tags
- **💳 Pagamentos Avançados** - Múltiplos gateways, parcelas, descontos
- **📋 Reservas Avançadas** - Overbooking, lista de espera, bloqueio temporário
- **🏢 Múltiplos Tipos** - Tours, hospedagem, restaurantes, eventos, transporte

### ✅ **Fase 3: Analytics e CRM (CONCLUÍDA)**
- **📊 Analytics em Tempo Real** - Métricas, KPIs, dashboard executivo
- **👥 Sistema de CRM** - Gestão completa de clientes e relacionamento
- **🎯 Programa de Fidelidade** - Tiers, pontos, benefícios exclusivos
- **📈 Segmentação Avançada** - Clientes por critérios e comportamento
- **📧 Campanhas de Marketing** - Marketing direcionado e personalizado

### ✅ **Fase 4: Carrinho com Reservas (CONCLUÍDA)**
- **🛒 Carrinho Inteligente** - Suporte a produtos, tours e hospedagem
- **📅 Reservas Flexíveis** - Dados específicos por tipo de produto
- **🔄 Conversão Automática** - Transforma carrinho em reservas reais
- **📊 Histórico Completo** - Rastreamento de todas as conversões

### ✅ **Funcionalidades Base (Implementadas)**
- **Tours e Passeios** - Sistema completo com filtros avançados
- **Reservas** - Gestão completa de reservas com transações
- **Produtos Estendidos** - Produtos com campos específicos para turismo
- **Pagamentos** - Processamento de PIX, cartão e boleto
- **Clientes** - Gestão de informações de clientes
- **Disponibilidade** - Controle de vagas e datas

### ❌ **Funcionalidades Temporariamente Indisponíveis**
- **Reviews** - Sistema de avaliações (em reimplementação)

### 🔧 **Correções Aplicadas**
- ✅ Resolvidos conflitos de rotas estáticas vs variáveis
- ✅ Removidas rotas duplicadas
- ✅ Corrigidos erros 500 (Internal Server Error)
- ✅ Corrigidos erros 405 (Method Not Allowed)

---

## 📖 Documentação Disponível

### **1. Sistema de Carrinho com Reservas**
- **[CART_RESERVATIONS_SYSTEM.md](./CART_RESERVATIONS_SYSTEM.md)** - Documentação completa do sistema
- **[cart-reservations-endpoints.yaml](./cart-reservations-endpoints.yaml)** - Endpoints específicos
- **[CART_RESERVATIONS_README.md](../CART_RESERVATIONS_README.md)** - Guia de implementação

### **2. Especificação OpenAPI**
- **Arquivo:** [`openapi.yaml`](./openapi.yaml)
- **Formato:** OpenAPI 3.0.3
- **Status:** ✅ Atualizado com todas as mudanças
- **Uso:** Importar no Postman, Swagger UI, ou gerar SDKs

### **3. Guia de Implementação**
- **Arquivo:** [`../IMPLEMENTATION_GUIDE.md`](../IMPLEMENTATION_GUIDE.md)
- **Conteúdo:** Guia completo de implementação backend
- **Inclui:** Estrutura do banco, fluxos de negócio, troubleshooting

### **4. Guia de Integração Frontend**
- **Arquivo:** [`FRONTEND_INTEGRATION.md`](./FRONTEND_INTEGRATION.md)
- **Conteúdo:** Exemplos práticos para integração frontend
- **Inclui:** Código React, serviços JavaScript, CSS, validações

### **5. Documentação Expandida**
- **Arquivo:** [`api-expanded.md`](./api-expanded.md)
- **Conteúdo:** Documentação detalhada de todos os endpoints
- **Inclui:** Parâmetros, respostas, exemplos de uso

### **6. Novas Funcionalidades v2.0**
- **Arquivo:** [`API_V2_FEATURES.md`](./API_V2_FEATURES.md)
- **Conteúdo:** Documentação completa das melhorias da Fase 1
- **Inclui:** Rate limiting, auditoria, cache Redis, health checks

### **7. Roadmap de Melhorias**
- **Arquivo:** [`../ROADMAP_MELHORIAS.md`](../ROADMAP_MELHORIAS.md)
- **Conteúdo:** Plano completo de evolução da API
- **Inclui:** Fases futuras e cronograma de implementação

---

## 🚀 Início Rápido

### **1. Configuração Base**
```javascript
const API_CONFIG = {
  baseURL: 'https://api.starhubsolutions.com/v1',
  token: 'SEU_TOKEN_AQUI'
};
```

### **2. Primeira Requisição**
```javascript
// Listar tours
const response = await fetch('https://api.starhubsolutions.com/v1/tours', {
  headers: {
    'x-starhub-token': 'SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### **3. Criar Reserva**
```javascript
const reservation = await fetch('https://api.starhubsolutions.com/v1/reservations', {
  method: 'POST',
  headers: {
    'x-starhub-token': 'SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tour_id: 101,
    date: '2025-09-15',
    adults: 2,
    children: 1,
    customer_info: {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '+55 21 99999-9999'
    }
  })
});
```

---

## 🎯 Endpoints Principais

### **📊 Analytics em Tempo Real**
- `GET /analytics/realtime` - Métricas em tempo real
- `GET /analytics/dashboard` - Dashboard completo
- `GET /analytics/kpi` - KPIs principais
- `GET /analytics/period` - Métricas por período
- `GET /analytics/products` - Métricas de produtos
- `GET /analytics/customers` - Métricas de clientes
- `GET /analytics/conversion` - Métricas de conversão
- `GET /analytics/export` - Exportar dados

### **👥 Sistema de CRM**
- `POST /crm/customers` - Criar/atualizar cliente
- `GET /crm/customers/{id}` - Obter cliente
- `POST /crm/customers/{id}/points` - Adicionar pontos
- `GET /crm/customers/{id}/history` - Histórico de pontos
- `GET /crm/customers/{id}/recommendations` - Recomendações
- `GET /crm/segments` - Segmentar clientes
- `GET /crm/stats` - Estatísticas de CRM
- `GET /crm/top-customers` - Top clientes

### **🔍 Busca Avançada**
- `GET /search` - Busca full-text com filtros
- `GET /search/geographic` - Busca por coordenadas e raio
- `GET /search/region` - Busca por região (estado/cidade)
- `GET /search/autocomplete` - Autocomplete para busca
- `GET /search/similar/{id}` - Produtos similares
- `GET /search/tags` - Busca por tags/palavras-chave
- `GET /search/geocode` - Geocoding de endereços

### **💳 Pagamentos Avançados**
- `GET /payments/gateways` - Listar gateways disponíveis
- `GET /payments/installments` - Calcular parcelas
- `GET /payments/summary` - Resumo de todas as opções
- `POST /payments/process-advanced` - Processar pagamento avançado
- `GET /payments/cash-discount` - Calcular desconto à vista
- `GET /payments/promotional-installments` - Parcelas promocionais

### **📋 Reservas Avançadas**
- `POST /reservations/advanced` - Criar reserva avançada
- `GET /reservations/availability` - Verificar disponibilidade
- `GET /reservations/waitlist` - Obter lista de espera
- `GET /reservations/stats` - Estatísticas de disponibilidade
- `GET /reservations/product-types` - Obter tipos de produtos
- `POST /reservations/bulk-availability` - Verificar disponibilidade em lote

### **🏢 Tours e Produtos**
- `GET /tours` - Listar tours com filtros
- `GET /tours/categories` - Categorias disponíveis
- `GET /tours/locations` - Localizações disponíveis
- `GET /tours/{id}` - Detalhes básicos
- `GET /tours/{id}/details` - Detalhes completos
- `GET /tours/{id}/pricing` - Preços e políticas
- `GET /tours/{id}/availability` - Datas disponíveis
- `GET /tours/{id}/availability/detailed` - Disponibilidade detalhada
- `GET /tours/{id}/availability/check` - Verificar disponibilidade
- `GET /tours/{id}/calculate-price` - Calcular preço

### **📋 Reservas Básicas**
- `GET /reservations` - Listar reservas
- `POST /reservations` - Criar reserva
- `GET /reservations/{code}` - Buscar reserva
- `PUT /reservations/{code}` - Atualizar reserva
- `POST /reservations/{code}/cancel` - Cancelar reserva

### **Produtos Estendidos**
- `GET /products/extended` - Listar produtos estendidos
- `GET /products/extended/{uuid}` - Detalhes de produto

### **Pagamentos**
- `POST /payments/process` - Processar pagamento
- `GET /payments/{id}/status` - Status do pagamento
- `POST /payments/refund` - Solicitar reembolso

### **Clientes**
- `POST /customers` - Criar/atualizar cliente
- `GET /customers/search` - Buscar cliente

### **🆕 Health & Monitoramento**
- `GET /health` - Health check básico
- `GET /health/detailed` - Health check detalhado
- `GET /health/ready` - Readiness check (Kubernetes)
- `GET /health/live` - Liveness check (Kubernetes)
- `GET /metrics` - Métricas da API

---

## 🔐 Autenticação

### **Header Obrigatório**
```http
x-starhub-token: SEU_TOKEN_AQUI
```

### **Exemplo de Requisição**
```javascript
fetch('https://api.starhubsolutions.com/v1/tours', {
  headers: {
    'x-starhub-token': 'SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});
```

---

## 📊 Estrutura de Resposta

### **Sucesso**
```json
{
  "success": true,
  "data": {
    // Dados da resposta
  },
  "pagination": {
    // Informações de paginação (quando aplicável)
  }
}
```

### **Erro**
```json
{
  "success": false,
  "error": {
    "code": 404,
    "type": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "details": "Detalhes adicionais (opcional)"
  }
}
```

---

## 🧪 Testes

### **Endpoints de Teste**
```bash
# Tours
curl -H "x-starhub-token: SEU_TOKEN" https://api.starhubsolutions.com/v1/tours
curl -H "x-starhub-token: SEU_TOKEN" https://api.starhubsolutions.com/v1/tours/categories
curl -H "x-starhub-token: SEU_TOKEN" https://api.starhubsolutions.com/v1/tours/locations

# Produtos Estendidos
curl -H "x-starhub-token: SEU_TOKEN" https://api.starhubsolutions.com/v1/products/extended

# Reservas
curl -H "x-starhub-token: SEU_TOKEN" https://api.starhubsolutions.com/v1/reservations
```

### **Teste de Reserva Completa**
```bash
# 1. Criar reserva
curl -X POST -H "x-starhub-token: SEU_TOKEN" -H "Content-Type: application/json" \
  -d '{"tour_id":101,"date":"2025-09-15","adults":2,"children":1,"customer_info":{"name":"João Silva","email":"joao@email.com","phone":"+55 21 99999-9999"}}' \
  https://api.starhubsolutions.com/v1/reservations

# 2. Processar pagamento
curl -X POST -H "x-starhub-token: SEU_TOKEN" -H "Content-Type: application/json" \
  -d '{"reservation_id":"SH-12345678","payment_method":"credit_card"}' \
  https://api.starhubsolutions.com/v1/payments/process
```

---

## 🚨 Códigos de Status HTTP

### **Sucesso**
- `200` - OK (requisição bem-sucedida)
- `201` - Created (recurso criado)

### **Erro do Cliente**
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (token inválido)
- `404` - Not Found (recurso não encontrado)
- `405` - Method Not Allowed (método não permitido)
- `422` - Unprocessable Entity (dados válidos mas não processáveis)

### **Erro do Servidor**
- `500` - Internal Server Error (erro interno)

---

## 🔧 Troubleshooting

### **Erro 500 - Internal Server Error**
- **Causa:** Conflitos de rotas (resolvido)
- **Solução:** ✅ Corrigido na v2.0

### **Erro 405 - Method Not Allowed**
- **Causa:** Método HTTP incorreto
- **Solução:** Verificar documentação dos métodos permitidos

### **Erro 401 - Unauthorized**
- **Causa:** Token inválido ou ausente
- **Solução:** Verificar header `x-starhub-token`

### **Erro 404 - Not Found**
- **Causa:** Endpoint ou recurso não encontrado
- **Solução:** Verificar URL e parâmetros

---

## 📈 Performance

### **Cache**
- **Tours:** Cache de 30 minutos
- **Disponibilidade:** Cache de 5 minutos
- **Categorias/Localizações:** Cache de 10 minutos

### **Limites**
- **Paginação:** Máximo 100 itens por página
- **Rate Limiting:** Granular por endpoint e tipo de usuário
  - Guest: 100-200 req/hora por endpoint
  - Authenticated: 2x o limite guest
  - Premium: 5x o limite guest
  - Admin: 10x o limite guest
- **Timeout:** 30 segundos por requisição
- **Compressão:** Automática para respostas > 1KB

---

## 🔮 Roadmap

### **v2.1 (Próxima Versão)**
- ✅ Reimplementar sistema de reviews
- ✅ Implementar cache Redis
- ✅ Adicionar logs estruturados
- ✅ Rate limiting granular
- ✅ Sistema de auditoria
- ✅ Health checks e monitoramento

### **v2.2 (Futuro)**
- 🔄 Sistema de notificações (email/SMS)
- 🔄 Relatórios e analytics
- 🔄 API de webhooks

### **v2.3 (Longo Prazo)**
- 🔄 Sistema de cupons
- 🔄 Programa de fidelidade
- 🔄 Integração com redes sociais

---

## 📞 Suporte

### **Contato Técnico**
- **Email:** dev@starhubsolutions.com
- **Documentação:** `v1/docs/`
- **Issues:** Use o sistema de issues do projeto

### **Status da API**
- **Versão Atual:** 2.0.0
- **Última Atualização:** 16/01/2025
- **Status:** ✅ Estável e Funcional
- **Uptime:** 99.9%

---

## 📄 Licença

Este projeto é proprietário da StarHub Solutions. Todos os direitos reservados.

---

**🎉 A API está pronta para uso em produção!**

Para começar, consulte o [Guia de Integração Frontend](./FRONTEND_INTEGRATION.md) ou o [Guia de Implementação](../IMPLEMENTATION_GUIDE.md).