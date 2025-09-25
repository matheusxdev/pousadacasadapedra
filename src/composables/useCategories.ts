import { ref, computed, watch, readonly } from 'vue'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  parentId?: string | null
  productCount?: number
  children?: Category[]
}

export interface CategoriesResponse {
  data: Category[]
  meta: {
    total: number
    source: string
  }
}

export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Carregar categorias
  const loadCategories = async () => {
    if (categories.value.length > 0) return // Cache

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<CategoriesResponse>('/api/categories')
      categories.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar categorias'
      console.error('Error loading categories:', err)
    } finally {
      loading.value = false
    }
  }

  // Categorias principais (sem pai)
  const mainCategories = computed(() => {
    return categories.value.filter(cat => !cat.parentId)
  })

  // Categorias com subcategorias
  const categoriesWithChildren = computed(() => {
    return mainCategories.value.map(category => ({
      ...category,
      children: categories.value.filter(child => child.parentId === category.id)
    }))
  })

  // Buscar categoria por slug
  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.value.find(cat => cat.slug === slug)
  }

  // Buscar categoria por ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.value.find(cat => cat.id === id)
  }

  // Obter breadcrumbs para uma categoria
  const getCategoryBreadcrumbs = (categoryId: string): Category[] => {
    const breadcrumbs: Category[] = []
    let currentCategory = getCategoryById(categoryId)

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory)
      currentCategory = currentCategory.parentId ? getCategoryById(currentCategory.parentId) : undefined
    }

    return breadcrumbs
  }

  // Atualizar contador de produtos para uma categoria
  const updateProductCount = async (categoryId: string) => {
    try {
      // Buscar produtos da categoria
      const response = await $fetch('/api/search', {
        query: {
          category: categoryId,
          limit: 1
        }
      })

      const category = getCategoryById(categoryId)
      if (category) {
        category.productCount = (response as any).meta.total
      }
    } catch (err) {
      console.error('Error updating product count:', err)
    }
  }

  // Atualizar contadores de todas as categorias
  const updateAllProductCounts = async () => {
    const promises = categories.value.map(cat => updateProductCount(cat.id))
    await Promise.allSettled(promises)
  }

  // Buscar categorias com filtro
  const searchCategories = (query: string): Category[] => {
    if (!query) return categories.value

    const lowercaseQuery = query.toLowerCase()
    return categories.value.filter(cat =>
      cat.name.toLowerCase().includes(lowercaseQuery) ||
      cat.description?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Obter ícone para categoria
  const getCategoryIcon = (category: Category): string => {
    const iconMap: Record<string, string> = {
      adventure: 'heroicons:bolt',
      cultural: 'heroicons:building-library',
      nature: 'heroicons:leaf',
      beach: 'heroicons:sun',
      gastronomy: 'heroicons:cake',
      accommodation: 'heroicons:home',
      hotel: 'heroicons:building-office-2',
      tour: 'heroicons:map',
      default: 'heroicons:tag'
    }

    return iconMap[category.icon || category.id] || iconMap.default
  }

  // Obter cor para categoria
  const getCategoryColor = (category: Category): string => {
    return category.color || '#fc6807'
  }

  return {
    // State
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    mainCategories,
    categoriesWithChildren,

    // Methods
    loadCategories,
    getCategoryBySlug,
    getCategoryById,
    getCategoryBreadcrumbs,
    updateProductCount,
    updateAllProductCounts,
    searchCategories,
    getCategoryIcon,
    getCategoryColor
  }
}
