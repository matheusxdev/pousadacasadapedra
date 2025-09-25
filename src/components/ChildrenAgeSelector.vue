<template>
  <div v-if="childrenCount > 0 && isClient" class="children-age-selector">
    <div class="children-age-selector__header">
      <Icon name="heroicons:user-group" class="children-age-selector__icon" />
      <h4 class="children-age-selector__title">Idades das Crianças</h4>
      <span class="children-age-selector__subtitle">Preços diferenciados por faixa etária</span>
    </div>
    
    <div class="children-age-selector__list">
      <div 
        v-for="(child, index) in childrenAges" 
        :key="index"
        class="children-age-selector__item"
      >
        <div class="children-age-selector__child-info">
          <div class="children-age-selector__child-number">
            <Icon name="heroicons:user" />
            <span>Criança {{ index + 1 }}</span>
          </div>
          
          <div class="children-age-selector__age-selector">
            <label class="children-age-selector__label">Idade:</label>
            <select 
              :value="child.age"
              @change="updateChildAge(index, $event)"
              class="children-age-selector__select"
              :aria-label="`Idade da criança ${index + 1}`"
            >
              <option 
                v-for="option in ageOptions" 
                :key="option.label"
                :value="option.label"
              >
                {{ option.label }} ({{ option.description }})
              </option>
            </select>
          </div>
          
          <div class="children-age-selector__price-info">
            <span class="children-age-selector__price-label">Preço:</span>
            <span class="children-age-selector__price-value">{{ getChildPrice(child.age) }}</span>
            <span class="children-age-selector__discount">{{ getDiscountText(child.age) }}</span>
          </div>
        </div>
        
        <button 
          @click="removeChild(index)"
          class="children-age-selector__remove"
          :aria-label="`Remover criança ${index + 1}`"
        >
          <Icon name="heroicons:x-mark" />
        </button>
      </div>
    </div>
    
    <div class="children-age-selector__summary">
      <div class="children-age-selector__total-info">
        <span class="children-age-selector__total-label">Total crianças:</span>
        <span class="children-age-selector__total-count">{{ childrenCount }}</span>
        <span class="children-age-selector__total-price">{{ formatPrice(totalChildrenPrice) }}</span>
      </div>
      
      <div v-if="totalSavings > 0" class="children-age-selector__savings">
        <Icon name="heroicons:currency-dollar" class="children-age-selector__savings-icon" />
        <span>Você economiza {{ formatPrice(totalSavings) }} com preços diferenciados!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useChildrenPricing } from '@/composables/useChildrenPricing'

interface ChildAge {
  age: string
}

interface Props {
  childrenCount: number
  basePrice: number
  productId: string
  savedAges?: Array<{ age: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-children-ages': [ages: ChildAge[]]
}>()

// Client-side rendering control
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const { 
  getAgeOptions, 
  getAgeRule, 
  calculateChildPrice, 
  calculateSavings, 
  calculateTotalChildrenPrice,
  formatPrice 
} = useChildrenPricing()

// Estado das idades das crianças
const childrenAges = ref<ChildAge[]>([])

// Obter opções de idade para este produto
const ageOptions = computed(() => getAgeOptions(props.productId))

// Inicializar idades quando o número de crianças mudar
watch(() => props.childrenCount, (newCount) => {
  // Se aumentou o número de crianças
  if (newCount > childrenAges.value.length) {
    const defaultAge = ageOptions.value.find(option => option.multiplier === 0.75)?.label || '6-11 anos'
    const newChildren = Array.from({ length: newCount - childrenAges.value.length }, (_, index) => {
      // Tentar usar idade salva se disponível
      const savedIndex = childrenAges.value.length + index
      const savedAge = props.savedAges?.[savedIndex]?.age
      return {
        age: savedAge || defaultAge
      }
    })
    childrenAges.value.push(...newChildren)
  }
  // Se diminuiu o número de crianças
  else if (newCount < childrenAges.value.length) {
    childrenAges.value = childrenAges.value.slice(0, newCount)
  }
}, { immediate: true })

// Inicializar com idades salvas se disponíveis
watch(() => props.savedAges, (savedAges) => {
  if (savedAges && savedAges.length > 0 && childrenAges.value.length === 0) {
    childrenAges.value = savedAges.map(saved => ({ age: saved.age }))
  }
}, { immediate: true })

// Emitir mudanças
watch(childrenAges, (newAges) => {
  emit('update-children-ages', newAges)
}, { deep: true })

const getChildPrice = (ageRange: string): string => {
  const rule = getAgeRule(ageRange, props.productId)
  if (rule) {
    const price = props.basePrice * rule.multiplier
    return formatPrice(price)
  }
  return formatPrice(props.basePrice)
}

const getDiscountText = (ageRange: string): string => {
  const rule = getAgeRule(ageRange, props.productId)
  if (rule) {
    if (rule.multiplier === 0) return 'Gratuito'
    const discountPercentage = Math.round((1 - rule.multiplier) * 100)
    return `${discountPercentage}% OFF`
  }
  return ''
}

const updateChildAge = (index: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  childrenAges.value[index].age = target.value
}

const removeChild = (index: number) => {
  childrenAges.value.splice(index, 1)
}

// Computed para cálculos
const totalChildrenPrice = computed(() => {
  const ages = childrenAges.value.map(child => child.age)
  return calculateTotalChildrenPrice(props.basePrice, ages, props.productId)
})

const totalSavings = computed(() => {
  const ages = childrenAges.value.map(child => child.age)
  return calculateSavings(props.basePrice, ages, props.productId)
})
</script>

<style scoped>
.children-age-selector {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #bae6fd;
}

.children-age-selector__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.children-age-selector__icon {
  width: 20px;
  height: 20px;
  color: #0284c7;
}

.children-age-selector__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0;
}

.children-age-selector__subtitle {
  font-size: 0.875rem;
  color: #0369a1;
  margin-left: auto;
}

.children-age-selector__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.children-age-selector__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background: white;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  gap: 0.75rem;
}

.children-age-selector__item:hover {
  border-color: #0284c7;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.1);
}

.children-age-selector__child-info {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.children-age-selector__child-number {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: #0c4a6e;
  font-size: 0.875rem;
  white-space: nowrap;
}

.children-age-selector__child-number .icon {
  width: 14px;
  height: 14px;
  color: #0284c7;
}

.children-age-selector__age-selector {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.children-age-selector__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
}

.children-age-selector__select {
  padding: 0.375rem 0.5rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  background: white;
  color: #374151;
  transition: all 0.3s ease;
}

.children-age-selector__select:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

.children-age-selector__price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
  min-width: 0;
  text-align: right;
}

.children-age-selector__price-label {
  font-size: 0.625rem;
  color: #6b7280;
}

.children-age-selector__price-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #059669;
}

.children-age-selector__discount {
  font-size: 0.625rem;
  color: #dc2626;
  font-weight: 600;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  white-space: nowrap;
}

.children-age-selector__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.children-age-selector__remove:hover {
  background: #fecaca;
  border-color: #f87171;
}

.children-age-selector__remove .icon {
  width: 14px;
  height: 14px;
}

.children-age-selector__summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #bae6fd;
}

.children-age-selector__total-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.children-age-selector__total-label {
  font-weight: 600;
  color: #0c4a6e;
}

.children-age-selector__total-count {
  font-weight: 700;
  color: #0284c7;
}

.children-age-selector__total-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #059669;
}

.children-age-selector__savings {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 8px;
  color: #047857;
  font-weight: 600;
}

.children-age-selector__savings-icon {
  width: 16px;
  height: 16px;
  color: #059669;
}

/* Responsive */
@media (max-width: 768px) {
  .children-age-selector {
    padding: 0.75rem;
  }
  
  .children-age-selector__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .children-age-selector__subtitle {
    margin-left: 0;
    font-size: 0.75rem;
  }
  
  .children-age-selector__item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .children-age-selector__child-info {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .children-age-selector__child-number {
    font-size: 0.75rem;
  }
  
  .children-age-selector__age-selector {
    gap: 0.25rem;
  }
  
  .children-age-selector__label {
    font-size: 0.625rem;
  }
  
  .children-age-selector__select {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  .children-age-selector__price-info {
    align-items: flex-start;
    text-align: left;
    gap: 0.25rem;
  }
  
  .children-age-selector__price-value {
    font-size: 0.875rem;
  }
  
  .children-age-selector__remove {
    align-self: flex-end;
    width: 24px;
    height: 24px;
  }
  
  .children-age-selector__remove .icon {
    width: 12px;
    height: 12px;
  }
  
  .children-age-selector__summary {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }
  
  .children-age-selector__total-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .children-age-selector__savings {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .children-age-selector {
    padding: 0.5rem;
  }
  
  .children-age-selector__title {
    font-size: 1rem;
  }
  
  .children-age-selector__subtitle {
    font-size: 0.625rem;
  }
  
  .children-age-selector__item {
    padding: 0.375rem;
  }
  
  .children-age-selector__child-number {
    font-size: 0.625rem;
  }
  
  .children-age-selector__select {
    font-size: 0.625rem;
    padding: 0.375rem;
  }
  
  .children-age-selector__price-value {
    font-size: 0.75rem;
  }
  
  .children-age-selector__discount {
    font-size: 0.5rem;
    padding: 0.125rem 0.25rem;
  }
}
</style>
