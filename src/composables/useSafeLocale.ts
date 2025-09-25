export function useSafeLocale() {
  const getSafeLocale = () => {
    // No servidor, sempre retornar 'pt' para evitar hidratação
    if (process.server) {
      return 'pt'
    }

    // No cliente, detectar o idioma atual
    if (process.client) {
      // Tentar obter do localStorage primeiro
      const saved = localStorage.getItem('preferred-language')
      if (saved) return saved

      // Tentar obter da URL
      const path = window.location.pathname
      if (path.startsWith('/en')) return 'en'
      if (path.startsWith('/es')) return 'es'
    }

    // Fallback para português
    return 'pt'
  }

  const setSafeLocale = (locale: string) => {
    if (process.client) {
      localStorage.setItem('preferred-language', locale)
    }
  }

  return {
    getSafeLocale,
    setSafeLocale
  }
}
