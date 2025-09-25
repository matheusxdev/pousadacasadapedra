export function useCurrentLocale() {
  const getCurrentLocale = () => {
    // Tentar obter do localStorage primeiro
    if (process.client) {
      const saved = localStorage.getItem('preferred-language')
      if (saved) return saved
    }

    // Tentar obter da URL
    if (process.client) {
      const path = window.location.pathname
      if (path.startsWith('/en')) return 'en'
      if (path.startsWith('/es')) return 'es'
    }

    // Fallback para português
    return 'pt'
  }

  const setCurrentLocale = (locale: string) => {
    if (process.client) {
      localStorage.setItem('preferred-language', locale)
    }
  }

  return {
    getCurrentLocale,
    setCurrentLocale
  }
}
