<template>
  <a 
    :href="whatsappUrl" 
    target="_blank" 
    rel="noopener noreferrer"
    class="whatsapp-float"
    aria-label="Conversar no WhatsApp"
  >
    <Icon name="logos:whatsapp-icon" class="whatsapp-float__icon" />
    <span class="whatsapp-float__tooltip">{{ $t('whatsapp.tooltip') }}</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Número do WhatsApp real
const phoneNumber = '5522997892414' // Formato: código do país + DDD + número

// Mensagem pré-escrita baseada no idioma
const getMessage = () => {
  const messages: Record<string, string> = {
    pt: 'Olá! Vim do site do Grupo Caminué e gostaria de saber mais sobre as acomodações.',
    en: 'Hello! I came from the Grupo Caminué website and would like to know more about the accommodations.',
    es: '¡Hola! Vine del sitio web de Grupo Caminué y me gustaría saber más sobre los alojamientos.'
  }
  
  // Usar o locale atual do contexto
  const currentLocale = useRoute().params.locale as string || 'pt'
  return encodeURIComponent(messages[currentLocale] || messages.pt)
}

// URL do WhatsApp
const whatsappUrl = computed(() => {
  const message = getMessage()
  return `https://wa.me/${phoneNumber}?text=${message}`
})
</script>

<style scoped>
.whatsapp-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  text-decoration: none;
  overflow: hidden;
}

.whatsapp-float:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);
  background: #20BA5A;
}

.whatsapp-float__icon {
  width: 32px;
  height: 32px;
  color: white;
  transition: transform 0.3s ease;
}

.whatsapp-float:hover .whatsapp-float__icon {
  transform: scale(1.1);
}

.whatsapp-float__tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.whatsapp-float__tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

.whatsapp-float:hover .whatsapp-float__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-5px);
}

/* Animação de pulso */
.whatsapp-float::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: #25D366;
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .whatsapp-float {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
  }
  
  .whatsapp-float__icon {
    width: 28px;
    height: 28px;
  }
  
  .whatsapp-float__tooltip {
    right: 65px;
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .whatsapp-float {
    bottom: 1rem;
    right: 1rem;
    width: 52px;
    height: 52px;
  }
  
  .whatsapp-float__icon {
    width: 26px;
    height: 26px;
  }
  
  .whatsapp-float__tooltip {
    right: 60px;
    font-size: 0.75rem;
    padding: 0.5rem 0.7rem;
  }
}

/* Animação de entrada */
.whatsapp-float {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
