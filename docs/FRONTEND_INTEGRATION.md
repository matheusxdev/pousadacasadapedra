# 🎨 Guia de Integração Frontend - StarHub API

## 🚀 Integração Rápida

### **Configuração Base**
```javascript
// config/api.js
const API_CONFIG = {
  baseURL: 'https://api.starhubsolutions.com/v1',
  token: 'SEU_TOKEN_AQUI', // Token do cliente
  timeout: 30000
};

// Headers padrão
const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-starhub-token': API_CONFIG.token
};
```

### **Função HTTP Helper**
```javascript
// utils/http.js
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    headers: defaultHeaders,
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro na API');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## 🎯 Exemplos Práticos por Funcionalidade

### **1. Tours e Passeios**

#### **Listar Tours com Filtros**
```javascript
// services/tours.js
export class ToursService {
  // Listar tours com filtros
  static async getTours(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.page) params.append('page', filters.page);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    
    return apiRequest(`/tours?${params.toString()}`);
  }

  // Buscar categorias
  static async getCategories() {
    return apiRequest('/tours/categories');
  }

  // Buscar localizações
  static async getLocations() {
    return apiRequest('/tours/locations');
  }

  // Detalhes de um tour
  static async getTourDetails(tourId) {
    return apiRequest(`/tours/${tourId}/details`);
  }

  // Verificar disponibilidade
  static async checkAvailability(tourId, date, adults, children = 0) {
    const params = new URLSearchParams({
      date,
      adults: adults.toString(),
      children: children.toString()
    });
    
    return apiRequest(`/tours/${tourId}/availability/check?${params}`);
  }

  // Calcular preço
  static async calculatePrice(tourId, date, adults, children = 0) {
    const params = new URLSearchParams({
      date,
      adults: adults.toString(),
      children: children.toString()
    });
    
    return apiRequest(`/tours/${tourId}/calculate-price?${params}`);
  }
}
```

#### **Uso no Componente React**
```jsx
// components/ToursList.jsx
import React, { useState, useEffect } from 'react';
import { ToursService } from '../services/tours';

export function ToursList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    loadTours();
  }, [filters]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const response = await ToursService.getTours(filters);
      setTours(response.data);
    } catch (error) {
      console.error('Erro ao carregar tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar tours..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value })}
        >
          <option value="">Todas as categorias</option>
          <option value="passeio">Passeio</option>
          <option value="hospedagem">Hospedagem</option>
        </select>
        <input
          type="number"
          placeholder="Preço mínimo"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço máximo"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
        />
      </div>

      {/* Lista de tours */}
      <div className="tours-grid">
        {tours.map(tour => (
          <div key={tour.id} className="tour-card">
            <img src={tour.images[0]} alt={tour.title} />
            <h3>{tour.title}</h3>
            <p>{tour.subtitle}</p>
            <p className="price">R$ {tour.price.toFixed(2)}</p>
            <button onClick={() => viewTourDetails(tour.id)}>
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **2. Sistema de Reservas**

#### **Serviço de Reservas**
```javascript
// services/reservations.js
export class ReservationsService {
  // Criar reserva
  static async createReservation(reservationData) {
    return apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  // Listar reservas
  static async getReservations(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.tourId) params.append('tour_id', filters.tourId);
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);
    
    return apiRequest(`/reservations?${params.toString()}`);
  }

  // Buscar reserva por código
  static async getReservation(code) {
    return apiRequest(`/reservations/${code}`);
  }

  // Atualizar reserva
  static async updateReservation(code, updates) {
    return apiRequest(`/reservations/${code}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Cancelar reserva
  static async cancelReservation(code, reason = '') {
    return apiRequest(`/reservations/${code}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
}
```

#### **Componente de Reserva**
```jsx
// components/ReservationForm.jsx
import React, { useState } from 'react';
import { ReservationsService } from '../services/reservations';

export function ReservationForm({ tourId, tourDetails }) {
  const [formData, setFormData] = useState({
    date: '',
    adults: 1,
    children: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const reservationData = {
        tour_id: tourId,
        date: formData.date,
        adults: parseInt(formData.adults),
        children: parseInt(formData.children),
        customer_info: {
          name: formData.customer_name,
          email: formData.customer_email,
          phone: formData.customer_phone
        },
        special_requests: formData.special_requests
      };

      const response = await ReservationsService.createReservation(reservationData);
      
      // Redirecionar para página de pagamento ou sucesso
      window.location.href = `/reservation-success/${response.data.code}`;
      
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao criar reserva: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <h3>Fazer Reserva</h3>
      
      <div className="form-group">
        <label>Data:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Adultos:</label>
        <input
          type="number"
          name="adults"
          value={formData.adults}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Crianças:</label>
        <input
          type="number"
          name="children"
          value={formData.children}
          onChange={handleInputChange}
          min="0"
        />
      </div>

      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="customer_email"
          value={formData.customer_email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Telefone:</label>
        <input
          type="tel"
          name="customer_phone"
          value={formData.customer_phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Solicitações Especiais:</label>
        <textarea
          name="special_requests"
          value={formData.special_requests}
          onChange={handleInputChange}
          rows="3"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Criando Reserva...' : 'Fazer Reserva'}
      </button>
    </form>
  );
}
```

### **3. Sistema de Pagamentos**

#### **Serviço de Pagamentos**
```javascript
// services/payments.js
export class PaymentsService {
  // Processar pagamento
  static async processPayment(paymentData) {
    return apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // Verificar status do pagamento
  static async getPaymentStatus(paymentId) {
    return apiRequest(`/payments/${paymentId}/status`);
  }

  // Solicitar reembolso
  static async requestRefund(reservationId, reason) {
    return apiRequest('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ reservation_id: reservationId, reason })
    });
  }
}
```

#### **Componente de Pagamento**
```jsx
// components/PaymentForm.jsx
import React, { useState } from 'react';
import { PaymentsService } from '../services/payments';

export function PaymentForm({ reservationCode, totalPrice }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const paymentData = {
        reservation_id: reservationCode,
        payment_method: paymentMethod
      };

      if (paymentMethod === 'credit_card') {
        paymentData.card_info = cardData;
      }

      const response = await PaymentsService.processPayment(paymentData);
      
      if (response.data.status === 'approved') {
        // Pagamento aprovado
        window.location.href = `/payment-success/${response.data.id}`;
      } else if (response.data.payment_url) {
        // Redirecionar para gateway de pagamento
        window.location.href = response.data.payment_url;
      } else if (response.data.pix_code) {
        // Mostrar código PIX
        showPixCode(response.data.pix_code);
      }
      
    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro no pagamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Pagamento - R$ {totalPrice.toFixed(2)}</h3>
      
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="credit_card"
            checked={paymentMethod === 'credit_card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cartão de Crédito
        </label>
        <label>
          <input
            type="radio"
            value="pix"
            checked={paymentMethod === 'pix'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          PIX
        </label>
        <label>
          <input
            type="radio"
            value="boleto"
            checked={paymentMethod === 'boleto'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Boleto
        </label>
      </div>

      {paymentMethod === 'credit_card' && (
        <div className="card-form">
          <input
            type="text"
            placeholder="Número do cartão"
            value={cardData.number}
            onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="MM/AA"
            value={cardData.expiry}
            onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="CVV"
            value={cardData.cvv}
            onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Nome no cartão"
            value={cardData.name}
            onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Processando...' : 'Pagar'}
      </button>
    </form>
  );
}
```

---

## 🎨 Exemplos de CSS

### **Estilos para Tours**
```css
/* styles/tours.css */
.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.tour-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.tour-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.tour-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.tour-card h3 {
  margin: 10px;
  font-size: 1.2em;
}

.tour-card .price {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c5aa0;
  margin: 10px;
}

.filters {
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f5f5f5;
  margin-bottom: 20px;
}

.filters input,
.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

### **Estilos para Reservas**
```css
/* styles/reservations.css */
.reservation-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #2c5aa0;
  box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.2);
}

button {
  background: #2c5aa0;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #1e3d6f;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

## 🔧 Utilitários Úteis

### **Validação de Formulários**
```javascript
// utils/validation.js
export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  phone: (phone) => {
    const regex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return regex.test(phone);
  },

  date: (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate >= today;
  },

  cardNumber: (number) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  },

  expiry: (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiry);
  }
};
```

### **Formatação de Dados**
```javascript
// utils/formatters.js
export const formatters = {
  currency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  date: (date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  },

  phone: (phone) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },

  cardNumber: (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
};
```

---

## 🚨 Tratamento de Erros

### **Interceptor de Erros**
```javascript
// utils/errorHandler.js
export class ErrorHandler {
  static handle(error) {
    console.error('API Error:', error);
    
    // Diferentes tipos de erro
    if (error.message.includes('404')) {
      return 'Recurso não encontrado';
    } else if (error.message.includes('400')) {
      return 'Dados inválidos';
    } else if (error.message.includes('500')) {
      return 'Erro interno do servidor';
    } else if (error.message.includes('Network')) {
      return 'Erro de conexão';
    }
    
    return 'Erro desconhecido';
  }

  static showToast(message, type = 'error') {
    // Implementar sistema de notificações
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}
```

---

## 📱 Exemplo Completo - Página de Tour

```jsx
// pages/TourDetails.jsx
import React, { useState, useEffect } from 'react';
import { ToursService } from '../services/tours';
import { ReservationsService } from '../services/reservations';
import { ReservationForm } from '../components/ReservationForm';

export function TourDetails({ tourId }) {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    loadTourDetails();
  }, [tourId]);

  const loadTourDetails = async () => {
    try {
      setLoading(true);
      const response = await ToursService.getTourDetails(tourId);
      setTour(response.data);
    } catch (error) {
      console.error('Erro ao carregar tour:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!tour) return <div>Tour não encontrado</div>;

  return (
    <div className="tour-details">
      <div className="tour-header">
        <h1>{tour.title}</h1>
        <p className="subtitle">{tour.subtitle}</p>
        <p className="price">{formatters.currency(tour.price)}</p>
      </div>

      <div className="tour-content">
        <div className="tour-images">
          {tour.images.map((image, index) => (
            <img key={index} src={image} alt={`${tour.title} ${index + 1}`} />
          ))}
        </div>

        <div className="tour-info">
          <h3>Descrição</h3>
          <p>{tour.description}</p>

          <h3>Duração</h3>
          <p>{tour.duration}</p>

          <h3>Localização</h3>
          <p>{tour.location}</p>

          <h3>Capacidade</h3>
          <p>{tour.min_people} - {tour.max_people} pessoas</p>

          {tour.includes && tour.includes.length > 0 && (
            <>
              <h3>Inclui</h3>
              <ul>
                {tour.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {tour.excludes && tour.excludes.length > 0 && (
            <>
              <h3>Não Inclui</h3>
              <ul>
                {tour.excludes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="tour-actions">
        <button 
          onClick={() => setShowReservationForm(true)}
          className="btn-primary"
        >
          Fazer Reserva
        </button>
      </div>

      {showReservationForm && (
        <div className="modal">
          <div className="modal-content">
            <span 
              className="close"
              onClick={() => setShowReservationForm(false)}
            >
              ×
            </span>
            <ReservationForm 
              tourId={tourId} 
              tourDetails={tour}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Resumo da Integração

### **Arquivos Necessários**
1. `config/api.js` - Configuração da API
2. `utils/http.js` - Helper para requisições
3. `services/tours.js` - Serviços de tours
4. `services/reservations.js` - Serviços de reservas
5. `services/payments.js` - Serviços de pagamentos
6. `utils/validation.js` - Validações
7. `utils/formatters.js` - Formatação de dados
8. `utils/errorHandler.js` - Tratamento de erros

### **Componentes Principais**
1. `ToursList` - Lista de tours com filtros
2. `TourDetails` - Detalhes de um tour
3. `ReservationForm` - Formulário de reserva
4. `PaymentForm` - Formulário de pagamento

### **Fluxo Completo**
1. **Listar Tours** → `ToursService.getTours()`
2. **Ver Detalhes** → `ToursService.getTourDetails()`
3. **Verificar Disponibilidade** → `ToursService.checkAvailability()`
4. **Criar Reserva** → `ReservationsService.createReservation()`
5. **Processar Pagamento** → `PaymentsService.processPayment()`

**🎉 Sua integração frontend está pronta!**
