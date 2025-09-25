<template>
  <Transition
    enter-active-class="notification-enter"
    enter-from-class="notification-enter-from"
    enter-to-class="notification-enter-to"
    leave-active-class="notification-leave"
    leave-from-class="notification-leave-from"
    leave-to-class="notification-leave-to"
  >
    <div
      v-if="show"
      class="rate-limit-notification"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-500" />
          </div>
          <div class="ml-3 w-0 flex-1">
            <h3 class="text-sm font-medium text-gray-900">
              Rate Limit Atingido
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p v-if="retryAfter">
                Você atingiu o limite de requisições. Tente novamente em <strong>{{ retryTimeHuman }}</strong>.
              </p>
              <p v-else>
                Você atingiu o limite de requisições. Tente novamente mais tarde.
              </p>
            </div>
            <div class="mt-3 flex space-x-3">
              <button
                @click="handleRetry"
                :disabled="isRetrying"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon v-if="isRetrying" name="heroicons:arrow-path" class="animate-spin h-3 w-3" />
                <Icon v-else name="heroicons:arrow-path" class="h-3 w-3" />
                {{ isRetrying ? 'Tentando...' : 'Tentar Novamente' }}
              </button>
              <button
                @click="handleDismiss"
                class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="handleDismiss"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span class="sr-only">Fechar</span>
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  retryAfter?: number
  isRetrying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRetrying: false
})

const emit = defineEmits<{
  retry: []
  dismiss: []
}>()

// Computed properties
const retryTimeHuman = computed(() => {
  if (!props.retryAfter) return ''
  return formatTimeRemaining(props.retryAfter)
})

// Função para formatar tempo restante
const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
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

// Função para fechar notificação
const handleDismiss = () => {
  emit('dismiss')
}
</script>

<style>
.rate-limit-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  max-width: 24rem;
  width: 100%;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

.rate-limit-notification .p-4 {
  padding: 1rem;
}

.rate-limit-notification .flex {
  display: flex;
}

.rate-limit-notification .items-start {
  align-items: flex-start;
}

.rate-limit-notification .flex-shrink-0 {
  flex-shrink: 0;
}

.rate-limit-notification .h-6 {
  height: 1.5rem;
}

.rate-limit-notification .w-6 {
  width: 1.5rem;
}

.rate-limit-notification .text-red-500 {
  color: #ef4444;
}

.rate-limit-notification .ml-3 {
  margin-left: 0.75rem;
}

.rate-limit-notification .w-0 {
  width: 0;
}

.rate-limit-notification .flex-1 {
  flex: 1 1 0%;
}

.rate-limit-notification .text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.rate-limit-notification .font-medium {
  font-weight: 500;
}

.rate-limit-notification .text-gray-900 {
  color: #111827;
}

.rate-limit-notification .mt-2 {
  margin-top: 0.5rem;
}

.rate-limit-notification .text-gray-500 {
  color: #6b7280;
}

.rate-limit-notification .mt-3 {
  margin-top: 0.75rem;
}

.rate-limit-notification .flex {
  display: flex;
}

.rate-limit-notification .space-x-3 > * + * {
  margin-left: 0.75rem;
}

.rate-limit-notification .inline-flex {
  display: inline-flex;
}

.rate-limit-notification .items-center {
  align-items: center;
}

.rate-limit-notification .gap-2 {
  gap: 0.5rem;
}

.rate-limit-notification .px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.rate-limit-notification .py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.rate-limit-notification .bg-red-600 {
  background-color: #dc2626;
}

.rate-limit-notification .text-white {
  color: white;
}

.rate-limit-notification .text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.rate-limit-notification .font-medium {
  font-weight: 500;
}

.rate-limit-notification .rounded-md {
  border-radius: 0.375rem;
}

.rate-limit-notification .hover\:bg-red-700:hover {
  background-color: #b91c1c;
}

.rate-limit-notification .focus\:outline-none:focus {
  outline: none;
}

.rate-limit-notification .focus\:ring-2:focus {
  box-shadow: 0 0 0 2px #ef4444;
}

.rate-limit-notification .focus\:ring-red-500:focus {
  box-shadow: 0 0 0 2px #ef4444;
}

.rate-limit-notification .focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px #ef4444, 0 0 0 4px white;
}

.rate-limit-notification .disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.rate-limit-notification .disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.rate-limit-notification .transition-colors {
  transition: background-color 0.2s;
}

.rate-limit-notification .bg-gray-100 {
  background-color: #f3f4f6;
}

.rate-limit-notification .text-gray-700 {
  color: #374151;
}

.rate-limit-notification .hover\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

.rate-limit-notification .focus\:ring-gray-500:focus {
  box-shadow: 0 0 0 2px #6b7280;
}

.rate-limit-notification .ml-4 {
  margin-left: 1rem;
}

.rate-limit-notification .flex-shrink-0 {
  flex-shrink: 0;
}

.rate-limit-notification .flex {
  display: flex;
}

.rate-limit-notification .bg-white {
  background-color: white;
}

.rate-limit-notification .rounded-md {
  border-radius: 0.375rem;
}

.rate-limit-notification .inline-flex {
  display: inline-flex;
}

.rate-limit-notification .text-gray-400 {
  color: #9ca3af;
}

.rate-limit-notification .hover\:text-gray-500:hover {
  color: #6b7280;
}

.rate-limit-notification .focus\:outline-none:focus {
  outline: none;
}

.rate-limit-notification .focus\:ring-2:focus {
  box-shadow: 0 0 0 2px #ef4444;
}

.rate-limit-notification .focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px #ef4444, 0 0 0 4px white;
}

.rate-limit-notification .focus\:ring-red-500:focus {
  box-shadow: 0 0 0 2px #ef4444;
}

.rate-limit-notification .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.rate-limit-notification .h-5 {
  height: 1.25rem;
}

.rate-limit-notification .w-5 {
  width: 1.25rem;
}

.rate-limit-notification .h-3 {
  height: 0.75rem;
}

.rate-limit-notification .w-3 {
  width: 0.75rem;
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

/* Transition classes */
.notification-enter {
  transition: all 0.3s ease-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}

.notification-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.notification-leave {
  transition: all 0.2s ease-in;
}

.notification-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
