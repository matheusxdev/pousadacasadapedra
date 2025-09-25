<template>
  <ClientOnly>
    <div v-if="socialData && hasActiveProof" class="social-proof">
      <div class="social-proof__container">
        <!-- Viewers Counter -->
        <div v-if="socialData.viewersCount" class="social-proof__item social-proof__viewers">
          <div class="social-proof__icon">
            <Icon name="heroicons:eye" />
          </div>
          <div class="social-proof__content">
            <span class="social-proof__number">{{ socialData.viewersCount }}</span>
            <span class="social-proof__label">
              {{ socialData.viewersCount === 1 ? 'pessoa' : 'pessoas' }} vendo agora
            </span>
          </div>
          <div class="social-proof__pulse"></div>
        </div>

        <!-- Recent Bookings -->
        <div v-if="socialData.recentBookings" class="social-proof__item social-proof__bookings">
          <div class="social-proof__icon">
            <Icon name="heroicons:calendar-days" />
          </div>
          <div class="social-proof__content">
            <span class="social-proof__number">{{ socialData.recentBookings }}</span>
            <span class="social-proof__label">reservas nas últimas 24h</span>
          </div>
        </div>

        <!-- Popular Times -->
        <div v-if="socialData.popularTimes" class="social-proof__item social-proof__times">
          <div class="social-proof__icon">
            <Icon name="heroicons:clock" />
          </div>
          <div class="social-proof__content">
            <span class="social-proof__label">Horário popular:</span>
            <span class="social-proof__time">{{ socialData.popularTimes }}</span>
          </div>
        </div>

        <!-- Location Popularity -->
        <div v-if="socialData.locationRank" class="social-proof__item social-proof__location">
          <div class="social-proof__icon">
            <Icon name="heroicons:map-pin" />
          </div>
          <div class="social-proof__content">
            <span class="social-proof__label">#{{ socialData.locationRank }} mais procurado</span>
            <span class="social-proof__location-name">{{ socialData.locationName }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div v-if="recentActivity.length > 0" class="social-proof__activity">
        <div class="social-proof__activity-header">
          <Icon name="heroicons:chat-bubble-left-right" />
          <span>Atividade recente</span>
        </div>
        <div class="social-proof__activity-list">
          <TransitionGroup name="activity-fade" tag="div">
            <div 
              v-for="activity in displayActivities" 
              :key="activity.id"
              class="social-proof__activity-item"
            >
              <div class="social-proof__activity-avatar">
                <img 
                  :src="activity.avatar" 
                  :alt="activity.name"
                  :title="activity.name"
                />
              </div>
              <div class="social-proof__activity-content">
                <span class="social-proof__activity-name">{{ activity.name }}</span>
                <span class="social-proof__activity-action">{{ activity.action }}</span>
                <span class="social-proof__activity-time">{{ formatTimeAgo(activity.timestamp) }}</span>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SocialData {
  viewersCount?: number
  recentBookings?: number
  popularTimes?: string
  locationRank?: number
  locationName?: string
}

interface ActivityItem {
  id: string
  name: string
  action: string
  avatar: string
  timestamp: number
}

interface Props {
  productId: string
  productType?: 'tour' | 'accommodation'
  location?: string
  showActivity?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productType: 'tour',
  showActivity: true
})

// State
const socialData = ref<SocialData | null>(null)
const recentActivity = ref<ActivityItem[]>([])
const activityInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const hasActiveProof = computed(() => {
  return socialData.value && (
    socialData.value.viewersCount ||
    socialData.value.recentBookings ||
    socialData.value.popularTimes ||
    socialData.value.locationRank
  )
})

const displayActivities = computed(() => {
  return recentActivity.value.slice(0, 3) // Show max 3 activities
})

// Methods
const generateSocialData = async () => {
  // Simulate API call for social proof data
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  socialData.value = {
    viewersCount: Math.floor(Math.random() * 15) + 3, // 3-17 viewers
    recentBookings: Math.floor(Math.random() * 25) + 5, // 5-29 bookings
    popularTimes: getRandomPopularTime(),
    locationRank: Math.floor(Math.random() * 10) + 1, // 1-10 rank
    locationName: props.location || getRandomLocation()
  }
}

const generateRecentActivity = () => {
  const names = [
    'Maria Silva', 'João Santos', 'Ana Costa', 'Carlos Oliveira', 'Lucia Ferreira',
    'Pedro Lima', 'Fernanda Rocha', 'Roberto Alves', 'Juliana Nunes', 'Marcos Pereira'
  ]
  
  const cities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
    'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Búzios'
  ]
  
  const actions = [
    'reservou este tour',
    'está vendo este tour',
    'adicionou aos favoritos',
    'compartilhou este tour',
    'avaliou este tour'
  ]
  
  const newActivity: ActivityItem = {
    id: `activity_${Date.now()}_${Math.random()}`,
    name: names[Math.floor(Math.random() * names.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[Math.floor(Math.random() * names.length)])}&background=fc6807&color=fff&size=40`,
    timestamp: Date.now() - Math.floor(Math.random() * 3600 * 1000) // Last hour
  }
  
  recentActivity.value.unshift(newActivity)
  
  // Keep only last 10 activities
  if (recentActivity.value.length > 10) {
    recentActivity.value = recentActivity.value.slice(0, 10)
  }
}

const getRandomPopularTime = () => {
  const times = ['9h-11h', '14h-16h', '10h-12h', '15h-17h', '8h-10h']
  return times[Math.floor(Math.random() * times.length)]
}

const getRandomLocation = () => {
  const locations = ['Búzios', 'Cabo Frio', 'Arraial do Cabo', 'Paraty', 'Angra dos Reis']
  return locations[Math.floor(Math.random() * locations.length)]
}

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}m atrás`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

const startActivityGeneration = () => {
  if (props.showActivity) {
    // Generate initial activities
    for (let i = 0; i < 3; i++) {
      generateRecentActivity()
    }
    
    // Generate new activity every 15-30 seconds
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 15000) + 15000 // 15-30 seconds
      activityInterval.value = setTimeout(() => {
        generateRecentActivity()
        scheduleNext()
      }, delay)
    }
    
    scheduleNext()
  }
}

const stopActivityGeneration = () => {
  if (activityInterval.value) {
    clearTimeout(activityInterval.value)
    activityInterval.value = null
  }
}

// Lifecycle
onMounted(async () => {
  await generateSocialData()
  startActivityGeneration()
})

onUnmounted(() => {
  stopActivityGeneration()
})
</script>

<style scoped>
.social-proof {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1rem 0;
}

.social-proof__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-proof__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.social-proof__icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-proof__content {
  flex: 1;
  min-width: 0;
}

.social-proof__number {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.social-proof__label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.2;
}

.social-proof__time {
  font-weight: 600;
  color: #059669;
}

.social-proof__location-name {
  font-weight: 600;
  color: #7c3aed;
}

.social-proof__viewers .social-proof__pulse {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.social-proof__activity {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.social-proof__activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.social-proof__activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-proof__activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #f1f5f9;
}

.social-proof__activity-avatar {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
}

.social-proof__activity-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.social-proof__activity-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.social-proof__activity-name {
  font-weight: 600;
  color: #374151;
}

.social-proof__activity-action {
  color: #6b7280;
}

.social-proof__activity-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.activity-fade-enter-active,
.activity-fade-leave-active {
  transition: all 0.5s ease;
}

.activity-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.activity-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .social-proof__container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .social-proof__item {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .social-proof__icon {
    width: 2rem;
    height: 2rem;
  }
  
  .social-proof__number {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .social-proof__activity-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
