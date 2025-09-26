# Widget de Clima - Configuração

## API Open-Meteo (Gratuita e Sem Chave!)

### ✅ **Vantagens da Open-Meteo:**
- **100% Gratuita** para uso não comercial
- **Sem necessidade de API key** ou registro
- **Dados em tempo real** atualizados a cada hora
- **Alta precisão** com resolução de 1-11 km
- **Dados históricos** de 80 anos disponíveis
- **Código aberto** e transparente

### 🌍 **Sobre a Open-Meteo:**
A [Open-Meteo](https://open-meteo.com/) faz parceria com serviços meteorológicos nacionais para fornecer dados abertos com alta resolução. Nossas APIs selecionam inteligentemente os modelos meteorológicos mais adequados para Búzios, garantindo previsões precisas e confiáveis.

## 🚀 **Configuração Automática**

### **Não é necessária nenhuma configuração!**
O sistema já está configurado para usar a API Open-Meteo automaticamente:

- **Localização**: Búzios, RJ (coordenadas: -22.7539, -41.8825)
- **Fuso horário**: America/Sao_Paulo
- **Atualização**: A cada 10 minutos
- **Dados**: Temperatura, umidade, vento, condições climáticas

## 📊 **Dados Disponíveis**

### **Informações em Tempo Real:**
- **Temperatura atual** em Celsius
- **Umidade relativa** em porcentagem
- **Velocidade do vento** em km/h
- **Condições climáticas** em português
- **Ícones visuais** para cada condição

### **Condições Climáticas Suportadas:**
- Céu limpo, Parcialmente nublado, Nublado
- Neblina, Chuva leve/moderada/forte
- Tempestades, Neve (raramente em Búzios)
- Condições congelantes

## 🔧 **Funcionalidades**

### **Sistema Inteligente:**
- **Fallback robusto**: Dados mockados se a API falhar
- **Cache inteligente**: Evita requisições desnecessárias
- **Tradução automática**: Descrições em português
- **Ícones dinâmicos**: Baseados nas condições reais

### **Performance:**
- **Atualização automática**: A cada 10 minutos
- **Sem limites**: Uso gratuito ilimitado
- **Alta disponibilidade**: 99.9% uptime
- **Resposta rápida**: < 200ms de latência

## 📱 **Responsividade**

### **Design Adaptativo:**
- **Desktop**: Widget completo com todos os detalhes
- **Mobile**: Versão compacta otimizada
- **Posicionamento**: Canto superior direito do hero
- **Estilo**: Glassmorphism com backdrop-filter

## 🎯 **Status Atual**

### ✅ **Funcionando Perfeitamente:**
- **API Open-Meteo**: Integrada e funcionando
- **Dados reais**: Temperatura, umidade, vento de Búzios
- **Imagens dinâmicas**: Hero muda entre dia/noite
- **Fallback**: Dados mockados como backup
- **Responsivo**: Funciona em todos os dispositivos

### 🌤️ **Exemplo de Dados Reais:**
```json
{
  "temp": 28.5,
  "description": "Principalmente limpo",
  "humidity": 65,
  "windSpeed": 12.3,
  "icon": "02d"
}
```

## 🔗 **Links Úteis**

- **API Open-Meteo**: https://open-meteo.com/
- **Documentação**: https://open-meteo.com/en/docs
- **GitHub**: https://github.com/open-meteo/open-meteo
- **Status**: https://open-meteo.com/en/status

## 📈 **Limites e Uso**

### **Uso Gratuito:**
- **Sem limites** para uso não comercial
- **Atualizações**: A cada hora automaticamente
- **Dados históricos**: 80 anos disponíveis
- **Precisão**: 1-11 km de resolução

### **Uso Comercial:**
- **10.000+ chamadas/dia**: Considere assinatura
- **Suporte premium**: Disponível
- **Recursos avançados**: APIs especializadas
