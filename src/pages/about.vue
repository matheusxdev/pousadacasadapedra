<template>
  <div class="about-page">
    <!-- Hero Section com vídeo/imagem de fundo -->
    <section class="about-hero">
      <div class="about-hero__background">
        <!-- Placeholder para vídeo/imagem de fundo -->
        <div class="about-hero__media">
          <img 
            :src="heroImage" 
            alt="Grupo Caminué em Búzios"
            class="about-hero__image"
          >
        </div>
        <div class="about-hero__overlay"></div>
      </div>
      
      <div class="container">
        <div class="about-hero__content">
          <div class="about-hero__text">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
              <NuxtLink to="/">{{ $t('breadcrumbs.home') }}</NuxtLink>
              <Icon name="heroicons:chevron-right" />
              <span>{{ $t('nav.about') }}</span>
            </div>
            
            <h1>{{ $t('about.title') }}</h1>
            <p>{{ $t('about.subtitle') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nossa História com imagem -->
    <section class="about-story">
      <div class="container">
        <div class="about-story__content">
          <div class="about-story__text">
            <div class="about-story__badge">Nossa História</div>
            <h2>{{ $t('about.story.title') }}</h2>
            <p>{{ $t('about.story.description') }}</p>
            
            <!-- Estatísticas -->
            <div class="about-story__stats">
              <div class="about-story__stat">
                <span class="about-story__stat-number">15+</span>
                <span class="about-story__stat-label">Anos de Experiência</span>
              </div>
              <div class="about-story__stat">
                <span class="about-story__stat-number">1000+</span>
                <span class="about-story__stat-label">Hóspedes Satisfeitos</span>
              </div>
              <div class="about-story__stat">
                <span class="about-story__stat-number">3</span>
                <span class="about-story__stat-label">Pousadas</span>
              </div>
            </div>
          </div>
          
          <div class="about-story__media">
            <!-- Placeholder para imagem/vídeo da história -->
                <div class="about-story__image-container">
                  <video 
                    class="about-story__video" 
                    autoplay 
                    muted 
                    loop 
                    playsinline
                    preload="metadata"
                  >
                    <source src="/videos/about/about-story.mp4" type="video/mp4">
                    <!-- Fallback para imagem real da pousada -->
                    <img 
                      src="/images/about/IDG_20250828_150752_938.JPG" 
                      alt="História da Grupo Caminué"
                      class="about-story__image"
                    >
                  </video>
                </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nossos Valores -->
    <section class="about-values">
      <div class="container">
        <div class="about-values__header">
          <div class="about-values__badge">Nossos Valores</div>
          <h2>{{ $t('about.values.title') }}</h2>
          <p>Os princípios que guiam nossa missão de proporcionar experiências únicas</p>
        </div>
        
        <div class="about-values__grid">
          <div class="about-values__card">
            <div class="about-values__icon">
              <Icon name="heroicons:heart" />
            </div>
            <h3>{{ $t('about.values.passion.title') }}</h3>
            <p>{{ $t('about.values.passion.description') }}</p>
          </div>
          
          <div class="about-values__card">
            <div class="about-values__icon">
              <Icon name="heroicons:shield-check" />
            </div>
            <h3>{{ $t('about.values.quality.title') }}</h3>
            <p>{{ $t('about.values.quality.description') }}</p>
          </div>
          
          <div class="about-values__card">
            <div class="about-values__icon">
              <Icon name="heroicons:users" />
            </div>
            <h3>{{ $t('about.values.service.title') }}</h3>
            <p>{{ $t('about.values.service.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Nossa Missão com vídeo -->
    <section class="about-mission">
      <div class="container">
        <div class="about-mission__content">
          <div class="about-mission__media">
            <!-- Placeholder para vídeo da missão -->
            <div class="about-mission__video-container">
              <video 
                class="about-mission__video" 
                autoplay 
                muted 
                loop 
                playsinline
                preload="metadata"
              >
                <source src="/videos/about/about-mission.mp4" type="video/mp4">
                <!-- Fallback para imagem se vídeo não carregar -->
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Missão da Grupo Caminué"
                  class="about-mission__image"
                >
              </video>
            </div>
          </div>
          
          <div class="about-mission__text">
            <div class="about-mission__badge">Nossa Missão</div>
            <h2>{{ $t('about.mission.title') }}</h2>
            <p>{{ $t('about.mission.description') }}</p>
            
            <!-- Call to Action -->
            <div class="about-mission__cta">
              <NuxtLink to="/accommodations" class="about-mission__button">
                Conheça Nossas Pousadas
                <Icon name="heroicons:arrow-right" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Galeria de Fotos (placeholder) -->
    <section class="about-gallery">
      <div class="container">
        <div class="about-gallery__header">
          <div class="about-gallery__badge">Galeria</div>
          <h2>Nossos Espaços</h2>
          <p>Conheça os ambientes que fazem da nossa hospedagem uma experiência única</p>
        </div>
        
            <div class="about-gallery__grid">
              <!-- Galeria com fotos reais da pousada -->
              <div class="about-gallery__item">
                <img src="/images/about/IDG_20250828_153814_488.JPG" alt="Escadaria interna da pousada">
              </div>
              <div class="about-gallery__item">
                <img src="/images/about/IDG_20250828_093434_445.JPG" alt="Área de convivência e jardim">
              </div>
              <div class="about-gallery__item">
                <img src="/images/about/IDG_20250828_153643_018.JPG" alt="Área de descanso ao ar livre">
              </div>
              <div class="about-gallery__item">
                <img src="/images/about/IDG_20250828_150752_938.JPG" alt="Fachada da pousada">
              </div>
            </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Dynamic hero image based on time of day
const heroImage = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  
  // Dia: 6h às 18h (hero_light)
  // Noite: 18h às 6h (hero_night)
  if (hour >= 6 && hour < 18) {
    return '/images/about/about-hero-light.jpg'
  } else {
    return '/images/about/about-hero-night.jpg'
  }
})

useHead({
  title: 'Sobre Nós - Grupo Caminué',
  meta: [
    { name: 'description', content: 'Conheça a Grupo Caminué e nossa paixão por proporcionar experiências únicas em Búzios' }
  ]
})
</script>

<style scoped>
/* Reset e base */
.about-page {
  min-height: 100vh;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.breadcrumb a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: white;
}

/* Hero Section */
.about-hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.about-hero__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.about-hero__media {
  width: 100%;
  height: 100%;
  position: relative;
}

.about-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.about-hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.about-hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 34, 121, 0.7) 0%,
    rgba(0, 29, 92, 0.6) 30%,
    rgba(30, 64, 175, 0.5) 70%,
    rgba(59, 130, 246, 0.4) 100%
  );
}

.about-hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.about-hero__text {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
}

.about-hero__text h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-hero__text p {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Badge comum */
.about-story__badge,
.about-values__badge,
.about-mission__badge,
.about-gallery__badge {
  display: inline-block;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

/* Nossa História */
.about-story {
  padding: 6rem 0;
  background: #f8f9fa;
}

.about-story__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-story__text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.about-story__text p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.about-story__stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.about-story__stat {
  text-align: center;
}

.about-story__stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1E3A8A;
  line-height: 1;
}

.about-story__stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.5rem;
}

.about-story__media {
  position: relative;
}

.about-story__image-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.about-story__image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-story__video {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-story__image-container:hover .about-story__image,
.about-story__image-container:hover .about-story__video {
  transform: scale(1.05);
}

/* Nossos Valores */
.about-values {
  padding: 6rem 0;
  background: white;
}

.about-values__header {
  text-align: center;
  margin-bottom: 4rem;
}

.about-values__header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.about-values__header p {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.about-values__card {
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.about-values__card:hover {
  background: white;
  border-color: #1E3A8A;
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.about-values__icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.about-values__icon svg {
  width: 40px;
  height: 40px;
}

.about-values__card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.about-values__card p {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
}

/* Nossa Missão */
.about-mission {
  padding: 6rem 0;
  background: #f8f9fa;
}

.about-mission__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-mission__media {
  order: 1;
}

.about-mission__text {
  order: 2;
}

.about-mission__video-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.about-mission__image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-mission__video {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-mission__video-container:hover .about-mission__image,
.about-mission__video-container:hover .about-mission__video {
  transform: scale(1.05);
}

.about-mission__text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.about-mission__text p {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.about-mission__button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

.about-mission__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
}

/* Galeria */
.about-gallery {
  padding: 6rem 0;
  background: white;
}

.about-gallery__header {
  text-align: center;
  margin-bottom: 4rem;
}

.about-gallery__header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.about-gallery__header p {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.about-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.about-gallery__item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.about-gallery__item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.about-gallery__item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.about-gallery__item:hover img {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .about-story__content,
  .about-mission__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .about-mission__media {
    order: 2;
  }
  
  .about-mission__text {
    order: 1;
  }
  
  .about-story__stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .about-hero {
    height: 70vh;
    min-height: 400px;
  }
  
  .breadcrumb {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    margin-bottom: 1.5rem;
  }
  
  .about-story,
  .about-values,
  .about-mission,
  .about-gallery {
    padding: 4rem 0;
  }
  
  .about-story__text h2,
  .about-values__header h2,
  .about-mission__text h2,
  .about-gallery__header h2 {
    font-size: 2rem;
  }
  
  .about-story__stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .about-values__grid {
    grid-template-columns: 1fr;
  }
  
  .about-gallery__grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .about-story__image,
  .about-mission__image {
    height: 300px;
  }
  
  .about-gallery__item img {
    height: 200px;
  }
}
</style>
