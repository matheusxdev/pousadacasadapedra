import { ref, computed, watch, onUnmounted } from 'vue'

export interface DebounceConfig {
  delay: number
  immediate?: boolean
  maxWait?: number
}

export interface ActionConfig {
  type: 'search' | 'pricing' | 'validation' | 'save' | 'api' | 'ui'
  delay: number
  maxWait?: number
  immediate?: boolean
}

// Configurações otimizadas para diferentes tipos de ação
const ACTION_CONFIGS: Record<string, ActionConfig> = {
  search: {
    type: 'search',
    delay: 300, // 300ms para busca - rápido mas não muito
    maxWait: 1000,
    immediate: false
  },
  pricing: {
    type: 'pricing',
    delay: 500, // 500ms para preços - balanceado
    maxWait: 2000,
    immediate: false
  },
  validation: {
    type: 'validation',
    delay: 200, // 200ms para validação - rápido feedback
    maxWait: 500,
    immediate: false
  },
  save: {
    type: 'save',
    delay: 1000, // 1s para salvamento - não muito frequente
    maxWait: 5000,
    immediate: false
  },
  api: {
    type: 'api',
    delay: 800, // 800ms para APIs - evitar muitas chamadas
    maxWait: 3000,
    immediate: false
  },
  ui: {
    type: 'ui',
    delay: 100, // 100ms para UI - responsivo
    maxWait: 300,
    immediate: false
  }
}

export const useOptimizedDebounce = () => {
  const timers = new Map<string, NodeJS.Timeout>()
  const maxWaitTimers = new Map<string, NodeJS.Timeout>()
  const lastExecuted = new Map<string, number>()

  /**
   * Cria uma função debounced otimizada para um tipo específico de ação
   */
  const createDebouncedFunction = <T extends (...args: any[]) => any>(
    fn: T,
    actionType: string,
    customConfig?: Partial<ActionConfig>
  ): T => {
    const config = { ...ACTION_CONFIGS[actionType], ...customConfig }
    const functionId = `${actionType}_${Date.now()}_${Math.random()}`
    
    return ((...args: Parameters<T>) => {
      const now = Date.now()
      
      // Limpar timer anterior
      if (timers.has(functionId)) {
        clearTimeout(timers.get(functionId)!)
      }
      
      // Se é a primeira execução e immediate é true
      if (config.immediate && !lastExecuted.has(functionId)) {
        lastExecuted.set(functionId, now)
        return fn(...args)
      }
      
      // Configurar timer principal
      const timer = setTimeout(() => {
        lastExecuted.set(functionId, now)
        fn(...args)
        timers.delete(functionId)
        if (maxWaitTimers.has(functionId)) {
          clearTimeout(maxWaitTimers.get(functionId)!)
          maxWaitTimers.delete(functionId)
        }
      }, config.delay)
      
      timers.set(functionId, timer)
      
      // Configurar maxWait se especificado
      if (config.maxWait && !maxWaitTimers.has(functionId)) {
        const maxWaitTimer = setTimeout(() => {
          if (timers.has(functionId)) {
            clearTimeout(timers.get(functionId)!)
            timers.delete(functionId)
          }
          lastExecuted.set(functionId, now)
          fn(...args)
          maxWaitTimers.delete(functionId)
        }, config.maxWait)
        
        maxWaitTimers.set(functionId, maxWaitTimer)
      }
    }) as T
  }

  /**
   * Debounce para busca - otimizado para responsividade
   */
  const debouncedSearch = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'search')
  }

  /**
   * Debounce para cálculos de preço - balanceado
   */
  const debouncedPricing = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'pricing')
  }

  /**
   * Debounce para validação - feedback rápido
   */
  const debouncedValidation = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'validation')
  }

  /**
   * Debounce para salvamento - não muito frequente
   */
  const debouncedSave = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'save')
  }

  /**
   * Debounce para chamadas de API - evitar spam
   */
  const debouncedApi = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'api')
  }

  /**
   * Debounce para atualizações de UI - responsivo
   */
  const debouncedUi = <T extends (...args: any[]) => any>(fn: T): T => {
    return createDebouncedFunction(fn, 'ui')
  }

  /**
   * Debounce customizado com configuração específica
   */
  const debouncedCustom = <T extends (...args: any[]) => any>(
    fn: T,
    config: DebounceConfig
  ): T => {
    return createDebouncedFunction(fn, 'custom', config)
  }

  /**
   * Cancela todos os timers pendentes
   */
  const cancelAll = (): void => {
    timers.forEach(timer => clearTimeout(timer))
    maxWaitTimers.forEach(timer => clearTimeout(timer))
    timers.clear()
    maxWaitTimers.clear()
    lastExecuted.clear()
  }

  /**
   * Cancela timers de um tipo específico
   */
  const cancelByType = (actionType: string): void => {
    const keysToDelete: string[] = []
    
    timers.forEach((timer, key) => {
      if (key.startsWith(actionType)) {
        clearTimeout(timer)
        keysToDelete.push(key)
      }
    })
    
    maxWaitTimers.forEach((timer, key) => {
      if (key.startsWith(actionType)) {
        clearTimeout(timer)
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => {
      timers.delete(key)
      maxWaitTimers.delete(key)
      lastExecuted.delete(key)
    })
  }

  /**
   * Obtém estatísticas dos debounces ativos
   */
  const getStats = () => {
    return {
      activeTimers: timers.size,
      activeMaxWaitTimers: maxWaitTimers.size,
      lastExecutedCount: lastExecuted.size,
      actionTypes: Object.keys(ACTION_CONFIGS)
    }
  }

  // Cleanup automático
  onUnmounted(() => {
    cancelAll()
  })

  return {
    createDebouncedFunction,
    debouncedSearch,
    debouncedPricing,
    debouncedValidation,
    debouncedSave,
    debouncedApi,
    debouncedUi,
    debouncedCustom,
    cancelAll,
    cancelByType,
    getStats,
    ACTION_CONFIGS
  }
}

/**
 * Hook para debounce de watchers Vue
 */
export const useDebouncedWatch = <T>(
  source: () => T,
  callback: (value: T, oldValue: T) => void,
  actionType: string = 'ui',
  customConfig?: Partial<ActionConfig>
) => {
  const { createDebouncedFunction } = useOptimizedDebounce()
  
  const debouncedCallback = createDebouncedFunction(
    callback,
    actionType,
    customConfig
  )
  
  watch(source, debouncedCallback)
}

/**
 * Hook para debounce de computed
 */
export const useDebouncedComputed = <T>(
  getter: () => T,
  actionType: string = 'ui',
  customConfig?: Partial<ActionConfig>
) => {
  const { createDebouncedFunction } = useOptimizedDebounce()
  const value = ref<T>()
  
  const debouncedGetter = createDebouncedFunction(
    () => {
      value.value = getter()
    },
    actionType,
    customConfig
  )
  
  // Executar imediatamente na primeira vez
  debouncedGetter()
  
  return computed(() => value.value)
}
