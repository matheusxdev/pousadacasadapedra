<template>
  <div v-if="isClient" class="reviews-display">
    <!-- Header com estatísticas -->
    <div v-if="statistics" class="reviews-display__header">
      <div class="reviews-display__rating-summary">
        <div class="reviews-display__average-rating">
          <span class="reviews-display__rating-number">{{ statistics.averageRating }}</span>
          <div class="reviews-display__stars">
            <Icon
              v-for="star in generateStars(statistics.averageRating)"
              :key="star"
              :name="getStarIcon(star)"
              :class="[
                'reviews-display__star',
                `reviews-display__star--${star}`
              ]"
            />
          </div>
          <span class="reviews-display__total-reviews">
            {{ statistics.totalReviews }} {{ $t('reviews.totalReviews', 'avaliações') }}
          </span>
        </div>

        <div class="reviews-display__rating-breakdown">
          <div
            v-for="rating in statistics.ratingDistribution"
            :key="rating.rating"
            class="reviews-display__rating-bar"
          >
            <span class="reviews-display__rating-label">{{ rating.rating }}</span>
            <Icon name="heroicons:star-solid" class="reviews-display__rating-star" />
            <div class="reviews-display__rating-progress">
              <div
                class="reviews-display__rating-fill"
                :style="{ width: `${rating.percentage}%` }"
              />
            </div>
            <span class="reviews-display__rating-count">{{ rating.count }}</span>
          </div>
        </div>
      </div>

      <div class="reviews-display__verified-badge">
        <Icon name="heroicons:check-badge" class="reviews-display__verified-icon" />
        <span>{{ statistics.verifiedPercentage }}% {{ $t('reviews.verified', 'verificadas') }}</span>
      </div>
    </div>

    <!-- Filtros e ordenação -->
    <div class="reviews-display__controls">
      <div class="reviews-display__filters">
        <button
          v-for="rating in [5, 4, 3, 2, 1]"
          :key="rating"
          :class="[
            'reviews-display__filter-btn',
            { 'reviews-display__filter-btn--active': selectedRating === rating }
          ]"
          @click="toggleRatingFilter(rating)"
        >
          <Icon name="heroicons:star-solid" />
          {{ rating }}
        </button>
      </div>

      <div class="reviews-display__sort">
        <select v-model="sortBy" @change="handleSortChange" class="reviews-display__sort-select">
          <option value="newest">{{ $t('reviews.sort.newest', 'Mais recentes') }}</option>
          <option value="oldest">{{ $t('reviews.sort.oldest', 'Mais antigas') }}</option>
          <option value="rating_high">{{ $t('reviews.sort.ratingHigh', 'Melhor avaliação') }}</option>
          <option value="rating_low">{{ $t('reviews.sort.ratingLow', 'Pior avaliação') }}</option>
        </select>
      </div>
    </div>

    <!-- Lista de reviews -->
    <div class="reviews-display__list">
      <TransitionGroup name="review" tag="div">
        <div
          v-for="review in filteredReviews"
          :key="review.uuid"
          class="reviews-display__review"
        >
          <div class="reviews-display__review-header">
            <div class="reviews-display__reviewer">
              <div class="reviews-display__reviewer-avatar">
                {{ review.customer_name?.charAt(0) || 'U' }}
              </div>
              <div class="reviews-display__reviewer-info">
                <div class="reviews-display__reviewer-name">
                  {{ review.customer_name || 'Usuário' }}
                  <Icon
                    v-if="review.verified"
                    name="heroicons:check-badge"
                    class="reviews-display__reviewer-verified"
                  />
                </div>
                <div class="reviews-display__reviewer-location">
                  {{ review.date }}
                </div>
              </div>
            </div>

            <div class="reviews-display__review-meta">
              <div class="reviews-display__review-rating">
                <Icon
                  v-for="star in generateStars(review.rating)"
                  :key="star"
                  :name="getStarIcon(star)"
                  :class="[
                    'reviews-display__star',
                    `reviews-display__star--${star}`
                  ]"
                />
              </div>
              <div class="reviews-display__review-date">
                {{ formatReviewDate(review.date) }}
              </div>
            </div>
          </div>

          <div class="reviews-display__review-content">
            <h4 class="reviews-display__review-title">{{ review.comment }}</h4>
            <p class="reviews-display__review-comment">{{ review.comment }}</p>
          </div>

          <!-- Fotos do review (removido por enquanto) -->

          <div class="reviews-display__review-actions">
            <button
              @click="markAsHelpful(review.uuid)"
              class="reviews-display__helpful-btn"
            >
              <Icon name="heroicons:hand-thumb-up" />
              {{ $t('reviews.helpful', 'Útil') }} ({{ review.helpful_count }})
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Paginação -->
    <div v-if="hasMorePages" class="reviews-display__pagination">
      <button
        @click="loadMore"
        :disabled="loading"
        class="reviews-display__load-more"
      >
        <Icon v-if="loading" name="heroicons:arrow-path" class="reviews-display__loading-icon" />
        {{ $t('reviews.loadMore', 'Carregar mais avaliações') }}
      </button>
    </div>

    <!-- Modal de foto -->
    <div v-if="selectedPhoto" class="reviews-display__photo-modal" @click="closePhotoModal">
      <div class="reviews-display__photo-modal-content" @click.stop>
        <button @click="closePhotoModal" class="reviews-display__photo-modal-close">
          <Icon name="heroicons:x-mark" />
        </button>
        <img :src="selectedPhoto" alt="Foto do review" class="reviews-display__photo-modal-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useReviews } from '@/composables/useReviews'

// Props
interface Props {
  productId: string
  productType?: 'tour' | 'accommodation'
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productType: 'tour',
  autoLoad: true
})

// Client-side rendering control
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

// Composables
const {
  reviews,
  statistics,
  loading,
  loadReviews,
  markAsHelpful,
  generateStars,
  formatReviewDate
} = useReviews()

// State
const selectedRating = ref<number | null>(null)
const sortBy = ref('newest')
const currentPage = ref(1)
const selectedPhoto = ref<string | null>(null)

// Computed
const filteredReviews = computed(() => {
  let filtered = [...reviews.value]

  if (selectedRating.value) {
    filtered = filtered.filter(review => review.rating === selectedRating.value)
  }

  return filtered
})

const hasMorePages = computed(() => {
  // Assumindo que carregamos 10 por página
  return reviews.value.length >= currentPage.value * 10
})

// Methods
const getStarIcon = (star: string) => {
  if (star === 'full') return 'heroicons:star-solid'
  if (star === 'half') return 'heroicons:star-solid' // Você pode criar um ícone de meia estrela
  return 'heroicons:star'
}

const toggleRatingFilter = (rating: number) => {
  selectedRating.value = selectedRating.value === rating ? null : rating
}

const handleSortChange = async () => {
  currentPage.value = 1
  await loadReviews({
    productId: props.productId,
    productType: props.productType,
    sort: sortBy.value as any,
    page: currentPage.value
  })
}

const loadMore = async () => {
  currentPage.value++
  await loadReviews({
    productId: props.productId,
    productType: props.productType,
    sort: sortBy.value as any,
    page: currentPage.value
  })
}

const openPhotoModal = (photo: string) => {
  selectedPhoto.value = photo
}

const closePhotoModal = () => {
  selectedPhoto.value = null
}

// Lifecycle
if (props.autoLoad) {
  loadReviews({
    productId: props.productId,
    productType: props.productType
  })
}
</script>

<style scoped>
.reviews-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.reviews-display__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 12px;
}

.reviews-display__rating-summary {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.reviews-display__average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.reviews-display__rating-number {
  font-size: 3rem;
  font-weight: 700;
  color: #002279;
  line-height: 1;
}

.reviews-display__stars {
  display: flex;
  gap: 0.25rem;
}

.reviews-display__star {
  width: 20px;
  height: 20px;
}

.reviews-display__star--full {
  color: #fbbf24;
}

.reviews-display__star--half {
  color: #fbbf24;
}

.reviews-display__star--empty {
  color: #d1d5db;
}

.reviews-display__total-reviews {
  color: #6b7280;
  font-size: 0.875rem;
}

.reviews-display__rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.reviews-display__rating-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviews-display__rating-label {
  width: 16px;
  font-size: 0.875rem;
  color: #374151;
}

.reviews-display__rating-star {
  width: 12px;
  height: 12px;
  color: #fbbf24;
}

.reviews-display__rating-progress {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.reviews-display__rating-fill {
  height: 100%;
  background: #fbbf24;
  transition: width 0.3s ease;
}

.reviews-display__rating-count {
  width: 32px;
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}

.reviews-display__verified-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.reviews-display__verified-icon {
  width: 16px;
  height: 16px;
}

.reviews-display__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.reviews-display__filters {
  display: flex;
  gap: 0.5rem;
}

.reviews-display__filter-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reviews-display__filter-btn:hover {
  background: #f9fafb;
}

.reviews-display__filter-btn--active {
  background: #fc6807;
  color: white;
  border-color: #fc6807;
}

.reviews-display__sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
}

.reviews-display__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reviews-display__review {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.reviews-display__review:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reviews-display__review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviews-display__reviewer {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reviews-display__reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.reviews-display__reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reviews-display__reviewer-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.reviews-display__reviewer-verified {
  width: 16px;
  height: 16px;
  color: #059669;
}

.reviews-display__reviewer-location {
  font-size: 0.875rem;
  color: #6b7280;
}

.reviews-display__review-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.reviews-display__review-rating {
  display: flex;
  gap: 0.25rem;
}

.reviews-display__review-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.reviews-display__review-content {
  margin-bottom: 1rem;
}

.reviews-display__review-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.reviews-display__review-comment {
  color: #6b7280;
  line-height: 1.6;
}

.reviews-display__review-photos {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.reviews-display__photo-thumb,
.reviews-display__photo-more {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.reviews-display__photo-thumb:hover,
.reviews-display__photo-more:hover {
  transform: scale(1.05);
}

.reviews-display__photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviews-display__photo-more {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-weight: 600;
}

.reviews-display__review-actions {
  display: flex;
  justify-content: flex-end;
}

.reviews-display__helpful-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reviews-display__helpful-btn:hover {
  background: #f3f4f6;
}

.reviews-display__pagination {
  display: flex;
  justify-content: center;
}

.reviews-display__load-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #fc6807;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reviews-display__load-more:hover:not(:disabled) {
  background: #e55a06;
}

.reviews-display__load-more:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.reviews-display__loading-icon {
  animation: spin 1s linear infinite;
}

.reviews-display__photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.reviews-display__photo-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.reviews-display__photo-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviews-display__photo-modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* Transitions */
.review-enter-active,
.review-leave-active {
  transition: all 0.3s ease;
}

.review-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.review-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.review-move {
  transition: transform 0.3s ease;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 768px) {
  .reviews-display__header {
    flex-direction: column;
    gap: 1rem;
  }

  .reviews-display__rating-summary {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .reviews-display__rating-breakdown {
    min-width: auto;
    width: 100%;
  }

  .reviews-display__controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .reviews-display__filters {
    flex-wrap: wrap;
  }

  .reviews-display__review-header {
    flex-direction: column;
    gap: 1rem;
  }

  .reviews-display__review-meta {
    align-items: flex-start;
  }
}
</style>
