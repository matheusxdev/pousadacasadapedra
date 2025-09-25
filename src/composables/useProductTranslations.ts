export function useProductTranslations() {
  const translateProductData = (product: any, locale: string = 'pt') => {
    if (!product) return product

    // Traduzir campos específicos baseado no idioma
    const translations = {
      pt: {
        // Campos que podem vir da API em português
        duration: product.duration || 'Duração não informada',
        location: product.location || 'Localização não informada',
        description: product.description || 'Descrição não disponível',
        includes: product.includes || [],
        excludes: product.excludes || [],
        meetingPoint: product.meeting_point || 'Ponto de encontro não informado',
        cancellationPolicy: product.cancellation_policy || 'Política de cancelamento não informada'
      },
      en: {
        duration: product.duration || 'Duration not informed',
        location: product.location || 'Location not informed', 
        description: product.description || 'Description not available',
        includes: product.includes || [],
        excludes: product.excludes || [],
        meetingPoint: product.meeting_point || 'Meeting point not informed',
        cancellationPolicy: product.cancellation_policy || 'Cancellation policy not informed'
      },
      es: {
        duration: product.duration || 'Duración no informada',
        location: product.location || 'Ubicación no informada',
        description: product.description || 'Descripción no disponible',
        includes: product.includes || [],
        excludes: product.excludes || [],
        meetingPoint: product.meeting_point || 'Punto de encuentro no informado',
        cancellationPolicy: product.cancellation_policy || 'Política de cancelación no informada'
      }
    }

    return {
      ...product,
      ...translations[locale as keyof typeof translations]
    }
  }

  const translateProductTitle = (product: any, locale: string = 'pt') => {
    if (!product) return 'Produto não encontrado'

    // Se o produto tem título em múltiplos idiomas
    if (product.title_translations) {
      return product.title_translations[locale] || product.title_translations.pt || product.name || product.title
    }

    // Se tem campos específicos por idioma
    if (product[`title_${locale}`]) {
      return product[`title_${locale}`]
    }

    // Fallback para o título padrão
    return product.name || product.title || 'Produto sem título'
  }

  const translateProductDescription = (product: any, locale: string = 'pt') => {
    if (!product) return 'Descrição não disponível'

    // Se o produto tem descrição em múltiplos idiomas
    if (product.description_translations) {
      return product.description_translations[locale] || product.description_translations.pt || product.description
    }

    // Se tem campos específicos por idioma
    if (product[`description_${locale}`]) {
      return product[`description_${locale}`]
    }

    // Fallback para a descrição padrão
    return product.description || 'Descrição não disponível'
  }

  return {
    translateProductData,
    translateProductTitle,
    translateProductDescription
  }
}
