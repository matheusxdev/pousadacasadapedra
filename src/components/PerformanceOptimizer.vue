<template>
  <div class="performance-optimizer">
    <!-- Loading Progress Bar -->
    <div 
      v-if="loadingState.isLoading" 
      class="performance-optimizer__progress"
      :class="{ 'performance-optimizer__progress--slow': isSlowConnection }"
    >
      <div 
        class="performance-optimizer__progress-bar"
        :style="{ width: `${loadingState.progress}%` }"
      ></div>
      <div class="performance-optimizer__progress-text">
        {{ getProgressText() }}
      </div>
    </div>

    <!-- Performance Warning (Slow Connection) -->
    <div 
      v-if="shouldOptimizeForSlowConnection && loadingState.isLoading"
      class="performance-optimizer__warning"
    >
      <Icon name="heroicons:exclamation-triangle" class="performance-optimizer__warning-icon" />
      <div class="performance-optimizer__warning-content">
        <h4>Conexão lenta detectada</h4>
        <p>Otimizando carregamento para sua conexão...</p>
      </div>
    </div>

    <!-- Performance Score (Development Only) -->
    <div 
      v-if="showPerformanceScore && !loadingState.isLoading"
      class="performance-optimizer__score"
      :class="{
        'performance-optimizer__score--good': isPerformanceGood,
        'performance-optimizer__score--bad': !isPerformanceGood
      }"
    >
      <div class="performance-optimizer__score-content">
        <Icon 
          :name="isPerformanceGood ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'"
          class="performance-optimizer__score-icon"
        />
        <div class="performance-optimizer__score-info">
          <span class="performance-optimizer__score-label">Performance Score</span>
          <span class="performance-optimizer__score-value">{{ performanceScore }}/100</span>
        </div>
      </div>
      <button 
        class="performance-optimizer__score-toggle"
        @click="togglePerformanceDetails"
      >
        <Icon name="heroicons:chevron-down" />
      </button>
    </div>

    <!-- Performance Details (Development Only) -->
    <div 
      v-if="showPerformanceDetails && !loadingState.isLoading"
      class="performance-optimizer__details"
    >
      <div class="performance-optimizer__metrics">
        <div class="performance-optimizer__metric">
          <span class="performance-optimizer__metric-label">LCP</span>
          <span 
            class="performance-optimizer__metric-value"
            :class="{ 'performance-optimizer__metric-value--warning': metrics.lcp > 2500 }"
          >
            {{ metrics.lcp.toFixed(0) }}ms
          </span>
        </div>
        
        <div class="performance-optimizer__metric">
          <span class="performance-optimizer__metric-label">FID</span>
          <span 
            class="performance-optimizer__metric-value"
            :class="{ 'performance-optimizer__metric-value--warning': metrics.fid > 100 }"
          >
            {{ metrics.fid.toFixed(0) }}ms
          </span>
        </div>
        
        <div class="performance-optimizer__metric">
          <span class="performance-optimizer__metric-label">CLS</span>
          <span 
            class="performance-optimizer__metric-value"
            :class="{ 'performance-optimizer__metric-value--warning': metrics.cls > 0.1 }"
          >
            {{ metrics.cls.toFixed(3) }}
          </span>
        </div>
        
        <div class="performance-optimizer__metric">
          <span class="performance-optimizer__metric-label">FCP</span>
          <span class="performance-optimizer__metric-value">
            {{ metrics.fcp.toFixed(0) }}ms
          </span>
        </div>
        
        <div class="performance-optimizer__metric">
          <span class="performance-optimizer__metric-label">TTFB</span>
          <span class="performance-optimizer__metric-value">
            {{ metrics.ttfb.toFixed(0) }}ms
          </span>
        </div>
      </div>
    </div>

    <!-- Optimized Images Container -->
    <div class="performance-optimizer__images" v-if="optimizedImages.length > 0">
      <!-- This will be populated by the composable -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'

interface Props {
  enableProgressBar?: boolean
  enableWarnings?: boolean
  showDevTools?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableProgressBar: true,
  enableWarnings: true,
  showDevTools: false
})

// Performance optimization
const {
  metrics,
  loadingState,
  isSlowConnection,
  shouldOptimizeForSlowConnection,
  performanceScore,
  isPerformanceGood
} = usePerformanceOptimization()

// State
const showPerformanceScore = ref(props.showDevTools && process.env.NODE_ENV === 'development')
const showPerformanceDetails = ref(false)
const optimizedImages = ref<string[]>([])

// Methods
const getProgressText = () => {
  const phaseText = {
    initial: 'Inicializando...',
    resources: 'Carregando recursos...',
    images: 'Carregando imagens...',
    interactive: 'Quase pronto...',
    complete: 'Concluído!'
  }
  return phaseText[loadingState.value.phase] || 'Carregando...'
}

const togglePerformanceDetails = () => {
  showPerformanceDetails.value = !showPerformanceDetails.value
}

// Lifecycle
onMounted(() => {
  // Optimize images on mount
  const images = document.querySelectorAll('img[data-src]')
  optimizedImages.value = Array.from(images).map(img => img.getAttribute('data-src') || '')
})
</script>

<style scoped>
.performance-optimizer {
  position: relative;
}

/* Progress Bar */
.performance-optimizer__progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f0f0f0;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.performance-optimizer__progress--slow {
  background: #fef3c7;
}

.performance-optimizer__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.performance-optimizer__progress--slow .performance-optimizer__progress-bar {
  background: linear-gradient(90deg, #10b981, #059669);
}

.performance-optimizer__progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

.performance-optimizer__progress-text {
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
  font-weight: 500;
}

/* Warning */
.performance-optimizer__warning {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9998;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.performance-optimizer__warning-icon {
  width: 20px;
  height: 20px;
  color: #d97706;
  flex-shrink: 0;
}

.performance-optimizer__warning-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
}

.performance-optimizer__warning-content p {
  margin: 0;
  font-size: 0.75rem;
  color: #b45309;
}

/* Performance Score */
.performance-optimizer__score {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9997;
  min-width: 200px;
  transition: all 0.3s ease;
}

.performance-optimizer__score--good {
  border-left: 4px solid #10b981;
}

.performance-optimizer__score--bad {
  border-left: 4px solid #ef4444;
}

.performance-optimizer__score-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.performance-optimizer__score-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.performance-optimizer__score--good .performance-optimizer__score-icon {
  color: #10b981;
}

.performance-optimizer__score--bad .performance-optimizer__score-icon {
  color: #ef4444;
}

.performance-optimizer__score-info {
  flex: 1;
}

.performance-optimizer__score-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.performance-optimizer__score-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.performance-optimizer__score-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.performance-optimizer__score-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Performance Details */
.performance-optimizer__details {
  position: fixed;
  bottom: 80px;
  left: 20px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9996;
  min-width: 250px;
  animation: slideUp 0.3s ease;
}

.performance-optimizer__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.performance-optimizer__metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.performance-optimizer__metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.performance-optimizer__metric-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.performance-optimizer__metric-value--warning {
  color: #ef4444;
}

/* Animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

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
  .performance-optimizer__warning {
    top: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    max-width: none;
  }
  
  .performance-optimizer__score {
    bottom: 10px;
    left: 10px;
    min-width: auto;
    width: calc(100% - 20px);
  }
  
  .performance-optimizer__details {
    bottom: 70px;
    left: 10px;
    right: 10px;
    min-width: auto;
  }
  
  .performance-optimizer__metrics {
    grid-template-columns: 1fr;
  }
}

/* Slow connection optimizations */
.slow-connection .performance-optimizer__progress-bar::after {
  animation: none;
}

.slow-connection .performance-optimizer__score {
  animation: none;
}
</style>
