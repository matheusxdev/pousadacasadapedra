<template>
  <div class="private-transfer-page">
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
            {{ $t('transfers.private.title') }}
          </li>
        </ol>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <div class="hero__text">
            <h1 class="hero__title">{{ $t('transfers.private.title') }}</h1>
            <p class="hero__kicker">{{ $t('transfers.private.kicker') }}</p>
            <p class="hero__description">{{ $t('transfers.private.hero.copyLine1') }}</p>
            <button 
              @click="scrollToForm" 
              class="hero__cta"
              :class="{ 'hero__cta--loading': isScrolling }"
            >
              {{ $t('transfers.private.hero.cta') }}
            </button>
          </div>
          <div class="hero__image">
            <img 
              src="/images/transfers/private-hero.jpg" 
              :alt="$t('transfers.private.title')"
              class="hero__img"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Service Details & Form -->
    <section class="service-details">
      <div class="container">
        <div class="service-details__content">
          <!-- Left Column: Service Details -->
          <div class="service-details__info">
            <!-- About Section -->
            <div class="info-block">
              <h2 class="info-block__title">{{ $t('transfers.private.about.title') }}</h2>
              <p class="info-block__paragraph">{{ $t('transfers.private.about.paragraph') }}</p>
            </div>

            <!-- Flight Section -->
            <div class="info-block">
              <h3 class="info-block__subtitle">{{ $t('transfers.private.flight.title') }}</h3>
              <ul class="info-block__list">
                <li class="info-block__item">
                  <Icon name="mdi:airplane-takeoff" class="info-block__icon" />
                  {{ $t('transfers.private.flight.b1') }}
                </li>
                <li class="info-block__item">
                  <Icon name="mdi:shield-check" class="info-block__icon" />
                  {{ $t('transfers.private.flight.b2') }}
                </li>
                <li class="info-block__item">
                  <Icon name="mdi:information" class="info-block__icon" />
                  {{ $t('transfers.private.flight.b3') }}
                </li>
              </ul>
            </div>

            <!-- Booking Section -->
            <div class="info-block">
              <h3 class="info-block__subtitle">{{ $t('transfers.private.booking.title') }}</h3>
              <p class="info-block__paragraph">{{ $t('transfers.private.booking.p') }}</p>
            </div>

            <!-- Supporting Image -->
            <div class="info-block__image">
              <img 
                src="/images/transfers/private-inline.jpg" 
                :alt="$t('transfers.private.title')"
                class="info-block__img"
              />
            </div>
          </div>

          <!-- Right Column: Form -->
          <div class="service-details__form">
            <form @submit.prevent="handleSubmit" class="form-card">
              <h2 class="form-card__title">{{ $t('transfers.private.form.title') }}</h2>
              
              <div class="form-card__fields">
                <!-- Date -->
                <div class="form-field">
                  <label for="date" class="form-field__label">
                    {{ $t('transfers.private.form.date') }} *
                  </label>
                  <input
                    id="date"
                    v-model="form.date"
                    type="date"
                    class="form-field__input"
                    :class="{ 'form-field__input--error': errors.date }"
                    required
                    aria-required="true"
                  />
                  <span v-if="errors.date" class="form-field__error">{{ errors.date }}</span>
                </div>

                <!-- People -->
                <div class="form-field">
                  <label for="people" class="form-field__label">
                    {{ $t('transfers.private.form.people') }} *
                  </label>
                  <input
                    id="people"
                    v-model.number="form.people"
                    type="number"
                    min="1"
                    max="20"
                    class="form-field__input"
                    :class="{ 'form-field__input--error': errors.people }"
                    required
                    aria-required="true"
                  />
                  <span v-if="errors.people" class="form-field__error">{{ errors.people }}</span>
                </div>

                <!-- Origin -->
                <div class="form-field">
                  <label for="origin" class="form-field__label">
                    {{ $t('transfers.private.form.origin') }} *
                  </label>
                  <textarea
                    id="origin"
                    v-model="form.origin"
                    class="form-field__textarea"
                    :class="{ 'form-field__textarea--error': errors.origin }"
                    rows="2"
                    required
                    aria-required="true"
                  ></textarea>
                  <span v-if="errors.origin" class="form-field__error">{{ errors.origin }}</span>
                </div>

                <!-- Destination -->
                <div class="form-field">
                  <label for="destination" class="form-field__label">
                    {{ $t('transfers.private.form.destination') }} *
                  </label>
                  <textarea
                    id="destination"
                    v-model="form.destination"
                    class="form-field__textarea"
                    :class="{ 'form-field__textarea--error': errors.destination }"
                    rows="2"
                    required
                    aria-required="true"
                  ></textarea>
                  <span v-if="errors.destination" class="form-field__error">{{ errors.destination }}</span>
                </div>

                <!-- Name Fields -->
                <div class="form-field-group">
                  <div class="form-field">
                    <label for="firstName" class="form-field__label">
                      {{ $t('transfers.private.form.firstName') }} *
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="form-field__input"
                      :class="{ 'form-field__input--error': errors.firstName }"
                      required
                      aria-required="true"
                    />
                    <span v-if="errors.firstName" class="form-field__error">{{ errors.firstName }}</span>
                  </div>

                  <div class="form-field">
                    <label for="lastName" class="form-field__label">
                      {{ $t('transfers.private.form.lastName') }} *
                    </label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="form-field__input"
                      :class="{ 'form-field__input--error': errors.lastName }"
                      required
                      aria-required="true"
                    />
                    <span v-if="errors.lastName" class="form-field__error">{{ errors.lastName }}</span>
                  </div>
                </div>

                <!-- Contact Fields -->
                <div class="form-field-group">
                  <div class="form-field">
                    <label for="email" class="form-field__label">
                      {{ $t('transfers.private.form.email') }} *
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-field__input"
                      :class="{ 'form-field__input--error': errors.email }"
                      required
                      aria-required="true"
                    />
                    <span v-if="errors.email" class="form-field__error">{{ errors.email }}</span>
                  </div>

                  <div class="form-field">
                    <label for="whatsapp" class="form-field__label">
                      {{ $t('transfers.private.form.whatsapp') }} *
                    </label>
                    <input
                      id="whatsapp"
                      v-model="form.whatsapp"
                      type="tel"
                      class="form-field__input"
                      :class="{ 'form-field__input--error': errors.whatsapp }"
                      required
                      aria-required="true"
                    />
                    <span v-if="errors.whatsapp" class="form-field__error">{{ errors.whatsapp }}</span>
                  </div>
                </div>

                <!-- Notes -->
                <div class="form-field">
                  <label for="notes" class="form-field__label">
                    {{ $t('transfers.private.form.notes') }}
                  </label>
                  <textarea
                    id="notes"
                    v-model="form.notes"
                    class="form-field__textarea"
                    rows="3"
                    placeholder=""
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                class="form-card__submit"
                :disabled="!isFormValid || isSubmitting"
              >
                <span v-if="isSubmitting">Enviando...</span>
                <span v-else>{{ $t('transfers.private.form.submit') }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Toast -->
    <div 
      v-if="showSuccess" 
      class="toast toast--success"
      role="alert"
      aria-live="polite"
    >
      <Icon name="mdi:check-circle" class="toast__icon" />
      <div class="toast__content">
        <h4 class="toast__title">{{ $t('transfers.private.form.success') }}</h4>
      </div>
      <button @click="showSuccess = false" class="toast__close" aria-label="Fechar">
        <Icon name="mdi:close" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSafeLocale } from '@/composables/useSafeLocale'

// Composables
const { t } = useI18n()
const { getSafeLocale } = useSafeLocale()

// SEO
useHead({
  title: () => `${t('transfers.private.title')} | Casa da Pedra`,
  meta: [
    {
      name: 'description',
      content: () => t('transfers.private.metaDescription')
    },
    {
      property: 'og:title',
      content: () => `${t('transfers.private.title')} | Casa da Pedra`
    },
    {
      property: 'og:description',
      content: () => t('transfers.private.metaDescription')
    },
    {
      property: 'og:image',
      content: '/images/transfers/private-hero.jpg'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: () => {
        const currentLocale = getSafeLocale()
        return currentLocale === 'pt' 
          ? '/transfers/private' 
          : `/${currentLocale}/transfers/private`
      }
    }
  ]
})

// Reactive state
const form = reactive({
  date: '',
  people: 1,
  origin: '',
  destination: '',
  firstName: '',
  lastName: '',
  email: '',
  whatsapp: '',
  notes: ''
})

const errors = reactive({
  date: '',
  people: '',
  origin: '',
  destination: '',
  firstName: '',
  lastName: '',
  email: '',
  whatsapp: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const isScrolling = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.date && 
         form.people > 0 && 
         form.origin.trim() && 
         form.destination.trim() && 
         form.firstName.trim() && 
         form.lastName.trim() && 
         form.email.trim() && 
         form.whatsapp.trim() &&
         Object.values(errors).every(error => !error)
})

// Methods
const getNavRoute = (path: string) => {
  const currentLocale = getSafeLocale()
  if (currentLocale === 'pt') {
    return path
  } else {
    return `/${currentLocale}${path}`
  }
}

const scrollToForm = async () => {
  isScrolling.value = true
  try {
    await document.getElementById('transfer-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  } finally {
    setTimeout(() => {
      isScrolling.value = false
    }, 1000)
  }
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Date validation
  if (!form.date) {
    errors.date = 'Data é obrigatória'
  } else {
    const selectedDate = new Date(form.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      errors.date = 'Data deve ser futura'
    }
  }

  // People validation
  if (!form.people || form.people < 1) {
    errors.people = 'Número de pessoas deve ser pelo menos 1'
  } else if (form.people > 20) {
    errors.people = 'Máximo 20 pessoas'
  }

  // Required fields
  if (!form.origin.trim()) errors.origin = 'Cidade de origem é obrigatória'
  if (!form.destination.trim()) errors.destination = 'Cidade de destino é obrigatória'
  if (!form.firstName.trim()) errors.firstName = 'Nome é obrigatório'
  if (!form.lastName.trim()) errors.lastName = 'Sobrenome é obrigatório'

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido'
  }

  // WhatsApp validation
  if (!form.whatsapp.trim()) {
    errors.whatsapp = 'WhatsApp é obrigatório'
  }
}

const handleSubmit = async () => {
  validateForm()
  
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log payload
    console.log('Private Transfer Form Submission:', {
      ...form,
      timestamp: new Date().toISOString(),
      locale: getSafeLocale()
    })

    // Show success
    showSuccess.value = true
    
    // Reset form
    Object.assign(form, {
      date: '',
      people: 1,
      origin: '',
      destination: '',
      firstName: '',
      lastName: '',
      email: '',
      whatsapp: '',
      notes: ''
    })

    // Auto-hide success after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Add form ID for scroll target
onMounted(() => {
  const formElement = document.querySelector('.form-card')
  if (formElement) {
    formElement.id = 'transfer-form'
  }
})
</script>

<style scoped>
.private-transfer-page {
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

/* Hero Section */
.hero {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.hero__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero__title {
  font-size: 3rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.hero__kicker {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #FF6700;
  margin: 0 0 1rem 0;
}

.hero__description {
  font-size: 1.125rem;
  color: #495057;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.hero__cta {
  background: #FF6700;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(255, 103, 0, 0.2);
}

.hero__cta:hover {
  background: #E55A00;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 103, 0, 0.3);
}

.hero__cta:focus-visible {
  outline: 2px solid #FF6700;
  outline-offset: 2px;
}

.hero__cta--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.hero__image {
  position: relative;
}

.hero__img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Service Details */
.service-details {
  padding: 4rem 0;
}

.service-details__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* Info Blocks */
.info-block {
  margin-bottom: 2rem;
}

.info-block__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 1rem 0;
}

.info-block__subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 0.75rem 0;
}

.info-block__paragraph {
  font-size: 1rem;
  color: #495057;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.info-block__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-block__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #495057;
  line-height: 1.5;
}

.info-block__icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #FF6700;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-block__image {
  margin-top: 2rem;
}

.info-block__img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Form Card */
.form-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.form-card__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.form-card__fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-field__input,
.form-field__textarea {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-field__input:focus,
.form-field__textarea:focus {
  outline: none;
  border-color: #FF6700;
  box-shadow: 0 0 0 3px rgba(255, 103, 0, 0.1);
}

.form-field__input--error,
.form-field__textarea--error {
  border-color: #dc3545;
}

.form-field__error {
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

.form-field__textarea {
  resize: vertical;
  min-height: 2.5rem;
}

.form-card__submit {
  width: 100%;
  background: #FF6700;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.form-card__submit:hover:not(:disabled) {
  background: #E55A00;
  transform: translateY(-1px);
}

.form-card__submit:focus-visible {
  outline: 2px solid #FF6700;
  outline-offset: 2px;
}

.form-card__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Toast */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast--success {
  border-left: 4px solid #28a745;
}

.toast__icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #28a745;
}

.toast__title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
  margin: 0;
}

.toast__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6c757d;
  transition: color 0.2s ease;
}

.toast__close:hover {
  color: #495057;
}

/* Responsive */
@media (max-width: 768px) {
  .hero__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero__title {
    font-size: 2rem;
  }

  .service-details__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .form-field-group {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 1.5rem;
  }

  .toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
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
</style>