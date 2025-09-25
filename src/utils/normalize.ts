/**
 * Normalization utilities for StarHub API data
 * Handles image URLs and price formatting consistently
 */

export interface DisplayPrice {
  hasPrice: boolean
  text: string
  value?: number
}

/**
 * Get primary image URL from StarHub API item
 * Checks common image fields in order of priority
 */
export function getPrimaryImage(item: any): string {
  if (!item) return 'https://starhubsolutions.com/img/product-no-image.webp'
  
  // Image lookup order based on actual API response
  const imageFields = [
    item.main_image,        // Primary field from API
    item.cover,
    item.image,
    item.cover_image,
    item.featured_image,
    item.thumbnail,
    item.gallery?.[0]?.url,
    item.images?.[0]?.url,
    item.media?.[0]?.url
  ]
  
  for (const imageField of imageFields) {
    if (imageField && typeof imageField === 'string' && imageField.trim() !== '') {
      // If already a complete URL, return as is
      if (imageField.startsWith('http')) {
        return imageField
      }
      
      // If relative path, prefix with API base
      if (imageField.startsWith('/')) {
        return `${getApiBaseUrl()}${imageField}`
      }
      
      // If no leading slash, add it
      return `${getApiBaseUrl()}/${imageField}`
    }
  }
  
  // Fallback to placeholder
  return 'https://starhubsolutions.com/img/product-no-image.webp'
}

/**
 * Get all images from StarHub API item
 * Returns array of all available images
 */
export function getAllImages(item: any): string[] {
  if (!item) return []
  
  const images: string[] = []
  const baseUrl = getApiBaseUrl()
  
  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string): string => {
    if (url && typeof url === 'string' && url.trim() !== '') {
      if (url.startsWith('http')) {
        return url
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      return `${baseUrl}/${url}`
    }
    return ''
  }
  
  // Check single image fields
  const singleImageFields = [
    item.main_image,
    item.cover,
    item.image,
    item.cover_image,
    item.featured_image,
    item.thumbnail
  ]
  
  for (const imageField of singleImageFields) {
    const normalizedUrl = normalizeImageUrl(imageField)
    if (normalizedUrl && !images.includes(normalizedUrl)) {
      images.push(normalizedUrl)
    }
  }
  
  // Check gallery arrays - priorizar o campo 'images' da API
  const galleryFields = [
    item.images,  // Campo principal da API /products/extended/{uuid}
    item.gallery,
    item.media
  ]
  
  for (const gallery of galleryFields) {
    if (Array.isArray(gallery)) {
      for (const galleryItem of gallery) {
        if (typeof galleryItem === 'string') {
          const normalizedUrl = normalizeImageUrl(galleryItem)
          if (normalizedUrl && !images.includes(normalizedUrl)) {
            images.push(normalizedUrl)
          }
        } else if (galleryItem && typeof galleryItem === 'object') {
          // API retorna objetos com propriedade 'url'
          const imageUrl = galleryItem.url || galleryItem.src || galleryItem.image || galleryItem.path
          if (imageUrl) {
            const normalizedUrl = normalizeImageUrl(imageUrl)
            if (normalizedUrl && !images.includes(normalizedUrl)) {
              images.push(normalizedUrl)
            }
          }
        }
      }
    }
  }
  
  // If no images found, add placeholder
  if (images.length === 0) {
    images.push('https://starhubsolutions.com/img/product-no-image.webp')
  }
  
  return images
}

/**
 * Get display price information from StarHub API item
 * Formats price or shows "Consultar preço" when missing
 */
export function getDisplayPrice(item: any): DisplayPrice {
  if (!item) {
    return {
      hasPrice: false,
      text: 'Consultar preço'
    }
  }
  
  // Extract price values safely, handling Proxy objects
  const extractPriceValue = (priceField: any): number | null => {
    if (priceField === null || priceField === undefined || priceField === '' || priceField === 0) {
      return null
    }
    
    // Handle Proxy objects by accessing their value
    if (typeof priceField === 'object' && priceField !== null) {
      // Try to get the actual value from Proxy
      try {
        const value = priceField.valueOf ? priceField.valueOf() : priceField
        if (typeof value === 'number') return value
        if (typeof value === 'string') {
          const parsed = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
          return isNaN(parsed) ? null : parsed
        }
      } catch (e) {
        // If Proxy access fails, try direct access
        if (priceField.value !== undefined) {
          return extractPriceValue(priceField.value)
        }
      }
      return null
    }
    
    // Handle string prices
    if (typeof priceField === 'string') {
      const parsed = parseFloat(priceField.replace(/[^\d.,]/g, '').replace(',', '.'))
      return isNaN(parsed) ? null : parsed
    }
    
    // Handle number prices
    if (typeof priceField === 'number') {
      return priceField
    }
    
    return null
  }
  
  // Price field priority order based on actual API response
  const priceFields = [
    item.current_price,    // Primary field from API
    item.price,           // Secondary field from API
    item.price_original,  // Original price
    item.price_promo,     // Promotional price
    item.cust_price,      // Custom price
    item.from_price,
    item.min_price,
    item.base_price,
    item.rate,
    item.cost
  ]
  
  for (const priceField of priceFields) {
    const numericPrice = extractPriceValue(priceField)
    
    if (numericPrice !== null && numericPrice > 0) {
      return {
        hasPrice: true,
        text: formatCurrency(numericPrice),
        value: numericPrice
      }
    }
  }
  
  return {
    hasPrice: false,
    text: 'Consultar preço'
  }
}

/**
 * Format currency value to Brazilian Real
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Get API base URL from runtime config
 */
function getApiBaseUrl(): string {
  try {
    const config = useRuntimeConfig()
    return config.public.starhubBaseUrl || '/api'
  } catch {
    return '/api'
  }
}

/**
 * Normalize tour data for consistent display
 */
export function normalizeTourData(tour: any): any {
  return {
    id: tour.uuid || tour.id || tour.slug, // Fallback para slug se não houver UUID/ID
    uuid: tour.uuid, // Preservar UUID original se existir
    name: tour.name, // Preservar name original se existir
    type: 'tour',
    title: tour.name || tour.title,
    subtitle: tour.description,
    description: tour.description, // Adicionar campo description explícito
    image: getPrimaryImage(tour),
    images: getAllImages(tour), // Adicionar todas as imagens
    rating: tour.rating,
    reviewsCount: tour.reviews_count,
    slug: tour.slug || tour.uuid,
    location: tour.location,
    badge: tour.has_promotion ? 'Promoção' : null,
    hasPromotion: tour.has_promotion || false,
    priceOriginal: tour.price_original || tour.price,
    duration: tour.duration,
    maxParticipants: tour.max_participants,
    minParticipants: tour.min_participants,
    difficultyLevel: tour.difficulty_level,
    includes: tour.includes,
    excludes: tour.excludes,
    meetingPoint: tour.meeting_point,
    cancellationPolicy: tour.cancellation_policy,
    // Preserve original price fields for getDisplayPrice
    current_price: tour.current_price,
    price: tour.price,
    price_original: tour.price_original,
    price_promo: tour.price_promo,
    cust_price: tour.cust_price,
    from_price: tour.from_price,
    min_price: tour.min_price,
    base_price: tour.base_price,
    rate: tour.rate,
    cost: tour.cost
  }
}

/**
 * Normalize stay data for consistent display
 */
export function normalizeStayData(stay: any): any {
  return {
    id: stay.uuid || stay.id,
    type: 'stay',
    title: stay.name || stay.title,
    subtitle: stay.description,
    description: stay.description, // Adicionar campo description explícito
    image: getPrimaryImage(stay),
    images: getAllImages(stay), // Adicionar todas as imagens
    rating: stay.rating,
    reviewsCount: stay.reviews_count,
    slug: stay.slug || stay.uuid,
    location: stay.location,
    badge: stay.has_promotion ? 'Promoção' : null,
    hasPromotion: stay.has_promotion || false,
    priceOriginal: stay.price_original || stay.price,
    duration: stay.duration,
    maxParticipants: stay.max_participants,
    minParticipants: stay.min_participants,
    checkInTime: stay.check_in_time,
    checkOutTime: stay.check_out_time,
    amenities: stay.amenities,
    policies: stay.policies,
    includes: stay.includes,
    excludes: stay.excludes,
    meetingPoint: stay.meeting_point,
    cancellationPolicy: stay.cancellation_policy,
    // Campos específicos para accommodations (min/max nights)
    minNights: stay.min_nights || stay.minNights,
    maxNights: stay.max_nights || stay.maxNights,
    min_nights: stay.min_nights, // Preservar campo original da API
    max_nights: stay.max_nights, // Preservar campo original da API
    // Preserve original price fields for getDisplayPrice
    current_price: stay.current_price,
    price: stay.price,
    price_original: stay.price_original,
    price_promo: stay.price_promo,
    cust_price: stay.cust_price,
    from_price: stay.from_price,
    min_price: stay.min_price,
    base_price: stay.base_price,
    rate: stay.rate,
    cost: stay.cost
  }
}
