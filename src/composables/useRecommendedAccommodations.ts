import { ref, computed } from 'vue'

interface Accommodation {
  id: string
  name: string
  location: string
  price: string
  image: string
  slug?: string
  rating?: number
  reviews?: number
}

export const useRecommendedAccommodations = () => {
  const accommodations = ref<Accommodation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRecommendedAccommodations = async () => {
    loading.value = true
    error.value = null

    try {
      // Tentar múltiplos endpoints para buscar acomodações
      let accommodationsResponse: any = null

      // Primeiro, tentar o endpoint unificado
      try {
        accommodationsResponse = await $fetch('/api/products/unified', {
          query: {
            type: 'accommodation',
            limit: 3,
            sort: 'popularity' // ou 'sales' se disponível
          }
        })
      } catch (unifiedError) {
        
        // Fallback para endpoint de busca
        try {
          accommodationsResponse = await $fetch('/api/search', {
            query: {
              type: 'accommodation',
              limit: 3,
              sort: 'popularity'
            }
          })
        } catch (searchError) {
          
          // Último fallback para endpoint direto de acomodações
          accommodationsResponse = await $fetch('/api/accommodations', {
            query: {
              limit: 3,
              sort: 'popularity'
            }
          })
        }
      }

      // Processar resposta e extrair dados
      let accommodationsData: any[] = []
      
      if (accommodationsResponse?.data) {
        accommodationsData = accommodationsResponse.data
      } else if (accommodationsResponse?.accommodations) {
        accommodationsData = accommodationsResponse.accommodations
      } else if (Array.isArray(accommodationsResponse)) {
        accommodationsData = accommodationsResponse
      }

      // Transformar dados para o formato esperado
      accommodations.value = accommodationsData.slice(0, 3).map((item: any) => {
        // Processar imagem corretamente
        let imageUrl = getDefaultImage()
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          // Se images é um array de objetos
          if (typeof item.images[0] === 'object' && item.images[0].url) {
            imageUrl = item.images[0].url
          } 
          // Se images é um array de strings
          else if (typeof item.images[0] === 'string') {
            imageUrl = item.images[0]
          }
        } else if (item.image && typeof item.image === 'string') {
          imageUrl = item.image
        } else if (item.main_image && typeof item.main_image === 'string') {
          imageUrl = item.main_image
        }

        // Processar preço corretamente
        let price = 0
        if (item.current_price && typeof item.current_price === 'number') {
          price = item.current_price
        } else if (item.price && typeof item.price === 'number') {
          price = item.price
        } else if (item.base_price && typeof item.base_price === 'number') {
          price = item.base_price
        } else if (item.price_promo && typeof item.price_promo === 'number') {
          price = item.price_promo
        } else if (item.price_original && typeof item.price_original === 'number') {
          price = item.price_original
        } else if (item.price_per_night && typeof item.price_per_night === 'number') {
          price = item.price_per_night
        } else if (item.min_price && typeof item.min_price === 'number') {
          price = item.min_price
        } else if (item.max_price && typeof item.max_price === 'number') {
          price = item.max_price
        }

        // Se não encontrou preço, mostrar "Preço a consultar"
        const priceText = price > 0 ? `A partir de ${formatPrice(price)}` : 'Preço a consultar'

        return {
          id: item.uuid || item.id || item.slug || Math.random().toString(),
          name: item.name || item.title || 'Pousada sem nome',
          location: item.location || item.address || item.subtitle || 'Búzios, RJ',
          price: priceText,
          image: imageUrl,
          slug: item.slug,
          rating: item.rating || item.avg_rating || item.average_rating || 4.5,
          reviews: item.reviews_count || item.reviews || 0
        }
      })


    } catch (err) {
      console.error('Error fetching recommended accommodations:', err)
      error.value = 'Erro ao carregar pousadas recomendadas'
      
      // Fallback para dados mockados em caso de erro
      accommodations.value = getMockAccommodations()
    } finally {
      loading.value = false
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getDefaultImage = (): string => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
    return defaultImages[Math.floor(Math.random() * defaultImages.length)]
  }

  const getMockAccommodations = (): Accommodation[] => [
    {
      id: '1',
      name: 'Pousada Casa da Pedra',
      location: 'Rua das Pedras, Búzios',
      price: 'R$ 450',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '2',
      name: 'Pousada Búzios Beach',
      location: 'Praia de Geribá, Búzios',
      price: 'R$ 380',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: '3',
      name: 'Pousada Sunset View',
      location: 'Orla Bardot, Búzios',
      price: 'R$ 520',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
  ]

  return {
    accommodations: computed(() => accommodations.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchRecommendedAccommodations
  }
}
