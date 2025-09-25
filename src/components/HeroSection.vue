<template>
  <section class="hero-section">
    <!-- Background Image -->
    <div class="hero-section__background">
      <img 
        :src="backgroundImage" 
        :alt="backgroundAlt"
        class="hero-section__background-image"
        loading="eager"
      />
      <div class="hero-section__overlay"></div>
    </div>
    
    <!-- Content -->
    <div class="hero-section__content">
      <div class="container">
        <!-- Rating Stars -->
        <div class="hero-section__rating">
          <div class="hero-section__stars">
            <Icon 
              v-for="i in 5" 
              :key="i" 
              name="heroicons:star-solid" 
              class="hero-section__star"
            />
          </div>
        </div>
        
        <!-- Offer Badge -->
        <div class="hero-section__offer">
          {{ $t('hero.offer') }}
        </div>
        
        <!-- Main Title -->
        <h1 class="hero-section__title">
          {{ $t('hero.title') }}
        </h1>
        
        <!-- Booking Form -->
        <div 
          ref="bookingFormRef"
          class="hero-section__booking-form"
          :class="{ 'hero-section__booking-form--sticky': isSticky }"
        >
          <form @submit.prevent="handleBookingSubmit" class="booking-form">
            <!-- Check In -->
            <div class="booking-form__field">
              <label class="booking-form__label">
                <Icon name="heroicons:calendar-days" class="booking-form__icon" />
                {{ $t('hero.booking.checkIn') }}
              </label>
              <input 
                type="date" 
                v-model="bookingData.checkIn"
                class="booking-form__input"
                :min="minDate"
                required
              />
            </div>
            
            <!-- Check Out -->
            <div class="booking-form__field">
              <label class="booking-form__label">
                <Icon name="heroicons:calendar-days" class="booking-form__icon" />
                {{ $t('hero.booking.checkOut') }}
              </label>
              <input 
                type="date" 
                v-model="bookingData.checkOut"
                class="booking-form__input"
                :min="minCheckOutDate"
                required
              />
            </div>
            
            <!-- Guests -->
            <div class="booking-form__field">
              <label class="booking-form__label">
                <Icon name="heroicons:user-group" class="booking-form__icon" />
                {{ $t('hero.booking.guests') }}
              </label>
              <div class="booking-form__guests">
                <span>{{ bookingData.adults }} {{ $t('hero.booking.adults') }} • {{ bookingData.children }} {{ $t('hero.booking.children') }}</span>
              </div>
            </div>
            
            <!-- Rooms -->
            <div class="booking-form__field">
              <label class="booking-form__label">
                <Icon name="heroicons:home" class="booking-form__icon" />
                {{ $t('hero.booking.rooms') }}
              </label>
              <div class="booking-form__rooms">
                <span>{{ bookingData.rooms }} {{ $t('hero.booking.room') }}</span>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button type="submit" class="booking-form__submit">
              {{ $t('hero.booking.viewRooms') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHeaderState } from '@/composables/useHeaderState'

// Props
interface Props {
  backgroundImage?: string
  backgroundAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  backgroundAlt: 'Pousada Grupo Caminué em Búzios'
})

// Refs
const bookingFormRef = ref<HTMLElement>()
const isSticky = ref(false)

// Header state
const { isBookingFormSticky } = useHeaderState()

// Booking data
const bookingData = ref({
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  rooms: 1
})

// Computed dates
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (bookingData.value.checkIn) {
    const checkInDate = new Date(bookingData.value.checkIn)
    checkInDate.setDate(checkInDate.getDate() + 1)
    return checkInDate.toISOString().split('T')[0]
  }
  return minDate.value
})

// Scroll handler
const handleScroll = () => {
  if (!bookingFormRef.value) return
  
  // Desabilitar sticky no mobile (telas menores que 768px)
  if (window.innerWidth < 768) {
    return
  }
  
  const scrollY = window.scrollY
  const heroSection = document.querySelector('.hero-section') as HTMLElement
  
  if (!heroSection) return
  
  const heroHeight = heroSection.offsetHeight
  const headerHeight = 114
  
  // Se o scroll está dentro da área do hero section, não ficar sticky
  if (scrollY < 100) { // TESTE: Ativar muito cedo para debug
    if (isSticky.value) {
      isSticky.value = false
    }
  } else {
    // Se passou da área do hero, ficar sticky
    if (!isSticky.value) {
      isSticky.value = true
    }
  }
}

// Handle form submission
const handleBookingSubmit = () => {
  // Redirect to accommodations page with search parameters
  const params = new URLSearchParams({
    checkIn: bookingData.value.checkIn,
    checkOut: bookingData.value.checkOut,
    adults: bookingData.value.adults.toString(),
    children: bookingData.value.children.toString(),
    rooms: bookingData.value.rooms.toString()
  })
  
  navigateTo(`/accommodations?${params.toString()}`)
}

// Lifecycle
onMounted(() => {
  // Garantir que não está sticky no mobile
  if (window.innerWidth < 768) {
    isSticky.value = false
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-section__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-section__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-section__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.hero-section__content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #ffffff;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Rating Stars */
.hero-section__rating {
  margin-bottom: 1rem;
}

.hero-section__stars {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.hero-section__star {
  width: 24px;
  height: 24px;
  color: #fbbf24;
}

/* Offer Badge */
.hero-section__offer {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Main Title */
.hero-section__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Booking Form */
.hero-section__booking-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
}

/* Sticky State */
.hero-section__booking-form--sticky {
  position: fixed;
  top: 108px; /* Altura exata do header (1.5rem + 60px logo + 1.5rem) */
  left: 0;
  right: 0;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  border-radius: 0;
  padding: 1.5rem 2rem; /* Mesmo padding vertical do header */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  z-index: 999; /* Menor que o header (1030) */
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sticky Animation */
@keyframes slideDown {
  from {
    transform: translateY(-108px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Sticky Form Layout */
.hero-section__booking-form--sticky .booking-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto; /* 4 inputs + 1 botão */
  gap: 1rem;
  max-width: 1200px; /* Mesmo max-width do header */
  margin: 0 auto; /* Centralizar como o header */
  padding: 0; /* Remover padding interno */
  align-items: center; /* Alinhar todos os elementos verticalmente */
}

.hero-section__booking-form--sticky .booking-form__submit {
  grid-column: 5; /* Posição específica do botão */
  min-width: auto;
  padding: 0.75rem 1.5rem; /* Mesmo padding do botão RESERVAR AGORA */
  height: auto; /* Altura automática como os inputs */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem; /* Mesmo tamanho de fonte */
  font-weight: 600; /* Mesmo peso da fonte */
  text-transform: uppercase; /* Mesmo estilo */
  letter-spacing: 0.05em; /* Mesmo espaçamento */
}

.booking-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.booking-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-form__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.booking-form__icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.booking-form__input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #111827;
  background: #ffffff;
  transition: all 150ms ease-in-out;
}

.booking-form__input:focus {
  outline: none;
  border-color: #1E3A8A;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.booking-form__guests,
.booking-form__rooms {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #111827;
  background: #ffffff;
  cursor: pointer;
  transition: all 150ms ease-in-out;
}

.booking-form__guests:hover,
.booking-form__rooms:hover {
  border-color: #1E3A8A;
}

.booking-form__submit {
  background: #1E3A8A;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  grid-column: 1 / -1;
  justify-self: center;
  min-width: 200px;
}

.booking-form__submit:hover {
  background: #1E3A8A;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-section__booking-form {
    max-width: 900px;
    width: 95%;
  }
  
  .hero-section__booking-form--sticky .booking-form {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .hero-section__booking-form {
    padding: 1.5rem;
    margin: 0 1rem;
    width: calc(100% - 2rem);
  }
  
  .hero-section__booking-form--sticky {
    top: 86px; /* Altura menor do header no mobile */
    padding: 0.75rem 1rem;
  }
  
  .hero-section__booking-form--sticky .booking-form {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .booking-form {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-form__submit {
    grid-column: 1;
    width: 100%;
  }
  
  .hero-section__booking-form--sticky .booking-form__submit {
    grid-column: 1 / -1;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-section__booking-form {
    padding: 1rem;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
  
  .hero-section__booking-form--sticky {
    top: 76px; /* Altura ainda menor no mobile pequeno */
    padding: 0.5rem;
  }
  
  .hero-section__booking-form--sticky .booking-form {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .hero-section__title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
