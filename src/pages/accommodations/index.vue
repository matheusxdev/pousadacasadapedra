<template>
  <div class="accommodations-page">
    <div class="accommodations-page__header">
      <div class="container">
        <h1>{{ $t('nav.rooms') }}</h1>
        <p>Desfrute de acomodações confortáveis ​​e bem localizadas com serviço personalizado para tornar sua viagem inesquecível.</p>
        <p class="accommodations-page__cta">Reserve agora e viva uma experiência única.</p>
      </div>
    </div>
    
    <div class="accommodations-page__content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando acomodações...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <Icon name="heroicons:exclamation-triangle" class="error-icon" />
          <h3>Erro ao carregar acomodações</h3>
          <p>{{ error }}</p>
          <button @click="fetchAccommodations" class="retry-button">
            Tentar novamente
          </button>
        </div>

        <!-- Content -->
        <div v-else>
        <!-- Pousada Casa da Pedra -->
        <div class="pousada-section" :class="{ 'pousada-section--active': activePousada === 'casa-da-pedra' }">
          <div class="pousada-section__header">
            <div class="pousada-section__logo">
              <img :src="getImageSrc('logo_casadapedra.png')" alt="Pousada Casa da Pedra" />
            </div>
            <div class="pousada-section__info">
              <h2>Pousada Casa da Pedra</h2>
              <p>Apenas 40 metros da Rua das Pedras - Centro de Búzios</p>
              <div class="pousada-section__features">
                <span class="feature">WiFi Gratuito</span>
                <span class="feature">Recepção 24h</span>
                <span class="feature">Café da Manhã</span>
                <span class="feature">Ar Condicionado</span>
              </div>
            </div>
            <button 
              @click="togglePousada('casa-da-pedra')"
              class="pousada-section__toggle"
            >
              <Icon :name="activePousada === 'casa-da-pedra' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" />
            </button>
          </div>
          
          <div v-if="activePousada === 'casa-da-pedra'" class="pousada-section__rooms">
            <div class="rooms-grid">
              <div v-for="room in casaDaPedraRooms" :key="room.id" class="room-card">
                <div class="room-card__image">
                  <img :src="room.image" :alt="room.name" />
                </div>
                <div class="room-card__content">
                  <h3>{{ room.name }}</h3>
                  <p>{{ cleanDescription(room.description, 120) }}</p>
                  <div class="room-card__price">
                    <span class="price">{{ formatPrice(room.current_price || room.price) }}</span>
                    <span v-if="room.current_price && room.current_price !== 0 && room.current_price !== '0'" class="period">{{ $t('accommodations.perNight') }}</span>
                  </div>
                  <button @click="viewRoom(room)" class="room-card__button">
                    {{ $t('accommodations.viewRoom') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pousada Canoa do Mar -->
        <div class="pousada-section" :class="{ 'pousada-section--active': activePousada === 'canoa-do-mar' }">
          <div class="pousada-section__header">
            <div class="pousada-section__logo">
              <img :src="getImageSrc('logo_canoadomar.png')" alt="Pousada Canoa do Mar" />
            </div>
            <div class="pousada-section__info">
              <h2>Pousada Canoa do Mar</h2>
              <p>Experiência única à beira-mar em Búzios - A menos de 1km da Praia João Fernandes</p>
              <div class="pousada-section__features">
                <span class="feature">WiFi Gratuito</span>
                <span class="feature">Recepção 24h</span>
                <span class="feature">Café da Manhã</span>
                <span class="feature">Ar Condicionado</span>
              </div>
            </div>
            <button 
              @click="togglePousada('canoa-do-mar')"
              class="pousada-section__toggle"
            >
              <Icon :name="activePousada === 'canoa-do-mar' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" />
            </button>
          </div>
          
          <div v-if="activePousada === 'canoa-do-mar'" class="pousada-section__rooms">
            <div class="rooms-grid">
              <div v-for="room in canoaDoMarRooms" :key="room.id" class="room-card">
                <div class="room-card__image">
                  <img :src="room.image" :alt="room.name" />
                </div>
                <div class="room-card__content">
                  <h3>{{ room.name }}</h3>
                  <p>{{ cleanDescription(room.description, 120) }}</p>
                  <div class="room-card__price">
                    <span class="price">{{ formatPrice(room.current_price || room.price) }}</span>
                    <span v-if="room.current_price && room.current_price !== 0 && room.current_price !== '0'" class="period">{{ $t('accommodations.perNight') }}</span>
                  </div>
                  <button @click="viewRoom(room)" class="room-card__button">
                    {{ $t('accommodations.viewRoom') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pousada Casa Cacau -->
        <div class="pousada-section" :class="{ 'pousada-section--active': activePousada === 'casa-cacau' }">
          <div class="pousada-section__header">
            <div class="pousada-section__logo">
              <img :src="getImageSrc('logo_casacacau.avif')" alt="Pousada Casa Cacau" />
            </div>
            <div class="pousada-section__info">
              <h2>Pousada Casa Cacau</h2>
              <p>Charme e tranquilidade em ambiente acolhedor</p>
              <div class="pousada-section__features">
                <span class="feature">WiFi Gratuito</span>
                <span class="feature">Recepção 24h</span>
                <span class="feature">Café da Manhã</span>
                <span class="feature">Ar Condicionado</span>
              </div>
            </div>
            <button 
              @click="togglePousada('casa-cacau')"
              class="pousada-section__toggle"
            >
              <Icon :name="activePousada === 'casa-cacau' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" />
            </button>
          </div>
          
          <div v-if="activePousada === 'casa-cacau'" class="pousada-section__rooms">
            <div class="rooms-grid">
              <div v-for="room in casaCacauRooms" :key="room.id" class="room-card">
                <div class="room-card__image">
                  <img :src="room.image" :alt="room.name" />
                </div>
                <div class="room-card__content">
                  <h3>{{ room.name }}</h3>
                  <p>{{ cleanDescription(room.description, 120) }}</p>
                  <div class="room-card__price">
                    <span class="price">{{ formatPrice(room.current_price || room.price) }}</span>
                    <span v-if="room.current_price && room.current_price !== 0 && room.current_price !== '0'" class="period">{{ $t('accommodations.perNight') }}</span>
                  </div>
                  <button @click="viewRoom(room)" class="room-card__button">
                    {{ $t('accommodations.viewRoom') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const activePousada = ref<string | null>(null)
const accommodations = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Dados das pousadas
const pousadas = [
  {
    id: 'casa-da-pedra',
    name: 'Pousada Casa da Pedra',
    description: 'Conforto e hospitalidade no coração de Búzios',
    logo: 'logo_casadapedra.png',
    features: ['Wi-Fi Gratuito', 'Ar Condicionado', 'Café da Manhã'],
    subcategory: 'casa-da-pedra'
  },
  {
    id: 'canoa-do-mar',
    name: 'Pousada Canoa do Mar',
    description: 'Experiência única à beira-mar em Búzios',
    logo: 'logo_canoadomar.png',
    features: ['Vista para o Mar', 'Piscina', 'Estacionamento'],
    subcategory: 'canoa-do-mar'
  },
  {
    id: 'casa-cacau',
    name: 'Pousada Casa Cacau',
    description: 'Charme e tranquilidade em ambiente acolhedor',
    logo: 'logo_casacacau.avif',
    features: ['Jardim Privativo', 'Café Colonial', 'Recepção 24h'],
    subcategory: 'casa-cacau'
  }
]

// Computed para filtrar quartos por pousada
const casaDaPedraRooms = computed(() => 
  accommodations.value.filter(room => {
    const subcategory = room.subcategory?.toString() || ''
    const category = room.category?.toString() || ''
    const name = room.name?.toLowerCase() || ''
    const slug = room.slug?.toLowerCase() || ''
    
    // Filtro por subcategory ID (1 = Casa da Pedra) ou por nome/slug
    return subcategory === '1' ||
           name.includes('casa da pedra') ||
           slug.includes('casa-pedra') ||
           slug.includes('casa-pedra')
  })
)

const canoaDoMarRooms = computed(() => 
  accommodations.value.filter(room => {
    const subcategory = room.subcategory?.toString() || ''
    const category = room.category?.toString() || ''
    const name = room.name?.toLowerCase() || ''
    const slug = room.slug?.toLowerCase() || ''
    
    // Filtro por subcategory ID (2 = Canoa do Mar) ou por nome/slug
    return subcategory === '2' ||
           name.includes('canoa do mar') ||
           slug.includes('canoa-mar') ||
           slug.includes('canoa')
  })
)

const casaCacauRooms = computed(() => 
  accommodations.value.filter(room => {
    const subcategory = room.subcategory?.toString() || ''
    const category = room.category?.toString() || ''
    const name = room.name?.toLowerCase() || ''
    const slug = room.slug?.toLowerCase() || ''
    
    // Filtro por subcategory ID (3 = Casa Cacau) ou por nome/slug
    return subcategory === '3' ||
           name.includes('casa cacau') ||
           slug.includes('casa-cacau') ||
           slug.includes('cacau')
  })
)

const togglePousada = (pousadaId: string) => {
  activePousada.value = activePousada.value === pousadaId ? null : pousadaId
}

const getImageSrc = (logoName: string) => {
  // Usar caminhos da pasta public para evitar problemas de SSR
  return `/images/${logoName}`
}

// Função para formatar preço
const formatPrice = (price: any) => {
  if (!price || price === 0 || price === '0') {
    return 'Preço a consultar'
  }
  
  // Se for número, formatar como moeda
  const numPrice = parseFloat(price)
  if (!isNaN(numPrice)) {
    return `R$ ${numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  // Se já for string formatada, usar como está
  return price
}

// Função para limpar HTML e encurtar descrição
const cleanDescription = (description: string, maxLength: number = 150) => {
  if (!description) return ''
  
  // Remover tags HTML mas preservar entidades de acentos
  let cleanText = description
    .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim()
  
  // Decodificar entidades HTML para preservar acentos
  if (typeof window !== 'undefined') {
    // Cliente: usar DOM para decodificar
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = cleanText
    cleanText = tempDiv.textContent || tempDiv.innerText || cleanText
  } else {
    // Servidor: decodificar entidades básicas manualmente
    cleanText = cleanText
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&atilde;/g, 'ã')
      .replace(/&otilde;/g, 'õ')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&Aacute;/g, 'Á')
      .replace(/&Eacute;/g, 'É')
      .replace(/&Iacute;/g, 'Í')
      .replace(/&Oacute;/g, 'Ó')
      .replace(/&Uacute;/g, 'Ú')
      .replace(/&Atilde;/g, 'Ã')
      .replace(/&Otilde;/g, 'Õ')
      .replace(/&Ccedil;/g, 'Ç')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }
  
  // Encurtar se necessário
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim() + '...'
  }
  
  return cleanText
}

const viewRoom = (room: any) => {
  // Usar slug, uuid ou id como fallback
  const identifier = room.slug || room.uuid || room.id
  navigateTo(`/accommodations/${identifier}`)
}

// Função para buscar acomodações da API
const fetchAccommodations = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/accommodations', {
      query: {
        // Adicionar parâmetros de filtro se necessário
      }
    }) as any
    
    // A API unificada retorna os dados em response.data
    accommodations.value = response.data || []
  } catch (err) {
    console.error('Erro ao buscar acomodações:', err)
    error.value = 'Erro ao carregar acomodações da API StarHub'
    accommodations.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Verificar se há filtro por subcategoria na URL
  const route = useRoute()
  const subcategory = route.query.subcategory as string
  
  if (subcategory) {
    // Mapear subcategoria para ID da pousada
    const subcategoryMap: Record<string, string> = {
      'casa-da-pedra': 'casa-da-pedra',
      'canoa-do-mar': 'canoa-do-mar', 
      'casa-cacau': 'casa-cacau'
    }
    
    activePousada.value = subcategoryMap[subcategory] || subcategory
  }
  
  // Buscar acomodações da API
  await fetchAccommodations()
})
</script>

<style scoped>
.accommodations-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.accommodations-page__header {
  background: linear-gradient(135deg, #001d5c 0%, #002279 50%, #1e40af 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.accommodations-page__header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.05"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.accommodations-page__header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.accommodations-page__header p {
  font-size: 1.3rem;
  opacity: 0.95;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  line-height: 1.6;
}

.accommodations-page__cta {
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.15) !important;
  padding: 1rem 2rem !important;
  border-radius: 50px !important;
  display: inline-block !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  z-index: 1 !important;
  margin-bottom: 0 !important;
}

.accommodations-page__cta:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.accommodations-page__content {
  padding: 3rem 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #002279;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
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
  margin: 0 auto 1rem;
}

.error-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 2rem;
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

.pousada-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.pousada-section--active {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.pousada-section__header {
  display: flex;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pousada-section__header:hover {
  background: #f8f9fa;
}

.pousada-section__logo {
  flex-shrink: 0;
}

.pousada-section__logo img {
  width: 80px;
  height: 60px;
  object-fit: contain;
}

.pousada-section__info {
  flex: 1;
}

.pousada-section__info h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.pousada-section__info p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.pousada-section__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.feature {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.feature:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pousada-section__toggle {
  background: #002279;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pousada-section__toggle:hover {
  background: #001d5c;
  transform: scale(1.1);
}

.pousada-section__rooms {
  padding: 0 2rem 2rem;
  border-top: 1px solid #e9ecef;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.room-card__image {
  position: relative;
  height: 200px;
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

/* Overlay removido - botão agora está no bottom do card
.room-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.room-card:hover .room-card__overlay {
  opacity: 1;
}
*/

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
  margin-top: 1rem;
}

.room-card__button:hover {
  background: #001d5c;
  transform: scale(1.05);
}

.room-card__content {
  padding: 1.5rem;
}

.room-card__content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.room-card__content p {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.room-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002279;
}

.period {
  color: #6c757d;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .accommodations-page__header h1 {
    font-size: 2rem;
  }
  
  .pousada-section__header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .pousada-section__logo img {
    width: 60px;
    height: 45px;
  }
  
  .pousada-section__features {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.4rem;
  }
  
  .feature {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .pousada-section__features {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.3rem;
  }
  
  .feature {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>