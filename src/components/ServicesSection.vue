<template>
  <section class="services-section">
    <div class="container">
      <div class="services-section__content">
        <!-- Texto à esquerda -->
        <div class="services-section__text">
          <p class="services-section__subtitle">{{ $t('services.subtitle') }}</p>
          <h2 class="services-section__title">{{ $t('services.title') }}</h2>
          <p class="services-section__description">{{ $t('services.description') }}</p>
          
          <NuxtLink to="/accommodations" class="services-section__cta">
            {{ $t('services.seeMore') }}
          </NuxtLink>
        </div>
        
        <!-- Imagens à direita -->
        <div class="services-section__images">
          <div class="services-section__image services-section__image--left">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Restaurante da Grupo Caminué"
              loading="lazy"
            >
          </div>
          <div class="services-section__image services-section__image--right">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" 
              alt="Salão de eventos da Grupo Caminué"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useServiceStats } from '~/composables/useServiceStats'

const { stats, loading, error } = useServiceStats()
</script>

<style scoped>
.services-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.services-section__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.services-section__text {
  padding-right: 2rem;
}

.services-section__subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.services-section__title {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.services-section__description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.services-section__cta {
  display: inline-block;
  background: #1E3A8A;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 3rem;
}

.services-section__cta:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
}

.services-section__stats {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
}

.services-section__stat {
  display: flex;
  flex-direction: column;
}

.services-section__stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.services-section__stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.25rem;
}

.services-section__images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 500px;
}

.services-section__image {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.services-section__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.services-section__image:hover img {
  transform: scale(1.05);
}

.services-section__image--left {
  align-self: start;
}

.services-section__image--right {
  align-self: end;
}

/* Responsive */
@media (max-width: 1024px) {
  .services-section__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .services-section__text {
    padding-right: 0;
    text-align: center;
  }
  
  .services-section__images {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 4rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .services-section__title {
    font-size: 2rem;
  }
  
  .services-section__description {
    font-size: 1rem;
  }
  
  .services-section__stats {
    justify-content: center;
    gap: 1.5rem;
  }
  
  .services-section__stat-number {
    font-size: 2rem;
  }
  
  .services-section__images {
    height: 300px;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .services-section__stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .services-section__stat {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  
  .services-section__stat-number {
    font-size: 1.5rem;
  }
  
  .services-section__stat-label {
    margin-top: 0;
  }
}
</style>
