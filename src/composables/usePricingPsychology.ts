import { ref, computed, watch, type Ref, readonly } from 'vue'

export interface PricingData {
  originalPrice: number
  currentPrice: number
  discount?: number
  currency: string
  unit?: 'per_person' | 'per_hour' | 'per_day' | 'total'
  comparisonPrices?: {
    competitor?: number
    marketAverage?: number
    lastMonth?: number
  }
}

export interface PricingPsychology {
  // Anchoring
  anchorPrice: number
  anchorVisible: boolean
  
  // Comparison
  savingsAmount: number
  savingsPercentage: number
  comparisonText: string
  
  // Value indicators
  pricePerPerson: number
  pricePerHour: number
  valueIndicators: string[]
  
  // Scarcity
  limitedTimeOffer: boolean
  priceIncrease: boolean
  lastChance: boolean
}

export function usePricingPsychology(productId: string, pricingData: Ref<PricingData>) {
  // State
  const psychology = ref<PricingPsychology>({
    anchorPrice: 0,
    anchorVisible: false,
    savingsAmount: 0,
    savingsPercentage: 0,
    comparisonText: '',
    pricePerPerson: 0,
    pricePerHour: 0,
    valueIndicators: [],
    limitedTimeOffer: false,
    priceIncrease: false,
    lastChance: false
  })

  // Computed
  const hasDiscount = computed(() => {
    return pricingData.value.currentPrice < pricingData.value.originalPrice
  })

  const discountPercentage = computed(() => {
    if (!hasDiscount.value) return 0
    return Math.round(((pricingData.value.originalPrice - pricingData.value.currentPrice) / pricingData.value.originalPrice) * 100)
  })

  const savingsAmount = computed(() => {
    return pricingData.value.originalPrice - pricingData.value.currentPrice
  })

  const anchorEffectiveness = computed(() => {
    // Higher original price creates stronger anchor
    const ratio = pricingData.value.originalPrice / pricingData.value.currentPrice
    return ratio > 1.5 // Only show anchor if original is 50%+ higher
  })

  const valueIndicators = computed(() => {
    const indicators: string[] = []
    const price = pricingData.value.currentPrice

    if (pricingData.value.unit === 'per_person') {
      indicators.push(`R$ ${price.toFixed(0)} por pessoa`)
    }

    if (pricingData.value.unit === 'per_hour') {
      indicators.push(`R$ ${price.toFixed(0)} por hora`)
    }

    if (pricingData.value.unit === 'per_day') {
      indicators.push(`R$ ${price.toFixed(0)} por dia`)
    }

    // Add value comparisons - only show if we have real data
    if (pricingData.value.comparisonPrices?.competitor && pricingData.value.comparisonPrices.competitor > 0) {
      const competitor = pricingData.value.comparisonPrices.competitor
      if (price < competitor && competitor > 0) {
        const savings = ((competitor - price) / competitor) * 100
        // Only show if it's a reasonable savings (5-25%)
        if (savings >= 5 && savings <= 25) {
          indicators.push(`${Math.round(savings)}% mais barato`)
        }
      }
    }

    return indicators
  })

  const comparisonTexts = computed(() => {
    const texts: string[] = []
    
    if (hasDiscount.value) {
      texts.push(`Economize R$ ${savingsAmount.value.toFixed(0)}`)
      texts.push(`${discountPercentage.value}% de desconto`)
    }

    // Only show real, verifiable comparisons
    if (pricingData.value.comparisonPrices?.lastMonth && pricingData.value.comparisonPrices.lastMonth > 0) {
      const lastMonth = pricingData.value.comparisonPrices.lastMonth
      if (pricingData.value.currentPrice < lastMonth) {
        const decrease = ((lastMonth - pricingData.value.currentPrice) / lastMonth) * 100
        // Only show reasonable decreases (5-20%)
        if (decrease >= 5 && decrease <= 20) {
          texts.push(`${Math.round(decrease)}% mais barato que no mês passado`)
        }
      }
    }

    return texts
  })

  // Methods
  const generateAnchorPrice = () => {
    if (!hasDiscount.value) return pricingData.value.currentPrice
    
    // Generate a realistic anchor price (20-50% higher)
    const multiplier = 1.2 + Math.random() * 0.3
    return Math.round(pricingData.value.originalPrice * multiplier)
  }

  const updatePsychology = () => {
    psychology.value = {
      anchorPrice: generateAnchorPrice(),
      anchorVisible: anchorEffectiveness.value,
      savingsAmount: savingsAmount.value,
      savingsPercentage: discountPercentage.value,
      comparisonText: comparisonTexts.value[0] || '',
      pricePerPerson: pricingData.value.unit === 'per_person' ? pricingData.value.currentPrice : 0,
      pricePerHour: pricingData.value.unit === 'per_hour' ? pricingData.value.currentPrice : 0,
      valueIndicators: valueIndicators.value,
      limitedTimeOffer: Math.random() > 0.7, // 30% chance
      priceIncrease: Math.random() > 0.8, // 20% chance
      lastChance: Math.random() > 0.9 // 10% chance
    }
  }

  const getUrgencyMessage = () => {
    if (psychology.value.lastChance) {
      return 'Última chance! Preço volta ao normal em breve.'
    }
    if (psychology.value.priceIncrease) {
      return 'Preço aumenta em 24h! Reserve agora.'
    }
    if (psychology.value.limitedTimeOffer) {
      return 'Oferta por tempo limitado!'
    }
    return ''
  }

  const getDiscountBadge = () => {
    if (!hasDiscount.value) return null
    
    const percentage = discountPercentage.value
    if (percentage >= 50) return { text: 'MEGA OFERTA', color: 'red' }
    if (percentage >= 30) return { text: 'SUPER DESCONTO', color: 'orange' }
    if (percentage >= 20) return { text: 'ÓTIMO DESCONTO', color: 'green' }
    return { text: 'DESCONTO', color: 'blue' }
  }

  const getPriceColor = () => {
    if (psychology.value.lastChance) return '#ef4444' // Red
    if (psychology.value.priceIncrease) return '#f59e0b' // Amber
    if (hasDiscount.value) return '#10b981' // Green
    return '#374151' // Gray
  }

  const getSavingsHighlight = () => {
    if (!hasDiscount.value) return null
    
    const savings = savingsAmount.value
    if (savings >= 100) return { text: `Economize R$ ${savings.toFixed(0)}`, emphasis: 'high' }
    if (savings >= 50) return { text: `Economize R$ ${savings.toFixed(0)}`, emphasis: 'medium' }
    return { text: `Economize R$ ${savings.toFixed(0)}`, emphasis: 'low' }
  }

  // Watch for pricing changes
  watch(pricingData, updatePsychology, { immediate: true, deep: true })

  return {
    // State
    psychology: readonly(psychology),
    
    // Computed
    hasDiscount,
    discountPercentage,
    savingsAmount,
    anchorEffectiveness,
    valueIndicators,
    comparisonTexts,
    
    // Methods
    getUrgencyMessage,
    getDiscountBadge,
    getPriceColor,
    getSavingsHighlight,
    updatePsychology
  }
}
