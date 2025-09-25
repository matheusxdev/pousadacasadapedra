/**
 * Rota de Reviews - Chama API real
 */

import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event: any) => {
  try {
    const query = await getQuery(event)
    
    const { productId, productType } = query
    
    if (!productId) {
      return {
        success: false,
        error: {
          message: 'Product ID is required',
          code: 'MISSING_PRODUCT_ID'
        }
      }
    }
    
    // Chamar API real para reviews
    const config = useRuntimeConfig()
    const baseURL = 'https://api.starhubsolutions.com/v1'
    
    try {
      const response: any = await $fetch(`${baseURL}/products/extended/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-starhub-token': config.public.starhubToken
        }
      })
      
      // Extrair dados de reviews da API real
      const reviewsData = response.data?.reviews || []
      const statisticsData = response.data?.reviews_statistics || {}
      
      return {
        success: true,
        data: {
          reviews: reviewsData,
          statistics: statisticsData,
          pagination: {
            current_page: 1,
            per_page: 10,
            total_items: reviewsData.length,
            total_pages: 1,
            has_next_page: false,
            has_prev_page: false
          }
        },
        meta: {
          product_id: productId,
          product_type: productType,
          generated_at: new Date().toISOString(),
          real_api: true
        }
      }
    } catch (apiError: any) {
      
      // Se a API falhar, retornar estrutura vazia
      return {
        success: true,
        data: {
          reviews: [],
          statistics: {
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: [],
            verified_reviews: 0,
            response_rate: 0
          },
          pagination: {
            current_page: 1,
            per_page: 10,
            total_items: 0,
            total_pages: 0,
            has_next_page: false,
            has_prev_page: false
          }
        },
        meta: {
          product_id: productId,
          product_type: productType,
          generated_at: new Date().toISOString(),
          real_api: false,
          api_error: apiError.message
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Error in reviews route:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Erro interno do servidor ao buscar reviews',
        code: 'INTERNAL_ERROR'
      }
    }
  }
})