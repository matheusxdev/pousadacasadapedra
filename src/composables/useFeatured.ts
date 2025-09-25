import { ref, readonly } from 'vue'
import type { FeaturedItem } from '~/types/api'
import { normalizeTourData, normalizeStayData } from '@/utils/normalize'
import { useLocalCache } from './useLocalCache'
import { useUnifiedProducts } from './useUnifiedProducts'

export type { FeaturedItem }

export interface FeaturedFilters {
  limit?: number
  page?: number
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  type?: string
}

export const useFeatured = () => {
  const { api } = useStarhubApi()
  const { set: setCache, get: getCache, clear: clearCache } = useLocalCache()
  
  const getFeaturedTours = async (filters: FeaturedFilters = {}) => {
    // DESATIVADO TEMPORARIAMENTE - FOCANDO APENAS EM POUSADAS
    console.warn('getFeaturedTours está desativado temporariamente - focando apenas em pousadas')
    
    const loading = ref(false)
    const error = ref<string | null>(null)
    const data = ref<FeaturedItem[]>([])
    
    return {
      data,
      loading: readonly(loading),
      error: readonly(error)
    }
  }
  
  const getFeaturedStays = async (filters: FeaturedFilters = {}) => {
    const loading = ref(true)
    const error = ref<string | null>(null)
    const data = ref<FeaturedItem[]>([])
    
    try {
      loading.value = true
      error.value = null
      
      // Limpar cache antigo de accommodations que pode conter dados misturados
      const oldCacheKeys = ['stays_{}', 'stays_{"limit":100}', 'stays_{"limit":100,"page":1}']
      oldCacheKeys.forEach(key => clearCache(key))
      
      const cacheKey = `stays_${JSON.stringify(filters)}`
      
      // Tenta buscar do cache primeiro (mas só se não tiver filtro de tipo antigo)
      const cachedData = getCache<FeaturedItem[]>(cacheKey)
      if (cachedData && cachedData.length > 0) {
        // Verificar se os dados em cache são realmente de accommodations
        const hasOnlyAccommodations = cachedData.every(item => 
          item.type === 'stay' || 
          (item as any).type === 'accommodation' ||
          // Se não tem tipo definido, verificar outros campos que indicam accommodation
          (item as any).checkInTime || 
          (item as any).checkOutTime ||
          (item as any).amenities
        )
        
        if (hasOnlyAccommodations) {
          data.value = cachedData
          loading.value = false
          return {
            data,
            loading: readonly(loading),
            error: readonly(error)
          }
        } else {
          console.log('🗑️ Invalidating cache - contains mixed data')
          // Limpar cache inválido
          clearCache(cacheKey)
        }
      }
      
      
      try {
        // Estratégia 1: Tentar rota unificada primeiro
        const { getAccommodationsUnified } = useUnifiedProducts()
        const unifiedResult = await getAccommodationsUnified({
          limit: filters.limit || 8,
          page: filters.page || 1,
          include_images: true,
          include_reviews: true,
          ...filters
        })
        
        // Converter dados da rota unificada para o formato esperado
        const normalizedData = unifiedResult.data.map((item: any) => normalizeStayData(item))
        
        data.value = normalizedData
        
      } catch (unifiedError) {
        console.warn('⚠️ Unified route failed, trying extended route:', unifiedError)
        
        // Estratégia 2: Fallback para rota extended
        const params = {
          limit: filters.limit || 8,
          page: filters.page || 1,
          type: 'accommodation', // Filtrar apenas accommodations
          ...filters
        }
        
        const response = await api.get('/products/extended', params)
        const normalizedData = Array.isArray(response) ? response.map(normalizeStayData) : []
        
        data.value = normalizedData
      }
      
      // Salva no cache
      setCache(cacheKey, data.value, 5 * 60 * 1000) // 5 minutos
      
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar acomodações'
      console.error('Error fetching featured stays:', err)
    } finally {
      loading.value = false
    }
    
    return {
      data,
      loading: readonly(loading),
      error: readonly(error)
    }
  }
  
  const getFeaturedMixed = async (filters: FeaturedFilters = {}) => {
    const loading = ref(true)
    const error = ref<string | null>(null)
    const data = ref<FeaturedItem[]>([])
    
    try {
      loading.value = true
      error.value = null
      
      const cacheKey = `mixed_${JSON.stringify(filters)}`
      
      // Tenta buscar do cache primeiro
      const cachedData = getCache<FeaturedItem[]>(cacheKey)
      if (cachedData && cachedData.length > 0) {
        data.value = cachedData
        loading.value = false
        return {
          data,
          loading: readonly(loading),
          error: readonly(error)
        }
      }
      
      // Buscar tours e stays em paralelo, mas com fallback individual
      const toursPromise = getFeaturedTours({ ...filters, limit: Math.ceil((filters.limit || 8) / 2) })
        .catch(err => {
          console.warn('Failed to fetch tours, using empty array:', err)
          return { data: ref([]), loading: ref(false), error: ref(null) }
        })
      
      const staysPromise = getFeaturedStays({ ...filters, limit: Math.floor((filters.limit || 8) / 2) })
        .catch(err => {
          console.warn('Failed to fetch stays, using empty array:', err)
          return { data: ref([]), loading: ref(false), error: ref(null) }
        })
      
      const [toursResult, staysResult] = await Promise.all([toursPromise, staysPromise])
      
      // Misturar os resultados de forma aleatória
      const allItems = [...toursResult.data.value, ...staysResult.data.value]
      const shuffled = allItems.sort(() => Math.random() - 0.5)
      
      const finalData = shuffled.slice(0, filters.limit || 8)
      
      // Salva no cache
      setCache(cacheKey, finalData, 5 * 60 * 1000) // 5 minutos
      
      data.value = finalData
      
      // Se não conseguiu nenhum item, definir erro
      if (data.value.length === 0) {
        error.value = 'Nenhum item encontrado. Tente novamente em alguns instantes.'
      }
      
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar destaques'
      console.error('Error fetching featured mixed:', err)
    } finally {
      loading.value = false
    }
    
    return {
      data,
      loading: readonly(loading),
      error: readonly(error)
    }
  }
  
  return {
    getFeaturedTours,
    getFeaturedStays,
    getFeaturedMixed,
    getMixedFeatured: getFeaturedMixed,
    normalizeTourData,
    normalizeStayData
  }
}
