import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const baseURL = 'https://api.starhubsolutions.com/v1'
  
  // Get query parameters
  const query = getQuery(event)
  
  try {
    const response = await $fetch(`${baseURL}/products/extended`, {
      method: 'GET',
      query,
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
      statusMessage: 'API Error',
      data: error
    })
  }
})
