import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'

export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

export interface ConversionEvent {
  event_name: string
  event_id: string
  value?: number
  currency?: string
  content_type?: string
  content_ids?: string[]
  custom_data?: Record<string, any>
}

export interface UserProperties {
  user_id?: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  city?: string
  country?: string
  language?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  os?: string
}

export interface EnhancedEcommerceData {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>
  user_data?: UserProperties
}

export function useAnalytics() {
  // State
  const isGTMLoaded = ref(false)
  const isPixelLoaded = ref(false)
  const userProperties = ref<UserProperties>({})
  const sessionData = ref({
    session_id: '',
    page_views: 0,
    time_on_page: 0,
    scroll_depth: 0,
    interactions: 0
  })

  // Computed
  const isAnalyticsReady = computed(() => isGTMLoaded.value && isPixelLoaded.value)
  
  const deviceInfo = computed(() => {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)
    
    return {
      device_type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      browser: getBrowserName(userAgent),
      os: getOSName(userAgent)
    }
  })

  // Methods
  const getBrowserName = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  const getOSName = (userAgent: string): string => {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  const initializeGTM = () => {
    if (typeof window === 'undefined') return

    // Get runtime config first
    const runtimeConfig = useRuntimeConfig()
    
    // Skip if GTM ID is not configured or is placeholder
    if (!runtimeConfig.public.gtmId || runtimeConfig.public.gtmId === 'GTM-XXXXXXX' || runtimeConfig.public.gtmId === 'null') {
      return
    }

    // Check if GTM is already loaded
    if (window.dataLayer) {
      isGTMLoaded.value = true
      return
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // GTM configuration
    const gtmConfig = {
      gtm_id: runtimeConfig.public.gtmId,
      gtm_auth: runtimeConfig.public.gtmAuth,
      gtm_preview: runtimeConfig.public.gtmPreview
    }

    // Push initial configuration
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
      ...gtmConfig
    })

    // Load GTM script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmConfig.gtm_id}`
    
    script.onload = () => {
      isGTMLoaded.value = true
      // console.log('✅ Google Tag Manager loaded successfully')
    }
    
    script.onerror = () => {
      // console.error('❌ Failed to load Google Tag Manager')
    }

    document.head.appendChild(script)

    // Add GTM noscript fallback
    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmConfig.gtm_id}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.insertBefore(noscript, document.body.firstChild)
  }

  const initializeFacebookPixel = () => {
    if (typeof window === 'undefined') return

    const runtimeConfig = useRuntimeConfig()
    const pixelId = runtimeConfig.public.facebookPixelId

    // Skip if Facebook Pixel ID is not configured or is placeholder
    if (!pixelId || pixelId === 'YOUR_PIXEL_ID' || pixelId === 'null') {
      return
    }

    // Check if Pixel is already loaded
    if (window.fbq) {
      isPixelLoaded.value = true
      return
    }

    // Initialize fbq function
    window.fbq = function() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)
    }

    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []

    // Load Pixel script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://connect.facebook.net/en_US/fbevents.js`
    
    script.onload = () => {
      // Initialize Pixel
      window.fbq('init', pixelId)
      window.fbq('track', 'PageView')
      isPixelLoaded.value = true
      // console.log('✅ Facebook Pixel loaded successfully')
    }
    
    script.onerror = () => {
      // console.error('❌ Failed to load Facebook Pixel')
    }

    document.head.appendChild(script)
  }

  const trackGTMEvent = (eventData: AnalyticsEvent) => {
    if (!isGTMLoaded.value) return

    const enhancedEvent = {
      event: eventData.event,
      event_category: eventData.category,
      event_action: eventData.action,
      event_label: eventData.label,
      value: eventData.value,
      ...eventData.custom_parameters,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      user_agent: navigator.userAgent,
      ...deviceInfo.value
    }

    window.dataLayer.push(enhancedEvent)
    
    if (process.env.NODE_ENV === 'development') {
      // console.log('📊 GTM Event:', enhancedEvent)
    }
  }

  const trackFacebookEvent = (eventData: ConversionEvent) => {
    if (!isPixelLoaded.value) return

    const enhancedEvent = {
      ...eventData,
      source_url: window.location.href,
      ...deviceInfo.value
    }

    window.fbq('track', eventData.event_name, enhancedEvent)
    
    if (process.env.NODE_ENV === 'development') {
      // console.log('📊 Facebook Event:', enhancedEvent)
    }
  }

  const trackPageView = (pageName?: string) => {
    const pageData = {
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_name: pageName || document.title,
      timestamp: new Date().toISOString(),
      ...deviceInfo.value
    }

    // GTM Page View
    trackGTMEvent({
      event: 'page_view',
      category: 'Navigation',
      action: 'Page View',
      label: pageName || document.title,
      custom_parameters: pageData
    })

    // Facebook Pixel Page View
    trackFacebookEvent({
      event_name: 'PageView',
      event_id: generateEventId(),
      custom_data: pageData
    })

    // Update session data
    sessionData.value.page_views++
  }

  const trackProductView = (productData: {
    product_id: string
    product_name: string
    category: string
    price: number
    currency: string
    image_url?: string
    description?: string
  }) => {
    // GTM Enhanced Ecommerce - View Item
    trackGTMEvent({
      event: 'view_item',
      category: 'Ecommerce',
      action: 'View Item',
      label: productData.product_name,
      value: productData.price,
      custom_parameters: {
        ecommerce: {
          currency: productData.currency,
          value: productData.price,
          items: [{
            item_id: productData.product_id,
            item_name: productData.product_name,
            item_category: productData.category,
            price: productData.price,
            quantity: 1
          }]
        }
      }
    })

    // Facebook Pixel - ViewContent
    trackFacebookEvent({
      event_name: 'ViewContent',
      event_id: generateEventId(),
      value: productData.price,
      currency: productData.currency,
      content_type: 'product',
      content_ids: [productData.product_id],
      custom_data: {
        content_name: productData.product_name,
        content_category: productData.category,
        content_type: 'product'
      }
    })
  }

  const trackAddToCart = (productData: {
    product_id: string
    product_name: string
    category: string
    price: number
    quantity: number
    currency: string
  }) => {
    const totalValue = productData.price * productData.quantity

    // GTM Enhanced Ecommerce - Add to Cart
    trackGTMEvent({
      event: 'add_to_cart',
      category: 'Ecommerce',
      action: 'Add to Cart',
      label: productData.product_name,
      value: totalValue,
      custom_parameters: {
        ecommerce: {
          currency: productData.currency,
          value: totalValue,
          items: [{
            item_id: productData.product_id,
            item_name: productData.product_name,
            item_category: productData.category,
            price: productData.price,
            quantity: productData.quantity
          }]
        }
      }
    })

    // Facebook Pixel - AddToCart
    trackFacebookEvent({
      event_name: 'AddToCart',
      event_id: generateEventId(),
      value: totalValue,
      currency: productData.currency,
      content_type: 'product',
      content_ids: [productData.product_id],
      custom_data: {
        content_name: productData.product_name,
        content_category: productData.category,
        value: totalValue,
        currency: productData.currency
      }
    })
  }

  const trackPurchase = (purchaseData: EnhancedEcommerceData) => {
    // GTM Enhanced Ecommerce - Purchase
    trackGTMEvent({
      event: 'purchase',
      category: 'Ecommerce',
      action: 'Purchase',
      label: `Transaction ${purchaseData.transaction_id}`,
      value: purchaseData.value,
      custom_parameters: {
        ecommerce: {
          transaction_id: purchaseData.transaction_id,
          value: purchaseData.value,
          currency: purchaseData.currency,
          items: purchaseData.items
        }
      }
    })

    // Facebook Pixel - Purchase
    trackFacebookEvent({
      event_name: 'Purchase',
      event_id: generateEventId(),
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_type: 'product',
      content_ids: purchaseData.items.map(item => item.item_id),
      custom_data: {
        content_type: 'product',
        value: purchaseData.value,
        currency: purchaseData.currency,
        num_items: purchaseData.items.length
      }
    })
  }

  const trackLead = (leadData: {
    lead_type: 'contact' | 'newsletter' | 'quote' | 'booking'
    value?: number
    currency?: string
    form_name?: string
  }) => {
    // GTM Lead Event
    trackGTMEvent({
      event: 'generate_lead',
      category: 'Lead Generation',
      action: 'Lead Generated',
      label: leadData.lead_type,
      value: leadData.value,
      custom_parameters: {
        lead_type: leadData.lead_type,
        form_name: leadData.form_name
      }
    })

    // Facebook Pixel - Lead
    trackFacebookEvent({
      event_name: 'Lead',
      event_id: generateEventId(),
      value: leadData.value,
      currency: leadData.currency,
      custom_data: {
        content_name: leadData.lead_type,
        content_category: 'lead_generation'
      }
    })
  }

  const trackCustomEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    // GTM Custom Event
    trackGTMEvent({
      event: eventName,
      category: 'Custom',
      action: eventName,
      custom_parameters: parameters
    })

    // Facebook Pixel Custom Event
    trackFacebookEvent({
      event_name: eventName,
      event_id: generateEventId(),
      custom_data: parameters
    })
  }

  const setUserProperties = (properties: UserProperties) => {
    userProperties.value = { ...userProperties.value, ...properties }

    // GTM User Properties
    if (isGTMLoaded.value) {
      window.dataLayer.push({
        event: 'user_properties',
        user_properties: userProperties.value
      })
    }

    // Facebook Pixel User Properties
    if (isPixelLoaded.value && properties.user_id) {
      window.fbq('init', process.env.FACEBOOK_PIXEL_ID, {
        em: properties.email,
        ph: properties.phone,
        fn: properties.first_name,
        ln: properties.last_name,
        ct: properties.city,
        country: properties.country
      })
    }
  }

  const trackScrollDepth = (depth: number) => {
    const milestones = [25, 50, 75, 90, 100]
    
    milestones.forEach(milestone => {
      if (depth >= milestone && sessionData.value.scroll_depth < milestone) {
        trackCustomEvent('scroll_depth', {
          scroll_depth: milestone,
          page_url: window.location.href
        })
        sessionData.value.scroll_depth = milestone
      }
    })
  }

  const trackTimeOnPage = (timeInSeconds: number) => {
    const milestones = [30, 60, 120, 300, 600] // 30s, 1m, 2m, 5m, 10m
    
    milestones.forEach(milestone => {
      if (timeInSeconds >= milestone && sessionData.value.time_on_page < milestone) {
        trackCustomEvent('time_on_page', {
          time_on_page: milestone,
          page_url: window.location.href
        })
        sessionData.value.time_on_page = milestone
      }
    })
  }

  const generateEventId = (): string => {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const trackExitIntent = () => {
    trackCustomEvent('exit_intent', {
      page_url: window.location.href,
      time_on_page: sessionData.value.time_on_page,
      scroll_depth: sessionData.value.scroll_depth,
      interactions: sessionData.value.interactions
    })
  }

  const trackSearch = (searchTerm: string, resultsCount: number = 0) => {
    trackCustomEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
      page_url: window.location.href
    })
  }

  // Lifecycle
  onMounted(() => {
    // Generate session ID
    sessionData.value.session_id = generateEventId()
    
    // Initialize analytics
    initializeGTM()
    initializeFacebookPixel()
    
    // Track initial page view
    setTimeout(() => {
      trackPageView()
    }, 1000)
  })

  return {
    // State
    isGTMLoaded: readonly(isGTMLoaded),
    isPixelLoaded: readonly(isPixelLoaded),
    isAnalyticsReady,
    userProperties: readonly(userProperties),
    sessionData: readonly(sessionData),
    
    // Methods
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackLead,
    trackCustomEvent,
    setUserProperties,
    trackScrollDepth,
    trackTimeOnPage,
    trackExitIntent,
    trackSearch,
    generateEventId
  }
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[]
    fbq: any
  }
}
