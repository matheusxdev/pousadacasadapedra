<template>
  <div class="home-page">
    <!-- Rate Limit Notification -->
    <RateLimitNotification
      :show="showRateLimitNotification"
      :retry-after="rateLimitInfo?.retryAfter"
      :is-retrying="isRetrying"
      @retry="handleRetry"
      @dismiss="handleDismissNotification"
    />

    <!-- Hero Section -->
    <HeroSection />

    <!-- Services Section -->
    <ServicesSection />

    <!-- Rate Limit Status (Debug) -->
    <div v-if="isClient && rateLimitInfo" class="rate-limit-debug">
      <div class="container">
        <RateLimitStatus
          :rate-limit-info="rateLimitInfo"
          :is-rate-limited="isRateLimited"
          :is-retrying="isRetrying"
          @retry="handleRetry"
        />
      </div>
    </div>

    <!-- Recommended Accommodations Section -->
    <RecommendedAccommodations />

    <!-- Facilities Section -->
    <FacilitiesSection />
    
    <!-- Dynamic Products Section -->
    <DynamicProductsSection />
    
    <!-- Why Choose Section -->
    <WhyChooseSection />

    <!-- TOURS SECTION DESATIVADO TEMPORARIAMENTE - FOCANDO APENAS EM POUSADAS -->
    <!-- 
    <ToursSection :items="tours" :cta="$t('home.sections.seeAllTours')" to="/tours" />
    -->

    <!-- Stays Section - PRINCIPAL FOCO -->
    <StaysSection :items="stays" :cta="$t('home.sections.seeAllAccommodations')" to="/accommodations" />

    <!-- App Download Section -->
    <AppDownloadSection />

    <!-- Analytics Optimizer (Development Only) -->
    <AnalyticsOptimizer
      v-if="isClient"
      :enable-debug-mode="false"
      :show-status="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { FeaturedItem } from '@/composables/useFeatured'
import { useRateLimit } from '@/composables/useRateLimit'
import AnalyticsOptimizer from '@/components/AnalyticsOptimizer.vue'

const siteUrl = useRuntimeConfig().public.siteUrl

useHead({
  title: 'Grupo Caminué — Pousadas e Hospedagem em Búzios',
  meta: [
    { name: 'description', content: 'Encontre a pousada perfeita em Búzios com a Grupo Caminué. Hospedagem de qualidade, conforto e atendimento excepcional.' },
    { property: 'og:title', content: 'Grupo Caminué — Pousadas e Hospedagem em Búzios' },
    { property: 'og:description', content: 'Pousadas e hospedagem em Búzios. Conforto, qualidade e atendimento excepcional.' },
    { property: 'og:image', content: `${siteUrl}/og/home.jpg` },
    { property: 'og:url', content: siteUrl },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [{ rel: 'canonical', href: siteUrl }]
})

const featured = ref<FeaturedItem[]>([])
// const tours = ref<FeaturedItem[]>([]) // DESATIVADO TEMPORARIAMENTE
const stays = ref<FeaturedItem[]>([])

// Client-side check for hydration safety
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

const { getFeaturedStays, getMixedFeatured } = useFeatured()
// const { getFeaturedTours } = useFeatured() // DESATIVADO TEMPORARIAMENTE

// Rate Limit Management
const { 
  rateLimitInfo, 
  isRateLimited, 
  isRetrying, 
  addToRetryQueue,
  clearRateLimitInfo 
} = useRateLimit()

const showRateLimitNotification = ref(false)

// Watch for rate limit changes
watch(isRateLimited, (newValue) => {
  if (newValue) {
    showRateLimitNotification.value = true
  }
})

// Watch for rate limit info changes
watch(rateLimitInfo, (newInfo) => {
  if (newInfo && newInfo.isRateLimited) {
    showRateLimitNotification.value = true
  }
})

// Usar $t diretamente no template em vez de useI18n no script - FOCANDO EM POUSADAS
// Hero slides removidos - usando HeroSection component

const handleSearch = (searchData: any) => {
  // Handle search data if needed
  // console.log('Search data:', searchData)
}

// Rate Limit Handlers
const handleRetry = async () => {
  try {
    // Recarregar dados
    await loadHomeData()
    showRateLimitNotification.value = false
  } catch (error) {
    console.error('Retry failed:', error)
  }
}

const handleDismissNotification = () => {
  showRateLimitNotification.value = false
}

// Função para carregar dados da home - FOCANDO APENAS EM POUSADAS
const loadHomeData = async () => {
  try {
    // Load mixed featured items (apenas pousadas)
    const { data: featuredData } = await getMixedFeatured({ limit: 8, type: 'accommodation' })
    featured.value = featuredData.value || []

    // TOURS DESATIVADO TEMPORARIAMENTE - FOCANDO APENAS EM POUSADAS
    // const { data: toursData } = await getFeaturedTours({ limit: 6 })
    // tours.value = toursData.value || []

    // Load stays - PRINCIPAL FOCO
    const { data: staysData } = await getFeaturedStays({ limit: 12 })
    stays.value = staysData.value || []
  } catch (error) {
    console.error('Error loading home data:', error)
  }
}

onMounted(async () => {
  await loadHomeData()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Rate Limit Debug Section */
.rate-limit-debug {
  padding: 1rem 0;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .rate-limit-debug {
    padding: 0.5rem 0;
  }
}
</style>