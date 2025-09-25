import { ref, computed } from 'vue'

export interface PriceComparisonData {
  currentPrice: number
  originalPrice?: number
  seasonalVariation?: number
  lastMinuteDiscount?: number
  earlyBirdDiscount?: number
  groupDiscount?: number
  currency: string
}

export interface PriceComparisonResult {
  savings: number
  percentage: number
  reason: string
  urgency: 'low' | 'medium' | 'high'
  message: string
}

export const usePriceComparison = () => {
  const comparisonData = ref<PriceComparisonData | null>(null)
  const isLoading = ref(false)

  /**
   * Calcula comparação de preços baseada em diferentes fatores
   */
  const calculatePriceComparison = (data: PriceComparisonData): PriceComparisonResult => {
    const { currentPrice, originalPrice, seasonalVariation, lastMinuteDiscount, earlyBirdDiscount, groupDiscount } = data
    
    let savings = 0
    let percentage = 0
    let reason = ''
    let urgency: 'low' | 'medium' | 'high' = 'low'
    let message = ''

    // Comparar com preço original se disponível
    if (originalPrice && originalPrice > currentPrice) {
      savings = originalPrice - currentPrice
      percentage = Math.round((savings / originalPrice) * 100)
      reason = 'promoção_ativa'
      urgency = percentage > 30 ? 'high' : percentage > 15 ? 'medium' : 'low'
      message = `Você está economizando ${percentage}% com nossa promoção atual!`
    }
    // Comparar com variação sazonal
    else if (seasonalVariation && seasonalVariation > 0) {
      savings = seasonalVariation
      percentage = Math.round((savings / currentPrice) * 100)
      reason = 'baixa_temporada'
      urgency = percentage > 25 ? 'high' : percentage > 10 ? 'medium' : 'low'
      message = `Preço especial de baixa temporada! Economize ${percentage}%`
    }
    // Comparar com desconto de última hora
    else if (lastMinuteDiscount && lastMinuteDiscount > 0) {
      savings = lastMinuteDiscount
      percentage = Math.round((savings / currentPrice) * 100)
      reason = 'ultima_hora'
      urgency = 'high'
      message = `Desconto de última hora! Economize ${percentage}% reservando agora`
    }
    // Comparar com desconto antecipado
    else if (earlyBirdDiscount && earlyBirdDiscount > 0) {
      savings = earlyBirdDiscount
      percentage = Math.round((savings / currentPrice) * 100)
      reason = 'reserva_antecipada'
      urgency = 'medium'
      message = `Reserve com antecedência e economize ${percentage}%`
    }
    // Comparar com desconto de grupo
    else if (groupDiscount && groupDiscount > 0) {
      savings = groupDiscount
      percentage = Math.round((savings / currentPrice) * 100)
      reason = 'desconto_grupo'
      urgency = 'medium'
      message = `Desconto especial para grupos! Economize ${percentage}%`
    }
    // Preço padrão sem desconto significativo
    else {
      reason = 'preco_padrao'
      urgency = 'low'
      message = 'Preço competitivo para esta temporada'
    }

    return {
      savings,
      percentage,
      reason,
      urgency,
      message
    }
  }

  /**
   * Simula dados de comparação baseados no produto e data atual
   */
  const generateComparisonData = async (
    productId: string,
    currentPrice: number,
    participants: number,
    selectedDate?: string
  ): Promise<PriceComparisonData> => {
    isLoading.value = true

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      const now = new Date()
      const selectedDateObj = selectedDate ? new Date(selectedDate) : now
      const daysUntilTour = Math.ceil((selectedDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Calcular variações baseadas em diferentes fatores
      const seasonalMultiplier = getSeasonalMultiplier(selectedDateObj)
      const lastMinuteMultiplier = getLastMinuteMultiplier(daysUntilTour)
      const earlyBirdMultiplier = getEarlyBirdMultiplier(daysUntilTour)
      const groupMultiplier = getGroupMultiplier(participants)

      // Determinar qual desconto aplicar
      let appliedDiscount = 0
      let originalPrice = currentPrice

      if (lastMinuteMultiplier > 0 && daysUntilTour <= 3) {
        // Desconto de última hora
        appliedDiscount = currentPrice * lastMinuteMultiplier
        originalPrice = currentPrice + appliedDiscount
      } else if (earlyBirdMultiplier > 0 && daysUntilTour >= 30) {
        // Desconto antecipado
        appliedDiscount = currentPrice * earlyBirdMultiplier
        originalPrice = currentPrice + appliedDiscount
      } else if (seasonalMultiplier > 0) {
        // Variação sazonal
        appliedDiscount = currentPrice * seasonalMultiplier
        originalPrice = currentPrice + appliedDiscount
      } else if (groupMultiplier > 0) {
        // Desconto de grupo
        appliedDiscount = currentPrice * groupMultiplier
        originalPrice = currentPrice + appliedDiscount
      }

      return {
        currentPrice,
        originalPrice: originalPrice > currentPrice ? originalPrice : undefined,
        seasonalVariation: seasonalMultiplier > 0 ? appliedDiscount : undefined,
        lastMinuteDiscount: lastMinuteMultiplier > 0 && daysUntilTour <= 3 ? appliedDiscount : undefined,
        earlyBirdDiscount: earlyBirdMultiplier > 0 && daysUntilTour >= 30 ? appliedDiscount : undefined,
        groupDiscount: groupMultiplier > 0 ? appliedDiscount : undefined,
        currency: 'BRL'
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Calcula multiplicador sazonal baseado no mês
   */
  const getSeasonalMultiplier = (date: Date): number => {
    const month = date.getMonth() + 1 // 1-12
    
    // Alta temporada (dezembro, janeiro, julho)
    if (month === 12 || month === 1 || month === 7) {
      return 0 // Sem desconto na alta temporada
    }
    
    // Baixa temporada (março, abril, maio, setembro, outubro)
    if ([3, 4, 5, 9, 10].includes(month)) {
      return 0.2 // 20% de desconto
    }
    
    // Temporada média (fevereiro, junho, agosto, novembro)
    return 0.1 // 10% de desconto
  }

  /**
   * Calcula multiplicador de última hora baseado nos dias restantes
   */
  const getLastMinuteMultiplier = (daysUntilTour: number): number => {
    if (daysUntilTour <= 1) return 0.3 // 30% desconto
    if (daysUntilTour <= 2) return 0.2 // 20% desconto
    if (daysUntilTour <= 3) return 0.15 // 15% desconto
    return 0
  }

  /**
   * Calcula multiplicador de reserva antecipada baseado nos dias restantes
   */
  const getEarlyBirdMultiplier = (daysUntilTour: number): number => {
    if (daysUntilTour >= 90) return 0.25 // 25% desconto
    if (daysUntilTour >= 60) return 0.2 // 20% desconto
    if (daysUntilTour >= 30) return 0.15 // 15% desconto
    return 0
  }

  /**
   * Calcula multiplicador de grupo baseado no número de participantes
   */
  const getGroupMultiplier = (participants: number): number => {
    if (participants >= 8) return 0.2 // 20% desconto
    if (participants >= 6) return 0.15 // 15% desconto
    if (participants >= 4) return 0.1 // 10% desconto
    return 0
  }

  /**
   * Formata valor monetário
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  /**
   * Obtém ícone baseado no tipo de desconto
   */
  const getDiscountIcon = (reason: string): string => {
    switch (reason) {
      case 'promoção_ativa':
        return 'heroicons:tag'
      case 'baixa_temporada':
        return 'heroicons:sun'
      case 'ultima_hora':
        return 'heroicons:clock'
      case 'reserva_antecipada':
        return 'heroicons:calendar-days'
      case 'desconto_grupo':
        return 'heroicons:user-group'
      default:
        return 'heroicons:currency-dollar'
    }
  }

  /**
   * Obtém cor baseada na urgência
   */
  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high'): string => {
    switch (urgency) {
      case 'high':
        return '#dc2626' // Vermelho
      case 'medium':
        return '#ea580c' // Laranja
      case 'low':
        return '#059669' // Verde
      default:
        return '#6b7280' // Cinza
    }
  }

  return {
    comparisonData,
    isLoading,
    calculatePriceComparison,
    generateComparisonData,
    formatPrice,
    getDiscountIcon,
    getUrgencyColor
  }
}
