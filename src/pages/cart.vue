<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <h1>Carrinho de Compras</h1>
        <p>Revise seus itens antes de finalizar</p>
      </div>
      
      <div class="cart-content">
        <div v-if="cartStore.items.length === 0" class="cart-empty">
          <Icon name="heroicons:shopping-cart" class="cart-empty__icon" />
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione alguns produtos para começar</p>
          <NuxtLink to="/tours" class="btn btn--primary">
            Explorar Tours
          </NuxtLink>
        </div>
        
        <div v-else class="cart-items">
          <div class="cart-items__list">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id"
              class="cart-item"
            >
              <div class="cart-item__info">
                <h3>{{ item.title }}</h3>
                <p class="cart-item__price">R$ {{ item.price.toFixed(2) }}</p>
              </div>
              
              <div class="cart-item__controls">
                <button 
                  @click="cartStore.updateQty(item.id, item.qty - 1)"
                  class="btn btn--sm btn--outline"
                >
                  -
                </button>
                <span class="cart-item__qty">{{ item.qty }}</span>
                <button 
                  @click="cartStore.updateQty(item.id, item.qty + 1)"
                  class="btn btn--sm btn--outline"
                >
                  +
                </button>
              </div>
              
              <div class="cart-item__total">
                R$ {{ (item.price * item.qty).toFixed(2) }}
              </div>
              
              <button 
                @click="cartStore.remove(item.id)"
                class="cart-item__remove"
                aria-label="Remover item"
              >
                <Icon name="heroicons:x-mark" />
              </button>
            </div>
          </div>
          
          <div class="cart-summary">
            <div class="cart-summary__total">
              <span>Subtotal:</span>
              <span class="cart-summary__amount">R$ {{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            
            <div class="cart-summary__actions">
              <button @click="cartStore.clear()" class="btn btn--outline">
                Limpar Carrinho
              </button>
              <button class="btn btn--primary btn--lg">
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// SEO
useHead({
  title: 'Carrinho - Casa da Pedra',
  meta: [
    { name: 'description', content: 'Revise seus itens no carrinho de compras' }
  ]
})
</script>

<style scoped>
.cart-page {
  padding: var(--spacing-8) 0;
  min-height: 60vh;
}

.cart-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.cart-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.cart-header p {
  color: var(--gray-600);
  font-size: var(--font-size-lg);
}

.cart-empty {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-8);
}

.cart-empty__icon {
  width: 4rem;
  height: 4rem;
  color: var(--gray-400);
  margin-bottom: var(--spacing-6);
}

.cart-empty h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-2);
}

.cart-empty p {
  color: var(--gray-600);
  margin-bottom: var(--spacing-8);
}

.cart-items__list {
  margin-bottom: var(--spacing-8);
}

.cart-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-6);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-4);
  background: var(--white);
}

.cart-item__info {
  flex: 1;
}

.cart-item__info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--gray-900);
  margin-bottom: var(--spacing-1);
}

.cart-item__price {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

.cart-item__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin: 0 var(--spacing-6);
}

.cart-item__qty {
  min-width: 2rem;
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.cart-item__total {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  min-width: 6rem;
  text-align: right;
}

.cart-item__remove {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: var(--spacing-2);
  margin-left: var(--spacing-4);
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
}

.cart-item__remove:hover {
  color: var(--error);
  background: var(--gray-50);
}

.cart-summary {
  background: var(--gray-50);
  padding: var(--spacing-8);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--gray-200);
}

.cart-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-6);
}

.cart-summary__amount {
  color: var(--primary);
}

.cart-summary__actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn--primary {
  background: var(--primary);
  color: var(--white);
}

.btn--primary:hover {
  background: var(--gray-800);
}

.btn--outline {
  background: transparent;
  color: var(--gray-700);
  border-color: var(--gray-300);
}

.btn--outline:hover {
  background: var(--gray-50);
}

.btn--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .cart-item__controls {
    margin: 0;
  }
  
  .cart-item__total {
    text-align: left;
    min-width: auto;
  }
  
  .cart-summary__actions {
    flex-direction: column;
  }
}
</style>
