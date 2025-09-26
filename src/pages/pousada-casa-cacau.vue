<template>
  <div class="pousada-page">
    <!-- Header da Pousada -->
    <div class="pousada-page__header">
      <div class="container">
        <div class="pousada-page__header-content">
          <div class="pousada-page__logo">
            <img :src="getImageSrc('logo_casacacau.avif')" alt="Pousada Casa Cacau" />
          </div>
          <div class="pousada-page__info">
            <h1>Pousada Casa Cacau</h1>
            <p class="pousada-page__subtitle">Charme e tranquilidade em ambiente acolhedor</p>
            <div class="pousada-page__features">
              <span class="feature">WiFi Gratuito</span>
              <span class="feature">Recepção 24h</span>
              <span class="feature">Café da Manhã</span>
              <span class="feature">Ar Condicionado</span>
              <span class="feature">Jardim Privativo</span>
              <span class="feature">Café Colonial</span>
              <span class="feature">Ambiente Acolhedor</span>
              <span class="feature">Tranquilidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando quartos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <Icon name="heroicons:exclamation-triangle" class="error-icon" />
      <h3>Erro ao carregar quartos</h3>
      <p>{{ error }}</p>
      <button @click="loadRooms" class="retry-button">
        Tentar novamente
      </button>
    </div>

    <!-- Quartos da Pousada -->
    <div v-else-if="rooms.length > 0" class="pousada-page__rooms">
      <div class="container">
        <h2 class="pousada-page__rooms-title">Nossos Quartos</h2>
        <div class="rooms-grid">
          <div v-for="room in rooms" :key="room.id" class="room-card">
            <div class="room-card__image">
              <img :src="room.image" :alt="room.name" />
            </div>
            <div class="room-card__content">
              <h3>{{ room.name }}</h3>
              <p>{{ cleanDescription(room.description, 120) }}</p>
              <div class="room-card__price">
                <span class="price">{{ formatPrice(room.current_price || room.price) }}</span>
                <span v-if="room.current_price && room.current_price !== 0 && room.current_price !== '0'" class="period">por noite</span>
              </div>
              <button @click="viewRoom(room)" class="room-card__button">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <Icon name="heroicons:home" class="empty-icon" />
      <h3>Nenhum quarto encontrado</h3>
      <p>Não há quartos disponíveis no momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const rooms = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// SEO
useHead({
  title: 'Pousada Casa Cacau - Búzios',
  meta: [
    { name: 'description', content: 'Pousada Casa Cacau em Búzios - Charme e tranquilidade em ambiente acolhedor. Quartos com WiFi gratuito, ar condicionado e jardim privativo.' }
  ]
})

const getImageSrc = (logoName: string) => {
  return `/images/${logoName}`
}

// Função para limpar HTML e encurtar descrição
const cleanDescription = (description: string, maxLength: number = 150) => {
  if (!description) return ''
  
  if (typeof window === 'undefined') {
    let cleanText = description
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-zA-Z0-9#]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    if (cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength).trim() + '...'
    }
    
    return cleanText
  }
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = description
  let cleanText = tempDiv.textContent || tempDiv.innerText || ''
  
  cleanText = cleanText
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim() + '...'
  }
  
  return cleanText
}

// Função para formatar preço
const formatPrice = (price: any) => {
  if (!price || price === 0 || price === '0') {
    return 'Preço a consultar'
  }
  
  const numPrice = parseFloat(price)
  if (!isNaN(numPrice)) {
    return `R$ ${numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  return price
}

const viewRoom = (room: any) => {
  // Usar ID, slug ou índice como fallback
  const identifier = room.id || room.slug || room.product_id || rooms.value.indexOf(room)
  console.log('Room data:', room)
  console.log('Using identifier:', identifier)
  navigateTo(`/accommodations/${identifier}`)
}

const loadRooms = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/accommodations', {
      query: {
        limit: 50
      }
    }) as any
    
    const allRooms = response.data || []
    
    // Filtrar apenas quartos da Casa Cacau
    rooms.value = allRooms.filter((room: any) => {
      const subcategory = room.subcategory?.toString() || ''
      const category = room.category?.toString() || ''
      const name = room.name?.toLowerCase() || ''
      const slug = room.slug?.toLowerCase() || ''
      
      return subcategory === '3' ||
             name.includes('casa cacau') ||
             slug.includes('casa-cacau') ||
             slug.includes('casa-cacau')
    })
    
    console.log('Casa Cacau rooms loaded:', rooms.value.length, 'items')
  } catch (err) {
    console.error('Erro ao buscar quartos:', err)
    error.value = 'Erro ao carregar quartos da API StarHub'
    rooms.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRooms()
})
</script>

<style scoped>
.pousada-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.pousada-page__header {
  background: linear-gradient(135deg, #002279 0%, #001d5c 30%, #1e40af 70%, #3b82f6 100%);
  color: white;
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.pousada-page__header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  opacity: 0.8;
}

.pousada-page__header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.05"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.2;
}

.pousada-page__header-content {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  position: relative;
  z-index: 1;
  width: 100%;
}

.pousada-page__logo {
  position: relative;
  flex-shrink: 0;
}

.pousada-page__logo img {
  width: 150px;
  height: auto;
  border-radius: 16px;
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
}

.pousada-page__logo::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 24px;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.pousada-page__logo:hover img {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.pousada-page__info {
  flex: 1;
  padding-top: 0.5rem;
}

.pousada-page__info h1 {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.pousada-page__subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2.5rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
  font-weight: 300;
  max-width: 500px;
}

.pousada-page__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.6rem;
  max-width: 700px;
}

.feature {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.feature:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.feature:hover::before {
  left: 100%;
}

/* Rooms Section */
.pousada-page__rooms {
  padding: 4rem 0;
  background: #f8fafc;
}

.pousada-page__rooms-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #002279;
  margin-bottom: 3rem;
  text-align: center;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.room-card__image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.room-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-card:hover .room-card__image img {
  transform: scale(1.05);
}

.room-card__content {
  padding: 1.5rem;
}

.room-card__content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002279;
  margin: 0 0 1rem 0;
}

.room-card__content p {
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.room-card__price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.room-card__price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002279;
}

.room-card__price .period {
  color: #64748b;
  font-size: 0.9rem;
}

.room-card__button {
  background: #002279;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.room-card__button:hover {
  background: #001d5c;
  transform: translateY(-2px);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 4rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #002279;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 1.1rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 0;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: #002279;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #001d5c;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

/* Responsive */
/* Tablet */
@media (max-width: 1024px) {
  .pousada-page__header {
    padding: 3.5rem 0;
    min-height: 55vh;
  }
  
  .pousada-page__header-content {
    gap: 2.5rem;
  }
  
  .pousada-page__logo img {
    width: 140px;
  }
  
  .pousada-page__info h1 {
    font-size: 3rem;
  }
  
  .pousada-page__subtitle {
    font-size: 1.2rem;
    margin-bottom: 2.2rem;
  }
  
  .pousada-page__features {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.55rem;
  }
  
  .feature {
    font-size: 0.78rem;
    padding: 0.55rem 0.75rem;
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .pousada-page__header {
    padding: 1.5rem 0 2.5rem 0;
    min-height: 50vh;
    margin-top: -1rem;
  }
  
  .pousada-page__header-content {
    display: flex !important;
    flex-direction: column !important;
    text-align: center !important;
    gap: 1.5rem !important;
    align-items: center !important;
    width: 100% !important;
  }
  
  .pousada-page__logo {
    flex-shrink: 0 !important;
    order: 1;
  }
  
  .pousada-page__logo img {
    width: 120px !important;
    margin: 0 auto !important;
  }
  
  .pousada-page__info {
    flex: none !important;
    padding-top: 0 !important;
    order: 2;
    width: 100% !important;
  }
  
  .pousada-page__info h1 {
    font-size: 2.5rem !important;
    text-align: center !important;
  }
  
  .pousada-page__subtitle {
    font-size: 1.1rem !important;
    margin-bottom: 2rem !important;
    text-align: center !important;
  }
  
  .pousada-page__features {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
    gap: 0.5rem !important;
    max-width: 100% !important;
  }
  
  .feature {
    font-size: 0.75rem !important;
    padding: 0.5rem 0.7rem !important;
  }
  
  .pousada-page__rooms {
    padding: 2rem 0;
  }
  
  .pousada-page__rooms-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .room-card__image {
    height: 200px;
  }
  
  .room-card__content {
    padding: 1rem;
  }
  
  .room-card__content h3 {
    font-size: 1.25rem;
  }
  
  .room-card__price .price {
    font-size: 1.25rem;
  }
}

/* Mobile Medium */
@media (max-width: 480px) {
  .pousada-page__header {
    padding: 1rem 0 2rem 0;
    min-height: 45vh;
    margin-top: -1.5rem;
  }
  
  .pousada-page__header-content {
    gap: 1rem;
  }
  
  .pousada-page__logo img {
    width: 100px;
  }
  
  .pousada-page__info h1 {
    font-size: 2rem;
  }
  
  .pousada-page__subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .pousada-page__features {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.4rem;
  }
  
  .feature {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }
}

/* Mobile Small */
@media (max-width: 360px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .pousada-page__header {
    padding: 0.8rem 0 1.5rem 0;
    min-height: 40vh;
    margin-top: -2rem;
  }
  
  .pousada-page__header-content {
    gap: 0.8rem;
  }
  
  .pousada-page__logo img {
    width: 80px;
  }
  
  .pousada-page__info h1 {
    font-size: 1.8rem;
  }
  
  .pousada-page__subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }
  
  .pousada-page__features {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.3rem;
  }
  
  .feature {
    font-size: 0.65rem;
    padding: 0.35rem 0.5rem;
  }
}
</style>
