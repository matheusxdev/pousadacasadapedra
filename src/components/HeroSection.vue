<template>
  <section class="hero-section">
    <!-- Background Image -->
    <div class="hero-section__background">
      <img 
        :src="backgroundImage" 
        :alt="backgroundAlt"
        class="hero-section__background-image"
        loading="eager"
      />
      <div 
        class="hero-section__overlay"
        :class="{ 'hero-section__overlay--hidden': isNightImage }"
      ></div>
    </div>
    
    <!-- Content -->
    <div class="hero-section__content">
      <div class="container">
        
        <!-- Main Title -->
        <h1 class="hero-section__title">
          {{ $t('hero.title') }}
        </h1>
        
        <!-- Weather Widget -->
        <ClientOnly>
          <div class="hero-section__weather-main">
            <WeatherWidget />
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WeatherWidget from '@/components/WeatherWidget.vue'

// Props
interface Props {
  backgroundImage?: string
  backgroundAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  backgroundImage: '',
  backgroundAlt: 'Pousada Grupo Caminué em Búzios'
})

// Dynamic background image based on time of day
const backgroundImage = computed(() => {
  if (props.backgroundImage) {
    return props.backgroundImage
  }
  
  const now = new Date()
  const hour = now.getHours()
  
  // Dia: 6h às 18h (hero_light)
  // Noite: 18h às 6h (hero_night)
  if (hour >= 6 && hour < 18) {
    return '/images/hero_light.PNG'
  } else {
    return '/images/hero_night.JPG'
  }
})

// Check if current image is night image
const isNightImage = computed(() => {
  return backgroundImage.value.includes('hero_night')
})
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-section__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-section__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-section__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  transition: opacity 0.3s ease;
}

.hero-section__overlay--hidden {
  opacity: 0;
  pointer-events: none;
}

.hero-section__content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #ffffff;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Weather Widget Main */
.hero-section__weather-main {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

/* Rating Stars - REMOVIDO */
/* .hero-section__rating {
  margin-bottom: 1rem;
}

.hero-section__stars {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.hero-section__star {
  width: 24px;
  height: 24px;
  color: #fbbf24;
} */

/* Offer Badge - REMOVIDO */
/* .hero-section__offer {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
} */

/* Main Title */
.hero-section__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Weather Widget Main */
.hero-section__weather-main {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .hero-section__title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
