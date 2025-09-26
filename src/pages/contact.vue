<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="contact-hero__background">
        <div class="contact-hero__media">
          <img 
            :src="heroImage" 
            alt="Grupo Caminué em Búzios"
            class="contact-hero__image"
          >
        </div>
        <div class="contact-hero__overlay"></div>
      </div>
      
      <div class="container">
        <div class="contact-hero__content">
          <div class="contact-hero__text">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
              <NuxtLink to="/">{{ $t('breadcrumbs.home') }}</NuxtLink>
              <Icon name="heroicons:chevron-right" />
              <span>{{ $t('nav.contact') }}</span>
            </div>
            
            <h1>{{ $t('contact.title') }}</h1>
            <p>{{ $t('contact.subtitle') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-main">
      <div class="container">
        <div class="contact-content">
          <!-- Contact Info -->
          <div class="contact-info">
            <div class="contact-info__header">
              <div class="contact-info__badge">Informações</div>
              <h2>{{ $t('contact.info.title') }}</h2>
              <p>{{ $t('contact.info.description') }}</p>
            </div>
            
            <div class="contact-info__grid">
              <div class="contact-info__card">
                <div class="contact-info__icon">
                  <Icon name="heroicons:device-phone-mobile" />
                </div>
                <div class="contact-info__content">
                  <h3>{{ $t('contact.info.phone.title') }}</h3>
                  <p><a href="https://wa.me/5522997892414" target="_blank" rel="noopener">+55 22 99789-2414</a></p>
                  <span class="contact-info__note">{{ $t('contact.info.phone.note') }}</span>
                </div>
              </div>
              
              <div class="contact-info__card">
                <div class="contact-info__icon">
                  <Icon name="heroicons:envelope" />
                </div>
                <div class="contact-info__content">
                  <h3>{{ $t('contact.info.email.title') }}</h3>
                  <p><a href="mailto:turismo@casadapedra.net">turismo@casadapedra.net</a></p>
                  <span class="contact-info__note">{{ $t('contact.info.email.note') }}</span>
                </div>
              </div>
              
              <div class="contact-info__card">
                <div class="contact-info__icon">
                  <Icon name="heroicons:map-pin" />
                </div>
                <div class="contact-info__content">
                  <h3>{{ $t('contact.info.address.title') }}</h3>
                  <p>
                    <a href="https://www.google.com/maps?q=Travessa+L%C3%BAcio+Ant%C3%B4nio+Quintanilha,+57,+B%C3%BAzios+-+RJ,+28950-835" target="_blank" rel="noopener">
                      Travessa Lúcio Antônio Quintanilha, 57<br>
                      Centro, Búzios - RJ<br>
                      CEP: 28950-835
                    </a>
                  </p>
                  <span class="contact-info__note">{{ $t('contact.info.address.note') }}</span>
                </div>
              </div>
              
              <div class="contact-info__card">
                <div class="contact-info__icon">
                  <Icon name="heroicons:clock" />
                </div>
                <div class="contact-info__content">
                  <h3>{{ $t('contact.info.hours.title') }}</h3>
                  <p>
                    {{ $t('contact.info.hours.weekdays') }}<br>
                    {{ $t('contact.info.hours.saturday') }}<br>
                    {{ $t('contact.info.hours.sunday') }}
                  </p>
                  <span class="contact-info__note">{{ $t('contact.info.hours.note') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="contact-form">
            <div class="contact-form__header">
              <div class="contact-form__badge">Mensagem</div>
              <h2>{{ $t('contact.form.title') }}</h2>
              <p>{{ $t('contact.form.description') }}</p>
            </div>
            
            <form @submit.prevent="submitForm" class="contact-form__form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">{{ $t('contact.form.name') }}</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    required 
                    :placeholder="$t('contact.form.namePlaceholder')"
                  />
                </div>
                
                <div class="form-group">
                  <label for="email">{{ $t('contact.form.email') }}</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email" 
                    required 
                    :placeholder="$t('contact.form.emailPlaceholder')"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="phone">{{ $t('contact.form.phone') }}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="form.phone" 
                    :placeholder="$t('contact.form.phonePlaceholder')"
                  />
                </div>
                
                <div class="form-group">
                  <label for="subject">{{ $t('contact.form.subject') }}</label>
                  <select id="subject" v-model="form.subject" required>
                    <option value="">{{ $t('contact.form.subjectPlaceholder') }}</option>
                    <option value="tour">{{ $t('contact.form.subjects.tour') }}</option>
                    <option value="accommodation">{{ $t('contact.form.subjects.accommodation') }}</option>
                    <option value="booking">{{ $t('contact.form.subjects.booking') }}</option>
                    <option value="other">{{ $t('contact.form.subjects.other') }}</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="message">{{ $t('contact.form.message') }}</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="6" 
                  required 
                  :placeholder="$t('contact.form.messagePlaceholder')"
                ></textarea>
              </div>
              
              <button type="submit" class="contact-form__button" :disabled="isSubmitting">
                <Icon v-if="!isSubmitting" name="heroicons:paper-airplane" />
                <Icon v-else name="heroicons:arrow-path" class="animate-spin" />
                {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.send') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="contact-map">
      <div class="container">
        <div class="contact-map__header">
          <div class="contact-map__badge">Localização</div>
          <h2>{{ $t('contact.map.title') }}</h2>
          <p>{{ $t('contact.map.description') }}</p>
        </div>
        
        <div class="contact-map__container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.1234567890123!2d-41.8825!3d-22.7539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ1JzE0LjAiUyA0McKwNTInNTcuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            class="contact-map__iframe"
          ></iframe>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Dynamic hero image based on time of day
const heroImage = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  
  // Dia: 6h às 18h (hero_light)
  // Noite: 18h às 6h (hero_night)
  if (hour >= 6 && hour < 18) {
    return '/images/hero_light.PNG'
  } else {
    return '/images/hero_night.JPG'
  }
})

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
    await new Promise(resolve => setTimeout(resolve, 2000))
    
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

useHead({
  title: 'Contato - Grupo Caminué',
  meta: [
    { name: 'description', content: 'Entre em contato com o Grupo Caminué em Búzios. Estamos aqui para ajudar você a planejar sua viagem perfeita.' }
  ]
})
</script>

<style scoped>
/* Reset e base */
.contact-page {
  min-height: 100vh;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.breadcrumb a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: white;
}

/* Hero Section */
.contact-hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.contact-hero__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.contact-hero__media {
  width: 100%;
  height: 100%;
  position: relative;
}

.contact-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.contact-hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 34, 121, 0.7) 0%,
    rgba(0, 29, 92, 0.6) 30%,
    rgba(30, 64, 175, 0.5) 70%,
    rgba(59, 130, 246, 0.4) 100%
  );
}

.contact-hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.contact-hero__text {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
}

.contact-hero__text h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-hero__text p {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Badge comum */
.contact-info__badge,
.contact-form__badge,
.contact-map__badge {
  display: inline-block;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

/* Contact Main */
.contact-main {
  padding: 6rem 0;
  background: #f8f9fa;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* Contact Info */
.contact-info__header {
  margin-bottom: 3rem;
}

.contact-info__header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.contact-info__header p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
}

.contact-info__grid {
  display: grid;
  gap: 2rem;
}

.contact-info__card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.contact-info__card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #1E3A8A;
}

.contact-info__icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}

.contact-info__icon svg {
  width: 30px;
  height: 30px;
}

.contact-info__content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
}

.contact-info__content p {
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.contact-info__content p a {
  color: #1E3A8A;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-info__content p a:hover {
  color: #3B82F6;
  text-decoration: underline;
}

.contact-info__note {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

/* Contact Form */
.contact-form__header {
  margin-bottom: 3rem;
}

.contact-form__header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.contact-form__header p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
}

.contact-form__form {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1E3A8A;
  background: white;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form__button {
  width: 100%;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.contact-form__button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
}

.contact-form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Map Section */
.contact-map {
  padding: 6rem 0;
  background: white;
}

.contact-map__header {
  text-align: center;
  margin-bottom: 4rem;
}

.contact-map__header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.contact-map__header p {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.contact-map__container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.contact-map__iframe {
  width: 100%;
  height: 400px;
  border: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .contact-hero {
    height: 70vh;
    min-height: 400px;
  }
  
  .breadcrumb {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    margin-bottom: 1.5rem;
  }
  
  .contact-main,
  .contact-map {
    padding: 4rem 0;
  }
  
  .contact-info__header h2,
  .contact-form__header h2,
  .contact-map__header h2 {
    font-size: 2rem;
  }
  
  .contact-form__form {
    padding: 2rem;
  }
  
  .contact-info__card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-form__form {
    padding: 1.5rem;
  }
  
  .contact-info__card {
    padding: 1rem;
  }
  
  .contact-map__iframe {
    height: 300px;
  }
}
</style>