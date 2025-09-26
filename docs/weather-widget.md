# Widget de Clima - Configuração

## Como configurar a API do OpenWeatherMap

### 1. Obter chave da API
1. Acesse [OpenWeatherMap](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Vá para "API Keys" no seu perfil
4. Copie sua chave da API

### 2. Configurar no projeto
1. Abra o arquivo `src/composables/useWeather.ts`
2. Substitua `'YOUR_API_KEY'` pela sua chave real
3. Salve o arquivo

### 3. Variáveis de ambiente (Recomendado)
Para maior segurança, use variáveis de ambiente:

1. Crie um arquivo `.env.local` na raiz do projeto:
```env
OPENWEATHER_API_KEY=sua_chave_aqui
```

2. Atualize o arquivo `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      openweatherApiKey: process.env.OPENWEATHER_API_KEY
    }
  }
})
```

3. Atualize o composable `useWeather.ts`:
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

## Funcionalidades

### Imagens Dinâmicas
- **Dia (6h-18h)**: `hero_light.PNG`
- **Noite (18h-6h)**: `hero_night.JPG`

### Widget de Clima
- Temperatura atual em Búzios
- Descrição do clima em português
- Umidade e velocidade do vento
- Ícones do OpenWeatherMap
- Atualização automática a cada 10 minutos
- Dados mockados como fallback

## Limites da API Gratuita
- 1.000 chamadas por dia
- 60 chamadas por minuto
- Dados atualizados a cada 10 minutos (dentro do limite)

## Fallback
Se a API falhar, o widget mostra dados mockados:
- Temperatura: 28°C
- Clima: Ensolarado
- Umidade: 65%
- Vento: 12 km/h
