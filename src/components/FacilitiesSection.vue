<template>
  <section class="facilities-section">
    <div class="container">
      <div class="facilities-section__header">
        <p class="facilities-section__offer">{{ $t('facilities.offer') }}</p>
        <h2 class="facilities-section__title">{{ $t('facilities.title') }}</h2>
        <p class="facilities-section__description">{{ $t('facilities.description') }}</p>
      </div>
      
      <div class="facilities-section__grid">
        <div 
          v-for="facility in facilities" 
          :key="facility.id"
          class="facilities-section__item"
        >
          <div class="facilities-section__icon">
            <Icon :name="facility.icon" />
          </div>
          <div class="facilities-section__content">
            <h3 class="facilities-section__item-title">{{ facility.title }}</h3>
            <p v-if="facility.description" class="facilities-section__item-description">{{ facility.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Facility {
  id: string
  icon: string
  title: string
  description: string
}

const facilities: Facility[] = [
  {
    id: 'reception',
    icon: 'heroicons:building-office-2',
    title: 'Recepção',
    description: 'Diurna e noturna'
  },
  {
    id: 'wifi',
    icon: 'heroicons:wifi',
    title: 'WiFi',
    description: 'gratuito'
  },
  {
    id: 'breakfast',
    icon: 'heroicons:cake',
    title: 'Café da manhã',
    description: 'Buffet'
  },
  {
    id: 'languages',
    icon: 'heroicons:language',
    title: 'Idiomas',
    description: 'Espanhol, português e inglês'
  },
  {
    id: 'tv',
    icon: 'heroicons:tv',
    title: 'TV',
    description: 'TV a cabo'
  },
  {
    id: 'air-conditioning',
    icon: 'heroicons:sun',
    title: 'Ar',
    description: 'condicionado'
  },
  {
    id: 'service',
    icon: 'heroicons:user-group',
    title: 'Serviço',
    description: 'de camareira e limpeza diária'
  },
  {
    id: 'smoking-area',
    icon: 'heroicons:fire',
    title: 'Área',
    description: 'de fumantes'
  },
  {
    id: 'dining-room',
    icon: 'heroicons:home-modern',
    title: 'Sala de jantar',
    description: ''
  }
]
</script>

<style scoped>
.facilities-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  position: relative;
  overflow: hidden;
}

.facilities-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, rgba(229, 90, 43, 0.1) 0%, rgba(229, 90, 43, 0.05) 100%);
  border-radius: 50%;
  z-index: 0;
}

.facilities-section::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(229, 90, 43, 0.08) 0%, rgba(229, 90, 43, 0.03) 100%);
  border-radius: 50%;
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.facilities-section__header {
  text-align: center;
  margin-bottom: 5rem;
}

.facilities-section__offer {
  font-size: 0.875rem;
  color: #1E3A8A;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.facilities-section__title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.facilities-section__description {
  font-size: 1.125rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
}

.facilities-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.facilities-section__item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.facilities-section__item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1E3A8A 0%, #1E3A8A 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.facilities-section__item:hover::before {
  transform: scaleX(1);
}

.facilities-section__item:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.facilities-section__icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 4px 12px rgba(229, 90, 43, 0.3);
  color: white !important;
}

.facilities-section__icon::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%);
  border-radius: 18px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.facilities-section__item:hover .facilities-section__icon::before {
  opacity: 0.3;
}

.facilities-section__icon svg {
  width: 2em !important;
  height: 2em !important;
  color: white !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Sobrescrever especificamente os ícones do Heroicons com maior especificidade */
.facilities-section .facilities-section__icon :where(.i-heroicons-building-office-2),
.facilities-section .facilities-section__icon :where(.i-heroicons-wifi),
.facilities-section .facilities-section__icon :where(.i-heroicons-cake),
.facilities-section .facilities-section__icon :where(.i-heroicons-language),
.facilities-section .facilities-section__icon :where(.i-heroicons-tv),
.facilities-section .facilities-section__icon :where(.i-heroicons-sun),
.facilities-section .facilities-section__icon :where(.i-heroicons-user-group),
.facilities-section .facilities-section__icon :where(.i-heroicons-fire),
.facilities-section .facilities-section__icon :where(.i-heroicons-home-modern) {
  width: 2em !important;
  height: 2em !important;
  display: inline-block !important;
}

/* Forçar tamanho com seletores mais específicos */
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-building-office-2),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-wifi),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-cake),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-language),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-tv),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-sun),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-user-group),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-fire),
.facilities-section__icon[data-v-07d3002e] :where(.i-heroicons-home-modern) {
  width: 2em !important;
  height: 2em !important;
}

.facilities-section__content {
  flex: 1;
}

.facilities-section__item-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.facilities-section__item-description {
  font-size: 0.95rem;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .facilities-section {
    padding: 4rem 0;
  }
  
  .facilities-section__title {
    font-size: 2.25rem;
  }
  
  .facilities-section__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .facilities-section__item {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  
  .facilities-section__icon {
    width: 55px;
    height: 55px;
    color: white !important;
  }
  
  .facilities-section__icon svg {
    color: white !important;
  }
  
  .facilities-section__item-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .facilities-section__header {
    margin-bottom: 3rem;
  }
  
  .facilities-section__title {
    font-size: 1.875rem;
  }
  
  .facilities-section__item {
    padding: 1.25rem;
    gap: 1rem;
  }
  
  .facilities-section__icon {
    width: 50px;
    height: 50px;
    color: white !important;
  }
  
  .facilities-section__icon svg {
    color: white !important;
  }
}
</style>
