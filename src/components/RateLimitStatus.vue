<template>
  <div v-if="rateLimitInfo" class="rate-limit-status">
    <!-- Status Normal -->
    <div v-if="!isRateLimited" class="rate-limit-normal">
      <div class="rate-limit-header">
        <Icon name="heroicons:chart-bar" class="rate-limit-icon" />
        <span class="rate-limit-title">Rate Limit</span>
      </div>
      
      <div class="rate-limit-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :class="{ 'warning': isWarning, 'critical': isCritical }"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
        <div class="progress-text">
          {{ rateLimitInfo.remaining }} / {{ rateLimitInfo.limit }} restantes
        </div>
      </div>
      
      <div class="rate-limit-details">
        <div class="detail-item">
          <span class="label">Reset em:</span>
          <span class="value">{{ resetTimeHuman }}</span>
        </div>
        <div v-if="rateLimitInfo.type" class="detail-item">
          <span class="label">Tipo:</span>
          <span class="value">{{ rateLimitInfo.type }}</span>
        </div>
        <div v-if="rateLimitInfo.userType" class="detail-item">
          <span class="label">Usuário:</span>
          <span class="value">{{ rateLimitInfo.userType }}</span>
        </div>
      </div>
    </div>

    <!-- Status Rate Limited -->
    <div v-else class="rate-limit-error">
      <div class="rate-limit-header">
        <Icon name="heroicons:exclamation-triangle" class="rate-limit-icon error" />
        <span class="rate-limit-title">Rate Limit Atingido</span>
      </div>
      
      <div class="rate-limit-message">
        <p class="error-message">
          Você atingiu o limite de requisições. Tente novamente em <strong>{{ retryTimeHuman }}</strong>.
        </p>
      </div>
      
      <div class="rate-limit-actions">
        <button 
          @click="handleRetry" 
          :disabled="isRetrying"
          class="retry-button"
        >
          <Icon v-if="isRetrying" name="heroicons:arrow-path" class="animate-spin" />
          <Icon v-else name="heroicons:arrow-path" />
          {{ isRetrying ? 'Tentando...' : 'Tentar Novamente' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RateLimitInfo } from '~/composables/useRateLimit'

interface Props {
  rateLimitInfo: RateLimitInfo | null
  isRateLimited: boolean
  isRetrying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRetrying: false
})

const emit = defineEmits<{
  retry: []
}>()

// Computed properties
const progressPercentage = computed(() => {
  if (!props.rateLimitInfo) return 0
  return ((props.rateLimitInfo.limit - props.rateLimitInfo.remaining) / props.rateLimitInfo.limit) * 100
})

const isWarning = computed(() => {
  if (!props.rateLimitInfo) return false
  return props.rateLimitInfo.remaining < 20
})

const isCritical = computed(() => {
  if (!props.rateLimitInfo) return false
  return props.rateLimitInfo.remaining < 5
})

const resetTimeHuman = computed(() => {
  if (!props.rateLimitInfo) return ''
  return formatTimeRemaining(props.rateLimitInfo.resetDate)
})

const retryTimeHuman = computed(() => {
  if (!props.rateLimitInfo?.retryAfterDate) return ''
  return formatTimeRemaining(props.rateLimitInfo.retryAfterDate)
})

// Função para formatar tempo restante
const formatTimeRemaining = (date: Date): string => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  if (diff <= 0) return 'agora'

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`
  
  return 'menos de 1 minuto'
}

// Função para lidar com retry
const handleRetry = () => {
  emit('retry')
}
</script>

<style>
.rate-limit-status {
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.rate-limit-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rate-limit-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.rate-limit-icon.error {
  color: #ef4444;
}

.rate-limit-title {
  font-weight: 500;
  color: #111827;
}

.rate-limit-progress {
  margin-bottom: 0.75rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  transition: all 0.3s ease-out;
}

.progress-fill.warning {
  background-color: #f59e0b;
}

.progress-fill.critical {
  background-color: #ef4444;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.rate-limit-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-item .label {
  color: #6b7280;
}

.detail-item .value {
  color: #111827;
  font-weight: 500;
}

.rate-limit-error {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.rate-limit-message {
  margin-bottom: 0.75rem;
}

.error-message {
  color: #b91c1c;
  font-size: 0.875rem;
}

.rate-limit-actions {
  display: flex;
  justify-content: flex-end;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #dc2626;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #b91c1c;
}

.retry-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ef4444;
}

.retry-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
