import { ref, watch, onMounted } from 'vue'
import { useOptimizedDebounce } from './useOptimizedDebounce'

export interface BookingProgress {
  tourId?: string
  productId?: string
  productSlug?: string
  participants: {
    adults: number
    children: number
  }
  childrenAges?: Array<{
    age: string
  }>
  selectedDate?: string
  selectedRange?: {
    from: string
    to: string
    nights: number
  }
  pricing?: any
  lastUpdated: number
}

const STORAGE_KEY_PREFIX = 'casadapedra_booking_progress'
const AUTO_SAVE_DELAY = 2000 // 2 segundos

export const useAutoSave = (productId?: string, productSlug?: string) => {
  const isAutoSaving = ref(false)
  const lastSaved = ref<Date | null>(null)
  const hasUnsavedChanges = ref(false)
  const { debouncedSave: optimizedDebouncedSave } = useOptimizedDebounce()

  // Gerar chave única para este produto
  const getStorageKey = (): string => {
    const identifier = productId || productSlug || 'default'
    return `${STORAGE_KEY_PREFIX}_${identifier}`
  }

  // Obter progresso padrão
  const getDefaultProgress = (): BookingProgress => {
    return {
      productId,
      productSlug,
      participants: { adults: 1, children: 0 },
      lastUpdated: Date.now()
    }
  }

  // Salvar progresso no localStorage
  const saveProgress = (progress: Partial<BookingProgress>) => {
    try {
      // Verificar se estamos no cliente (localStorage disponível)
      if (typeof window === 'undefined' || !window.localStorage) {
        return
      }
      
      const currentProgress = getStoredProgress()
      const updatedProgress: BookingProgress = {
        ...currentProgress,
        ...progress,
        productId: productId || currentProgress.productId,
        productSlug: productSlug || currentProgress.productSlug,
        lastUpdated: Date.now()
      }
      
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedProgress))
      lastSaved.value = new Date()
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('❌ Erro ao salvar progresso:', error)
    }
  }

  // Carregar progresso do localStorage
  const getStoredProgress = (): BookingProgress => {
    try {
      // Verificar se estamos no cliente (localStorage disponível)
      if (typeof window === 'undefined' || !window.localStorage) {
        return getDefaultProgress()
      }
      
      const stored = localStorage.getItem(getStorageKey())
      if (stored) {
        const parsed = JSON.parse(stored)
        // Verificar se não é muito antigo (24 horas)
        const isRecent = Date.now() - parsed.lastUpdated < 24 * 60 * 60 * 1000
        if (isRecent) {
          return parsed
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso:', error)
    }
    
    return getDefaultProgress()
  }

  // Limpar progresso salvo
  const clearProgress = () => {
    try {
      localStorage.removeItem(getStorageKey())
      lastSaved.value = null
      hasUnsavedChanges.value = false
      console.log('🗑️ Progresso limpo para produto:', productId || productSlug)
    } catch (error) {
      console.error('❌ Erro ao limpar progresso:', error)
    }
  }

  // Auto-save com debounce otimizado
  let pendingProgress: Partial<BookingProgress> = {}
  
  const debouncedSave = optimizedDebouncedSave((progress: Partial<BookingProgress>) => {
    // Acumular mudanças pendentes
    pendingProgress = { ...pendingProgress, ...progress }
    
    hasUnsavedChanges.value = true
    isAutoSaving.value = true
    
    saveProgress(pendingProgress)
    
    // Limpar progresso pendente após salvar
    pendingProgress = {}
    
    setTimeout(() => {
      isAutoSaving.value = false
    }, 500)
  })

  // Watcher para auto-save de participantes
  const watchParticipants = (participants: any) => {
    watch(participants, (newParticipants) => {
      if (newParticipants) {
        debouncedSave({
          participants: {
            adults: newParticipants.adults || 1,
            children: newParticipants.children || 0
          }
        })
      }
    }, { deep: true })
  }

  // Watcher para auto-save de datas
  const watchDates = (selectedDate: any, selectedRange: any) => {
    watch([selectedDate, selectedRange], ([newDate, newRange]) => {
      if (newDate || newRange) {
        debouncedSave({
          selectedDate: newDate,
          selectedRange: newRange
        })
      }
    }, { deep: true })
  }

  // Watcher para auto-save de preços
  const watchPricing = (pricing: any) => {
    watch(pricing, (newPricing) => {
      if (newPricing) {
        debouncedSave({
          pricing: newPricing
        })
      }
    }, { deep: true })
  }

  // Restaurar progresso ao montar
  const restoreProgress = (currentTourId?: string) => {
    const progress = getStoredProgress()
    if (progress.lastUpdated) {
      lastSaved.value = new Date(progress.lastUpdated)
      
      // Se temos um tourId atual, verificar se corresponde ao salvo
      if (currentTourId && progress.tourId && progress.tourId !== currentTourId) {
        // Limpar datas se for um tour diferente
        progress.selectedDate = undefined
        progress.selectedRange = undefined
      }
    }
    return progress
  }

  // Indicador visual de salvamento
  const getSaveStatus = () => {
    if (isAutoSaving.value) {
      return { text: 'Salvando...', icon: 'heroicons:arrow-path', color: 'blue' }
    }
    
    if (hasUnsavedChanges.value) {
      return { text: 'Alterações não salvas', icon: 'heroicons:exclamation-triangle', color: 'orange' }
    }
    
    if (lastSaved.value) {
      const timeAgo = Math.floor((Date.now() - lastSaved.value.getTime()) / 1000)
      if (timeAgo < 60) {
        return { text: 'Salvo agora', icon: 'heroicons:check-circle', color: 'green' }
      } else if (timeAgo < 3600) {
        const minutes = Math.floor(timeAgo / 60)
        return { text: `Salvo há ${minutes}min`, icon: 'heroicons:check-circle', color: 'green' }
      } else {
        return { text: 'Salvo anteriormente', icon: 'heroicons:check-circle', color: 'green' }
      }
    }
    
    return { text: 'Não salvo', icon: 'heroicons:exclamation-circle', color: 'gray' }
  }

  return {
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges,
    saveProgress,
    getStoredProgress,
    clearProgress,
    debouncedSave,
    watchParticipants,
    watchDates,
    watchPricing,
    restoreProgress,
    getSaveStatus
  }
}
