import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Tentar buscar categorias da API StarHub
    const response = await $fetch('/categories', {
      baseURL: 'https://api.starhubsolutions.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.public.starhubToken
      }
    })
    
    return response
  } catch (error) {
    // Se não encontrar na API, retornar categorias padrão
    // console.warn('Categories API not available, using default categories')
    
    const defaultCategories = [
      {
        id: 'adventure',
        name: 'Aventura',
        slug: 'aventura',
        description: 'Tours de aventura e esportes radicais',
        icon: 'adventure',
        color: '#fc6807',
        parentId: null,
        productCount: 0
      },
      {
        id: 'cultural',
        name: 'Cultural',
        slug: 'cultural',
        description: 'Tours culturais e históricos',
        icon: 'culture',
        color: '#002279',
        parentId: null,
        productCount: 0
      },
      {
        id: 'nature',
        name: 'Natureza',
        slug: 'natureza',
        description: 'Tours de ecoturismo e natureza',
        icon: 'nature',
        color: '#28a745',
        parentId: null,
        productCount: 0
      },
      {
        id: 'beach',
        name: 'Praia',
        slug: 'praia',
        description: 'Tours de praia e atividades aquáticas',
        icon: 'beach',
        color: '#17a2b8',
        parentId: null,
        productCount: 0
      },
      {
        id: 'gastronomy',
        name: 'Gastronomia',
        slug: 'gastronomia',
        description: 'Tours gastronômicos e culinários',
        icon: 'food',
        color: '#6f42c1',
        parentId: null,
        productCount: 0
      },
      {
        id: 'accommodation',
        name: 'Hospedagem',
        slug: 'hospedagem',
        description: 'Acomodações e hospedagem',
        icon: 'hotel',
        color: '#fd7e14',
        parentId: null,
        productCount: 0
      }
    ]
    
    return {
      data: defaultCategories,
      meta: {
        total: defaultCategories.length,
        source: 'default'
      }
    }
  }
})
