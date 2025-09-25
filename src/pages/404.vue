<template>
  <div class="not-found-page">
    <div class="not-found-page__container">
      <div class="not-found-page__content">
        <div class="not-found-page__illustration">
          <div class="not-found-page__number">404</div>
          <div class="not-found-page__icon">
            <Icon name="heroicons:map" />
          </div>
        </div>
        
        <h1 class="not-found-page__title">
          {{ $t('error.notFound.title') }}
        </h1>
        
        <p class="not-found-page__message">
          {{ $t('error.notFound.message') }}
        </p>
        
        <div class="not-found-page__suggestions">
          <h3>{{ $t('error.notFound.suggestions') }}</h3>
          <ul>
            <li>
              <NuxtLink to="/tours">{{ $t('nav.tours') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/accommodations">{{ $t('nav.accommodations') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/">{{ $t('nav.home') }}</NuxtLink>
            </li>
          </ul>
        </div>
        
        <div class="not-found-page__actions">
          <NuxtLink to="/" class="not-found-page__button not-found-page__button--primary">
            <Icon name="heroicons:home" />
            {{ $t('error.goHome') }}
          </NuxtLink>
          
          <button @click="goBack" class="not-found-page__button not-found-page__button--secondary">
            <Icon name="heroicons:arrow-left" />
            {{ $t('error.goBack') }}
          </button>
        </div>
      </div>
      
      <!-- Elementos decorativos flutuantes -->
      <div class="not-found-page__floating-elements">
        <div class="not-found-page__element not-found-page__element--1"></div>
        <div class="not-found-page__element not-found-page__element--2"></div>
        <div class="not-found-page__element not-found-page__element--3"></div>
        <div class="not-found-page__element not-found-page__element--4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goBack = () => {
  if (process.client) {
    window.history.back()
  }
}

// Meta tags
useHead({
  title: 'Página não encontrada - Casa da Pedra',
  meta: [
    { name: 'description', content: 'A página que você está procurando não existe ou foi movida.' }
  ]
})
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-page__container {
  max-width: 700px;
  width: 100%;
  position: relative;
}

.not-found-page__content {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.not-found-page__illustration {
  position: relative;
  margin-bottom: 2rem;
}

.not-found-page__number {
  font-size: 8rem;
  font-weight: 900;
  color: var(--brand, #FF6700);
  line-height: 1;
  opacity: 0.1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.not-found-page__icon {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  width: 120px;
  height: 120px;
  background: var(--brand, #FF6700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-page__icon svg {
  width: 60px;
  height: 60px;
  color: white;
}

.not-found-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.not-found-page__message {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.not-found-page__suggestions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  text-align: left;
}

.not-found-page__suggestions h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.not-found-page__suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.not-found-page__suggestions li {
  margin-bottom: 0.75rem;
}

.not-found-page__suggestions li:last-child {
  margin-bottom: 0;
}

.not-found-page__suggestions a {
  color: var(--brand, #FF6700);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.not-found-page__suggestions a:hover {
  color: var(--brand-600, #E55A00);
  text-decoration: underline;
}

.not-found-page__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.not-found-page__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.not-found-page__button--primary {
  background: var(--brand, #FF6700);
  color: white;
}

.not-found-page__button--primary:hover {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.not-found-page__button--secondary {
  background: transparent;
  color: #666;
  border: 2px solid #e9ecef;
}

.not-found-page__button--secondary:hover {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.not-found-page__button svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .not-found-page {
    padding: 1rem;
  }
  
  .not-found-page__content {
    padding: 2rem 1.5rem;
  }
  
  .not-found-page__number {
    font-size: 6rem;
  }
  
  .not-found-page__icon {
    width: 100px;
    height: 100px;
  }
  
  .not-found-page__icon svg {
    width: 50px;
    height: 50px;
  }
  
  .not-found-page__title {
    font-size: 2rem;
  }
  
  .not-found-page__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .not-found-page__button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

/* Elementos flutuantes decorativos */
.not-found-page__floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.not-found-page__element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand, #FF6700), var(--brand-600, #E55A00));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.not-found-page__element--1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.not-found-page__element--2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.not-found-page__element--3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.not-found-page__element--4 {
  width: 40px;
  height: 40px;
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}
</style>
