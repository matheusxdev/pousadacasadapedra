// Composable para gerenciar dados do clima
import { ref, readonly } from 'vue'

export const useWeather = () => {
  const weatherData = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref(false)
  const lastUpdate = ref<Date | null>(null)

  interface WeatherData {
    temp: number
    description: string
    humidity: number
    windSpeed: number
    icon: string
    feelsLike: number
    pressure: number
    visibility: number
  }

  // Função para converter weather_code em ícone
  const getWeatherIconFromCode = (weatherCode: number) => {
    const iconMap: Record<number, string> = {
      0: '01d', // Céu limpo
      1: '02d', // Principalmente limpo
      2: '03d', // Parcialmente nublado
      3: '04d', // Nublado
      45: '50d', // Neblina
      48: '50d', // Neblina com geada
      51: '09d', // Chuva leve
      53: '09d', // Chuva moderada
      55: '09d', // Chuva forte
      56: '13d', // Chuva congelante leve
      57: '13d', // Chuva congelante forte
      61: '10d', // Chuva leve
      63: '10d', // Chuva moderada
      65: '10d', // Chuva forte
      66: '13d', // Chuva congelante leve
      67: '13d', // Chuva congelante forte
      71: '13d', // Neve leve
      73: '13d', // Neve moderada
      75: '13d', // Neve forte
      77: '13d', // Grãos de neve
      80: '09d', // Chuva leve
      81: '09d', // Chuva moderada
      82: '09d', // Chuva forte
      85: '13d', // Neve leve
      86: '13d', // Neve forte
      95: '11d', // Tempestade
      96: '11d', // Tempestade com granizo leve
      99: '11d'  // Tempestade com granizo forte
    }
    
    return iconMap[weatherCode] || '01d'
  }

  // Função para buscar dados do clima
  const fetchWeather = async (force = false) => {
    // Evitar múltiplas requisições simultâneas
    if (loading.value) return

    // Verificar se precisa atualizar (a cada 10 minutos)
    const now = new Date()
    if (!force && lastUpdate.value) {
      const diffMinutes = (now.getTime() - lastUpdate.value.getTime()) / (1000 * 60)
      if (diffMinutes < 10) return
    }

    try {
      loading.value = true
      error.value = false

      // Usar API do Open-Meteo (gratuita e sem chave)
      const response = await $fetch('https://api.open-meteo.com/v1/forecast', {
        query: {
          latitude: -22.7539, // Latitude de Búzios
          longitude: -41.8825, // Longitude de Búzios
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          timezone: 'America/Sao_Paulo',
          forecast_days: 1
        }
      }) as any

      // Mapear weather_code para descrição em português
      const weatherDescriptions: Record<number, string> = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina com geada',
        51: 'Chuva leve',
        53: 'Chuva moderada',
        55: 'Chuva forte',
        56: 'Chuva congelante leve',
        57: 'Chuva congelante forte',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        77: 'Grãos de neve',
        80: 'Chuva leve',
        81: 'Chuva moderada',
        82: 'Chuva forte',
        85: 'Neve leve',
        86: 'Neve forte',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
      }

      weatherData.value = {
        temp: response.current.temperature_2m,
        description: weatherDescriptions[response.current.weather_code] || 'Condições variáveis',
        humidity: response.current.relative_humidity_2m,
        windSpeed: response.current.wind_speed_10m,
        icon: getWeatherIconFromCode(response.current.weather_code),
        feelsLike: response.current.temperature_2m, // Open-Meteo não fornece "feels like"
        pressure: 1013, // Valor padrão
        visibility: 10 // Valor padrão
      }

      lastUpdate.value = now

    } catch (err) {
      console.error('Erro ao buscar dados do clima:', err)
      error.value = true

      // Dados mockados como fallback (apenas para desenvolvimento)
      if (!weatherData.value) {
        weatherData.value = {
          temp: 28,
          description: 'Ensolarado',
          humidity: 65,
          windSpeed: 12,
          icon: '01d',
          feelsLike: 30,
          pressure: 1013,
          visibility: 10
        }
      }
    } finally {
      loading.value = false
    }
  }

  // Função para obter ícone do clima
  const getWeatherIcon = (iconCode: string) => {
    if (!iconCode) return '/images/weather/default.png'
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  // Função para determinar se é dia ou noite baseado no ícone
  const isDayTime = (iconCode: string) => {
    return iconCode.endsWith('d')
  }

  // Função para obter cor baseada na temperatura
  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return '#3b82f6' // Azul para frio
    if (temp < 25) return '#10b981' // Verde para temperado
    if (temp < 30) return '#f59e0b' // Amarelo para quente
    return '#ef4444' // Vermelho para muito quente
  }

  // Função para formatar descrição do clima
  const formatWeatherDescription = (description: string) => {
    const descriptions: Record<string, string> = {
      'clear sky': 'Céu limpo',
      'few clouds': 'Poucas nuvens',
      'scattered clouds': 'Nuvens dispersas',
      'broken clouds': 'Nuvens quebradas',
      'shower rain': 'Chuva de banho',
      'rain': 'Chuva',
      'thunderstorm': 'Tempestade',
      'snow': 'Neve',
      'mist': 'Neblina',
      'fog': 'Nevoeiro',
      'haze': 'Neblina seca',
      'dust': 'Poeira',
      'sand': 'Areia',
      'ash': 'Cinza',
      'squall': 'Rajada',
      'tornado': 'Tornado'
    }

    return descriptions[description.toLowerCase()] || description
  }

  return {
    weatherData: readonly(weatherData),
    loading: readonly(loading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),
    fetchWeather,
    getWeatherIcon,
    getWeatherIconFromCode,
    isDayTime,
    getTemperatureColor,
    formatWeatherDescription
  }
}
