export interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

export const useLocalCache = () => {
  const CACHE_PREFIX = 'casadapedra_cache_'
  const DEFAULT_EXPIRES_IN = 5 * 60 * 1000 // 5 minutos

  const getCacheKey = (key: string): string => {
    return `${CACHE_PREFIX}${key}`
  }

  const set = <T>(key: string, data: T, expiresIn: number = DEFAULT_EXPIRES_IN): void => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn
      }
      localStorage.setItem(getCacheKey(key), JSON.stringify(cacheItem))
    } catch (error) {
      console.warn('Failed to set cache:', error)
    }
  }

  const get = <T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(key))
      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const now = Date.now()
      
      // Verifica se expirou
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        localStorage.removeItem(getCacheKey(key))
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.warn('Failed to get cache:', error)
      return null
    }
  }

  const clear = (key?: string): void => {
    try {
      if (key) {
        localStorage.removeItem(getCacheKey(key))
      } else {
        // Limpa todo o cache da aplicação
        const keys = Object.keys(localStorage)
        keys.forEach(k => {
          if (k.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(k)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  const isExpired = (key: string): boolean => {
    try {
      const cached = localStorage.getItem(getCacheKey(key))
      if (!cached) return true

      const cacheItem: CacheItem<any> = JSON.parse(cached)
      const now = Date.now()
      
      return now - cacheItem.timestamp > cacheItem.expiresIn
    } catch (error) {
      return true
    }
  }

  return {
    set,
    get,
    clear,
    isExpired
  }
}
