<template>
  <button
    v-bind="ctaProps"
    @click="handleClick"
    @mouseenter="trackInteraction('hover')"
    @focus="trackInteraction('view')"
    :disabled="disabled"
    class="optimized-cta"
  >
    <div class="optimized-cta__content">
      <!-- Loading Spinner -->
      <div v-if="loading" class="optimized-cta__spinner">
        <Icon name="heroicons:arrow-path" class="optimized-cta__spinner-icon" />
      </div>
      
      <!-- Icon -->
      <Icon 
        v-else-if="icon" 
        :name="icon" 
        class="optimized-cta__icon" 
      />
      
      <!-- Text -->
      <span class="optimized-cta__text">{{ text }}</span>
      
      <!-- Urgency Indicator -->
      <div v-if="showUrgency" class="optimized-cta__urgency">
        <Icon name="heroicons:exclamation-triangle" class="optimized-cta__urgency-icon" />
      </div>
    </div>
    
    <!-- Progress Bar (for loading states) -->
    <div v-if="loading" class="optimized-cta__progress">
      <div class="optimized-cta__progress-bar"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCTAOptimization, type CTAConfig } from '@/composables/useCTAOptimization'

interface Props {
  productId: string
  text?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  disabled?: boolean
  loading?: boolean
  // Context for optimization
  hasDiscount?: boolean
  hasUrgency?: boolean
  hasScarcity?: boolean
  hasSocialProof?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Reservar agora',
  variant: 'primary',
  size: 'lg',
  disabled: false,
  loading: false,
  hasDiscount: false,
  hasUrgency: false,
  hasScarcity: false,
  hasSocialProof: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Use CTA optimization
const { 
  ctaState, 
  getCTAProps, 
  getCTAContent, 
  trackCTAInteraction,
  simulateClick 
} = useCTAOptimization(props.productId, {
  hasDiscount: props.hasDiscount,
  hasUrgency: props.hasUrgency,
  hasScarcity: props.hasScarcity,
  hasSocialProof: props.hasSocialProof,
  timeOfDay: getTimeOfDay(),
  userBehavior: 'firstVisit' // Could be enhanced with user tracking
})

// Computed
const ctaProps = computed(() => getCTAProps())
const ctaContent = getCTAContent()

const finalText = computed(() => props.text || ctaContent.text)
const finalLoading = computed(() => props.loading || ctaContent.loading)
const showUrgency = computed(() => props.hasUrgency || props.hasScarcity)

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled || finalLoading.value) return
  
  trackCTAInteraction('click')
  emit('click', event)
  
  // Simulate processing
  if (!props.loading) {
    simulateClick()
  }
}

const trackInteraction = (action: 'view' | 'hover') => {
  trackCTAInteraction(action)
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}
</script>

<style scoped>
.optimized-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 3rem;
  padding: 0.75rem 1.5rem;
  
  /* CSS Custom Properties for dynamic theming */
  background: var(--cta-primary, #3b82f6);
  color: white;
  box-shadow: 0 4px 14px 0 var(--cta-shadow, rgba(59, 130, 246, 0.3));
}

.optimized-cta:hover {
  background: var(--cta-hover, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 var(--cta-shadow, rgba(59, 130, 246, 0.4));
}

.optimized-cta:active {
  background: var(--cta-active, #1d4ed8);
  transform: translateY(0);
}

.optimized-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.optimized-cta:disabled:hover {
  transform: none;
  box-shadow: 0 4px 14px 0 var(--cta-shadow, rgba(59, 130, 246, 0.3));
}

/* Size variants */
.optimized-cta--sm {
  min-height: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
}

.optimized-cta--md {
  min-height: 2.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  border-radius: 0.625rem;
}

.optimized-cta--lg {
  min-height: 3rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.75rem;
}

.optimized-cta--xl {
  min-height: 3.5rem;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: 1rem;
}

/* Color variants */
.optimized-cta--primary {
  --cta-primary: #3b82f6;
  --cta-hover: #2563eb;
  --cta-active: #1d4ed8;
  --cta-shadow: rgba(59, 130, 246, 0.3);
}

.optimized-cta--success {
  --cta-primary: #10b981;
  --cta-hover: #059669;
  --cta-active: #047857;
  --cta-shadow: rgba(16, 185, 129, 0.3);
}

.optimized-cta--warning {
  --cta-primary: #f59e0b;
  --cta-hover: #d97706;
  --cta-active: #b45309;
  --cta-shadow: rgba(245, 158, 11, 0.3);
}

.optimized-cta--danger {
  --cta-primary: #ef4444;
  --cta-hover: #dc2626;
  --cta-active: #b91c1c;
  --cta-shadow: rgba(239, 68, 68, 0.3);
}

/* Animation states */
.optimized-cta--pulse {
  animation: cta-pulse 2s infinite;
}

.optimized-cta--glow {
  box-shadow: 0 0 20px var(--cta-shadow, rgba(59, 130, 246, 0.5));
}

.optimized-cta--shadow {
  box-shadow: 0 4px 14px 0 var(--cta-shadow, rgba(59, 130, 246, 0.3));
}

/* Content layout */
.optimized-cta__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.optimized-cta__text {
  white-space: nowrap;
}

.optimized-cta__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Loading spinner */
.optimized-cta__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.optimized-cta__spinner-icon {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

/* Urgency indicator */
.optimized-cta__urgency {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1rem;
  height: 1rem;
  background: #ef4444;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: urgency-pulse 1.5s infinite;
}

.optimized-cta__urgency-icon {
  width: 0.5rem;
  height: 0.5rem;
  color: white;
}

/* Progress bar */
.optimized-cta__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.optimized-cta__progress-bar {
  height: 100%;
  background: white;
  animation: progress-loading 2s ease-in-out infinite;
}

/* Animations */
@keyframes cta-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes urgency-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
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

@keyframes progress-loading {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }
  50% {
    width: 100%;
    transform: translateX(0%);
  }
  100% {
    width: 100%;
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .optimized-cta {
    width: 100%;
    min-height: 2.75rem;
  }
  
  .optimized-cta--xl {
    min-height: 3rem;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .optimized-cta__content {
    gap: 0.375rem;
  }
  
  .optimized-cta__text {
    font-size: 0.875rem;
  }
}
</style>
