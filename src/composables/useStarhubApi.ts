import { useRateLimit } from './useRateLimit'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  error: {
    message: string
    code?: string
  }
}

export const useStarhubApi = () => {
  const config = useRuntimeConfig()
  const { updateRateLimitInfo, waitAndRetry } = useRateLimit()
  
  const baseURL = '/api'
  const token = config.public.starhubToken
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    defaultHeaders['x-starhub-token'] = token
  }
  
  // Função para fazer retry inteligente baseado nos headers de rate limit
  const retryWithSmartBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error: any) {
        lastError = error
        
        // Se não é erro de rate limit (429) ou servidor (500), não tenta novamente
        if (error.status !== 429 && error.status !== 500) {
          throw error
        }
        
        // Se é a última tentativa, lança o erro
        if (attempt === maxRetries) {
          throw error
        }
        
        // Se é erro 429 e tem Retry-After, usar o tempo especificado
        if (error.status === 429 && error.retryAfter) {
          console.warn(`🚫 Rate limit atingido. Aguardando ${error.retryAfter} segundos...`)
          await waitAndRetry(error.retryAfter, fn)
          continue
        }
        
        // Para outros erros, usar backoff exponencial
        const delay = baseDelay * Math.pow(2, attempt)
        console.warn(`API Error ${error.status}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
        
        // Aguarda antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }
  
  const api = {
    async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
      return retryWithSmartBackoff(async () => {
        const query = params ? new URLSearchParams(params).toString() : ''
        const url = query ? `${path}?${query}` : path
        
        const response = await $fetch.raw<ApiResponse<T>>(url, {
          baseURL,
          headers: defaultHeaders
        })
        
        // Atualizar informações de rate limit
        updateRateLimitInfo(response as any)
        
        return (response._data as any)?.data || response._data
      })
    },
    
    async post<T = any>(path: string, body?: any): Promise<T> {
      return retryWithSmartBackoff(async () => {
        const response = await $fetch.raw<ApiResponse<T>>(path, {
          method: 'POST',
          baseURL,
          headers: defaultHeaders,
          body
        })
        
        // Atualizar informações de rate limit
        updateRateLimitInfo(response as any)
        
        return (response._data as any)?.data || response._data
      })
    },
    
    async put<T = any>(path: string, body?: any): Promise<T> {
      return retryWithSmartBackoff(async () => {
        const response = await $fetch.raw<ApiResponse<T>>(path, {
          method: 'PUT',
          baseURL,
          headers: defaultHeaders,
          body
        })
        
        // Atualizar informações de rate limit
        updateRateLimitInfo(response as any)
        
        return (response._data as any)?.data || response._data
      })
    },
    
    async delete<T = any>(path: string): Promise<T> {
      return retryWithSmartBackoff(async () => {
        const response = await $fetch.raw<ApiResponse<T>>(path, {
          method: 'DELETE',
          baseURL,
          headers: defaultHeaders
        })
        
        // Atualizar informações de rate limit
        updateRateLimitInfo(response as any)
        
        return (response._data as any)?.data || response._data
      })
    }
  }
  
  return {
    api,
    baseURL,
    token
  }
}
