import { ref } from 'vue'

export interface AvailabilityDay {
  date: string // YYYY-MM-DD
  status: 'available' | 'unavailable' | 'partial'
  minNights?: number
  maxNights?: number
  price?: number
}

export interface TourDetails {
  id: string
  title: string
  description: string
  duration: string
  minNights?: number
  maxNights?: number
  allowRange?: boolean
  minPrice?: number
  maxPrice?: number
  capacity?: {
    min: number
    max: number
  }
  includes?: string[]
  excludes?: string[]
  itinerary?: string[]
  policies?: Array<{
    type: string
    description: string
  }>
}

export interface AvailabilityFilters {
  month: number
  year: number
  adults?: number
  children?: number
}

export const useAvailability = () => {
  const { api } = useStarhubApi()
  
  const getTourAvailability = async (
    idOrSlug: string, 
    filters: AvailabilityFilters
  ): Promise<AvailabilityDay[]> => {
    try {
      const params = {
        year: filters.year,
        month: filters.month,
        adults: filters.adults || 1,
        children: filters.children || 0
      }
      
      const response = await api.get(`/tours/${idOrSlug}/availability`, params)
      
      
      // Verificar se response é um array ou tem uma propriedade data
      const availabilityData = Array.isArray(response) ? response : (response.data || [])
      
      // Normalizar resposta da API
      return availabilityData.map((day: any) => {
        
        // Se day é uma string (data), tratar como disponível
        if (typeof day === 'string') {
          return {
            date: day,
            status: 'available',
            minNights: undefined,
            maxNights: undefined,
            price: undefined
          }
        }
        
        // Se day é um objeto, usar suas propriedades
        return {
          date: day.date,
          status: day.status || 'unavailable',
          minNights: day.min_nights,
          maxNights: day.max_nights,
          price: day.price
        }
      })
      
    } catch (error: any) {
      console.error('Error fetching tour availability:', error)
      throw error
    }
  }
  
  const getTourDetails = async (idOrSlug: string): Promise<TourDetails> => {
    try {
      // Usar /products/extended/{uuid} que realmente funciona na API
      const response = await api.get(`/products/extended/${idOrSlug}`)
      
      return {
        id: response.uuid || response.id,
        title: response.name || response.title,
        description: response.description,
        duration: response.duration,
        minNights: response.min_nights,
        maxNights: response.max_nights,
        allowRange: response.allow_range || false,
        minPrice: response.min_price,
        maxPrice: response.max_price,
        capacity: response.capacity ? {
          min: response.capacity.min || response.min_participants || 1,
          max: response.capacity.max || response.max_participants || 10
        } : {
          min: response.min_participants || 1,
          max: response.max_participants || 10
        },
        includes: response.includes,
        excludes: response.excludes,
        itinerary: response.itinerary,
        policies: response.policies,
        // Incluir todos os campos da resposta original, especialmente images
        ...response
      }
      
    } catch (error: any) {
      console.error('Error fetching tour details:', error)
      throw error
    }
  }
  
  const checkRangeAvailability = (
    from: string,
    to: string,
    availability: AvailabilityDay[],
    minNights?: number,
    maxNights?: number
  ): boolean => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Verificar mínimo de noites
    if (minNights && nights < minNights) {
      return false
    }
    
    // Verificar máximo de noites
    if (maxNights && nights > maxNights) {
      return false
    }
    
    // Verificar se todas as datas no range estão disponíveis
    const currentDate = new Date(fromDate)
    while (currentDate < toDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayAvailability = availability.find(day => day.date === dateStr)
      
      if (!dayAvailability || dayAvailability.status === 'unavailable') {
        return false
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return true
  }
  
  const getAvailableDates = (
    availability: AvailabilityDay[],
    allowRange: boolean = false
  ): string[] => {
    return availability
      .filter(day => day.status === 'available')
      .map(day => day.date)
  }
  
  const getUnavailableDates = (
    availability: AvailabilityDay[]
  ): string[] => {
    return availability
      .filter(day => day.status === 'unavailable')
      .map(day => day.date)
  }
  
  return {
    getTourAvailability,
    getTourDetails,
    checkRangeAvailability,
    getAvailableDates,
    getUnavailableDates
  }
}
