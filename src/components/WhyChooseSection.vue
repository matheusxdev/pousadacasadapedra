<template>
  <section class="why-choose-section">
    <div class="container">
      <div class="why-choose-section__header">
        <p class="why-choose-section__subtitle">{{ $t('whyChoose.subtitle') }}</p>
        <h2 class="why-choose-section__title">{{ $t('whyChoose.title') }}</h2>
        <p class="why-choose-section__description">{{ $t('whyChoose.description') }}</p>
      </div>
      
      <div class="why-choose-section__grid">
        <div 
          v-for="reason in reasons" 
          :key="reason.id"
          class="why-choose-section__card"
        >
          <div class="why-choose-section__icon">
            <Icon :name="reason.icon" />
          </div>
          <div class="why-choose-section__content">
            <h3 class="why-choose-section__card-title">{{ reason.title }}</h3>
            <p class="why-choose-section__card-description">{{ reason.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="why-choose-section__cta">
        <NuxtLink to="/accommodations" class="why-choose-section__button">
          {{ $t('whyChoose.cta') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Reason {
  id: string
  icon: string
  title: string
  description: string
}

const reasons: Reason[] = [
  {
    id: 'location',
    icon: 'heroicons:map-pin',
    title: 'Localização Privilegiada',
    description: 'Situada no coração de Búzios, a apenas 5 minutos das principais praias e do centro histórico.'
  },
  {
    id: 'comfort',
    icon: 'heroicons:home-modern',
    title: 'Conforto Excepcional',
    description: 'Quartos amplos e bem equipados, com ar-condicionado, TV a cabo e Wi-Fi gratuito em toda a pousada.'
  },
  {
    id: 'breakfast',
    icon: 'heroicons:cake',
    title: 'Café da Manhã Completo',
    description: 'Buffet variado com frutas frescas, pães artesanais, sucos naturais e pratos típicos da região.'
  },
  {
    id: 'service',
    icon: 'heroicons:user-group',
    title: 'Atendimento Personalizado',
    description: 'Equipe dedicada e hospitaleira, sempre pronta para tornar sua estadia inesquecível.'
  },
  {
    id: 'experience',
    icon: 'heroicons:sparkles',
    title: 'Experiência Única',
    description: 'Mais de 15 anos de tradição em hospedagem, oferecendo autenticidade e charme local.'
  },
  {
    id: 'value',
    icon: 'heroicons:currency-dollar',
    title: 'Melhor Custo-Benefício',
    description: 'Qualidade superior com preços justos, garantindo o máximo valor para seu investimento.'
  }
]
</script>

<style scoped>
.why-choose-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #bbdefb 0%, #bbdefb 100%);
  position: relative;
  overflow: hidden;
}

.why-choose-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23e2e8f0" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  opacity: 0.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.why-choose-section__header {
  text-align: center;
  margin-bottom: 4rem;
}

.why-choose-section__subtitle {
  font-size: 1rem;
  color: #1E3A8A;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.why-choose-section__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.why-choose-section__description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.why-choose-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.why-choose-section__card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.why-choose-section__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1E3A8A 0%, #1E3A8A 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.why-choose-section__card:hover::before {
  transform: scaleX(1);
}

.why-choose-section__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.why-choose-section__icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0 4px 12px rgba(229, 90, 43, 0.3);
  color: white !important;
}

.why-choose-section__icon svg {
  width: 28px;
  height: 28px;
  color: white !important;
}

/* Forçar ícones específicos a ficarem brancos */
.why-choose-section__icon :where(.i-heroicons-map-pin) {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__icon :where(.i-heroicons-heart) {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__icon :where(.i-heroicons-shield-check) {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__icon :where(.i-heroicons-star) {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__icon :where(.i-heroicons-users) {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__icon :where(.i-heroicons-gift) {
  color: white !important;
  background-color: white !important;
}

/* Forçar todos os ícones dentro do container a ficarem brancos */
.why-choose-section__icon .iconify {
  color: white !important;
  background-color: white !important;
}

.why-choose-section__content {
  flex: 1;
}

.why-choose-section__card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.why-choose-section__card-description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.why-choose-section__cta {
  text-align: center;
}

.why-choose-section__button {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 90, 43, 0.3);
}

.why-choose-section__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 90, 43, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .why-choose-section {
    padding: 4rem 0;
  }
  
  .why-choose-section__title {
    font-size: 2rem;
  }
  
  .why-choose-section__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .why-choose-section__card {
    padding: 1.5rem;
  }
  
  .why-choose-section__icon {
    width: 50px;
    height: 50px;
  }
  
  .why-choose-section__icon svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .why-choose-section__header {
    margin-bottom: 2.5rem;
  }
  
  .why-choose-section__title {
    font-size: 1.75rem;
  }
  
  .why-choose-section__card {
    padding: 1.25rem;
  }
  
  .why-choose-section__card-title {
    font-size: 1.125rem;
  }
  
  .why-choose-section__card-description {
    font-size: 0.875rem;
  }
}
</style>
