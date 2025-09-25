import { ref, readonly } from 'vue'

// Estado global do header
const isHeaderVisible = ref(true)
const isBookingFormSticky = ref(false)

export const useHeaderState = () => {
  const hideHeader = () => {
    isHeaderVisible.value = false
    isBookingFormSticky.value = true
  }

  const showHeader = () => {
    isHeaderVisible.value = true
    isBookingFormSticky.value = false
  }

  return {
    isHeaderVisible: readonly(isHeaderVisible),
    isBookingFormSticky: readonly(isBookingFormSticky),
    hideHeader,
    showHeader
  }
}
