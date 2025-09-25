<template>
  <ClientOnly>
    <div v-if="urgencyData && urgencyMessages.length > 0" class="urgency-banner">
      <div class="urgency-banner__container">
        <div class="urgency-banner__icon">
          <Icon name="heroicons:exclamation-triangle" />
        </div>
        
        <div class="urgency-banner__content">
          <div class="urgency-banner__messages">
            <TransitionGroup name="urgency-slide" tag="div">
              <div 
                v-for="(message, index) in displayMessages" 
                :key="`${message}-${index}`"
                class="urgency-banner__message"
                :class="getMessageClass(message)"
              >
                <Icon :name="getMessageIcon(message)" class="urgency-banner__message-icon" />
                <span>{{ message }}</span>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <div v-if="hasTimer" class="urgency-banner__timer">
          <Icon name="heroicons:clock" class="urgency-banner__timer-icon" />
          <span class="urgency-banner__timer-text">{{ formatTime(timeLeft) }}</span>
        </div>

        <button 
          @click="dismissBanner" 
          class="urgency-banner__close"
          aria-label="Fechar banner de urgência"
        >
          <Icon name="heroicons:x-mark" />
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUrgency } from '@/composables/useUrgency'

interface Props {
  productId: string
  productType?: 'tour' | 'accommodation'
  position?: 'top' | 'sticky'
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productType: 'tour',
  position: 'top',
  dismissible: true
})

const emit = defineEmits<{
  dismiss: []
  urgent: [message: string]
}>()

// Composable
const {
  urgencyData,
  loading,
  error,
  timeLeft,
  urgencyMessages,
  hasTimer,
  formatTime
} = useUrgency(props.productId)

// State
const isDismissed = ref(false)
const currentMessageIndex = ref(0)
const messageInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const displayMessages = computed(() => {
  if (urgencyMessages.value.length === 0) return []
  
  // Converter objetos UrgencyDisplay para strings
  const messageStrings = urgencyMessages.value.map(msg => msg.message)
  
  // Se há múltiplas mensagens, rotacionar
  if (messageStrings.length > 1) {
    return [messageStrings[currentMessageIndex.value]]
  }
  
  return messageStrings
})

// Methods
const getMessageClass = (message: string) => {
  if (message.includes('últimas') || message.includes('vagas')) return 'urgency-banner__message--spots'
  if (message.includes('expira') || message.includes('timer')) return 'urgency-banner__message--timer'
  if (message.includes('usuários') || message.includes('vendo')) return 'urgency-banner__message--viewers'
  if (message.includes('aumenta') || message.includes('preço')) return 'urgency-banner__message--price'
  if (message.includes('reservado') || message.includes('vezes')) return 'urgency-banner__message--bookings'
  return 'urgency-banner__message--default'
}

const getMessageIcon = (message: string) => {
  if (message.includes('últimas') || message.includes('vagas')) return 'heroicons:users'
  if (message.includes('expira') || message.includes('timer')) return 'heroicons:clock'
  if (message.includes('usuários') || message.includes('vendo')) return 'heroicons:eye'
  if (message.includes('aumenta') || message.includes('preço')) return 'heroicons:arrow-trending-up'
  if (message.includes('reservado') || message.includes('vezes')) return 'heroicons:chart-bar'
  return 'heroicons:exclamation-triangle'
}

const dismissBanner = () => {
  if (props.dismissible) {
    isDismissed.value = true
    emit('dismiss')
  }
}

const startMessageRotation = () => {
  const messageStrings = urgencyMessages.value.map(msg => msg.message)
  if (messageStrings.length > 1) {
    messageInterval.value = setInterval(() => {
      currentMessageIndex.value = (currentMessageIndex.value + 1) % messageStrings.length
    }, 4000) // Muda a cada 4 segundos
  }
}

const stopMessageRotation = () => {
  if (messageInterval.value) {
    clearInterval(messageInterval.value)
    messageInterval.value = null
  }
}

// Watch for urgent messages
watch(urgencyMessages, (messages) => {
  if (messages.length > 0) {
    emit('urgent', messages[0].message)
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  startMessageRotation()
})

onUnmounted(() => {
  stopMessageRotation()
})
</script>

<style scoped>
.urgency-banner {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.urgency-banner__container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.urgency-banner__icon {
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

.urgency-banner__content {
  flex: 1;
  min-width: 0;
}

.urgency-banner__messages {
  position: relative;
  height: 1.5rem;
  overflow: hidden;
}

.urgency-banner__message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5rem;
  white-space: nowrap;
}

.urgency-banner__message-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.urgency-banner__message--spots {
  color: #fef3c7;
}

.urgency-banner__message--timer {
  color: #fecaca;
}

.urgency-banner__message--viewers {
  color: #dbeafe;
}

.urgency-banner__message--price {
  color: #fed7d7;
}

.urgency-banner__message--bookings {
  color: #d1fae5;
}

.urgency-banner__message--default {
  color: #fef3c7;
}

.urgency-banner__timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
}

.urgency-banner__timer-icon {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

.urgency-banner__timer-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}

.urgency-banner__close {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.urgency-banner__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.urgency-slide-enter-active,
.urgency-slide-leave-active {
  transition: all 0.5s ease;
}

.urgency-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.urgency-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .urgency-banner__container {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  
  .urgency-banner__message {
    font-size: 0.8rem;
  }
  
  .urgency-banner__timer {
    padding: 0.375rem 0.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .urgency-banner__container {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .urgency-banner__timer {
    align-self: center;
  }
}
</style>
