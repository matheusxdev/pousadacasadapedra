<template>
  <div class="about-page">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <NuxtLink to="/">{{ $t('breadcrumbs.home') }}</NuxtLink>
        <Icon name="heroicons:chevron-right" />
        <span>{{ $t('nav.about') }}</span>
      </div>
      
      <!-- Hero Section -->
      <div class="about-page__hero">
        <h1>{{ $t('about.title') }}</h1>
        <p>{{ $t('about.subtitle') }}</p>
      </div>
      
      <!-- Content -->
      <div class="about-page__content">
        <div class="about-page__story">
          <h2>{{ $t('about.story.title') }}</h2>
          <p>{{ $t('about.story.description') }}</p>
        </div>
        
        <div class="about-page__values">
          <h2>{{ $t('about.values.title') }}</h2>
          <div class="about-page__values-grid">
            <div class="about-page__value">
              <Icon name="heroicons:heart" />
              <h3>{{ $t('about.values.passion.title') }}</h3>
              <p>{{ $t('about.values.passion.description') }}</p>
            </div>
            <div class="about-page__value">
              <Icon name="heroicons:shield-check" />
              <h3>{{ $t('about.values.quality.title') }}</h3>
              <p>{{ $t('about.values.quality.description') }}</p>
            </div>
            <div class="about-page__value">
              <Icon name="heroicons:users" />
              <h3>{{ $t('about.values.service.title') }}</h3>
              <p>{{ $t('about.values.service.description') }}</p>
            </div>
          </div>
        </div>
        
        <div class="about-page__mission">
          <h2>{{ $t('about.mission.title') }}</h2>
          <p>{{ $t('about.mission.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Sobre Nós - Grupo Caminué',
  meta: [
    { name: 'description', content: 'Conheça a Grupo Caminué e nossa paixão por proporcionar experiências únicas em Búzios' }
  ]
})
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #6b7280;
}

.breadcrumb a {
  color: #6b7280;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #ff6b35;
}

.about-page__hero {
  text-align: center;
  margin-bottom: 4rem;
}

.about-page__hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.about-page__hero p {
  font-size: 1.25rem;
  color: #6b7280;
}

.about-page__content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.about-page__story,
.about-page__mission {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.about-page__story h2,
.about-page__mission h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.about-page__story p,
.about-page__mission p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
}

.about-page__values {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.about-page__values h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
}

.about-page__values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.about-page__value {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.about-page__value svg {
  width: 48px;
  height: 48px;
  color: #ff6b35;
  margin-bottom: 1rem;
}

.about-page__value h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.about-page__value p {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .about-page__hero h1 {
    font-size: 2rem;
  }
  
  .about-page__hero p {
    font-size: 1rem;
  }
  
  .about-page__story,
  .about-page__mission,
  .about-page__values {
    padding: 2rem;
  }
  
  .about-page__values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
