<template>
  <div class="weather-widget" v-if="weatherData">
    <div class="weather-widget__content">
      <!-- Ícone do clima -->
      <div class="weather-widget__icon">
        <img 
          :src="weatherIcon" 
          :alt="weatherData.description"
          class="weather-widget__icon-img"
        />
      </div>
      
      <!-- Informações do clima -->
      <div class="weather-widget__info">
        <div class="weather-widget__temp">
          {{ Math.round(weatherData.temp) }}°C
        </div>
        <div class="weather-widget__description">
          {{ formatWeatherDescription(weatherData.description) }}
        </div>
        <div class="weather-widget__location">
          <Icon name="heroicons:map-pin" class="weather-widget__location-icon" />
          Búzios, RJ
        </div>
      </div>
      
      <!-- Detalhes adicionais -->
      <div class="weather-widget__details">
        <div class="weather-widget__detail">
          <Icon name="heroicons:eye" class="weather-widget__detail-icon" />
          <span>{{ weatherData.humidity }}%</span>
        </div>
        <div class="weather-widget__detail">
          <Icon name="heroicons:arrow-path" class="weather-widget__detail-icon" />
          <span>{{ weatherData.windSpeed }} km/h</span>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="weather-widget__loading">
      <div class="weather-widget__spinner"></div>
      <span>Carregando clima...</span>
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="weather-widget__error">
      <Icon name="heroicons:exclamation-triangle" class="weather-widget__error-icon" />
      <span>Erro ao carregar clima</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useWeather } from '@/composables/useWeather'

const { 
  weatherData, 
  loading, 
  error, 
  fetchWeather, 
  getWeatherIcon, 
  formatWeatherDescription 
} = useWeather()

// Ícone do clima
const weatherIcon = computed(() => {
  if (!weatherData.value?.icon) return '/images/weather/default.png'
  return getWeatherIcon(weatherData.value.icon)
})

// Atualizar clima a cada 10 minutos
let weatherInterval: NodeJS.Timeout | null = null

onMounted(() => {
  fetchWeather()
  
  // Atualizar a cada 10 minutos
  weatherInterval = setInterval(() => fetchWeather(), 10 * 60 * 1000)
})

onUnmounted(() => {
  if (weatherInterval) {
    clearInterval(weatherInterval)
  }
})
</script>

<style scoped>
.weather-widget {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
  transition: all 0.3s ease;
}

.weather-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.weather-widget__content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-widget__icon {
  flex-shrink: 0;
}

.weather-widget__icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(2000%) hue-rotate(220deg) brightness(0.8) contrast(1.1);
}

.weather-widget__info {
  flex: 1;
  min-width: 0;
}

.weather-widget__temp {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.weather-widget__description {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.weather-widget__location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.weather-widget__location-icon {
  width: 12px;
  height: 12px;
}

.weather-widget__details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.weather-widget__detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.weather-widget__detail-icon {
  width: 12px;
  height: 12px;
}

/* Loading state */
.weather-widget__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #6b7280;
}

.weather-widget__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error state */
.weather-widget__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #ef4444;
}

.weather-widget__error-icon {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .weather-widget {
    min-width: 240px;
    padding: 1rem;
  }
  
  .weather-widget__content {
    gap: 0.75rem;
  }
  
  .weather-widget__temp {
    font-size: 1.5rem;
  }
  
  .weather-widget__icon-img {
    width: 40px;
    height: 40px;
  }
  
  .weather-widget__details {
    display: none; /* Ocultar detalhes no mobile para economizar espaço */
  }
}
</style>
