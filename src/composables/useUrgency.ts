import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'

export interface UrgencyData {
  lastSpots?: number
  timerExpiry?: string
  viewersCount?: number
  priceIncreaseTime?: string
  bookingCount?: number
  lastBookingTime?: string
}

export interface UrgencyDisplay {
  type: 'last_spots' | 'timer' | 'viewers' | 'price_increase' | 'booking_count'
  message: string
  urgency: 'low' | 'medium' | 'high'
  expiresAt?: string
}

export function useUrgency(productId?: string) {
  const urgencyData = ref<UrgencyData>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Simular dados de urgência
  const generateUrgencyData = (productId: string): UrgencyData => {
    const now = new Date()
    
    // Últimas vagas (70% chance de ter)
    const lastSpots = Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : undefined
    
    // Timer de expiração (30% chance de ter)
    const timerExpiry = Math.random() > 0.7 
      ? new Date(now.getTime() + (Math.random() * 24 + 1) * 60 * 60 * 1000).toISOString()
      : undefined
    
    // Visualizadores atuais (sempre presente)
    const viewersCount = Math.floor(Math.random() * 15) + 1
    
    // Aumento de preço (20% chance)
    const priceIncreaseTime = Math.random() > 0.8
      ? new Date(now.getTime() + (Math.random() * 48 + 24) * 60 * 60 * 1000).toISOString()
      : undefined
    
    // Contagem de reservas esta semana
    const bookingCount = Math.floor(Math.random() * 25) + 5
    
    // Última reserva
    const lastBookingTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString()

    return {
      lastSpots,
      timerExpiry,
      viewersCount,
      priceIncreaseTime,
      bookingCount,
      lastBookingTime
    }
  }

  // Carregar dados de urgência
  const loadUrgencyData = async (productId: string): Promise<UrgencyData> => {
    loading.value = true
    error.value = null

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const data = generateUrgencyData(productId)
      urgencyData.value = data
      
      return data
    } catch (err) {
      error.value = 'Erro ao carregar dados de urgência'
      console.error('Urgency data error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Gerar mensagens de urgência
  const generateUrgencyMessages = (data: UrgencyData): UrgencyDisplay[] => {
    const messages: UrgencyDisplay[] = []

    // Últimas vagas
    if (data.lastSpots && data.lastSpots <= 5) {
      messages.push({
        type: 'last_spots',
        message: `Últimas ${data.lastSpots} vagas disponíveis!`,
        urgency: data.lastSpots <= 2 ? 'high' : 'medium'
      })
    }

    // Timer de expiração
    if (data.timerExpiry) {
      const timeLeft = getTimeLeft(data.timerExpiry)
      if (timeLeft.total > 0) {
        messages.push({
          type: 'timer',
          message: `Oferta expira em ${formatTimeLeft(timeLeft)}`,
          urgency: timeLeft.hours < 6 ? 'high' : timeLeft.hours < 12 ? 'medium' : 'low',
          expiresAt: data.timerExpiry
        })
      }
    }

    // Visualizadores
    if (data.viewersCount && data.viewersCount > 5) {
      messages.push({
        type: 'viewers',
        message: `${data.viewersCount} pessoas estão vendo este tour agora`,
        urgency: data.viewersCount > 10 ? 'medium' : 'low'
      })
    }

    // Aumento de preço
    if (data.priceIncreaseTime) {
      const timeLeft = getTimeLeft(data.priceIncreaseTime)
      if (timeLeft.total > 0) {
        messages.push({
          type: 'price_increase',
          message: `Preço aumenta em ${formatTimeLeft(timeLeft)}`,
          urgency: timeLeft.hours < 24 ? 'high' : 'medium',
          expiresAt: data.priceIncreaseTime
        })
      }
    }

    // Contagem de reservas
    if (data.bookingCount && data.bookingCount > 10) {
      messages.push({
        type: 'booking_count',
        message: `Reservado ${data.bookingCount} vezes esta semana`,
        urgency: data.bookingCount > 20 ? 'medium' : 'low'
      })
    }

    return messages
  }

  // Calcular tempo restante
  const getTimeLeft = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const total = expiry.getTime() - now.getTime()

    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((total % (1000 * 60)) / 1000)

    return { total, days, hours, minutes, seconds }
  }

  // Formatar tempo restante
  const formatTimeLeft = (timeLeft: ReturnType<typeof getTimeLeft>): string => {
    if (timeLeft.total <= 0) return 'Expirado'

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`
    }
  }

  // Atualizar timer em tempo real
  const updateTimer = () => {
    if (urgencyData.value.timerExpiry) {
      const timeLeft = getTimeLeft(urgencyData.value.timerExpiry)
      if (timeLeft.total <= 0) {
        // Timer expirou, remover
        urgencyData.value.timerExpiry = undefined
      }
    }
  }

  // Auto-refresh dos dados
  let refreshInterval: NodeJS.Timeout | null = null

  const startAutoRefresh = () => {
    refreshInterval = setInterval(() => {
      updateTimer()
    }, 1000) // Atualizar a cada segundo
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Computed properties
  const urgencyMessages = computed(() => {
    return generateUrgencyMessages(urgencyData.value)
  })

  const hasHighUrgency = computed(() => {
    return urgencyMessages.value.some(msg => msg.urgency === 'high')
  })

  const hasMediumUrgency = computed(() => {
    return urgencyMessages.value.some(msg => msg.urgency === 'medium')
  })

  const hasAnyUrgency = computed(() => {
    return urgencyMessages.value.length > 0
  })

  // Lifecycle
  onMounted(() => {
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  // Computed properties para compatibilidade com o componente
  const timeLeft = computed(() => {
    if (!urgencyData.value.timerExpiry) return 0
    const expiryTime = new Date(urgencyData.value.timerExpiry).getTime()
    const now = Date.now()
    const remaining = expiryTime - now
    return Math.max(0, Math.floor(remaining / 1000))
  })

  const hasTimer = computed(() => {
    return urgencyData.value.timerExpiry && timeLeft.value > 0
  })

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return {
    // State
    urgencyData: readonly(urgencyData),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    urgencyMessages,
    hasHighUrgency,
    hasMediumUrgency,
    hasAnyUrgency,
    timeLeft: readonly(timeLeft),
    hasTimer: readonly(hasTimer),

    // Methods
    loadUrgencyData,
    generateUrgencyMessages,
    getTimeLeft,
    formatTimeLeft,
    formatTime,
    updateTimer,
    startAutoRefresh,
    stopAutoRefresh
  }
}
