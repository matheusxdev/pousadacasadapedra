<template>
  <section class="dynamic-products-section">
    <div class="container">
      <div class="dynamic-products-section__header">
        <p class="dynamic-products-section__subtitle">{{ $t('dynamicProducts.subtitle') }}</p>
        <h2 class="dynamic-products-section__title">{{ $t('dynamicProducts.title') }}</h2>
        <p class="dynamic-products-section__description">{{ $t('dynamicProducts.description') }}</p>
      </div>
      
      <div class="dynamic-products-section__grid">
        <!-- Loading State -->
        <div v-if="loading" class="dynamic-products-section__loading">
          <div class="loading-spinner"></div>
          <p>Carregando acomodações...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="dynamic-products-section__error">
          <p>{{ error }}</p>
        </div>
        
        <!-- Products -->
        <div 
          v-else
          v-for="(product, index) in products" 
          :key="product.id"
          class="dynamic-products-section__card"
          :class="`card-${index + 1}`"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="dynamic-products-section__image">
            <img 
              :src="product.image" 
              :alt="product.name"
              loading="lazy"
            />
            <div class="dynamic-products-section__overlay">
              <div class="dynamic-products-section__badge">{{ product.badge }}</div>
              <div class="dynamic-products-section__actions">
                <button class="dynamic-products-section__action-btn" @click="viewProduct(product)">
                  <Icon name="heroicons:eye" />
                </button>
                <button class="dynamic-products-section__action-btn" @click="bookProduct(product)">
                  <Icon name="heroicons:calendar-days" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="dynamic-products-section__content">
            <div class="dynamic-products-section__meta">
              <span class="dynamic-products-section__category">{{ product.category }}</span>
              <div class="dynamic-products-section__rating">
                <Icon name="heroicons:star-solid" />
                <span>{{ product.rating }}</span>
              </div>
            </div>
            
            <h3 class="dynamic-products-section__name">{{ product.name }}</h3>
            <p class="dynamic-products-section__location">
              <Icon name="heroicons:map-pin" />
              {{ product.location }}
            </p>
            
            <div v-if="product.features && product.features.some(f => f && f.trim())" class="dynamic-products-section__features">
              <span v-for="feature in product.features.filter(f => f && f.trim())" :key="feature" class="dynamic-products-section__feature">
                {{ feature }}
              </span>
            </div>
            
            <div class="dynamic-products-section__footer">
              <div class="dynamic-products-section__price">
                <span class="dynamic-products-section__price-amount">{{ product.price }}</span>
                <span v-if="!product.price.includes('consultar')" class="dynamic-products-section__price-period">{{ $t('dynamicProducts.perNight') }}</span>
              </div>
              <NuxtLink :to="`/accommodations/${product.slug}`" class="dynamic-products-section__cta">
                {{ $t('dynamicProducts.bookNow') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dynamic-products-section__cta-section">
        <NuxtLink to="/accommodations" class="dynamic-products-section__main-cta">
          {{ $t('dynamicProducts.viewAll') }}
          <Icon name="heroicons:arrow-right" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Product {
  id: string
  name: string
  category: string
  location: string
  image: string
  badge: string
  rating: number
  price: string
  slug: string
  features: string[]
}

interface ApiResponse {
  data?: any[]
  accommodations?: any[]
  success?: boolean
  [key: string]: any
}

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Tentar múltiplos endpoints da API
    const endpoints = [
      '/api/products/unified',
      '/api/search',
      '/api/accommodations'
    ]
    
    let response: ApiResponse | null = null
    for (const endpoint of endpoints) {
      try {
        response = await $fetch(endpoint) as ApiResponse
        if (response && ((response.data && response.data.length > 0) || response.success)) {
          break
        }
      } catch (e) {
        continue
      }
    }
    
    if (!response) {
      throw new Error('Nenhum endpoint da API funcionou')
    }
    
    // Processar dados da API
    const apiData = response.data || response.accommodations || []
    const processedProducts = apiData.slice(0, 3).map((item: any, index: number) => {
      // Processar imagem
      let imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      if (item.images && item.images[0]) {
        imageUrl = item.images[0].url || item.images[0]
      } else if (item.image) {
        imageUrl = item.image
      } else if (item.main_image) {
        imageUrl = item.main_image
      }
      
      // Processar preço
      let price = 'Preço a consultar'
      const priceValue = item.current_price || item.price || item.base_price || item.price_promo || item.price_original || item.price_per_night || item.min_price || item.max_price || 0
      if (priceValue > 0) {
        price = `R$ ${priceValue.toLocaleString('pt-BR')}`
      }
      
      // Processar features - usar dados reais da API
      const features = []
      if (item.amenities && Array.isArray(item.amenities)) {
        features.push(...item.amenities.slice(0, 4))
      } else if (item.features && Array.isArray(item.features)) {
        features.push(...item.features.slice(0, 4))
      } else if (item.facilities && Array.isArray(item.facilities)) {
        features.push(...item.facilities.slice(0, 4))
      } else {
        // Se não houver features reais, não mostrar nada
        features.push('')
      }
      
      return {
        id: item.uuid || item.id || `product-${index}`,
        name: item.name || 'Acomodação Premium',
        category: item.category_name || item.category || 'Acomodação',
        location: item.location || 'Búzios, RJ',
        image: imageUrl,
        badge: index === 0 ? 'Mais Popular' : index === 1 ? 'Oferta Especial' : 'Familiar',
        rating: item.rating || 4.5 + (index * 0.1),
        price: price,
        slug: item.slug || item.uuid || item.id,
        features: features
      }
    })
    
    products.value = processedProducts
    
  } catch (err) {
    error.value = 'Erro ao carregar produtos'
    console.error('Erro ao buscar produtos:', err)
  } finally {
    loading.value = false
  }
}

const viewProduct = (product: Product) => {
  navigateTo(`/accommodations/${product.slug}`)
}

const bookProduct = (product: Product) => {
  navigateTo(`/accommodations/${product.slug}?action=book`)
}

onMounted(() => {
  fetchProducts()
  
  // Animar cards com delay escalonado
  const cards = document.querySelectorAll('.dynamic-products-section__card')
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in')
    }, index * 200)
  })
})
</script>

<style scoped>
.dynamic-products-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #bbdefb 0%, #bbdefb 100%);
  position: relative;
  overflow: hidden;
}

.dynamic-products-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23cbd5e1" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  opacity: 0.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.dynamic-products-section__header {
  text-align: center;
  margin-bottom: 4rem;
}

.dynamic-products-section__subtitle {
  font-size: 1rem;
  color: #1E3A8A;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.dynamic-products-section__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.dynamic-products-section__description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.dynamic-products-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.dynamic-products-section__card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.6s ease forwards;
  animation-delay: var(--delay);
}

.dynamic-products-section__card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.dynamic-products-section__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.dynamic-products-section__image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.dynamic-products-section__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.dynamic-products-section__card:hover .dynamic-products-section__image img {
  transform: scale(1.05);
}

.dynamic-products-section__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.dynamic-products-section__card:hover .dynamic-products-section__overlay {
  opacity: 1;
}

.dynamic-products-section__badge {
  background: #1E3A8A;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  align-self: flex-start;
}

.dynamic-products-section__actions {
  display: flex;
  gap: 0.5rem;
  align-self: flex-end;
}

.dynamic-products-section__action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1a1a1a;
}

.dynamic-products-section__action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.dynamic-products-section__action-btn svg {
  width: 18px;
  height: 18px;
}

.dynamic-products-section__content {
  padding: 1.5rem;
}

.dynamic-products-section__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dynamic-products-section__category {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.dynamic-products-section__rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b;
  font-weight: 600;
}

.dynamic-products-section__rating svg {
  width: 16px;
  height: 16px;
}

.dynamic-products-section__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.dynamic-products-section__location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.dynamic-products-section__location svg {
  width: 16px;
  height: 16px;
}

.dynamic-products-section__features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.dynamic-products-section__feature {
  background: #f8fafc;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.dynamic-products-section__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dynamic-products-section__price {
  display: flex;
  flex-direction: column;
}

.dynamic-products-section__price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E3A8A;
}

.dynamic-products-section__price-period {
  font-size: 0.875rem;
  color: #6b7280;
}

.dynamic-products-section__cta {
  background: #1E3A8A;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.dynamic-products-section__cta:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

.dynamic-products-section__cta-section {
  text-align: center;
}

.dynamic-products-section__main-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 90, 43, 0.3);
}

.dynamic-products-section__main-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 90, 43, 0.4);
}

.dynamic-products-section__main-cta svg {
  width: 20px;
  height: 20px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dynamic-products-section {
    padding: 4rem 0;
  }
  
  .dynamic-products-section__title {
    font-size: 2rem;
  }
  
  .dynamic-products-section__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .dynamic-products-section__card {
    margin-bottom: 1rem;
  }
  
  .dynamic-products-section__footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .dynamic-products-section__cta {
    text-align: center;
  }
}

/* Loading and Error States */
.dynamic-products-section__loading,
.dynamic-products-section__error {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #1E3A8A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dynamic-products-section__loading p,
.dynamic-products-section__error p {
  color: #6b7280;
  font-size: 1rem;
}

.dynamic-products-section__error p {
  color: #dc2626;
}
</style>
