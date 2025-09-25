<template>
  <div class="error-page">
    <div class="error-page__container">
      <div class="error-page__content">
        <div class="error-page__icon">
          <Icon name="heroicons:exclamation-triangle" />
        </div>
        
        <h1 class="error-page__title">
          {{ errorTitle }}
        </h1>
        
        <p class="error-page__message">
          {{ errorMessage }}
        </p>
        
        <div class="error-page__actions">
          <NuxtLink to="/" class="error-page__button error-page__button--primary">
            <Icon name="heroicons:home" />
            {{ $t('error.goHome') }}
          </NuxtLink>
          
          <button @click="goBack" class="error-page__button error-page__button--secondary">
            <Icon name="heroicons:arrow-left" />
            {{ $t('error.goBack') }}
          </button>
        </div>
        
        <div class="error-page__details" v-if="showDetails">
          <details>
            <summary>{{ $t('error.showDetails') }}</summary>
            <pre class="error-page__stack">{{ error.stack }}</pre>
          </details>
        </div>
      </div>
      
      <!-- Elementos decorativos flutuantes -->
      <div class="error-page__floating-elements">
        <div class="error-page__element error-page__element--1"></div>
        <div class="error-page__element error-page__element--2"></div>
        <div class="error-page__element error-page__element--3"></div>
        <div class="error-page__element error-page__element--4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = defineProps<ErrorProps>()

const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Página não encontrada'
    case 500:
      return 'Erro interno do servidor'
    case 403:
      return 'Acesso negado'
    default:
      return 'Ops! Algo deu errado'
  }
})

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'A página que você está procurando não existe ou foi movida.'
    case 500:
      return 'Ocorreu um erro interno. Nossa equipe foi notificada.'
    case 403:
      return 'Você não tem permissão para acessar esta página.'
    default:
      return props.error.message || 'Tente novamente em alguns minutos.'
  }
})

const showDetails = computed(() => {
  return process.dev && props.error.stack
})

const goBack = () => {
  if (process.client) {
    window.history.back()
  }
}

// Meta tags
useHead({
  title: computed(() => `${errorTitle.value} - Casa da Pedra`),
  meta: [
    { name: 'description', content: errorMessage.value }
  ]
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-page__container {
  max-width: 600px;
  width: 100%;
  position: relative;
}

.error-page__content {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.error-page__icon {
  margin-bottom: 2rem;
}

.error-page__icon svg {
  width: 80px;
  height: 80px;
  color: var(--brand, #FF6700);
}

.error-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-page__message {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.error-page__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.error-page__button {
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

.error-page__button--primary {
  background: var(--brand, #FF6700);
  color: white;
}

.error-page__button--primary:hover {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.error-page__button--secondary {
  background: transparent;
  color: #666;
  border: 2px solid #e9ecef;
}

.error-page__button--secondary:hover {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.error-page__button svg {
  width: 20px;
  height: 20px;
}

.error-page__details {
  margin-top: 2rem;
  text-align: left;
}

.error-page__details summary {
  cursor: pointer;
  font-weight: 600;
  color: #666;
  margin-bottom: 1rem;
}

.error-page__details summary:hover {
  color: var(--brand, #FF6700);
}

.error-page__stack {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  color: #666;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .error-page {
    padding: 1rem;
  }
  
  .error-page__content {
    padding: 2rem 1.5rem;
  }
  
  .error-page__title {
    font-size: 2rem;
  }
  
  .error-page__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-page__button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

/* Elementos flutuantes decorativos */
.error-page__floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.error-page__element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand, #FF6700), var(--brand-600, #E55A00));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.error-page__element--1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.error-page__element--2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.error-page__element--3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.error-page__element--4 {
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
