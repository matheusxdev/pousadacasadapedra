import { ref, readonly } from 'vue'

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  window?: number
  type?: string
  userType?: string
  isRateLimited: boolean
  retryAfter?: number
  resetDate: Date
  retryAfterDate?: Date
}

export interface RateLimitError extends Error {
  status: number
  retryAfter?: number
  rateLimitInfo?: RateLimitInfo
}

export const useRateLimit = () => {
  const rateLimitInfo = ref<RateLimitInfo | null>(null)
  const isRateLimited = ref(false)
  const retryQueue = ref<Array<() => Promise<any>>>([])
  const isRetrying = ref(false)

  // Função para extrair informações de rate limit dos headers
  const extractRateLimitInfo = (response: Response): RateLimitInfo | null => {
    const limit = response.headers.get('X-RateLimit-Limit')
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')
    const retryAfter = response.headers.get('Retry-After')

    if (!limit || !remaining || !reset) {
      return null
    }

    const resetTimestamp = parseInt(reset)
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter) : undefined

    return {
      limit: parseInt(limit),
      remaining: parseInt(remaining),
      reset: resetTimestamp,
      window: parseInt(response.headers.get('X-RateLimit-Window') || '0'),
      type: response.headers.get('X-RateLimit-Type') || undefined,
      userType: response.headers.get('X-RateLimit-User-Type') || undefined,
      isRateLimited: response.status === 429,
      retryAfter: retryAfterSeconds,
      resetDate: new Date(resetTimestamp * 1000),
      retryAfterDate: retryAfterSeconds ? new Date(Date.now() + retryAfterSeconds * 1000) : undefined
    }
  }

  // Função para atualizar informações de rate limit
  const updateRateLimitInfo = (response: Response): void => {
    const info = extractRateLimitInfo(response)
    if (info) {
      rateLimitInfo.value = info
      isRateLimited.value = info.isRateLimited

      // Log para debugging
      console.log('🚦 Rate Limit Info:', {
        limit: info.limit,
        remaining: info.remaining,
        resetDate: info.resetDate.toISOString(),
        retryAfterDate: info.retryAfterDate?.toISOString(),
        isRateLimited: info.isRateLimited,
        type: info.type,
        userType: info.userType
      })

      // Emitir evento para outros componentes
      if (process.client) {
        window.dispatchEvent(new CustomEvent('rateLimitUpdate', { detail: info }))
      }
    }
  }

  // Função para calcular tempo restante em formato legível
  const getTimeRemaining = (date: Date): string => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()

    if (diff <= 0) return 'Agora'

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    
    return 'Menos de 1 minuto'
  }

  // Função para fazer requisição com tratamento de rate limit
  const makeRequest = async <T>(url: string, options: any = {}): Promise<T> => {
    try {
      const response = await $fetch.raw(url, options)
      
      // Atualizar informações de rate limit
      updateRateLimitInfo(response as any)
      
      if (response.status === 429) {
        const info = rateLimitInfo.value
        if (info?.retryAfter) {
          const retryAfterMs = info.retryAfter * 1000
          const retryAfterHuman = getTimeRemaining(info.retryAfterDate!)
          
          console.warn(`🚫 Rate limit atingido. Tentando novamente em ${retryAfterHuman}...`)
          
          // Criar erro personalizado
          const error: RateLimitError = new Error(
            `Rate limit atingido. Tente novamente em ${retryAfterHuman}.`
          ) as RateLimitError
          
          error.status = 429
          error.retryAfter = info.retryAfter
          error.rateLimitInfo = info
          
          throw error
        }
      }
      
      return (response._data as any)?.data || response._data as T
    } catch (error: any) {
      console.error('Request failed:', error)
      throw error
    }
  }

  // Função para processar fila de retry
  const processRetryQueue = async (): Promise<void> => {
    if (isRetrying.value || retryQueue.value.length === 0) {
      return
    }
    
    isRetrying.value = true
    
    while (retryQueue.value.length > 0) {
      const retryFn = retryQueue.value.shift()
      if (retryFn) {
        try {
          await retryFn()
        } catch (error) {
          console.error('Retry failed:', error)
        }
      }
    }
    
    isRetrying.value = false
  }

  // Função para adicionar requisição à fila de retry
  const addToRetryQueue = (retryFn: () => Promise<any>): void => {
    retryQueue.value.push(retryFn)
  }

  // Função para aguardar e tentar novamente
  const waitAndRetry = async (retryAfter: number, retryFn: () => Promise<any>): Promise<void> => {
    const retryAfterMs = retryAfter * 1000
    const retryAfterHuman = getTimeRemaining(new Date(Date.now() + retryAfterMs))
    
    console.log(`⏳ Aguardando ${retryAfterHuman} antes de tentar novamente...`)
    
    // Aguardar o tempo especificado
    await new Promise(resolve => setTimeout(resolve, retryAfterMs))
    
    // Tentar novamente
    try {
      await retryFn()
    } catch (error) {
      console.error('Retry failed:', error)
      throw error
    }
  }

  // Função para obter informações de rate limit do localStorage
  const getStoredRateLimitInfo = (): RateLimitInfo | null => {
    if (!process.client) return null
    
    try {
      const stored = localStorage.getItem('rateLimitInfo')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to get stored rate limit info:', error)
      return null
    }
  }

  // Função para salvar informações de rate limit no localStorage
  const storeRateLimitInfo = (info: RateLimitInfo): void => {
    if (!process.client) return
    
    try {
      localStorage.setItem('rateLimitInfo', JSON.stringify(info))
    } catch (error) {
      console.warn('Failed to store rate limit info:', error)
    }
  }

  // Função para limpar informações de rate limit
  const clearRateLimitInfo = (): void => {
    rateLimitInfo.value = null
    isRateLimited.value = false
    retryQueue.value = []
    isRetrying.value = false
    
    if (process.client) {
      localStorage.removeItem('rateLimitInfo')
    }
  }

  return {
    // Estado
    rateLimitInfo: readonly(rateLimitInfo),
    isRateLimited: readonly(isRateLimited),
    retryQueue: readonly(retryQueue),
    isRetrying: readonly(isRetrying),
    
    // Funções
    makeRequest,
    updateRateLimitInfo,
    extractRateLimitInfo,
    getTimeRemaining,
    processRetryQueue,
    addToRetryQueue,
    waitAndRetry,
    getStoredRateLimitInfo,
    storeRateLimitInfo,
    clearRateLimitInfo
  }
}
