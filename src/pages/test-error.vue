<template>
  <div class="test-error-page">
    <div class="container">
      <h1>Teste de Páginas de Erro</h1>
      
      <div class="test-error-page__actions">
        <button @click="triggerError" class="test-error-page__button">
          Simular Erro 404
        </button>
        
        <button @click="triggerServerError" class="test-error-page__button">
          Simular Erro 500
        </button>
        
        <button @click="triggerBoundaryError" class="test-error-page__button">
          Simular Erro de Componente
        </button>
      </div>
      
      <ErrorBoundary>
        <div v-if="showComponent">
          <h2>Componente que pode falhar</h2>
          <button @click="throwError" class="test-error-page__button">
            Lançar Erro no Componente
          </button>
        </div>
      </ErrorBoundary>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Declaração global do createError para TypeScript
declare const createError: (error: { statusCode: number; statusMessage: string }) => never

const showComponent = ref(true)

const triggerError = () => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Página não encontrada'
  })
}

const triggerServerError = () => {
  throw createError({
    statusCode: 500,
    statusMessage: 'Erro interno do servidor'
  })
}

const triggerBoundaryError = () => {
  showComponent.value = false
  setTimeout(() => {
    showComponent.value = true
  }, 100)
}

const throwError = () => {
  throw new Error('Erro simulado no componente')
}

// Meta tags
useHead({
  title: 'Teste de Erros - Casa da Pedra',
  meta: [
    { name: 'description', content: 'Página para testar as telas de erro personalizadas' }
  ]
})
</script>

<style scoped>
.test-error-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.test-error-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 3rem;
}

.test-error-page__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.test-error-page__button {
  background: var(--brand, #FF6700);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-error-page__button:hover {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.test-error-page h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .test-error-page h1 {
    font-size: 2rem;
  }
  
  .test-error-page__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .test-error-page__button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
