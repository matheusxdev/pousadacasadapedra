<template>
  <div class="tours-page">
    <div class="tours-page__header">
      <div class="container">
        <h1>{{ t('nav.tours') }}</h1>
        <p>{{ t('tours.subtitle') }}</p>
      </div>
    </div>
    
    <div class="tours-page__filters">
      <div class="container">
        <div class="filters">
          <div class="filters__group">
            <Icon name="heroicons:magnifying-glass" />
            <input 
              type="text" 
              :placeholder="t('common.search')"
              v-model="filters.search"
              @input="debouncedSearch"
            />
          </div>
          
          <div class="filters__group">
            <Icon name="heroicons:map-pin" />
            <select v-model="filters.location">
              <option value="">{{ t('common.allLocations') }}</option>
              <option v-for="location in locations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>
          
          <div class="filters__group">
            <Icon name="heroicons:tag" />
            <select v-model="filters.category">
              <option value="">{{ t('common.allCategories') }}</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filters__group">
            <Icon name="heroicons:currency-dollar" />
            <select v-model="filters.priceRange">
              <option value="">{{ t('common.allPrices') }}</option>
              <option value="0-100">{{ t('common.under100') }}</option>
              <option value="100-300">{{ t('common.100to300') }}</option>
              <option value="300-500">{{ t('common.300to500') }}</option>
              <option value="500+">{{ t('common.over500') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tours-page__content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="tours-page__loading">
          <div class="tours-page__skeleton-grid">
            <div v-for="i in 8" :key="i" class="tours-page__skeleton-card">
              <div class="tours-page__skeleton-image"></div>
              <div class="tours-page__skeleton-content">
                <div class="tours-page__skeleton-title"></div>
                <div class="tours-page__skeleton-subtitle"></div>
                <div class="tours-page__skeleton-price"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="tours-page__error">
          <Icon name="heroicons:exclamation-triangle" />
          <h3>{{ t('common.error') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadTours" class="tours-page__retry">
            {{ t('common.tryAgain') }}
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="tours.length === 0" class="tours-page__empty">
          <Icon name="heroicons:magnifying-glass" />
          <h3>{{ t('common.noResults') }}</h3>
          <p>{{ t('tours.noResultsDescription') }}</p>
          <button @click="clearFilters" class="tours-page__clear-filters">
            {{ t('common.clearFilters') }}
          </button>
        </div>
        
        <!-- Tours Grid -->
        <div v-else class="tours-page__grid">
          <FeaturedCard 
            v-for="tour in tours" 
            :key="tour.id"
            :item="tour"
          />
        </div>
        
        <!-- Pagination -->
        <div v-if="tours.length > 0 && totalPages > 1" class="tours-page__pagination">
          <button 
            class="pagination__button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="heroicons:chevron-left" />
            {{ t('common.previous') }}
          </button>
          
          <div class="pagination__pages">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination__page"
              :class="{ 'pagination__page--active': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination__button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            {{ t('common.next') }}
            <Icon name="heroicons:chevron-right" />
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Optimizer (Development Only) -->
    <AnalyticsOptimizer
      v-if="isClient"
      :enable-debug-mode="false"
      :show-status="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FeaturedItem } from '@/composables/useFeatured'
import AnalyticsOptimizer from '@/components/AnalyticsOptimizer.vue'

const { t } = useI18n()
const { getFeaturedTours } = useFeatured()

// Client-side check for hydration safety
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

useHead({
  title: 'Passeios em Búzios — Casa da Pedra',
  meta: [
    { name: 'description', content: 'Veja os passeios mais populares em Búzios: barcos, city tours e experiências exclusivas.' },
    { property: 'og:title', content: 'Passeios em Búzios — Casa da Pedra' },
    { property: 'og:description', content: 'Veja os passeios mais populares em Búzios: barcos, city tours e experiências exclusivas.' },
    { property: 'og:image', content: '/og/tours.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})

// Estado reativo
const tours = ref<FeaturedItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)

// Filtros
const filters = ref({
  search: '',
  location: '',
  category: '',
  priceRange: ''
})

// Opções de filtro (seriam carregadas da API)
const locations = ref(['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'])
const categories = ref(['Passeio', 'Aventura', 'Cultural', 'Natureza'])

// Debounce para busca
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadTours()
  }, 500)
}

// Carregar tours
const loadTours = async () => {
  try {
    loading.value = true
    error.value = null
    
    const searchParams: Record<string, any> = {
      page: currentPage.value,
      limit: 12
    }
    
    // Aplicar filtros
    if (filters.value.search) {
      searchParams.search = filters.value.search
    }
    
    if (filters.value.location) {
      searchParams.location = filters.value.location
    }
    
    if (filters.value.category) {
      searchParams.category = filters.value.category
    }
    
    if (filters.value.priceRange) {
      const [min, max] = filters.value.priceRange.split('-')
      if (min) searchParams.min_price = parseInt(min)
      if (max && max !== '+') searchParams.max_price = parseInt(max)
    }
    
    const result = await getFeaturedTours(searchParams)
    tours.value = result.data.value
    error.value = result.error.value
    
    // Simular paginação (a API real retornaria esses dados)
    totalItems.value = tours.value.length * 3 // Simular total
    totalPages.value = Math.ceil(totalItems.value / 12)
    
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar tours'
    console.error('Error loading tours:', err)
  } finally {
    loading.value = false
  }
}

// Limpar filtros
const clearFilters = () => {
  filters.value = {
    search: '',
    location: '',
    category: '',
    priceRange: ''
  }
  currentPage.value = 1
  loadTours()
}

// Navegação de páginas
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadTours()
  }
}

// Páginas visíveis na paginação
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watchers para filtros
watch(() => filters.value.location, () => {
  currentPage.value = 1
  loadTours()
})

watch(() => filters.value.category, () => {
  currentPage.value = 1
  loadTours()
})

watch(() => filters.value.priceRange, () => {
  currentPage.value = 1
  loadTours()
})

// Carregar dados iniciais
onMounted(() => {
  loadTours()
})

// Meta tags
useHead({
  title: 'Tours e Passeios - Casa da Pedra',
  meta: [
    { name: 'description', content: 'Descubra nossos passeios incríveis e experiências únicas' }
  ]
})
</script>

<style scoped>
.tours-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.tours-page__header {
  background: white;
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.tours-page__header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.tours-page__header p {
  font-size: 1.125rem;
  color: #666;
}

.tours-page__filters {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
}

.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
}

.filters__group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.filters__group:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.filters__group svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.filters__group input,
.filters__group select {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  flex: 1;
}

.filters__group input::placeholder {
  color: #999;
}

.tours-page__content {
  padding: 2rem 0;
}

.tours-page__loading {
  min-height: 400px;
}

.tours-page__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.tours-page__skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tours-page__skeleton-image {
  aspect-ratio: 16/9;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.tours-page__skeleton-content {
  padding: 1.5rem;
}

.tours-page__skeleton-title {
  height: 1.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.tours-page__skeleton-subtitle {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  width: 80%;
}

.tours-page__skeleton-price {
  height: 1.25rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.tours-page__error,
.tours-page__empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.tours-page__error svg,
.tours-page__empty svg {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 1rem;
}

.tours-page__error h3,
.tours-page__empty h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.tours-page__error p,
.tours-page__empty p {
  margin-bottom: 2rem;
}

.tours-page__retry,
.tours-page__clear-filters {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tours-page__retry:hover,
.tours-page__clear-filters:hover {
  background: #0056b3;
}

.tours-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.tours-page__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.pagination__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.pagination__button:hover:not(:disabled) {
  border-color: #007bff;
  color: #007bff;
}

.pagination__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__pages {
  display: flex;
  gap: 0.5rem;
}

.pagination__page {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.pagination__page:hover {
  border-color: #007bff;
  color: #007bff;
}

.pagination__page--active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .tours-page__header {
    padding: 2rem 0;
  }
  
  .tours-page__header h1 {
    font-size: 2rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .tours-page__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tours-page__skeleton-grid {
    grid-template-columns: 1fr;
  }
  
  .tours-page__pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination__pages {
    order: -1;
  }
}
</style>