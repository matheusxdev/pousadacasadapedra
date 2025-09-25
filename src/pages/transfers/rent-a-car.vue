<template>
  <div class="rent-a-car-page">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumbs__list">
          <li class="breadcrumbs__item">
            <NuxtLink :to="getNavRoute('/')" class="breadcrumbs__link">
              {{ $t('breadcrumbs.home') }}
            </NuxtLink>
          </li>
          <li class="breadcrumbs__item">
            <NuxtLink :to="getNavRoute('/transfers')" class="breadcrumbs__link">
              {{ $t('breadcrumbs.transfers') }}
            </NuxtLink>
          </li>
          <li class="breadcrumbs__item breadcrumbs__item--current">
            {{ $t('transfers.rentACar.title') }}
          </li>
        </ol>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <div class="hero__text">
            <h1>{{ $t('transfers.rentACar.title') }}</h1>
            <div class="accent"></div>
            <div class="hero__intro">
              <p class="lead">{{ $t('transfers.rentACar.hero.lead1') }}</p>
              <p class="lead">{{ $t('transfers.rentACar.hero.lead2') }}</p>
            </div>
            <p class="hero__description">
              {{ $t('transfers.rentACar.hero.description') }}
            </p>
            <a href="#form-car" class="cta">{{ $t('transfers.rentACar.hero.cta') }}</a>
          </div>
          <div class="hero__image">
            <img 
              src="/images/transfers/WhatsApp-Image-2022-10-10-at-13.28.29-1.png-768x576.webp" 
              alt="Carro para aluguel em Búzios"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Info Blocks -->
    <section class="info">
      <div class="container">
        <div class="info__content">
          <!-- Left Column -->
          <div class="info__left">
            <h2>{{ $t('transfers.rentACar.requirements.title') }}</h2>
            <div class="info__items">
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.requirements.age.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.requirements.age.description') }}</p>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6"/>
                    <path d="M16 13H8"/>
                    <path d="M16 17H8"/>
                    <path d="M10 9H8"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.requirements.documentation.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.requirements.documentation.description') }}</p>
                </div>
              </div>
            </div>

            <h3 class="subtitle">{{ $t('transfers.rentACar.requirements.cars.title') }}</h3>
            <div class="info__items">
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-5h-2.5l-1.5-6h-2l-1.5 6H10v5h2v-3h8v3h2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.requirements.cars.capacity.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.requirements.cars.capacity.description') }}</p>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.requirements.cars.mileage.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.requirements.cars.mileage.description') }}</p>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.requirements.cars.comfort.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.requirements.cars.comfort.description') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="info__right">
            <h2>{{ $t('transfers.rentACar.important.title') }}</h2>
            <div class="info__items">
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.important.fuel.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.important.fuel.description') }}</p>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.important.insurance.title') }}</h3>
                  <p>{{ $t('transfers.rentACar.important.insurance.description') }}</p>
                </div>
              </div>
            </div>
            <div class="info__image">
              <img 
                src="/images/transfers/rent-a-car-2.webp" 
                alt="Carro de aluguel"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us + Form -->
    <section class="why-and-form" id="form-car">
      <div class="container">
        <div class="why-and-form__content">
          <!-- Left: Why Choose Us -->
          <div class="why">
            <h2>{{ $t('transfers.rentACar.whyChoose.title') }}</h2>
            <div class="why__items">
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.whyChoose.flexibility') }}</h3>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.whyChoose.comfort') }}</h3>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.whyChoose.variety') }}</h3>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.whyChoose.unlimitedMileage') }}</h3>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <div>
                  <h3>{{ $t('transfers.rentACar.whyChoose.insurance') }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="form-card">
            <h3>{{ $t('transfers.rentACar.form.title') }}</h3>
            <p class="form-intro">{{ $t('transfers.rentACar.form.intro') }}</p>
            
            <form @submit.prevent="submit" class="form">
              <div class="form-group">
                <label for="pickupDate">{{ $t('transfers.rentACar.form.pickupDate') }} *</label>
                <input 
                  type="date" 
                  id="pickupDate"
                  v-model="form.pickupDate"
                  :class="{ error: errors.pickupDate }"
                />
                <div v-if="errors.pickupDate" class="error">{{ errors.pickupDate }}</div>
              </div>

              <div class="form-group">
                <label for="returnDate">{{ $t('transfers.rentACar.form.returnDate') }} *</label>
                <input 
                  type="date" 
                  id="returnDate"
                  v-model="form.returnDate"
                  :class="{ error: errors.returnDate }"
                />
                <div v-if="errors.returnDate" class="error">{{ errors.returnDate }}</div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">{{ $t('transfers.rentACar.form.firstName') }} *</label>
                  <input 
                    type="text" 
                    id="firstName"
                    v-model="form.firstName"
                    :class="{ error: errors.firstName }"
                  />
                  <div v-if="errors.firstName" class="error">{{ errors.firstName }}</div>
                </div>
                <div class="form-group">
                  <label for="lastName">{{ $t('transfers.rentACar.form.lastName') }} *</label>
                  <input 
                    type="text" 
                    id="lastName"
                    v-model="form.lastName"
                    :class="{ error: errors.lastName }"
                  />
                  <div v-if="errors.lastName" class="error">{{ errors.lastName }}</div>
                </div>
              </div>

              <div class="form-group">
                <label for="age">{{ $t('transfers.rentACar.form.age') }} *</label>
                <input 
                  type="number" 
                  id="age"
                  v-model="form.age"
                  min="26"
                  :class="{ error: errors.age }"
                />
                <div v-if="errors.age" class="error">{{ errors.age }}</div>
              </div>

              <div class="form-group">
                <label for="email">{{ $t('transfers.rentACar.form.email') }} *</label>
                <input 
                  type="email" 
                  id="email"
                  v-model="form.email"
                  :class="{ error: errors.email }"
                />
                <div v-if="errors.email" class="error">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label for="whatsapp">{{ $t('transfers.rentACar.form.whatsapp') }} *</label>
                <input 
                  type="tel" 
                  id="whatsapp"
                  v-model="form.whatsapp"
                  placeholder="(21) 99999-9999"
                  :class="{ error: errors.whatsapp }"
                />
                <div v-if="errors.whatsapp" class="error">{{ errors.whatsapp }}</div>
              </div>

              <div class="form-group">
                <label for="message">{{ $t('transfers.rentACar.form.question') }}</label>
                <textarea 
                  id="message"
                  v-model="form.message"
                  rows="4"
                  :placeholder="$t('transfers.rentACar.form.questionPlaceholder')"
                ></textarea>
              </div>

              <button type="submit" class="submit">{{ $t('transfers.rentACar.form.submit') }}</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <div class="success-content">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <h4>{{ $t('transfers.rentACar.form.success.title') }}</h4>
          <p>{{ $t('transfers.rentACar.form.success.message') }}</p>
        </div>
        <button @click="showSuccess = false" class="close-btn">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useSafeLocale } from '@/composables/useSafeLocale'

// Composables
const { getSafeLocale } = useSafeLocale()

// Navigation helper
const getNavRoute = (path: string) => {
  const currentLocale = getSafeLocale()
  if (currentLocale === 'pt') {
    return path
  } else {
    return `/${currentLocale}${path}`
  }
}

useHead({
  title: 'Rent a Car | Casa da Pedra',
  meta: [{ name: 'description', content: 'Aluguel de carros em Búzios com conforto, segurança e flexibilidade.' }]
})

// Reactive form state
const form = reactive({
  pickupDate: '',
  returnDate: '',
  firstName: '',
  lastName: '',
  age: '',
  email: '',
  whatsapp: '',
  message: ''
})

const errors = reactive<Record<string, string>>({})
const showSuccess = ref(false)

// Validation function
function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  
  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  
  if (!form.pickupDate) errors.pickupDate = 'Obrigatório'
  if (!form.returnDate) errors.returnDate = 'Obrigatório'
  if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate) {
    errors.returnDate = 'Retorno deve ser após a retirada'
  }
  if (!form.firstName) errors.firstName = 'Obrigatório'
  if (!form.lastName) errors.lastName = 'Obrigatório'
  if (!form.age || Number(form.age) < 26) errors.age = 'Idade mínima 26 anos'
  if (!form.email || !isEmail(form.email)) errors.email = 'Email inválido'
  if (!form.whatsapp) errors.whatsapp = 'Obrigatório'
  
  return Object.keys(errors).length === 0
}

// Submit function
function submit() {
  if (!validate()) return
  
  console.log('rent-a-car inquiry', { ...form })
  showSuccess.value = true
  
  // Reset form
  Object.keys(form).forEach(key => {
    form[key as keyof typeof form] = ''
  })
}

// Smooth scroll for CTA
onMounted(() => {
  const cta = document.querySelector('.cta')
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector('#form-car')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
})
</script>

<style scoped>
:root {
  --brand: #FF6700;
  --text: #0F172A;
  --muted: #6B7280;
  --bg-soft: #F7F7F9;
  --card: #FFFFFF;
  --border: #E5E7EB;
  --error: #DC2626;
  --success: #059669;
}

.rent-a-car-page {
  background: var(--bg-soft);
  min-height: 100vh;
}

/* Breadcrumbs */
.breadcrumbs {
  background: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
}

.breadcrumbs__item:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: #6c757d;
}

.breadcrumbs__link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumbs__link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.breadcrumbs__item--current {
  color: #6c757d;
  font-weight: 500;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Hero Section */
.hero {
  padding: 64px 0;
  background: var(--card);
}

.hero__content {
  display: grid;
  gap: 32px;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
}

@media (max-width: 1024px) {
  .hero__content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.hero__text h1 {
  font-size: clamp(28px, 4vw, 44px);
  color: var(--text);
  margin: 0 0 12px;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.accent {
  width: 72px;
  height: 4px;
  background: var(--brand);
  border-radius: 999px;
  margin: 12px 0 20px;
}

@media (max-width: 1024px) {
  .accent {
    margin: 12px auto 20px;
  }
}

.hero__intro {
  margin-bottom: 16px;
}

.hero__intro .lead {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.hero__description {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 24px;
  font-size: 1rem;
}

.cta {
  display: inline-block;
  background: var(--brand);
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 103, 0, 0.25);
}

.hero__image img {
  width: 100%;
  height: auto;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

/* Info Section */
.info {
  padding: 48px 0;
  background: var(--card);
}

.info__content {
  display: grid;
  gap: 48px;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 1024px) {
  .info__content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.info__left h2,
.info__right h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 24px;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 32px 0 16px;
}

.info__items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.item .icon {
  width: 24px;
  height: 24px;
  color: var(--brand);
  flex-shrink: 0;
  margin-top: 2px;
}

.item h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
}

.item p {
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
  font-size: 0.875rem;
}

.info__image {
  margin-top: 24px;
}

.info__image img {
  width: 100%;
  height: auto;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

/* Why and Form Section */
.why-and-form {
  padding: 64px 0;
  background: var(--bg-soft);
}

.why-and-form__content {
  display: grid;
  gap: 48px;
  grid-template-columns: 1fr 1.1fr;
}

@media (max-width: 1024px) {
  .why-and-form__content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.why h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 24px;
}

.why__items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.why .item h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
}

.why .item p {
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
  font-size: 0.875rem;
}

/* Form Card */
.form-card {
  background: var(--card);
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  padding: 24px;
}

.form-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.form-intro {
  color: var(--muted);
  line-height: 1.5;
  margin-bottom: 24px;
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 6px;
}

.form input,
.form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  outline: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form input:focus,
.form textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(255, 103, 0, 0.15);
}

.form input.error,
.form textarea.error {
  border-color: var(--error);
}

.error {
  color: var(--error);
  font-size: 12px;
  margin-top: 6px;
}

.submit {
  margin-top: 12px;
  background: var(--brand);
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 103, 0, 0.25);
}

/* Success Message */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--success);
  color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(5, 150, 105, 0.25);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.success-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.success-content h4 {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 600;
}

.success-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 32px 0;
  }
  
  .info {
    padding: 32px 0;
  }
  
  .why-and-form {
    padding: 32px 0;
  }
  
  .form-card {
    padding: 20px;
  }
}
</style>