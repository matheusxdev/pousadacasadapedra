<template>
  <section class="recommended-accommodations">
    <div class="container">
      <div class="recommended-accommodations__header">
        <h2 class="recommended-accommodations__title">{{ $t('recommended.title') }}</h2>
        <div class="recommended-accommodations__divider">
          <div class="recommended-accommodations__circle"></div>
        </div>
        <p class="recommended-accommodations__description">{{ $t('recommended.description') }}</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="recommended-accommodations__loading">
        <div class="recommended-accommodations__skeleton">
          <div v-for="i in 3" :key="i" class="recommended-accommodations__skeleton-card">
            <div class="recommended-accommodations__skeleton-image"></div>
            <div class="recommended-accommodations__skeleton-content">
              <div class="recommended-accommodations__skeleton-title"></div>
              <div class="recommended-accommodations__skeleton-location"></div>
              <div class="recommended-accommodations__skeleton-price"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="recommended-accommodations__error">
        <p>{{ error }}</p>
        <button @click="fetchRecommendedAccommodations" class="recommended-accommodations__retry">
          Tentar Novamente
        </button>
      </div>
      
      <!-- Content -->
      <div v-else class="recommended-accommodations__grid">
        <NuxtLink 
          v-for="accommodation in accommodations" 
          :key="accommodation.id"
          :to="`/accommodations/${accommodation.slug || accommodation.id}`"
          class="recommended-accommodations__card"
        >
          <div class="recommended-accommodations__image-container">
            <img 
              :src="accommodation.image" 
              :alt="accommodation.name"
              class="recommended-accommodations__image"
              @error="handleImageError"
            >
            <button class="recommended-accommodations__favorite">
              <Icon name="heroicons:heart" />
            </button>
          </div>
          
          <div class="recommended-accommodations__content">
            <h3 class="recommended-accommodations__name">{{ accommodation.name }}</h3>
            
            <div class="recommended-accommodations__location">
              <Icon name="heroicons:map-pin" />
              <span>{{ accommodation.location }}</span>
            </div>
            
            <div class="recommended-accommodations__price">
              <span class="recommended-accommodations__price-amount">{{ accommodation.price }}</span>
              <span v-if="!accommodation.price.includes('consultar')" class="recommended-accommodations__price-period">{{ $t('recommended.perNight') }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
      
      <div class="recommended-accommodations__cta">
        <NuxtLink to="/accommodations" class="recommended-accommodations__button">
          {{ $t('recommended.seeAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecommendedAccommodations } from '~/composables/useRecommendedAccommodations'

interface Accommodation {
  id: string
  name: string
  location: string
  price: string
  image: string
  slug?: string
  rating?: number
  reviews?: number
}

const { accommodations, loading, error, fetchRecommendedAccommodations } = useRecommendedAccommodations()

// Carregar dados ao montar o componente
onMounted(() => {
  fetchRecommendedAccommodations()
})

// Função para lidar com erro de imagem
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
}
</script>

<style scoped>
.recommended-accommodations {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.recommended-accommodations__header {
  text-align: center;
  margin-bottom: 4rem;
}

.recommended-accommodations__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.recommended-accommodations__divider {
  position: relative;
  margin: 1.5rem 0;
}

.recommended-accommodations__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 1px;
  background: #e9ecef;
}

.recommended-accommodations__circle {
  width: 12px;
  height: 12px;
  background: #1E3A8A;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.recommended-accommodations__description {
  font-size: 1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.recommended-accommodations__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.recommended-accommodations__card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}

.recommended-accommodations__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.recommended-accommodations__image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.recommended-accommodations__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommended-accommodations__card:hover .recommended-accommodations__image {
  transform: scale(1.05);
}

.recommended-accommodations__favorite {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.recommended-accommodations__favorite:hover {
  background: white;
  transform: scale(1.1);
}

.recommended-accommodations__favorite svg {
  width: 20px;
  height: 20px;
  color: #1E3A8A;
}

.recommended-accommodations__content {
  padding: 1.5rem;
}

.recommended-accommodations__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.recommended-accommodations__location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.recommended-accommodations__location svg {
  width: 16px;
  height: 16px;
  color: #1E3A8A;
}

.recommended-accommodations__price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.recommended-accommodations__price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E3A8A;
}

.recommended-accommodations__price-period {
  font-size: 0.875rem;
  color: #6c757d;
}

.recommended-accommodations__cta {
  text-align: center;
}

.recommended-accommodations__button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1E3A8A;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.recommended-accommodations__button:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
}

/* Loading States */
.recommended-accommodations__loading {
  margin-bottom: 3rem;
}

.recommended-accommodations__skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.recommended-accommodations__skeleton-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.recommended-accommodations__skeleton-image {
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.recommended-accommodations__skeleton-content {
  padding: 1.5rem;
}

.recommended-accommodations__skeleton-title {
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.recommended-accommodations__skeleton-location {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 60%;
}

.recommended-accommodations__skeleton-price {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 40%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.recommended-accommodations__error {
  text-align: center;
  padding: 3rem 0;
  color: #dc3545;
}

.recommended-accommodations__retry {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #1E3A8A;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommended-accommodations__retry:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .recommended-accommodations {
    padding: 4rem 0;
  }
  
  .recommended-accommodations__title {
    font-size: 2rem;
  }
  
  .recommended-accommodations__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .recommended-accommodations__image-container {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .recommended-accommodations__header {
    margin-bottom: 2.5rem;
  }
  
  .recommended-accommodations__title {
    font-size: 1.75rem;
  }
  
  .recommended-accommodations__content {
    padding: 1.25rem;
  }
}
</style>
