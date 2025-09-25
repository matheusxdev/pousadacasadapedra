<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    :aria-label="ariaLabel"
    :aria-pressed="isPressed"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <span class="interactive-button__content">
      <Icon v-if="icon" :name="icon" class="interactive-button__icon" />
      <span v-if="$slots.default" class="interactive-button__text">
        <slot />
      </span>
    </span>
    
    <!-- Indicador de loading -->
    <div v-if="loading" class="interactive-button__loading">
      <div class="interactive-button__spinner"></div>
    </div>
    
    <!-- Badge de notificação -->
    <span v-if="badge" class="interactive-button__badge">
      {{ badge }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMicroInteractions } from '@/composables/useMicroInteractions'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  badge?: string | number
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  hapticFeedback?: boolean
  soundFeedback?: boolean
  ripple?: boolean
  microInteraction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  hapticFeedback: true,
  soundFeedback: false,
  ripple: true,
  microInteraction: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)

// Micro-interações
const { useInteractiveButton, shakeElement, pulseElement } = useMicroInteractions({
  hapticFeedback: props.hapticFeedback,
  soundFeedback: props.soundFeedback,
  ripple: props.ripple
})

const { isPressed, isHovered, isFocused } = useInteractiveButton(buttonRef)

// Classes do botão
const buttonClasses = computed(() => [
  'interactive-button',
  `interactive-button--${props.variant}`,
  `interactive-button--${props.size}`,
  {
    'interactive-button--disabled': props.disabled,
    'interactive-button--loading': props.loading,
    'interactive-button--pressed': isPressed.value,
    'interactive-button--hovered': isHovered.value,
    'interactive-button--focused': isFocused.value,
    'interactive-button--with-icon': props.icon,
    'interactive-button--with-badge': props.badge
  }
])

// Handler de clique
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
  
  // Efeito de sucesso
  if (buttonRef.value) {
    pulseElement(buttonRef.value)
  }
}

// Efeito de erro (pode ser chamado externamente)
const showError = () => {
  if (buttonRef.value) {
    shakeElement(buttonRef.value)
  }
}

// Expor métodos para uso externo
defineExpose({
  showError,
  focus: () => buttonRef.value?.focus(),
  blur: () => buttonRef.value?.blur()
})
</script>

<style scoped>
.interactive-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  outline: none;
  min-height: 44px; /* Touch target mínimo */
}

.interactive-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Variantes */
.interactive-button--primary {
  background: linear-gradient(135deg, #ff6a00, #ff8c42);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
}

.interactive-button--primary:hover {
  background: linear-gradient(135deg, #e55a00, #ff7a32);
  box-shadow: 0 6px 16px rgba(255, 106, 0, 0.4);
}

.interactive-button--secondary {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.interactive-button--secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.interactive-button--success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.interactive-button--warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.interactive-button--danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.interactive-button--ghost {
  background: transparent;
  color: #64748b;
}

.interactive-button--ghost:hover {
  background: #f8fafc;
  color: #475569;
}

/* Tamanhos */
.interactive-button--sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.interactive-button--md {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.interactive-button--lg {
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  min-height: 52px;
}

.interactive-button--xl {
  padding: 1.25rem 2rem;
  font-size: 1.25rem;
  min-height: 60px;
}

/* Estados */
.interactive-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.interactive-button--loading {
  cursor: wait;
  pointer-events: none;
}

.interactive-button--pressed {
  transform: scale(0.95);
}

.interactive-button--hovered {
  transform: translateY(-1px);
}

.interactive-button--focused {
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.2);
}

/* Conteúdo */
.interactive-button__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
}

.interactive-button--loading .interactive-button__content {
  opacity: 0.7;
}

.interactive-button__icon {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}

.interactive-button__text {
  white-space: nowrap;
}

/* Loading spinner */
.interactive-button__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.interactive-button__spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Badge */
.interactive-button__badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Responsividade */
@media (max-width: 768px) {
  .interactive-button {
    min-height: 48px; /* Touch target maior no mobile */
  }
  
  .interactive-button--sm {
    min-height: 40px;
  }
  
  .interactive-button--lg {
    min-height: 56px;
  }
  
  .interactive-button--xl {
    min-height: 64px;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  .interactive-button {
    border: 2px solid currentColor;
  }
  
  .interactive-button--primary {
    border-color: white;
  }
  
  .interactive-button--secondary {
    border-color: #475569;
  }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .interactive-button {
    transition: none;
  }
  
  .interactive-button--pressed {
    transform: none;
  }
  
  .interactive-button--hovered {
    transform: none;
  }
  
  .interactive-button__spinner {
    animation: none;
  }
}
</style>
