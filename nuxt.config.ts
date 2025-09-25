import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Diretório fonte
  srcDir: 'src/',
  
  // Configuração do app
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' },
        { rel: 'canonical', href: 'https://casadapedra.com.br' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }
      ],
      meta: [
        { name: 'theme-color', content: '#FF6700' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Casa da Pedra' },
        { property: 'og:locale', content: 'pt_BR' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@casadapedra' },
        { property: 'twitter:creator', content: '@casadapedra' }
      ],
      script: [
        { src: 'https://code.iconify.design/3/3.1.1/iconify.min.js', defer: true }
      ]
    }
  },
  
  // CSS global
  css: ['~/assets/styles/styles.css'],
  
  // Módulos
  modules: [
    ['@pinia/nuxt', {
      disableVuex: true
    }],
    ['@nuxtjs/i18n', {
      locales: [
        { code: 'pt', name: 'Português', file: 'pt.json' },
        { code: 'en', name: 'English', file: 'en.json' },
        { code: 'es', name: 'Español', file: 'es.json' }
      ],
      lazy: true,
      langDir: '../locales/',
      defaultLocale: 'pt',
      strategy: 'prefix_except_default',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        redirectOn: 'root',
        alwaysRedirect: false,
        fallbackLocale: 'pt'
      }
    }],
    '@nuxt/ui',
    '@nuxt/image',
    ['@nuxt/icon', {
      collections: ['heroicons', 'circle-flags', 'mdi', 'simple-icons']
    }]
  ],
  
  // Aliases
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  },
  
  // Configuração de rotas
  nitro: {
    routeRules: {
      '/traslados': { redirect: '/transfers' },
      '/traslados/**': { redirect: '/transfers/**' }
    }
  },
  
  // Configuração de runtime
  runtimeConfig: {
    // Variáveis privadas (apenas no servidor)
    starhubSecret: process.env.STARHUB_SECRET || '',
    
    // Variáveis públicas (cliente + servidor)
    public: {
      siteUrl: 'https://casadapedra.com.br',
      starhubBaseUrl: process.env.STARHUB_BASE_URL || 'https://api.starhubsolutions.com/v1',
      starhubToken: process.env.VITE_STARHUB_TOKEN || 'e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca',
      
      // Analytics Configuration
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX',
      gtmAuth: process.env.NUXT_PUBLIC_GTM_AUTH || '',
      gtmPreview: process.env.NUXT_PUBLIC_GTM_PREVIEW || '',
      facebookPixelId: process.env.NUXT_PUBLIC_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID',
      facebookAppId: process.env.NUXT_PUBLIC_FACEBOOK_APP_ID || 'YOUR_APP_ID',
      ga4MeasurementId: process.env.NUXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX'
    }
  },
  
  // Configuração de desenvolvimento
  devServer: {
    port: 3000
  },
  
  // Configuração de TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // Configuração de compatibilidade
  compatibilityDate: '2025-09-18',
  
  // Configuração de desenvolvimento
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      __PINIA_LOG__: false
    }
  }
})