# Configuração da API do Clima

## Como obter sua chave da API OpenWeatherMap:

1. **Acesse**: https://openweathermap.org/api
2. **Crie uma conta gratuita**
3. **Vá para "API Keys" no seu perfil**
4. **Copie sua chave da API**

## Configuração no projeto:

### Opção 1: Configuração direta (para teste rápido)
Abra o arquivo `src/composables/useWeather.ts` e substitua:
```typescript
appid: 'YOUR_API_KEY'
```
Por:
```typescript
appid: 'sua_chave_aqui'
```

### Opção 2: Variáveis de ambiente (recomendado para produção)

1. **Crie um arquivo `.env.local` na raiz do projeto:**
```env
OPENWEATHER_API_KEY=sua_chave_aqui
```

2. **Atualize o arquivo `nuxt.config.ts`:**
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      openweatherApiKey: process.env.OPENWEATHER_API_KEY
    }
  }
})
```

3. **Atualize o composable `useWeather.ts`:**
```typescript
const config = useRuntimeConfig()
const response = await $fetch('https://api.openweathermap.org/data/2.5/weather', {
  query: {
    q: 'Buzios,BR',
    appid: config.public.openweatherApiKey,
    units: 'metric',
    lang: 'pt_br'
  }
})
```

## Status atual:
✅ **Widget funcionando com dados mockados**
✅ **Imagens dinâmicas funcionando**
✅ **Fallback implementado**
⚠️ **Aguardando configuração da API key**

## Dados mockados atuais:
- **Temperatura**: 28°C
- **Clima**: Ensolarado
- **Umidade**: 65%
- **Vento**: 12 km/h

## Limites da API gratuita:
- 1.000 chamadas por dia
- 60 chamadas por minuto
- Dados atualizados a cada 10 minutos
