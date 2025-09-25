import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const {
    q: searchTerm,
    type = 'all', // 'tours', 'accommodations', 'all'
    category,
    minPrice,
    maxPrice,
    location,
    date,
    adults = 1,
    children = 0,
    page = 1,
    limit = 20,
    sort = 'relevance' // 'relevance', 'price', 'rating', 'name'
  } = query

  try {
    // Buscar tours
    let tours = []
    if (type === 'all' || type === 'tours') {
      try {
        const toursResponse = await $fetch('/api/tours', {
          query: {
            search: searchTerm,
            category,
            minPrice,
            maxPrice,
            location,
            date,
            adults,
            children,
            page,
            limit,
            sort
          }
        })
        tours = (toursResponse as any)?.data || []
      } catch (error) {
        // console.warn('Tours search failed:', error)
      }
    }

    // Buscar acomodações
    let accommodations = []
    if (type === 'all' || type === 'accommodations') {
      try {
        const accommodationsResponse = await $fetch('/api/accommodations', {
          query: {
            search: searchTerm,
            category,
            minPrice,
            maxPrice,
            location,
            date,
            adults,
            children,
            page,
            limit,
            sort
          }
        })
        accommodations = (accommodationsResponse as any)?.data || []
      } catch (error) {
        // console.warn('Accommodations search failed:', error)
      }
    }

    // Combinar resultados
    const results = [...tours, ...accommodations]
    
    // Aplicar ordenação
    if (sort === 'price') {
      results.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sort === 'name') {
      results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    // Paginação
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedResults = results.slice(startIndex, endIndex)

  // Sugestões de busca
  const suggestions = []
  if (searchTerm && typeof searchTerm === 'string' && searchTerm.length >= 2) {
      const commonDestinations = [
        'Arraial do Cabo', 'Búzios', 'Cabo Frio', 'Rio de Janeiro',
        'São Paulo', 'Paraty', 'Ilha Grande', 'Angra dos Reis'
      ]
      
      suggestions.push(
        ...commonDestinations
          .filter(dest => dest.toLowerCase().includes(searchTerm.toString().toLowerCase()))
          .map(dest => ({ type: 'destination', text: dest }))
      )
    }

    return {
      data: paginatedResults,
      meta: {
        total: results.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(results.length / Number(limit)),
        hasMore: endIndex < results.length
      },
      filters: {
        categories: await getAvailableCategories(results),
        priceRange: {
          min: Math.min(...results.map(r => r.price || 0)),
          max: Math.max(...results.map(r => r.price || 0))
        },
        locations: [...new Set(results.map(r => r.location?.city).filter(Boolean))]
      },
      suggestions
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Search failed',
      data: error
    })
  }
})

// Função auxiliar para obter categorias disponíveis
async function getAvailableCategories(results: any[]) {
  const categories = new Set()
  results.forEach(item => {
    if (item.category) categories.add(item.category)
    if (item.type) categories.add(item.type)
  })
  
  return Array.from(categories).map(cat => ({
    id: cat,
    name: String(cat).charAt(0).toUpperCase() + String(cat).slice(1),
    count: results.filter(r => r.category === cat || r.type === cat).length
  }))
}
