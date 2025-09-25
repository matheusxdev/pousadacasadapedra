<template>
  <div :class="skeletonClasses" :style="skeletonStyle">
    <!-- Skeleton para card de produto -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-card__image"></div>
      <div class="skeleton-card__content">
        <div class="skeleton-card__title"></div>
        <div class="skeleton-card__subtitle"></div>
        <div class="skeleton-card__price"></div>
        <div class="skeleton-card__badge"></div>
      </div>
    </div>

    <!-- Skeleton para galeria de imagens -->
    <div v-else-if="type === 'gallery'" class="skeleton-gallery">
      <div class="skeleton-gallery__main"></div>
      <div class="skeleton-gallery__thumbnails">
        <div v-for="i in thumbnailCount" :key="i" class="skeleton-gallery__thumb"></div>
      </div>
    </div>

    <!-- Skeleton para calendário -->
    <div v-else-if="type === 'calendar'" class="skeleton-calendar">
      <div class="skeleton-calendar__header">
        <div class="skeleton-calendar__nav"></div>
        <div class="skeleton-calendar__title"></div>
        <div class="skeleton-calendar__nav"></div>
      </div>
      <div class="skeleton-calendar__grid">
        <div v-for="i in 35" :key="i" class="skeleton-calendar__day"></div>
      </div>
    </div>

    <!-- Skeleton para lista de participantes -->
    <div v-else-if="type === 'participants'" class="skeleton-participants">
      <div class="skeleton-participants__header"></div>
      <div class="skeleton-participants__controls">
        <div class="skeleton-participants__counter"></div>
        <div class="skeleton-participants__counter"></div>
      </div>
      <div class="skeleton-participants__progress"></div>
    </div>

    <!-- Skeleton para resumo de preços -->
    <div v-else-if="type === 'pricing'" class="skeleton-pricing">
      <div class="skeleton-pricing__header"></div>
      <div class="skeleton-pricing__items">
        <div v-for="i in 4" :key="i" class="skeleton-pricing__item">
          <div class="skeleton-pricing__label"></div>
          <div class="skeleton-pricing__value"></div>
        </div>
      </div>
      <div class="skeleton-pricing__total"></div>
      <div class="skeleton-pricing__button"></div>
    </div>

    <!-- Skeleton para texto -->
    <div v-else-if="type === 'text'" class="skeleton-text">
      <div v-for="i in lines" :key="i" class="skeleton-text__line" :style="{ width: getLineWidth(i) }"></div>
    </div>

    <!-- Skeleton genérico -->
    <div v-else class="skeleton-generic" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'card' | 'gallery' | 'calendar' | 'participants' | 'pricing' | 'text' | 'generic'
  width?: string
  height?: string
  lines?: number
  thumbnailCount?: number
  animated?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'generic',
  width: '100%',
  height: '1rem',
  lines: 3,
  thumbnailCount: 4,
  animated: true,
  rounded: true
})

// Classes do skeleton
const skeletonClasses = computed(() => [
  'skeleton-loader',
  `skeleton-loader--${props.type}`,
  {
    'skeleton-loader--animated': props.animated,
    'skeleton-loader--rounded': props.rounded
  }
])

// Estilo do skeleton
const skeletonStyle = computed(() => ({
  width: props.type === 'generic' ? props.width : undefined,
  height: props.type === 'generic' ? props.height : undefined
}))

// Largura das linhas de texto (varia para parecer mais natural)
const getLineWidth = (index: number): string => {
  const widths = ['100%', '85%', '95%', '90%', '80%']
  return widths[index % widths.length]
}
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  overflow: hidden;
}

.skeleton-loader--animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
  z-index: 1;
}

.skeleton-loader--rounded > * {
  border-radius: 0.5rem;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Card skeleton */
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
}

.skeleton-card__image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.75rem;
}

.skeleton-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card__title {
  height: 1.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 80%;
}

.skeleton-card__subtitle {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 60%;
}

.skeleton-card__price {
  height: 1.25rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 40%;
}

.skeleton-card__badge {
  height: 1.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 9999px;
  width: 4rem;
}

/* Gallery skeleton */
.skeleton-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-gallery__main {
  width: 100%;
  height: 300px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 1rem;
}

.skeleton-gallery__thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.skeleton-gallery__thumb {
  width: 80px;
  height: 60px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

/* Calendar skeleton */
.skeleton-calendar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
}

.skeleton-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.skeleton-calendar__nav {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
}

.skeleton-calendar__title {
  height: 1.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  flex: 1;
  max-width: 8rem;
}

.skeleton-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.skeleton-calendar__day {
  width: 100%;
  height: 2.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
}

/* Participants skeleton */
.skeleton-participants {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
}

.skeleton-participants__header {
  height: 1.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 60%;
}

.skeleton-participants__controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.skeleton-participants__counter {
  width: 6rem;
  height: 3rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.75rem;
}

.skeleton-participants__progress {
  height: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 9999px;
  width: 100%;
}

/* Pricing skeleton */
.skeleton-pricing {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
}

.skeleton-pricing__header {
  height: 1.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 40%;
}

.skeleton-pricing__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-pricing__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.skeleton-pricing__label {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  flex: 1;
}

.skeleton-pricing__value {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
  width: 4rem;
}

.skeleton-pricing__total {
  height: 2rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
  width: 60%;
}

.skeleton-pricing__button {
  height: 3rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.75rem;
  width: 100%;
}

/* Text skeleton */
.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-text__line {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
}

/* Generic skeleton */
.skeleton-generic {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.25rem;
}

/* Tema escuro */
@media (prefers-color-scheme: dark) {
  .skeleton-card,
  .skeleton-calendar,
  .skeleton-participants,
  .skeleton-pricing {
    background: #1e293b;
  }
  
  .skeleton-card__image,
  .skeleton-gallery__main,
  .skeleton-gallery__thumb,
  .skeleton-calendar__nav,
  .skeleton-calendar__title,
  .skeleton-calendar__day,
  .skeleton-participants__header,
  .skeleton-participants__counter,
  .skeleton-participants__progress,
  .skeleton-pricing__header,
  .skeleton-pricing__label,
  .skeleton-pricing__value,
  .skeleton-pricing__total,
  .skeleton-pricing__button,
  .skeleton-text__line,
  .skeleton-generic {
    background: linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%);
    background-size: 200% 100%;
  }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .skeleton-loader--animated::before {
    animation: none;
  }
}
</style>
