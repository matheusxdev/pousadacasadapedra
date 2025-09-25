import { ref, onMounted, onUnmounted } from 'vue'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheConfig {
  defaultTTL: number // Time to live em milissegundos
  maxSize: number // Máximo de entradas no cache
  cleanupInterval: number // Intervalo de limpeza em milissegundos
}

export const useSmartCache = (config: Partial<CacheConfig> = {}) => {
  const defaultConfig: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxSize: 100,
    cleanupInterval: 60 * 1000 // 1 minuto
  }

  const finalConfig = { ...defaultConfig, ...config }
  const cache = new Map<string, CacheEntry<any>>()
  let cleanupTimer: NodeJS.Timeout | null = null

  /**
   * Gera uma chave de cache baseada nos parâmetros
   */
  const generateKey = (prefix: string, params: Record<string, any>): string => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|')
    
    return `${prefix}:${sortedParams}`
  }

  /**
   * Verifica se uma entrada do cache ainda é válida
   */
  const isValid = (entry: CacheEntry<any>): boolean => {
    return Date.now() < entry.expiresAt
  }

  /**
   * Limpa entradas expiradas do cache
   */
  const cleanup = () => {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of cache.entries()) {
      if (now >= entry.expiresAt) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => cache.delete(key))
  }

  /**
   * Remove entradas mais antigas se o cache estiver cheio
   */
  const evictOldest = () => {
    if (cache.size >= finalConfig.maxSize) {
      const entries = Array.from(cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      // Remove 20% das entradas mais antigas
      const toRemove = Math.floor(finalConfig.maxSize * 0.2)
      for (let i = 0; i < toRemove; i++) {
        cache.delete(entries[i][0])
      }
    }
  }

  /**
   * Inicia o timer de limpeza automática
   */
  const startCleanupTimer = () => {
    if (cleanupTimer) return
    
    cleanupTimer = setInterval(() => {
      cleanup()
    }, finalConfig.cleanupInterval)
  }

  /**
   * Para o timer de limpeza
   */
  const stopCleanupTimer = () => {
    if (cleanupTimer) {
      clearInterval(cleanupTimer)
      cleanupTimer = null
    }
  }

  /**
   * Obtém dados do cache
   */
  const get = <T>(key: string): T | null => {
    const entry = cache.get(key)
    
    if (!entry) return null
    
    if (!isValid(entry)) {
      cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  /**
   * Armazena dados no cache
   */
  const set = <T>(key: string, data: T, ttl?: number): void => {
    const now = Date.now()
    const expiresAt = now + (ttl || finalConfig.defaultTTL)
    
    cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    })
    
    evictOldest()
    startCleanupTimer()
  }

  /**
   * Remove uma entrada específica do cache
   */
  const remove = (key: string): boolean => {
    return cache.delete(key)
  }

  /**
   * Limpa todo o cache
   */
  const clear = (): void => {
    cache.clear()
    stopCleanupTimer()
  }

  /**
   * Obtém estatísticas do cache
   */
  const getStats = () => {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0
    
    for (const entry of cache.values()) {
      if (isValid(entry)) {
        validEntries++
      } else {
        expiredEntries++
      }
    }
    
    return {
      totalEntries: cache.size,
      validEntries,
      expiredEntries,
      hitRate: validEntries / Math.max(cache.size, 1),
      memoryUsage: JSON.stringify(Array.from(cache.entries())).length
    }
  }

  /**
   * Função helper para cache de preços
   */
  const cachePrice = (
    productId: string,
    date: string,
    participants: { adults: number; children: number },
    childrenAges: string[],
    price: number
  ): void => {
    const key = generateKey('price', {
      productId,
      date,
      adults: participants.adults,
      children: participants.children,
      childrenAges: childrenAges.join(',')
    })
    
    set(key, price, 5 * 60 * 1000) // 5 minutos para preços
  }

  /**
   * Função helper para obter preço do cache
   */
  const getCachedPrice = (
    productId: string,
    date: string,
    participants: { adults: number; children: number },
    childrenAges: string[]
  ): number | null => {
    const key = generateKey('price', {
      productId,
      date,
      adults: participants.adults,
      children: participants.children,
      childrenAges: childrenAges.join(',')
    })
    
    return get<number>(key)
  }

  /**
   * Função helper para cache de disponibilidade
   */
  const cacheAvailability = (
    productId: string,
    month: string,
    availability: any
  ): void => {
    const key = generateKey('availability', {
      productId,
      month
    })
    
    set(key, availability, 10 * 60 * 1000) // 10 minutos para disponibilidade
  }

  /**
   * Função helper para obter disponibilidade do cache
   */
  const getCachedAvailability = (
    productId: string,
    month: string
  ): any | null => {
    const key = generateKey('availability', {
      productId,
      month
    })
    
    return get<any>(key)
  }

  // Cleanup automático quando o composable for destruído
  onUnmounted(() => {
    stopCleanupTimer()
  })

  return {
    get,
    set,
    remove,
    clear,
    getStats,
    generateKey,
    cachePrice,
    getCachedPrice,
    cacheAvailability,
    getCachedAvailability
  }
}
