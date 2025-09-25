# 🚀 Melhorias no Rate Limiting - Respostas Úteis para o Frontend

## 📋 **Resumo das Melhorias**

Implementamos melhorias significativas nos middlewares de rate limiting para fornecer respostas mais úteis e informativas para o frontend, evitando que os desenvolvedores fiquem "perdidos" quando atingem os limites.

---

## 🔧 **Middlewares Disponíveis**

### **1. RateLimitMiddleware (Melhorado)**
- **Uso**: Rate limiting básico com respostas informativas
- **Aplicação**: Global ou por rota específica
- **Resposta**: Estruturada com detalhes úteis

### **2. AdvancedRateLimitMiddleware (Melhorado)**
- **Uso**: Rate limiting granular por endpoint e tipo de usuário
- **Aplicação**: Global com limites específicos
- **Resposta**: Altamente detalhada com sugestões contextuais

### **3. EnhancedRateLimitMiddleware (Novo)**
- **Uso**: Rate limiting para operações críticas
- **Aplicação**: Rotas específicas (pagamentos, reservas, auth)
- **Resposta**: Extremamente detalhada com alternativas e suporte

---

## 📊 **Exemplos de Respostas**

### **Antes (Resposta Básica)**
```json
{
  "err": 1,
  "message": "Muitas tentativas. Tente novamente em alguns minutos."
}
```

### **Depois (RateLimitMiddleware Melhorado)**
```json
{
  "success": false,
  "error": {
    "code": 429,
    "type": "RATE_LIMIT_EXCEEDED",
    "message": "Você atingiu o limite de requisições. Tente novamente em 10 minutos.",
    "details": {
      "limit_type": "global",
      "max_attempts": 100,
      "window_minutes": 1,
      "retry_after_seconds": 600,
      "retry_after_timestamp": 1643284800,
      "retry_after_human": "10 minutos"
    }
  },
  "data": null
}
```

### **AdvancedRateLimitMiddleware**
```json
{
  "success": false,
  "error": {
    "code": 429,
    "type": "RATE_LIMIT_EXCEEDED",
    "message": "Limite de consultas de tours atingido. Como visitante, você pode tentar novamente em 1 hora.",
    "details": {
      "endpoint": "/tours",
      "user_type": "guest",
      "limit_info": {
        "requests": 100,
        "window": 3600,
        "window_human": "1 horas",
        "multiplier": 1.0,
        "base_limit": 100
      },
      "retry_after_seconds": 3600,
      "retry_after_timestamp": 1643284800,
      "retry_after_human": "1 hora",
      "suggestions": [
        "Considere usar filtros mais específicos para reduzir o número de consultas",
        "Use cache local para evitar requisições repetidas",
        "Considere fazer login para obter limites maiores",
        "Implemente retry com backoff exponencial",
        "Monitore os headers X-RateLimit-* para controlar requisições"
      ]
    },
    "data": null
  }
}
```

### **EnhancedRateLimitMiddleware (Para Operações Críticas)**
```json
{
  "success": false,
  "error": {
    "code": 429,
    "type": "CRITICAL_RATE_LIMIT_EXCEEDED",
    "message": "Limite de tentativas para processamento de pagamento atingido. Por segurança, aguarde 1 hora antes de tentar novamente.",
    "details": {
      "endpoint": "/payments/process",
      "endpoint_info": {
        "name": "Processamento de Pagamento",
        "description": "Operação crítica para processar pagamentos",
        "risk_level": "high",
        "requires_auth": true
      },
      "user_type": "authenticated",
      "limit_info": {
        "requests": 10,
        "window": 3600,
        "window_human": "1 horas",
        "multiplier": 1.0,
        "base_limit": 10
      },
      "retry_info": {
        "retry_after_seconds": 3600,
        "retry_after_timestamp": 1643284800,
        "retry_after_human": "1 hora",
        "retry_after_iso": "2025-01-27T11:30:00+00:00"
      },
      "alternatives": [
        "Verifique o status do pagamento antes de tentar novamente",
        "Considere usar métodos de pagamento alternativos",
        "Entre em contato com o suporte se o problema persistir"
      ],
      "security_info": {
        "ip_address": "192.168.1.100",
        "timestamp": "2025-01-27T10:30:00+00:00",
        "security_level": "enhanced",
        "monitoring": true,
        "log_entry": "Rate limit exceeded for /payments/process from IP 192.168.1.100"
      },
      "suggestions": [
        "Implemente retry com backoff exponencial",
        "Monitore os headers X-RateLimit-* para controlar requisições",
        "Considere implementar cache local para operações frequentes",
        "Use filas assíncronas para operações não críticas"
      ],
      "support_info": {
        "contact_email": "suporte@starhubsolutions.com",
        "documentation_url": "/v1/docs",
        "status_page": "https://status.starhubsolutions.com"
      }
    },
    "data": null
  }
}
```

---

## 🎯 **Headers Informativos**

Todos os middlewares agora retornam headers úteis:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1643284800
X-RateLimit-User-Type: authenticated
X-RateLimit-Endpoint: /tours
X-RateLimit-Critical: true (apenas para EnhancedRateLimitMiddleware)
Retry-After: 3600
```

---

## 🚀 **Como Aplicar nas Rotas**

### **1. Aplicação Global (já configurado)**
```php
// index.php
$app->add(new RateLimitMiddleware('global', 100, 1)); // 100 req/minuto
$app->add(new AdvancedRateLimitMiddleware());
```

### **2. Aplicação em Rotas Específicas**
```php
// Para rotas críticas como pagamentos
$app->post('/payments/process', function (Request $request, Response $response) {
    // ... lógica da rota
})->add(new EnhancedRateLimitMiddleware());

// Para rotas de autenticação
$app->post('/auth/login', function (Request $request, Response $response) {
    // ... lógica da rota
})->add(new EnhancedRateLimitMiddleware());
```

### **3. Aplicação com Limites Customizados**
```php
// Rate limiting específico para uma ação
$app->post('/reservations/create', function (Request $request, Response $response) {
    // ... lógica da rota
})->add(new RateLimitMiddleware('reservation', 20, 10)); // 20 tentativas em 10 minutos
```

---

## 💡 **Benefícios para o Frontend**

### **1. Informações Claras**
- ✅ Mensagens em português e amigáveis
- ✅ Tempo de retry em formato legível
- ✅ Tipo de limite claramente identificado

### **2. Dados Úteis**
- ✅ Timestamp exato para retry
- ✅ Limites específicos por endpoint
- ✅ Tipo de usuário e multiplicadores

### **3. Sugestões Práticas**
- ✅ Alternativas para resolver o problema
- ✅ Dicas de otimização
- ✅ Informações de suporte

### **4. Headers Padronizados**
- ✅ Headers HTTP padrão (Retry-After)
- ✅ Headers customizados informativos
- ✅ Compatibilidade com bibliotecas de retry

---

## 🔍 **Monitoramento e Debugging**

### **Logs Estruturados**
```json
{
  "timestamp": "2025-01-27T10:30:00Z",
  "level": "WARNING",
  "message": "Rate limit exceeded",
  "context": {
    "endpoint": "/payments/process",
    "user_type": "authenticated",
    "ip": "192.168.1.100",
    "limit": 10,
    "window": 3600
  }
}
```

### **Métricas Disponíveis**
- Total de requisições por endpoint
- Taxa de rate limit hits
- Distribuição por tipo de usuário
- Tempo médio de retry

---

## 🛠️ **Implementação no Frontend**

### **Exemplo com JavaScript/TypeScript**
```typescript
interface RateLimitError {
  success: false;
  error: {
    code: 429;
    type: 'RATE_LIMIT_EXCEEDED' | 'CRITICAL_RATE_LIMIT_EXCEEDED';
    message: string;
    details: {
      retry_after_seconds: number;
      retry_after_timestamp: number;
      retry_after_human: string;
      suggestions: string[];
      alternatives?: string[];
    };
  };
}

async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const error: RateLimitError = await response.json();
      
      // Mostrar mensagem amigável para o usuário
      showUserMessage(error.error.message);
      
      // Implementar retry automático
      const retryAfter = error.error.details.retry_after_seconds * 1000;
      setTimeout(() => makeRequest(url, options), retryAfter);
      
      // Mostrar sugestões
      showSuggestions(error.error.details.suggestions);
      
      return;
    }
    
    return response.json();
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### **Exemplo com React**
```jsx
function useApiWithRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const makeRequest = async (url, options) => {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const error = await response.json();
        setIsRateLimited(true);
        setRetryAfter(error.error.details.retry_after_human);
        setSuggestions(error.error.details.suggestions);
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.error('Request failed:', error);
      return null;
    }
  };
  
  return { makeRequest, isRateLimited, retryAfter, suggestions };
}
```

---

## 📈 **Próximos Passos**

1. **Monitoramento**: Implementar dashboards para acompanhar rate limits
2. **Alertas**: Configurar alertas para limites críticos
3. **Otimização**: Ajustar limites baseado em métricas reais
4. **Documentação**: Atualizar documentação da API com exemplos
5. **Testes**: Implementar testes automatizados para rate limiting

---

## ✅ **Status da Implementação**

- ✅ RateLimitMiddleware melhorado
- ✅ AdvancedRateLimitMiddleware melhorado  
- ✅ EnhancedRateLimitMiddleware criado
- ✅ Documentação completa
- ✅ Exemplos de uso
- ✅ Headers informativos
- ✅ Respostas estruturadas
- ✅ Sugestões contextuais
- ✅ Suporte a diferentes tipos de usuário
- ✅ Logs estruturados

**Resultado**: O frontend agora recebe respostas muito mais úteis e informativas quando atinge rate limits, facilitando o debugging e melhorando a experiência do usuário.
