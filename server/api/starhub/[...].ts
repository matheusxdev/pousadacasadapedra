import { defineEventHandler, getRouterParam, getQuery, getMethod, readBody, createError } from 'h3'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const baseURL = 'https://api.starhubsolutions.com/v1'
  
  // Get the path after /api/starhub/
  const path = getRouterParam(event, 'path') || ''
  const fullPath = `/${path}`
  
  // Get query parameters
  const query = getQuery(event)
  
  // Get request method
  const method = getMethod(event)
  
  // Get request body for POST/PUT/PATCH
  let body = null
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event)
  }
  
  try {
    const response = await $fetch(`${baseURL}${fullPath}`, {
      method,
      query,
      body,
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.public.starhubToken
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Error',
      data: error
    })
  }
})
