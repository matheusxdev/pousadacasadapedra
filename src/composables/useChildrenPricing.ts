import { PRODUCT_CHILDREN_PRICING_RULES } from '@/config/childrenPricingRules'

export interface AgeRule {
  minAge: number
  maxAge: number
  label: string
  multiplier: number // 0 = gratuito, 0.5 = 50% desconto, 1 = preço cheio
  description: string
}

export interface ProductAgeRules {
  productId: string
  rules: AgeRule[]
  defaultMultiplier: number // Para idades não cobertas pelas regras
}

// Regras padrão que podem ser sobrescritas por produto
const DEFAULT_AGE_RULES: AgeRule[] = [
  {
    minAge: 0,
    maxAge: 2,
    label: '0-2 anos',
    multiplier: 0,
    description: 'Gratuito'
  },
  {
    minAge: 3,
    maxAge: 5,
    label: '3-5 anos',
    multiplier: 0.5,
    description: '50% desconto'
  },
  {
    minAge: 6,
    maxAge: 11,
    label: '6-11 anos',
    multiplier: 0.75,
    description: '25% desconto'
  },
  {
    minAge: 12,
    maxAge: 17,
    label: '12-17 anos',
    multiplier: 0.9,
    description: '10% desconto'
  }
]

// Usar as regras do arquivo de configuração
const PRODUCT_SPECIFIC_RULES = PRODUCT_CHILDREN_PRICING_RULES

export const useChildrenPricing = () => {
  /**
   * Obtém as regras de idade para um produto específico
   */
  const getAgeRules = (productId: string): AgeRule[] => {
    return PRODUCT_SPECIFIC_RULES[productId] || DEFAULT_AGE_RULES
  }

  /**
   * Calcula o preço para uma criança baseado na idade
   */
  const calculateChildPrice = (basePrice: number, age: number, productId: string): number => {
    const rules = getAgeRules(productId)
    const rule = rules.find(r => age >= r.minAge && age <= r.maxAge)
    
    if (rule) {
      return basePrice * rule.multiplier
    }
    
    // Se não encontrar regra específica, usar regra padrão
    return basePrice * 0.8 // 20% desconto padrão
  }

  /**
   * Obtém a regra de idade para uma faixa etária específica
   */
  const getAgeRule = (ageRange: string, productId: string): AgeRule | null => {
    const rules = getAgeRules(productId)
    return rules.find(rule => rule.label === ageRange) || null
  }

  /**
   * Obtém todas as opções de idade disponíveis para um produto
   */
  const getAgeOptions = (productId: string): AgeRule[] => {
    return getAgeRules(productId)
  }

  /**
   * Calcula o total de economia com preços diferenciados
   */
  const calculateSavings = (
    basePrice: number, 
    childrenAges: string[], 
    productId: string
  ): number => {
    const fullPrice = childrenAges.length * basePrice
    const discountedPrice = childrenAges.reduce((total, ageRange) => {
      const rule = getAgeRule(ageRange, productId)
      if (rule) {
        return total + (basePrice * rule.multiplier)
      }
      return total + basePrice
    }, 0)
    
    return fullPrice - discountedPrice
  }

  /**
   * Calcula o preço total das crianças
   */
  const calculateTotalChildrenPrice = (
    basePrice: number, 
    childrenAges: string[], 
    productId: string
  ): number => {
    return childrenAges.reduce((total, ageRange) => {
      const rule = getAgeRule(ageRange, productId)
      if (rule) {
        return total + (basePrice * rule.multiplier)
      }
      return total + basePrice
    }, 0)
  }

  /**
   * Formata o preço em moeda brasileira
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  /**
   * Obtém informações sobre as regras de um produto
   */
  const getProductPricingInfo = (productId: string) => {
    const rules = getAgeRules(productId)
    const hasCustomRules = PRODUCT_SPECIFIC_RULES[productId] !== undefined
    
    return {
      rules,
      hasCustomRules,
      defaultRules: DEFAULT_AGE_RULES,
      customRules: PRODUCT_SPECIFIC_RULES[productId] || null
    }
  }

  return {
    getAgeRules,
    calculateChildPrice,
    getAgeRule,
    getAgeOptions,
    calculateSavings,
    calculateTotalChildrenPrice,
    formatPrice,
    getProductPricingInfo,
    DEFAULT_AGE_RULES,
    PRODUCT_SPECIFIC_RULES
  }
}
