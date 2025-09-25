/**
 * Composable para usar as novas rotas unificadas da API
 * Resolve o problema N+1 com uma única requisição
 */

import { ref, computed, readonly } from 'vue'
import { useLocalCache } from './useLocalCache'

export interface UnifiedProductFilters {
  // Paginação
  page?: number
  limit?: number
  
  // Filtros
  search?: string
  category?: string
  type?: string
  min_price?: number
  max_price?: number
  location?: string
  
  // Inclusão de dados
  include_images?: boolean
  include_reviews?: boolean
  include_availability?: boolean
  include_related?: boolean
  include_delivery?: boolean
  include_inventory?: boolean
  
  // Cache
  nocache?: boolean
}

export interface UnifiedProduct {
  uuid: string
  name: string
  slug: string
  description: string
  type: string
  price_original: number
  price_promo?: number
  current_price: number
  discount_percentage: number
  stock: number
  in_stock: boolean
  main_image: string
  location: string
  
  // Campos específicos de accommodation
  min_nights?: number
  max_nights?: number
  check_in_time?: string
  check_out_time?: string
  amenities?: string
  policies?: string
  
  // Campos específicos de tour
  duration?: string
  max_participants?: number
  min_participants?: number
  difficulty_level?: string
  
  // Dados relacionados (quando incluídos)
  images?: Array<{
    uuid: string
    url: string
    alt_text?: string
    order: number
  }>
  avg_rating?: number
  reviews_count?: number
  recent_reviews?: Array<{
    uuid: string
    customer_name: string
    rating: number
    comment: string
    date: string
    verified: boolean
  }>
  availability?: Array<{
    available_date: string
    price_per_night: number
    max_guests: number
    available_spots: number
  }>
  related_products?: Array<{
    uuid: string
    name: string
    current_price: number
    main_image: string
  }>
}

export interface UnifiedResponse {
  success: boolean
  data: UnifiedProduct[]
  pagination: {
    current_page: number
    per_page: number
    total_items: number
    total_pages: number
    has_next_page: boolean
    has_prev_page: boolean
  }
  meta: {
    total_products: number
    generated_at: string
    performance: {
      single_request: boolean
      batch_queries?: boolean
      cache_enabled?: boolean
      quick_mode?: boolean
    }
  }
}

export const useUnifiedProducts = () => {
  const { set: setCache, get: getCache, clear: clearCache } = useLocalCache()
  
  const products = ref<UnifiedProduct[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<any>(null)
  const meta = ref<any>(null)
  
  const filters = ref<UnifiedProductFilters>({
    page: 1,
    limit: 20,
    include_images: true,
    include_reviews: true,
    include_availability: false,
    include_related: false,
    include_delivery: false,
    include_inventory: false,
    nocache: false
  })

  /**
   * Buscar produtos usando a rota unificada completa
   */
  const getProductsUnified = async (customFilters: Partial<UnifiedProductFilters> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const finalFilters = { ...filters.value, ...customFilters }
      
      // Gerar chave de cache
      const cacheKey = `unified_products_${JSON.stringify(finalFilters)}`
      
      // Verificar cache primeiro (se não for nocache)
      if (!finalFilters.nocache) {
        const cached = getCache<UnifiedResponse>(cacheKey)
        if (cached) {
          products.value = cached.data
          pagination.value = cached.pagination
          meta.value = cached.meta
          loading.value = false
          return cached
        }
      }
      
      const response = await $fetch<UnifiedResponse>('/api/products/unified', {
        method: 'GET',
        query: finalFilters
      })
      
      if (response.success) {
        products.value = response.data
        pagination.value = response.pagination
        meta.value = response.meta
        
        // Salvar no cache (5 minutos)
        if (!finalFilters.nocache) {
          setCache(cacheKey, response, 5 * 60 * 1000)
        }
        
        
        return response
      } else {
        throw new Error('API returned unsuccessful response')
      }
      
    } catch (err: any) {
      console.error('❌ Error fetching unified products:', err)
      error.value = err.message || 'Erro ao carregar produtos'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar produtos usando a rota rápida (dados essenciais apenas)
   */
  const getProductsQuick = async (customFilters: Partial<UnifiedProductFilters> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const finalFilters = { ...filters.value, ...customFilters }
      
      // Gerar chave de cache específica para quick
      const cacheKey = `unified_products_quick_${JSON.stringify(finalFilters)}`
      
      // Verificar cache primeiro
      if (!finalFilters.nocache) {
        const cached = getCache<UnifiedResponse>(cacheKey)
        if (cached) {
          products.value = cached.data
          pagination.value = cached.pagination
          meta.value = cached.meta
          loading.value = false
          return cached
        }
      }
      
      const response = await $fetch<UnifiedResponse>('/api/products/unified/quick', {
        method: 'GET',
        query: finalFilters
      })
      
      if (response.success) {
        products.value = response.data
        pagination.value = response.pagination
        meta.value = response.meta
        
        // Salvar no cache (3 minutos para quick)
        if (!finalFilters.nocache) {
          setCache(cacheKey, response, 3 * 60 * 1000)
        }
        
        
        return response
      } else {
        throw new Error('API returned unsuccessful response')
      }
      
    } catch (err: any) {
      console.error('❌ Error fetching quick products:', err)
      error.value = err.message || 'Erro ao carregar produtos'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar accommodations com dados completos
   */
  const getAccommodationsUnified = async (customFilters: Partial<UnifiedProductFilters> = {}) => {
    return getProductsUnified({
      type: 'accommodation',
      include_images: true,
      include_reviews: true,
      include_availability: true,
      include_related: true,
      limit: 100,
      ...customFilters
    })
  }

  /**
   * Buscar tours com dados completos
   */
  const getToursUnified = async (customFilters: Partial<UnifiedProductFilters> = {}) => {
    return getProductsUnified({
      type: 'tour',
      include_images: true,
      include_reviews: true,
      include_availability: false,
      include_related: true,
      limit: 100,
      ...customFilters
    })
  }

  /**
   * Buscar produto específico por slug/UUID
   */
  const getProductBySlug = async (slug: string, includeDetails = true) => {
    // Primeiro tentar encontrar na lista já carregada
    const existingProduct = products.value.find(p => p.slug === slug || p.uuid === slug)
    if (existingProduct) {
      return existingProduct
    }

    // Se não encontrar, buscar específico
    const response = await getProductsUnified({
      search: slug,
      include_images: includeDetails,
      include_reviews: includeDetails,
      include_availability: includeDetails,
      limit: 1,
      nocache: true
    })
    
    return response.data[0] || null
  }

  /**
   * Limpar cache
   */
  const clearProductsCache = () => {
    clearCache()
  }

  /**
   * Atualizar filtros
   */
  const updateFilters = (newFilters: Partial<UnifiedProductFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * Resetar estado
   */
  const reset = () => {
    products.value = []
    pagination.value = null
    meta.value = null
    error.value = null
    loading.value = false
  }

  return {
    // Estado
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    meta: readonly(meta),
    filters: readonly(filters),
    
    // Métodos
    getProductsUnified,
    getProductsQuick,
    getAccommodationsUnified,
    getToursUnified,
    getProductBySlug,
    updateFilters,
    clearProductsCache,
    reset
  }
}
