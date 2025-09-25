# 📊 Headers de Rate Limiting - Guia Completo

## 📋 **Headers Disponíveis**

A API retorna os seguintes headers em todas as respostas para informar sobre o status do rate limiting:

### **Headers Principais**
- `X-RateLimit-Limit`: Limite total de requisições
- `X-RateLimit-Remaining`: Requisições restantes no período atual
- `X-RateLimit-Reset`: Timestamp Unix quando o rate limit reseta
- `Retry-After`: Segundos para aguardar antes de tentar novamente (apenas quando rate limit é atingido)

### **Headers Adicionais**
- `X-RateLimit-Window`: Janela de tempo em minutos
- `X-RateLimit-Type`: Tipo de limite (global, authentication, payment, etc.)
- `X-RateLimit-User-Type`: Tipo de usuário (guest, authenticated, premium, admin)
- `X-RateLimit-Endpoint`: Endpoint específico (apenas no AdvancedRateLimitMiddleware)
- `X-RateLimit-Critical`: Indica se é uma operação crítica (apenas no EnhancedRateLimitMiddleware)

---

## 🎯 **Exemplos de Headers**

### **Resposta Normal (Rate Limit Não Atingido)**
```
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1643284800
X-RateLimit-Window: 1
X-RateLimit-Type: global
X-RateLimit-User-Type: authenticated
```

### **Resposta com Rate Limit Atingido**
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1643284800
X-RateLimit-Window: 1
X-RateLimit-Type: global
X-RateLimit-User-Type: authenticated
```

### **Resposta de Operação Crítica**
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1643284800
X-RateLimit-Window: 60
X-RateLimit-Type: payment
X-RateLimit-User-Type: authenticated
X-RateLimit-Endpoint: /payments/process
X-RateLimit-Critical: true
```

---

## 💡 **Como Usar no Frontend**

### **JavaScript/TypeScript - Função Básica**
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'X-RateLimit-Window'?: string;
  'X-RateLimit-Type'?: string;
  'X-RateLimit-User-Type'?: string;
  'Retry-After'?: string;
}

function getRateLimitInfo(response: Response): RateLimitHeaders | null {
  const headers: RateLimitHeaders = {};
  
  // Headers principais
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  
  if (!limit || !remaining || !reset) {
    return null; // Headers não disponíveis
  }
  
  headers['X-RateLimit-Limit'] = limit;
  headers['X-RateLimit-Remaining'] = remaining;
  headers['X-RateLimit-Reset'] = reset;
  
  // Headers opcionais
  const window = response.headers.get('X-RateLimit-Window');
  const type = response.headers.get('X-RateLimit-Type');
  const userType = response.headers.get('X-RateLimit-User-Type');
  const retryAfter = response.headers.get('Retry-After');
  
  if (window) headers['X-RateLimit-Window'] = window;
  if (type) headers['X-RateLimit-Type'] = type;
  if (userType) headers['X-RateLimit-User-Type'] = userType;
  if (retryAfter) headers['Retry-After'] = retryAfter;
  
  return headers;
}
```

### **React Hook para Rate Limiting**
```jsx
import { useState, useEffect, useCallback } from 'react';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  window?: number;
  type?: string;
  userType?: string;
  isRateLimited: boolean;
  retryAfter?: number;
}

function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const updateRateLimitInfo = useCallback((response: Response) => {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const retryAfter = response.headers.get('Retry-After');
    
    if (limit && remaining && reset) {
      const info: RateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        window: parseInt(response.headers.get('X-RateLimit-Window') || '0'),
        type: response.headers.get('X-RateLimit-Type') || undefined,
        userType: response.headers.get('X-RateLimit-User-Type') || undefined,
        isRateLimited: response.status === 429,
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined
      };
      
      setRateLimitInfo(info);
      setIsRateLimited(info.isRateLimited);
      
      // Log para debugging
      console.log('Rate Limit Info:', {
        ...info,
        resetDate: new Date(info.reset * 1000).toISOString(),
        retryAfterDate: retryAfter ? new Date(Date.now() + parseInt(retryAfter) * 1000).toISOString() : null
      });
    }
  }, []);
  
  const makeRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, options);
      updateRateLimitInfo(response);
      
      if (response.status === 429) {
        const error = await response.json();
        throw new Error(`Rate limit exceeded: ${error.error.message}`);
      }
      
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }, [updateRateLimitInfo]);
  
  return {
    rateLimitInfo,
    isRateLimited,
    makeRequest,
    updateRateLimitInfo
  };
}

// Exemplo de uso
function MyComponent() {
  const { rateLimitInfo, isRateLimited, makeRequest } = useRateLimit();
  
  const handleApiCall = async () => {
    try {
      const response = await makeRequest('/v1/tours');
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      {rateLimitInfo && (
        <div className="rate-limit-info">
          <p>Limite: {rateLimitInfo.limit}</p>
          <p>Restantes: {rateLimitInfo.remaining}</p>
          <p>Reset em: {new Date(rateLimitInfo.reset * 1000).toLocaleString()}</p>
          {rateLimitInfo.userType && <p>Tipo: {rateLimitInfo.userType}</p>}
        </div>
      )}
      
      {isRateLimited && (
        <div className="rate-limit-warning">
          <p>⚠️ Rate limit atingido! Tente novamente mais tarde.</p>
        </div>
      )}
      
      <button onClick={handleApiCall} disabled={isRateLimited}>
        Fazer Requisição
      </button>
    </div>
  );
}
```

### **Implementação com Retry Automático**
```typescript
class RateLimitManager {
  private retryQueue: Array<() => Promise<any>> = [];
  private isRetrying = false;
  
  async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      // Atualizar informações de rate limit
      this.updateRateLimitInfo(response);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          const retryMs = parseInt(retryAfter) * 1000;
          console.log(`Rate limit atingido. Tentando novamente em ${retryAfter} segundos...`);
          
          // Adicionar à fila de retry
          this.retryQueue.push(() => this.makeRequest<T>(url, options));
          
          // Aguardar e tentar novamente
          setTimeout(() => {
            this.processRetryQueue();
          }, retryMs);
          
          throw new Error(`Rate limit exceeded. Retrying in ${retryAfter} seconds.`);
        }
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
  
  private updateRateLimitInfo(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (limit && remaining && reset) {
      const info = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        resetDate: new Date(parseInt(reset) * 1000).toISOString()
      };
      
      // Armazenar no localStorage para persistência
      localStorage.setItem('rateLimitInfo', JSON.stringify(info));
      
      // Emitir evento para outros componentes
      window.dispatchEvent(new CustomEvent('rateLimitUpdate', { detail: info }));
    }
  }
  
  private async processRetryQueue(): Promise<void> {
    if (this.isRetrying || this.retryQueue.length === 0) {
      return;
    }
    
    this.isRetrying = true;
    
    while (this.retryQueue.length > 0) {
      const retryFn = this.retryQueue.shift();
      if (retryFn) {
        try {
          await retryFn();
        } catch (error) {
          console.error('Retry failed:', error);
        }
      }
    }
    
    this.isRetrying = false;
  }
  
  getRateLimitInfo(): any {
    const stored = localStorage.getItem('rateLimitInfo');
    return stored ? JSON.parse(stored) : null;
  }
}

// Uso
const rateLimitManager = new RateLimitManager();

// Escutar atualizações de rate limit
window.addEventListener('rateLimitUpdate', (event: CustomEvent) => {
  console.log('Rate limit atualizado:', event.detail);
});

// Fazer requisição
rateLimitManager.makeRequest('/v1/tours')
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

---

## 📊 **Monitoramento e Debugging**

### **Console do Navegador**
```javascript
// Função para monitorar headers em todas as requisições
function monitorRateLimitHeaders() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    
    if (limit && remaining && reset) {
      console.group('🚦 Rate Limit Info');
      console.log('Limit:', limit);
      console.log('Remaining:', remaining);
      console.log('Reset:', new Date(parseInt(reset) * 1000).toLocaleString());
      console.log('Reset Timestamp:', reset);
      console.groupEnd();
    }
    
    return response;
  };
}

// Ativar monitoramento
monitorRateLimitHeaders();
```

### **Dashboard de Rate Limiting**
```jsx
function RateLimitDashboard() {
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const handleRateLimitUpdate = (event) => {
      setRateLimitInfo(event.detail);
      setRequests(prev => [...prev, {
        timestamp: new Date().toISOString(),
        ...event.detail
      }]);
    };
    
    window.addEventListener('rateLimitUpdate', handleRateLimitUpdate);
    return () => window.removeEventListener('rateLimitUpdate', handleRateLimitUpdate);
  }, []);
  
  if (!rateLimitInfo) {
    return <div>Nenhuma informação de rate limit disponível</div>;
  }
  
  return (
    <div className="rate-limit-dashboard">
      <h3>📊 Rate Limit Status</h3>
      
      <div className="rate-limit-stats">
        <div className="stat">
          <label>Limite Total:</label>
          <span>{rateLimitInfo.limit}</span>
        </div>
        
        <div className="stat">
          <label>Restantes:</label>
          <span className={rateLimitInfo.remaining < 10 ? 'warning' : ''}>
            {rateLimitInfo.remaining}
          </span>
        </div>
        
        <div className="stat">
          <label>Reset em:</label>
          <span>{new Date(rateLimitInfo.reset * 1000).toLocaleString()}</span>
        </div>
        
        <div className="stat">
          <label>Progresso:</label>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${((rateLimitInfo.limit - rateLimitInfo.remaining) / rateLimitInfo.limit) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="recent-requests">
        <h4>Requisições Recentes</h4>
        {requests.slice(-5).map((req, index) => (
          <div key={index} className="request-item">
            <span>{new Date(req.timestamp).toLocaleTimeString()}</span>
            <span>Restantes: {req.remaining}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 **Benefícios dos Headers**

### **1. Transparência Total**
- ✅ O frontend sempre sabe quantas requisições restam
- ✅ Sabe exatamente quando o limite reseta
- ✅ Pode implementar retry inteligente

### **2. Experiência do Usuário**
- ✅ Mostrar progresso de rate limit
- ✅ Avisar antes de atingir o limite
- ✅ Implementar retry automático

### **3. Debugging e Monitoramento**
- ✅ Logs detalhados de rate limiting
- ✅ Dashboards em tempo real
- ✅ Alertas proativos

### **4. Otimização**
- ✅ Implementar cache baseado em rate limit
- ✅ Priorizar requisições importantes
- ✅ Distribuir carga ao longo do tempo

---

## ✅ **Resumo**

A API agora retorna headers completos de rate limiting em todas as respostas:

- **`X-RateLimit-Limit`**: Limite total de requisições
- **`X-RateLimit-Remaining`**: Requisições restantes
- **`X-RateLimit-Reset`**: Timestamp quando reseta
- **`Retry-After`**: Segundos para aguardar (quando rate limit é atingido)

O frontend pode usar essas informações para:
- Implementar retry automático
- Mostrar progresso para o usuário
- Otimizar requisições
- Monitorar e debugar problemas

**Resultado**: O frontend tem total visibilidade sobre o status do rate limiting e pode implementar estratégias inteligentes de retry e otimização.
