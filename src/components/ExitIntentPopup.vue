<template>
  <Teleport to="body">
    <Transition name="exit-popup">
      <div v-if="show" class="exit-intent-popup">
        <!-- Backdrop -->
        <div class="exit-intent-popup__backdrop" @click="declineOffer"></div>
        
        <!-- Popup Content -->
        <div class="exit-intent-popup__content">
          <!-- Close Button -->
          <button 
            class="exit-intent-popup__close"
            @click="declineOffer"
            aria-label="Fechar popup"
          >
            <Icon name="heroicons:x-mark" />
          </button>
          
          <!-- Header -->
          <div class="exit-intent-popup__header">
            <div class="exit-intent-popup__icon">
              <Icon :name="getOfferIcon(offer?.type)" />
            </div>
            <h2 class="exit-intent-popup__title">{{ offer?.title }}</h2>
          </div>
          
          <!-- Content -->
          <div class="exit-intent-popup__body">
            <p class="exit-intent-popup__description">{{ offer?.description }}</p>
            
            <!-- Offer Value -->
            <div class="exit-intent-popup__value">
              <span class="exit-intent-popup__value-text">{{ offer?.value }}</span>
            </div>
            
            <!-- Conditions -->
            <div v-if="offer?.conditions" class="exit-intent-popup__conditions">
              <ul class="exit-intent-popup__conditions-list">
                <li 
                  v-for="condition in offer.conditions" 
                  :key="condition"
                  class="exit-intent-popup__condition"
                >
                  <Icon name="heroicons:check-circle" class="exit-intent-popup__condition-icon" />
                  <span>{{ condition }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Timer -->
            <div v-if="offer?.validUntil" class="exit-intent-popup__timer">
              <Icon name="heroicons:clock" class="exit-intent-popup__timer-icon" />
              <span class="exit-intent-popup__timer-text">
                Oferta expira em: {{ formatTimeLeft(timeLeft) }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="exit-intent-popup__actions">
            <button 
              class="exit-intent-popup__btn exit-intent-popup__btn--primary"
              @click="acceptOffer"
            >
              <Icon name="heroicons:check" class="exit-intent-popup__btn-icon" />
              {{ offer?.cta }}
            </button>
            
            <button 
              class="exit-intent-popup__btn exit-intent-popup__btn--secondary"
              @click="declineOffer"
            >
              Não, obrigado
            </button>
          </div>
          
          <!-- Trust Signals -->
          <div class="exit-intent-popup__trust">
            <div class="exit-intent-popup__trust-item">
              <Icon name="heroicons:shield-check" />
              <span>Reserva 100% segura</span>
            </div>
            <div class="exit-intent-popup__trust-item">
              <Icon name="heroicons:arrow-path" />
              <span>Cancelamento grátis</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { ExitOffer } from '@/composables/useExitIntent'

interface Props {
  show: boolean
  offer: ExitOffer | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  accept: []
  decline: []
}>()

// State
const timeLeft = ref(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const getOfferIcon = (type?: string) => {
  const icons = {
    discount: 'heroicons:tag',
    bonus: 'heroicons:gift',
    urgency: 'heroicons:exclamation-triangle',
    social_proof: 'heroicons:users'
  }
  return icons[type as keyof typeof icons] || 'heroicons:sparkles'
}

// Methods
const acceptOffer = () => {
  emit('accept')
}

const declineOffer = () => {
  emit('decline')
}

const formatTimeLeft = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const updateTimer = () => {
  if (props.offer?.validUntil) {
    const now = Date.now()
    const expiry = props.offer.validUntil.getTime()
    const remaining = Math.max(0, Math.floor((expiry - now) / 1000))
    timeLeft.value = remaining
    
    if (remaining <= 0) {
      declineOffer()
    }
  }
}

// Lifecycle
onMounted(() => {
  if (props.offer?.validUntil) {
    updateTimer()
    timerInterval.value = setInterval(updateTimer, 1000)
  }
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<style scoped>
.exit-intent-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.exit-intent-popup__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.exit-intent-popup__content {
  position: relative;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: popup-bounce 0.5s ease-out;
}

.exit-intent-popup__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}

.exit-intent-popup__close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.exit-intent-popup__close svg {
  width: 1rem;
  height: 1rem;
}

.exit-intent-popup__header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.exit-intent-popup__icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  animation: icon-pulse 2s infinite;
}

.exit-intent-popup__icon svg {
  width: 2rem;
  height: 2rem;
}

.exit-intent-popup__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.exit-intent-popup__body {
  padding: 1.5rem 2rem;
}

.exit-intent-popup__description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1.5rem;
  text-align: center;
}

.exit-intent-popup__value {
  text-align: center;
  margin-bottom: 1.5rem;
}

.exit-intent-popup__value-text {
  display: inline-block;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.exit-intent-popup__conditions {
  margin-bottom: 1.5rem;
}

.exit-intent-popup__conditions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exit-intent-popup__condition {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.exit-intent-popup__condition-icon {
  width: 1rem;
  height: 1rem;
  color: #10b981;
  flex-shrink: 0;
}

.exit-intent-popup__timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.exit-intent-popup__timer-icon {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.exit-intent-popup__timer-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
}

.exit-intent-popup__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 2rem 2rem;
}

.exit-intent-popup__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.exit-intent-popup__btn--primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
}

.exit-intent-popup__btn--primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.4);
}

.exit-intent-popup__btn--secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.exit-intent-popup__btn--secondary:hover {
  background: #f9fafb;
  color: #374151;
}

.exit-intent-popup__btn-icon {
  width: 1rem;
  height: 1rem;
}

.exit-intent-popup__trust {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
}

.exit-intent-popup__trust-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.exit-intent-popup__trust-item svg {
  width: 0.875rem;
  height: 0.875rem;
  color: #10b981;
}

/* Animations */
@keyframes popup-bounce {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.exit-popup-enter-active,
.exit-popup-leave-active {
  transition: all 0.3s ease;
}

.exit-popup-enter-from,
.exit-popup-leave-to {
  opacity: 0;
}

.exit-popup-enter-from .exit-intent-popup__content,
.exit-popup-leave-to .exit-intent-popup__content {
  transform: scale(0.8) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .exit-intent-popup {
    padding: 0.5rem;
  }
  
  .exit-intent-popup__content {
    border-radius: 0.75rem;
  }
  
  .exit-intent-popup__header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .exit-intent-popup__body {
    padding: 1rem 1.5rem;
  }
  
  .exit-intent-popup__actions {
    padding: 0 1.5rem 1.5rem;
  }
  
  .exit-intent-popup__trust {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .exit-intent-popup__title {
    font-size: 1.25rem;
  }
}
</style>
