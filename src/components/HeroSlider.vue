<template>
  <div 
    class="hero-slider"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="hero-slider__container">
      <div class="hero-slider__slides">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="hero-slider__slide"
          :class="{ 'hero-slider__slide--active': currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="hero-slider__overlay"></div>
          <div class="hero-slider__content">
            <h1 class="hero-slider__title">{{ slide.titleKey ? $t(slide.titleKey) : slide.title }}</h1>
            <p v-if="slide.subtitleKey || slide.subtitle" class="hero-slider__subtitle">{{ slide.subtitleKey ? $t(slide.subtitleKey) : slide.subtitle }}</p>
            <NuxtLink 
              v-if="(slide.ctaKey || slide.ctaText) && slide.to" 
              :to="slide.to" 
              class="hero-slider__cta"
            >
              {{ slide.ctaKey ? $t(slide.ctaKey) : slide.ctaText }}
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Controles de Navegação -->
      <button 
        v-if="slides.length > 1"
        class="hero-slider__control hero-slider__control--prev"
        @click="prevSlide"
        :aria-label="$t('common.previous')"
      >
        <Icon name="heroicons:chevron-left" />
      </button>
      
      <button 
        v-if="slides.length > 1"
        class="hero-slider__control hero-slider__control--next"
        @click="nextSlide"
        :aria-label="$t('common.next')"
      >
        <Icon name="heroicons:chevron-right" />
      </button>
      
      <!-- Indicadores (Dots) -->
      <div v-if="slides.length > 1" class="hero-slider__indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          class="hero-slider__indicator"
          :class="{ 'hero-slider__indicator--active': currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`${$t('common.goTo')} ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Slide {
  image: string
  title?: string
  titleKey?: string
  subtitle?: string
  subtitleKey?: string
  ctaText?: string
  ctaKey?: string
  to?: string
}

interface Props {
  slides: Slide[]
  autoplay?: boolean
  autoplayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  autoplayInterval: 6000
})

const currentSlide = ref(0)
const autoplayTimer = ref<NodeJS.Timeout | null>(null)


const nextSlide = () => {
  if (props.slides.length > 1) {
    currentSlide.value = (currentSlide.value + 1) % props.slides.length
  }
}

const prevSlide = () => {
  if (props.slides.length > 1) {
    currentSlide.value = currentSlide.value === 0 
      ? props.slides.length - 1 
      : currentSlide.value - 1
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < props.slides.length) {
    currentSlide.value = index
  }
}


const startAutoplay = () => {
  if (props.autoplay && props.slides.length > 1) {
    autoplayTimer.value = setInterval(nextSlide, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

// Pause autoplay on hover
const handleMouseEnter = () => {
  stopAutoplay()
}

const handleMouseLeave = () => {
  startAutoplay()
}


onMounted(() => {
  // Delay inicial para evitar problemas de hidratação
  setTimeout(() => {
    if (props.slides.length > 1) {
      startAutoplay()
    }
  }, 1000)
})

onUnmounted(() => {
  stopAutoplay()
})

</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 4rem;
}

.hero-slider__container {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slider__slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slider__slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(1.1);
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slider__slide--active {
  opacity: 1;
  transform: scale(1);
}

.hero-slider__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%);
  z-index: 1;
}

.hero-slider__content {
  position: relative;
  z-index: 100;
  text-align: center;
  color: white !important;
  max-width: 800px;
  padding: 3rem 2rem;
  opacity: 1;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.hero-slider__title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white !important;
  display: block !important;
  visibility: visible !important;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.hero-slider__subtitle {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95) !important;
  display: block !important;
  visibility: visible !important;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.hero-slider__cta {
  display: inline-block;
  background: linear-gradient(135deg, #fc6807 0%, #ff8c42 100%);
  color: white !important;
  padding: 1.5rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(252, 104, 7, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.hero-slider__cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.hero-slider__cta:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 20px 40px rgba(252, 104, 7, 0.6);
}

.hero-slider__cta:hover::before {
  left: 100%;
}

/* Controles de Navegação */
.hero-slider__control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-slider__control:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.hero-slider__control--prev {
  left: var(--space-lg);
}

.hero-slider__control--next {
  right: var(--space-lg);
}

.hero-slider__control svg {
  width: 24px;
  height: 24px;
}

/* Indicadores */
.hero-slider__indicators {
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: var(--space-sm);
}

.hero-slider__indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-slider__indicator:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.hero-slider__indicator--active {
  background-color: var(--brand);
  transform: scale(1.2);
}

/* Animações Modernas */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes titleGlow {
  from {
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  to {
    text-shadow: 0 4px 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(102, 126, 234, 0.4);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}


/* Responsividade */
@media (max-width: 768px) {
  .hero-slider {
    height: 60vh;
    min-height: 400px;
    border-radius: 16px;
  }
  
  .hero-slider__content {
    padding: 2rem 1.5rem;
    border-radius: 16px;
    max-width: 90%;
  }
  
  .hero-slider__title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .hero-slider__subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .hero-slider__cta {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-slider__title {
    font-size: 2rem;
  }
  
  .hero-slider__subtitle {
    font-size: 1rem;
  }
  
  .hero-slider__cta {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}

</style>

