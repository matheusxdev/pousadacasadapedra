# 🚀 Exemplo de Implementação - Rate Limiting Aprimorado

## 📋 **Como Aplicar o EnhancedRateLimitMiddleware**

Este documento mostra como aplicar o middleware aprimorado em rotas específicas para obter respostas mais úteis para o frontend.

---

## 🔧 **Implementação Passo a Passo**

### **1. Importar o Middleware**

```php
// No início do arquivo de rotas (ex: payments.php)
use App\Middlewares\EnhancedRateLimitMiddleware;
```

### **2. Aplicar em Rotas Críticas**

```php
// Exemplo: Rota de processamento de pagamento
$app->post('/payments/process', function (Request $request, Response $response) {
    // ... lógica da rota existente
})->add(new EnhancedRateLimitMiddleware());

// Exemplo: Rota de criação de reserva
$app->post('/reservations/create', function (Request $request, Response $response) {
    // ... lógica da rota existente
})->add(new EnhancedRateLimitMiddleware());

// Exemplo: Rota de login
$app->post('/auth/login', function (Request $request, Response $response) {
    // ... lógica da rota existente
})->add(new EnhancedRateLimitMiddleware());
```

### **3. Aplicação com RateLimitMiddleware Customizado**

```php
// Para operações específicas com limites customizados
$app->post('/reservations/create', function (Request $request, Response $response) {
    // ... lógica da rota
})->add(new RateLimitMiddleware('reservation', 20, 10)); // 20 tentativas em 10 minutos

$app->post('/auth/login', function (Request $request, Response $response) {
    // ... lógica da rota
})->add(new RateLimitMiddleware('login', 5, 15)); // 5 tentativas em 15 minutos
```

---

## 📊 **Exemplo Completo - Rota de Pagamento**

### **Antes (Sem Middleware Aprimorado)**
```php
$app->post('/payments/process', function (Request $request, Response $response) {
    $db = $request->getAttribute('db');
    $body = json_decode($request->getBody()->getContents(), true);
    
    // ... lógica de processamento
    
    $response->getBody()->write(json_encode([
        'success' => true,
        'payment_id' => $paymentId,
        'status' => 'processing'
    ]));
    
    return $response->withHeader('Content-Type', 'application/json');
});
```

### **Depois (Com EnhancedRateLimitMiddleware)**
```php
$app->post('/payments/process', function (Request $request, Response $response) {
    $db = $request->getAttribute('db');
    $body = json_decode($request->getBody()->getContents(), true);
    
    // ... lógica de processamento
    
    $response->getBody()->write(json_encode([
        'success' => true,
        'payment_id' => $paymentId,
        'status' => 'processing'
    ]));
    
    return $response->withHeader('Content-Type', 'application/json');
})->add(new EnhancedRateLimitMiddleware());
```

---

## 🎯 **Resposta de Rate Limit para Pagamento**

Quando o limite for atingido, o frontend receberá:

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

## 🔍 **Headers Retornados**

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1643284800
X-RateLimit-User-Type: authenticated
X-RateLimit-Endpoint: /payments/process
X-RateLimit-Critical: true
```

---

## 💡 **Benefícios para o Frontend**

### **1. Informações Claras**
- ✅ Mensagem específica para pagamentos
- ✅ Tempo de retry em formato legível
- ✅ Alternativas práticas

### **2. Dados Úteis para Debugging**
- ✅ Limite específico (10 requisições/hora)
- ✅ Tipo de usuário (authenticated)
- ✅ Timestamp exato para retry
- ✅ Informações de segurança

### **3. Sugestões Práticas**
- ✅ Implementar retry com backoff
- ✅ Monitorar headers de rate limit
- ✅ Usar cache local
- ✅ Contato de suporte

---

## 🚀 **Implementação no Frontend**

### **JavaScript/TypeScript**
```typescript
async function processPayment(paymentData: any) {
  try {
    const response = await fetch('/v1/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    if (response.status === 429) {
      const error = await response.json();
      
      // Mostrar mensagem amigável
      showNotification(error.error.message, 'warning');
      
      // Mostrar alternativas
      showAlternatives(error.error.details.alternatives);
      
      // Implementar retry automático
      const retryAfter = error.error.details.retry_info.retry_after_seconds * 1000;
      setTimeout(() => {
        showNotification('Tentando novamente...', 'info');
        processPayment(paymentData);
      }, retryAfter);
      
      return;
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error;
  }
}
```

### **React Hook**
```jsx
function usePaymentProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  
  const processPayment = async (paymentData) => {
    setIsProcessing(true);
    setIsRateLimited(false);
    
    try {
      const response = await fetch('/v1/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      
      if (response.status === 429) {
        const error = await response.json();
        setIsRateLimited(true);
        setRetryAfter(error.error.details.retry_info.retry_after_human);
        setAlternatives(error.error.details.alternatives);
        return null;
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processPayment,
    isProcessing,
    isRateLimited,
    retryAfter,
    alternatives
  };
}
```

---

## 📈 **Monitoramento e Logs**

### **Logs Estruturados**
```json
{
  "timestamp": "2025-01-27T10:30:00Z",
  "level": "WARNING",
  "message": "Critical rate limit exceeded",
  "context": {
    "endpoint": "/payments/process",
    "user_type": "authenticated",
    "ip": "192.168.1.100",
    "limit": 10,
    "window": 3600,
    "risk_level": "high"
  }
}
```

### **Métricas Recomendadas**
- Taxa de rate limit hits por endpoint
- Distribuição por tipo de usuário
- Tempo médio de retry
- Frequência de alternativas utilizadas

---

## ✅ **Checklist de Implementação**

- [ ] Importar o middleware necessário
- [ ] Aplicar em rotas críticas
- [ ] Testar respostas de rate limit
- [ ] Implementar tratamento no frontend
- [ ] Configurar monitoramento
- [ ] Documentar para a equipe
- [ ] Treinar desenvolvedores frontend

---

## 🎯 **Resultado Final**

Com essas melhorias, o frontend recebe respostas muito mais úteis quando atinge rate limits:

1. **Mensagens claras** em português
2. **Informações detalhadas** sobre limites e retry
3. **Sugestões práticas** para resolver o problema
4. **Alternativas** específicas para cada operação
5. **Headers padronizados** para implementação de retry
6. **Informações de suporte** para casos complexos

**Resultado**: Desenvolvedores frontend não ficam mais "perdidos" quando atingem rate limits, e usuários finais recebem feedback claro sobre quando podem tentar novamente.
