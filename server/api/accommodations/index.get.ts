import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const baseURL = 'https://api.starhubsolutions.com/v1'
  
  // Get query parameters
  const query = getQuery(event)
  
  // Buscar produtos do tipo accommodation usando a rota unificada
  const unifiedQuery = {
    type: 'accommodation',
    include_images: true,
    include_reviews: true,
    include_availability: false,
    include_related: false,
    include_delivery: false,
    include_inventory: false,
    limit: 100,
    ...query
  }
  
  
  try {
    const response = await $fetch(`${baseURL}/products/unified`, {
      method: 'GET',
      query: unifiedQuery,
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.public.starhubToken
      }
    })
    
    return response
  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao conectar com a API StarHub',
      data: error
    })
  }
})
