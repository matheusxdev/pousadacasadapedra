<template>
  <div class="fcard">
    <div class="fcard__media">
      <img 
        :src="itemImage" 
        :alt="item.title"
        @error="handleImageError"
        :class="{ 'fcard__image--error': imageError }"
      />
      <div v-if="imageError" class="fcard__image-placeholder">
        <Icon name="heroicons:photo" />
        <span>{{ $t('footer.imageNotAvailable') }}</span>
      </div>
      <div v-if="item.badge" class="fcard__badge">{{ item.badge }}</div>
    </div>
    
    <div class="fcard__content">
      <div class="fcard__header">
        <h3 class="fcard__title">{{ translatedTitle }}</h3>
        <div v-if="translatedSubtitle" class="fcard__subtitle">
          <!-- Se HTML, renderizar sanitizado -->
          <div v-if="subtitleIsHtml" v-html="safeSubtitleHtml" />
          <!-- Se texto simples, renderizar com quebras de linha -->
          <p v-else class="fcard__subtitle-text">{{ translatedSubtitle }}</p>
        </div>
      </div>
      
      <div class="fcard__meta">
        <div v-if="translatedLocation" class="fcard__location">
          <Icon name="heroicons:map-pin" />
          <span>{{ translatedLocation }}</span>
        </div>
        
        <div v-if="item.rating" class="fcard__rating">
          <Icon name="heroicons:star-solid" />
          <span>{{ item.rating }}</span>
          <span v-if="item.reviewsCount" class="fcard__reviews">({{ item.reviewsCount }})</span>
        </div>
      </div>
      
      <div class="fcard__price">
        <div v-if="itemPrice.hasPrice" class="fcard__price-container">
          <div v-if="item.hasPromotion && item.priceOriginal" class="fcard__price-promotion">
            <span class="fcard__price-original">{{ formatPrice(item.priceOriginal) }}</span>
            <span class="fcard__price-current">{{ itemPrice.text }}</span>
          </div>
          <span v-else class="fcard__price-value">
            {{ itemPrice.text }}
          </span>
        </div>
        <span v-else class="fcard__price-placeholder">
          {{ $t('common.consultPrice') }}
        </span>
      </div>
      
      <div class="fcard__actions">
        <NuxtLink 
          :to="getItemRoute(item)"
          class="fcard__button"
        >
          {{ $t('common.viewDetails') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { FeaturedItem } from '@/composables/useFeatured'
import { getPrimaryImage, getDisplayPrice } from '@/utils/normalize'
import { useProductTranslations } from '@/composables/useProductTranslations'
import { useSafeLocale } from '@/composables/useSafeLocale'
import { isProbablyHtml } from '@/utils/isHtml'

interface Props {
  item: FeaturedItem
}

const props = defineProps<Props>()
const imageError = ref(false)
const { translateProductTitle, translateProductDescription } = useProductTranslations()
const { getSafeLocale } = useSafeLocale()

const handleImageError = () => {
  imageError.value = true
}

const itemImage = computed(() => {
  return getPrimaryImage(props.item)
})

const itemPrice = computed(() => {
  return getDisplayPrice(props.item)
})

// Traduções dinâmicas baseadas no idioma atual
const currentLocale = ref('pt') // Inicializar com 'pt' para evitar hidratação

const translatedTitle = computed(() => {
  return translateProductTitle(props.item, currentLocale.value)
})

const translatedSubtitle = computed(() => {
  return translateProductDescription(props.item, currentLocale.value)
})

// Sanitização de HTML para subtitle
const rawSubtitle = computed(() => translatedSubtitle.value || '')
const subtitleIsHtml = computed(() => isProbablyHtml(rawSubtitle.value))
const safeSubtitleHtml = ref<string | null>(null)

// Função para sanitizar HTML
const sanitizeHtml = async (html: string) => {
  if (typeof window === 'undefined') return html
  
  try {
    const DOMPurify = (await import('dompurify')).default
    const config = {
      ADD_TAGS: ['h1','h2','h3','h4','h5','h6','img','figure','figcaption','table','thead','tbody','tfoot','tr','th','td','blockquote','pre','code','span','u','s'],
      ADD_ATTR: ['style','class','align','target','rel','id','width','height','loading'],
      FORBID_TAGS: ['script','iframe','object','embed','form','input','button','audio','video'],
      FORBID_ATTR: ['onerror','onload','onclick','onmouseover'],
      ALLOW_UNKNOWN_PROTOCOLS: false
    }
    
    const cleaned = DOMPurify.sanitize(html, config)
    const wrapper = document.createElement('div')
    wrapper.innerHTML = cleaned as string
    wrapper.querySelectorAll('a[href]').forEach(a => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })
    return wrapper.innerHTML
  } catch (error) {
    console.warn('Erro ao sanitizar HTML:', error)
    return html
  }
}

// Watch para atualizar HTML sanitizado
watch([subtitleIsHtml, rawSubtitle], async () => {
  if (subtitleIsHtml.value && rawSubtitle.value) {
    safeSubtitleHtml.value = await sanitizeHtml(rawSubtitle.value)
  } else {
    safeSubtitleHtml.value = null
  }
}, { immediate: true })

const translatedLocation = computed(() => {
  const locationTexts = {
    pt: 'Localização não informada',
    en: 'Location not informed',
    es: 'Ubicación no informada'
  }
  return props.item.location || locationTexts[currentLocale.value as keyof typeof locationTexts] || locationTexts.pt
})

// Atualizar idioma no cliente
onMounted(() => {
  if (process.client) {
    currentLocale.value = getSafeLocale()
  }
})

const getItemRoute = (item: FeaturedItem) => {
  const currentLocale = getSafeLocale()
  const baseRoute = item.type === 'tour' ? `/tours/${item.slug || item.id}` : `/accommodations/${item.slug || item.id}`
  
  // Adicionar prefixo de idioma se necessário
  if (currentLocale === 'pt') {
    return baseRoute
  } else {
    return `/${currentLocale}${baseRoute}`
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}
</script>

<style scoped>
.fcard {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all var(--transition);
  border: 1px solid var(--border);
}

.fcard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.fcard__media {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.fcard__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.fcard__image--error {
  display: none;
}

.fcard__image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  gap: 0.5rem;
}

.fcard__image-placeholder svg {
  width: 48px;
  height: 48px;
}

.fcard__image-placeholder span {
  font-size: 0.875rem;
  font-weight: 500;
}

.fcard:hover .fcard__media img {
  transform: scale(1.05);
}

.fcard__badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #1E3A8A;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.fcard__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  gap: 1rem;
}

.fcard__header {
  flex: 1;
}

.fcard__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.fcard__subtitle {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fcard__subtitle-text {
  margin: 0;
  white-space: pre-line;
}

/* Estilos para conteúdo HTML sanitizado */
.fcard__subtitle :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.fcard__subtitle :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.fcard__subtitle :deep(th),
.fcard__subtitle :deep(td) {
  padding: 4px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.fcard__subtitle :deep(a[href]) {
  color: var(--brand);
  text-decoration: underline;
}

.fcard__subtitle :deep(strong) {
  font-weight: 600;
  color: #374151;
}

.fcard__subtitle :deep(em) {
  font-style: italic;
}

.fcard__subtitle :deep(ul),
.fcard__subtitle :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.fcard__subtitle :deep(li) {
  margin: 0.25rem 0;
}

.fcard__subtitle :deep(h1),
.fcard__subtitle :deep(h2),
.fcard__subtitle :deep(h3),
.fcard__subtitle :deep(h4),
.fcard__subtitle :deep(h5),
.fcard__subtitle :deep(h6) {
  margin: 0.5rem 0 0.25rem 0;
  font-weight: 600;
  color: #374151;
}

.fcard__subtitle :deep(h1) { font-size: 1.1rem; }
.fcard__subtitle :deep(h2) { font-size: 1rem; }
.fcard__subtitle :deep(h3) { font-size: 0.9rem; }
.fcard__subtitle :deep(h4),
.fcard__subtitle :deep(h5),
.fcard__subtitle :deep(h6) { font-size: 0.875rem; }

.fcard__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: var(--meta-h, 2rem);
}

.fcard__location,
.fcard__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.fcard__location svg,
.fcard__rating svg {
  width: 16px;
  height: 16px;
  color: #1E3A8A;
}

.fcard__reviews {
  color: #999;
}

.fcard__price {
  margin-bottom: 1rem;
  min-height: var(--meta-h, 2rem);
}

.fcard__price-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fcard__price-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E3A8A;
}

.fcard__price-promotion {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fcard__price-original {
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
}

.fcard__price-current {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1E3A8A;
}

.fcard__price-placeholder {
  font-size: 1rem;
  color: #666;
  font-style: italic;
}

.fcard__actions {
  margin-top: auto;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.fcard__button {
  display: block;
  width: 100%;
  background: #1E3A8A;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.fcard__button:hover {
  background: #1e40af;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .fcard__content {
    padding: 1rem;
  }
  
  .fcard__title {
    font-size: 1.125rem;
  }
  
  .fcard__price-value {
    font-size: 1.125rem;
  }
}
</style>
