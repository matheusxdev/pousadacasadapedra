import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface LazyImageOptions {
  rootMargin?: string
  threshold?: number
  placeholder?: string
  errorImage?: string
  loadingClass?: string
  loadedClass?: string
  errorClass?: string
}

export const useLazyLoading = (options: LazyImageOptions = {}) => {
  const defaultOptions: Required<LazyImageOptions> = {
    rootMargin: '50px',
    threshold: 0.1,
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
    errorImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVlMmUyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm8gYW8gY2FycmVnYXI8L3RleHQ+PC9zdmc+',
    loadingClass: 'lazy-loading',
    loadedClass: 'lazy-loaded',
    errorClass: 'lazy-error'
  }

  const finalOptions = { ...defaultOptions, ...options }
  const observer = ref<IntersectionObserver | null>(null)
  const images = ref<Map<Element, HTMLImageElement>>(new Map())

  /**
   * Cria um observer para lazy loading
   */
  const createObserver = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = images.value.get(entry.target)
            if (img) {
              loadImage(img)
              observer.value?.unobserve(entry.target)
            }
          }
        })
      },
      {
        rootMargin: finalOptions.rootMargin,
        threshold: finalOptions.threshold
      }
    )
  }

  /**
   * Carrega uma imagem
   */
  const loadImage = (img: HTMLImageElement) => {
    const src = img.dataset.src
    if (!src) return

    // Adicionar classe de loading
    img.classList.add(finalOptions.loadingClass)
    img.classList.remove(finalOptions.loadedClass, finalOptions.errorClass)

    // Definir placeholder
    if (img.src !== finalOptions.placeholder) {
      img.src = finalOptions.placeholder
    }

    // Criar nova imagem para testar o carregamento
    const testImg = new Image()
    
    testImg.onload = () => {
      img.src = src
      img.classList.remove(finalOptions.loadingClass)
      img.classList.add(finalOptions.loadedClass)
      
      // Remover do mapa após carregar
      images.value.delete(img)
    }
    
    testImg.onerror = () => {
      img.src = finalOptions.errorImage
      img.classList.remove(finalOptions.loadingClass)
      img.classList.add(finalOptions.errorClass)
      
      // Remover do mapa após erro
      images.value.delete(img)
    }
    
    testImg.src = src
  }

  /**
   * Observa uma imagem para lazy loading
   */
  const observeImage = (img: HTMLImageElement) => {
    if (!observer.value) {
      createObserver()
    }
    
    if (observer.value && img.dataset.src) {
      images.value.set(img, img)
      observer.value.observe(img)
    }
  }

  /**
   * Para de observar uma imagem
   */
  const unobserveImage = (img: HTMLImageElement) => {
    if (observer.value) {
      observer.value.unobserve(img)
      images.value.delete(img)
    }
  }

  /**
   * Para de observar todas as imagens
   */
  const unobserveAll = () => {
    if (observer.value) {
      images.value.forEach((img) => {
        observer.value?.unobserve(img)
      })
      images.value.clear()
    }
  }

  /**
   * Destrói o observer
   */
  const destroy = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    images.value.clear()
  }

  /**
   * Hook para usar em componentes Vue
   */
  const useLazyImage = (src: string, alt: string = '') => {
    const imgRef = ref<HTMLImageElement>()
    const isLoaded = ref(false)
    const hasError = ref(false)
    const isLoading = ref(false)

    onMounted(() => {
      if (imgRef.value) {
        // Configurar imagem para lazy loading
        imgRef.value.dataset.src = src
        imgRef.value.src = finalOptions.placeholder
        imgRef.value.alt = alt
        imgRef.value.loading = 'lazy'
        
        // Observar a imagem
        observeImage(imgRef.value)
        
        // Configurar listeners
        imgRef.value.addEventListener('load', () => {
          isLoaded.value = true
          isLoading.value = false
          hasError.value = false
        })
        
        imgRef.value.addEventListener('error', () => {
          hasError.value = true
          isLoading.value = false
          isLoaded.value = false
        })
        
        isLoading.value = true
      }
    })

    onUnmounted(() => {
      if (imgRef.value) {
        unobserveImage(imgRef.value)
      }
    })

    return {
      imgRef,
      isLoaded,
      hasError,
      isLoading
    }
  }

  /**
   * Diretiva Vue para lazy loading
   */
  const vLazy = {
    mounted(el: HTMLImageElement, binding: any) {
      const src = binding.value
      if (src) {
        el.dataset.src = src
        el.src = finalOptions.placeholder
        el.loading = 'lazy'
        observeImage(el)
      }
    },
    updated(el: HTMLImageElement, binding: any) {
      const newSrc = binding.value
      if (newSrc && el.dataset.src !== newSrc) {
        el.dataset.src = newSrc
        if (!images.value.has(el)) {
          observeImage(el)
        }
      }
    },
    unmounted(el: HTMLImageElement) {
      unobserveImage(el)
    }
  }

  // Cleanup automático
  onUnmounted(() => {
    destroy()
  })

  return {
    observeImage,
    unobserveImage,
    unobserveAll,
    destroy,
    useLazyImage,
    useLazyImageGallery,
    vLazy,
    options: finalOptions
  }
}

/**
 * Hook para lazy loading de múltiplas imagens
 */
export const useLazyImageGallery = (imageUrls: string[]) => {
  const { useLazyImage } = useLazyLoading()
  const images = ref(imageUrls.map((url, index) => ({
    url,
    index,
    ...useLazyImage(url, `Imagem ${index + 1}`)
  })))

  const loadedCount = computed(() => 
    images.value.filter(img => img.isLoaded).length
  )

  const errorCount = computed(() => 
    images.value.filter(img => img.hasError).length
  )

  const loadingCount = computed(() => 
    images.value.filter(img => img.isLoading).length
  )

  const allLoaded = computed(() => 
    loadedCount.value === images.value.length
  )

  const hasErrors = computed(() => 
    errorCount.value > 0
  )

  return {
    images,
    loadedCount,
    errorCount,
    loadingCount,
    allLoaded,
    hasErrors
  }
}
