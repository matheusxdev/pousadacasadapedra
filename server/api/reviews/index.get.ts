import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const {
    productId,
    productType = 'tour', // 'tour' ou 'accommodation'
    page = 1,
    limit = 10,
    sort = 'newest', // 'newest', 'oldest', 'rating_high', 'rating_low'
    rating,
    verified = false
  } = query

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  try {
    // Primeiro, tentar buscar reviews reais da API StarHub
    try {
      const response = await $fetch('/reviews', {
        baseURL: 'https://api.starhubsolutions.com/v1',
        query: {
          product_id: productId,
          product_type: productType,
          page,
          limit,
          sort,
          rating,
          verified
        },
        headers: {
          'Content-Type': 'application/json',
          'x-starhub-token': config.public.starhubToken
        }
      })
      
      // console.log(`📊 Reviews reais encontrados na API para produto ${productId}`)
      return {
        ...(response as any),
        source: 'api_real'
      }
    } catch (reviewError) {
      // console.log(`📊 Reviews API não disponível para produto ${productId}, buscando dados do produto...`)
      
      // Se não houver endpoint de reviews, buscar dados do produto para obter o rating real
      try {
        const productResponse = await $fetch(`/products/extended/${productId}`, {
          baseURL: 'https://api.starhubsolutions.com/v1',
          headers: {
            'Content-Type': 'application/json',
            'x-starhub-token': config.public.starhubToken
          }
        })
        
        const realRating = (productResponse as any).data?.rating || null
        
        if (realRating) {
          // console.log(`📊 Rating real da API para produto ${productId}: ${realRating}`)
          
          // Retornar apenas o rating real, sem reviews mock
          return {
            data: [],
            meta: {
              total: 0,
              page: Number(page),
              limit: Number(limit),
              totalPages: 0,
              hasMore: false
            },
            statistics: {
              averageRating: realRating,
              totalReviews: 0,
              ratingDistribution: [
                { rating: 5, count: 0, percentage: 0 },
                { rating: 4, count: 0, percentage: 0 },
                { rating: 3, count: 0, percentage: 0 },
                { rating: 2, count: 0, percentage: 0 },
                { rating: 1, count: 0, percentage: 0 }
              ],
              verifiedPercentage: 0
            },
            source: 'api_rating_only',
            message: 'Apenas rating disponível da API. Reviews não implementados ainda.'
          }
        } else {
          // console.log(`📊 Nenhum rating encontrado para produto ${productId}`)
          
          return {
            data: [],
            meta: {
              total: 0,
              page: Number(page),
              limit: Number(limit),
              totalPages: 0,
              hasMore: false
            },
            statistics: {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: [
                { rating: 5, count: 0, percentage: 0 },
                { rating: 4, count: 0, percentage: 0 },
                { rating: 3, count: 0, percentage: 0 },
                { rating: 2, count: 0, percentage: 0 },
                { rating: 1, count: 0, percentage: 0 }
              ],
              verifiedPercentage: 0
            },
            source: 'no_data',
            message: 'Nenhum dado de reviews disponível na API para este produto.'
          }
        }
      } catch (productError) {
        // console.error(`📊 Erro ao buscar produto ${productId}:`, productError)
        
        throw createError({
          statusCode: 404,
          statusMessage: `Produto ${productId} não encontrado na API`
        })
      }
    }
  } catch (error) {
    // console.error(`📊 Erro geral na busca de reviews para produto ${productId}:`, error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar reviews'
    })
  }
})

