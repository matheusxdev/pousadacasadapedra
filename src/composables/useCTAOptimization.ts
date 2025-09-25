import { ref, computed, watch, readonly } from 'vue'

export interface CTAConfig {
  text: string
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  loading?: boolean
  disabled?: boolean
  pulse?: boolean
  glow?: boolean
  shadow?: boolean
}

export interface CTAOptimization {
  // Text variations based on context
  textVariations: {
    default: string
    urgency: string
    discount: string
    scarcity: string
    socialProof: string
  }
  
  // Color psychology
  colorScheme: {
    primary: string
    hover: string
    active: string
    shadow: string
  }
  
  // Animation settings
  animations: {
    pulse: boolean
    glow: boolean
    bounce: boolean
    shake: boolean
  }
  
  // Position and size
  positioning: {
    sticky: boolean
    floating: boolean
    size: 'sm' | 'md' | 'lg' | 'xl'
    position: 'bottom' | 'top' | 'center'
  }
  
  // Context awareness
  context: {
    hasDiscount: boolean
    hasUrgency: boolean
    hasScarcity: boolean
    hasSocialProof: boolean
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    userBehavior: 'firstVisit' | 'returning' | 'abandoned'
  }
}

export function useCTAOptimization(productId: string, context: Partial<CTAOptimization['context']> = {}) {
  // State
  const ctaState = ref<CTAConfig>({
    text: 'Reservar agora',
    variant: 'primary',
    size: 'lg',
    loading: false,
    disabled: false,
    pulse: false,
    glow: false,
    shadow: true
  })

  // Computed
  const optimizedText = computed(() => {
    const variations = {
      default: 'Reservar agora',
      urgency: 'Reservar antes que acabe!',
      discount: 'Aproveitar oferta',
      scarcity: 'Últimas vagas - Reservar',
      socialProof: 'Juntar-se a outros viajantes'
    }

    // Priority order: urgency > scarcity > discount > social proof > default
    if (context.hasUrgency) return variations.urgency
    if (context.hasScarcity) return variations.scarcity
    if (context.hasDiscount) return variations.discount
    if (context.hasSocialProof) return variations.socialProof
    
    // Time-based variations
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return 'Começar o dia com uma aventura'
    if (hour >= 12 && hour < 18) return 'Aproveitar a tarde'
    if (hour >= 18 && hour < 22) return 'Finalizar o dia em grande estilo'
    
    return variations.default
  })

  const optimizedVariant = computed(() => {
    // Color psychology based on context
    if (context.hasUrgency || context.hasScarcity) return 'danger' // Red for urgency
    if (context.hasDiscount) return 'success' // Green for savings
    if (context.hasSocialProof) return 'warning' // Orange for social proof
    
    return 'primary' // Default blue
  })

  const optimizedSize = computed(() => {
    // Size based on user behavior and context
    if (context.userBehavior === 'abandoned') return 'xl' // Larger for retargeting
    if (context.hasUrgency || context.hasScarcity) return 'lg' // Larger for urgency
    if (context.hasDiscount) return 'md' // Medium for offers
    
    return 'lg' // Default large
  })

  const animationConfig = computed(() => {
    return {
      pulse: context.hasUrgency || context.hasScarcity,
      glow: context.hasDiscount || context.hasSocialProof,
      bounce: context.userBehavior === 'firstVisit',
      shake: context.hasUrgency
    }
  })

  const colorScheme = computed(() => {
    const schemes = {
      primary: {
        primary: '#3b82f6',
        hover: '#2563eb',
        active: '#1d4ed8',
        shadow: 'rgba(59, 130, 246, 0.3)'
      },
      success: {
        primary: '#10b981',
        hover: '#059669',
        active: '#047857',
        shadow: 'rgba(16, 185, 129, 0.3)'
      },
      warning: {
        primary: '#f59e0b',
        hover: '#d97706',
        active: '#b45309',
        shadow: 'rgba(245, 158, 11, 0.3)'
      },
      danger: {
        primary: '#ef4444',
        hover: '#dc2626',
        active: '#b91c1c',
        shadow: 'rgba(239, 68, 68, 0.3)'
      }
    }
    
    return schemes[optimizedVariant.value]
  })

  // Methods
  const updateCTA = (newConfig: Partial<CTAConfig>) => {
    ctaState.value = { ...ctaState.value, ...newConfig }
  }

  const optimizeForContext = () => {
    updateCTA({
      text: optimizedText.value,
      variant: optimizedVariant.value,
      size: optimizedSize.value,
      pulse: animationConfig.value.pulse,
      glow: animationConfig.value.glow
    })
  }

  const getCTAProps = () => {
    return {
      class: [
        'cta-optimized',
        `cta-optimized--${ctaState.value.variant}`,
        `cta-optimized--${ctaState.value.size}`,
        {
          'cta-optimized--pulse': ctaState.value.pulse,
          'cta-optimized--glow': ctaState.value.glow,
          'cta-optimized--shadow': ctaState.value.shadow,
          'cta-optimized--loading': ctaState.value.loading,
          'cta-optimized--disabled': ctaState.value.disabled
        }
      ],
      style: {
        '--cta-primary': colorScheme.value.primary,
        '--cta-hover': colorScheme.value.hover,
        '--cta-active': colorScheme.value.active,
        '--cta-shadow': colorScheme.value.shadow
      }
    }
  }

  const getCTAContent = () => {
    return {
      text: ctaState.value.text,
      icon: ctaState.value.icon,
      loading: ctaState.value.loading
    }
  }

  const simulateClick = () => {
    // Simulate loading state
    updateCTA({ loading: true })
    
    setTimeout(() => {
      updateCTA({ loading: false })
    }, 2000)
  }

  const trackCTAInteraction = (action: 'view' | 'click' | 'hover') => {
    // Analytics tracking
    console.log(`CTA ${action}:`, {
      productId,
      text: ctaState.value.text,
      variant: ctaState.value.variant,
      context
    })
  }

  // Auto-optimize based on context changes
  watch(context, optimizeForContext, { immediate: true, deep: true })

  return {
    // State
    ctaState: readonly(ctaState),
    
    // Computed
    optimizedText,
    optimizedVariant,
    optimizedSize,
    animationConfig,
    colorScheme,
    
    // Methods
    updateCTA,
    optimizeForContext,
    getCTAProps,
    getCTAContent,
    simulateClick,
    trackCTAInteraction
  }
}
