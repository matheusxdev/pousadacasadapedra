<template>
  <div id="app">
    <NavHeader />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Configuração global do app
useHead({
  title: 'Casa da Pedra',
  meta: [
    { name: 'description', content: 'Descubra experiências únicas em turismo e hospedagem' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'pt'
  }
})
</script>

<style>
/* Estilos globais básicos */
* { 
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
