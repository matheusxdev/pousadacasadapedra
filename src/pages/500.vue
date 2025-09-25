<template>
  <div class="server-error-page">
    <div class="server-error-page__container">
      <div class="server-error-page__content">
        <div class="server-error-page__illustration">
          <div class="server-error-page__icon">
            <Icon name="heroicons:wrench-screwdriver" />
          </div>
          <div class="server-error-page__sparks">
            <div class="spark spark--1"></div>
            <div class="spark spark--2"></div>
            <div class="spark spark--3"></div>
          </div>
        </div>
        
        <h1 class="server-error-page__title">
          {{ $t('error.serverError.title') }}
        </h1>
        
        <p class="server-error-page__message">
          {{ $t('error.serverError.message') }}
        </p>
        
        <div class="server-error-page__status">
          <span class="server-error-page__status-label">{{ $t('error.serverError.status') }}</span>
          <span class="server-error-page__status-code">500</span>
        </div>
        
        <div class="server-error-page__actions">
          <button @click="retry" class="server-error-page__button server-error-page__button--primary">
            <Icon name="heroicons:arrow-path" />
            {{ $t('error.tryAgain') }}
          </button>
          
          <NuxtLink to="/" class="server-error-page__button server-error-page__button--secondary">
            <Icon name="heroicons:home" />
            {{ $t('error.goHome') }}
          </NuxtLink>
        </div>
        
        <div class="server-error-page__help">
          <p>{{ $t('error.serverError.help') }}</p>
          <NuxtLink to="/contact" class="server-error-page__contact">
            {{ $t('error.serverError.contact') }}
          </NuxtLink>
        </div>
      </div>
      
      <!-- Elementos decorativos flutuantes -->
      <div class="server-error-page__floating-elements">
        <div class="server-error-page__element server-error-page__element--1"></div>
        <div class="server-error-page__element server-error-page__element--2"></div>
        <div class="server-error-page__element server-error-page__element--3"></div>
        <div class="server-error-page__element server-error-page__element--4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const retry = () => {
  if (process.client) {
    window.location.reload()
  }
}

// Meta tags
useHead({
  title: 'Erro interno do servidor - Casa da Pedra',
  meta: [
    { name: 'description', content: 'Ocorreu um erro interno. Nossa equipe foi notificada.' }
  ]
})
</script>

<style scoped>
.server-error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.server-error-page__container {
  max-width: 600px;
  width: 100%;
  position: relative;
}

.server-error-page__content {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.server-error-page__illustration {
  position: relative;
  margin-bottom: 2rem;
}

.server-error-page__icon {
  width: 120px;
  height: 120px;
  background: var(--brand, #FF6700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.server-error-page__icon svg {
  width: 60px;
  height: 60px;
  color: white;
}

.server-error-page__sparks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--brand, #FF6700);
  border-radius: 50%;
  animation: sparkle 2s infinite;
}

.spark--1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.spark--2 {
  top: 30%;
  right: 20%;
  animation-delay: 0.5s;
}

.spark--3 {
  bottom: 20%;
  left: 50%;
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.server-error-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.server-error-page__message {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.server-error-page__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.server-error-page__status-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.server-error-page__status-code {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.server-error-page__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.server-error-page__button {
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

.server-error-page__button--primary {
  background: var(--brand, #FF6700);
  color: white;
}

.server-error-page__button--primary:hover {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.server-error-page__button--secondary {
  background: transparent;
  color: #666;
  border: 2px solid #e9ecef;
}

.server-error-page__button--secondary:hover {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.server-error-page__button svg {
  width: 20px;
  height: 20px;
}

.server-error-page__help {
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.server-error-page__help p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.server-error-page__contact {
  color: var(--brand, #FF6700);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.server-error-page__contact:hover {
  color: var(--brand-600, #E55A00);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .server-error-page {
    padding: 1rem;
  }
  
  .server-error-page__content {
    padding: 2rem 1.5rem;
  }
  
  .server-error-page__icon {
    width: 100px;
    height: 100px;
  }
  
  .server-error-page__icon svg {
    width: 50px;
    height: 50px;
  }
  
  .server-error-page__title {
    font-size: 2rem;
  }
  
  .server-error-page__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .server-error-page__button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

/* Elementos flutuantes decorativos */
.server-error-page__floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.server-error-page__element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand, #FF6700), var(--brand-600, #E55A00));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.server-error-page__element--1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.server-error-page__element--2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.server-error-page__element--3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.server-error-page__element--4 {
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
