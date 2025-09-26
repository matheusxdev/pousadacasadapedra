<template>
  <section class="rooms-slider">
    <div class="container">
      <div class="rooms-slider__header">
        <h2 class="rooms-slider__title">Nossos Quartos</h2>
        <p class="rooms-slider__subtitle">Conheça nossos quartos confortáveis e bem equipados</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="rooms-slider__loading">
        <div class="rooms-slider__skeleton">
          <div class="rooms-slider__skeleton-image"></div>
          <div class="rooms-slider__skeleton-content">
            <div class="rooms-slider__skeleton-title"></div>
            <div class="rooms-slider__skeleton-description"></div>
            <div class="rooms-slider__skeleton-price"></div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="rooms-slider__error">
        <Icon name="heroicons:exclamation-triangle" class="rooms-slider__error-icon" />
        <h3>Erro ao carregar quartos</h3>
        <p>{{ error }}</p>
        <button @click="loadRooms" class="rooms-slider__retry">
          Tentar novamente
        </button>
      </div>
      
      <!-- Slider -->
      <div v-else-if="rooms.length > 0" class="rooms-slider__container">
        <div 
          class="rooms-slider__wrapper" 
          :style="{ transform: slideTransform }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div 
            v-for="room in rooms" 
            :key="room.id" 
            class="rooms-slider__slide"
          >
            <div class="rooms-slider__card">
              <div class="rooms-slider__image">
                <img :src="room.image" :alt="room.name" />
              </div>
              <div class="rooms-slider__content">
                <h3 class="rooms-slider__name">{{ room.name }}</h3>
                <p class="rooms-slider__description">{{ cleanDescription(room.description, 120) }}</p>
                <div class="rooms-slider__price">
                  <span class="price">{{ formatPrice(room.current_price || room.price) }}</span>
                  <span v-if="room.current_price && room.current_price !== 0 && room.current_price !== '0'" class="period">por noite</span>
                </div>
                <button @click="viewRoom(room)" class="rooms-slider__button">
                  Ver detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Dots - só mostra se houver mais de 1 quarto -->
        <div v-if="rooms.length > 1" class="rooms-slider__dots">
          <button 
            v-for="index in totalSlides" 
            :key="index"
            @click="goToSlide(index - 1)"
            :class="{ 'active': currentIndex === (index - 1) }"
            class="rooms-slider__dot"
          ></button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="rooms-slider__empty">
        <Icon name="heroicons:home" class="rooms-slider__empty-icon" />
        <h3>Nenhum quarto encontrado</h3>
        <p>Não há quartos disponíveis no momento.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const rooms = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentIndex = ref(0)
const autoSlideInterval = ref<NodeJS.Timeout | null>(null)
const windowWidth = ref(0)

// Variáveis para touch/swipe
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)

// Computed para calcular o transform baseado no número de slides visíveis
const slideTransform = computed(() => {
  const slidesPerView = windowWidth.value <= 768 ? 1 : windowWidth.value <= 1024 ? 2 : 3
  return `translateX(-${currentIndex.value * (100 / slidesPerView)}%)`
})

// Computed para calcular o número total de slides (dots)
const totalSlides = computed(() => {
  const slidesPerView = windowWidth.value <= 768 ? 1 : windowWidth.value <= 1024 ? 2 : 3
  return Math.max(1, rooms.value.length - slidesPerView + 1)
})

// Função para atualizar largura da janela
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Função para limpar HTML e encurtar descrição
const cleanDescription = (description: string, maxLength: number = 150) => {
  if (!description) return ''
  
  // Verificar se estamos no cliente
  if (typeof window === 'undefined') {
    // SSR: usar regex simples
    let cleanText = description
      .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
      .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Remove entidades HTML
      .replace(/\s+/g, ' ') // Remove espaços extras
      .trim()
    
    if (cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength).trim() + '...'
    }
    
    return cleanText
  }
  
  // Cliente: usar DOM para decodificar HTML entities
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = description
  
  // Obter o texto decodificado
  let cleanText = tempDiv.textContent || tempDiv.innerText || ''
  
  // Remover tags HTML restantes
  cleanText = cleanText
    .replace(/<[^>]*>/g, '') // Remove todas as tags HTML
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim()
  
  // Encurtar se necessário
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
  
  // Se for número, formatar como moeda
  const numPrice = parseFloat(price)
  if (!isNaN(numPrice)) {
    return `R$ ${numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  // Se já for string formatada, usar como está
  return price
}

const viewRoom = (room: any) => {
  navigateTo(`/accommodations/${room.id}`)
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  resetAutoSlide()
}

const nextSlide = () => {
  const slidesPerView = windowWidth.value <= 768 ? 1 : windowWidth.value <= 1024 ? 2 : 3
  const maxIndex = Math.max(0, rooms.value.length - slidesPerView)
  
  if (currentIndex.value >= maxIndex) {
    currentIndex.value = 0 // Volta para o início
  } else {
    currentIndex.value = currentIndex.value + 1 // Move de um em um
  }
}

// Funções para touch/swipe
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  isDragging.value = true
  stopAutoSlide() // Para o slide automático durante o drag
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault() // Previne scroll da página
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  touchEndX.value = e.changedTouches[0].clientX
  const swipeDistance = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50 // Distância mínima para considerar um swipe
  
  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Swipe para a esquerda = próximo slide
      nextSlide()
    } else {
      // Swipe para a direita = slide anterior
      prevSlide()
    }
  }
  
  isDragging.value = false
  resetAutoSlide() // Reinicia o slide automático
}

const prevSlide = () => {
  const slidesPerView = windowWidth.value <= 768 ? 1 : windowWidth.value <= 1024 ? 2 : 3
  const maxIndex = Math.max(0, rooms.value.length - slidesPerView)
  
  if (currentIndex.value <= 0) {
    currentIndex.value = maxIndex // Vai para o final
  } else {
    currentIndex.value = currentIndex.value - 1 // Move de um em um
  }
}

const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000) // Muda a cada 5 segundos
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
}

const resetAutoSlide = () => {
  stopAutoSlide()
  startAutoSlide()
}

const loadRooms = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/accommodations', {
      query: {
        limit: 8
      }
    }) as any
    
    // A API unificada retorna os dados em response.data
    const allRooms = response.data || []
    
    // Embaralhar os quartos para mostrar diferentes a cada carregamento
    rooms.value = allRooms.sort(() => Math.random() - 0.5).slice(0, 8)
    
    console.log('Rooms loaded for slider:', rooms.value.length, 'items')
    
    // Iniciar slide automático se houver mais de 3 quartos
    if (rooms.value.length > 3) {
      startAutoSlide()
    }
  } catch (err) {
    console.error('Erro ao buscar quartos:', err)
    error.value = 'Erro ao carregar quartos da API StarHub'
    rooms.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Inicializar largura da janela
  updateWindowWidth()
  
  // Adicionar listener para resize
  window.addEventListener('resize', updateWindowWidth)
  
  await loadRooms()
})

onUnmounted(() => {
  stopAutoSlide()
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.rooms-slider {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.rooms-slider__header {
  text-align: center;
  margin-bottom: 3rem;
}

.rooms-slider__title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #002279;
  margin: 0 0 1rem 0;
}

.rooms-slider__subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin: 0;
}

/* Loading State */
.rooms-slider__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.rooms-slider__skeleton {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rooms-slider__skeleton-image {
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.rooms-slider__skeleton-content {
  padding: 1.5rem;
}

.rooms-slider__skeleton-title {
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.rooms-slider__skeleton-description {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.rooms-slider__skeleton-price {
  height: 20px;
  width: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.rooms-slider__error {
  text-align: center;
  padding: 3rem 0;
}

.rooms-slider__error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 1rem;
}

.rooms-slider__error h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.rooms-slider__error p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.rooms-slider__retry {
  background: #002279;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rooms-slider__retry:hover {
  background: #001d5c;
  transform: translateY(-2px);
}

/* Empty State */
.rooms-slider__empty {
  text-align: center;
  padding: 3rem 0;
}

.rooms-slider__empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.rooms-slider__empty h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.rooms-slider__empty p {
  color: #6b7280;
}

/* Slider Container */
.rooms-slider__container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.rooms-slider__wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.rooms-slider__slide {
  width: calc(100% / 3);
  flex-shrink: 0;
  padding: 0 0.5rem;
  box-sizing: border-box;
}

.rooms-slider__card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.rooms-slider__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.rooms-slider__image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.rooms-slider__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rooms-slider__card:hover .rooms-slider__image img {
  transform: scale(1.05);
}

.rooms-slider__content {
  padding: 1.5rem;
}

.rooms-slider__name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002279;
  margin: 0 0 1rem 0;
}

.rooms-slider__description {
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.rooms-slider__price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.rooms-slider__price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002279;
}

.rooms-slider__price .period {
  color: #64748b;
  font-size: 0.9rem;
}

.rooms-slider__button {
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

.rooms-slider__button:hover {
  background: #001d5c;
  transform: translateY(-2px);
}

/* Navigation Dots */
.rooms-slider__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.rooms-slider__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rooms-slider__dot.active {
  background: #002279;
  transform: scale(1.2);
}

.rooms-slider__dot:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .rooms-slider__slide {
    min-width: calc(100% / 2);
  }
}

@media (max-width: 768px) {
  .rooms-slider {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .rooms-slider__title {
    font-size: 2rem;
  }
  
  .rooms-slider__subtitle {
    font-size: 1rem;
  }
  
  .rooms-slider__slide {
    min-width: 100%;
    padding: 0;
  }
  
  .rooms-slider__image {
    height: 250px;
  }
  
  .rooms-slider__content {
    padding: 1rem;
  }
  
  .rooms-slider__name {
    font-size: 1.25rem;
  }
  
  .rooms-slider__price .price {
    font-size: 1.25rem;
  }
}
</style>
