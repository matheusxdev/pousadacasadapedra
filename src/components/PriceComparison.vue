<template>
  <div v-if="comparison && comparison.savings > 0" class="price-comparison">
    <Transition name="price-comparison" appear>
      <div class="price-comparison__card">
        <div class="price-comparison__header">
          <Icon :name="discountIcon" class="price-comparison__icon" />
          <div class="price-comparison__title-section">
            <h4 class="price-comparison__title">{{ t('priceComparison.guaranteedSavings') }}</h4>
            <p class="price-comparison__subtitle">{{ comparison.message }}</p>
          </div>
          <div :class="`price-comparison__urgency price-comparison__urgency--${comparison.urgency}`">
            <Icon name="heroicons:exclamation-triangle" />
          </div>
        </div>

        <div class="price-comparison__content">
          <div class="price-comparison__savings">
            <div class="price-comparison__savings-amount">
              <span class="price-comparison__currency">R$</span>
              <span class="price-comparison__value">{{ formatSavings(comparison.savings) }}</span>
            </div>
            <div class="price-comparison__savings-percentage">
              {{ comparison.percentage }}% {{ t('priceComparison.discount') }}
            </div>
          </div>

          <div class="price-comparison__breakdown">
            <div v-if="originalPrice" class="price-comparison__price-row">
              <span class="price-comparison__price-label">{{ t('priceComparison.originalPrice') }}:</span>
              <span class="price-comparison__price-original">{{ formatPrice(originalPrice) }}</span>
            </div>
            <div class="price-comparison__price-row">
              <span class="price-comparison__price-label">{{ t('priceComparison.yourPrice') }}:</span>
              <span class="price-comparison__price-current">{{ formatPrice(currentPrice) }}</span>
            </div>
            <div class="price-comparison__price-row price-comparison__price-row--savings">
              <span class="price-comparison__price-label">{{ t('priceComparison.youSave') }}:</span>
              <span class="price-comparison__price-savings">{{ formatPrice(comparison.savings) }}</span>
            </div>
          </div>

          <div class="price-comparison__urgency-message">
            <Icon :name="urgencyIcon" class="price-comparison__urgency-icon" />
            <span>{{ urgencyMessage }}</span>
          </div>
        </div>

        <div class="price-comparison__footer">
          <div class="price-comparison__timer" v-if="showTimer">
            <Icon name="heroicons:clock" class="price-comparison__timer-icon" />
            <span>{{ timerMessage }}</span>
          </div>
          <div class="price-comparison__guarantee">
            <Icon name="heroicons:shield-check" class="price-comparison__guarantee-icon" />
            <span>{{ t('priceComparison.bestPriceGuaranteed') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PriceComparisonResult } from '@/composables/usePriceComparison'

const { t } = useI18n()

interface Props {
  comparison: PriceComparisonResult | null
  currentPrice: number
  originalPrice?: number
  showTimer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTimer: false
})

// Computed properties
const discountIcon = computed(() => {
  if (!props.comparison) return 'heroicons:currency-dollar'
  
  switch (props.comparison.reason) {
    case 'promoção_ativa':
      return 'heroicons:tag'
    case 'baixa_temporada':
      return 'heroicons:sun'
    case 'ultima_hora':
      return 'heroicons:clock'
    case 'reserva_antecipada':
      return 'heroicons:calendar-days'
    case 'desconto_grupo':
      return 'heroicons:user-group'
    default:
      return 'heroicons:currency-dollar'
  }
})

const urgencyIcon = computed(() => {
  if (!props.comparison) return 'heroicons:information-circle'
  
  switch (props.comparison.urgency) {
    case 'high':
      return 'heroicons:exclamation-triangle'
    case 'medium':
      return 'heroicons:exclamation-circle'
    case 'low':
      return 'heroicons:check-circle'
    default:
      return 'heroicons:information-circle'
  }
})

const urgencyMessage = computed(() => {
  if (!props.comparison) return ''
  
  switch (props.comparison.urgency) {
    case 'high':
      return t('priceComparison.urgency.high')
    case 'medium':
      return t('priceComparison.urgency.medium')
    case 'low':
      return t('priceComparison.urgency.low')
    default:
      return ''
  }
})

const timerMessage = computed(() => {
  if (!props.comparison) return ''
  
  switch (props.comparison.reason) {
    case 'ultima_hora':
      return t('priceComparison.timer.lastMinute')
    case 'reserva_antecipada':
      return t('priceComparison.timer.earlyBooking')
    case 'promoção_ativa':
      return t('priceComparison.timer.activePromotion')
    default:
      return ''
  }
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const formatSavings = (savings: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(savings)
}
</script>

<style scoped>
.price-comparison {
  margin: 1rem 0;
}

.price-comparison__card {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #f59e0b;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  position: relative;
  overflow: hidden;
}

.price-comparison__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.price-comparison__header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price-comparison__icon {
  width: 2rem;
  height: 2rem;
  color: #f59e0b;
  flex-shrink: 0;
}

.price-comparison__title-section {
  flex: 1;
}

.price-comparison__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 0.25rem 0;
}

.price-comparison__subtitle {
  font-size: 0.875rem;
  color: #a16207;
  margin: 0;
  line-height: 1.4;
}

.price-comparison__urgency {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.price-comparison__urgency--high {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
}

.price-comparison__urgency--medium {
  background: #fff7ed;
  color: #ea580c;
  border: 2px solid #fed7aa;
}

.price-comparison__urgency--low {
  background: #f0fdf4;
  color: #059669;
  border: 2px solid #bbf7d0;
}

.price-comparison__content {
  margin-bottom: 1rem;
}

.price-comparison__savings {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.75rem;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.price-comparison__savings-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.price-comparison__currency {
  font-size: 1.5rem;
  font-weight: 600;
  color: #92400e;
}

.price-comparison__value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #92400e;
  line-height: 1;
}

.price-comparison__savings-percentage {
  font-size: 1rem;
  font-weight: 600;
  color: #a16207;
}

.price-comparison__breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.price-comparison__price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.price-comparison__price-row--savings {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  font-weight: 600;
}

.price-comparison__price-label {
  color: #92400e;
  font-weight: 500;
}

.price-comparison__price-original {
  color: #6b7280;
  text-decoration: line-through;
  font-weight: 500;
}

.price-comparison__price-current {
  color: #92400e;
  font-weight: 600;
}

.price-comparison__price-savings {
  color: #059669;
  font-weight: 700;
}

.price-comparison__urgency-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.5rem;
  border: 1px solid rgba(245, 158, 11, 0.2);
  font-size: 0.875rem;
  color: #92400e;
}

.price-comparison__urgency-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.price-comparison__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(245, 158, 11, 0.3);
}

.price-comparison__timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

.price-comparison__timer-icon {
  width: 1rem;
  height: 1rem;
}

.price-comparison__guarantee {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
}

.price-comparison__guarantee-icon {
  width: 1rem;
  height: 1rem;
}

/* Transições */
.price-comparison-enter-active,
.price-comparison-leave-active {
  transition: all 0.5s ease;
}

.price-comparison-enter-from,
.price-comparison-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.price-comparison-enter-to,
.price-comparison-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Responsividade */
@media (max-width: 768px) {
  .price-comparison__card {
    padding: 1rem;
  }
  
  .price-comparison__header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .price-comparison__urgency {
    align-self: center;
  }
  
  .price-comparison__value {
    font-size: 2rem;
  }
  
  .price-comparison__footer {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  .price-comparison__card {
    border-width: 3px;
  }
  
  .price-comparison__title,
  .price-comparison__value {
    color: #000;
  }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .price-comparison__card::before {
    animation: none;
  }
  
  .price-comparison-enter-active,
  .price-comparison-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .price-comparison-enter-from,
  .price-comparison-leave-to {
    transform: none;
  }
}
</style>
