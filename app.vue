<template>
  <div id="app">
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframe 
        src="https://www.googletagmanager.com/ns.html?id=GTM-MK5N788Z"
        height="0" 
        width="0" 
        style="display:none;visibility:hidden"
      ></iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->
    
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
  },
  script: [
    {
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MK5N788Z');`,
      type: 'text/javascript'
    }
  ]
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
