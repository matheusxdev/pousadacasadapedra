<template>
  <section class="app-download-section">
    <div class="container">
      <div class="app-download-section__content">
        <!-- Mobile App Screens -->
        <div class="app-download-section__phones">
          <div class="app-download-section__phone app-download-section__phone--back">
            <div class="app-download-section__phone-screen">
              <div class="app-download-section__status-bar">
                <span class="app-download-section__time">9:41</span>
              </div>
              <div class="app-download-section__header">
                <h3>Explore</h3>
                <p>150 Pousadas Encontradas</p>
              </div>
              <div class="app-download-section__hotel-cards">
                <div class="app-download-section__hotel-card">
                  <div class="app-download-section__hotel-image">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Pousada Grupo Caminué">
                  </div>
                  <div class="app-download-section__hotel-info">
                    <h4>Pousada Grupo Caminué</h4>
                    <p>Búzios, RJ</p>
                  </div>
                </div>
                <div class="app-download-section__hotel-card">
                  <div class="app-download-section__hotel-image">
                    <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Pousada Búzios Beach">
                  </div>
                  <div class="app-download-section__hotel-info">
                    <h4>Pousada Búzios Beach</h4>
                    <p>Praia de Geribá</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="app-download-section__phone app-download-section__phone--front">
            <div class="app-download-section__phone-screen">
              <div class="app-download-section__status-bar">
                <span class="app-download-section__time">9:41</span>
              </div>
              <div class="app-download-section__search-bar">
                <Icon name="heroicons:magnifying-glass" />
                <span>{{ $t('app.searchPlaceholder') }}</span>
              </div>
              <div class="app-download-section__hero-image">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Búzios">
                <div class="app-download-section__hero-content">
                  <h3>Búzios</h3>
                  <p>{{ $t('app.heroSubtitle') }}</p>
                  <button class="app-download-section__cta-button">
                    {{ $t('app.viewAccommodations') }}
                  </button>
                </div>
              </div>
              <div class="app-download-section__destinations">
                <h4>{{ $t('app.popularDestinations') }}</h4>
                <div class="app-download-section__destination-cards">
                  <div class="app-download-section__destination-card">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Arraial do Cabo">
                    <span>Arraial do Cabo</span>
                  </div>
                  <div class="app-download-section__destination-card">
                    <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Cabo Frio">
                    <span>Cabo Frio</span>
                  </div>
                </div>
              </div>
              <div class="app-download-section__bottom-nav">
                <Icon name="heroicons:home" />
                <Icon name="heroicons:magnifying-glass" />
                <Icon name="heroicons:heart" />
                <Icon name="heroicons:user" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Text and Download Buttons -->
        <div class="app-download-section__text">
          <h2 class="app-download-section__title">Aplicativo Grupo Caminué</h2>
          <div class="app-download-section__description">
            <p>{{ $t('app.description1') }}</p>
            <p>{{ $t('app.description2') }}</p>
            <p>{{ $t('app.description3') }}</p>
          </div>
          
          <div class="app-download-section__download-buttons">
            <a href="#" class="app-download-section__download-btn app-download-section__download-btn--apple">
              <div class="app-download-section__btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div class="app-download-section__btn-text">
                <span class="app-download-section__btn-small">{{ $t('app.downloadOn') }}</span>
                <span class="app-download-section__btn-large">App Store</span>
              </div>
            </a>
            
            <a href="#" class="app-download-section__download-btn app-download-section__download-btn--google">
              <div class="app-download-section__btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div class="app-download-section__btn-text">
                <span class="app-download-section__btn-small">{{ $t('app.downloadOn') }}</span>
                <span class="app-download-section__btn-large">Play Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente para seção de download do aplicativo
</script>

<style scoped>
.app-download-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #bbdefb 0%, #bbdefb 100%);
  position: relative;
  overflow: hidden;
}

.app-download-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23f8fafc" opacity="0.3"/><circle cx="75" cy="75" r="1" fill="%23f8fafc" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.app-download-section__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Phone Screens */
.app-download-section__phones {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.app-download-section__phone {
  width: 200px;
  height: 400px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.app-download-section__phone--back {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) rotate(-15deg) translateX(-30px);
  z-index: 1;
  opacity: 0.8;
}

.app-download-section__phone--front {
  position: relative;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%) rotate(5deg) translateX(30px);
}

.app-download-section__phone-screen {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-download-section__status-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  margin-bottom: 10px;
}

.app-download-section__time {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Back Phone Content */
.app-download-section__header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 5px;
}

.app-download-section__header p {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 15px;
}

.app-download-section__hotel-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-download-section__hotel-card {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.app-download-section__hotel-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
}

.app-download-section__hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-download-section__hotel-info h4 {
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.app-download-section__hotel-info p {
  font-size: 9px;
  color: #6b7280;
}

/* Front Phone Content */
.app-download-section__search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 20px;
  margin-bottom: 15px;
}

.app-download-section__search-bar svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.app-download-section__search-bar span {
  font-size: 12px;
  color: #6b7280;
}

.app-download-section__hero-image {
  position: relative;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

.app-download-section__hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-download-section__hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 15px;
  color: white;
}

.app-download-section__hero-content h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.app-download-section__hero-content p {
  font-size: 10px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.app-download-section__cta-button {
  background: #1E3A8A;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}

.app-download-section__destinations {
  margin-bottom: 15px;
}

.app-download-section__destinations h4 {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.app-download-section__destination-cards {
  display: flex;
  gap: 8px;
}

.app-download-section__destination-card {
  flex: 1;
  position: relative;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.app-download-section__destination-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-download-section__destination-card span {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.app-download-section__bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #e5e7eb;
}

.app-download-section__bottom-nav svg {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

/* Text Section */
.app-download-section__text {
  padding-left: 2rem;
}

.app-download-section__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.app-download-section__description {
  margin-bottom: 3rem;
}

.app-download-section__description p {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.app-download-section__download-buttons {
  display: flex;
  gap: 1rem;
}

.app-download-section__download-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 160px;
}

.app-download-section__download-btn--apple {
  background: #1E3A8A;
  color: white;
}

.app-download-section__download-btn--apple:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
}

.app-download-section__download-btn--google {
  background: white;
  color: #1a1a1a;
  border: 2px solid #e5e7eb;
}

.app-download-section__download-btn--google:hover {
  background: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.app-download-section__btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-download-section__btn-icon svg {
  width: 24px;
  height: 24px;
}

.app-download-section__btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.app-download-section__btn-small {
  font-size: 12px;
  opacity: 0.8;
}

.app-download-section__btn-large {
  font-size: 16px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .app-download-section__content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .app-download-section__phones {
    order: 2;
  }
  
  .app-download-section__text {
    order: 1;
    padding-left: 0;
    text-align: center;
  }
  
  .app-download-section__title {
    font-size: 2rem;
  }
  
  .app-download-section__phone {
    width: 160px;
    height: 320px;
  }
  
  .app-download-section__download-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .app-download-section {
    padding: 4rem 0;
  }
  
  .app-download-section__phone {
    width: 140px;
    height: 280px;
  }
  
  .app-download-section__phone--back {
    transform: translateX(-50%) rotate(-10deg) translateX(-20px);
  }
  
  .app-download-section__phone--front {
    transform: translateX(-50%) rotate(3deg) translateX(20px);
  }
  
  .app-download-section__download-btn {
    min-width: 140px;
    padding: 10px 16px;
  }
}
</style>
