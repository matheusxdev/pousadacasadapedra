<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="booking-confirmation-modal"
        @click="handleBackdropClick"
        @keydown.escape="closeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div class="booking-confirmation-modal__backdrop"></div>
        
        <div class="booking-confirmation-modal__container">
          <div class="booking-confirmation-modal__content" @click.stop>
            <!-- Header -->
            <div class="booking-confirmation-modal__header">
              <div class="booking-confirmation-modal__title-section">
                <Icon name="heroicons:check-circle" class="booking-confirmation-modal__icon" />
                <div>
                  <h2 id="modal-title" class="booking-confirmation-modal__title">
                    Confirmar Reserva
                  </h2>
                  <p id="modal-description" class="booking-confirmation-modal__subtitle">
                    Revise os detalhes antes de finalizar sua reserva
                  </p>
                </div>
              </div>
              <button
                class="booking-confirmation-modal__close"
                @click="closeModal"
                aria-label="Fechar modal"
              >
                <Icon name="heroicons:x-mark" />
              </button>
            </div>

            <!-- Content -->
            <div v-if="bookingData" class="booking-confirmation-modal__body">
              <!-- Tour Info -->
              <div class="booking-confirmation-modal__section">
                <h3 class="booking-confirmation-modal__section-title">
                  <Icon name="heroicons:map" class="booking-confirmation-modal__section-icon" />
                  Detalhes do Tour
                </h3>
                <div class="booking-confirmation-modal__tour-info">
                  <div class="booking-confirmation-modal__tour-image">
                    <img :src="bookingData.tourImage" :alt="bookingData.tourTitle" />
                  </div>
                  <div class="booking-confirmation-modal__tour-details">
                    <h4 class="booking-confirmation-modal__tour-title">{{ bookingData.tourTitle }}</h4>
                    <p class="booking-confirmation-modal__tour-location">
                      <Icon name="heroicons:map-pin" />
                      {{ bookingData.tourLocation }}
                    </p>
                    <div class="booking-confirmation-modal__tour-meta">
                      <span class="booking-confirmation-modal__tour-duration">
                        <Icon name="heroicons:clock" />
                        {{ bookingData.tourDuration }}
                      </span>
                      <span class="booking-confirmation-modal__tour-difficulty">
                        <Icon name="heroicons:academic-cap" />
                        {{ bookingData.tourDifficulty }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Booking Details -->
              <div class="booking-confirmation-modal__section">
                <h3 class="booking-confirmation-modal__section-title">
                  <Icon name="heroicons:calendar-days" class="booking-confirmation-modal__section-icon" />
                  Detalhes da Reserva
                </h3>
                <div class="booking-confirmation-modal__booking-details">
                  <div class="booking-confirmation-modal__detail-row">
                    <span class="booking-confirmation-modal__detail-label">Data:</span>
                    <span class="booking-confirmation-modal__detail-value">{{ formatBookingDate }}</span>
                  </div>
                  <div class="booking-confirmation-modal__detail-row">
                    <span class="booking-confirmation-modal__detail-label">Participantes:</span>
                    <span class="booking-confirmation-modal__detail-value">{{ formatParticipants }}</span>
                  </div>
                  <div v-if="bookingData.childrenAges && bookingData.childrenAges.length > 0" class="booking-confirmation-modal__detail-row">
                    <span class="booking-confirmation-modal__detail-label">Idades das crianças:</span>
                    <span class="booking-confirmation-modal__detail-value">{{ formatChildrenAges }}</span>
                  </div>
                  <div v-if="bookingData.meetingPoint" class="booking-confirmation-modal__detail-row">
                    <span class="booking-confirmation-modal__detail-label">Ponto de encontro:</span>
                    <span class="booking-confirmation-modal__detail-value">{{ bookingData.meetingPoint }}</span>
                  </div>
                </div>
              </div>

              <!-- Pricing Breakdown -->
              <div class="booking-confirmation-modal__section">
                <h3 class="booking-confirmation-modal__section-title">
                  <Icon name="heroicons:currency-dollar" class="booking-confirmation-modal__section-icon" />
                  Resumo Financeiro
                </h3>
                <div class="booking-confirmation-modal__pricing">
                  <div class="booking-confirmation-modal__pricing-items">
                    <div v-if="bookingData.pricing.adults.count > 0" class="booking-confirmation-modal__pricing-item">
                      <span>{{ bookingData.pricing.adults.count }} Adulto(s)</span>
                      <span>{{ formatPrice(bookingData.pricing.adults.total) }}</span>
                    </div>
                    <div v-if="bookingData.pricing.children.count > 0" class="booking-confirmation-modal__pricing-item">
                      <span>{{ bookingData.pricing.children.count }} Criança(s)</span>
                      <span>{{ formatPrice(bookingData.pricing.children.total) }}</span>
                    </div>
                    <div v-if="bookingData.pricing.taxes > 0" class="booking-confirmation-modal__pricing-item">
                      <span>Taxas</span>
                      <span>{{ formatPrice(bookingData.pricing.taxes) }}</span>
                    </div>
                    <div v-if="bookingData.pricing.fees > 0" class="booking-confirmation-modal__pricing-item">
                      <span>Taxas de serviço</span>
                      <span>{{ formatPrice(bookingData.pricing.fees) }}</span>
                    </div>
                    <div v-if="bookingData.pricing.discount" class="booking-confirmation-modal__pricing-item booking-confirmation-modal__pricing-item--discount">
                      <span>Desconto ({{ bookingData.pricing.discount.percentage }}%)</span>
                      <span>-{{ formatPrice(bookingData.pricing.discount.amount) }}</span>
                    </div>
                  </div>
                  <div class="booking-confirmation-modal__pricing-total">
                    <span class="booking-confirmation-modal__total-label">Total:</span>
                    <span class="booking-confirmation-modal__total-value">{{ formatPrice(bookingData.pricing.total) }}</span>
                  </div>
                </div>
              </div>

              <!-- Important Information -->
              <div v-if="bookingData.importantInfo" class="booking-confirmation-modal__section">
                <h3 class="booking-confirmation-modal__section-title">
                  <Icon name="heroicons:exclamation-triangle" class="booking-confirmation-modal__section-icon" />
                  Informações Importantes
                </h3>
                <div class="booking-confirmation-modal__important-info" v-html="bookingData.importantInfo"></div>
              </div>

              <!-- Cancellation Policy -->
              <div v-if="bookingData.cancellationPolicy" class="booking-confirmation-modal__section">
                <h3 class="booking-confirmation-modal__section-title">
                  <Icon name="heroicons:document-text" class="booking-confirmation-modal__section-icon" />
                  Política de Cancelamento
                </h3>
                <div class="booking-confirmation-modal__cancellation-policy" v-html="bookingData.cancellationPolicy"></div>
              </div>
            </div>
            
            <!-- Fallback quando bookingData é null -->
            <div v-else class="booking-confirmation-modal__body">
              <div class="booking-confirmation-modal__section">
                <div class="booking-confirmation-modal__error-message">
                  <Icon name="heroicons:exclamation-triangle" class="booking-confirmation-modal__error-icon" />
                  <p>Dados da reserva não disponíveis. Feche o modal e tente novamente.</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="booking-confirmation-modal__footer">
              <div class="booking-confirmation-modal__footer-actions">
                <button
                  class="booking-confirmation-modal__button booking-confirmation-modal__button--secondary"
                  @click="closeModal"
                  :disabled="isProcessing"
                >
                  Cancelar
                </button>
                <button
                  class="booking-confirmation-modal__button booking-confirmation-modal__button--primary"
                  @click="confirmBooking"
                  :disabled="isProcessing"
                >
                  <Icon v-if="isProcessing" name="heroicons:arrow-path" class="booking-confirmation-modal__button-icon booking-confirmation-modal__button-icon--spinning" />
                  <Icon v-else name="heroicons:check" class="booking-confirmation-modal__button-icon" />
                  {{ isProcessing ? 'Processando...' : 'Confirmar Reserva' }}
                </button>
              </div>
              
              <div class="booking-confirmation-modal__footer-note">
                <Icon name="heroicons:shield-check" class="booking-confirmation-modal__security-icon" />
                <span>Suas informações estão protegidas e seguras</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface BookingData {
  tourTitle: string
  tourLocation: string
  tourDuration: string
  tourDifficulty: string
  tourImage: string
  bookingDate: string
  participants: {
    adults: number
    children: number
  }
  childrenAges?: Array<{ age: string }>
  meetingPoint?: string
  pricing: {
    adults: { count: number; total: number }
    children: { count: number; total: number }
    taxes: number
    fees: number
    discount?: { amount: number; percentage: number; reason: string }
    total: number
  }
  importantInfo?: string
  cancellationPolicy?: string
}

interface Props {
  isOpen: boolean
  bookingData: BookingData | null
  isProcessing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isProcessing: false
})

const emit = defineEmits<{
  close: []
  confirm: [bookingData: BookingData]
}>()

const { t } = useI18n()

// Formatação de dados
const formatBookingDate = computed(() => {
  if (!props.bookingData?.bookingDate) return 'Data não selecionada'
  
  const date = new Date(props.bookingData.bookingDate)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formatParticipants = computed(() => {
  if (!props.bookingData?.participants) return 'Participantes não selecionados'
  
  const { adults, children } = props.bookingData.participants
  const parts = []
  
  if (adults > 0) {
    parts.push(`${adults} adulto${adults > 1 ? 's' : ''}`)
  }
  
  if (children > 0) {
    parts.push(`${children} criança${children > 1 ? 's' : ''}`)
  }
  
  return parts.join(' e ')
})

const formatChildrenAges = computed(() => {
  if (!props.bookingData?.childrenAges || props.bookingData.childrenAges.length === 0) {
    return ''
  }
  
  return props.bookingData.childrenAges.map(child => child.age).join(', ')
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Handlers
const closeModal = () => {
  if (!props.isProcessing) {
    emit('close')
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const confirmBooking = () => {
  if (props.bookingData) {
    emit('confirm', props.bookingData)
  }
}
</script>

<style scoped>
.booking-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.booking-confirmation-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.booking-confirmation-modal__container {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
}

.booking-confirmation-modal__content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.booking-confirmation-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.booking-confirmation-modal__title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.booking-confirmation-modal__icon {
  width: 2rem;
  height: 2rem;
  color: #10b981;
  flex-shrink: 0;
}

.booking-confirmation-modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.booking-confirmation-modal__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.booking-confirmation-modal__close {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.booking-confirmation-modal__close:hover {
  background: #f3f4f6;
  color: #374151;
}

.booking-confirmation-modal__close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.booking-confirmation-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-confirmation-modal__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-confirmation-modal__section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.booking-confirmation-modal__section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.booking-confirmation-modal__tour-info {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.booking-confirmation-modal__tour-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.booking-confirmation-modal__tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.booking-confirmation-modal__tour-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-confirmation-modal__tour-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.booking-confirmation-modal__tour-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.booking-confirmation-modal__tour-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.booking-confirmation-modal__tour-duration,
.booking-confirmation-modal__tour-difficulty {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.booking-confirmation-modal__booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-confirmation-modal__detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.booking-confirmation-modal__detail-label {
  font-weight: 500;
  color: #374151;
}

.booking-confirmation-modal__detail-value {
  color: #111827;
  font-weight: 600;
}

.booking-confirmation-modal__pricing {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-confirmation-modal__pricing-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-confirmation-modal__pricing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.booking-confirmation-modal__pricing-item--discount {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.booking-confirmation-modal__pricing-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6a00, #ff8c42);
  color: white;
  border-radius: 0.75rem;
  font-weight: 700;
}

.booking-confirmation-modal__total-label {
  font-size: 1.125rem;
}

.booking-confirmation-modal__total-value {
  font-size: 1.5rem;
}

.booking-confirmation-modal__important-info,
.booking-confirmation-modal__cancellation-policy {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.booking-confirmation-modal__footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.booking-confirmation-modal__footer-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.booking-confirmation-modal__button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
}

.booking-confirmation-modal__button--secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.booking-confirmation-modal__button--secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.booking-confirmation-modal__button--primary {
  background: linear-gradient(135deg, #ff6a00, #ff8c42);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
}

.booking-confirmation-modal__button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e55a00, #ff7a32);
  box-shadow: 0 6px 16px rgba(255, 106, 0, 0.4);
}

.booking-confirmation-modal__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-confirmation-modal__button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.booking-confirmation-modal__button-icon--spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.booking-confirmation-modal__footer-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.booking-confirmation-modal__security-icon {
  width: 1rem;
  height: 1rem;
  color: #10b981;
}

.booking-confirmation-modal__error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #dc2626;
}

.booking-confirmation-modal__error-icon {
  width: 3rem;
  height: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.booking-confirmation-modal__error-message p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

/* Transições */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .booking-confirmation-modal__container,
.modal-leave-to .booking-confirmation-modal__container {
  transform: scale(0.95) translateY(-20px);
}

.modal-enter-to .booking-confirmation-modal__container,
.modal-leave-from .booking-confirmation-modal__container {
  transform: scale(1) translateY(0);
}

/* Responsividade */
@media (max-width: 768px) {
  .booking-confirmation-modal {
    padding: 0.5rem;
  }
  
  .booking-confirmation-modal__container {
    max-width: 100%;
  }
  
  .booking-confirmation-modal__header {
    padding: 1rem;
  }
  
  .booking-confirmation-modal__body {
    padding: 1rem;
    gap: 1rem;
  }
  
  .booking-confirmation-modal__footer {
    padding: 1rem;
  }
  
  .booking-confirmation-modal__footer-actions {
    flex-direction: column;
  }
  
  .booking-confirmation-modal__tour-info {
    flex-direction: column;
    text-align: center;
  }
  
  .booking-confirmation-modal__tour-image {
    width: 100%;
    height: 120px;
  }
  
  .booking-confirmation-modal__tour-meta {
    justify-content: center;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  .booking-confirmation-modal__content {
    border: 2px solid #000;
  }
  
  .booking-confirmation-modal__button--primary {
    border: 2px solid #000;
  }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .modal-enter-from .booking-confirmation-modal__container,
  .modal-leave-to .booking-confirmation-modal__container {
    transform: none;
  }
  
  .booking-confirmation-modal__button-icon--spinning {
    animation: none;
  }
}
</style>
