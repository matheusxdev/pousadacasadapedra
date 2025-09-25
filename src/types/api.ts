export interface Tour {
  id: string
  type: 'tour'
  title: string
  subtitle?: string
  description?: string
  image: string
  price?: number
  rating?: number
  reviewsCount?: number
  slug: string
  location?: string
  badge?: string
  duration?: string
  capacity?: number
  minNights?: number
  includes?: string[]
  itinerary?: string[]
}

export interface Accommodation {
  id: string
  type: 'stay'
  title: string
  subtitle?: string
  description?: string
  image: string
  price?: number
  rating?: number
  reviewsCount?: number
  slug: string
  location?: string
  badge?: string
  amenities?: string[]
  policies?: Array<{
    type: string
    description: string
  }>
  checkInTime?: string
  checkOutTime?: string
  minNights?: number
  maxNights?: number
}

export interface FeaturedItem {
  id: string
  uuid?: string
  name?: string
  type: 'tour' | 'stay'
  title: string
  subtitle?: string
  description?: string
  image: string
  main_image?: string // Imagem principal da API StarHub
  images?: string[] | Array<{uuid: string, url: string, alt_text?: string}> // Array de todas as imagens disponíveis
  price?: number
  rating?: number
  reviewsCount?: number
  slug: string
  location?: string
  badge?: string
  hasPromotion?: boolean
  priceOriginal?: number
  category?: string
  // New properties from API extended
  discount_percentage?: number
  check_in_time?: string
  check_out_time?: string
  meeting_point?: string
  cancellation_policy?: string
  difficulty_level?: string
  // Tour specific properties
  duration?: string
  capacity?: number
  includes?: string[]
  excludes?: string[]
  itinerary?: string[]
  // Accommodation specific properties
  amenities?: string[]
  policies?: Array<{
    type: string
    description: string
  }>
  checkInTime?: string
  checkOutTime?: string
  minNights?: number
  maxNights?: number
}

export interface TourDetails {
  id: string
  title: string
  description: string
  duration?: string
  capacity?: {
    min: number
    max: number
  }
  minNights?: number
  maxNights?: number
  includes?: string[]
  excludes?: string[]
  itinerary?: string[]
  policies?: Array<{
    type: string
    description: string
  }>
}

export interface StayDetails {
  id: string
  title: string
  description: string
  amenities?: string[]
  policies?: Array<{
    type: string
    description: string
  }>
  checkInTime?: string
  checkOutTime?: string
  minNights?: number
  maxNights?: number
}
