import { ref, computed, watch, onMounted, onUnmounted, readonly } from 'vue'

// Types for Performance API
interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number
}

interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number
  hadRecentInput?: boolean
}

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void
}

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  
  // Custom metrics
  pageLoadTime: number
  domContentLoaded: number
  resourceLoadTime: number
  imageLoadTime: number
  
  // User experience
  interactionTime: number
  scrollDepth: number
  timeToInteractive: number
}

export interface PerformanceConfig {
  // Image optimization
  images: {
    lazyLoading: boolean
    webpSupport: boolean
    responsiveImages: boolean
    preloadCritical: boolean
    compressionQuality: number
  }
  
  // Resource optimization
  resources: {
    preloadCritical: boolean
    deferNonCritical: boolean
    bundleSplitting: boolean
    treeShaking: boolean
  }
  
  // Caching
  caching: {
    enableServiceWorker: boolean
    cacheStrategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate'
    cacheDuration: number // in seconds
    precacheAssets: boolean
  }
  
  // Monitoring
  monitoring: {
    enableMetrics: boolean
    reportToAnalytics: boolean
    alertThresholds: {
      lcp: number // 2.5s
      fid: number // 100ms
      cls: number // 0.1
    }
  }
}

export interface LoadingState {
  isLoading: boolean
  progress: number // 0-100
  phase: 'initial' | 'resources' | 'images' | 'interactive' | 'complete'
  estimatedTime: number // in seconds
}

export function usePerformanceOptimization() {
  // State
  const metrics = ref<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    pageLoadTime: 0,
    domContentLoaded: 0,
    resourceLoadTime: 0,
    imageLoadTime: 0,
    interactionTime: 0,
    scrollDepth: 0,
    timeToInteractive: 0
  })

  const loadingState = ref<LoadingState>({
    isLoading: true,
    progress: 0,
    phase: 'initial',
    estimatedTime: 0
  })

  const performanceConfig = ref<PerformanceConfig>({
    images: {
      lazyLoading: true,
      webpSupport: true,
      responsiveImages: true,
      preloadCritical: true,
      compressionQuality: 80
    },
    resources: {
      preloadCritical: true,
      deferNonCritical: true,
      bundleSplitting: true,
      treeShaking: true
    },
    caching: {
      enableServiceWorker: true,
      cacheStrategy: 'staleWhileRevalidate',
      cacheDuration: 86400, // 24 hours
      precacheAssets: true
    },
    monitoring: {
      enableMetrics: true,
      reportToAnalytics: true,
      alertThresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1
      }
    }
  })

  // Computed
  const isSlowConnection = computed(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
    }
    return false
  })

  const shouldOptimizeForSlowConnection = computed(() => {
    return isSlowConnection.value || metrics.value.ttfb > 1000
  })

  const performanceScore = computed(() => {
    let score = 100
    
    // LCP penalty
    if (metrics.value.lcp > 2500) score -= 30
    else if (metrics.value.lcp > 1500) score -= 15
    
    // FID penalty
    if (metrics.value.fid > 100) score -= 25
    else if (metrics.value.fid > 50) score -= 10
    
    // CLS penalty
    if (metrics.value.cls > 0.1) score -= 20
    else if (metrics.value.cls > 0.05) score -= 10
    
    return Math.max(0, score)
  })

  const isPerformanceGood = computed(() => {
    return performanceScore.value >= 80
  })

  // Methods
  const measureCoreWebVitals = () => {
    if (!performanceConfig.value.monitoring.enableMetrics) return

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      metrics.value.lcp = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        const entryWithProcessing = entry as PerformanceEntryWithProcessingStart
        if (entryWithProcessing.processingStart) {
          metrics.value.fid = entryWithProcessing.processingStart - entry.startTime
        }
      })
    }).observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        const entryWithValue = entry as PerformanceEntryWithValue
        if (!entryWithValue.hadRecentInput && entryWithValue.value) {
          clsValue += entryWithValue.value
          metrics.value.cls = clsValue
        }
      })
    }).observe({ entryTypes: ['layout-shift'] })

    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          metrics.value.fcp = entry.startTime
        }
      })
    }).observe({ entryTypes: ['paint'] })
  }

  const measureCustomMetrics = () => {
    // Page load time
    window.addEventListener('load', () => {
      metrics.value.pageLoadTime = performance.now()
      loadingState.value.phase = 'complete'
      loadingState.value.isLoading = false
      loadingState.value.progress = 100
    })

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      metrics.value.domContentLoaded = performance.now()
      loadingState.value.phase = 'interactive'
      loadingState.value.progress = 80
    })

    // TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metrics.value.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    }
  }

  const optimizeImages = () => {
    if (!performanceConfig.value.images.lazyLoading) return

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const startTime = performance.now()
          
          img.src = img.dataset.src || ''
          img.classList.remove('lazy')
          
          img.addEventListener('load', () => {
            const loadTime = performance.now() - startTime
            metrics.value.imageLoadTime += loadTime
          })
          
          imageObserver.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px'
    })

    images.forEach(img => imageObserver.observe(img))
  }

  const preloadCriticalResources = () => {
    if (!performanceConfig.value.resources.preloadCritical) return

    // Preload critical CSS
    const criticalCSS = document.querySelector('link[rel="preload"][as="style"]')
    if (criticalCSS) {
      criticalCSS.addEventListener('load', () => {
        criticalCSS.setAttribute('rel', 'stylesheet')
      })
    }

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]

    criticalFonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = font
      link.onload = () => link.rel = 'stylesheet'
      document.head.appendChild(link)
    })
  }

  const optimizeScrolling = () => {
    // Passive scroll listeners for better performance
    let ticking = false
    
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      
      metrics.value.scrollDepth = Math.max(metrics.value.scrollDepth, scrollPercent)
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth)
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })
  }

  const createLoadingProgress = () => {
    const progressBar = document.createElement('div')
    progressBar.className = 'loading-progress'
    progressBar.innerHTML = `
      <div class="loading-progress__bar"></div>
      <div class="loading-progress__text">Carregando...</div>
    `

    // Add styles
    const style = document.createElement('style')
    style.textContent = `
      .loading-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: #f0f0f0;
        z-index: 9999;
        transition: opacity 0.3s ease;
      }
      
      .loading-progress__bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        width: 0%;
        transition: width 0.3s ease;
      }
      
      .loading-progress__text {
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        color: #6b7280;
        background: white;
        padding: 2px 8px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .loading-progress--hidden {
        opacity: 0;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(progressBar)

    // Update progress
    const progressBarElement = progressBar.querySelector('.loading-progress__bar') as HTMLElement
    const progressText = progressBar.querySelector('.loading-progress__text') as HTMLElement

    const updateProgress = () => {
      if (progressBarElement) {
        progressBarElement.style.width = `${loadingState.value.progress}%`
      }
      
      if (progressText) {
        const phaseText = {
          initial: 'Inicializando...',
          resources: 'Carregando recursos...',
          images: 'Carregando imagens...',
          interactive: 'Quase pronto...',
          complete: 'Concluído!'
        }
        progressText.textContent = phaseText[loadingState.value.phase] || 'Carregando...'
      }
    }

    // Watch for progress changes
    const stopWatching = watch(loadingState, updateProgress, { deep: true })

    // Hide progress when complete
    watch(() => loadingState.value.isLoading, (isLoading: boolean) => {
      if (!isLoading) {
        setTimeout(() => {
          progressBar.classList.add('loading-progress--hidden')
          setTimeout(() => {
            progressBar.remove()
            stopWatching()
          }, 300)
        }, 500)
      }
    })
  }

  const reportMetrics = () => {
    if (!performanceConfig.value.monitoring.reportToAnalytics) return

    // Report to analytics (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'Core Web Vitals',
        lcp: metrics.value.lcp,
        fid: metrics.value.fid,
        cls: metrics.value.cls,
        fcp: metrics.value.fcp,
        ttfb: metrics.value.ttfb,
        custom_map: {
          dimension1: performanceScore.value
        }
      })
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', {
        'LCP (Largest Contentful Paint)': `${metrics.value.lcp.toFixed(2)}ms`,
        'FID (First Input Delay)': `${metrics.value.fid.toFixed(2)}ms`,
        'CLS (Cumulative Layout Shift)': metrics.value.cls.toFixed(4),
        'FCP (First Contentful Paint)': `${metrics.value.fcp.toFixed(2)}ms`,
        'TTFB (Time to First Byte)': `${metrics.value.ttfb.toFixed(2)}ms`,
        'Performance Score': `${performanceScore.value}/100`,
        'Is Good Performance': isPerformanceGood.value
      })
    }
  }

  const optimizeForSlowConnection = () => {
    if (!shouldOptimizeForSlowConnection.value) return

    // Reduce image quality
    performanceConfig.value.images.compressionQuality = 60
    
    // Disable non-critical animations
    document.documentElement.classList.add('slow-connection')
    
    // Add slow connection styles
    const style = document.createElement('style')
    style.textContent = `
      .slow-connection * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .slow-connection .loading-progress__bar {
        background: linear-gradient(90deg, #10b981, #059669);
      }
    `
    document.head.appendChild(style)
  }

  // Lifecycle
  onMounted(() => {
    measureCoreWebVitals()
    measureCustomMetrics()
    optimizeImages()
    preloadCriticalResources()
    optimizeScrolling()
    createLoadingProgress()
    optimizeForSlowConnection()

    // Report metrics after page load
    setTimeout(() => {
      reportMetrics()
    }, 3000)
  })

  return {
    // State
    metrics: readonly(metrics),
    loadingState: readonly(loadingState),
    performanceConfig: readonly(performanceConfig),
    
    // Computed
    isSlowConnection,
    shouldOptimizeForSlowConnection,
    performanceScore,
    isPerformanceGood,
    
    // Methods
    measureCoreWebVitals,
    measureCustomMetrics,
    optimizeImages,
    preloadCriticalResources,
    optimizeScrolling,
    createLoadingProgress,
    reportMetrics,
    optimizeForSlowConnection
  }
}
