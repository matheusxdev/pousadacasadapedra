<template>
  <div v-if="hasDiscount || psychology.anchorVisible" class="pricing-psychology">
    <!-- Discount Badge -->
    <div v-if="discountBadge" :class="`pricing-psychology__badge pricing-psychology__badge--${discountBadge.color}`">
      <Icon name="heroicons:tag" class="pricing-psychology__badge-icon" />
      <span>{{ discountBadge.text }}</span>
    </div>

    <!-- Price Display -->
    <div class="pricing-psychology__price-container">
      <!-- Anchor Price (Strikethrough) -->
      <div v-if="psychology.anchorVisible" class="pricing-psychology__anchor">
        <span class="pricing-psychology__anchor-price">
          {{ formatCurrency(pricingData.originalPrice) }}
        </span>
        <span class="pricing-psychology__anchor-label">Preço original</span>
      </div>

      <!-- Current Price -->
      <div class="pricing-psychology__current">
        <span class="pricing-psychology__current-price" :style="{ color: priceColor }">
          {{ formatCurrency(pricingData.currentPrice) }}
        </span>
        <span v-if="pricingData.unit" class="pricing-psychology__current-unit">
          {{ getUnitText(pricingData.unit) }}
        </span>
      </div>

      <!-- Savings Highlight -->
      <div v-if="savingsHighlight" :class="`pricing-psychology__savings pricing-psychology__savings--${savingsHighlight.emphasis}`">
        <Icon name="heroicons:currency-dollar" class="pricing-psychology__savings-icon" />
        <span>{{ savingsHighlight.text }}</span>
      </div>
    </div>

    <!-- Value Indicators -->
    <div v-if="psychology.valueIndicators.length > 0" class="pricing-psychology__value-indicators">
      <div 
        v-for="(indicator, index) in psychology.valueIndicators" 
        :key="index"
        class="pricing-psychology__value-item"
      >
        <Icon name="heroicons:check-circle" class="pricing-psychology__value-icon" />
        <span>{{ indicator }}</span>
      </div>
    </div>

    <!-- Comparison Texts -->
    <div v-if="comparisonTexts.length > 0" class="pricing-psychology__comparisons">
      <div 
        v-for="(text, index) in comparisonTexts.slice(0, 2)" 
        :key="index"
        class="pricing-psychology__comparison-item"
      >
        <Icon name="heroicons:arrow-trending-down" class="pricing-psychology__comparison-icon" />
        <span>{{ text }}</span>
      </div>
    </div>

    <!-- Urgency Message -->
    <div v-if="urgencyMessage" class="pricing-psychology__urgency">
      <Icon name="heroicons:clock" class="pricing-psychology__urgency-icon" />
      <span>{{ urgencyMessage }}</span>
    </div>

    <!-- Psychology Tips -->
    <div class="pricing-psychology__tips">
      <div class="pricing-psychology__tip">
        <Icon name="heroicons:shield-check" class="pricing-psychology__tip-icon" />
        <span>Preço final - sem taxas ocultas</span>
      </div>
      <div class="pricing-psychology__tip">
        <Icon name="heroicons:arrow-path" class="pricing-psychology__tip-icon" />
        <span>Cancelamento grátis até 24h antes</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { usePricingPsychology, type PricingData } from '@/composables/usePricingPsychology'

interface Props {
  productId: string
  pricingData: PricingData
  showTips?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTips: true
})

// Use the composable
const {
  psychology,
  hasDiscount,
  discountPercentage,
  savingsAmount,
  valueIndicators,
  comparisonTexts,
  getUrgencyMessage,
  getDiscountBadge,
  getPriceColor,
  getSavingsHighlight
} = usePricingPsychology(props.productId, toRef(props, 'pricingData'))

// Computed
const discountBadge = computed(() => getDiscountBadge())
const priceColor = computed(() => getPriceColor())
const savingsHighlight = computed(() => getSavingsHighlight())
const urgencyMessage = computed(() => getUrgencyMessage())

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const getUnitText = (unit: string) => {
  const units = {
    per_person: 'por pessoa',
    per_hour: 'por hora', 
    per_day: 'por dia',
    total: 'total'
  }
  return units[unit as keyof typeof units] || ''
}
</script>

<style scoped>
.pricing-psychology {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
}

.pricing-psychology::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
}

/* Badge */
.pricing-psychology__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.pricing-psychology__badge--red {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.pricing-psychology__badge--orange {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.pricing-psychology__badge--green {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.pricing-psychology__badge--blue {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.pricing-psychology__badge-icon {
  width: 1rem;
  height: 1rem;
}

/* Price Container */
.pricing-psychology__price-container {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.pricing-psychology__anchor {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pricing-psychology__anchor-price {
  font-size: 1.125rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.pricing-psychology__anchor-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.pricing-psychology__current {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pricing-psychology__current-price {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.pricing-psychology__current-unit {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Savings */
.pricing-psychology__savings {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.pricing-psychology__savings--high {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.pricing-psychology__savings--medium {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.pricing-psychology__savings--low {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.pricing-psychology__savings-icon {
  width: 1rem;
  height: 1rem;
}

/* Value Indicators */
.pricing-psychology__value-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.pricing-psychology__value-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  color: #166534;
  font-weight: 500;
}

.pricing-psychology__value-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #16a34a;
  flex-shrink: 0;
}

/* Comparisons */
.pricing-psychology__comparisons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.pricing-psychology__comparison-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #059669;
  font-weight: 500;
  font-size: 0.875rem;
}

.pricing-psychology__comparison-icon {
  width: 1rem;
  height: 1rem;
}

/* Urgency */
.pricing-psychology__urgency {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: pulse-urgency 2s infinite;
}

.pricing-psychology__urgency-icon {
  width: 1rem;
  height: 1rem;
}

/* Tips */
.pricing-psychology__tips {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.pricing-psychology__tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.pricing-psychology__tip-icon {
  width: 1rem;
  height: 1rem;
  color: #10b981;
}

/* Animations */
@keyframes pulse-urgency {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .pricing-psychology {
    padding: 1rem;
  }

  .pricing-psychology__price-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .pricing-psychology__current-price {
    font-size: 1.75rem;
  }

  .pricing-psychology__value-indicators {
    gap: 0.5rem;
  }

  .pricing-psychology__value-item {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .pricing-psychology__tips {
    gap: 0.375rem;
  }

  .pricing-psychology__tip {
    font-size: 0.8rem;
  }
}
</style>
