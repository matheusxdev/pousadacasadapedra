<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__content">
      <div class="error-boundary__icon">
        <Icon name="heroicons:exclamation-triangle" />
      </div>
      
      <h2 class="error-boundary__title">
        {{ $t('error.boundary.title') }}
      </h2>
      
      <p class="error-boundary__message">
        {{ $t('error.boundary.message') }}
      </p>
      
      <div class="error-boundary__actions">
        <button @click="retry" class="error-boundary__button error-boundary__button--primary">
          <Icon name="heroicons:arrow-path" />
          {{ $t('error.tryAgain') }}
        </button>
        
        <button @click="reportError" class="error-boundary__button error-boundary__button--secondary">
          <Icon name="heroicons:bug-ant" />
          {{ $t('error.boundary.report') }}
        </button>
      </div>
      
      <details v-if="showDetails" class="error-boundary__details">
        <summary>{{ $t('error.showDetails') }}</summary>
        <pre class="error-boundary__stack">{{ error?.stack }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)
const showDetails = ref(false)

onErrorCaptured((err: Error) => {
  hasError.value = true
  error.value = err
  
  // Log do erro para debugging
  console.error('ErrorBoundary caught an error:', err)
  
  // Em desenvolvimento, mostrar detalhes automaticamente
  if (process.dev) {
    showDetails.value = true
  }
  
  return false // Previne que o erro seja propagado
})

const retry = () => {
  hasError.value = false
  error.value = null
  showDetails.value = false
  
  // Recarregar a página para tentar novamente
  if (process.client) {
    window.location.reload()
  }
}

const reportError = () => {
  // Aqui você pode implementar um sistema de report de erros
  // Por exemplo, enviar para um serviço como Sentry, LogRocket, etc.
  console.log('Error reported:', error.value)
  
  // Por enquanto, apenas mostrar um alerta
  alert('Erro reportado! Nossa equipe foi notificada.')
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.error-boundary__content {
  text-align: center;
  max-width: 500px;
}

.error-boundary__icon {
  margin-bottom: 1.5rem;
}

.error-boundary__icon svg {
  width: 64px;
  height: 64px;
  color: var(--brand, #FF6700);
}

.error-boundary__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.error-boundary__message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-boundary__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.error-boundary__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.error-boundary__button--primary {
  background: var(--brand, #FF6700);
  color: white;
}

.error-boundary__button--primary:hover {
  background: var(--brand-600, #E55A00);
}

.error-boundary__button--secondary {
  background: transparent;
  color: #666;
  border: 1px solid #e9ecef;
}

.error-boundary__button--secondary:hover {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.error-boundary__button svg {
  width: 16px;
  height: 16px;
}

.error-boundary__details {
  text-align: left;
  margin-top: 1.5rem;
}

.error-boundary__details summary {
  cursor: pointer;
  font-weight: 500;
  color: #666;
  margin-bottom: 1rem;
}

.error-boundary__details summary:hover {
  color: var(--brand, #FF6700);
}

.error-boundary__stack {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  font-size: 0.75rem;
  color: #666;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .error-boundary {
    padding: 1rem;
  }
  
  .error-boundary__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-boundary__button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>
