# Componentes - Especificações

## FeaturedCard (FCard)
```vue
<template>
  <NuxtLink :to="detailLink" class="fcard">
    <div class="fcard__media">
      <img :src="item.image" :alt="item.title" loading="lazy" />
      <span v-if="item.badge" class="fcard__badge">{{ item.badge }}</span>
    </div>
    <div class="fcard__content">
      <h3 class="fcard__title">{{ item.title }}</h3>
      <p v-if="item.subtitle" class="fcard__subtitle">{{ item.subtitle }}</p>
      <div class="fcard__meta">
        <!-- rating, location, etc -->
      </div>
      <div class="fcard__price">
        <!-- preço formatado -->
      </div>
    </div>
    <div class="fcard__actions">
      <button class="fcard__button">{{ $t('common.viewDetails') }}</button>
    </div>
  </NuxtLink>
</template>
```

### CSS BEM
- **Container**: `display: flex; flex-direction: column; height: 100%`
- **Media**: aspect-ratio 16:9, object-fit: cover
- **Título**: line-clamp 2, altura mínima consistente
- **Meta/Price**: altura mínima para alinhamento
- **Actions**: `margin-top: auto` para fixar botão

## HeroSlider
```vue
<template>
  <div class="hero-slider">
    <div class="hero-slider__container">
      <div class="hero-slider__slides">
        <div v-for="(slide, index) in slides" :key="index" 
             class="hero-slider__slide" 
             :class="{ 'hero-slider__slide--active': index === currentSlide }">
          <img :src="slide.image" :alt="slide.title" />
          <div class="hero-slider__content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.subtitle }}</p>
            <button>{{ slide.cta }}</button>
          </div>
        </div>
      </div>
      <button class="hero-slider__prev" @click="prevSlide">
        <Icon name="heroicons:chevron-left" />
      </button>
      <button class="hero-slider__next" @click="nextSlide">
        <Icon name="heroicons:chevron-right" />
      </button>
      <div class="hero-slider__dots">
        <button v-for="(slide, index) in slides" :key="index"
                :class="{ 'hero-slider__dot--active': index === currentSlide }"
                @click="goToSlide(index)">
        </button>
      </div>
    </div>
  </div>
</template>
```

### Props
- `slides: Array<{image, title, subtitle, cta}>`
- `autoplay: number` (ms, 0 = desabilitado)
- `pauseOnHover: boolean`

### Emits
- `slide-changed(index)`
- `prev-clicked()`
- `next-clicked()`

## CalendarAvailability
```vue
<template>
  <div class="calendar">
    <div class="calendar__header">
      <button @click="prevMonth">
        <Icon name="heroicons:chevron-left" />
      </button>
      <h3>{{ monthYear }}</h3>
      <button @click="nextMonth">
        <Icon name="heroicons:chevron-right" />
      </button>
    </div>
    <div class="calendar__grid">
      <div v-for="day in days" :key="day.date" 
           class="calendar__day"
           :class="getDayClasses(day)"
           @click="selectDay(day)">
        {{ day.day }}
      </div>
    </div>
    <div class="calendar__legend">
      <div class="calendar__legend-item">
        <span class="calendar__legend-dot calendar__legend-dot--available"></span>
        {{ $t('common.available') }}
      </div>
      <div class="calendar__legend-item">
        <span class="calendar__legend-dot calendar__legend-dot--unavailable"></span>
        {{ $t('common.unavailable') }}
      </div>
    </div>
  </div>
</template>
```

### Props
- `mode: 'tour' | 'stay'`
- `minNights: number`
- `maxNights: number`
- `allowRange: boolean`
- `availability: DayAvailability[]`

### Emits
- `date-selected(date)` - para tours
- `range-selected({from, to, nights})` - para stays
- `month-changed({month, year})`

## PriceSummary
```vue
<template>
  <div class="price-summary">
    <div class="price-summary__breakdown">
      <div class="price-summary__item">
        <span>{{ $t('common.subtotal') }}</span>
        <span>{{ formatPrice(breakdown.subtotal) }}</span>
      </div>
      <div class="price-summary__item">
        <span>{{ $t('common.taxes') }}</span>
        <span>{{ formatPrice(breakdown.taxes) }}</span>
      </div>
      <div class="price-summary__total">
        <span>{{ $t('common.total') }}</span>
        <span>{{ formatPrice(breakdown.total) }}</span>
      </div>
    </div>
    <button class="price-summary__button" 
            :disabled="!canReserve"
            @click="$emit('reserve')">
      {{ $t('common.reserveNow') }}
    </button>
  </div>
</template>
```

### Props
- `mode: 'tour' | 'stay'`
- `breakdown: PricingBreakdown`
- `loading: boolean`
- `error: string | null`
- `canReserve: boolean`

### Emits
- `reserve()`
- `retry()`
