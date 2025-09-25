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
  type: 'tour' | 'stay'
  title: string
  subtitle?: string
  image: string
  price?: number
  rating?: number
  reviewsCount?: number
  slug: string
  location?: string
  badge?: string
}

export interface TourDetails {
  id: string
  title: string
  description: string
  duration?: string
  capacity?: number
  minNights?: number
  maxNights?: number
  includes?: string[]
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
