<template>
  <div class="analytics-optimizer">
    <!-- Analytics Status (Development Only) -->
    <div 
      v-if="showAnalyticsStatus && showStatus && isClient"
      class="analytics-optimizer__status"
      :class="{
        'analytics-optimizer__status--ready': isAnalyticsReady,
        'analytics-optimizer__status--loading': !isAnalyticsReady
      }"
    >
      <div class="analytics-optimizer__status-content">
        <Icon 
          :name="isAnalyticsReady ? 'heroicons:check-circle' : 'heroicons:clock'"
          class="analytics-optimizer__status-icon"
        />
        <div class="analytics-optimizer__status-info">
          <span class="analytics-optimizer__status-label">Analytics</span>
          <span class="analytics-optimizer__status-value">
            {{ isAnalyticsReady ? 'Ready' : 'Loading...' }}
          </span>
        </div>
        <div class="analytics-optimizer__status-details">
          <div class="analytics-optimizer__status-item">
            <Icon 
              :name="isGTMLoaded ? 'heroicons:check' : 'heroicons:x-mark'"
              class="analytics-optimizer__status-item-icon"
              :class="{ 'analytics-optimizer__status-item-icon--success': isGTMLoaded }"
            />
            <span>GTM</span>
          </div>
          <div class="analytics-optimizer__status-item">
            <Icon 
              :name="isPixelLoaded ? 'heroicons:check' : 'heroicons:x-mark'"
              class="analytics-optimizer__status-item-icon"
              :class="{ 'analytics-optimizer__status-item-icon--success': isPixelLoaded }"
            />
            <span>Pixel</span>
          </div>
        </div>
      </div>
      <button 
        class="analytics-optimizer__status-toggle"
        @click="toggleAnalyticsDetails"
      >
        <Icon name="heroicons:chevron-down" />
      </button>
    </div>

    <!-- Analytics Details (Development Only) -->
    <div 
      v-if="showAnalyticsDetails && showStatus && isClient"
      class="analytics-optimizer__details"
    >
      <div class="analytics-optimizer__metrics">
        <div class="analytics-optimizer__metric">
          <span class="analytics-optimizer__metric-label">Session ID</span>
          <span class="analytics-optimizer__metric-value">{{ sessionData.session_id }}</span>
        </div>
        
        <div class="analytics-optimizer__metric">
          <span class="analytics-optimizer__metric-label">Page Views</span>
          <span class="analytics-optimizer__metric-value">{{ sessionData.page_views }}</span>
        </div>
        
        <div class="analytics-optimizer__metric">
          <span class="analytics-optimizer__metric-label">Time on Page</span>
          <span class="analytics-optimizer__metric-value">{{ sessionData.time_on_page }}s</span>
        </div>
        
        <div class="analytics-optimizer__metric">
          <span class="analytics-optimizer__metric-label">Scroll Depth</span>
          <span class="analytics-optimizer__metric-value">{{ sessionData.scroll_depth }}%</span>
        </div>
        
        <div class="analytics-optimizer__metric">
          <span class="analytics-optimizer__metric-label">Interactions</span>
          <span class="analytics-optimizer__metric-value">{{ sessionData.interactions }}</span>
        </div>
      </div>
      
      <div class="analytics-optimizer__actions">
        <button 
          class="analytics-optimizer__action"
          @click="testGTM"
        >
          <Icon name="heroicons:play" />
          Test GTM
        </button>
        
        <button 
          class="analytics-optimizer__action"
          @click="testPixel"
        >
          <Icon name="heroicons:play" />
          Test Pixel
        </button>
      </div>
    </div>

    <!-- Event Tracking Debug (Development Only) -->
    <div 
      v-if="showEventDebug && showStatus && isClient && enableDebugMode"
      class="analytics-optimizer__debug"
    >
      <div class="analytics-optimizer__debug-header">
        <h4>Event Tracking Debug</h4>
        <button 
          class="analytics-optimizer__debug-clear"
          @click="clearEventLog"
        >
          Clear
        </button>
      </div>
      <div class="analytics-optimizer__debug-events">
        <div 
          v-for="(event, index) in eventLog" 
          :key="index"
          class="analytics-optimizer__debug-event"
        >
          <div class="analytics-optimizer__debug-event-time">
            {{ event.timestamp }}
          </div>
          <div class="analytics-optimizer__debug-event-name">
            {{ event.event }}
          </div>
          <div class="analytics-optimizer__debug-event-data">
            {{ JSON.stringify(event.data, null, 2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

interface Props {
  enableDebugMode?: boolean
  showStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableDebugMode: false,
  showStatus: false
})

// Analytics
const {
  isGTMLoaded,
  isPixelLoaded,
  isAnalyticsReady,
  sessionData,
  trackCustomEvent,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackLead,
  trackExitIntent
} = useAnalytics()

// State
const isClient = ref(false)
const showAnalyticsDetails = ref(false)
const showEventDebug = ref(props.enableDebugMode && process.env.NODE_ENV === 'development')
const eventLog = ref<Array<{ timestamp: string, event: string, data: any }>>([])

// Computed
const showAnalyticsStatus = computed(() => {
  return props.showStatus || (process.env.NODE_ENV === 'development' && isClient.value)
})

// Methods
const toggleAnalyticsDetails = () => {
  showAnalyticsDetails.value = !showAnalyticsDetails.value
}

const testGTM = () => {
  trackCustomEvent('test_gtm', {
    test_data: 'GTM test event',
    timestamp: new Date().toISOString()
  })
  
  if (process.env.NODE_ENV === 'development') {
    // console.log('🧪 GTM test event sent')
  }
}

const testPixel = () => {
  trackCustomEvent('test_pixel', {
    test_data: 'Facebook Pixel test event',
    timestamp: new Date().toISOString()
  })
  
  if (process.env.NODE_ENV === 'development') {
    // console.log('🧪 Facebook Pixel test event sent')
  }
}

const logEvent = (eventName: string, data: any) => {
  if (!showEventDebug.value) return
  
  eventLog.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    event: eventName,
    data
  })
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

const clearEventLog = () => {
  eventLog.value = []
}

// Enhanced tracking methods
const trackEnhancedPageView = (pageName: string, customData: Record<string, any> = {}) => {
  trackPageView(pageName)
  logEvent('page_view', { pageName, ...customData })
}

const trackEnhancedProductView = (productData: any) => {
  trackProductView(productData)
  logEvent('product_view', productData)
}

const trackEnhancedAddToCart = (cartData: any) => {
  trackAddToCart(cartData)
  logEvent('add_to_cart', cartData)
}

const trackEnhancedLead = (leadData: any) => {
  trackLead(leadData)
  logEvent('lead', leadData)
}

const trackEnhancedExitIntent = () => {
  trackExitIntent()
  logEvent('exit_intent', { timestamp: new Date().toISOString() })
}

// Auto-tracking setup
const setupAutoTracking = () => {
  // Track scroll depth
  let maxScroll = 0
  const handleScroll = () => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent
      
      // Track milestone scroll depths
      const milestones = [25, 50, 75, 90, 100]
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone) {
          trackCustomEvent('scroll_milestone', {
            scroll_depth: milestone,
            page_url: window.location.href
          })
          logEvent('scroll_milestone', { scroll_depth: milestone })
        }
      })
    }
  }

  // Track time on page
  let startTime = Date.now()
  const trackTimeMilestones = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000)
    const milestones = [30, 60, 120, 300, 600] // 30s, 1m, 2m, 5m, 10m
    
    milestones.forEach(milestone => {
      if (timeOnPage === milestone) {
        trackCustomEvent('time_milestone', {
          time_on_page: milestone,
          page_url: window.location.href
        })
        logEvent('time_milestone', { time_on_page: milestone })
      }
    })
  }

  // Track interactions
  let interactionCount = 0
  const trackInteraction = () => {
    interactionCount++
    trackCustomEvent('user_interaction', {
      interaction_count: interactionCount,
      page_url: window.location.href
    })
    logEvent('user_interaction', { interaction_count: interactionCount })
  }

  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('click', trackInteraction)
  window.addEventListener('keydown', trackInteraction)
  
  // Track time milestones every second
  const timeInterval = setInterval(trackTimeMilestones, 1000)

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('click', trackInteraction)
    window.removeEventListener('keydown', trackInteraction)
    clearInterval(timeInterval)
  }
}

// Lifecycle
onMounted(() => {
  isClient.value = true
  
  if (showEventDebug.value) {
    const cleanup = setupAutoTracking()
    
    onUnmounted(() => {
      cleanup()
    })
  }
})

// Expose methods for parent components
defineExpose({
  trackEnhancedPageView,
  trackEnhancedProductView,
  trackEnhancedAddToCart,
  trackEnhancedLead,
  trackEnhancedExitIntent,
  logEvent
})
</script>

<style scoped>
.analytics-optimizer {
  position: relative;
}

/* Analytics Status */
.analytics-optimizer__status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9997;
  min-width: 200px;
  transition: all 0.3s ease;
  border-left: 4px solid #6b7280;
}

.analytics-optimizer__status--ready {
  border-left-color: #10b981;
}

.analytics-optimizer__status--loading {
  border-left-color: #f59e0b;
}

.analytics-optimizer__status-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.analytics-optimizer__status-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.analytics-optimizer__status--ready .analytics-optimizer__status-icon {
  color: #10b981;
}

.analytics-optimizer__status--loading .analytics-optimizer__status-icon {
  color: #f59e0b;
}

.analytics-optimizer__status-info {
  flex: 1;
}

.analytics-optimizer__status-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.analytics-optimizer__status-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.analytics-optimizer__status-details {
  display: flex;
  gap: 8px;
}

.analytics-optimizer__status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.analytics-optimizer__status-item-icon {
  width: 12px;
  height: 12px;
}

.analytics-optimizer__status-item-icon--success {
  color: #10b981;
}

.analytics-optimizer__status-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.analytics-optimizer__status-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Analytics Details */
.analytics-optimizer__details {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9996;
  min-width: 300px;
  animation: slideUp 0.3s ease;
}

.analytics-optimizer__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.analytics-optimizer__metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.analytics-optimizer__metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.analytics-optimizer__metric-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  word-break: break-all;
}

.analytics-optimizer__actions {
  display: flex;
  gap: 8px;
}

.analytics-optimizer__action {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.analytics-optimizer__action:hover {
  background: #2563eb;
}

.analytics-optimizer__action svg {
  width: 12px;
  height: 12px;
}

/* Event Debug */
.analytics-optimizer__debug {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9998;
  width: 400px;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.analytics-optimizer__debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.analytics-optimizer__debug-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.analytics-optimizer__debug-clear {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.analytics-optimizer__debug-clear:hover {
  background: #dc2626;
}

.analytics-optimizer__debug-events {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analytics-optimizer__debug-event {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  font-size: 0.75rem;
}

.analytics-optimizer__debug-event-time {
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.analytics-optimizer__debug-event-name {
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 4px;
}

.analytics-optimizer__debug-event-data {
  color: #374151;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .analytics-optimizer__status {
    bottom: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .analytics-optimizer__details {
    bottom: 70px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .analytics-optimizer__debug {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
  
  .analytics-optimizer__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
