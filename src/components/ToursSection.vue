<template>
  <section class="tours-section">
    <div class="container">
      <div class="tours-section__header">
        <h2 class="tours-section__title">{{ $t('home.sections.tours') }}</h2>
        <NuxtLink to="/tours" class="tours-section__cta">
          {{ cta || $t('home.sections.seeAllTours') }} →
        </NuxtLink>
      </div>
      
      <div class="tours-section__content">
        <div class="tours-section__grid">
          <FeaturedCard 
            v-for="tour in tours" 
            :key="tour.id"
            :item="tour"
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
  cta: 'Ver todos os passeios',
  to: '/tours'
})

const { getFeaturedTours } = useFeatured()

const tours = ref<FeaturedItem[]>([])

onMounted(async () => {
  try {
    const { data } = await getFeaturedTours({ limit: 6 })
    tours.value = data.value || []
  } catch (error) {
    console.error('Error loading tours:', error)
  }
})
</script>

<style scoped>
.tours-section {
  padding: 4rem 0;
  background: var(--surface);
}

.tours-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.tours-section__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--ink);
  margin: 0;
}

.tours-section__cta {
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

.tours-section__cta:hover {
  background: var(--brand);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 103, 0, 0.3);
}

.tours-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .tours-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile: Melhorar layout do header */
@media (max-width: 767px) {
  .tours-section__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .tours-section__title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .tours-section__cta {
    align-self: flex-start;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

@media (min-width: 1024px) {
  .tours-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
