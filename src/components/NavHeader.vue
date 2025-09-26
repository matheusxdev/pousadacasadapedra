<template>
  <header 
    class="nav-header" 
    :class="{ 'nav-header--sticky': isSticky }"
    ref="headerRef"
  >
    <div class="container">
      <div class="nav-header__content">
        <!-- Logo -->
        <ClientOnly>
          <NuxtLink :to="getNavRoute('/')" class="nav-header__logo">
            <img src="~/assets/images/logo.png" alt="Grupo Caminué" class="nav-header__logo-img" />
          </NuxtLink>
          <template #fallback>
            <NuxtLink to="/" class="nav-header__logo">
              <img src="~/assets/images/logo.png" alt="Grupo Caminué" class="nav-header__logo-img" />
            </NuxtLink>
          </template>
        </ClientOnly>
        
        <!-- Navegação Desktop -->
        <nav class="nav-header__nav" role="navigation" aria-label="main">
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/')" 
              class="nav-header__link"
              :class="{ 'nav-header__link--active': isActiveRoute('/') }"
              exact-active-class="nav-header__link--active"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/" 
                class="nav-header__link"
                exact-active-class="nav-header__link--active"
              >
                {{ $t('nav.home') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <!-- Quartos sem dropdown -->
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/accommodations')" 
              class="nav-header__link"
              :class="{ 'nav-header__link--active': isActiveRoute('/accommodations') }"
            >
              {{ $t('nav.rooms') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/accommodations" 
                class="nav-header__link"
              >
                {{ $t('nav.rooms') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/about')" 
              class="nav-header__link"
              :class="{ 'nav-header__link--active': isActiveRoute('/about') }"
            >
              {{ $t('nav.about') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/about" 
                class="nav-header__link"
              >
                {{ $t('nav.about') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/contact')" 
              class="nav-header__link"
              :class="{ 'nav-header__link--active': isActiveRoute('/contact') }"
            >
              {{ $t('nav.contact') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/contact" 
                class="nav-header__link"
              >
                {{ $t('nav.contact') }}
              </NuxtLink>
            </template>
          </ClientOnly>
        </nav>
        
        <!-- Controles Direitos -->
        <div class="nav-header__controls">
          <!-- Seletor de Idioma -->
          <LanguageSelector />
          
          <!-- Botão Reservar Agora (apenas desktop) -->
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/accommodations')" 
              class="nav-header__book-now nav-header__book-now--desktop"
            >
              {{ $t('nav.bookNow') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/accommodations" 
                class="nav-header__book-now nav-header__book-now--desktop"
              >
                {{ $t('nav.bookNow') }}
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
        
        <!-- Hamburger Mobile -->
        <button 
          class="nav-header__hamburger"
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="{{ $t('nav.openMenu') }}"
        >
          <span class="nav-header__hamburger-line"></span>
          <span class="nav-header__hamburger-line"></span>
          <span class="nav-header__hamburger-line"></span>
        </button>
      </div>
    </div>
    
    <!-- Menu Mobile -->
    <div 
      v-if="mobileMenuOpen"
      class="nav-header__mobile-overlay"
      @click="closeMobileMenu"
    ></div>
    
    <nav 
      id="mobile-menu"
      class="nav-header__mobile-menu"
      :class="{ 'nav-header__mobile-menu--open': mobileMenuOpen }"
    >
      <div class="nav-header__mobile-content">
        <div class="nav-header__mobile-header">
          <span class="nav-header__mobile-logo-text">Grupo Caminué</span>
          <button 
            class="nav-header__mobile-close"
            @click="closeMobileMenu"
            aria-label="{{ $t('nav.closeMenu') }}"
          >
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="nav-header__mobile-links">
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/')" 
              class="nav-header__mobile-link"
              :class="{ 'nav-header__mobile-link--active': isActiveRoute('/') }"
              @click="closeMobileMenu"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/" 
                class="nav-header__mobile-link"
                @click="closeMobileMenu"
              >
                {{ $t('nav.home') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/accommodations')" 
              class="nav-header__mobile-link"
              :class="{ 'nav-header__mobile-link--active': isActiveRoute('/accommodations') }"
              @click="closeMobileMenu"
            >
              {{ $t('nav.rooms') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/accommodations" 
                class="nav-header__mobile-link"
                @click="closeMobileMenu"
              >
                {{ $t('nav.rooms') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/about')" 
              class="nav-header__mobile-link"
              :class="{ 'nav-header__mobile-link--active': isActiveRoute('/about') }"
              @click="closeMobileMenu"
            >
              {{ $t('nav.about') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/about" 
                class="nav-header__mobile-link"
                @click="closeMobileMenu"
              >
                {{ $t('nav.about') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/contact')" 
              class="nav-header__mobile-link"
              :class="{ 'nav-header__mobile-link--active': isActiveRoute('/contact') }"
              @click="closeMobileMenu"
            >
              {{ $t('nav.contact') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/contact" 
                class="nav-header__mobile-link"
                @click="closeMobileMenu"
              >
                {{ $t('nav.contact') }}
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <!-- Seletor de Idioma Mobile -->
          <div class="nav-header__mobile-language">
            <LanguageSelector />
          </div>
          
          <ClientOnly>
            <NuxtLink 
              :to="getNavRoute('/accommodations')" 
              class="nav-header__mobile-book-now"
              @click="closeMobileMenu"
            >
              {{ $t('nav.bookNow') }}
            </NuxtLink>
            <template #fallback>
              <NuxtLink 
                to="/accommodations" 
                class="nav-header__mobile-book-now"
                @click="closeMobileMenu"
              >
                {{ $t('nav.bookNow') }}
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSafeLocale } from '@/composables/useSafeLocale'

const mobileMenuOpen = ref(false)
const isSticky = ref(false)
const headerRef = ref<HTMLElement>()
const lastScrollY = ref(0)

const { getSafeLocale } = useSafeLocale()

// Função para gerar rotas com idioma
const getNavRoute = (path: string) => {
  const currentLocale = getSafeLocale()
  
  // Para português, usar rota sem prefixo
  if (currentLocale === 'pt') {
    return path
  } else {
    // Para outros idiomas, adicionar prefixo
    return `/${currentLocale}${path}`
  }
}

// Função para verificar se a rota está ativa
const isActiveRoute = (path: string) => {
  const currentPath = useRoute().path
  
  // Remover prefixo de idioma da rota atual para comparação
  const normalizedPath = currentPath.replace(/^\/[a-z]{2}/, '') || '/'
  
  if (path === '/') {
    return normalizedPath === '/'
  } else {
    return normalizedPath.startsWith(path)
  }
}

// Controle de scroll para sticky behavior
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Sticky state - sempre manter header visível
  isSticky.value = currentScrollY > 10
  lastScrollY.value = currentScrollY
}

// Controle de menu mobile
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>

.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  z-index: 1030;
  transition: all 250ms ease-in-out;
  transform: translateY(0);
}

.nav-header--sticky {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
}

.nav-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

/* Logo */
.nav-header__logo {
  text-decoration: none;
  flex-shrink: 0;
}

.nav-header__logo-img {
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* Navegação Desktop */
.nav-header__nav {
  display: flex;
  gap: 2.5rem;
  margin: 0 auto;
}

.nav-header__link {
  position: relative;
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: all 150ms ease-in-out;
}

.nav-header__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: width 250ms ease-in-out;
}

.nav-header__link:hover::after,
.nav-header__link--active::after {
  width: 100%;
}

.nav-header__link:hover {
  color: #ffffff;
}

.nav-header__link--active {
  color: #ffffff;
}

/* Controles Direitos */
.nav-header__controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Botão Reservar Agora */
.nav-header__book-now {
  background: #1E3A8A;
  color: #ffffff;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 150ms ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-header__book-now:hover {
  background: #1E3A8A;
  transform: translateY(-1px);
}

/* Hamburger Mobile */
.nav-header__hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-header__hamburger-line {
  width: 24px;
  height: 2px;
  background: #ffffff;
  transition: all 150ms ease-in-out;
}

/* Mobile Overlay */
.nav-header__mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Menu Mobile */
.nav-header__mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 80vw;
  max-width: 400px;
  height: 100vh;
  background: #ffffff;
  z-index: 1050;
  transform: translateX(100%);
  transition: transform 250ms ease-in-out;
  overflow-y: auto;
}

.nav-header__mobile-menu--open {
  transform: translateX(0);
}

.nav-header__mobile-content {
  padding: 1.5rem;
}

.nav-header__mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.nav-header__mobile-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.1em;
}

.nav-header__mobile-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  border-radius: 0.375rem;
  transition: all 150ms ease-in-out;
}

.nav-header__mobile-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-header__mobile-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-header__mobile-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 150ms ease-in-out;
}

.nav-header__mobile-link:hover {
  background: #f3f4f6;
  color: #1E3A8A;
}

.nav-header__mobile-link--active {
  background: #1E3A8A;
  color: #ffffff;
}

.nav-header__mobile-language {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.nav-header__mobile-book-now {
  background: #1E3A8A;
  color: #ffffff;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-align: center;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
}

.nav-header__mobile-book-now:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 58, 138, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-header__nav {
    display: none;
  }
  
  .nav-header__hamburger {
    display: flex;
  }
  
  .nav-header__content {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;        /* Reduzir altura superior */
    padding-bottom: 1rem;    /* Reduzir altura inferior */
  }
  
  .nav-header__logo-text {
    font-size: 1.25rem;
  }
  
  /* Esconder botão desktop no mobile */
  .nav-header__book-now--desktop {
    display: none;
  }
  
  /* Garantir layout correto no mobile */
  .nav-header__content {
    justify-content: space-between !important; /* Forçar espaço entre logo e controles */
  }
  
  /* Garantir que os controles fiquem à direita */
  .nav-header__controls {
    gap: 0.25rem;            /* Gap menor entre idioma e hambúrguer */
    align-items: center;     /* Alinhar verticalmente */
    flex-shrink: 0;         /* Não encolher */
    display: flex;          /* Garantir que seja flex */
    flex-direction: row;    /* Garantir direção horizontal */
    margin-left: auto;      /* Empurrar para a direita */
  }
  
  /* Garantir que o hambúrguer fique junto aos controles */
  .nav-header__hamburger {
    margin-left: 0;        /* Remover margem se houver */
    flex-shrink: 0;        /* Não encolher */
  }
  
  /* Garantir que o seletor de idioma não ocupe espaço desnecessário */
  .language-selector {
    flex-shrink: 0;        /* Não encolher */
  }
  
  /* Reduzir tamanho do logo no mobile */
  .nav-header__logo-img {
    height: 50px;            /* Reduzir de 60px para 50px */
  }
}

@media (max-width: 480px) {
  .nav-header__content {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.75rem;       /* Ainda menor para telas pequenas */
    padding-bottom: 0.75rem;     /* Ainda menor para telas pequenas */
  }
  
  .nav-header__mobile-menu {
    width: 100vw;
    max-width: 100vw;
  }
  
  /* Logo ainda menor em telas muito pequenas */
  .nav-header__logo-img {
    height: 45px;               /* Reduzir ainda mais */
  }
}
</style>
