import { ref, computed } from 'vue'

export interface LoadingState {
  isLoading: boolean
  error: string | null
  progress: number
  message: string
}

export interface LoadingConfig {
  minDuration?: number
  showProgress?: boolean
  showMessage?: boolean
  autoRetry?: boolean
  maxRetries?: number
}

export const useLoadingStates = (config: LoadingConfig = {}) => {
  const defaultConfig: Required<LoadingConfig> = {
    minDuration: 500,
    showProgress: false,
    showMessage: true,
    autoRetry: false,
    maxRetries: 3
  }

  const finalConfig = { ...defaultConfig, ...config }
  const loadingStates = ref<Map<string, LoadingState>>(new Map())
  const startTimes = ref<Map<string, number>>(new Map())

  /**
   * Inicia um estado de loading
   */
  const startLoading = (
    key: string,
    message: string = 'Carregando...',
    progress: number = 0
  ): void => {
    loadingStates.value.set(key, {
      isLoading: true,
      error: null,
      progress,
      message
    })
    startTimes.value.set(key, Date.now())
  }

  /**
   * Atualiza o progresso de um loading
   */
  const updateProgress = (key: string, progress: number, message?: string): void => {
    const state = loadingStates.value.get(key)
    if (state) {
      state.progress = Math.min(100, Math.max(0, progress))
      if (message) {
        state.message = message
      }
    }
  }

  /**
   * Atualiza a mensagem de um loading
   */
  const updateMessage = (key: string, message: string): void => {
    const state = loadingStates.value.get(key)
    if (state) {
      state.message = message
    }
  }

  /**
   * Finaliza um loading com sucesso
   */
  const finishLoading = (key: string): void => {
    const state = loadingStates.value.get(key)
    const startTime = startTimes.value.get(key)
    
    if (state && startTime) {
      const elapsed = Date.now() - startTime
      const remaining = finalConfig.minDuration - elapsed
      
      if (remaining > 0) {
        // Aguardar tempo mínimo para evitar flash
        setTimeout(() => {
          loadingStates.value.delete(key)
          startTimes.value.delete(key)
        }, remaining)
      } else {
        loadingStates.value.delete(key)
        startTimes.value.delete(key)
      }
    }
  }

  /**
   * Finaliza um loading com erro
   */
  const errorLoading = (key: string, error: string): void => {
    const state = loadingStates.value.get(key)
    if (state) {
      state.isLoading = false
      state.error = error
      
      // Limpar após um tempo
      setTimeout(() => {
        loadingStates.value.delete(key)
        startTimes.value.delete(key)
      }, 5000)
    }
  }

  /**
   * Verifica se um loading está ativo
   */
  const isLoading = (key: string): boolean => {
    return loadingStates.value.has(key) && 
           loadingStates.value.get(key)?.isLoading === true
  }

  /**
   * Obtém o estado de um loading
   */
  const getLoadingState = (key: string): LoadingState | null => {
    return loadingStates.value.get(key) || null
  }

  /**
   * Obtém todos os estados de loading ativos
   */
  const getActiveLoadings = computed(() => {
    const active: Array<{ key: string; state: LoadingState }> = []
    loadingStates.value.forEach((state, key) => {
      if (state.isLoading) {
        active.push({ key, state })
      }
    })
    return active
  })

  /**
   * Verifica se há algum loading ativo
   */
  const hasActiveLoadings = computed(() => {
    return getActiveLoadings.value.length > 0
  })

  /**
   * Obtém o progresso total de todos os loadings
   */
  const totalProgress = computed(() => {
    const activeLoadings = getActiveLoadings.value
    if (activeLoadings.length === 0) return 100
    
    const totalProgress = activeLoadings.reduce((sum, { state }) => {
      return sum + state.progress
    }, 0)
    
    return totalProgress / activeLoadings.length
  })

  /**
   * Limpa todos os estados de loading
   */
  const clearAll = (): void => {
    loadingStates.value.clear()
    startTimes.value.clear()
  }

  /**
   * Limpa um estado específico
   */
  const clear = (key: string): void => {
    loadingStates.value.delete(key)
    startTimes.value.delete(key)
  }

  /**
   * Hook para usar em componentes Vue
   */
  const useComponentLoading = (componentKey: string) => {
    const isComponentLoading = computed(() => isLoading(componentKey))
    const componentState = computed(() => getLoadingState(componentKey))
    const componentError = computed(() => componentState.value?.error || null)
    const componentProgress = computed(() => componentState.value?.progress || 0)
    const componentMessage = computed(() => componentState.value?.message || '')

    return {
      isComponentLoading,
      componentState,
      componentError,
      componentProgress,
      componentMessage,
      startLoading: (message?: string, progress?: number) => 
        startLoading(componentKey, message, progress),
      updateProgress: (progress: number, message?: string) => 
        updateProgress(componentKey, progress, message),
      updateMessage: (message: string) => 
        updateMessage(componentKey, message),
      finishLoading: () => finishLoading(componentKey),
      errorLoading: (error: string) => errorLoading(componentKey, error),
      clear: () => clear(componentKey)
    }
  }

  /**
   * Wrapper para operações assíncronas com loading automático
   */
  const withLoading = async <T>(
    key: string,
    operation: () => Promise<T>,
    message: string = 'Carregando...'
  ): Promise<T> => {
    try {
      startLoading(key, message)
      const result = await operation()
      finishLoading(key)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      errorLoading(key, errorMessage)
      throw error
    }
  }

  /**
   * Wrapper para operações com progresso
   */
  const withProgress = async <T>(
    key: string,
    operation: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    message: string = 'Carregando...'
  ): Promise<T> => {
    try {
      startLoading(key, message, 0)
      const result = await operation((progress, msg) => updateProgress(key, progress, msg))
      finishLoading(key)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      errorLoading(key, errorMessage)
      throw error
    }
  }

  return {
    startLoading,
    updateProgress,
    updateMessage,
    finishLoading,
    errorLoading,
    isLoading,
    getLoadingState,
    getActiveLoadings,
    hasActiveLoadings,
    totalProgress,
    clearAll,
    clear,
    useComponentLoading,
    withLoading,
    withProgress
  }
}

/**
 * Hook global para gerenciar estados de loading da aplicação
 */
export const useGlobalLoading = () => {
  const { 
    hasActiveLoadings, 
    totalProgress, 
    getActiveLoadings,
    clearAll 
  } = useLoadingStates()

  return {
    hasActiveLoadings,
    totalProgress,
    getActiveLoadings,
    clearAll
  }
}
