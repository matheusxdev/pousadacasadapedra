import { defineEventHandler, getRouterParam, getQuery, getMethod, readBody, createError } from 'h3'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const baseURL = 'https://api.starhubsolutions.com/v1'
  
  // Get the UUID parameter
  const uuid = getRouterParam(event, 'uuid')
  const fullPath = `/products/extended/${uuid}`
  
  
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
    console.log(`Making request to: ${baseURL}${fullPath}`)
    console.log(`Method: ${method}`)
    console.log(`Query:`, query)
    console.log(`Token: ${config.public.starhubToken ? 'Present' : 'Missing'}`)
    
    const response = await $fetch(`${baseURL}${fullPath}`, {
      method,
      query,
      body,
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.public.starhubToken
      }
    })
    
    console.log(`Response received for ${fullPath}`)
    return response
  } catch (error: any) {
    console.error(`API Error for ${fullPath}:`, error)
    console.error(`Error details:`, {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      data: error.data
    })
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.statusText || 'API Error',
      data: {
        originalError: error.message,
        path: fullPath,
        method,
        query
      }
    })
  }
})
