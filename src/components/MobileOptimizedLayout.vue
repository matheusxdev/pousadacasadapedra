<template>
  <div 
    :class="[
      'mobile-optimized-layout',
      `mobile-optimized-layout--${deviceType}`,
      {
        'mobile-optimized-layout--touch': isTouchDevice,
        'mobile-optimized-layout--low-end': deviceMetrics.isLowEndDevice
      }
    ]"
  >
    <!-- Mobile Navigation -->
    <nav v-if="isMobile && config.ux.stickyNavigation" class="mobile-nav">
      <div class="mobile-nav__container">
        <button 
          class="mobile-nav__item"
          @click="scrollToSection('hero')"
          :aria-label="$t('nav.home')"
        >
          <Icon name="heroicons:home" />
          <span>Início</span>
        </button>
        
        <button 
          class="mobile-nav__item"
          @click="scrollToSection('info')"
          :aria-label="$t('tour.description')"
        >
          <Icon name="heroicons:information-circle" />
          <span>Info</span>
        </button>
        
        <button 
          class="mobile-nav__item"
          @click="scrollToSection('booking')"
          :aria-label="$t('tour.bookNow')"
        >
          <Icon name="heroicons:calendar-days" />
          <span>Reservar</span>
        </button>
        
        <button 
          class="mobile-nav__item"
          @click="scrollToSection('reviews')"
          :aria-label="$t('reviews.totalReviews')"
        >
          <Icon name="heroicons:star" />
          <span>Avaliações</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="mobile-optimized-layout__content">
      <slot />
    </div>

    <!-- Floating CTA -->
    <div 
      v-if="isMobile && config.ux.floatingCTA" 
      class="floating-cta"
      :class="{ 'floating-cta--visible': showFloatingCTA }"
    >
      <button 
        class="floating-cta__button"
        @click="scrollToBooking"
        @touchstart="(e) => addHapticFeedback(e.target as HTMLElement)"
      >
        <Icon name="heroicons:calendar-days" class="floating-cta__icon" />
        <span class="floating-cta__text">Reservar</span>
        <div class="floating-cta__pulse"></div>
      </button>
    </div>

    <!-- Quick Actions -->
    <div 
      v-if="isMobile && config.conversion.quickActions" 
      class="quick-actions"
    >
      <button 
        class="quick-actions__item"
        @click="shareProduct"
        @touchstart="(e) => addHapticFeedback(e.target as HTMLElement)"
      >
        <Icon name="heroicons:share" />
        <span>Compartilhar</span>
      </button>
      
      <button 
        class="quick-actions__item"
        @click="toggleFavorite"
        @touchstart="(e) => addHapticFeedback(e.target as HTMLElement)"
      >
        <Icon name="heroicons:heart" />
        <span>Favoritar</span>
      </button>
      
      <button 
        class="quick-actions__item"
        @click="openWhatsApp"
        @touchstart="(e) => addHapticFeedback(e.target as HTMLElement)"
      >
        <Icon name="heroicons:chat-bubble-left-right" />
        <span>WhatsApp</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMobileOptimization } from '@/composables/useMobileOptimization'

interface Props {
  productId: string
  productName?: string
  productUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  productName: 'Produto',
  productUrl: ''
})

const emit = defineEmits<{
  share: [data: { productId: string, productName: string, productUrl: string }]
  favorite: [productId: string]
}>()

// Mobile optimization
const {
  isMobile,
  isTouchDevice,
  deviceType,
  deviceMetrics,
  optimizationConfig,
  addHapticFeedback
} = useMobileOptimization()

// State
const showFloatingCTA = ref(false)
const scrollPosition = ref(0)

// Computed
const config = computed(() => optimizationConfig.value)

// Methods
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToBooking = () => {
  scrollToSection('booking')
  // Haptic feedback will be handled by touchstart event
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: props.productName,
      text: `Confira este produto: ${props.productName}`,
      url: props.productUrl || window.location.href
    })
  } else {
    // Fallback for browsers without native sharing
    navigator.clipboard.writeText(window.location.href)
    // Could show a toast notification here
  }
  
  emit('share', {
    productId: props.productId,
    productName: props.productName,
    productUrl: props.productUrl || window.location.href
  })
  
  // Haptic feedback will be handled by touchstart event
}

const toggleFavorite = () => {
  emit('favorite', props.productId)
  // Haptic feedback will be handled by touchstart event
}

const openWhatsApp = () => {
  const message = `Olá! Gostaria de mais informações sobre: ${props.productName}`
  const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
  // Haptic feedback will be handled by touchstart event
}

const handleScroll = () => {
  scrollPosition.value = window.scrollY
  
  // Show floating CTA when user has scrolled past hero section
  showFloatingCTA.value = scrollPosition.value > 300
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.mobile-optimized-layout {
  position: relative;
  min-height: 100vh;
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-nav__container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.mobile-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  min-width: 44px;
  justify-content: center;
}

.mobile-nav__item:hover,
.mobile-nav__item:active {
  color: #3b82f6;
  background: #f0f9ff;
}

.mobile-nav__item svg {
  width: 20px;
  height: 20px;
}

/* Floating CTA */
.floating-cta {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 99;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-cta--visible {
  opacity: 1;
  transform: translateY(0);
}

.floating-cta__button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  overflow: hidden;
}

.floating-cta__button:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
}

.floating-cta__button:active {
  transform: translateY(0);
}

.floating-cta__icon {
  width: 18px;
  height: 18px;
}

.floating-cta__pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  animation: pulse 2s infinite;
}

/* Quick Actions */
.quick-actions {
  position: fixed;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 98;
}

.quick-actions__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  min-width: 44px;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions__item:hover {
  color: #3b82f6;
  background: #f0f9ff;
  border-color: #93c5fd;
  transform: translateY(-2px);
}

.quick-actions__item svg {
  width: 16px;
  height: 16px;
}

/* Content adjustments */
.mobile-optimized-layout__content {
  padding-bottom: 80px; /* Space for mobile nav */
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .floating-cta {
    bottom: 90px;
    right: 12px;
  }
  
  .floating-cta__button {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
  
  .quick-actions {
    right: 12px;
  }
}

/* Touch optimizations */
.mobile-optimized-layout--touch .mobile-nav__item,
.mobile-optimized-layout--touch .floating-cta__button,
.mobile-optimized-layout--touch .quick-actions__item {
  touch-action: manipulation;
}

/* Low-end device optimizations */
.mobile-optimized-layout--low-end .floating-cta__pulse {
  animation: none;
}

.mobile-optimized-layout--low-end .quick-actions__item:hover {
  transform: none;
}

/* Tablet specific */
.mobile-optimized-layout--tablet .mobile-nav {
  display: none;
}

.mobile-optimized-layout--tablet .mobile-optimized-layout__content {
  padding-bottom: 0;
}
</style>
