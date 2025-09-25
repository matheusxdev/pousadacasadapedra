import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'

export interface FacebookPixelEvent {
  event_name: string
  event_id?: string
  value?: number
  currency?: string
  content_type?: string
  content_ids?: string[]
  custom_data?: Record<string, any>
  user_data?: {
    em?: string // hashed email
    ph?: string // hashed phone
    fn?: string // hashed first name
    ln?: string // hashed last name
    ct?: string // hashed city
    country?: string // hashed country
  }
}

export interface ConversionData {
  event_name: string
  value: number
  currency: string
  content_ids: string[]
  content_type: string
  content_name?: string
  content_category?: string
  num_items?: number
  search_string?: string
  status?: string
}

export function useFacebookPixelOptimization() {
  // State
  const pixelLoaded = ref(false)
  const conversionEvents = ref<ConversionData[]>([])
  const userData = ref<Record<string, string>>({})
  const sessionEvents = ref<FacebookPixelEvent[]>([])

  // Computed
  const hasPixel = computed(() => {
    return typeof window !== 'undefined' && window.fbq && pixelLoaded.value
  })

  const totalConversions = computed(() => {
    return conversionEvents.value.length
  })

  const totalRevenue = computed(() => {
    return conversionEvents.value.reduce((total, event) => total + event.value, 0)
  })

  // Methods
  const initializePixel = () => {
    if (typeof window === 'undefined') return

    // Check if pixel is already loaded
    if (window.fbq && window.fbq.loaded) {
      pixelLoaded.value = true
      return
    }

    // Wait for pixel to load
    const checkPixel = () => {
      if (window.fbq && window.fbq.loaded) {
        pixelLoaded.value = true
        // console.log('✅ Facebook Pixel optimization initialized')
      } else {
        setTimeout(checkPixel, 100)
      }
    }

    checkPixel()
  }

  const hashData = (data: string): string => {
    // Simple hash function for demo purposes
    // In production, use proper SHA-256 hashing
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  const setUserData = (data: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    city?: string
    country?: string
  }) => {
    const hashedData: Record<string, string> = {}
    
    if (data.email) hashedData.em = hashData(data.email)
    if (data.phone) hashedData.ph = hashData(data.phone)
    if (data.firstName) hashedData.fn = hashData(data.firstName)
    if (data.lastName) hashedData.ln = hashData(data.lastName)
    if (data.city) hashedData.ct = hashData(data.city)
    if (data.country) hashedData.country = hashData(data.country)

    userData.value = { ...userData.value, ...hashedData }

    // Update pixel with new user data
    if (hasPixel.value) {
      const runtimeConfig = useRuntimeConfig()
      window.fbq('init', runtimeConfig.public.facebookPixelId, hashedData)
    }
  }

  const trackEvent = (event: FacebookPixelEvent) => {
    if (!hasPixel.value) {
      // console.warn('⚠️ Facebook Pixel not loaded')
      return
    }

    // Add user data to event
    const enhancedEvent = {
      ...event,
      user_data: { ...event.user_data, ...userData.value }
    }

    // Track the event
    window.fbq('track', event.event_name, enhancedEvent)
    
    // Store event for session tracking
    sessionEvents.value.push(enhancedEvent)

    // console.log('📊 Facebook Pixel event tracked:', event.event_name, enhancedEvent)
  }

  const trackCustomEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    trackEvent({
      event_name: eventName,
      custom_data: parameters
    })
  }

  // Enhanced Ecommerce Events
  const trackViewContent = (productData: {
    product_id: string
    product_name: string
    category: string
    price: number
    currency: string
    availability?: string
  }) => {
    const eventData: ConversionData = {
      event_name: 'ViewContent',
      value: productData.price,
      currency: productData.currency,
      content_ids: [productData.product_id],
      content_type: 'product',
      content_name: productData.product_name,
      content_category: productData.category,
      status: 'viewed'
    }

    trackEvent({
      event_name: 'ViewContent',
      value: productData.price,
      currency: productData.currency,
      content_type: 'product',
      content_ids: [productData.product_id],
      custom_data: {
        content_name: productData.product_name,
        content_category: productData.category,
        availability: productData.availability || 'in stock'
      }
    })

    conversionEvents.value.push(eventData)
  }

  const trackAddToCart = (cartData: {
    product_id: string
    product_name: string
    category: string
    price: number
    quantity: number
    currency: string
  }) => {
    const totalValue = cartData.price * cartData.quantity
    
    const eventData: ConversionData = {
      event_name: 'AddToCart',
      value: totalValue,
      currency: cartData.currency,
      content_ids: [cartData.product_id],
      content_type: 'product',
      content_name: cartData.product_name,
      content_category: cartData.category,
      num_items: cartData.quantity,
      status: 'added_to_cart'
    }

    trackEvent({
      event_name: 'AddToCart',
      value: totalValue,
      currency: cartData.currency,
      content_type: 'product',
      content_ids: [cartData.product_id],
      custom_data: {
        content_name: cartData.product_name,
        content_category: cartData.category,
        value: totalValue,
        currency: cartData.currency,
        num_items: cartData.quantity
      }
    })

    conversionEvents.value.push(eventData)
  }

  const trackPurchase = (purchaseData: {
    transaction_id: string
    value: number
    currency: string
    items: Array<{
      item_id: string
      item_name: string
      category: string
      price: number
      quantity: number
    }>
  }) => {
    const eventData: ConversionData = {
      event_name: 'Purchase',
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_ids: purchaseData.items.map(item => item.item_id),
      content_type: 'product',
      num_items: purchaseData.items.length,
      status: 'purchased'
    }

    trackEvent({
      event_name: 'Purchase',
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_type: 'product',
      content_ids: purchaseData.items.map(item => item.item_id),
      custom_data: {
        content_type: 'product',
        value: purchaseData.value,
        currency: purchaseData.currency,
        num_items: purchaseData.items.length,
        transaction_id: purchaseData.transaction_id
      }
    })

    conversionEvents.value.push(eventData)
  }

  const trackLead = (leadData: {
    lead_type: string
    value?: number
    currency?: string
    form_name?: string
  }) => {
    const eventData: ConversionData = {
      event_name: 'Lead',
      value: leadData.value || 0,
      currency: leadData.currency || 'BRL',
      content_ids: ['lead'],
      content_type: 'lead',
      content_name: leadData.lead_type,
      status: 'lead_generated'
    }

    trackEvent({
      event_name: 'Lead',
      value: leadData.value,
      currency: leadData.currency,
      custom_data: {
        content_name: leadData.lead_type,
        content_category: 'lead_generation',
        form_name: leadData.form_name
      }
    })

    conversionEvents.value.push(eventData)
  }

  const trackSearch = (searchData: {
    search_string: string
    results_count?: number
    category?: string
  }) => {
    trackEvent({
      event_name: 'Search',
      custom_data: {
        search_string: searchData.search_string,
        results_count: searchData.results_count || 0,
        content_category: searchData.category || 'general'
      }
    })
  }

  const trackCompleteRegistration = (registrationData: {
    registration_method?: string
    value?: number
    currency?: string
  }) => {
    trackEvent({
      event_name: 'CompleteRegistration',
      value: registrationData.value,
      currency: registrationData.currency,
      custom_data: {
        registration_method: registrationData.registration_method || 'email'
      }
    })
  }

  // Advanced Tracking
  const trackMicroConversions = () => {
    // Track page engagement milestones
    const trackEngagement = (milestone: string, data: Record<string, any> = {}) => {
      trackCustomEvent('Engagement', {
        engagement_type: milestone,
        ...data
      })
    }

    // Track scroll depth
    let maxScroll = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        const milestones = [25, 50, 75, 90, 100]
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone) {
            trackEngagement('scroll_depth', {
              scroll_depth: milestone,
              page_url: window.location.href
            })
          }
        })
      }
    }

    // Track time on page
    let startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      const milestones = [30, 60, 120, 300, 600]
      
      milestones.forEach(milestone => {
        if (timeOnPage === milestone) {
          trackEngagement('time_on_page', {
            time_on_page: milestone,
            page_url: window.location.href
          })
        }
      })
    }

    // Track user interactions
    let interactionCount = 0
    const trackInteraction = () => {
      interactionCount++
      trackEngagement('user_interaction', {
        interaction_count: interactionCount,
        page_url: window.location.href
      })
    }

    // Track exit intent
    let exitIntentTriggered = false
    const trackExitIntent = (event: MouseEvent) => {
      if (exitIntentTriggered) return
      
      if (event.clientY <= 0) {
        exitIntentTriggered = true
        trackEngagement('exit_intent', {
          page_url: window.location.href,
          time_on_page: Math.round((Date.now() - startTime) / 1000)
        })
      }
    }

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    window.addEventListener('click', trackInteraction)
    window.addEventListener('keydown', trackInteraction)
    window.addEventListener('mouseleave', trackExitIntent)
    
    // Track time milestones every second
    const timeInterval = setInterval(trackTimeOnPage, 1000)

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      window.removeEventListener('click', trackInteraction)
      window.removeEventListener('keydown', trackInteraction)
      window.removeEventListener('mouseleave', trackExitIntent)
      clearInterval(timeInterval)
    }
  }

  // Conversion Optimization
  const optimizeForConversions = () => {
    // Track high-intent actions
    const trackHighIntentActions = () => {
      // Track form field interactions
      document.addEventListener('focus', (event) => {
        const target = event.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          const inputElement = target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          trackCustomEvent('FormFieldFocus', {
            field_type: target.tagName.toLowerCase(),
            field_name: inputElement.name || inputElement.id || 'unknown',
            page_url: window.location.href
          })
        }
      })

      // Track form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement
        trackCustomEvent('FormSubmit', {
          form_name: form.name || form.id || 'unknown',
          page_url: window.location.href
        })
      })

      // Track button clicks
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
          const buttonText = target.textContent?.trim() || ''
          const buttonClass = target.className || ''
          
          // Track CTA buttons specifically
          if (buttonText.toLowerCase().includes('reservar') || 
              buttonText.toLowerCase().includes('comprar') ||
              buttonText.toLowerCase().includes('agendar') ||
              buttonClass.includes('cta') ||
              buttonClass.includes('button')) {
            trackCustomEvent('CTAClick', {
              button_text: buttonText,
              button_class: buttonClass,
              page_url: window.location.href
            })
          }
        }
      })
    }

    trackHighIntentActions()
  }

  // Lifecycle
  onMounted(() => {
    initializePixel()
    
    // Start micro-conversion tracking
    const cleanup = trackMicroConversions()
    
    // Start conversion optimization
    optimizeForConversions()
    
    onUnmounted(() => {
      cleanup()
    })
  })

  return {
    // State
    pixelLoaded: readonly(pixelLoaded),
    conversionEvents: readonly(conversionEvents),
    userData: readonly(userData),
    sessionEvents: readonly(sessionEvents),
    
    // Computed
    hasPixel,
    totalConversions,
    totalRevenue,
    
    // Methods
    setUserData,
    trackEvent,
    trackCustomEvent,
    trackViewContent,
    trackAddToCart,
    trackPurchase,
    trackLead,
    trackSearch,
    trackCompleteRegistration,
    trackMicroConversions,
    optimizeForConversions
  }
}

// Global type declarations
declare global {
  interface Window {
    fbq: any
  }
}
