import { ref, computed, watch, onMounted, onUnmounted, readonly } from 'vue'

export interface MobileOptimizationConfig {
  // Touch optimization
  touchTargets: {
    minSize: number // Minimum touch target size in pixels
    spacing: number // Spacing between touch targets
  }
  
  // Performance optimization
  performance: {
    lazyLoadImages: boolean
    reduceAnimations: boolean
    optimizeScrolling: boolean
    preloadCritical: boolean
  }
  
  // UX optimization
  ux: {
    stickyNavigation: boolean
    floatingCTA: boolean
    swipeGestures: boolean
    hapticFeedback: boolean
  }
  
  // Conversion optimization
  conversion: {
    prominentCTA: boolean
    simplifiedFlow: boolean
    quickActions: boolean
    socialProof: boolean
  }
}

export interface MobileMetrics {
  screenWidth: number
  screenHeight: number
  devicePixelRatio: number
  touchSupport: boolean
  connectionType: 'slow' | 'fast' | 'unknown'
  isLowEndDevice: boolean
}

export function useMobileOptimization() {
  // State
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isTouchDevice = ref(false)
  const screenSize = ref({ width: 0, height: 0 })
  const deviceMetrics = ref<MobileMetrics>({
    screenWidth: 0,
    screenHeight: 0,
    devicePixelRatio: 1,
    touchSupport: false,
    connectionType: 'unknown',
    isLowEndDevice: false
  })

  // Computed
  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  const isSmallScreen = computed(() => screenSize.value.width < 768)
  const isMediumScreen = computed(() => screenSize.value.width >= 768 && screenSize.value.width < 1024)
  const isLargeScreen = computed(() => screenSize.value.width >= 1024)

  const optimizationConfig = computed<MobileOptimizationConfig>(() => {
    const baseConfig: MobileOptimizationConfig = {
      touchTargets: {
        minSize: 44, // iOS/Android minimum
        spacing: 8
      },
      performance: {
        lazyLoadImages: true,
        reduceAnimations: false,
        optimizeScrolling: false,
        preloadCritical: false
      },
      ux: {
        stickyNavigation: false,
        floatingCTA: false,
        swipeGestures: false,
        hapticFeedback: false
      },
      conversion: {
        prominentCTA: false,
        simplifiedFlow: false,
        quickActions: false,
        socialProof: false
      }
    }

    if (isMobile.value) {
      return {
        ...baseConfig,
        performance: {
          ...baseConfig.performance,
          reduceAnimations: deviceMetrics.value.isLowEndDevice,
          optimizeScrolling: true,
          preloadCritical: true
        },
        ux: {
          ...baseConfig.ux,
          stickyNavigation: true,
          floatingCTA: true,
          swipeGestures: true,
          hapticFeedback: true
        },
        conversion: {
          ...baseConfig.conversion,
          prominentCTA: true,
          simplifiedFlow: true,
          quickActions: true,
          socialProof: true
        }
      }
    }

    if (isTablet.value) {
      return {
        ...baseConfig,
        performance: {
          ...baseConfig.performance,
          optimizeScrolling: true
        },
        ux: {
          ...baseConfig.ux,
          stickyNavigation: true,
          swipeGestures: true
        },
        conversion: {
          ...baseConfig.conversion,
          prominentCTA: true,
          quickActions: true
        }
      }
    }

    return baseConfig
  })

  // Methods
  const detectDevice = () => {
    if (typeof window === 'undefined') return

    const userAgent = navigator.userAgent.toLowerCase()
    const width = window.innerWidth
    const height = window.innerHeight

    // Touch detection
    const touchSupport = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        (navigator as any).msMaxTouchPoints > 0

    // Device type detection
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i

    isMobile.value = mobileRegex.test(userAgent) || (touchSupport && width < 768)
    isTablet.value = tabletRegex.test(userAgent) || (touchSupport && width >= 768 && width < 1024)
    isTouchDevice.value = touchSupport

    // Screen size
    screenSize.value = { width, height }

    // Device metrics
    deviceMetrics.value = {
      screenWidth: width,
      screenHeight: height,
      devicePixelRatio: window.devicePixelRatio || 1,
      touchSupport,
      connectionType: getConnectionType(),
      isLowEndDevice: detectLowEndDevice()
    }
  }

  const getConnectionType = (): 'slow' | 'fast' | 'unknown' => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return 'slow'
      }
      if (connection.effectiveType === '3g' || connection.effectiveType === '4g') {
        return 'fast'
      }
    }
    return 'unknown'
  }

  const detectLowEndDevice = (): boolean => {
    // Simple heuristics for low-end devices
    const memory = (navigator as any).deviceMemory || 4 // Default to 4GB if unknown
    const cores = navigator.hardwareConcurrency || 4 // Default to 4 cores if unknown
    
    return memory <= 2 || cores <= 2 || deviceMetrics.value.devicePixelRatio < 1.5
  }

  const optimizeForMobile = () => {
    if (!isMobile.value) return

    // Add mobile-specific classes to body
    document.body.classList.add('mobile-optimized')
    
    // Optimize viewport
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      )
    }

    // Add touch-friendly CSS
    const style = document.createElement('style')
    style.textContent = `
      .mobile-optimized {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .mobile-optimized input,
      .mobile-optimized textarea,
      .mobile-optimized [contenteditable] {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      .mobile-optimized button,
      .mobile-optimized a,
      .mobile-optimized [role="button"] {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
      }
    `
    document.head.appendChild(style)
  }

  const addHapticFeedback = (element: HTMLElement) => {
    if (!isTouchDevice.value) return

    element.addEventListener('touchstart', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10) // Light vibration
      }
    })
  }

  const optimizeImages = () => {
    if (!optimizationConfig.value.performance.lazyLoadImages) return

    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  }

  const addSwipeGestures = (element: HTMLElement, callbacks: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
  }) => {
    if (!isTouchDevice.value || !optimizationConfig.value.ux.swipeGestures) return

    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    })

    element.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX
      endY = e.changedTouches[0].clientY

      const diffX = startX - endX
      const diffY = startY - endY
      const threshold = 50

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > threshold && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft()
        } else if (diffX < -threshold && callbacks.onSwipeRight) {
          callbacks.onSwipeRight()
        }
      } else {
        if (diffY > threshold && callbacks.onSwipeUp) {
          callbacks.onSwipeUp()
        } else if (diffY < -threshold && callbacks.onSwipeDown) {
          callbacks.onSwipeDown()
        }
      }
    })
  }

  const createFloatingCTA = () => {
    if (!optimizationConfig.value.ux.floatingCTA) return

    const floatingCTA = document.createElement('div')
    floatingCTA.className = 'floating-cta'
    floatingCTA.innerHTML = `
      <button class="floating-cta__button">
        <span>Reservar</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `

    // Add styles
    const style = document.createElement('style')
    style.textContent = `
      .floating-cta {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      
      .floating-cta__button {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .floating-cta__button:hover {
        background: #2563eb;
        transform: translateY(-2px);
      }
      
      @media (max-width: 768px) {
        .floating-cta {
          bottom: 80px;
          right: 16px;
        }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(floatingCTA)

    // Add click handler
    floatingCTA.addEventListener('click', () => {
      const bookingSection = document.getElementById('booking')
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }

  // Lifecycle
  onMounted(() => {
    detectDevice()
    optimizeForMobile()
    optimizeImages()
    createFloatingCTA()

    // Listen for resize events
    window.addEventListener('resize', detectDevice)
    window.addEventListener('orientationchange', detectDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', detectDevice)
    window.removeEventListener('orientationchange', detectDevice)
  })

  // Watch for device changes
  watch([isMobile, isTablet], () => {
    optimizeForMobile()
  })

  return {
    // State
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isTouchDevice: readonly(isTouchDevice),
    screenSize: readonly(screenSize),
    deviceMetrics: readonly(deviceMetrics),
    
    // Computed
    deviceType,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    optimizationConfig,
    
    // Methods
    detectDevice,
    optimizeForMobile,
    addHapticFeedback,
    optimizeImages,
    addSwipeGestures,
    createFloatingCTA
  }
}
