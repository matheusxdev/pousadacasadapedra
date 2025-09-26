<template>
  <footer class="footer">
    <!-- Interactive Map -->
    <div class="map-section">
      <div class="container">
        <InteractiveMap />
      </div>
    </div>

    <!-- Main Footer Area -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-content">
          <!-- Left Column - Brand & Social -->
          <div class="footer-brand">
            <div class="brand-logo">
              <img src="~/assets/images/logo.png" alt="Grupo Caminué" class="footer-logo" />
            </div>
            <p class="brand-tagline">Descubra experiências únicas em turismo e hospedagem em Búzios.</p>
            
            <div class="social-links">
              <a
                href="https://instagram.com/viajescasadapedra"
                target="_blank"
                rel="noopener"
                aria-label="{{ $t('social.instagram') }}"
                class="social-link instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="simple-icons:instagram" class="iconify iconify--simple-icons">
                  <path fill="currentColor" d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener"
                aria-label="{{ $t('social.airbnb') }}"
                class="social-link airbnb"
              >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="simple-icons:airbnb" class="iconify iconify--simple-icons">
                  <path fill="currentColor" d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457c-.263-1.027-.16-1.848.291-2.465c.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465c-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783c-2.253.98-4.483-.583-6.392-2.704c3.157-3.951 3.74-7.028 2.385-9.018c-.795-1.14-1.933-1.695-3.394-1.695c-2.944 0-4.563 2.49-3.927 5.382c.37 1.565 1.352 3.343 2.917 5.332c-.98 1.085-1.91 1.856-2.732 2.333c-.636.344-1.245.558-1.828.609c-2.679.399-4.778-2.2-3.825-4.88c.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132l.58-1.116c.45-.822.635-1.19 1.351-1.643c.346-.21.77-.315 1.246-.315c.954 0 1.698.558 2.016 1.007c.158.239.345.557.582.953l.558 1.089l.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025l.533 1.22l.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317c1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027c3.37.003 6.152-3.261 4.802-6.975"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener"
                aria-label="{{ $t('social.booking') }}"
                class="social-link booking"
              >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="simple-icons:bookingdotcom" class="iconify iconify--simple-icons">
                  <path fill="currentColor" d="M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898c0 1.15-.575 1.82-.91 2.108l-.287.263l.335.192c.815.479 1.318 1.389 1.318 2.395c0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15m1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365c0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533c0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341a1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation Columns -->
          <div class="footer-nav">
            <div class="nav-column">
              <h4>Informações</h4>
              <ul>
                <li><NuxtLink to="/accommodations">Pousadas</NuxtLink></li>
                <li><NuxtLink to="/about">Sobre Nós</NuxtLink></li>
                <li><NuxtLink to="/contact">Contato</NuxtLink></li>
                <li><a href="#" @click.prevent>Política de Privacidade</a></li>
              </ul>
            </div>

            <div class="nav-column">
              <h4>Recursos</h4>
              <ul>
                <li><NuxtLink to="/accommodations">Reservas</NuxtLink></li>
                <li><a href="#" @click.prevent>Pagamentos</a></li>
                <li><a href="#" @click.prevent>Parceiros</a></li>
                <li><a href="#" @click.prevent>FAQ</a></li>
              </ul>
            </div>

            <div class="nav-column">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#" @click.prevent>Carreiras</a></li>
                <li><a href="#" @click.prevent>Eventos</a></li>
                <li><a href="#" @click.prevent>Segurança</a></li>
                <li><a href="#" @click.prevent>Suporte</a></li>
              </ul>
            </div>

            <div class="nav-column">
              <h4>Funcionalidades</h4>
              <ul>
                <li><a href="#" @click.prevent>Recompensas</a></li>
                <li><a href="#" @click.prevent>Melhor Preço</a></li>
                <li><a href="#" @click.prevent>Garantia</a></li>
                <li><a href="#" @click.prevent>Cancelamento</a></li>
              </ul>
            </div>
          </div>

          <!-- Right Column - Contact & Map -->
          <div class="footer-contact">
            <h4>Contato</h4>
            <div class="contact-info">
              <a href="https://wa.me/5522997892414" target="_blank" rel="noopener" class="contact-item">
                <Icon name="heroicons:device-phone-mobile" />
                <span>+55 22 99789-2414</span>
              </a>
              <a href="mailto:turismo@casadapedra.net" class="contact-item">
                <Icon name="heroicons:envelope" />
                <span>turismo@casadapedra.net</span>
              </a>
              <a
                href="https://www.google.com/maps?q=Travessa+L%C3%BAcio+Ant%C3%B4nio+Quintanilha,+57,+B%C3%BAzios+-+RJ,+28950-835"
                target="_blank"
                rel="noopener"
                class="contact-item address"
              >
                <Icon name="heroicons:map-pin" />
                <span>Travessa Lúcio Antônio Quintanilha, 57<br>Centro, Búzios - RJ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="footer-bottom">
      <div class="container">
        <div class="bottom-content">
          <p class="copyright">
            © {{ new Date().getFullYear() }} Grupo Caminué. Todos os direitos reservados.
          </p>
          <p class="credits">
            Feito com
            <Icon name="heroicons:heart-solid" class="heart-icon" />
            por
            <a href="https://starhubsolutions.com" target="_blank" rel="noopener" class="starhub-link">
              StarHub Solutions
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>

<style scoped>
.footer {
  background: #f8fafc;
  color: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23e2e8f0" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  opacity: 0.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Main Footer Area */
.footer-main {
  padding: 4rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Brand Section */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.logo {
  height: 40px;
  width: auto;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.brand-tagline {
  color: #6b7280;
  line-height: 1.6;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.social-link.instagram:hover {
  background: #e4405f;
  color: white;
}

.social-link.airbnb:hover {
  background: #ff5a60;
  color: white;
}

.social-link.booking:hover {
  background: #003580;
  color: white;
}

.social-link svg {
  width: 20px;
  height: 20px;
}

/* Navigation */
.footer-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.nav-column h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.nav-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-column li {
  margin-bottom: 0.5rem;
}

.nav-column a {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.nav-column a:hover {
  color: #1E3A8A;
}

/* Contact Section */
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-contact h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.contact-item:hover {
  color: #1E3A8A;
}

.contact-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.contact-item.address span {
  line-height: 1.4;
}

/* Map Section */
.map-section {
  background: #f8fafc;
  padding: 2rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.map-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Interactive Map */
.map-container {
  margin-top: 1rem;
}

/* Copyright Bar */
.footer-bottom[data-v-3506faf6] {
  background: #1E3A8A;
  padding: 1rem;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 0.875rem;
}

.credits {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heart-icon {
  width: 16px;
  height: 16px;
  color: #ff6b6b;
}

.starhub-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.starhub-link:hover {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .footer-nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .map-section .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .footer-main {
    padding: 3rem 0;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .footer-brand {
    align-items: center;
    text-align: center;
  }
  
  .brand-tagline {
    max-width: none;
    text-align: center;
  }
  
  .footer-nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    text-align: center;
  }
  
  .nav-column {
    text-align: center;
  }
  
  .footer-contact {
    align-items: center;
    text-align: center;
  }
  
  .contact-info {
    align-items: center;
  }
  
  .contact-item {
    justify-content: center;
  }
  
  .map-section {
    padding: 1.5rem 0;
  }
  
  .map-section .container {
    padding: 0 1rem;
  }
  
  .bottom-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .footer-nav {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
  
  .nav-column {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-brand {
    align-items: center;
    text-align: center;
  }
  
  .footer-contact {
    align-items: center;
    text-align: center;
  }
  
  .contact-info {
    align-items: center;
  }
  
  .contact-item {
    justify-content: center;
  }
  
  .map-section {
    padding: 1rem 0;
  }
}
</style>
