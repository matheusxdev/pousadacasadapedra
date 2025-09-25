<template>
  <div v-if="hasAnyUrgency" class="urgency-display">
    <TransitionGroup name="urgency" tag="div" class="urgency-display__messages">
      <div
        v-for="message in urgencyMessages"
        :key="message.type"
        :class="[
          'urgency-display__message',
          `urgency-display__message--${message.urgency}`
        ]"
      >
        <Icon :name="getMessageIcon(message.type)" class="urgency-display__icon" />
        <span class="urgency-display__text">{{ message.message }}</span>
        <Icon
          v-if="message.urgency === 'high'"
          name="heroicons:exclamation-triangle"
          class="urgency-display__warning-icon"
        />
      </div>
    </TransitionGroup>

    <!-- Timer visual -->
    <div v-if="hasTimer" class="urgency-display__timer">
      <div class="urgency-display__timer-circle">
        <svg class="urgency-display__timer-svg" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            class="urgency-display__timer-bg"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            class="urgency-display__timer-progress"
            :style="{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: strokeDashoffset }"
          />
        </svg>
        <div class="urgency-display__timer-content">
          <span class="urgency-display__timer-time">{{ timeLeftFormatted }}</span>
          <span class="urgency-display__timer-label">Restam</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useUrgency } from '@/composables/useUrgency'

// Props
interface Props {
  productId: string
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true
})

// Composables
const {
  urgencyMessages,
  hasAnyUrgency,
  hasHighUrgency,
  hasMediumUrgency,
  loadUrgencyData,
  getTimeLeft,
  formatTimeLeft
} = useUrgency(props.productId)

// State
const timeLeft = ref({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
const timerInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const hasTimer = computed(() => {
  return urgencyMessages.value.some(msg => msg.type === 'timer' && msg.expiresAt)
})

const timeLeftFormatted = computed(() => {
  if (timeLeft.value.total <= 0) return '00:00:00'
  
  if (timeLeft.value.days > 0) {
    return `${timeLeft.value.days}d ${timeLeft.value.hours}h`
  } else if (timeLeft.value.hours > 0) {
    return `${String(timeLeft.value.hours).padStart(2, '0')}:${String(timeLeft.value.minutes).padStart(2, '0')}`
  } else {
    return `${String(timeLeft.value.minutes).padStart(2, '0')}:${String(timeLeft.value.seconds).padStart(2, '0')}`
  }
})

const timerMessage = computed(() => {
  return urgencyMessages.value.find(msg => msg.type === 'timer')
})

const circumference = computed(() => 2 * Math.PI * 45)
const strokeDashoffset = computed(() => {
  if (!timerMessage.value?.expiresAt) return circumference.value
  
  const totalTime = 24 * 60 * 60 * 1000 // 24 horas em ms
  const remaining = timeLeft.value.total
  const progress = Math.max(0, remaining / totalTime)
  
  return circumference.value - (progress * circumference.value)
})

// Methods
const getMessageIcon = (type: string) => {
  const icons = {
    last_spots: 'heroicons:users',
    timer: 'heroicons:clock',
    viewers: 'heroicons:eye',
    price_increase: 'heroicons:arrow-trending-up',
    booking_count: 'heroicons:calendar'
  }
  return icons[type as keyof typeof icons] || 'heroicons:information-circle'
}

const updateTimer = () => {
  if (timerMessage.value?.expiresAt) {
    timeLeft.value = getTimeLeft(timerMessage.value.expiresAt)
  }
}

const startTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timerInterval.value = setInterval(() => {
    updateTimer()
  }, 1000)
  
  updateTimer() // Initial update
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// Lifecycle
onMounted(async () => {
  if (props.autoLoad) {
    await loadUrgencyData(props.productId)
  }
  
  if (hasTimer.value) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})

// Watch for timer messages
watch(hasTimer, (newValue: boolean) => {
  if (newValue) {
    startTimer()
  } else {
    stopTimer()
  }
})
</script>

<style scoped>
.urgency-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.urgency-display__messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.urgency-display__message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 500;
  animation: urgencyPulse 2s infinite;
}

.urgency-display__message--low {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.urgency-display__message--medium {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.urgency-display__message--high {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  animation: urgencyBlink 1s infinite;
}

.urgency-display__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.urgency-display__text {
  flex: 1;
}

.urgency-display__warning-icon {
  width: 16px;
  height: 16px;
  color: #dc2626;
  animation: urgencyShake 0.5s infinite;
}

.urgency-display__timer {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.urgency-display__timer-circle {
  position: relative;
  width: 80px;
  height: 80px;
}

.urgency-display__timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.urgency-display__timer-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
}

.urgency-display__timer-progress {
  fill: none;
  stroke: #fc6807;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.urgency-display__timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.urgency-display__timer-time {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #fc6807;
  line-height: 1;
}

.urgency-display__timer-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1;
  margin-top: 0.25rem;
}

/* Animations */
@keyframes urgencyPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes urgencyBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.7; }
}

@keyframes urgencyShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Transition animations */
.urgency-enter-active,
.urgency-leave-active {
  transition: all 0.3s ease;
}

.urgency-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.urgency-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.urgency-move {
  transition: transform 0.3s ease;
}

/* Mobile */
@media (max-width: 768px) {
  .urgency-display__message {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .urgency-display__timer-circle {
    width: 60px;
    height: 60px;
  }

  .urgency-display__timer-time {
    font-size: 0.875rem;
  }

  .urgency-display__timer-label {
    font-size: 0.625rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .urgency-display__message--high {
    background: #000;
    color: #fff;
    border-color: #fff;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .urgency-display__message {
    animation: none;
  }

  .urgency-display__warning-icon {
    animation: none;
  }

  .urgency-display__timer-progress {
    transition: none;
  }
}
</style>
