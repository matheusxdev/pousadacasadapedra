<template>
  <div class="api-error-fallback">
    <div class="api-error-fallback__content">
      <div class="api-error-fallback__icon">
        <Icon name="heroicons:exclamation-triangle" />
      </div>
      
      <h3 class="api-error-fallback__title">
        {{ $t('error.api.title') }}
      </h3>
      
      <p class="api-error-fallback__message">
        {{ $t('error.api.message') }}
      </p>
      
      <div class="api-error-fallback__actions">
        <button @click="retry" class="api-error-fallback__button api-error-fallback__button--primary">
          <Icon name="heroicons:arrow-path" />
          {{ $t('error.tryAgain') }}
        </button>
        
        <NuxtLink to="/" class="api-error-fallback__button api-error-fallback__button--secondary">
          <Icon name="heroicons:home" />
          {{ $t('error.goHome') }}
        </NuxtLink>
      </div>
      
      <div v-if="showDetails" class="api-error-fallback__details">
        <details>
          <summary>{{ $t('error.showDetails') }}</summary>
          <pre class="api-error-fallback__error">{{ error }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  showDetails: false
})

const emit = defineEmits<{
  retry: []
}>()

const retry = () => {
  emit('retry')
}
</script>

<style scoped>
.api-error-fallback {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.api-error-fallback__content {
  max-width: 400px;
  margin: 0 auto;
}

.api-error-fallback__icon {
  margin-bottom: 1rem;
}

.api-error-fallback__icon svg {
  width: 48px;
  height: 48px;
  color: var(--brand, #FF6700);
}

.api-error-fallback__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.api-error-fallback__message {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.api-error-fallback__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.api-error-fallback__button {
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

.api-error-fallback__button--primary {
  background: var(--brand, #FF6700);
  color: white;
}

.api-error-fallback__button--primary:hover {
  background: var(--brand-600, #E55A00);
}

.api-error-fallback__button--secondary {
  background: transparent;
  color: #666;
  border: 1px solid #e9ecef;
}

.api-error-fallback__button--secondary:hover {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.api-error-fallback__button svg {
  width: 16px;
  height: 16px;
}

.api-error-fallback__details {
  text-align: left;
}

.api-error-fallback__details summary {
  cursor: pointer;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.75rem;
}

.api-error-fallback__details summary:hover {
  color: var(--brand, #FF6700);
}

.api-error-fallback__error {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #666;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .api-error-fallback {
    padding: 1.5rem;
  }
  
  .api-error-fallback__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .api-error-fallback__button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>
