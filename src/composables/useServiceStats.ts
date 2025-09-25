import { ref, computed, readonly } from 'vue'

export interface ServiceStats {
  totalRooms: number
}

interface SearchResponse {
  data?: any[]
  meta?: {
    total: number
    page?: number
    limit?: number
    totalPages?: number
    hasMore?: boolean
  }
  filters?: {
    categories: string[]
    priceRange: {
      min: number | null
      max: number | null
    }
    locations: string[]
  }
  suggestions?: any[]
  total?: number // Para compatibilidade com diferentes estruturas de API
}

export const useServiceStats = () => {
  const stats = ref<ServiceStats>({
    totalRooms: 0
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Tentar diferentes endpoints para buscar acomodações
      let accommodationsResponse: SearchResponse | null = null
      
      // Primeiro, tentar o endpoint unificado de produtos
      try {
        accommodationsResponse = await $fetch<SearchResponse>('/api/products/unified', {
          query: {
            type: 'accommodation',
            limit: 1 // Apenas para obter o total
          }
        })
      } catch (unifiedError) {
        
        // Se falhar, tentar o endpoint de busca
        try {
          accommodationsResponse = await $fetch<SearchResponse>('/api/search', {
            query: {
              type: 'accommodation',
              limit: 1
            }
          })
          console.log('Search API Response:', accommodationsResponse)
        } catch (searchError) {
          console.warn('Search API failed, trying accommodations endpoint:', searchError)
          
          // Se falhar, tentar o endpoint direto de acomodações
          accommodationsResponse = await $fetch<SearchResponse>('/api/accommodations', {
            query: {
              limit: 1
            }
          })
          console.log('Accommodations API Response:', accommodationsResponse)
        }
      }
      
      // Extrair o total de acomodações
      const totalRooms = accommodationsResponse?.meta?.total || 
                        accommodationsResponse?.data?.length || 
                        (accommodationsResponse as any)?.total || 0
      
      stats.value = {
        totalRooms
      }
      
      console.log('Final Total Rooms:', stats.value.totalRooms)
      
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar estatísticas'
      console.error('Error fetching service stats:', err)
      
      // Valores padrão em caso de erro
      stats.value = {
        totalRooms: 0
      }
    } finally {
      loading.value = false
    }
  }

  // Carregar stats automaticamente
  fetchStats()

  return {
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    fetchStats
  }
}
