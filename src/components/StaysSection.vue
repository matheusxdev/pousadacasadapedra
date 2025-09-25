<template>
  <section class="stays-section">
    <div class="container">
      <div class="stays-section__header">
        <h2 class="stays-section__title">{{ $t('home.sections.accommodations') }}</h2>
        <NuxtLink to="/accommodations" class="stays-section__cta">
          {{ cta || $t('home.sections.seeAllAccommodations') }} →
        </NuxtLink>
      </div>
      
      <div class="stays-section__content">
        <div class="stays-section__grid">
          <FeaturedCard 
            v-for="stay in stays" 
            :key="stay.id"
            :item="stay"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FeaturedItem } from '@/composables/useFeatured'

interface Props {
  items?: FeaturedItem[]
  cta?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  cta: 'Ver todas as pousadas',
  to: '/accommodations'
})

const { getFeaturedStays } = useFeatured()

const stays = ref<FeaturedItem[]>([])

onMounted(async () => {
  try {
    const { data } = await getFeaturedStays({ limit: 6 })
    stays.value = data.value || []
  } catch (error) {
    console.error('Error loading stays:', error)
  }
})
</script>

<style scoped>
.stays-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #bbdefb 0%, #bbdefb 100%);
}

.stays-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.stays-section__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--ink);
  margin: 0;
}

.stays-section__cta {
  color: #1E3A8A;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  border: 2px solid #1E3A8A;
  border-radius: 8px;
  background: transparent;
}

.stays-section__cta:hover {
  background: #1E3A8A;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
}

.stays-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .stays-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile: Melhorar layout do header */
@media (max-width: 767px) {
  .stays-section__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stays-section__title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .stays-section__cta {
    align-self: flex-start;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

@media (min-width: 1024px) {
  .stays-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
