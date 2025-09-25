import { ref, computed, readonly } from 'vue'

export interface Review {
  uuid: string
  customer_name: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful_count: number
  response?: {
    message: string
    date: string
    manager_name: string
  }
  // Campos adicionais para compatibilidade
  id?: string
  productId?: string
  productType?: 'tour' | 'accommodation'
  title?: string
  createdAt?: string
  helpful?: number
  photos?: string[]
}

export interface ReviewStatistics {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
  verifiedPercentage: number
}

export interface ReviewsResponse {
  success: boolean
  data: {
    reviews: Review[]
    statistics: ReviewStatistics
    pagination: {
      current_page: number
      per_page: number
      total_items: number
      total_pages: number
      has_next_page: boolean
      has_prev_page: boolean
    }
  }
  meta: {
    product_id: string
    product_type: string
    generated_at: string
    mock_data: boolean
  }
}

export interface ReviewFilters {
  productId: string
  productType?: 'tour' | 'accommodation'
  page?: number
  limit?: number
  sort?: 'newest' | 'oldest' | 'rating_high' | 'rating_low'
  rating?: number
  verified?: boolean
}

export function useReviews() {
  const reviews = ref<Review[]>([])
  const statistics = ref<ReviewStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Carregar reviews
  const loadReviews = async (filters: ReviewFilters): Promise<ReviewsResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ReviewsResponse>('/api/reviews', {
        query: filters
      })

      reviews.value = response.data.reviews || []
      statistics.value = response.data.statistics || {}

      return response
    } catch (err) {
      error.value = 'Erro ao carregar avaliações'
      console.error('Reviews error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Adicionar review (simulado - em produção seria POST)
  const addReview = async (reviewData: {
    productId: string
    productType: 'tour' | 'accommodation'
    rating: number
    title: string
    comment: string
    authorName: string
    authorLocation: string
    photos?: string[]
  }): Promise<Review> => {
    const newReview: Review = {
      uuid: `review_${Date.now()}`,
      productId: reviewData.productId,
      productType: reviewData.productType,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      customer_name: reviewData.authorName,
      date: new Date().toISOString(),
      helpful_count: 0,
      verified: false,
      photos: reviewData.photos || []
    }

    // Adicionar ao início da lista
    reviews.value.unshift(newReview)

    // Recalcular estatísticas
    await recalculateStatistics(reviewData.productId)

    return newReview
  }

  // Marcar review como útil
  const markAsHelpful = async (reviewId: string): Promise<void> => {
    const review = reviews.value.find(r => r.uuid === reviewId)
    if (review) {
      review.helpful_count++
    }
  }

  // Recalcular estatísticas
  const recalculateStatistics = async (productId: string): Promise<void> => {
    const productReviews = reviews.value.filter(r => r.productId === productId)
    
    if (productReviews.length === 0) return

    const totalReviews = productReviews.length
    const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: productReviews.filter(r => r.rating === rating).length,
      percentage: Math.round((productReviews.filter(r => r.rating === rating).length / totalReviews) * 100)
    }))

    const verifiedPercentage = Math.round((productReviews.filter(r => r.verified).length / totalReviews) * 100)

    statistics.value = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
      verifiedPercentage
    }
  }

  // Filtrar reviews por rating
  const filterByRating = (rating: number): Review[] => {
    return reviews.value.filter(review => review.rating === rating)
  }

  // Filtrar reviews verificadas
  const filterVerified = (): Review[] => {
    return reviews.value.filter(review => review.verified)
  }

  // Obter reviews mais recentes
  const getRecentReviews = (limit: number = 5): Review[] => {
    return [...reviews.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  // Obter reviews mais úteis
  const getMostHelpfulReviews = (limit: number = 5): Review[] => {
    return [...reviews.value]
      .sort((a, b) => b.helpful_count - a.helpful_count)
      .slice(0, limit)
  }

  // Formatar data do review
  const formatReviewDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `Há ${diffDays} dias`
    if (diffDays < 30) return `Há ${Math.ceil(diffDays / 7)} semanas`
    if (diffDays < 365) return `Há ${Math.ceil(diffDays / 30)} meses`
    
    return date.toLocaleDateString('pt-BR')
  }

  // Gerar estrelas para rating
  const generateStars = (rating: number): string[] => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('full')
      } else if (i - rating < 1) {
        stars.push('half')
      } else {
        stars.push('empty')
      }
    }
    return stars
  }

  // Obter texto do rating
  const getRatingText = (rating: number): string => {
    const texts = {
      5: 'Excelente',
      4: 'Muito bom',
      3: 'Bom',
      2: 'Regular',
      1: 'Ruim'
    }
    return texts[rating as keyof typeof texts] || 'N/A'
  }

  // Computed properties
  const hasReviews = computed(() => reviews.value.length > 0)
  const averageRating = computed(() => statistics.value?.averageRating || 0)
  const totalReviews = computed(() => statistics.value?.totalReviews || 0)
  const verifiedReviews = computed(() => reviews.value.filter(r => r.verified))
  const hasPhotos = computed(() => reviews.value.some(r => r.photos && r.photos.length > 0))

  return {
    // State
    reviews: readonly(reviews),
    statistics: readonly(statistics),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    hasReviews,
    averageRating,
    totalReviews,
    verifiedReviews,
    hasPhotos,

    // Methods
    loadReviews,
    addReview,
    markAsHelpful,
    recalculateStatistics,
    filterByRating,
    filterVerified,
    getRecentReviews,
    getMostHelpfulReviews,
    formatReviewDate,
    generateStars,
    getRatingText
  }
}
