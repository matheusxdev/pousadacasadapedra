<template>
  <section class="featured-section">
    <div class="featured-section__container">
      <div class="featured-section__header">
        <h2 class="featured-section__title">{{ props.title }}</h2>
        <NuxtLink :to="props.to" class="featured-section__cta">
          {{ props.cta }} →
        </NuxtLink>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="featured-section__loading">
        <div class="featured-section__skeleton-grid">
          <div v-for="i in 8" :key="i" class="featured-section__skeleton-card">
            <div class="featured-section__skeleton-image"></div>
            <div class="featured-section__skeleton-content">
              <div class="featured-section__skeleton-title"></div>
              <div class="featured-section__skeleton-subtitle"></div>
              <div class="featured-section__skeleton-price"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="featured-section__error">
        <Icon name="heroicons:exclamation-triangle" />
        <h3>{{ $t('common.error') }}</h3>
        <p>{{ error }}</p>
        <button @click="loadFeatured" class="featured-section__retry">
          {{ $t('common.tryAgain') }}
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!data || data.length === 0" class="featured-section__empty">
        <Icon name="heroicons:inbox" />
        <h3>{{ $t('common.noResults') }}</h3>
        <p>{{ $t('common.noResultsDescription') }}</p>
      </div>
      
      <!-- Content -->
      <div v-else class="featured-section__grid">
        <FeaturedCard 
          v-for="item in displayItems" 
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FeaturedItem } from '@/composables/useFeatured'

interface Props {
  items?: FeaturedItem[]
  limit?: number
  showMixed?: boolean
  title?: string
  cta?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  limit: 8,
  showMixed: true,
  title: 'Destaques',
  cta: 'Ver todos os passeios',
  to: '/tours'
})

const { getFeaturedMixed, getFeaturedTours } = useFeatured()

const data = ref<FeaturedItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const displayItems = computed(() => {
  return props.items && props.items.length > 0 ? props.items : data.value
})

const loadFeatured = async () => {
  try {
    loading.value = true
    error.value = null
    
    let result
    if (props.showMixed) {
      result = await getFeaturedMixed({ limit: props.limit })
    } else {
      result = await getFeaturedTours({ limit: props.limit })
    }
    
    data.value = result.data.value || []
    error.value = result.error.value
    
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar destaques'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!props.items || props.items.length === 0) {
    loadFeatured()
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.featured-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.featured-section__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.featured-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.featured-section__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.featured-section__cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--brand);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--brand);
  border-radius: 8px;
  background: transparent;
}

.featured-section__cta:hover {
  background: var(--brand);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 103, 0, 0.3);
}

.featured-section__cta svg {
  width: 20px;
  height: 20px;
}

.featured-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.featured-section__loading {
  min-height: 400px;
}

.featured-section__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.featured-section__skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.featured-section__skeleton-image {
  aspect-ratio: 16/9;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.featured-section__skeleton-content {
  padding: 1.5rem;
}

.featured-section__skeleton-title {
  height: 1.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.featured-section__skeleton-subtitle {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  width: 80%;
}

.featured-section__skeleton-price {
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

.featured-section__error,
.featured-section__empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.featured-section__error svg,
.featured-section__empty svg {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 1rem;
}

.featured-section__error h3,
.featured-section__empty h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.featured-section__error p,
.featured-section__empty p {
  margin-bottom: 2rem;
}

.featured-section__retry {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.featured-section__retry:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .featured-section {
    padding: 2rem 0;
  }
  
  .featured-section__container {
    padding: 0 1rem;
  }
  
  .featured-section__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .featured-section__title {
    font-size: 2rem;
  }
  
  .featured-section__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .featured-section__skeleton-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .featured-section__grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 1rem;
  }
  
  .featured-section__grid > * {
    flex: 0 0 85vw;
    scroll-snap-align: start;
  }
}
</style>
