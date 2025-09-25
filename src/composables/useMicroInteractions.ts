import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

export interface MicroInteractionOptions {
  scale?: number
  duration?: number
  easing?: string
  hapticFeedback?: boolean
  soundFeedback?: boolean
  ripple?: boolean
  rippleColor?: string
  rippleDuration?: number
}

export const useMicroInteractions = (options: MicroInteractionOptions = {}) => {
  const defaultOptions: Required<MicroInteractionOptions> = {
    scale: 0.95,
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hapticFeedback: true,
    soundFeedback: false,
    ripple: true,
    rippleColor: 'rgba(255, 255, 255, 0.3)',
    rippleDuration: 600
  }

  const finalOptions = { ...defaultOptions, ...options }
  const activeInteractions = ref<Set<Element>>(new Set())

  /**
   * Verifica se o dispositivo suporta haptic feedback
   */
  const supportsHaptic = (): boolean => {
    return typeof window !== 'undefined' && 
           'navigator' in window && 
           'vibrate' in navigator
  }

  /**
   * Executa haptic feedback
   */
  const triggerHaptic = (pattern: number | number[] = 10): void => {
    if (finalOptions.hapticFeedback && supportsHaptic()) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.warn('Haptic feedback não suportado:', error)
      }
    }
  }

  /**
   * Executa som de feedback
   */
  const triggerSound = (frequency: number = 800, duration: number = 100): void => {
    if (finalOptions.soundFeedback && typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
      } catch (error) {
        console.warn('Som de feedback não suportado:', error)
      }
    }
  }

  /**
   * Cria efeito ripple
   */
  const createRipple = (element: HTMLElement, event: MouseEvent | TouchEvent): void => {
    if (!finalOptions.ripple) return

    const rect = element.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
    
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${finalOptions.rippleColor};
      transform: scale(0);
      animation: ripple ${finalOptions.rippleDuration}ms linear;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1000;
    `
    
    // Adicionar CSS da animação se não existir
    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style')
      style.id = 'ripple-animation'
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }
    
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, finalOptions.rippleDuration)
  }

  /**
   * Aplica efeito de pressão
   */
  const applyPressEffect = (element: HTMLElement): void => {
    element.style.transition = `transform ${finalOptions.duration}ms ${finalOptions.easing}`
    element.style.transform = `scale(${finalOptions.scale})`
    
    activeInteractions.value.add(element)
  }

  /**
   * Remove efeito de pressão
   */
  const removePressEffect = (element: HTMLElement): void => {
    element.style.transform = 'scale(1)'
    
    setTimeout(() => {
      element.style.transition = ''
      activeInteractions.value.delete(element)
    }, finalOptions.duration)
  }

  /**
   * Hook para botões com micro-interações
   */
  const useInteractiveButton = (elementRef: Ref<HTMLElement | null>) => {
    const isPressed = ref(false)
    const isHovered = ref(false)
    const isFocused = ref(false)

    const handleMouseDown = (event: MouseEvent) => {
      if (!elementRef.value) return
      
      isPressed.value = true
      applyPressEffect(elementRef.value)
      createRipple(elementRef.value, event)
      triggerHaptic([10, 5, 10])
      triggerSound(800, 100)
    }

    const handleMouseUp = () => {
      if (!elementRef.value) return
      
      isPressed.value = false
      removePressEffect(elementRef.value)
    }

    const handleMouseLeave = () => {
      if (!elementRef.value) return
      
      isPressed.value = false
      removePressEffect(elementRef.value)
    }

    const handleMouseEnter = () => {
      isHovered.value = true
      triggerHaptic(5)
    }

    const handleMouseLeaveHover = () => {
      isHovered.value = false
    }

    const handleFocus = () => {
      isFocused.value = true
      triggerHaptic(5)
    }

    const handleBlur = () => {
      isFocused.value = false
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (!elementRef.value) return
      
      isPressed.value = true
      applyPressEffect(elementRef.value)
      createRipple(elementRef.value, event)
      triggerHaptic([15, 5, 15])
    }

    const handleTouchEnd = () => {
      if (!elementRef.value) return
      
      isPressed.value = false
      removePressEffect(elementRef.value)
    }

    onMounted(() => {
      if (elementRef.value) {
        elementRef.value.addEventListener('mousedown', handleMouseDown)
        elementRef.value.addEventListener('mouseup', handleMouseUp)
        elementRef.value.addEventListener('mouseleave', handleMouseLeave)
        elementRef.value.addEventListener('mouseenter', handleMouseEnter)
        elementRef.value.addEventListener('mouseleave', handleMouseLeaveHover)
        elementRef.value.addEventListener('focus', handleFocus)
        elementRef.value.addEventListener('blur', handleBlur)
        elementRef.value.addEventListener('touchstart', handleTouchStart)
        elementRef.value.addEventListener('touchend', handleTouchEnd)
      }
    })

    onUnmounted(() => {
      if (elementRef.value) {
        elementRef.value.removeEventListener('mousedown', handleMouseDown)
        elementRef.value.removeEventListener('mouseup', handleMouseUp)
        elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
        elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
        elementRef.value.removeEventListener('mouseleave', handleMouseLeaveHover)
        elementRef.value.removeEventListener('focus', handleFocus)
        elementRef.value.removeEventListener('blur', handleBlur)
        elementRef.value.removeEventListener('touchstart', handleTouchStart)
        elementRef.value.removeEventListener('touchend', handleTouchEnd)
      }
    })

    return {
      isPressed,
      isHovered,
      isFocused
    }
  }

  /**
   * Diretiva Vue para micro-interações
   */
  const vMicroInteraction = {
    mounted(el: HTMLElement, binding: any) {
      const options = binding.value || {}
      const interactionOptions = { ...finalOptions, ...options }
      
      el.style.cursor = 'pointer'
      el.style.userSelect = 'none'
      
      const handleMouseDown = (event: MouseEvent) => {
        applyPressEffect(el)
        createRipple(el, event)
        triggerHaptic([10, 5, 10])
      }

      const handleMouseUp = () => {
        removePressEffect(el)
      }

      const handleMouseLeave = () => {
        removePressEffect(el)
      }

      const handleTouchStart = (event: TouchEvent) => {
        applyPressEffect(el)
        createRipple(el, event)
        triggerHaptic([15, 5, 15])
      }

      const handleTouchEnd = () => {
        removePressEffect(el)
      }

      el.addEventListener('mousedown', handleMouseDown)
      el.addEventListener('mouseup', handleMouseUp)
      el.addEventListener('mouseleave', handleMouseLeave)
      el.addEventListener('touchstart', handleTouchStart)
      el.addEventListener('touchend', handleTouchEnd)
      
      // Armazenar handlers para cleanup
      ;(el as any).__microInteractionHandlers = {
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleTouchStart,
        handleTouchEnd
      }
    },
    
    unmounted(el: HTMLElement) {
      const handlers = (el as any).__microInteractionHandlers
      if (handlers) {
        el.removeEventListener('mousedown', handlers.handleMouseDown)
        el.removeEventListener('mouseup', handlers.handleMouseUp)
        el.removeEventListener('mouseleave', handlers.handleMouseLeave)
        el.removeEventListener('touchstart', handlers.handleTouchStart)
        el.removeEventListener('touchend', handlers.handleTouchEnd)
      }
    }
  }

  /**
   * Efeito de shake para erros
   */
  const shakeElement = (element: HTMLElement, intensity: number = 10): void => {
    const originalTransform = element.style.transform
    const originalTransition = element.style.transition
    
    element.style.transition = 'transform 0.1s ease-in-out'
    
    let shakeCount = 0
    const maxShakes = 6
    
    const shake = () => {
      if (shakeCount < maxShakes) {
        const direction = shakeCount % 2 === 0 ? intensity : -intensity
        element.style.transform = `translateX(${direction}px)`
        shakeCount++
        setTimeout(shake, 100)
      } else {
        element.style.transform = originalTransform
        element.style.transition = originalTransition
      }
    }
    
    shake()
    triggerHaptic([50, 50, 50])
  }

  /**
   * Efeito de pulse para sucesso
   */
  const pulseElement = (element: HTMLElement, scale: number = 1.1): void => {
    const originalTransform = element.style.transform
    const originalTransition = element.style.transition
    
    element.style.transition = 'transform 0.3s ease-in-out'
    element.style.transform = `scale(${scale})`
    
    setTimeout(() => {
      element.style.transform = originalTransform
      element.style.transition = originalTransition
    }, 300)
    
    triggerHaptic([20, 10, 20])
  }

  /**
   * Efeito de bounce para elementos importantes
   */
  const bounceElement = (element: HTMLElement): void => {
    const originalTransform = element.style.transform
    const originalTransition = element.style.transition
    
    element.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    element.style.transform = 'scale(1.2)'
    
    setTimeout(() => {
      element.style.transform = originalTransform
      element.style.transition = originalTransition
    }, 600)
    
    triggerHaptic([30, 20, 30])
  }

  return {
    useInteractiveButton,
    vMicroInteraction,
    shakeElement,
    pulseElement,
    bounceElement,
    triggerHaptic,
    triggerSound,
    supportsHaptic,
    options: finalOptions
  }
}
