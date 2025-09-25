<template>
  <main class="page">
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
            {{ $t('transfers.regular.title') }}
          </li>
        </ol>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero container">
      <div class="hero__text">
        <h1>{{ $t('transfers.regular.title') }}</h1>
        <p class="lead">
          {{ $t('transfers.regular.hero.description') }}
          {{ $t('transfers.regular.hero.price') }}
        </p>
        <button class="btn btn-primary" @click="scrollToForm">{{ $t('transfers.regular.hero.cta') }}</button>
      </div>
      <div class="hero__media">
        <img
          class="hero__img"
          src="/images/transfers/Transfer-Regular-6.webp"
          alt="Ônibus de transfer regular"
          loading="eager"
        />
      </div>
    </section>

    <!-- Content + Form -->
    <section class="container grid">
      <div class="col left">
        <article class="block">
          <h2>{{ $t('transfers.regular.transferOut.title') }}</h2>
          <ul class="bullets">
            <li><b>{{ $t('transfers.regular.transferOut.hotels') }}</b></li>
            <li><b>{{ $t('transfers.regular.transferOut.airport') }}</b></li>
          </ul>
        </article>

        <article class="block">
          <h2>{{ $t('transfers.regular.transferIn.title') }}</h2>
          <ul class="bullets">
            <li><b>{{ $t('transfers.regular.transferIn.hotels') }}</b></li>
            <li>{{ $t('transfers.regular.transferIn.alternative') }}</li>
          </ul>
        </article>

        <article class="block">
          <h2>{{ $t('transfers.regular.reservations.title') }}</h2>
          <p>{{ $t('transfers.regular.reservations.description') }}</p>
        </article>

        <article class="block">
          <h2>{{ $t('transfers.regular.important.title') }}</h2>
          <ul class="bullets">
            <li>{{ $t('transfers.regular.important.availability') }}</li>
            <li>{{ $t('transfers.regular.important.payment') }}</li>
            <li>{{ $t('transfers.regular.important.flightInfo') }}</li>
          </ul>
        </article>
      </div>

      <div class="col right" id="form-regular">
        <form class="card form" @submit.prevent="onSubmit" novalidate>
          <h3>{{ $t('transfers.regular.form.title') }}</h3>

          <label>
            <span>{{ $t('transfers.regular.form.serviceDate') }} *</span>
            <input type="date" v-model="form.serviceDate" required aria-required="true" />
          </label>

          <label>
            <span>{{ $t('transfers.regular.form.people') }} *</span>
            <select v-model.number="form.people" required aria-required="true">
              <option disabled value="">{{ $t('transfers.regular.form.selectPeople') }}</option>
              <option v-for="n in 20" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>

          <label>
            <span>{{ $t('transfers.regular.form.originCity') }} *</span>
            <textarea v-model="form.originCity" required aria-required="true" rows="2" />
          </label>

          <label>
            <span>{{ $t('transfers.regular.form.destinationCity') }} *</span>
            <textarea v-model="form.destinationCity" required aria-required="true" rows="2" />
          </label>

          <div class="row">
            <label class="grow">
              <span>{{ $t('transfers.regular.form.firstName') }} *</span>
              <input type="text" v-model="form.firstName" required aria-required="true" />
            </label>
            <label class="grow">
              <span>{{ $t('transfers.regular.form.lastName') }} *</span>
              <input type="text" v-model="form.lastName" required aria-required="true" />
            </label>
          </div>

          <label>
            <span>{{ $t('transfers.regular.form.email') }} *</span>
            <input type="email" v-model="form.email" required aria-required="true" />
          </label>

          <label>
            <span>{{ $t('transfers.regular.form.whatsapp') }} *</span>
            <input type="tel" v-model="form.whatsapp" required aria-required="true" />
          </label>

          <label>
            <span>{{ $t('transfers.regular.form.question') }}</span>
            <textarea v-model="form.question" rows="3" />
          </label>

          <button class="btn btn-primary" :disabled="!isValid">{{ $t('transfers.regular.form.submit') }}</button>

          <p v-if="sent" class="success">{{ $t('transfers.regular.form.success') }}</p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  title: 'Transfer Regular | Casa da Pedra',
  meta: [{ name: 'description', content: 'Transfer regular compartilhado entre Búzios e Rio de Janeiro. US$ 150 por pessoa incluindo bagagem.' }]
})

const form = ref({
  serviceDate: '',
  people: 1 as number,
  originCity: '',
  destinationCity: '',
  firstName: '',
  lastName: '',
  email: '',
  whatsapp: '',
  question: ''
})

const isValid = computed(() => {
  const f = form.value
  return !!(f.serviceDate && f.people && f.originCity && f.destinationCity && f.firstName && f.lastName && f.email && f.whatsapp)
})

const sent = ref(false)

function scrollToForm() {
  const el = document.getElementById('form-regular')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function onSubmit() {
  if (!isValid.value) return
  // TODO: POST to /api/leads
  console.log('transfer-regular-lead', { ...form.value, product: 'transfer-regular' })
  sent.value = true
  setTimeout(() => (sent.value = false), 6000)
}
</script>

<style scoped>
.page { 
  padding-bottom: 4rem; 
  background: #f9fafb;
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
  max-width: 1160px; 
  margin: 0 auto; 
  padding: 0 16px; 
}

.hero { 
  display: grid; 
  grid-template-columns: 1.1fr 1fr; 
  gap: 32px; 
  align-items: center; 
  padding: 32px 0; 
}

.hero__text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0F172A;
  margin-bottom: 16px;
}

.hero__img { 
  width: 100%; 
  height: auto; 
  border-radius: 16px; 
  box-shadow: 0 10px 30px rgba(0,0,0,.08); 
  object-fit: cover; 
}

.lead { 
  font-size: 1.05rem; 
  opacity: .9; 
  margin: 12px 0 20px; 
  line-height: 1.6;
  color: #4B5563;
}

.btn { 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  padding: 12px 18px; 
  border-radius: 999px; 
  font-weight: 600; 
  transition: transform .12s ease, box-shadow .12s ease;
  border: none;
  cursor: pointer;
  min-height: 44px;
}

.btn-primary { 
  background: #FF6700; 
  color: #fff; 
  box-shadow: 0 6px 16px rgba(255,103,0,.24); 
}

.btn-primary:hover:not(:disabled) { 
  transform: translateY(-1px); 
  box-shadow: 0 10px 24px rgba(255,103,0,.3); 
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.grid { 
  display: grid; 
  grid-template-columns: 1fr 0.9fr; 
  gap: 40px; 
  margin-top: 24px; 
}

.block { 
  background: #fff; 
  border-radius: 16px; 
  padding: 20px; 
  box-shadow: 0 6px 24px rgba(0,0,0,.06); 
  margin-bottom: 18px; 
}

.block h2 { 
  font-size: 1.1rem; 
  margin-bottom: 10px; 
  color: #0F172A;
  font-weight: 600;
}

.block p {
  color: #4B5563;
  line-height: 1.6;
}

.bullets { 
  display: grid; 
  gap: 8px; 
  list-style: none;
  padding: 0;
}

.bullets li {
  color: #4B5563;
  line-height: 1.6;
}

.bullets b {
  color: #0F172A;
  font-weight: 600;
}

.card.form { 
  background: #fff; 
  border-radius: 16px; 
  padding: 20px; 
  box-shadow: 0 6px 24px rgba(0,0,0,.06); 
  position: sticky; 
  top: 24px; 
}

.form h3 { 
  margin-bottom: 12px; 
  color: #0F172A;
  font-weight: 600;
}

label { 
  display: grid; 
  gap: 6px; 
  margin-bottom: 12px; 
  font-weight: 500; 
  color: #374151;
}

label span {
  font-size: 0.9rem;
}

input, select, textarea {
  width: 100%; 
  border: 1px solid #e6e6e6; 
  border-radius: 12px; 
  padding: 10px 12px;
  outline: none; 
  transition: border-color .12s ease, box-shadow .12s ease; 
  background: #fff;
  font-size: 1rem;
}

input:focus, select:focus, textarea:focus { 
  border-color: #FF6700; 
  box-shadow: 0 0 0 3px rgba(255,103,0,.16); 
}

.row { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px; 
}

.grow { 
  display: grid; 
}

.success { 
  color: #0a7c3b; 
  margin-top: 8px; 
  font-weight: 600; 
}

@media (max-width: 1024px) {
  .hero { 
    grid-template-columns: 1fr; 
    gap: 24px;
  }
  
  .hero__text h1 {
    font-size: 2rem;
  }
  
  .grid { 
    grid-template-columns: 1fr; 
    gap: 24px;
  }
  
  .card.form { 
    position: static; 
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 12px;
  }
  
  .hero {
    padding: 24px 0;
  }
  
  .hero__text h1 {
    font-size: 1.75rem;
  }
  
  .lead {
    font-size: 1rem;
  }
  
  .block {
    padding: 16px;
  }
  
  .card.form {
    padding: 16px;
  }
  
  .row {
    grid-template-columns: 1fr;
  }
}
</style>