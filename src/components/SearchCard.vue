<template>
  <ClientOnly>
    <div class="search-card">
    <div class="search-card__header">
      <h2 class="search-card__title">
        {{ $t('search.title', 'Encontre sua próxima aventura') }}
      </h2>
      <p class="search-card__subtitle">
        {{ $t('search.subtitle', 'Descubra tours incríveis e acomodações únicas') }}
      </p>
    </div>

    <div class="search-card__form-wrapper">
      <form @submit.prevent="handleSearch" class="search-card__form">
      <!-- Campo de busca principal -->
      <div class="search-card__main-search">
        <div class="search-card__input-group">
          <Icon name="heroicons:magnifying-glass" class="search-card__search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('search.placeholder', 'Para onde você quer ir?')"
            class="search-card__input"
            @input="handleInputChange"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="clearSearch"
            class="search-card__clear-btn"
          >
            <Icon name="heroicons:x-mark" />
          </button>
        </div>

        <!-- Sugestões -->
        <div
          v-if="showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)"
          class="search-card__suggestions"
        >
          <!-- Sugestões da API -->
          <div v-if="suggestions.length > 0" class="search-card__suggestions-section">
            <h4 class="search-card__suggestions-title">
              {{ $t('search.suggestions', 'Sugestões') }}
            </h4>
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.text"
              type="button"
              @click="selectSuggestion(suggestion.text)"
              class="search-card__suggestion-item"
            >
              <Icon :name="getSuggestionIcon(suggestion.type)" />
              <span>{{ suggestion.text }}</span>
            </button>
          </div>

          <!-- Histórico -->
          <div v-if="searchHistory.length > 0 && searchQuery" class="search-card__suggestions-section">
            <h4 class="search-card__suggestions-title">
              {{ $t('search.recent', 'Buscas recentes') }}
            </h4>
            <button
              v-for="item in searchHistory.slice(0, 5)"
              :key="item"
              type="button"
              @click="selectSuggestion(item)"
              class="search-card__suggestion-item search-card__suggestion-item--history"
            >
              <Icon name="heroicons:clock" />
              <span>{{ item }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros avançados -->
      <div class="search-card__filters">
        <div class="search-card__filter-group">
          <label class="search-card__filter-label">
            {{ $t('search.type', 'Tipo') }}
          </label>
          <select v-model="searchType" class="search-card__filter-select">
            <option value="all">{{ $t('search.allTypes', 'Todos') }}</option>
            <option value="tours">{{ $t('search.tours', 'Tours') }}</option>
            <option value="accommodations">{{ $t('search.accommodations', 'Hospedagem') }}</option>
          </select>
        </div>

        <div class="search-card__filter-group">
          <label class="search-card__filter-label">
            {{ $t('search.category', 'Categoria') }}
          </label>
          <select v-model="selectedCategory" class="search-card__filter-select">
            <option value="">{{ $t('search.allCategories', 'Todas as categorias') }}</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="search-card__filter-group">
          <label class="search-card__filter-label">
            {{ $t('search.date', 'Data') }}
          </label>
          <input
            v-model="searchDate"
            type="date"
            :min="today"
            class="search-card__filter-input"
          />
        </div>

        <div class="search-card__filter-group">
          <label class="search-card__filter-label">
            {{ $t('search.participants', 'Participantes') }}
          </label>
          <div class="search-card__participants">
            <button
              type="button"
              @click="decreaseAdults"
              :disabled="adults <= 1"
              class="search-card__participant-btn"
            >
              <Icon name="heroicons:minus" />
            </button>
            <span class="search-card__participant-count">{{ adults }}</span>
            <button
              type="button"
              @click="increaseAdults"
              class="search-card__participant-btn"
            >
              <Icon name="heroicons:plus" />
            </button>
          </div>
        </div>
      </div>

      <!-- Botão de busca -->
      <button
        type="submit"
        :disabled="loading || !searchQuery.trim()"
        class="search-card__search-btn"
      >
        <Icon v-if="loading" name="heroicons:arrow-path" class="search-card__loading-icon" />
        <Icon v-else name="heroicons:magnifying-glass" />
        {{ $t('search.button', 'Buscar') }}
      </button>
      </form>
    </div>

    <!-- Resultados rápidos -->
    <div v-if="quickResults.length > 0" class="search-card__quick-results">
      <h3 class="search-card__quick-results-title">
        {{ $t('search.quickResults', 'Resultados rápidos') }}
      </h3>
      <div class="search-card__quick-results-grid">
        <FeaturedCard
          v-for="result in quickResults.slice(0, 3)"
          :key="result.id"
          :item="result"
          class="search-card__quick-result"
        />
      </div>
    </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useCategories } from '@/composables/useCategories'

// Composables
const { search, quickSearch, searchHistory, debouncedQuickSearch } = useSearch()
const { categories, loadCategories } = useCategories()

// Props
interface Props {
  initialQuery?: string
  initialType?: 'all' | 'tours' | 'accommodations'
  initialCategory?: string
  showFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialQuery: '',
  initialType: 'all',
  initialCategory: '',
  showFilters: true
})

// Emits
const emit = defineEmits<{
  search: [filters: any]
}>()

// State
const searchQuery = ref(props.initialQuery)
const searchType = ref(props.initialType)
const selectedCategory = ref(props.initialCategory)
const searchDate = ref('')
const adults = ref(1)
const children = ref(0)
const loading = ref(false)
const showSuggestions = ref(false)
const suggestions = ref<any[]>([])
const quickResults = ref<any[]>([])
const isClient = ref(false)

// Computed
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Methods
const handleInputChange = async () => {
  if (searchQuery.value.length >= 2) {
    try {
      suggestions.value = await debouncedQuickSearch(searchQuery.value)
    } catch (error) {
      console.error('Quick search error:', error)
    }
  } else {
    suggestions.value = []
  }
}

const selectSuggestion = (text: string) => {
  searchQuery.value = text
  showSuggestions.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const increaseAdults = () => {
  adults.value++
}

const decreaseAdults = () => {
  if (adults.value > 1) {
    adults.value--
  }
}

const getSuggestionIcon = (type: string) => {
  const icons = {
    destination: 'heroicons:map-pin',
    category: 'heroicons:tag',
    recent: 'heroicons:clock'
  }
  return icons[type as keyof typeof icons] || 'heroicons:tag'
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  showSuggestions.value = false

  try {
    const filters = {
      query: searchQuery.value,
      type: searchType.value,
      category: selectedCategory.value || undefined,
      date: searchDate.value || undefined,
      adults: adults.value,
      children: children.value
    }

    const results = await search(filters)
    quickResults.value = results.data.slice(0, 3)

    emit('search', filters)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  isClient.value = true
  await loadCategories()
})
</script>

<style scoped>
.search-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.search-card__header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-card__title {
  font-size: 2rem;
  font-weight: 700;
  color: #002279;
  margin-bottom: 0.5rem;
}

.search-card__subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.search-card__form-wrapper {
  width: 100%;
}

.search-card__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-card__main-search {
  position: relative;
}

.search-card__input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-card__search-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: #6b7280;
  z-index: 2;
}

.search-card__input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.search-card__input:focus {
  outline: none;
  border-color: #fc6807;
  box-shadow: 0 0 0 3px rgba(252, 104, 7, 0.1);
}

.search-card__clear-btn {
  position: absolute;
  right: 1rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-card__clear-btn:hover {
  background: #d1d5db;
  color: #374151;
}

.search-card__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 300px;
  overflow-y: auto;
}

.search-card__suggestions-section {
  padding: 0.5rem 0;
}

.search-card__suggestions-title {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f3f4f6;
}

.search-card__suggestion-item {
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-card__suggestion-item:hover {
  background: #f9fafb;
}

.search-card__suggestion-item--history {
  color: #6b7280;
}

.search-card__filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.search-card__filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-card__filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.search-card__filter-select,
.search-card__filter-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.search-card__filter-select:focus,
.search-card__filter-input:focus {
  outline: none;
  border-color: #fc6807;
}

.search-card__participants {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-card__participant-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fc6807;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-card__participant-btn:hover:not(:disabled) {
  background: #e55a06;
}

.search-card__participant-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.search-card__participant-count {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}

.search-card__search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #fc6807;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-card__search-btn:hover:not(:disabled) {
  background: #e55a06;
  transform: translateY(-1px);
}

.search-card__search-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.search-card__loading-icon {
  animation: spin 1s linear infinite;
}

.search-card__quick-results {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.search-card__quick-results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #002279;
  margin-bottom: 1rem;
}

.search-card__quick-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.search-card__quick-result {
  transform: scale(0.95);
  transition: transform 0.2s ease;
}

.search-card__quick-result:hover {
  transform: scale(1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile */
@media (max-width: 768px) {
  .search-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .search-card__title {
    font-size: 1.5rem;
  }

  .search-card__filters {
    grid-template-columns: 1fr;
  }

  .search-card__quick-results-grid {
    grid-template-columns: 1fr;
  }
}
</style>