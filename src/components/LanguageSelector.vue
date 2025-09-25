<template>
  <div class="language-selector">
    <button 
      @click="toggleDropdown"
      class="language-selector__button"
      :aria-label="availableLocales.find((l: any) => l.code === currentLocale)?.name"
    >
                  <ClientOnly>
                    <Icon 
                      :name="getFlagIcon(currentLocale)" 
                      class="language-selector__flag"
                    />
                    <template #fallback>
                      <div class="language-selector__flag language-selector__flag--fallback">
                        {{ currentLocale === 'pt' ? 'BR' : currentLocale.toUpperCase() }}
                      </div>
                    </template>
                  </ClientOnly>
      <Icon name="heroicons:chevron-down" class="language-selector__icon" />
    </button>
    
    <div 
      v-if="isOpen" 
      class="language-selector__dropdown"
      @click.stop
    >
      <button
        v-for="lang in availableLocales"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="language-selector__option"
        :class="{ 'language-selector__option--active': lang.code === currentLocale }"
      >
                <ClientOnly>
                  <Icon 
                    :name="getFlagIcon(lang.code)" 
                    class="language-selector__flag"
                  />
                  <template #fallback>
                    <div class="language-selector__flag language-selector__flag--fallback">
                      {{ lang.code === 'pt' ? 'BR' : lang.code.toUpperCase() }}
                    </div>
                  </template>
                </ClientOnly>
        <span class="language-selector__name">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSafeLocale } from '@/composables/useSafeLocale'

const router = useRouter()
const { getSafeLocale, setSafeLocale } = useSafeLocale()
const isOpen = ref(false)
const currentLocale = ref('pt') // Inicializar sempre com 'pt' para evitar hidratação

const availableLocales = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
]

const getFlagIcon = (locale: string) => {
  const flags = {
    pt: 'circle-flags:br',
    en: 'circle-flags:us',
    es: 'circle-flags:es'
  }
  return flags[locale as keyof typeof flags] || flags.pt
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = async (newLocale: string) => {
  try {
    // Usar o composable seguro para salvar preferência
    setSafeLocale(newLocale)
    
    // Alterar idioma atual
    currentLocale.value = newLocale
    
    // Fechar dropdown
    isOpen.value = false
    
    // Obter a rota atual e construir a nova URL com o idioma
    const currentRoute = router.currentRoute.value
    let newPath = currentRoute.path
    
    // Remover prefixo de idioma atual se existir
    if (newPath.startsWith('/en') || newPath.startsWith('/es')) {
      newPath = newPath.substring(3) || '/'
    }
    
    // Adicionar novo prefixo de idioma se necessário
    if (newLocale === 'pt') {
      // Para português, usar rota sem prefixo
      await router.push(newPath)
    } else {
      // Para outros idiomas, adicionar prefixo
      await router.push(`/${newLocale}${newPath}`)
    }
    
    // Recarregar a página para aplicar as traduções
    setTimeout(() => {
      window.location.reload()
    }, 100)
    
  } catch (error) {
    console.error('Error changing language:', error)
  }
}


// Fechar dropdown ao clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Detectar idioma atual apenas no cliente para evitar hidratação
  if (process.client) {
    currentLocale.value = getSafeLocale()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.language-selector__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition);
  color: var(--ink);
}

.language-selector__button:hover {
  background: var(--bg);
  border-color: var(--brand);
}

.language-selector__flag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.language-selector__flag--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand);
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.language-selector__icon {
  width: 16px;
  height: 16px;
  color: white;
  transition: transform var(--transition);
}

.language-selector__button:hover .language-selector__icon {
  transform: rotate(180deg);
}

.language-selector__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: 1000;
  min-width: 160px;
  overflow: hidden;
}

.language-selector__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition);
  text-align: left;
  color: var(--ink);
}

.language-selector__option:hover {
  background: var(--bg);
}

.language-selector__option--active {
  background: var(--brand);
  color: white;
}

.language-selector__option--active:hover {
  background: var(--brand-600);
}

.language-selector__name {
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .language-selector__button {
    padding: 0.375rem 0.5rem;
  }
  
  .language-selector__flag {
    width: 18px;
    height: 13px;
  }
  
  .language-selector__icon {
    width: 14px;
    height: 14px;
  }
}
</style>
