/**
 * Composable para normalizar dados de produtos (tours e stays)
 * Corrige problemas de parsing de includes/excludes e outros campos
 */

import { getAllImages } from '@/utils/normalize'

export function useProductDetails() {
  
  /**
   * Normaliza includes/excludes de string ou array para array de strings
   */
  const normalizeIncludesExcludes = (data: string | string[] | null | undefined): string[] => {
    if (!data) return []
    
    if (Array.isArray(data)) {
      return data.filter(item => item && typeof item === 'string' && item.trim())
    }
    
    if (typeof data === 'string') {
      // Dividir por quebras de linha ou vírgulas, nunca por caracteres
      return data
        .split(/[\n,]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
    }
    
    return []
  }

  /**
   * Normaliza dados de tour da API
   */
  const normalizeTourDetails = (tour: any) => {
    return {
      ...tour,
      // Garantir que o título existe
      title: tour.title || tour.name || 'Título não disponível',
      includes: normalizeIncludesExcludes(tour.includes),
      excludes: normalizeIncludesExcludes(tour.excludes),
      itinerary: normalizeIncludesExcludes(tour.itinerary),
      // Campos específicos de tour
      duration: tour.duration || null,
      maxParticipants: tour.max_participants || tour.maxParticipants || null,
      minParticipants: tour.min_participants || tour.minParticipants || null,
      difficultyLevel: tour.difficulty_level || tour.difficultyLevel || null,
      meetingPoint: tour.meeting_point || tour.meetingPoint || null,
      cancellationPolicy: tour.cancellation_policy || tour.cancellationPolicy || null,
      // Preços
      price: tour.current_price || tour.price || tour.price_original || 0,
      priceOriginal: tour.price_original || tour.price || 0,
      hasPromotion: tour.has_promotion || false,
      // Imagens
      image: tour.main_image || tour.image || tour.cover_image || '/images/placeholder.webp',
      images: getAllImages(tour)
    }
  }

  /**
   * Normaliza dados de stay da API
   */
  const normalizeStayDetails = (stay: any) => {
    return {
      ...stay,
      // Garantir que o título existe
      title: stay.title || stay.name || 'Título não disponível',
      amenities: normalizeIncludesExcludes(stay.amenities),
      policies: normalizeIncludesExcludes(stay.policies),
      includes: normalizeIncludesExcludes(stay.includes),
      excludes: normalizeIncludesExcludes(stay.excludes),
      // Campos específicos de stay
      checkInTime: stay.check_in_time || stay.checkInTime || null,
      checkOutTime: stay.check_out_time || stay.checkOutTime || null,
      minNights: stay.min_nights || stay.minNights || 1,
      maxNights: stay.max_nights || stay.maxNights || 30,
      // Para accommodations, sempre permitir range selection
      allowRange: true,
      // Preços
      price: stay.current_price || stay.price || stay.price_original || 0,
      priceOriginal: stay.price_original || stay.price || 0,
      hasPromotion: stay.has_promotion || false,
      // Imagens
      image: stay.main_image || stay.image || stay.cover_image || '/images/placeholder.webp',
      images: getAllImages(stay)
    }
  }

  /**
   * Formata preço para exibição
   */
  const formatPrice = (price: number): string => {
    if (!price || price <= 0) return 'Consultar preço'
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  /**
   * Verifica se um produto tem promoção
   */
  const hasPromotion = (product: any): boolean => {
    return product.has_promotion || 
           (product.price_original && product.price_original > product.price) ||
           (product.price_promo && product.price_promo > 0)
  }

  return {
    normalizeIncludesExcludes,
    normalizeTourDetails,
    normalizeStayDetails,
    formatPrice,
    hasPromotion
  }
}
