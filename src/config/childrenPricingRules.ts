import type { AgeRule } from '@/composables/useChildrenPricing'

/**
 * Configuração de regras de preços por idade para produtos específicos
 * 
 * Como usar:
 * 1. Identifique o UUID do produto na API
 * 2. Adicione uma entrada aqui com as regras específicas
 * 3. As regras serão aplicadas automaticamente
 */

export const PRODUCT_CHILDREN_PRICING_RULES: Record<string, AgeRule[]> = {
  // Exemplo: Tour de aventura com regras mais restritivas
  'adventure-tour-uuid': [
    {
      minAge: 0,
      maxAge: 3,
      label: '0-3 anos',
      multiplier: 0,
      description: 'Gratuito'
    },
    {
      minAge: 4,
      maxAge: 8,
      label: '4-8 anos',
      multiplier: 0.6,
      description: '40% desconto'
    },
    {
      minAge: 9,
      maxAge: 12,
      label: '9-12 anos',
      multiplier: 0.8,
      description: '20% desconto'
    },
    {
      minAge: 13,
      maxAge: 17,
      label: '13-17 anos',
      multiplier: 0.95,
      description: '5% desconto'
    }
  ],
  
  // Exemplo: Tour cultural com regras mais flexíveis
  'cultural-tour-uuid': [
    {
      minAge: 0,
      maxAge: 2,
      label: '0-2 anos',
      multiplier: 0,
      description: 'Gratuito'
    },
    {
      minAge: 3,
      maxAge: 6,
      label: '3-6 anos',
      multiplier: 0.3,
      description: '70% desconto'
    },
    {
      minAge: 7,
      maxAge: 12,
      label: '7-12 anos',
      multiplier: 0.6,
      description: '40% desconto'
    },
    {
      minAge: 13,
      maxAge: 17,
      label: '13-17 anos',
      multiplier: 0.8,
      description: '20% desconto'
    }
  ],

  // Exemplo: Tour de natureza com regras intermediárias
  'nature-tour-uuid': [
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
      multiplier: 0.4,
      description: '60% desconto'
    },
    {
      minAge: 6,
      maxAge: 10,
      label: '6-10 anos',
      multiplier: 0.7,
      description: '30% desconto'
    },
    {
      minAge: 11,
      maxAge: 17,
      label: '11-17 anos',
      multiplier: 0.85,
      description: '15% desconto'
    }
  ],

  // Exemplo: Tour de praia com regras específicas
  'beach-tour-uuid': [
    {
      minAge: 0,
      maxAge: 1,
      label: '0-1 anos',
      multiplier: 0,
      description: 'Gratuito'
    },
    {
      minAge: 2,
      maxAge: 4,
      label: '2-4 anos',
      multiplier: 0.5,
      description: '50% desconto'
    },
    {
      minAge: 5,
      maxAge: 8,
      label: '5-8 anos',
      multiplier: 0.75,
      description: '25% desconto'
    },
    {
      minAge: 9,
      maxAge: 17,
      label: '9-17 anos',
      multiplier: 0.9,
      description: '10% desconto'
    }
  ]
}

/**
 * Função para adicionar regras específicas para um produto
 * 
 * @param productId - UUID do produto
 * @param rules - Array de regras de idade
 */
export const addProductPricingRules = (productId: string, rules: AgeRule[]) => {
  PRODUCT_CHILDREN_PRICING_RULES[productId] = rules
}

/**
 * Função para obter regras de um produto específico
 * 
 * @param productId - UUID do produto
 * @returns Array de regras ou null se não existir
 */
export const getProductPricingRules = (productId: string): AgeRule[] | null => {
  return PRODUCT_CHILDREN_PRICING_RULES[productId] || null
}

/**
 * Função para verificar se um produto tem regras customizadas
 * 
 * @param productId - UUID do produto
 * @returns true se tem regras customizadas
 */
export const hasCustomPricingRules = (productId: string): boolean => {
  return productId in PRODUCT_CHILDREN_PRICING_RULES
}
