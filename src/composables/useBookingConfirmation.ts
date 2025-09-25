import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface BookingConfirmationData {
  tourTitle: string
  tourLocation: string
  tourDuration: string
  tourDifficulty: string
  tourImage: string
  bookingDate: string
  participants: {
    adults: number
    children: number
  }
  childrenAges?: Array<{ age: string }>
  meetingPoint?: string
  pricing: {
    adults: { count: number; total: number }
    children: { count: number; total: number }
    taxes: number
    fees: number
    discount?: { amount: number; percentage: number; reason: string }
    total: number
  }
  importantInfo?: string
  cancellationPolicy?: string
}

export const useBookingConfirmation = () => {
  const { t } = useI18n()
  const isModalOpen = ref(false)
  const isProcessing = ref(false)
  const bookingData = ref<BookingConfirmationData | null>(null)
  const processingStep = ref<string>('')

  /**
   * Abre o modal de confirmação com os dados da reserva
   */
  const openConfirmationModal = (data: BookingConfirmationData) => {
    bookingData.value = data
    isModalOpen.value = true
    isProcessing.value = false
    processingStep.value = ''
  }

  /**
   * Fecha o modal de confirmação
   */
  const closeConfirmationModal = () => {
    if (!isProcessing.value) {
      isModalOpen.value = false
      bookingData.value = null
      processingStep.value = ''
    }
  }

  /**
   * Confirma a reserva e inicia o processamento
   */
  const confirmBooking = async (data: BookingConfirmationData) => {
    if (isProcessing.value) return

    isProcessing.value = true
    processingStep.value = 'Validando dados...'

    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 1000))
      processingStep.value = 'Processando pagamento...'

      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      processingStep.value = 'Criando reserva...'

      // Simular criação da reserva
      await new Promise(resolve => setTimeout(resolve, 1500))
      processingStep.value = 'Enviando confirmação...'

      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Sucesso
      processingStep.value = 'Reserva confirmada!'
      
      // Aguardar um pouco antes de fechar
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Fechar modal e limpar dados
      closeConfirmationModal()
      
      // Emitir evento de sucesso (pode ser usado pelo componente pai)
      return { success: true, message: 'Reserva confirmada com sucesso!' }

    } catch (error) {
      console.error('Erro ao confirmar reserva:', error)
      processingStep.value = 'Erro ao processar reserva'
      
      // Aguardar um pouco antes de permitir nova tentativa
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      isProcessing.value = false
      processingStep.value = ''
      
      return { 
        success: false, 
        message: 'Erro ao processar reserva. Tente novamente.' 
      }
    }
  }

  /**
   * Valida os dados da reserva antes de abrir o modal
   */
  const validateBookingData = (data: Partial<BookingConfirmationData>): string[] => {
    const errors: string[] = []

    if (!data.tourTitle) {
      errors.push('Título do tour é obrigatório')
    }

    if (!data.bookingDate) {
      errors.push('Data da reserva é obrigatória')
    }

    if (!data.participants || data.participants.adults < 1) {
      errors.push('Pelo menos 1 adulto é obrigatório')
    }

    if (!data.pricing || data.pricing.total <= 0) {
      errors.push('Preço total deve ser maior que zero')
    }

    return errors
  }

  /**
   * Prepara os dados da reserva para o modal
   */
  const prepareBookingData = (
    tour: any,
    selectedDate: string,
    participants: { adults: number; children: number },
    pricing: any,
    childrenAges?: Array<{ age: string }>
  ): BookingConfirmationData => {
    return {
      tourTitle: tour?.title || 'Tour não especificado',
      tourLocation: tour?.location || 'Local não especificado',
      tourDuration: tour?.duration || 'Duração não especificada',
      tourDifficulty: tour?.difficulty_level || 'Não especificado',
      tourImage: tour?.images?.[0] || tour?.image || '',
      bookingDate: selectedDate,
      participants,
      childrenAges,
      meetingPoint: tour?.meeting_point,
      pricing: {
        adults: {
          count: participants.adults,
          total: pricing?.adults?.total || 0
        },
        children: {
          count: participants.children,
          total: pricing?.children?.total || 0
        },
        taxes: pricing?.taxes || 0,
        fees: pricing?.fees || 0,
        discount: pricing?.discount,
        total: pricing?.total || 0
      },
      importantInfo: tour?.important_info,
      cancellationPolicy: tour?.cancellation_policy
    }
  }

  /**
   * Gera um resumo da reserva para exibição
   */
  const getBookingSummary = computed(() => {
    if (!bookingData.value) return ''

    const { tourTitle, bookingDate, participants, pricing } = bookingData.value
    const date = new Date(bookingDate).toLocaleDateString('pt-BR')
    const totalPeople = participants.adults + participants.children
    
    return `${tourTitle} - ${date} - ${totalPeople} pessoa${totalPeople > 1 ? 's' : ''} - ${formatPrice(pricing.total)}`
  })

  /**
   * Formata preço para exibição
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  /**
   * Verifica se o modal pode ser fechado
   */
  const canCloseModal = computed(() => {
    return !isProcessing.value
  })

  /**
   * Obtém o status atual do processamento
   */
  const processingStatus = computed(() => {
    if (!isProcessing.value) return null
    
    return {
      isProcessing: isProcessing.value,
      step: processingStep.value,
      canCancel: false // Não permitir cancelar durante processamento
    }
  })

  return {
    // Estado
    isModalOpen,
    isProcessing,
    bookingData,
    processingStep,
    
    // Computed
    getBookingSummary,
    canCloseModal,
    processingStatus,
    
    // Métodos
    openConfirmationModal,
    closeConfirmationModal,
    confirmBooking,
    validateBookingData,
    prepareBookingData,
    formatPrice
  }
}
