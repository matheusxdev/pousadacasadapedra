# Configuração do Nuxt 4.1 - Casa da Pedra

## Visão Geral

Este documento detalha a configuração completa do Nuxt 4.1 para o projeto Casa da Pedra, incluindo todas as configurações, módulos e otimizações implementadas.

## Arquivo de Configuração Principal

### nuxt.config.ts

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // CSS global
  css: ['~/assets/styles/styles.css'],
  
  // Módulos
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon'
  ],
  
  // Configuração de runtime
  runtimeConfig: {
    // Variáveis privadas (apenas no servidor)
    starhubSecret: '',
    
    // Variáveis públicas (cliente + servidor)
    public: {
      starhubBase: 'https://api.starhubsolutions.com/v1'
    }
  },
  
  // Configuração do i18n
  i18n: {
    locales: [
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'pt',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts'
  },
  
  // Auto-imports
  imports: {
    autoImport: true
  },
  
  // Configuração de build
  nitro: {
    experimental: {
      wasm: true
    }
  },
  
  // Configuração de roteamento
  routeRules: {
    '/api/**': { 
      proxy: 'https://api.starhubsolutions.com/v1/**',
      headers: {
        'x-starhub-token': 'e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca'
      }
    }
  },
  
  // Configuração de TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // Configuração de compatibilidade
  compatibilityDate: '2024-01-01',
  
  // Configuração de desenvolvimento
  devServer: {
    port: 3000
  },
  
  // Configuração do Nuxt UI
  ui: {
    global: true,
    icons: ['heroicons']
  },
  
  // Configuração de SSR
  ssr: true,
  
  // Configuração de roteamento
  router: {
    options: {
      strict: true
    }
  }
})
```

## Configuração de Dependências

### package.json

```json
{
  "name": "casadapedra",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "migrate": "npx codemod@latest nuxt/4/migration-recipe"
  },
  "dependencies": {
    "@headlessui/vue": "^2.2.0",
    "@heroicons/vue": "^2.2.0",
    "@nuxtjs/i18n": "^8.5.4",
    "@nuxt/ui": "^4.0.0-alpha.1",
    "@nuxt/image": "^1.4.0",
    "@nuxt/icon": "^1.4.0",
    "@pinia/nuxt": "^0.5.1",
    "@vueuse/core": "^11.0.0",
    "date-fns": "^4.1.0",
    "flag-icons": "^7.5.0",
    "nuxt": "^4.1.0",
    "pinia": "^2.2.6",
    "simple-icons": "^15.15.0"
  },
  "devDependencies": {
    "@iconify-json/simple-icons": "^1.2.52",
    "@nuxt/devtools": "latest",
    "@types/node": "^22.10.2",
    "typescript": "~5.8.3"
  }
}
```

## Configuração de i18n

### i18n.config.ts

```typescript
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'pt',
  globalInjection: true,
  warnHtmlMessage: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true
}))
```

## Configuração de Plugins

### plugins/pinia.client.ts

```typescript
export default defineNuxtPlugin(({ $pinia }) => {
  // Plugin específico para o cliente
  if (process.client) {
    // Configurações específicas do cliente aqui
    console.log('Pinia client plugin initialized')
  }
})
```

### plugins/i18n.client.ts

```typescript
export default defineNuxtPlugin(({ $i18n }) => {
  // Plugin específico para o cliente
  if (process.client) {
    // Configurações específicas do cliente aqui
    console.log('i18n client plugin initialized')
  }
})
```

## Configuração de Server API Routes

### server/api/starhub/[...].ts

```typescript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.starhubBase
  
  // Get the path after /api/starhub/
  const path = getRouterParam(event, 'path') || ''
  const fullPath = `/${path}`
  
  // Get query parameters
  const query = getQuery(event)
  
  // Get request method
  const method = getMethod(event)
  
  // Get request body for POST/PUT/PATCH
  let body = null
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event)
  }
  
  try {
    const response = await $fetch(`${baseURL}${fullPath}`, {
      method,
      query,
      body,
      headers: {
        'Content-Type': 'application/json',
        'x-starhub-token': config.starhubSecret || 'e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca'
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Error',
      data: error
    })
  }
})
```

## Configuração de TypeScript

### tsconfig.json

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Configuração de Variáveis de Ambiente

### .env

```bash
# Configurações do servidor
STARHUB_SECRET=your_secret_token_here
STARHUB_BASE=https://api.starhubsolutions.com/v1

# Configurações de desenvolvimento
NUXT_DEVTOOLS=true
NUXT_PORT=3000
```

## Configuração de Build

### Configurações de Produção

```typescript
// Configurações específicas para produção
export default defineNuxtConfig({
  // ... outras configurações
  
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  
  $development: {
    // Configurações específicas para desenvolvimento
  }
})
```

## Configuração de Performance

### Otimizações Implementadas

1. **Tree Shaking**: Otimização automática de código não utilizado
2. **Code Splitting**: Divisão automática de código por rota
3. **Lazy Loading**: Carregamento sob demanda de componentes
4. **Image Optimization**: Otimização automática de imagens
5. **CSS Purging**: Remoção de CSS não utilizado

### Configurações de Cache

```typescript
// Configuração de cache para APIs
const cacheConfig = {
  maxAge: 60 * 60 * 24, // 24 horas
  staleMaxAge: 60 * 60 * 24 * 7, // 7 dias
  headers: {
    'Cache-Control': 'public, max-age=86400'
  }
}
```

## Configuração de Segurança

### Headers de Segurança

```typescript
// Configuração de headers de segurança
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    }
  }
})
```

## Configuração de Monitoramento

### Logs e Métricas

```typescript
// Configuração de logging
export default defineNuxtConfig({
  nitro: {
    logLevel: 'info',
    experimental: {
      wasm: true
    }
  }
})
```

## Verificação de Configuração

### Checklist de Verificação

- [x] **Nuxt 4.1**: Versão mais recente instalada
- [x] **TypeScript**: Configuração estrita habilitada
- [x] **Módulos**: Todos os módulos necessários instalados
- [x] **i18n**: Configuração de internacionalização
- [x] **Pinia**: Configuração de gerenciamento de estado
- [x] **Server API**: Proxies configurados
- [x] **Performance**: Otimizações implementadas
- [x] **Segurança**: Headers de segurança configurados
- [x] **Build**: Configuração de build otimizada
- [x] **Development**: Ambiente de desenvolvimento configurado

### Comandos de Verificação

```bash
# Verificar configuração
npm run dev

# Verificar build
npm run build

# Verificar tipos
npx nuxi typecheck

# Verificar linting
npx eslint .

# Verificar testes
npm run test
```

## Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verificar configuração de proxies
2. **Erro de TypeScript**: Verificar configuração de tipos
3. **Erro de Build**: Verificar dependências e configurações
4. **Erro de Runtime**: Verificar configuração de runtime

### Soluções

1. **CORS**: Usar proxies do servidor em vez de chamadas diretas
2. **TypeScript**: Verificar configuração de tipos e imports
3. **Build**: Limpar cache e reinstalar dependências
4. **Runtime**: Verificar configuração de runtime e variáveis de ambiente

## Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **CI/CD**: Configurar pipeline de integração contínua
3. **Monitoramento**: Implementar monitoramento de performance
4. **Documentação**: Atualizar documentação de API
5. **Deploy**: Configurar deploy automatizado
