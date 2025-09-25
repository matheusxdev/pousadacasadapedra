import { ref, computed, watch, readonly } from 'vue'

export interface SearchFilters {
  query?: string
  type?: 'all' | 'tours' | 'accommodations'
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  date?: string
  adults?: number
  children?: number
  sort?: 'relevance' | 'price' | 'rating' | 'name'
  page?: number
  limit?: number
}

export interface SearchSuggestion {
  type: 'destination' | 'category' | 'recent'
  text: string
  count?: number
}

export interface SearchResult {
  id: string
  type: 'tour' | 'accommodation' | 'tours' | 'accommodations'
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviewCount?: number
  images: string[]
  location?: {
    city: string
    state: string
    country: string
  }
  category?: string
  features?: string[]
  availability?: {
    status: 'available' | 'limited' | 'unavailable'
    nextAvailable?: string
  }
}

export interface SearchResponse {
  data: SearchResult[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
  filters: {
    categories: Array<{ id: string; name: string; count: number }>
    priceRange: { min: number; max: number }
    locations: string[]
  }
  suggestions: SearchSuggestion[]
}

export function useSearch() {
  const results = ref<SearchResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastQuery = ref('')
  const searchHistory = ref<string[]>([])
  const recentSearches = ref<SearchSuggestion[]>([])

  // Carregar histórico de busca do localStorage
  const loadSearchHistory = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('search-history')
        if (stored) {
          searchHistory.value = JSON.parse(stored)
        }
      } catch (err) {
        console.error('Error loading search history:', err)
      }
    }
  }

  // Salvar no histórico
  const saveToHistory = (query: string) => {
    if (!query.trim()) return

    // Remover duplicatas
    const filtered = searchHistory.value.filter(item => item !== query)
    searchHistory.value = [query, ...filtered].slice(0, 10) // Manter apenas 10

    if (process.client) {
      try {
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
      } catch (err) {
        console.error('Error saving search history:', err)
      }
    }
  }

  // Realizar busca
  const search = async (filters: SearchFilters): Promise<SearchResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<SearchResponse>('/api/search', {
        query: filters
      })

      results.value = response.data
      lastQuery.value = filters.query || ''

      // Salvar no histórico
      if (filters.query) {
        saveToHistory(filters.query)
      }

      return response
    } catch (err) {
      error.value = 'Erro ao realizar busca'
      console.error('Search error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Busca rápida (para autocomplete)
  const quickSearch = async (query: string): Promise<SearchSuggestion[]> => {
    if (!query || query.length < 2) return []

    try {
      const response = await $fetch<SearchResponse>('/api/search', {
        query: {
          q: query,
          limit: 5
        }
      })

      return response.suggestions || []
    } catch (err) {
      console.error('Quick search error:', err)
      return []
    }
  }

  // Sugestões baseadas no histórico
  const getSuggestionsFromHistory = (query: string): SearchSuggestion[] => {
    if (!query) return []

    return searchHistory.value
      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(item => ({
        type: 'recent' as const,
        text: item
      }))
  }

  // Buscar com debounce para autocomplete
  const debouncedQuickSearch = debounce(quickSearch, 300)

  // Filtrar resultados localmente
  const filterResults = (filters: Partial<SearchFilters>) => {
    let filtered = [...results.value]

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(item => item.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(item => item.price <= filters.maxPrice!)
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type)
    }

    if (filters.location) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter(item =>
        item.location?.city.toLowerCase().includes(location) ||
        item.location?.state.toLowerCase().includes(location)
      )
    }

    return filtered
  }

    // Ordenar resultados
  const sortResults = (results: SearchResult[], sortBy: string) => {
    const sorted = [...results]

    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  // Limpar resultados
  const clearResults = () => {
    results.value = []
    lastQuery.value = ''
  }

  // Limpar histórico
  const clearHistory = () => {
    searchHistory.value = []
    if (process.client) {
      localStorage.removeItem('search-history')
    }
  }

  // Computed properties
  const hasResults = computed(() => results.value.length > 0)
  const totalResults = computed(() => results.value.length)

  // Inicializar histórico
  if (process.client) {
    loadSearchHistory()
  }

  return {
    // State
    results: readonly(results),
    loading: readonly(loading),
    error: readonly(error),
    lastQuery: readonly(lastQuery),
    searchHistory: readonly(searchHistory),

    // Computed
    hasResults,
    totalResults,

    // Methods
    search,
    quickSearch,
    debouncedQuickSearch,
    getSuggestionsFromHistory,
    filterResults,
    sortResults,
    clearResults,
    clearHistory
  }
}

// Função debounce auxiliar
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)
      
      timeout = setTimeout(() => {
        resolve(func(...args))
      }, wait)
    })
  }
}
