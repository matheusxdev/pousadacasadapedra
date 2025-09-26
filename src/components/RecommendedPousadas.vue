<template>
  <section class="recommended-pousadas">
    <div class="container">
      <div class="recommended-pousadas__header">
        <h2 class="recommended-pousadas__title">{{ $t('pousadas.title') }}</h2>
        <div class="recommended-pousadas__divider">
          <div class="recommended-pousadas__circle"></div>
        </div>
        <p class="recommended-pousadas__description">{{ $t('pousadas.description') }}</p>
      </div>

      <div class="recommended-pousadas__grid">
        <div 
          v-for="pousada in pousadas" 
          :key="pousada.id"
          @click="navigateToPousada(pousada)"
          class="recommended-pousadas__card"
        >
          <div class="recommended-pousadas__image-container">
            <img 
              :src="getImageSrc(pousada.logo)" 
              :alt="pousada.name"
              class="recommended-pousadas__logo"
            />
          </div>
          
          <div class="recommended-pousadas__content">
            <h3 class="recommended-pousadas__name">{{ pousada.name }}</h3>
            <p class="recommended-pousadas__description">{{ pousada.description }}</p>
            <div class="recommended-pousadas__features">
              <span v-for="feature in pousada.features" :key="feature" class="recommended-pousadas__feature">
                {{ feature }}
              </span>
            </div>
          </div>
          
          <div class="recommended-pousadas__cta">
            <span class="recommended-pousadas__cta-text">{{ $t('pousadas.viewRooms') }}</span>
            <Icon name="heroicons:arrow-right" class="recommended-pousadas__cta-icon" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const pousadas = [
  {
    id: 'casa-da-pedra',
    name: 'Pousada Casa da Pedra',
    description: 'Conforto e hospitalidade no coração de Búzios',
    logo: 'logo_casadapedra.png',
    features: ['Wi-Fi Gratuito', 'Ar Condicionado', 'Café da Manhã'],
    subcategory: 'casa-da-pedra'
  },
  {
    id: 'canoa-do-mar',
    name: 'Pousada Canoa do Mar',
    description: 'Experiência única à beira-mar em Búzios',
    logo: 'logo_canoadomar.png',
    features: ['Vista para o Mar', 'Piscina', 'Estacionamento'],
    subcategory: 'canoa-do-mar'
  },
  {
    id: 'casa-cacau',
    name: 'Pousada Casa Cacau',
    description: 'Charme e tranquilidade em ambiente acolhedor',
    logo: 'logo_casacacau.avif',
    features: ['Jardim Privativo', 'Café Colonial', 'Recepção 24h'],
    subcategory: 'casa-cacau'
  }
]

const getImageSrc = (logoName: string) => {
  // Usar caminhos da pasta public para evitar problemas de SSR
  return `/images/${logoName}`
}

const navigateToPousada = (pousada: any) => {
  // Navegar para página individual da pousada
  const routeMap: Record<string, string> = {
    'casa-da-pedra': '/pousada-casa-da-pedra',
    'canoa-do-mar': '/pousada-canoa-do-mar',
    'casa-cacau': '/pousada-casa-cacau'
  }
  
  const route = routeMap[pousada.subcategory] || `/pousada-${pousada.subcategory}`
  navigateTo(route)
}
</script>

<style scoped>
.recommended-pousadas {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.recommended-pousadas__header {
  text-align: center;
  margin-bottom: 3rem;
}

.recommended-pousadas__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.recommended-pousadas__divider {
  position: relative;
  margin: 1.5rem auto;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #002279, transparent);
}

.recommended-pousadas__divider::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: #002279;
  border-radius: 50%;
}

.recommended-pousadas__circle {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: #002279;
  border-radius: 50%;
}

.recommended-pousadas__description {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.recommended-pousadas__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.recommended-pousadas__card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.recommended-pousadas__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #002279, #1e40af);
}

.recommended-pousadas__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.recommended-pousadas__image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.recommended-pousadas__logo {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.recommended-pousadas__content {
  text-align: center;
  margin-bottom: 1.5rem;
}

.recommended-pousadas__name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.recommended-pousadas__description {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.recommended-pousadas__features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.recommended-pousadas__feature {
  background: #f8f9fa;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.recommended-pousadas__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #002279;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.recommended-pousadas__card:hover .recommended-pousadas__cta {
  color: #001d5c;
}

.recommended-pousadas__cta-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.recommended-pousadas__card:hover .recommended-pousadas__cta-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .recommended-pousadas {
    padding: 2rem 0;
  }
  
  .recommended-pousadas__title {
    font-size: 2rem;
  }
  
  .recommended-pousadas__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .recommended-pousadas__card {
    padding: 1.5rem;
  }
}
</style>
