import { ref, computed, watch, onMounted, onUnmounted, readonly } from 'vue'

export interface ExitIntentData {
  hasShownPopup: boolean
  userEngagement: 'low' | 'medium' | 'high'
  timeOnPage: number
  scrollDepth: number
  interactions: number
  lastInteraction: number
}

export interface ExitOffer {
  type: 'discount' | 'bonus' | 'urgency' | 'social_proof'
  title: string
  description: string
  value: string
  cta: string
  validUntil?: Date
  conditions?: readonly string[]
}

export function useExitIntent(productId: string) {
  // State
  const exitIntentData = ref<ExitIntentData>({
    hasShownPopup: false,
    userEngagement: 'low',
    timeOnPage: 0,
    scrollDepth: 0,
    interactions: 0,
    lastInteraction: Date.now()
  })

  const showExitPopup = ref(false)
  const exitOffer = ref<ExitOffer | null>(null)
  const mouseLeaveTimer = ref<NodeJS.Timeout | null>(null)
  
  // Tracking variables
  const startTime = ref(Date.now())
  const maxScroll = ref(0)
  const interactionCount = ref(0)

  // Computed
  const shouldShowExitIntent = computed(() => {
    // Don't show if already shown or user is highly engaged
    if (exitIntentData.value.hasShownPopup || exitIntentData.value.userEngagement === 'high') {
      return false
    }

    // Show if user has been on page for at least 30 seconds
    // and has scrolled at least 25% of the page
    return exitIntentData.value.timeOnPage >= 30000 && 
           exitIntentData.value.scrollDepth >= 25 &&
           exitIntentData.value.interactions <= 2
  })

  const generateExitOffer = (): ExitOffer => {
    const offers: ExitOffer[] = [
      {
        type: 'discount',
        title: 'Espera! Temos uma oferta especial para você',
        description: 'Receba um desconto exclusivo para finalizar sua reserva hoje',
        value: '5% de desconto',
        cta: 'Aproveitar desconto',
        validUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        conditions: ['Válido por 30 minutos', 'Apenas para esta sessão']
      },
      {
        type: 'bonus',
        title: 'Não perca! Incluímos um bônus especial',
        description: 'Reserve agora e ganhe um upgrade gratuito ou serviço extra',
        value: 'Bônus incluído',
        cta: 'Reservar com bônus',
        validUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        conditions: ['Válido por 15 minutos', 'Apenas para novos clientes']
      },
      {
        type: 'urgency',
        title: 'Última chance! Preços aumentam em breve',
        description: 'Este é seu último momento para garantir o preço atual',
        value: 'Preço atual garantido',
        cta: 'Garantir preço',
        validUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        conditions: ['Válido por 10 minutos', 'Preços podem aumentar']
      },
      {
        type: 'social_proof',
        title: 'Outras pessoas estão reservando agora!',
        description: 'Junte-se a outros viajantes que acabaram de fazer sua reserva',
        value: 'Oferta popular',
        cta: 'Reservar agora',
        validUntil: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
        conditions: ['Válido por 20 minutos', 'Oferta limitada']
      }
    ]

    // Select offer based on user engagement
    if (exitIntentData.value.userEngagement === 'low') {
      return offers[0] // Discount for low engagement
    } else if (exitIntentData.value.timeOnPage < 60000) { // Less than 1 minute
      return offers[2] // Urgency for quick exits
    } else {
      return offers[Math.floor(Math.random() * offers.length)]
    }
  }

  // Methods
  const trackInteraction = () => {
    interactionCount.value++
    exitIntentData.value.interactions = interactionCount.value
    exitIntentData.value.lastInteraction = Date.now()
    
    // Update engagement level
    if (interactionCount.value >= 5) {
      exitIntentData.value.userEngagement = 'high'
    } else if (interactionCount.value >= 2) {
      exitIntentData.value.userEngagement = 'medium'
    }
  }

  const trackScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100
    
    maxScroll.value = Math.max(maxScroll.value, scrollPercent)
    exitIntentData.value.scrollDepth = Math.round(maxScroll.value)
  }

  const updateTimeOnPage = () => {
    exitIntentData.value.timeOnPage = Date.now() - startTime.value
  }

  const handleMouseLeave = (event: MouseEvent) => {
    // Only trigger if mouse is leaving from the top of the page
    if (event.clientY <= 0 && shouldShowExitIntent.value) {
      showExitPopup.value = true
      exitOffer.value = generateExitOffer()
      exitIntentData.value.hasShownPopup = true
      
      // Track the exit intent event
      console.log('Exit intent detected:', {
        productId,
        timeOnPage: exitIntentData.value.timeOnPage,
        scrollDepth: exitIntentData.value.scrollDepth,
        engagement: exitIntentData.value.userEngagement
      })
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    // Track mouse movement as interaction
    if (event.clientY <= 100) { // Top 100px of page
      trackInteraction()
    }
  }

  const closeExitPopup = () => {
    showExitPopup.value = false
    exitOffer.value = null
  }

  const acceptOffer = () => {
    // Track offer acceptance
    console.log('Exit offer accepted:', {
      productId,
      offerType: exitOffer.value?.type,
      offerValue: exitOffer.value?.value
    })
    
    // Close popup and redirect to booking
    closeExitPopup()
    
    // Could implement actual discount logic here
    // For now, just scroll to booking section
    const bookingSection = document.getElementById('booking')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const declineOffer = () => {
    // Track offer decline
    console.log('Exit offer declined:', {
      productId,
      offerType: exitOffer.value?.type
    })
    
    closeExitPopup()
  }

  // Lifecycle
  onMounted(() => {
    // Start time tracking
    startTime.value = Date.now()
    
    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', trackScroll)
    document.addEventListener('click', trackInteraction)
    document.addEventListener('keydown', trackInteraction)
    
    // Update time every second
    const timeInterval = setInterval(updateTimeOnPage, 1000)
    
    // Cleanup function
    onUnmounted(() => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', trackScroll)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('keydown', trackInteraction)
      clearInterval(timeInterval)
    })
  })

  return {
    // State
    showExitPopup: readonly(showExitPopup),
    exitOffer: readonly(exitOffer),
    exitIntentData: readonly(exitIntentData),
    
    // Computed
    shouldShowExitIntent,
    
    // Methods
    closeExitPopup,
    acceptOffer,
    declineOffer,
    trackInteraction,
    trackScroll
  }
}
