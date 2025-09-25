<template>
  <div class="calendar-availability">
    <div class="calendar-availability__header">
      <button 
        class="calendar-availability__nav"
        :disabled="isPrevNavDisabled"
        @click="previousMonth"
        :aria-label="$t('calendar.previousMonth')"
      >
        <Icon name="heroicons:chevron-left" />
      </button>
      
      <h3 class="calendar-availability__title">
        {{ formatMonth(currentMonth) }}
      </h3>
      
      <button 
        class="calendar-availability__nav"
        @click="nextMonth"
        :aria-label="$t('calendar.nextMonth')"
      >
        <Icon name="heroicons:chevron-right" />
      </button>
    </div>
    
    <div class="calendar-availability__weekdays">
      <div 
        v-for="day in weekdays" 
        :key="day"
        class="calendar-availability__weekday"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="calendar-availability__loading">
      <div class="calendar-availability__skeleton">
        <div v-for="i in 35" :key="i" class="calendar-availability__skeleton-day"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="calendar-availability__error">
      <Icon name="heroicons:exclamation-triangle" />
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="calendar-availability__retry">
        {{ $t('common.tryAgain') }}
      </button>
    </div>
    
    <!-- Calendar Days -->
    <div 
      v-else 
      class="calendar-availability__days"
      @keydown="handleKeydown"
      tabindex="0"
      role="grid"
      :aria-label="$t('calendar.calendarGrid')"
    >
      <button
        v-for="(day, index) in calendarDays"
        :key="day.date"
        class="calendar-availability__day"
        :class="getDayClasses(day)"
        :disabled="day.status === 'unavailable'"
        @click="selectDay(day)"
        :aria-label="`${day.date} - ${getDayStatusText(day.status)}`"
        :aria-selected="isDaySelected(day)"
        :title="getDayTooltipText(day)"
        :tabindex="focusedDayIndex === index ? 0 : -1"
        :ref="(el) => setDayRef(el as HTMLButtonElement | null, index)"
        role="gridcell"
      >
        <span class="calendar-availability__day-number">{{ day.dayNumber }}</span>
        <div v-if="day.status === 'partial'" class="calendar-availability__dot"></div>
        <Icon 
          v-if="day.isPast" 
          name="heroicons:lock-closed" 
          class="calendar-availability__lock-icon"
        />
        <!-- Indicador de preço -->
        <div 
          v-if="day.price && day.price > 0 && day.status === 'available' && !day.isPast" 
          class="calendar-availability__price-indicator"
          :title="getDayTooltipText(day)"
        >
          <span class="calendar-availability__price-text">{{ formatPrice(day.price) }}</span>
        </div>
      </button>
    </div>
    
    <div class="calendar-availability__legend">
      <div class="calendar-availability__legend-item">
        <div class="calendar-availability__legend-dot calendar-availability__legend-dot--available"></div>
        <span>{{ $t('calendar.available') }}</span>
      </div>
      <div class="calendar-availability__legend-item">
        <div class="calendar-availability__legend-dot calendar-availability__legend-dot--unavailable"></div>
        <span>{{ $t('calendar.unavailable') }}</span>
      </div>
      <div class="calendar-availability__legend-item">
        <div class="calendar-availability__legend-dot calendar-availability__legend-dot--partial"></div>
        <span>{{ $t('calendar.partial') }}</span>
      </div>
      <div v-if="allowRange" class="calendar-availability__legend-item">
        <div class="calendar-availability__legend-dot calendar-availability__legend-dot--selected"></div>
        <span>{{ $t('calendar.selected') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Helpers de data (local-safe)
function startOfTodayLocal() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function makeLocalDate(year: number, monthIndex0: number, day: number) {
  // monthIndex0 é 0-11
  return new Date(year, monthIndex0, day); // local, sem UTC
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

// Para aria-label/payload seguro (YYYY-MM-DD), mas sem UTC/ISO
function toYmdLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Para exibir ao usuário (DD/MM/YYYY)
function toDmyLocal(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Converte string YMD para Date local
function fromYmdLocal(ymd: string) {
  const [y, m, d] = ymd.split('-').map(n => parseInt(n, 10));
  return new Date(y, m - 1, d);
}

interface AvailabilityDay {
  date: string
  status: 'available' | 'unavailable' | 'partial'
  minNights?: number
  maxNights?: number
}

interface CalendarDay extends AvailabilityDay {
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isPast?: boolean
  price?: number
}

interface Props {
  mode: 'tour' | 'stay'
  minNights?: number
  maxNights?: number
  allowRange?: boolean
  availability: AvailabilityDay[]
  initialMonth?: { month: number; year: number }
  loading?: boolean
  error?: string | null
  selectedDate?: string | null
  selectedRange?: { from: string; to: string; nights: number } | null
  // Props para indicador de preços
  productId?: string
  adults?: number
  children?: number
  basePrice?: number
}

interface Emits {
  (e: 'date-selected', date: string): void
  (e: 'range-selected', range: { from: string; to: string; nights: number }): void
  (e: 'month-changed', month: { month: number; year: number }): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  minNights: 1,
  maxNights: 30,
  allowRange: false,
  loading: false,
  error: null,
  adults: 1,
  children: 0,
  basePrice: 0
})

const emit = defineEmits<Emits>()

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Navegação por teclado
const focusedDayIndex = ref<number>(-1)
const dayRefs = ref<(HTMLButtonElement | null)[]>([])

// Inicializar com data local para evitar problemas de timezone
const currentMonth = ref(makeLocalDate(new Date().getFullYear(), new Date().getMonth(), 1))
const selectedRange = ref<{ from: string | null; to: string | null }>({
  from: null,
  to: null
})

// Computed para desabilitar navegação anterior
const isPrevNavDisabled = computed(() => {
  const todayLocal = startOfTodayLocal()
  const currentYear = currentMonth.value.getFullYear()
  const currentMonthIndex = currentMonth.value.getMonth()
  
  return currentYear < todayLocal.getFullYear() ||
         (currentYear === todayLocal.getFullYear() && currentMonthIndex <= todayLocal.getMonth())
})

// Inicializar mês se fornecido
if (props.initialMonth) {
  currentMonth.value = makeLocalDate(props.initialMonth.year, props.initialMonth.month - 1, 1)
}

const calendarDays = computed((): CalendarDay[] => {
  const todayLocal = startOfTodayLocal()
  const currentYear = currentMonth.value.getFullYear()
  const currentMonthIndex = currentMonth.value.getMonth()
  
  // Calcular primeiro dia do mês e último dia
  const firstDayOfMonth = makeLocalDate(currentYear, currentMonthIndex, 1)
  const lastDayOfMonth = makeLocalDate(currentYear, currentMonthIndex + 1, 0)
  
  // Calcular primeiro dia da semana (domingo = 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const startDay = firstDayOfMonth.getDate() - firstDayOfWeek
  
  // Calcular último dia da semana
  const lastDayOfWeek = lastDayOfMonth.getDay()
  const endDay = lastDayOfMonth.getDate() + (6 - lastDayOfWeek)
  
  const days: CalendarDay[] = []
  
  // Gerar todos os dias do grid do calendário
  for (let day = startDay; day <= endDay; day++) {
    const dayDate = makeLocalDate(currentYear, currentMonthIndex, day)
    const dateStr = toYmdLocal(dayDate)
    const availability = props.availability.find(a => a.date === dateStr)
    
    // Verificar se é dia passado
    const isPast = dayDate.getTime() < todayLocal.getTime()
    
    // Determinar status: dias passados são sempre unavailable
    let status = availability?.status || 'unavailable'
    if (isPast) {
      status = 'unavailable'
    }
    
    // Calcular preço para o dia
    const dayPrice = calculateDayPrice(dateStr)
    
    days.push({
      date: dateStr,
      dayNumber: dayDate.getDate(), // Usar o dia real da data, não o índice do loop
      isCurrentMonth: day >= 1 && day <= lastDayOfMonth.getDate(),
      isToday: dateStr === toYmdLocal(todayLocal),
      status,
      minNights: availability?.minNights,
      maxNights: availability?.maxNights,
      isPast,
      price: dayPrice
    })
  }
  
  return days
})

const formatMonth = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: ptBR })
}

// Função para calcular preço por dia
const calculateDayPrice = (dateStr: string): number => {
  if (!props.basePrice || props.basePrice <= 0) return 0
  
  const adultPrice = props.basePrice
  const childPrice = props.basePrice * 0.5 // 50% do preço adulto
  
  if (props.mode === 'tour') {
    // Para tours, preço por pessoa
    return (adultPrice * props.adults) + (childPrice * props.children)
  } else {
    // Para stays, preço por noite por pessoa
    return (adultPrice * props.adults) + (childPrice * props.children)
  }
}

// Função para formatar preço
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Função para gerar texto do tooltip
const getDayTooltipText = (day: CalendarDay): string => {
  const parts: string[] = []
  
  // Data formatada
  const dateObj = fromYmdLocal(day.date)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  parts.push(formattedDate)
  
  // Status de disponibilidade
  const statusText = getDayStatusText(day.status)
  parts.push(`Status: ${statusText}`)
  
  // Preço se disponível
  if (day.price && day.price > 0 && day.status === 'available' && !day.isPast) {
    const priceText = formatPrice(day.price)
    const priceLabel = props.mode === 'stay' ? 'por noite' : 'total'
    parts.push(`Preço: ${priceText} ${priceLabel}`)
  }
  
  // Informações de participantes
  if (day.status === 'available' && !day.isPast) {
    const totalPeople = props.adults + props.children
    if (totalPeople > 0) {
      const peopleText = `${props.adults} adulto${props.adults > 1 ? 's' : ''}${props.children > 0 ? ` + ${props.children} criança${props.children > 1 ? 's' : ''}` : ''}`
      parts.push(`Participantes: ${peopleText}`)
    }
  }
  
  // Informações de noites para stays
  if (props.mode === 'stay' && day.minNights) {
    parts.push(`Mínimo: ${day.minNights} noite${day.minNights > 1 ? 's' : ''}`)
  }
  
  return parts.join('\n')
}

const getDayClasses = (day: CalendarDay): string[] => {
  const classes = ['calendar-availability__day']
  
  if (!day.isCurrentMonth) {
    classes.push('calendar-availability__day--other-month')
  }
  
  if (day.isToday) {
    classes.push('calendar-availability__day--today')
  }
  
  if (day.isPast) {
    classes.push('calendar-availability__day--past')
  }
  
  classes.push(`calendar-availability__day--${day.status}`)
  
  if (isDayInRange(day)) {
    classes.push('calendar-availability__day--in-range')
  }
  
  if (isDaySelected(day)) {
    classes.push('calendar-availability__day--selected')
  }
  
  return classes
}

const isDaySelected = (day: CalendarDay): boolean => {
  // Verificar se é uma data única selecionada
  if (props.selectedDate && day.date === props.selectedDate) {
    return true
  }
  
  // Verificar se é parte de um range selecionado
  if (props.selectedRange) {
    return day.date === props.selectedRange.from || day.date === props.selectedRange.to
  }
  
  // Fallback para o estado interno (para compatibilidade)
  return selectedRange.value.from === day.date || selectedRange.value.to === day.date
}

const isDayInRange = (day: CalendarDay): boolean => {
  // Verificar range das props primeiro
  if (props.selectedRange) {
    const dayDate = fromYmdLocal(day.date)
    const fromDate = fromYmdLocal(props.selectedRange.from)
    const toDate = fromYmdLocal(props.selectedRange.to)
    
    return dayDate > fromDate && dayDate < toDate
  }
  
  // Fallback para o estado interno
  if (!props.allowRange || !selectedRange.value.from || !selectedRange.value.to) {
    return false
  }
  
  const dayDate = fromYmdLocal(day.date)
  const fromDate = fromYmdLocal(selectedRange.value.from)
  const toDate = fromYmdLocal(selectedRange.value.to)
  
  return dayDate > fromDate && dayDate < toDate
}

const getDayStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: 'Disponível',
    unavailable: 'Indisponível',
    partial: 'Parcialmente disponível'
  }
  return statusMap[status] || status
}

const selectDay = (day: CalendarDay) => {
  // Bloquear dias passados e indisponíveis
  if (day.status === 'unavailable' || day.isPast) return
  
  // Criar data local para comparações
  const dayDate = fromYmdLocal(day.date)
  const todayLocal = startOfTodayLocal()
  
  // Verificação adicional de dia passado
  if (dayDate.getTime() < todayLocal.getTime()) return
  
  if (!props.allowRange) {
    // Modo tour - seleção de data única
    emit('date-selected', day.date)
    return
  }
  
  // Modo stay - seleção de range
  if (!selectedRange.value.from || selectedRange.value.to) {
    // Primeira seleção ou reset
    selectedRange.value = { from: day.date, to: null }
  } else {
    // Segunda seleção
    const fromDate = fromYmdLocal(selectedRange.value.from)
    const toDate = fromYmdLocal(day.date)
    
    if (toDate <= fromDate) {
      // Selecionar nova data de início
      selectedRange.value = { from: day.date, to: null }
      return
    }
    
    // Verificar mínimo de noites
    const nights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    if (props.minNights && nights < props.minNights) {
      return // Não permitir seleção
    }
    
    selectedRange.value.to = day.date
    
    // Emitir evento de range selecionado
    emit('range-selected', {
      from: selectedRange.value.from,
      to: selectedRange.value.to,
      nights
    })
  }
}

const previousMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1)
  emitMonthChanged()
}

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
  emitMonthChanged()
}

const emitMonthChanged = () => {
  emit('month-changed', {
    month: currentMonth.value.getMonth() + 1,
    year: currentMonth.value.getFullYear()
  })
}

// Funções de navegação por teclado
const setDayRef = (el: HTMLButtonElement | null, index: number) => {
  dayRefs.value[index] = el
}

const handleKeydown = (event: KeyboardEvent) => {
  const { key } = event
  
  switch (key) {
    case 'ArrowLeft':
      event.preventDefault()
      navigateToDay(-1)
      break
    case 'ArrowRight':
      event.preventDefault()
      navigateToDay(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateToDay(-7)
      break
    case 'ArrowDown':
      event.preventDefault()
      navigateToDay(7)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (focusedDayIndex.value >= 0 && focusedDayIndex.value < calendarDays.value.length) {
        const day = calendarDays.value[focusedDayIndex.value]
        if (day.status !== 'unavailable' && !day.isPast) {
          selectDay(day)
        }
      }
      break
    case 'Home':
      event.preventDefault()
      focusFirstAvailableDay()
      break
    case 'End':
      event.preventDefault()
      focusLastAvailableDay()
      break
    case 'Escape':
      event.preventDefault()
      focusedDayIndex.value = -1
      break
  }
}

const navigateToDay = (offset: number) => {
  if (calendarDays.value.length === 0) return
  
  let newIndex = focusedDayIndex.value
  
  if (newIndex === -1) {
    // Se nenhum dia está focado, focar no primeiro disponível
    newIndex = calendarDays.value.findIndex(day => 
      day.status === 'available' && !day.isPast
    )
    if (newIndex === -1) newIndex = 0
  } else {
    newIndex += offset
    
    // Verificar limites
    if (newIndex < 0) {
      // Ir para o mês anterior
      if (!isPrevNavDisabled.value) {
        previousMonth()
        // Focar no último dia do mês anterior
        setTimeout(() => {
          focusedDayIndex.value = Math.max(0, calendarDays.value.length - 1)
        }, 100)
      } else {
        newIndex = 0
      }
    } else if (newIndex >= calendarDays.value.length) {
      // Ir para o próximo mês
      nextMonth()
      // Focar no primeiro dia do próximo mês
      setTimeout(() => {
        focusedDayIndex.value = 0
      }, 100)
    }
  }
  
  // Garantir que o índice está dentro dos limites
  newIndex = Math.max(0, Math.min(newIndex, calendarDays.value.length - 1))
  focusedDayIndex.value = newIndex
  
  // Focar no elemento
  setTimeout(() => {
    dayRefs.value[newIndex]?.focus()
  }, 0)
}

const focusFirstAvailableDay = () => {
  const firstAvailable = calendarDays.value.findIndex(day => 
    day.status === 'available' && !day.isPast
  )
  if (firstAvailable !== -1) {
    focusedDayIndex.value = firstAvailable
    setTimeout(() => {
      dayRefs.value[firstAvailable]?.focus()
    }, 0)
  }
}

const focusLastAvailableDay = () => {
  // Usar findLastIndex alternativo para compatibilidade
  let lastAvailable = -1
  for (let i = calendarDays.value.length - 1; i >= 0; i--) {
    const day = calendarDays.value[i]
    if (day.status === 'available' && !day.isPast) {
      lastAvailable = i
      break
    }
  }
  
  if (lastAvailable !== -1) {
    focusedDayIndex.value = lastAvailable
    setTimeout(() => {
      dayRefs.value[lastAvailable]?.focus()
    }, 0)
  }
}
</script>

<style scoped>
.calendar-availability {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-availability__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-availability__nav {
  background: #f8f9fa;
  border: none;
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
}

.calendar-availability__nav:hover:not(:disabled) {
  background: #e9ecef;
}

.calendar-availability__nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.calendar-availability__nav svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.calendar-availability__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
}

.calendar-availability__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.calendar-availability__weekday {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  padding: 0.5rem;
}

.calendar-availability__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.calendar-availability__days--transitioning {
  opacity: 0.7;
  transform: scale(0.98);
}

.calendar-availability__day {
  aspect-ratio: 1;
  min-height: 44px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  touch-action: manipulation;
  transform: scale(1);
}

.calendar-availability__day:hover:not(:disabled) {
  background: #f8f9fa;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-availability__day:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.calendar-availability__day--other-month {
  color: #ccc;
}

.calendar-availability__day--today {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  border: 2px solid #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  position: relative;
}

.calendar-availability__day--today::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 1px solid #1976d2;
  border-radius: 8px;
  animation: today-pulse 2s infinite;
}

@keyframes today-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.calendar-availability__day--available {
  color: #333;
}

.calendar-availability__day--available:hover {
  background: #e8f5e8;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-availability__day--selected {
  background: linear-gradient(135deg, #ff6a00, #ff8c42);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
  animation: selected-bounce 0.3s ease-out;
}

@keyframes selected-bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}

.calendar-availability__day--in-range {
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.1), rgba(255, 140, 66, 0.1));
  color: #ff6a00;
  transform: scale(1.02);
}

.calendar-availability__day--unavailable {
  color: #999;
  background: #f5f5f5;
}

.calendar-availability__day--past {
  opacity: 0.4;
  background: #f8f9fa;
  color: #bbb;
  position: relative;
}

.calendar-availability__day--past:hover {
  background: #f8f9fa;
  opacity: 0.4;
}

.calendar-availability__lock-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  color: #999;
  opacity: 0.7;
}

.calendar-availability__price-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-availability__day:hover .calendar-availability__price-indicator {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.calendar-availability__price-text {
  font-size: 0.65rem;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Tooltip melhorado para o botão do dia */
.calendar-availability__day {
  position: relative;
}

.calendar-availability__day::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  white-space: pre-line;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 20;
  max-width: 200px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-availability__day:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-8px);
}

.calendar-availability__day--partial {
  color: #333;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .calendar-availability {
    padding: 0.75rem;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .calendar-availability__header {
    margin-bottom: 0.75rem;
  }
  
  .calendar-availability__nav {
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }
  
  .calendar-availability__nav svg {
    width: 14px;
    height: 14px;
  }
  
  .calendar-availability__title {
    font-size: 0.9rem;
  }
  
  .calendar-availability__weekdays {
    gap: 0.2rem;
    margin-bottom: 0.5rem;
  }
  
  .calendar-availability__weekday {
    font-size: 0.7rem;
    padding: 0.2rem;
  }
  
  .calendar-availability__days {
    gap: 0.2rem;
    margin-bottom: 0.75rem;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .calendar-availability__day {
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
    font-size: 0.7rem;
    max-width: calc(100% / 7);
  }
  
  .calendar-availability__day-number {
    font-size: 0.7rem;
  }
  
  .calendar-availability__lock-icon {
    width: 8px;
    height: 8px;
    top: 1px;
    right: 1px;
  }
  
  .calendar-availability__price-indicator {
    font-size: 0.6rem;
    padding: 2px 4px;
    max-width: 80px;
  }
  
  .calendar-availability__price-text {
    font-size: 0.6rem;
  }
  
  .calendar-availability__day::after {
    font-size: 0.7rem;
    padding: 6px 8px;
    max-width: 150px;
  }
  
  .calendar-availability__legend {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .calendar-availability__legend-item {
    font-size: 0.75rem;
  }
  
  .calendar-availability__legend-dot {
    width: 8px;
    height: 8px;
  }
}

.calendar-availability__day--partial:hover {
  background: #fff3cd;
}

.calendar-availability__day--selected {
  background: var(--brand, #FF6700);
  color: white;
  font-weight: 600;
}

.calendar-availability__day--in-range {
  background: rgba(255, 103, 0, 0.1);
  color: var(--brand, #FF6700);
}

.calendar-availability__day-number {
  font-size: 0.875rem;
}

.calendar-availability__dot {
  width: 6px;
  height: 6px;
  background: #ffc107;
  border-radius: 50%;
  margin-top: 2px;
}

.calendar-availability__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.calendar-availability__legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.calendar-availability__legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.calendar-availability__legend-dot--available {
  background: #28a745;
}

.calendar-availability__legend-dot--unavailable {
  background: #dc3545;
}

.calendar-availability__legend-dot--partial {
  background: #ffc107;
}

.calendar-availability__legend-dot--selected {
  background: var(--brand, #FF6700);
}

/* Loading State */
.calendar-availability__loading {
  padding: 1rem 0;
}

.calendar-availability__skeleton {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-availability__skeleton-day {
  aspect-ratio: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

/* Error State */
.calendar-availability__error {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.calendar-availability__error svg {
  width: 48px;
  height: 48px;
  color: #dc3545;
  margin-bottom: 1rem;
}

.calendar-availability__error p {
  margin-bottom: 1rem;
}

.calendar-availability__retry {
  background: var(--brand, #FF6700);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-availability__retry:hover {
  background: var(--brand-600, #E55A00);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Acessibilidade - Indicadores de foco */
.calendar-availability__days:focus {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
}

.calendar-availability__day:focus {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  z-index: 10;
}

.calendar-availability__day:focus-visible {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 103, 0, 0.2);
}

.calendar-availability__nav:focus {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
}

.calendar-availability__nav:focus-visible {
  outline: 2px solid var(--brand, #FF6700);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 103, 0, 0.2);
}

/* Melhorar contraste para acessibilidade */
.calendar-availability__day--past {
  opacity: 0.4;
  background: #f5f5f5;
  color: #999;
}

.calendar-availability__day--past:focus {
  opacity: 0.7;
  background: #e0e0e0;
  color: #666;
}

/* Indicador visual para dias com foco */
.calendar-availability__day[tabindex="0"] {
  position: relative;
}

.calendar-availability__day[tabindex="0"]::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--brand, #FF6700);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.calendar-availability__day[tabindex="0"]:focus::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .calendar-availability {
    padding: 1rem;
  }
  
  .calendar-availability__title {
    font-size: 1.125rem;
  }
  
  .calendar-availability__day {
    aspect-ratio: 1;
    min-height: 40px;
  }
  
  .calendar-availability__legend {
    gap: 0.75rem;
  }
  
  .calendar-availability__legend-item {
    font-size: 0.75rem;
  }
}

/* Movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .calendar-availability__day {
    transition: none;
  }
  
  .calendar-availability__day:hover:not(:disabled) {
    transform: none;
  }
  
  .calendar-availability__day--available:hover {
    transform: none;
  }
  
  .calendar-availability__day--selected {
    transform: none;
    animation: none;
  }
  
  .calendar-availability__day--in-range {
    transform: none;
  }
  
  .calendar-availability__days {
    transition: none;
  }
  
  .calendar-availability__days--transitioning {
    transform: none;
  }
  
  .calendar-availability__day--today::before {
    animation: none;
  }
}
</style>
