import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const baseURL = 'https://api.starhubsolutions.com/v1'
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug é obrigatório'
    })
  }
  
  // Buscar produto específico com todos os dados incluídos
  const unifiedQuery = {
    type: 'accommodation',
    include_images: true,
    include_reviews: true,
    include_availability: true,
    include_related: true,
    include_delivery: false,
    include_inventory: false,
    limit: 100
  }
  
  
  try {
    // Primeiro, buscar na lista geral
    const response = await $fetch(`${baseURL}/products/unified`, {
      method: 'GET',
      query: unifiedQuery,
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.public.starhubToken
      }
    })
    
    const apiResponse = response as any
    
    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      // Procurar o produto específico
      const product = apiResponse.data.find((p: any) => 
        p.slug === slug || 
        p.uuid === slug || 
        p.id === slug
      )
      
      if (product) {
        return {
          success: true,
          data: product
        }
      } else {
        throw createError({
          statusCode: 404,
          statusMessage: 'Produto não encontrado'
        })
      }
    }
    
    throw createError({
      statusCode: 404,
      statusMessage: 'Produto não encontrado'
    })
    
  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao conectar com a API StarHub',
      data: error
    })
  }
})
