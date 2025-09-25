<template>
  <div class="app-layout">
    <NavHeader />
    <main class="app-main" :class="{ 'app-main--with-padding': needsPadding }">
      <slot />
    </main>
    <Footer />
    <WhatsAppFloat />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Layout padrão da aplicação
const route = useRoute()

// Páginas que precisam de padding-top (exceto home)
const needsPadding = computed(() => {
  return route.path !== '/'
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  /* padding-top removido - hero vai até o topo */
}

.app-main--with-padding {
  padding-top: 120px; /* Altura do header fixo */
}
</style>
