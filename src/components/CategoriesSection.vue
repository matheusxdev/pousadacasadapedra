<template>
  <section class="categories-section">
    <div class="container">
      <div class="categories-section__content">
        <div class="categories-section__grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
          >
        <div class="category-card__icon">
          <ClientOnly>
            <Icon :name="category.icon" />
            <template #fallback>
              <div class="category-card__icon-fallback">
                {{ category.title.charAt(0) }}
              </div>
            </template>
          </ClientOnly>
        </div>
            <div class="category-card__content">
              <h3 class="category-card__title">{{ $t(`home.categories.${category.id}.title`) }}</h3>
              <p class="category-card__description">{{ $t(`home.categories.${category.id}.description`) }}</p>
              <NuxtLink 
                :to="category.link" 
                class="category-card__link"
              >
                {{ $t('common.explore') }} →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Category {
  id: string
  title: string
  description: string
  icon: string
  link: string
}

const categories: Category[] = [
  {
    id: 'adventure',
    title: 'Aventura',
    description: 'Trekking, escalada, rafting e muito mais',
    icon: 'heroicons:map-pin',
    link: '/tours?category=adventure'
  },
  {
    id: 'culture',
    title: 'Cultura',
    description: 'Museus, monumentos e história local',
    icon: 'heroicons:building-office-2',
    link: '/tours?category=culture'
  },
  {
    id: 'nature',
    title: 'Natureza',
    description: 'Parques, trilhas e vida selvagem',
    icon: 'heroicons:photo',
    link: '/tours?category=nature'
  },
  {
    id: 'experiences',
    title: 'Experiências',
    description: 'Atividades especiais e exclusivas',
    icon: 'heroicons:sparkles',
    link: '/tours'
  }
]
</script>

<style scoped>
.categories-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--bg) 0%, #e2e8f0 100%);
}

.categories-section__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.categories-section__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 250ms ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.category-card__icon {
  background: linear-gradient(135deg, #FF6700 0%, #ff862f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  position: relative;
  transition: transform 250ms ease;
  box-shadow: 
    0 4px 16px rgba(255, 103, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.category-card__icon::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.category-card:hover .category-card__icon {
  transform: scale(1.04);
}

/* Categories – icon sizing & color */
.categories-section .category-card__icon {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  border-radius: 9999px;
}

/* Iconify/UnoCSS icons render at 1em by default; grow via font-size and make white */
.categories-section .category-card__icon .iconify,
.categories-section .category-card__icon [class^="i-"],
.categories-section .category-card__icon [class*=" i-"] {
  font-size: 38px;           /* desktop size */
  width: 1em;
  height: 1em;
  line-height: 1;
  color: #fff;               /* force white via currentColor */
}

/* Fallback for inline SVG (if any is used later) */
.categories-section .category-card__icon svg {
  width: 38px;
  height: 38px;
  fill: #fff;
}

.category-card__icon-fallback {
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.category-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 0.75rem;
}

.category-card__description {
  color: var(--muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
}

.category-card__link {
  color: #FF6700;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 250ms ease;
  align-self: center;
  position: relative;
}

.category-card__link:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 1024px) {
  .categories-section__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .categories-section__grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .category-card {
    padding: 1.5rem;
  }
  
  /* Mobile sizes */
  .categories-section .category-card__icon { width: 72px; height: 72px; }
  .categories-section .category-card__icon .iconify,
  .categories-section .category-card__icon [class^="i-"],
  .categories-section .category-card__icon [class*=" i-"] {
    font-size: 30px;
  }
  .categories-section .category-card__icon svg { width: 30px; height: 30px; }
  
  .category-card__icon-fallback {
    font-size: 28px;
  }
}
</style>
