<template>
  <NuxtLink :to="to" class="transfer-card">
    <div class="transfer-card__image">
      <img :src="img" :alt="title" class="transfer-card__img" loading="lazy" />
    </div>
    <div class="transfer-card__content">
      <h3 class="transfer-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="transfer-card__subtitle">{{ subtitle }}</p>
      <div class="transfer-card__button">
        <span class="transfer-card__button-text">{{ $t('common.viewDetails') }}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" class="transfer-card__button-icon">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  img: string
  to: string
}>()
</script>

<style scoped>
.transfer-card {
  display: block;
  border-radius: 1rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  text-decoration: none;
}

.transfer-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.transfer-card__image {
  aspect-ratio: 16/11;
  width: 100%;
  overflow: hidden;
  background: #f1f5f9;
}

.transfer-card__img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.transfer-card:hover .transfer-card__img {
  transform: scale(1.03);
}

.transfer-card__content {
  padding: 1rem;
}

.transfer-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.transfer-card__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.transfer-card__button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 9999px;
  background: #FF6700;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s ease;
}

.transfer-card__button:hover {
  background: #E55A00;
}

.transfer-card__button-text {
  margin: 0;
}

.transfer-card__button-icon {
  height: 1rem;
  width: 1rem;
}
</style>