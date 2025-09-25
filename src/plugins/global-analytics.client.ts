import { defineNuxtPlugin } from 'nuxt/app'
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (typeof window === 'undefined') return

  // Enhanced Analytics Configuration
  const runtimeConfig = useRuntimeConfig()
  const config = {
    gtm: {
      id: runtimeConfig.public.gtmId,
      auth: runtimeConfig.public.gtmAuth,
      preview: runtimeConfig.public.gtmPreview,
      environment: process.env.NODE_ENV || 'development'
    },
    pixel: {
      id: runtimeConfig.public.facebookPixelId,
      appId: runtimeConfig.public.facebookAppId
    },
    ga4: {
      id: runtimeConfig.public.ga4MeasurementId
    }
  }

  // Initialize dataLayer for GTM
  window.dataLayer = window.dataLayer || []
  
  // Enhanced GTM Configuration
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
    gtm_id: config.gtm.id,
    gtm_auth: config.gtm.auth,
    gtm_preview: config.gtm.preview,
    environment: config.gtm.environment,
    site_version: '2.0',
    timestamp: new Date().toISOString()
  })

  // Load GTM Script with error handling
  const loadGTM = () => {
    // Skip loading if GTM ID is not configured or is placeholder
    if (!config.gtm.id || config.gtm.id === 'GTM-XXXXXXX') {
      return
    }
    
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtm.id}`
    
    script.onload = () => {
      // console.log('✅ Google Tag Manager loaded successfully')
      // Push configuration after GTM loads
      window.dataLayer.push({
        event: 'gtm_loaded',
        gtm_id: config.gtm.id,
        timestamp: new Date().toISOString()
      })
    }
    
    script.onerror = () => {
      // console.error('❌ Failed to load Google Tag Manager')
      // Retry after 5 seconds
      setTimeout(loadGTM, 5000)
    }

    document.head.appendChild(script)

    // Add GTM noscript fallback
    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${config.gtm.id}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.insertBefore(noscript, document.body.firstChild)
  }

  // Initialize Facebook Pixel
  const loadFacebookPixel = () => {
    if (!config.pixel.id || config.pixel.id === 'YOUR_PIXEL_ID' || config.pixel.id === 'null') {
      // console.warn('⚠️ Facebook Pixel ID not configured')
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

    // Load Facebook Pixel Script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    
    script.onload = () => {
      // Initialize Pixel with enhanced configuration
      window.fbq('init', config.pixel.id, {
        em: 'hashed_email', // Will be set when user data is available
        ph: 'hashed_phone', // Will be set when user data is available
        fn: 'hashed_first_name',
        ln: 'hashed_last_name',
        ct: 'hashed_city',
        country: 'hashed_country'
      })
      
      // Track initial page view
      window.fbq('track', 'PageView')
      
      // console.log('✅ Facebook Pixel loaded successfully')
      
      // Track pixel loaded event in GTM
      window.dataLayer.push({
        event: 'pixel_loaded',
        pixel_id: config.pixel.id,
        timestamp: new Date().toISOString()
      })
    }
    
    script.onerror = () => {
      // console.error('❌ Failed to load Facebook Pixel')
      // Retry after 5 seconds
      setTimeout(loadFacebookPixel, 5000)
    }

    document.head.appendChild(script)
  }

  // Load GA4 (if configured)
  const loadGA4 = () => {
    if (!config.ga4.id || config.ga4.id === 'G-XXXXXXXXXX') {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4.id}`
    
    script.onload = () => {
      window.gtag = function() {
        window.dataLayer.push(arguments)
      }
      
      window.gtag('js', new Date())
      window.gtag('config', config.ga4.id, {
        send_page_view: true,
        custom_map: {
          custom_parameter_1: 'user_type',
          custom_parameter_2: 'page_category'
        }
      })
      
      // console.log('✅ Google Analytics 4 loaded successfully')
    }

    document.head.appendChild(script)
  }

  // Enhanced Page Tracking
  const trackPageView = (route: any) => {
    const pageData = {
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      page_path: route.path,
      page_name: route.name || route.path,
      page_category: getPageCategory(route.path),
      user_type: getUserType(),
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: screen.colorDepth,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      referrer: document.referrer,
      session_id: getSessionId()
    }

    // GTM Page View
    window.dataLayer.push(pageData)

    // Facebook Pixel Page View
    if (window.fbq) {
      window.fbq('track', 'PageView', {
        content_name: pageData.page_name,
        content_category: pageData.page_category
      })
    }

    // GA4 Page View
    if (window.gtag) {
      window.gtag('config', config.ga4.id, {
        page_title: pageData.page_title,
        page_location: pageData.page_location,
        page_path: pageData.page_path
      })
    }

    // console.log('📊 Page view tracked:', pageData)
  }

  // Determine page category based on route
  const getPageCategory = (path: string): string => {
    if (path.includes('/tours/')) return 'tour_detail'
    if (path.includes('/accommodations/')) return 'accommodation_detail'
    if (path.includes('/tours')) return 'tours_listing'
    if (path.includes('/accommodations')) return 'accommodations_listing'
    if (path.includes('/search')) return 'search_results'
    if (path === '/') return 'homepage'
    if (path.includes('/about')) return 'about'
    if (path.includes('/contact')) return 'contact'
    if (path.includes('/blog')) return 'blog'
    return 'other'
  }

  // Determine user type
  const getUserType = (): string => {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        return parsed.user_type || 'guest'
      } catch {
        return 'guest'
      }
    }
    return 'guest'
  }

  // Generate or get session ID
  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  // Enhanced Event Tracking
  const setupEnhancedTracking = () => {
    // Track scroll depth milestones
    let maxScroll = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        const milestones = [25, 50, 75, 90, 100]
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && maxScroll < milestone) {
            const eventData = {
              event: 'scroll_milestone',
              scroll_depth: milestone,
              page_url: window.location.href,
              page_category: getPageCategory(window.location.pathname),
              timestamp: new Date().toISOString()
            }

            window.dataLayer.push(eventData)
            
            if (window.fbq) {
              window.fbq('trackCustom', 'ScrollDepth', {
                scroll_depth: milestone,
                page_url: window.location.href
              })
            }

            // console.log('📊 Scroll milestone tracked:', milestone)
          }
        })
      }
    }

    // Track time on page milestones
    let startTime = Date.now()
    const trackTimeMilestones = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      const milestones = [30, 60, 120, 300, 600, 900] // 30s, 1m, 2m, 5m, 10m, 15m
      
      milestones.forEach(milestone => {
        if (timeOnPage === milestone) {
          const eventData = {
            event: 'time_milestone',
            time_on_page: milestone,
            page_url: window.location.href,
            page_category: getPageCategory(window.location.pathname),
            timestamp: new Date().toISOString()
          }

          window.dataLayer.push(eventData)
          
          if (window.fbq) {
            window.fbq('trackCustom', 'TimeOnPage', {
              time_on_page: milestone,
              page_url: window.location.href
            })
          }

          // console.log('📊 Time milestone tracked:', milestone)
        }
      })
    }

    // Track user interactions
    let interactionCount = 0
    const trackInteraction = (event: Event) => {
      interactionCount++
      const target = event.target as HTMLElement
      
      const eventData = {
        event: 'user_interaction',
        interaction_count: interactionCount,
        interaction_type: event.type,
        target_element: target.tagName,
        target_class: target.className,
        target_id: target.id,
        page_url: window.location.href,
        page_category: getPageCategory(window.location.pathname),
        timestamp: new Date().toISOString()
      }

      window.dataLayer.push(eventData)
      
      if (window.fbq) {
        window.fbq('trackCustom', 'UserInteraction', {
          interaction_count: interactionCount,
          interaction_type: event.type,
          page_url: window.location.href
        })
      }
    }

    // Track exit intent
    let exitIntentTriggered = false
    const trackExitIntent = (event: MouseEvent) => {
      if (exitIntentTriggered) return
      
      if (event.clientY <= 0) {
        exitIntentTriggered = true
        const timeOnPage = Math.round((Date.now() - startTime) / 1000)
        
        const eventData = {
          event: 'exit_intent',
          page_url: window.location.href,
          page_category: getPageCategory(window.location.pathname),
          time_on_page: timeOnPage,
          scroll_depth: maxScroll,
          interactions: interactionCount,
          timestamp: new Date().toISOString()
        }

        window.dataLayer.push(eventData)
        
        if (window.fbq) {
          window.fbq('trackCustom', 'ExitIntent', {
            page_url: window.location.href,
            time_on_page: timeOnPage,
            scroll_depth: maxScroll
          })
        }

        // console.log('📊 Exit intent tracked')
      }
    }

    // Track form submissions
    const trackFormSubmission = (event: Event) => {
      const form = event.target as HTMLFormElement
      const formName = form.name || form.id || 'unknown_form'
      const formAction = form.action || 'unknown'
      
      const eventData = {
        event: 'form_submit',
        form_name: formName,
        form_action: formAction,
        page_url: window.location.href,
        page_category: getPageCategory(window.location.pathname),
        timestamp: new Date().toISOString()
      }

      window.dataLayer.push(eventData)
      
      if (window.fbq) {
        window.fbq('trackCustom', 'FormSubmit', {
          form_name: formName,
          page_url: window.location.href
        })
      }

      // console.log('📊 Form submission tracked:', formName)
    }

    // Track external link clicks
    const trackExternalLink = (event: Event) => {
      const link = event.target as HTMLAnchorElement
      if (link.href && !link.href.includes(window.location.hostname)) {
        const eventData = {
          event: 'external_link_click',
          link_url: link.href,
          link_text: link.textContent?.trim() || '',
          page_url: window.location.href,
          page_category: getPageCategory(window.location.pathname),
          timestamp: new Date().toISOString()
        }

        window.dataLayer.push(eventData)
        
        if (window.fbq) {
          window.fbq('trackCustom', 'ExternalLinkClick', {
            link_url: link.href,
            page_url: window.location.href
          })
        }

        // console.log('📊 External link clicked:', link.href)
      }
    }

    // Track file downloads
    const trackDownload = (event: Event) => {
      const link = event.target as HTMLAnchorElement
      const fileExtension = link.href.split('.').pop()?.toLowerCase()
      const downloadExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'jpg', 'png', 'mp4', 'mp3']
      
      if (fileExtension && downloadExtensions.includes(fileExtension)) {
        const eventData = {
          event: 'file_download',
          file_name: link.href.split('/').pop() || '',
          file_extension: fileExtension,
          file_size: 'unknown',
          page_url: window.location.href,
          page_category: getPageCategory(window.location.pathname),
          timestamp: new Date().toISOString()
        }

        window.dataLayer.push(eventData)
        
        if (window.fbq) {
          window.fbq('trackCustom', 'FileDownload', {
            file_name: eventData.file_name,
            file_extension: fileExtension,
            page_url: window.location.href
          })
        }

        // console.log('📊 File download tracked:', eventData.file_name)
      }
    }

    // Track search queries
    const trackSearch = (searchTerm: string, resultsCount: number = 0) => {
      const eventData = {
        event: 'search',
        search_term: searchTerm,
        results_count: resultsCount,
        page_url: window.location.href,
        page_category: getPageCategory(window.location.pathname),
        timestamp: new Date().toISOString()
      }

      window.dataLayer.push(eventData)
      
      if (window.fbq) {
        window.fbq('trackCustom', 'Search', {
          search_term: searchTerm,
          results_count: resultsCount,
          page_url: window.location.href
        })
      }

      // console.log('📊 Search tracked:', searchTerm)
    }

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    window.addEventListener('click', trackInteraction)
    window.addEventListener('keydown', trackInteraction)
    window.addEventListener('mouseleave', trackExitIntent)
    
    // Track time milestones every second
    const timeInterval = setInterval(trackTimeMilestones, 1000)
    
    // Track form submissions
    document.addEventListener('submit', trackFormSubmission)
    
    // Track external links and downloads
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'A') {
        trackExternalLink(event)
        trackDownload(event)
      }
    })

    // Expose tracking functions globally
    window.trackSearch = trackSearch

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      window.removeEventListener('click', trackInteraction)
      window.removeEventListener('keydown', trackInteraction)
      window.removeEventListener('mouseleave', trackExitIntent)
      document.removeEventListener('submit', trackFormSubmission)
      clearInterval(timeInterval)
    }
  }

  // Initialize everything
  loadGTM()
  loadFacebookPixel()
  loadGA4()
  
  // Setup enhanced tracking after a short delay
  setTimeout(setupEnhancedTracking, 1000)

  // Track initial page view
  const route = useRoute()
  trackPageView(route)

  // Watch for route changes
  const router = useRouter()
  router.afterEach((to: any) => {
    trackPageView(to)
  })

  // Provide enhanced analytics methods
  return {
    provide: {
      analytics: {
        // GTM Methods
        gtm: {
          push: (data: any) => window.dataLayer.push(data),
          track: (event: string, parameters: any = {}) => {
            window.dataLayer.push({
              event,
              ...parameters,
              timestamp: new Date().toISOString()
            })
          }
        },
        
        // Facebook Pixel Methods
        pixel: {
          track: (event: string, parameters: any = {}) => {
            window.fbq('track', event, parameters)
          },
          trackCustom: (event: string, parameters: any = {}) => {
            window.fbq('trackCustom', event, parameters)
          }
        },
        
        // GA4 Methods
        ga4: {
          track: (event: string, parameters: any = {}) => {
            window.gtag('event', event, parameters)
          }
        },
        
        // Enhanced Methods
        trackPageView: trackPageView,
        trackSearch: (searchTerm: string, resultsCount: number = 0) => {
          if (window.trackSearch) {
            window.trackSearch(searchTerm, resultsCount)
          }
        }
      }
    }
  }
})

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[]
    fbq: any
    gtag: any
    trackSearch: (searchTerm: string, resultsCount: number) => void
  }
}
