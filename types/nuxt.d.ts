declare global {
  // Nuxt composables
  const useHead: typeof import('#app')['useHead']
  const useRoute: typeof import('#app')['useRoute']
  const useRouter: typeof import('#app')['useRouter']
  const navigateTo: typeof import('#app')['navigateTo']
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig']
  const $fetch: typeof import('#app')['$fetch']
  
  // Custom composables
  const useStarhubApi: typeof import('~/composables/useStarhubApi')['useStarhubApi']
  const useFeatured: typeof import('~/composables/useFeatured')['useFeatured']
  const useAvailability: typeof import('~/composables/useAvailability')['useAvailability']
  const usePricing: typeof import('~/composables/usePricing')['usePricing']
}

// Export types for use in components
export * from './api'
