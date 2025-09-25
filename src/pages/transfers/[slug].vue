<template>
  <div class="transfer-detail">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <NuxtLink to="/transfers">Transfers</NuxtLink>
        <Icon name="heroicons:chevron-right" />
        <span>{{ transfer?.title || 'Carregando...' }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="transfer-detail__loading">
        <div class="transfer-detail__skeleton">
          <div class="transfer-detail__skeleton-hero"></div>
          <div class="transfer-detail__skeleton-content">
            <div class="transfer-detail__skeleton-title"></div>
            <div class="transfer-detail__skeleton-desc"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="transfer-detail__error">
        <div class="transfer-detail__error-content">
          <Icon name="heroicons:exclamation-triangle" class="transfer-detail__error-icon" />
          <h2>{{ error }}</h2>
          <p>O transfer que você está procurando não foi encontrado.</p>
          <NuxtLink to="/transfers" class="transfer-detail__error-btn">
            <Icon name="heroicons:arrow-left" />
            Voltar aos Transfers
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="transfer" class="transfer-detail__content">
        <!-- Hero Section -->
        <div class="transfer-detail__hero">
          <img 
            :src="transfer.image" 
            :alt="transfer.title"
            class="transfer-detail__hero-image"
          />
          <div class="transfer-detail__hero-content">
            <h1 class="transfer-detail__title">{{ transfer.title }}</h1>
            <p class="transfer-detail__description">{{ transfer.description }}</p>
          </div>
        </div>

        <!-- Body Content -->
        <div class="transfer-detail__body">
          <div class="transfer-detail__placeholder">
            <h2>Informações Detalhadas</h2>
            <p>Conteúdo detalhado sobre este serviço de transfer será adicionado em breve.</p>
            <p>Aqui você encontrará informações sobre:</p>
            <ul>
              <li>Horários de funcionamento</li>
              <li>Pontos de embarque e desembarque</li>
              <li>Preços e formas de pagamento</li>
              <li>Políticas de cancelamento</li>
              <li>Contato para reservas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { transfers, type Transfer } from '@/data/transfers'

const route = useRoute()
const slug = route.params.slug as string

// Estado reativo
const transfer = ref<Transfer | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Carregar transfer
const loadTransfer = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Buscar transfer por slug
    const foundTransfer = transfers.find(t => t.slug === slug)
    
    if (!foundTransfer) {
      error.value = 'Transfer não encontrado'
      return
    }
    
    transfer.value = foundTransfer
    
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar transfer'
    console.error('Error loading transfer:', err)
  } finally {
    loading.value = false
  }
}

// Carregar dados
onMounted(() => {
  loadTransfer()
})

// SEO
useHead({
  title: computed(() => transfer.value ? `${transfer.value.title} - Casa da Pedra` : 'Transfer - Casa da Pedra'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => transfer.value?.description || 'Serviços de transfer da Casa da Pedra')
    },
    { 
      property: 'og:title', 
      content: computed(() => transfer.value ? `${transfer.value.title} - Casa da Pedra` : 'Transfer - Casa da Pedra')
    },
    { 
      property: 'og:description', 
      content: computed(() => transfer.value?.description || 'Serviços de transfer da Casa da Pedra')
    },
    { 
      property: 'og:image', 
      content: computed(() => transfer.value?.image || '')
    },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.transfer-detail {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: #666;
}

.breadcrumb a {
  color: var(--brand, #FF6700);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: var(--brand-600, #E55A00);
}

.breadcrumb svg {
  width: 16px;
  height: 16px;
}

/* Loading State */
.transfer-detail__loading {
  padding: 2rem 0;
}

.transfer-detail__skeleton {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.transfer-detail__skeleton-hero {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

.transfer-detail__skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transfer-detail__skeleton-title {
  height: 2rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 60%;
}

.transfer-detail__skeleton-desc {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 80%;
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
.transfer-detail__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.transfer-detail__error-content {
  text-align: center;
  max-width: 500px;
}

.transfer-detail__error-icon {
  width: 64px;
  height: 64px;
  color: var(--brand, #FF6700);
  margin-bottom: 1rem;
}

.transfer-detail__error-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.transfer-detail__error-content p {
  color: #666;
  margin-bottom: 2rem;
}

.transfer-detail__error-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--brand, #FF6700);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.transfer-detail__error-btn:hover {
  background: var(--brand-600, #E55A00);
  transform: translateY(-1px);
}

.transfer-detail__error-btn:focus-visible {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
}

/* Hero Section */
.transfer-detail__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3rem;
}

.transfer-detail__hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.transfer-detail__hero-content {
  padding-left: 2rem;
}

.transfer-detail__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.transfer-detail__description {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Body Content */
.transfer-detail__body {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.transfer-detail__placeholder h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.transfer-detail__placeholder p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.transfer-detail__placeholder ul {
  color: #666;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.transfer-detail__placeholder li {
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 767px) {
  .transfer-detail__hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .transfer-detail__hero-content {
    padding-left: 0;
  }
  
  .transfer-detail__title {
    font-size: 2rem;
  }
  
  .transfer-detail__hero-image {
    height: 300px;
  }
  
  .transfer-detail__body {
    padding: 1.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .transfer-detail__title {
    font-size: 1.75rem;
  }
  
  .transfer-detail__description {
    font-size: 1rem;
  }
}
</style>
