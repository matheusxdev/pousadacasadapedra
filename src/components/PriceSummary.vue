<template>
  <div class="price-summary">
    <!-- Região de anúncios para screen readers -->
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      class="price-summary__sr-only"
      :aria-label="screenReaderAnnouncement"
    >
      {{ screenReaderAnnouncement }}
    </div>
    
    <div class="price-summary__header">
      <h3 class="price-summary__title">{{ $t('common.priceSummary') }}</h3>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="price-summary__loading">
      <div class="price-summary__skeleton">
        <div class="price-summary__skeleton-line"></div>
        <div class="price-summary__skeleton-line"></div>
        <div class="price-summary__skeleton-line price-summary__skeleton-line--total"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="price-summary__error">
      <Icon name="heroicons:exclamation-triangle" />
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="price-summary__retry">
        {{ $t('common.tryAgain') }}
      </button>
    </div>
    
    <!-- Content -->
    <div v-else-if="breakdown" class="price-summary__content">
      <!-- Participants -->
      <div class="price-summary__participants">
        <div class="price-summary__participant">
          <div class="price-summary__participant-info">
            <span>{{ breakdown.adults.count }} {{ $t('common.adults') }}</span>
            <span class="price-summary__per-person">{{ formatPrice(breakdown.adults.pricePerPerson) }}/pessoa</span>
          </div>
          <Transition name="price-change" mode="out-in">
            <span :key="`adults-${breakdown.adults.total}`" class="price-summary__price-value">
              {{ formatPrice(breakdown.adults.total) }}
            </span>
          </Transition>
        </div>
        <div v-if="breakdown.children.count > 0" class="price-summary__participant">
          <div class="price-summary__participant-info">
            <span>{{ breakdown.children.count }} {{ $t('common.children') }}</span>
            <span class="price-summary__per-person">{{ formatPrice(breakdown.children.pricePerPerson) }}/pessoa</span>
          </div>
          <Transition name="price-change" mode="out-in">
            <span :key="`children-${breakdown.children.total}`" class="price-summary__price-value">
              {{ formatPrice(breakdown.children.total) }}
            </span>
          </Transition>
        </div>
        <div v-if="breakdown.nights" class="price-summary__participant">
          <div class="price-summary__participant-info">
            <span>{{ breakdown.nights }} {{ $t('common.nights') }}</span>
            <span v-if="breakdown.pricePerNight" class="price-summary__per-person">{{ formatPrice(breakdown.pricePerNight) }}/noite</span>
          </div>
          <Transition name="price-change" mode="out-in">
            <span v-if="breakdown.pricePerNight" :key="`nights-${breakdown.pricePerNight}`" class="price-summary__price-value">
              {{ formatPrice(breakdown.pricePerNight) }}/{{ $t('common.perNight') }}
            </span>
          </Transition>
        </div>
        
        <!-- Resumo por pessoa -->
        <div class="price-summary__per-person-summary">
          <div class="price-summary__per-person-total">
            <span>Total por pessoa:</span>
            <Transition name="price-change" mode="out-in">
              <span :key="`per-person-${getPricePerPerson()}`" class="price-summary__per-person-value">
                {{ formatPrice(getPricePerPerson()) }}
              </span>
            </Transition>
          </div>
        </div>
      </div>
      
      <!-- Breakdown -->
      <div class="price-summary__breakdown">
        <!-- Resumo compacto -->
        <div class="price-summary__breakdown-summary">
          <div class="price-summary__line">
            <span>{{ $t('common.subtotal') }}</span>
            <Transition name="price-change" mode="out-in">
              <span :key="`subtotal-${breakdown.subtotal}`" class="price-summary__price-value">
                {{ formatPrice(breakdown.subtotal) }}
              </span>
            </Transition>
          </div>
          
          <!-- Botão para expandir/recolher -->
          <button 
            v-if="hasAdditionalFees"
            class="price-summary__expand-button"
            @click="toggleBreakdown"
            :aria-expanded="isBreakdownExpanded"
            :aria-label="isBreakdownExpanded ? 'Recolher detalhes' : 'Ver detalhes'"
          >
            <span>{{ isBreakdownExpanded ? 'Recolher detalhes' : 'Ver detalhes' }}</span>
            <Icon 
              :name="isBreakdownExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
              class="price-summary__expand-icon"
            />
          </button>
        </div>
        
        <!-- Detalhes expandíveis -->
        <Transition name="breakdown-expand">
          <div v-if="isBreakdownExpanded" class="price-summary__breakdown-details">
            <div v-if="breakdown.taxes > 0" class="price-summary__line price-summary__line--detail">
              <span>{{ $t('common.taxes') }}</span>
              <Transition name="price-change" mode="out-in">
                <span :key="`taxes-${breakdown.taxes}`" class="price-summary__price-value">
                  {{ formatPrice(breakdown.taxes) }}
                </span>
              </Transition>
            </div>
            
            <div v-if="breakdown.fees > 0" class="price-summary__line price-summary__line--detail">
              <span>{{ $t('common.fees') }}</span>
              <Transition name="price-change" mode="out-in">
                <span :key="`fees-${breakdown.fees}`" class="price-summary__price-value">
                  {{ formatPrice(breakdown.fees) }}
                </span>
              </Transition>
            </div>
            
            <div v-if="breakdown.discount" class="price-summary__line price-summary__line--discount price-summary__line--detail">
              <span>{{ $t('common.discount') }} ({{ breakdown.discount.percentage }}%)</span>
              <Transition name="price-change" mode="out-in">
                <span :key="`discount-${breakdown.discount.amount}`" class="price-summary__price-value">
                  -{{ formatPrice(breakdown.discount.amount) }}
                </span>
              </Transition>
            </div>
            
            <!-- Informações adicionais -->
            <div class="price-summary__breakdown-info">
              <div class="price-summary__info-item">
                <Icon name="heroicons:information-circle" />
                <span>Preços incluem impostos aplicáveis</span>
              </div>
              <div v-if="mode === 'stay'" class="price-summary__info-item">
                <Icon name="heroicons:calendar" />
                <span>Preço por noite por pessoa</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- Total -->
      <div class="price-summary__total">
        <div class="price-summary__total-line">
          <span class="price-summary__total-label">{{ $t('common.total') }}</span>
          <Transition name="price-change" mode="out-in">
            <span :key="`total-${breakdown.total}`" class="price-summary__total-value">
              {{ formatPrice(breakdown.total) }}
            </span>
          </Transition>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="price-summary__actions">
        <button 
          class="price-summary__button"
          :disabled="!canReserve"
          @click="$emit('reserve')"
        >
          {{ $t('common.reserveNow') }}
        </button>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="price-summary__empty">
      <Icon name="heroicons:calendar" />
      <p>{{ $t('calendar.selectDate') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PricingBreakdown } from '@/composables/usePricing'

interface Props {
  mode: 'tour' | 'stay'
  breakdown?: PricingBreakdown | null
  loading?: boolean
  error?: string | null
  canReserve?: boolean
}

interface Emits {
  (e: 'reserve'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  canReserve: false
})

const emit = defineEmits<Emits>()

// Estado do breakdown expandível
const isBreakdownExpanded = ref(false)

// Computed para verificar se há taxas adicionais
const hasAdditionalFees = computed(() => {
  if (!props.breakdown) return false
  return props.breakdown.taxes > 0 || 
         props.breakdown.fees > 0 || 
         props.breakdown.discount
})

// Função para alternar expansão
const toggleBreakdown = () => {
  isBreakdownExpanded.value = !isBreakdownExpanded.value
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Função para calcular preço por pessoa
const getPricePerPerson = (): number => {
  if (!props.breakdown) return 0
  const totalPeople = props.breakdown.adults.count + props.breakdown.children.count
  return totalPeople > 0 ? props.breakdown.total / totalPeople : 0
}

// Anúncio para screen readers
const screenReaderAnnouncement = computed(() => {
  if (!props.breakdown) return 'Resumo de preços não disponível'
  
  const adults = props.breakdown.adults.count
  const children = props.breakdown.children.count
  const total = formatPrice(props.breakdown.total)
  const perPerson = formatPrice(getPricePerPerson())
  
  let announcement = `Resumo de preços atualizado. `
  
  if (adults > 0) {
    announcement += `${adults} ${adults === 1 ? 'adulto' : 'adultos'}`
  }
  
  if (children > 0) {
    announcement += adults > 0 ? ` e ${children} ${children === 1 ? 'criança' : 'crianças'}` : `${children} ${children === 1 ? 'criança' : 'crianças'}`
  }
  
  announcement += `. Total: ${total}. Preço por pessoa: ${perPerson}`
  
  if (props.breakdown.discount) {
    announcement += `. Desconto aplicado: ${formatPrice(props.breakdown.discount.amount)}`
  }
  
  return announcement
})
</script>

<style scoped>
.price-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

/* Região de anúncios para screen readers */
.price-summary__sr-only {
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

.price-summary__header {
  margin-bottom: 1.5rem;
}

.price-summary__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.price-summary__loading {
  padding: 1rem 0;
}

.price-summary__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-summary__skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.price-summary__skeleton-line--total {
  height: 1.5rem;
  width: 60%;
}

.price-summary__error {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.price-summary__error svg {
  width: 48px;
  height: 48px;
  color: #dc3545;
  margin-bottom: 1rem;
}

.price-summary__error p {
  margin-bottom: 1rem;
}

.price-summary__retry {
  background: var(--brand, #FF6700);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.price-summary__retry:hover {
  background: var(--brand-600, #E55A00);
}

.price-summary__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.price-summary__participants {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-summary__participant {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.price-summary__participant-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-summary__per-person {
  font-size: 0.75rem;
  color: #888;
  font-weight: 500;
}

.price-summary__per-person-summary {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.price-summary__per-person-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.price-summary__per-person-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.price-summary__breakdown {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.price-summary__breakdown-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-summary__expand-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.price-summary__expand-button:hover {
  color: var(--brand, #FF6700);
  background: rgba(255, 103, 0, 0.05);
}

.price-summary__expand-button:focus {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  color: var(--brand, #FF6700);
  background: rgba(255, 103, 0, 0.1);
}

.price-summary__expand-button:focus-visible {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 103, 0, 0.2);
}

.price-summary__expand-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.price-summary__breakdown-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.price-summary__line--detail {
  font-size: 0.8rem;
  color: #666;
  padding-left: 1rem;
}

.price-summary__breakdown-info {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-summary__info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #888;
}

.price-summary__info-item svg {
  width: 14px;
  height: 14px;
}

.price-summary__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.price-summary__line--discount {
  color: #28a745;
  font-weight: 600;
}

.price-summary__total {
  padding-top: 1rem;
  border-top: 2px solid #e9ecef;
}

.price-summary__total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-summary__total-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.price-summary__total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.price-summary__actions {
  padding-top: 1rem;
}

.price-summary__button {
  width: 100%;
  min-height: 44px;
  background: var(--brand, #FF6700);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
}

.price-summary__button:hover:not(:disabled) {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.price-summary__button:focus {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  background: var(--brand-600, #E55A00);
}

.price-summary__button:focus-visible {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 103, 0, 0.2);
}

.price-summary__button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.price-summary__empty {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.price-summary__empty svg {
  width: 48px;
  height: 48px;
  color: #ccc;
  margin-bottom: 1rem;
}

.price-summary__empty p {
  font-size: 0.875rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Animações de transição de preços */
.price-change-enter-active,
.price-change-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.price-change-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.price-change-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(1.05);
}

.price-summary__price-value {
  display: inline-block;
  font-weight: 600;
  color: #333;
}

.price-summary__total-value {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

/* Animações para breakdown expandível */
.breakdown-expand-enter-active,
.breakdown-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.breakdown-expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.breakdown-expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.breakdown-expand-enter-to,
.breakdown-expand-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .price-summary {
    padding: 1rem;
  }
  
  .price-summary__title {
    font-size: 1.125rem;
  }
  
  .price-summary__total-value {
    font-size: 1.25rem;
  }
  
  .price-summary__button {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
