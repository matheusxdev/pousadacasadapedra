<template>
  <div v-if="suggestions.length > 0 && isClient" class="participant-suggestions">
    <div class="participant-suggestions__header">
      <Icon name="heroicons:light-bulb" class="participant-suggestions__icon" />
      <h4 class="participant-suggestions__title">Sugestões Inteligentes</h4>
    </div>
    
    <div class="participant-suggestions__list">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="participant-suggestions__item"
        :class="{ 'participant-suggestions__item--recommended': suggestion.isRecommended }"
        @click="applySuggestion(suggestion)"
        :aria-label="`Aplicar sugestão: ${suggestion.description}`"
      >
        <div class="participant-suggestions__content">
          <div class="participant-suggestions__badge">
            <Icon 
              :name="suggestion.isRecommended ? 'heroicons:star-solid' : 'heroicons:check-circle'" 
              class="participant-suggestions__badge-icon"
            />
            <span class="participant-suggestions__badge-text">
              {{ suggestion.isRecommended ? 'Recomendado' : 'Sugestão' }}
            </span>
          </div>
          
          <div class="participant-suggestions__details">
            <div class="participant-suggestions__participants">
              <span class="participant-suggestions__adults">{{ suggestion.adults }} {{ suggestion.adults === 1 ? 'adulto' : 'adultos' }}</span>
              <span v-if="suggestion.children > 0" class="participant-suggestions__children">
                + {{ suggestion.children }} {{ suggestion.children === 1 ? 'criança' : 'crianças' }}
              </span>
            </div>
            
            <p class="participant-suggestions__description">{{ suggestion.description }}</p>
            
            <div class="participant-suggestions__benefits">
              <span 
                v-for="benefit in suggestion.benefits" 
                :key="benefit"
                class="participant-suggestions__benefit"
              >
                <Icon name="heroicons:check" class="participant-suggestions__benefit-icon" />
                {{ benefit }}
              </span>
            </div>
          </div>
          
          <div class="participant-suggestions__price">
            <span class="participant-suggestions__price-label">Total:</span>
            <span class="participant-suggestions__price-value">{{ formatPrice(suggestion.totalPrice) }}</span>
            <span v-if="suggestion.savings > 0" class="participant-suggestions__savings">
              Economize {{ formatPrice(suggestion.savings) }}
            </span>
          </div>
        </div>
        
        <Icon name="heroicons:arrow-right" class="participant-suggestions__arrow" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface ParticipantSuggestion {
  id: string
  adults: number
  children: number
  description: string
  benefits: string[]
  totalPrice: number
  savings: number
  isRecommended: boolean
}

interface Props {
  currentAdults: number
  currentChildren: number
  maxParticipants: number
  basePrice: number
  tourType?: string
}

const props = withDefaults(defineProps<Props>(), {
  tourType: 'tour'
})

const emit = defineEmits<{
  'apply-suggestion': [suggestion: ParticipantSuggestion]
}>()

// Client-side rendering control
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

const suggestions = computed((): ParticipantSuggestion[] => {
  const suggestions: ParticipantSuggestion[] = []
  const currentTotal = props.currentAdults + props.currentChildren
  const currentPrice = (props.currentAdults * props.basePrice) + (props.currentChildren * props.basePrice * 0.5)
  
  // Sugestão 1: Máximo de participantes (se não estiver no máximo)
  if (currentTotal < props.maxParticipants) {
    const maxAdults = props.maxParticipants
    const maxChildren = 0
    const maxPrice = maxAdults * props.basePrice
    const savings = currentPrice - maxPrice
    
    suggestions.push({
      id: 'max-capacity',
      adults: maxAdults,
      children: maxChildren,
      description: `Aproveite a capacidade máxima de ${props.maxParticipants} pessoas`,
      benefits: [
        'Melhor custo-benefício',
        'Experiência mais completa',
        'Divisão de custos'
      ],
      totalPrice: maxPrice,
      savings: savings > 0 ? savings : 0,
      isRecommended: true
    })
  }
  
  // Sugestão 2: Família com crianças (se não tiver crianças)
  if (props.currentChildren === 0 && props.currentAdults >= 2) {
    const familyAdults = props.currentAdults
    const familyChildren = Math.min(2, props.maxParticipants - props.currentAdults)
    const familyPrice = (familyAdults * props.basePrice) + (familyChildren * props.basePrice * 0.5)
    const savings = currentPrice - familyPrice
    
    if (familyChildren > 0) {
      suggestions.push({
        id: 'family-option',
        adults: familyAdults,
        children: familyChildren,
        description: 'Inclua crianças para uma experiência familiar completa',
        benefits: [
          'Preço reduzido para crianças',
          'Experiência em família',
          'Memórias compartilhadas'
        ],
        totalPrice: familyPrice,
        savings: savings > 0 ? savings : 0,
        isRecommended: false
      })
    }
  }
  
  // Sugestão 3: Grupo pequeno otimizado (se estiver acima do ideal)
  if (props.currentAdults > 4 && props.tourType === 'tour') {
    const optimalAdults = 4
    const optimalChildren = 0
    const optimalPrice = optimalAdults * props.basePrice
    const savings = currentPrice - optimalPrice
    
    suggestions.push({
      id: 'optimal-group',
      adults: optimalAdults,
      children: optimalChildren,
      description: 'Grupo ideal para melhor experiência',
      benefits: [
        'Melhor atenção do guia',
        'Mais interação',
        'Experiência personalizada'
      ],
      totalPrice: optimalPrice,
      savings: savings > 0 ? savings : 0,
      isRecommended: false
    })
  }
  
  // Sugestão 4: Casal romântico (se for 2 adultos)
  if (props.currentAdults === 2 && props.currentChildren === 0 && props.tourType === 'tour') {
    suggestions.push({
      id: 'romantic-couple',
      adults: 2,
      children: 0,
      description: 'Perfeito para casais - experiência romântica',
      benefits: [
        'Intimidade garantida',
        'Momento especial',
        'Preço justo para dois'
      ],
      totalPrice: 2 * props.basePrice,
      savings: 0,
      isRecommended: true
    })
  }
  
  return suggestions.slice(0, 3) // Máximo 3 sugestões
})

const applySuggestion = (suggestion: ParticipantSuggestion) => {
  emit('apply-suggestion', suggestion)
}
</script>

<style scoped>
.participant-suggestions {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

.participant-suggestions__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.participant-suggestions__icon {
  width: 20px;
  height: 20px;
  color: #f59e0b;
}

.participant-suggestions__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.participant-suggestions__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.participant-suggestions__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.participant-suggestions__item:hover {
  border-color: var(--brand, #FF6700);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 103, 0, 0.15);
}

.participant-suggestions__item--recommended {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.participant-suggestions__item--recommended:hover {
  border-color: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.participant-suggestions__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.participant-suggestions__badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
}

.participant-suggestions__badge-icon {
  width: 16px;
  height: 16px;
  color: #f59e0b;
}

.participant-suggestions__badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.participant-suggestions__details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.participant-suggestions__participants {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.participant-suggestions__adults {
  font-size: 1rem;
}

.participant-suggestions__children {
  font-size: 0.875rem;
  color: #64748b;
}

.participant-suggestions__description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.participant-suggestions__benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.participant-suggestions__benefit {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.participant-suggestions__benefit-icon {
  width: 12px;
  height: 12px;
  color: #059669;
}

.participant-suggestions__price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.participant-suggestions__price-label {
  font-size: 0.75rem;
  color: #64748b;
}

.participant-suggestions__price-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.participant-suggestions__savings {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 600;
}

.participant-suggestions__arrow {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.participant-suggestions__item:hover .participant-suggestions__arrow {
  color: var(--brand, #FF6700);
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .participant-suggestions {
    padding: 1rem;
  }
  
  .participant-suggestions__item {
    padding: 0.75rem;
  }
  
  .participant-suggestions__benefits {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .participant-suggestions__price {
    align-items: flex-start;
    margin-top: 0.5rem;
  }
}
</style>
