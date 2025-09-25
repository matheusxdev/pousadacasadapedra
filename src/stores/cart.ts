import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  title: string
  qty: number
  price: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    count: (state) => state.items.reduce((total, item) => total + item.qty, 0),
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.qty), 0)
  },

  actions: {
    add(item: Omit<CartItem, 'qty'>) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.qty += 1
      } else {
        this.items.push({ ...item, qty: 1 })
      }
    },

    remove(id: string) {
      const index = this.items.findIndex(item => item.id === id)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    updateQty(id: string, qty: number) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        if (qty <= 0) {
          this.remove(id)
        } else {
          item.qty = qty
        }
      }
    },

    clear() {
      this.items = []
    }
  }
})
