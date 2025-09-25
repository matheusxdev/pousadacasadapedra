<template>
  <div class="contact-page">
    <div class="container">
      <h1>Entre em Contato</h1>
      <p>Estamos aqui para ajudar você a planejar sua viagem perfeita</p>
      
      <div class="contact-content">
        <div class="contact-info">
          <h2>Informações de Contato</h2>
          
          <div class="contact-item">
            <h3>Telefone</h3>
            <p><a href="https://wa.me/5522997892414" target="_blank" rel="noopener">+55 22 99789-2414</a></p>
          </div>
          
          <div class="contact-item">
            <h3>Email</h3>
            <p><a href="mailto:turismo@casadapedra.net">turismo@casadapedra.net</a></p>
          </div>
          
          <div class="contact-item">
            <h3>Endereço</h3>
            <p><a href="https://www.google.com/maps?q=Travessa+L%C3%BAcio+Ant%C3%B4nio+Quintanilha,+57,+B%C3%BAzios+-+RJ,+28950-835" target="_blank" rel="noopener">Travessa Lúcio Antônio Quintanilha, 57<br>Centro, Búzios - RJ<br>CEP: 28950-835</a></p>
          </div>
          
          <div class="contact-item">
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 9h às 18h<br>Sábado: 9h às 14h<br>Domingo: Fechado</p>
          </div>
        </div>
        
        <div class="contact-form">
          <h2>Envie sua Mensagem</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Nome</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            
            <div class="form-group">
              <label for="phone">Telefone</label>
              <input type="tel" id="phone" v-model="form.phone" />
            </div>
            
            <div class="form-group">
              <label for="subject">Assunto</label>
              <select id="subject" v-model="form.subject" required>
                <option value="">Selecione um assunto</option>
                <option value="tour">Informações sobre Tours</option>
                <option value="accommodation">Informações sobre Acomodações</option>
                <option value="booking">Reservas</option>
                <option value="other">Outros</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="message">Mensagem</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    
    // Limpar formulário
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    alert('Erro ao enviar mensagem. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding: 2rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h2,
.contact-form h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.contact-item {
  margin-bottom: 2rem;
}

.contact-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #007bff;
}

.contact-item p {
  color: #666;
  margin-bottom: 0;
}

.contact-item p a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-item p a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
