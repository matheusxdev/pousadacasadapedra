export interface PricingBreakdown {
  subtotal: number
  taxes: number
  fees: number
  discount?: {
    amount: number
    percentage: number
    reason: string
  }
  total: number
  currency: string
  adults: {
    count: number
    pricePerPerson: number
    total: number
  }
  children: {
    count: number
    pricePerPerson: number
    total: number
  }
  nights?: number
  pricePerNight?: number
}

import { ref } from 'vue'
import { useSmartCache } from './useSmartCache'

export interface PricingRequest {
  id: string
  from?: string // YYYY-MM-DD para stays
  to?: string   // YYYY-MM-DD para stays
  date?: string // YYYY-MM-DD para tours
  adults: number
  children: number
  childrenAges?: string[] // Idades das crianças para cálculo preciso
}

export const usePricing = () => {
  const { api } = useStarhubApi()
  const { cachePrice, getCachedPrice } = useSmartCache()
  
  const getTourPricing = async (request: PricingRequest): Promise<PricingBreakdown> => {
    try {
      // Verificar cache primeiro
      if (request.date) {
        const cachedPrice = getCachedPrice(
          request.id,
          request.date,
          { adults: request.adults, children: request.children },
          request.childrenAges || []
        )
        
        if (cachedPrice !== null) {
          // Retornar preço do cache
          const adultPrice = cachedPrice / (request.adults + request.children * 0.5)
          const childPrice = adultPrice * 0.5
          
          return {
            subtotal: cachedPrice,
            taxes: 0,
            fees: 0,
            total: cachedPrice,
            currency: 'BRL',
            adults: {
              count: request.adults,
              pricePerPerson: adultPrice,
              total: adultPrice * request.adults
            },
            children: {
              count: request.children,
              pricePerPerson: childPrice,
              total: childPrice * request.children
            }
          }
        }
      }
      
      // Como o endpoint /tours/{uuid}/pricing não existe na API real,
      // vamos usar os dados do produto para calcular o preço
      const productData = await api.get(`/products/extended/${request.id}`)
      
      // Usar preços do produto
      const basePrice = productData.current_price || productData.price || productData.min_price || 0
      const adultPrice = basePrice
      
      // Calcular preço das crianças baseado nas idades se disponível
      let childrenTotal = 0
      if (request.childrenAges && request.childrenAges.length > 0) {
        // Usar regras específicas de idade
        const { useChildrenPricing } = await import('./useChildrenPricing')
        const { calculateTotalChildrenPrice } = useChildrenPricing()
        childrenTotal = calculateTotalChildrenPrice(basePrice, request.childrenAges, request.id)
      } else {
        // Fallback para 50% do preço adulto
        childrenTotal = basePrice * 0.5 * request.children
      }
      
      const adultsTotal = adultPrice * request.adults
      const subtotal = adultsTotal + childrenTotal
      
      // Sem taxas por enquanto - usar apenas o subtotal
      const taxes = 0
      const fees = 0
      const total = subtotal
      
      // Salvar no cache se tiver data
      if (request.date) {
        cachePrice(
          request.id,
          request.date,
          { adults: request.adults, children: request.children },
          request.childrenAges || [],
          total
        )
      }
      
      return {
        subtotal,
        taxes,
        fees,
        total,
        currency: 'BRL',
        adults: {
          count: request.adults,
          pricePerPerson: adultPrice,
          total: adultsTotal
        },
        children: {
          count: request.children,
          pricePerPerson: request.children > 0 ? childrenTotal / request.children : 0,
          total: childrenTotal
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching tour pricing:', error)
      throw error
    }
  }
  
  const getStayPricing = async (request: PricingRequest): Promise<PricingBreakdown> => {
    try {
      // Para stays, vamos buscar os dados do produto e calcular o preço
      const productData = await api.get(`/products/extended/${request.id}`)
      
      if (!request.from || !request.to) {
        throw new Error('Datas de check-in e check-out são obrigatórias para acomodações')
      }
      
      const fromDate = new Date(request.from)
      const toDate = new Date(request.to)
      const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
      
      
      // Tentar diferentes campos de preço em ordem de prioridade
      const basePrice = productData.current_price || 
                       productData.price || 
                       productData.price_original || 
                       productData.price_promo || 
                       productData.cust_price || 
                       productData.from_price || 
                       productData.min_price || 
                       productData.base_price || 
                       productData.rate || 
                       productData.cost || 
                       0
      const adultPrice = basePrice
      const childPrice = basePrice * 0.5 // 50% do preço adulto
      
      const adultsTotal = adultPrice * request.adults * nights
      const childrenTotal = childPrice * request.children * nights
      const subtotal = adultsTotal + childrenTotal
      
      // Sem taxas por enquanto - usar apenas o subtotal
      const taxes = 0
      const fees = 0
      const total = subtotal
      
      
      return {
        subtotal,
        taxes,
        fees,
        total,
        currency: 'BRL',
        nights,
        pricePerNight: basePrice,
        adults: {
          count: request.adults,
          pricePerPerson: adultPrice,
          total: adultsTotal
        },
        children: {
          count: request.children,
          pricePerPerson: childPrice,
          total: childrenTotal
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching stay pricing:', error)
      throw error
    }
  }
  
  const calculateTotal = (breakdown: PricingBreakdown): number => {
    return breakdown.total
  }
  
  const formatPrice = (price: number, currency: string = 'BRL'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }
  
  const getPricePerPerson = (breakdown: PricingBreakdown): number => {
    const totalPeople = breakdown.adults.count + breakdown.children.count
    return totalPeople > 0 ? breakdown.total / totalPeople : 0
  }
  
  return {
    getTourPricing,
    getStayPricing,
    calculateTotal,
    formatPrice,
    getPricePerPerson
  }
}
