<template>
  <div class="accommodation-detail-page">
    <!-- Urgency Banner -->
    <UrgencyBanner 
      :product-id="accommodation?.uuid || accommodation?.id || ''" 
      product-type="accommodation"
      @dismiss="handleUrgencyDismiss"
      @urgent="handleUrgentMessage"
    />
    
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <NuxtLink to="/accommodations">{{ t('nav.accommodations') }}</NuxtLink>
        <Icon name="heroicons:chevron-right" />
        <span>{{ accommodation?.title || 'Carregando...' }}</span>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="accommodation-detail-page__loading">
        <div class="accommodation-detail-page__skeleton">
          <div class="accommodation-detail-page__skeleton-hero"></div>
          <div class="accommodation-detail-page__skeleton-content">
            <div class="accommodation-detail-page__skeleton-title"></div>
            <div class="accommodation-detail-page__skeleton-subtitle"></div>
            <div class="accommodation-detail-page__skeleton-meta"></div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="accommodation-detail-page__error">
        <Icon name="heroicons:exclamation-triangle" />
        <h2>{{ t('common.error') }}</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/accommodations" class="accommodation-detail-page__back">
          {{ t('common.backToAccommodations') }}
        </NuxtLink>
      </div>
      
      <!-- Accommodation Content -->
      <div v-else-if="accommodation" class="accommodation-detail-page__content">
        <!-- Hero Section -->
    <div class="accommodation-detail-page__hero">
      <div class="accommodation-detail-page__hero-image">
            <!-- Galeria de Imagens -->
            <div class="accommodation-detail-page__image-gallery">
              <!-- Imagem Principal -->
              <div 
                class="accommodation-detail-page__main-image" 
                style="height: clamp(500px, 70vh, 900px) !important; aspect-ratio: auto !important;"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <img 
                  :src="selectedImage" 
                  :alt="getMainImageAltText()" 
                  @click="openLightbox"
                  class="accommodation-detail-page__main-image-img"
                  style="object-fit: contain !important; object-position: center !important;"
                  loading="lazy"
                />
                <button v-if="images.length > 1" class="accommodation-detail-page__nav prev" @click="prevImage" aria-label="Imagem anterior">‹</button>
                <button v-if="images.length > 1" class="accommodation-detail-page__nav next" @click="nextImage" aria-label="Próxima imagem">›</button>
                <div v-if="images.length > 1" class="accommodation-detail-page__image-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</div>
              </div>
              
              <!-- Miniaturas -->
              <div v-if="images.length > 1" class="accommodation-detail-page__thumbnails" role="listbox">
                <button
                  v-for="(img, i) in images"
                  :key="i"
                  class="accommodation-detail-page__thumbnail"
                  :class="{ active: i === currentImageIndex }"
                  @click="selectImage(i)"
                  :aria-selected="i === currentImageIndex"
                >
                  <img :src="img" :alt="getThumbnailAltText(i)" loading="lazy">
                </button>
              </div>
            </div>
            
            <!-- Badges -->
            <div v-if="accommodation.badge" class="accommodation-detail-page__badge">{{ accommodation.badge }}</div>
            <div v-if="accommodation.hasPromotion && accommodation.discount_percentage" class="accommodation-detail-page__discount-badge">
              -{{ accommodation.discount_percentage }}% OFF
            </div>
          </div>
          
          <div class="accommodation-detail-page__hero-content">
            <h1 class="accommodation-detail-page__title">{{ accommodation.title }}</h1>
            
            <div class="accommodation-detail-page__meta">
              <div v-if="accommodation.location" class="accommodation-detail-page__location">
                <Icon name="heroicons:map-pin" />
                <span>{{ accommodation.location }}</span>
              </div>
              
              <div v-if="accommodation.rating" class="accommodation-detail-page__rating">
                <Icon name="heroicons:star-solid" />
                <span>{{ accommodation.rating }}</span>
                <span v-if="accommodation.reviewsCount">({{ accommodation.reviewsCount }})</span>
              </div>
              
              <!-- Schedule Info -->
              <div v-if="accommodation.check_in_time || accommodation.check_out_time" class="accommodation-detail-page__schedule">
                <div v-if="accommodation.check_in_time" class="accommodation-detail-page__schedule-item">
                  <Icon name="heroicons:arrow-right-start-on-rectangle" />
                  <span>{{ t('accommodation.checkIn') }}: {{ accommodation.check_in_time }}</span>
                </div>
                <div v-if="accommodation.check_out_time" class="accommodation-detail-page__schedule-item">
                  <Icon name="heroicons:arrow-right-end-on-rectangle" />
                  <span>{{ t('accommodation.checkOut') }}: {{ accommodation.check_out_time }}</span>
                </div>
              </div>
            </div>
            
            <!-- Pricing Psychology Component -->
            <PricingPsychology 
              v-if="price > 0"
              :product-id="accommodation?.uuid || accommodation?.id || ''"
              :pricing-data="pricingData"
              :show-tips="true"
            />
            
            <button v-if="price > 0" class="accommodation-detail-page__cta" @click="scrollToBooking">Reservar agora</button>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="accommodation-detail-page__main">
          <div class="accommodation-detail-page__info">
            <!-- Description -->
            <div class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.description') }}</h2>
              <!-- If HTML, render sanitized HTML -->
              <div v-if="descIsHtml" v-html="safeHtml" class="accommodation-detail-page__description-html"></div>
              <!-- Otherwise, render plain text with line breaks -->
              <p v-else class="accommodation-detail-page__description-text">{{ rawDesc }}</p>
            </div>
            
            <!-- Details -->
            <div class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.details') }}</h2>
              <div class="accommodation-detail-page__details-grid">
                <div v-if="accommodationDetails?.duration" class="accommodation-detail-page__detail-item">
                  <Icon name="heroicons:clock" />
                  <div>
                    <h3>{{ t('accommodation.duration') }}</h3>
                    <p>{{ accommodationDetails.duration }}</p>
                  </div>
                </div>
                
                <div v-if="formattedCapacity && formattedCapacity !== '—'" class="accommodation-detail-page__detail-item">
                  <Icon name="heroicons:users" />
                  <div>
                    <h3>{{ t('accommodation.capacity') }}</h3>
                    <p>{{ formattedCapacity }}</p>
                  </div>
                </div>
                
                <div v-if="accommodationDetails?.minNights" class="accommodation-detail-page__detail-item">
                  <Icon name="heroicons:calendar" />
                  <div>
                    <h3>{{ t('accommodation.minNights') }}</h3>
                    <p>{{ accommodationDetails?.minNights }} {{ t('common.nights') }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Important Information -->
            <div class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.importantInfo') }}</h2>
              <div class="accommodation-detail-page__info-grid">
                <div v-if="accommodation.meeting_point" class="accommodation-detail-page__info-item">
                  <Icon name="heroicons:map-pin" />
                  <div>
                    <h3>{{ t('accommodation.meetingPoint') }}</h3>
                    <p>{{ accommodation.meeting_point }}</p>
                  </div>
                </div>
                
                <div v-if="accommodation.cancellation_policy" class="accommodation-detail-page__info-item">
                  <Icon name="heroicons:shield-check" />
                  <div>
                    <h3>{{ t('accommodation.cancellationPolicy') }}</h3>
                    <p>{{ accommodation.cancellation_policy }}</p>
                  </div>
                </div>
                
                <div v-if="accommodation.difficulty_level" class="accommodation-detail-page__info-item">
                  <Icon name="heroicons:chart-bar" />
                  <div>
                    <h3>{{ t('accommodation.difficultyLevel') }}</h3>
                    <p>{{ accommodation.difficulty_level }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Includes -->
            <div v-if="accommodation.includes && accommodation.includes.length > 0" class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.includes') }}</h2>
              <ul class="accommodation-detail-page__includes">
                <li v-for="item in accommodation.includes" :key="item">
                  <Icon name="heroicons:check" />
                  {{ item }}
                </li>
              </ul>
            </div>
            
            <!-- Excludes -->
            <div v-if="accommodation.excludes && accommodation.excludes.length > 0" class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.excludes') }}</h2>
              <ul class="accommodation-detail-page__excludes">
                <li v-for="item in accommodation.excludes" :key="item">
                  <Icon name="heroicons:x-mark" />
                  {{ item }}
                </li>
              </ul>
            </div>
            
            <!-- Itinerary -->
            <div v-if="accommodation.itinerary && accommodation.itinerary.length > 0" class="accommodation-detail-page__section">
              <h2>{{ t('accommodation.itinerary') }}</h2>
              <ol class="accommodation-detail-page__itinerary">
                <li v-for="(step, index) in accommodation.itinerary" :key="index">
                  <span class="accommodation-detail-page__step-number">{{ index + 1 }}</span>
                  {{ step }}
                </li>
              </ol>
            </div>
          </div>
          
        <!-- Booking Sidebar -->
          <div class="accommodation-detail-page__booking">
            <div class="accommodation-detail-page__booking-card" id="booking">
              <h3>{{ t('accommodation.bookNow') }}</h3>
              
              <!-- Social Proof -->
              <SocialProof 
                :product-id="accommodation?.uuid || accommodation?.id || ''" 
                product-type="accommodation"
                :location="accommodation?.location"
              />
              
              <!-- Calendar -->
              <div class="accommodation-detail-page__calendar">
                <CalendarAvailability
                  mode="stay"
                  :min-nights="accommodationDetails?.minNights"
                  :max-nights="accommodationDetails?.maxNights"
                  :allow-range="accommodationDetails?.allowRange"
                  :availability="availability"
                  :loading="availabilityLoading"
                  :error="availabilityError"
                  :selected-date="selectedDate"
                  :selected-range="selectedRange"
                  :initial-month="{ month: currentMonth.getMonth() + 1, year: currentMonth.getFullYear() }"
                  :product-id="accommodation?.uuid || accommodation?.id || ''"
                  :adults="participants.adults"
                  :children="participants.children"
                  :base-price="(accommodation as any)?.price || (accommodation as any)?.current_price || 0"
                  @date-selected="handleDateSelected"
                  @range-selected="handleRangeSelected"
                  @month-changed="handleMonthChanged"
                  @retry="handleAvailabilityRetry"
                />
              </div>
              
              <!-- Selected Date/Range Indicator -->
              <div v-if="selectedDate || selectedRange" class="accommodation-detail-page__selected-dates">
                <h4>Datas Selecionadas</h4>
                <div class="accommodation-detail-page__date-info">
                  <div v-if="selectedDate" class="accommodation-detail-page__date-item">
                    <Icon name="heroicons:calendar-days" />
                    <span>{{ formatDate(selectedDate) }}</span>
                  </div>
                  <div v-if="selectedRange" class="accommodation-detail-page__date-item">
                    <Icon name="heroicons:calendar-days" />
                    <span>{{ formatDate(selectedRange.from) }} - {{ formatDate(selectedRange.to) }}</span>
                    <span class="accommodation-detail-page__nights">({{ selectedRange.nights }} {{ t('common.nights') }})</span>
                  </div>
                </div>
              </div>
              
              <!-- Participants -->
              <div class="accommodation-detail-page__participants">
                <h4>{{ t('accommodation.participants') }}</h4>
                <div class="accommodation-detail-page__participant-controls">
                  <div class="accommodation-detail-page__participant-group">
                    <label>{{ t('common.adults') }}</label>
                    <div class="accommodation-detail-page__counter">
                      <button @click="decreaseAdults" :disabled="participants.adults <= productRules.minAdults">-</button>
                      <span>{{ participants.adults }}</span>
                      <button @click="increaseAdults" :disabled="!canIncreaseAdults">+</button>
                    </div>
                  </div>
                  
                  <div class="accommodation-detail-page__participant-group">
                    <label>{{ t('common.children') }}</label>
                    <div class="accommodation-detail-page__counter">
                      <button @click="decreaseChildren" :disabled="participants.children <= 0">-</button>
                      <span>{{ participants.children }}</span>
                      <button @click="increaseChildren" :disabled="!canIncreaseChildren">+</button>
                    </div>
                  </div>
                  
                  <!-- Barra de progresso visual -->
                  <div v-if="accommodation" class="accommodation-detail-page__participant-progress">
                    <div class="accommodation-detail-page__progress-bar">
                      <div 
                        class="accommodation-detail-page__progress-fill"
                        :style="{ width: `${(totalParticipants / productRules.maxParticipants) * 100}%` }"
                      ></div>
                    </div>
                    <div class="accommodation-detail-page__progress-text">
                      {{ totalParticipants }} / {{ productRules.maxParticipants }} participantes
                    </div>
                  </div>
                  
      <!-- Feedback de validação em tempo real -->
      <div 
        v-if="participantValidation.message && accommodation" 
        class="accommodation-detail-page__participant-feedback"
        :class="`accommodation-detail-page__participant-feedback--${participantValidation.type}`"
      >
        <Icon 
          :name="participantValidation.type === 'error' ? 'heroicons:exclamation-triangle' : 
                 participantValidation.type === 'warning' ? 'heroicons:exclamation-circle' : 
                 'heroicons:information-circle'" 
        />
        <span>{{ participantValidation.message }}</span>
      </div>
                  
                  <!-- Indicador de limite (fallback) -->
                  <div v-else-if="productRules.maxParticipants < 10" class="accommodation-detail-page__participant-info">
                    <Icon name="heroicons:information-circle" />
                    <span>Máximo {{ productRules.maxParticipants }} participantes</span>
                  </div>
                  
                  <!-- Link para grupos grandes -->
                  <div v-if="totalParticipants >= productRules.maxParticipants * 0.8" class="accommodation-detail-page__large-group">
                    <div class="accommodation-detail-page__large-group-content">
                      <Icon name="heroicons:user-group" class="accommodation-detail-page__large-group-icon" />
                      <div class="accommodation-detail-page__large-group-text">
                        <h5>Grupo grande?</h5>
                        <p>Para grupos maiores que {{ productRules.maxParticipants }} pessoas, entre em contato via WhatsApp para condições especiais e descontos.</p>
                      </div>
                    </div>
                    <div class="accommodation-detail-page__whatsapp-buttons">
                      <a 
                        href="https://wa.me/5522997892414?text=Olá! Gostaria de informações sobre reservas para grupos grandes para o tour: {{ accommodation?.title }}"
                        class="accommodation-detail-page__whatsapp-button"
                        target="_blank"
                        rel="noopener"
                        title="WhatsApp: +55 22 99789-2414"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>WhatsApp 1</span>
                      </a>
                      <a 
                        href="https://wa.me/5522998677244?text=Olá! Gostaria de informações sobre reservas para grupos grandes para o tour: {{ accommodation?.title }}"
                        class="accommodation-detail-page__whatsapp-button"
                        target="_blank"
                        rel="noopener"
                        title="WhatsApp: +55 22 99867-7244"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>WhatsApp 2</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Seleção de Idades das Crianças -->
              <ChildrenAgeSelector
                :children-count="participants.children"
                :base-price="(accommodation as any)?.price || (accommodation as any)?.current_price || 0"
                :product-id="accommodation?.uuid || accommodation?.id || ''"
                :saved-ages="savedProgress.childrenAges"
                @update-children-ages="handleChildrenAgesUpdate"
              />
              
              <!-- Sugestões Inteligentes -->
              <ParticipantSuggestions
                :current-adults="participants.adults"
                :current-children="participants.children"
                :max-participants="productRules.maxParticipants"
                :base-price="(accommodation as any)?.price || (accommodation as any)?.current_price || 0"
                tour-type="accommodation"
                @apply-suggestion="handleApplySuggestion"
              />
              
              <!-- Auto-save Status -->
              <div class="accommodation-detail-page__auto-save-status">
                <div class="accommodation-detail-page__save-indicator" :class="`accommodation-detail-page__save-indicator--${saveStatus.color}`">
                  <Icon :name="saveStatus.icon" />
                  <span>{{ saveStatus.text }}</span>
                </div>
                <button 
                  v-if="saveStatus.color === 'orange'"
                  @click="clearProgress"
                  class="accommodation-detail-page__clear-save"
                  title="Limpar progresso salvo"
                >
                  <Icon name="heroicons:trash" />
                </button>
              </div>
              
              <!-- Price Summary -->
              <div class="accommodation-detail-page__price-summary">
                <PriceSummary
                  key="price-summary"
                  mode="accommodation"
                  :breakdown="pricingBreakdown"
                  :loading="pricingLoading"
                  :error="pricingError"
                  :can-reserve="canReserve"
                  @reserve="handleReserve"
                  @retry="loadPricing"
                />
              </div>
              
              <!-- Price Comparison -->
              <div class="accommodation-detail-page__price-comparison">
                <PriceComparison
                  :comparison="priceComparison"
                  :current-price="pricingBreakdown?.total || 0"
                  :original-price="comparisonData?.originalPrice"
                  :show-timer="priceComparison?.urgency === 'high'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="showLightbox" class="accommodation-detail-page__lightbox" @click="closeLightbox">
        <div class="accommodation-detail-page__lightbox-content" @click.stop>
          <button @click="closeLightbox" class="accommodation-detail-page__lightbox-close">
            <Icon name="heroicons:x-mark" />
          </button>
          
          <button @click="prevImage" class="accommodation-detail-page__lightbox-nav accommodation-detail-page__lightbox-prev">
            <Icon name="heroicons:chevron-left" />
          </button>
          
          <div class="accommodation-detail-page__lightbox-image">
            <img :src="selectedImage" :alt="accommodation?.title || ''" />
          </div>
          
          <button @click="nextImage" class="accommodation-detail-page__lightbox-nav accommodation-detail-page__lightbox-next">
            <Icon name="heroicons:chevron-right" />
          </button>
          
          <div class="accommodation-detail-page__lightbox-counter">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </div>
          
          <div class="accommodation-detail-page__lightbox-thumbnails">
            <button
              v-for="(image, index) in images"
              :key="index"
              @click="selectImage(index)"
              :class="['accommodation-detail-page__lightbox-thumbnail', { active: index === currentImageIndex }]"
            >
              <img :src="image" :alt="`${accommodation?.title || ''} - Imagem ${index + 1}`" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Modal de Confirmação de Reserva -->
    <ClientOnly>
      <BookingConfirmationModal
        :is-open="isModalOpen"
        :booking-data="bookingData"
        :is-processing="isProcessing"
        @close="closeConfirmationModal"
        @confirm="handleConfirmBooking"
      />
    </ClientOnly>
    
    <!-- Trust Signals -->
    <div v-if="accommodation" class="accommodation-detail-page__trust">
      <TrustSignals />
    </div>

    <!-- Reviews Section -->
    <div v-if="accommodation" class="accommodation-detail-page__reviews">
      <ClientOnly>
        <ReviewsDisplay :product-id="accommodation?.uuid || accommodation?.id || ''" product-type="accommodation" />
      </ClientOnly>
    </div>
  </div>

  <!-- Exit Intent Popup -->
  <ExitIntentPopup
    :show="showExitPopup"
    :offer="exitOffer"
    @accept="acceptOffer"
    @decline="declineOffer"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import type { FeaturedItem } from '@/composables/useFeatured'
import type { TourDetails } from '@/composables/useAvailability'
import type { PricingBreakdown } from '@/composables/usePricing'
import { useProductDetails } from '@/composables/useProductDetails'
import { useAutoSave } from '@/composables/useAutoSave'
import { useLazyLoading } from '@/composables/useLazyLoading'
import { useBookingConfirmation } from '@/composables/useBookingConfirmation'
import { usePriceComparison } from '@/composables/usePriceComparison'
import { useExitIntent } from '@/composables/useExitIntent'
import { useUnifiedProducts } from '@/composables/useUnifiedProducts'
import { isProbablyHtml } from '@/utils/isHtml'
import ParticipantSuggestions from '@/components/ParticipantSuggestions.vue'
import ChildrenAgeSelector from '@/components/ChildrenAgeSelector.vue'
import BookingConfirmationModal from '@/components/BookingConfirmationModal.vue'
import PriceComparison from '@/components/PriceComparison.vue'
import UrgencyBanner from '@/components/UrgencyBanner.vue'
import SocialProof from '@/components/SocialProof.vue'
import TrustSignals from '@/components/TrustSignals.vue'
import PricingPsychology from '@/components/PricingPsychology.vue'
import ExitIntentPopup from '@/components/ExitIntentPopup.vue'

const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string

const { getFeaturedTours, getFeaturedStays, normalizeTourData, normalizeStayData } = useFeatured()
const { getTourDetails, getTourAvailability } = useAvailability()
const { getTourPricing } = usePricing()
const { normalizeTourDetails, formatPrice } = useProductDetails()

// Estado reativo - declarar primeiro
const accommodation = ref<FeaturedItem | null>(null)
const accommodationDetails = ref<TourDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isClient = ref(false)

// Exit Intent
const { 
  showExitPopup, 
  exitOffer, 
  acceptOffer, 
  declineOffer 
} = useExitIntent(accommodation.value?.id || '')

// Lógica de renderização condicional para descrição
const rawDesc = computed(() => accommodation.value?.description ?? '')
const descIsHtml = computed(() => isProbablyHtml(rawDesc.value))

// Função de sanitização segura
const sanitizeHtml = async (html: string) => {
  if (typeof window === 'undefined') return html
  
  try {
    // Importar DOMPurify dinamicamente no cliente
    const DOMPurify = (await import('dompurify')).default
    const config = {
      ADD_TAGS: ['h1','h2','h3','h4','h5','h6','img','figure','figcaption','table','thead','tbody','tfoot','tr','th','td','blockquote','pre','code','span','u','s'],
      ADD_ATTR: ['style','class','align','target','rel','id','width','height','loading'],
      FORBID_TAGS: ['script','iframe','object','embed','form','input','button','audio','video'],
      FORBID_ATTR: ['onerror','onload','onclick','onmouseover'],
      ALLOW_UNKNOWN_PROTOCOLS: false
    }
    
    const cleaned = DOMPurify.sanitize(html, config)
    
    // Post-processar links para segurança
    const wrapper = document.createElement('div')
    wrapper.innerHTML = cleaned as string
    wrapper.querySelectorAll('a[href]').forEach(a => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })
    
    return wrapper.innerHTML
  } catch (error) {
    console.warn('Erro ao sanitizar HTML:', error)
    return html
  }
}

const safeHtml = ref<string | null>(null)

// Sanitizar HTML quando necessário
watch([descIsHtml, rawDesc], async () => {
  if (descIsHtml.value && rawDesc.value) {
    safeHtml.value = await sanitizeHtml(rawDesc.value)
  } else {
    safeHtml.value = null
  }
}, { immediate: true })

// Galeria de Imagens
const currentImageIndex = ref(0)
const showLightbox = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)

// Computed properties para imagens
const images = computed<string[]>(() => {
  // Tentar encontrar todas as imagens disponíveis
  let allImages: string[] = []
  
  // 1. Verificar array images (formato da API StarHub)
  if (accommodation.value?.images && Array.isArray(accommodation.value.images)) {
    allImages = accommodation.value.images.map((img: any) => {
      if (typeof img === 'string') {
        return img
      } else if (typeof img === 'object' && img.url) {
        return img.url
      }
      return null
    }).filter((url: string | null): url is string => url !== null)
  }
  
  // 2. Verificar outros campos de imagem
  const additionalFields = ['gallery', 'photos', 'pictures', 'image_urls', 'photo_urls', 'media', 'media_urls', 'attachments', 'files']
  additionalFields.forEach(field => {
    const fieldValue = (accommodation.value as any)?.[field]
    if (fieldValue && Array.isArray(fieldValue)) {
      const fieldImages = fieldValue.map((img: any) => {
        if (typeof img === 'string') {
          return img
        } else if (typeof img === 'object' && img.url) {
          return img.url
        }
        return null
      }).filter((url: string | null): url is string => url !== null)
      
      allImages = [...allImages, ...fieldImages]
    }
  })
  
  // 3. Adicionar main_image se não estiver na lista
  if (accommodation.value?.main_image && !allImages.includes(accommodation.value.main_image)) {
    allImages.unshift(accommodation.value.main_image)
  }
  
  // Remover duplicatas
  const uniqueImages = [...new Set(allImages)]
  
  return uniqueImages.length > 0 ? uniqueImages : []
})

const selectedImage = computed(() => {
  if (images.value.length > 0) {
    return images.value[currentImageIndex.value]
  }
  return ''
})

// Computed properties para preços baseado na documentação da API
const price = computed<number>(() => {
  // Preço atual/promocional (prioridade)
  const tourData = accommodation.value as any
  return Number(tourData?.current_price ?? tourData?.price ?? 0)
})

const originalPrice = computed<number | null>(() => {
  // Preço original (sem promoção)
  const tourData = accommodation.value as any
  const original = Number(tourData?.price_original ?? tourData?.priceOriginal ?? 0)
  return original > 0 ? original : null
})

const hasPromo = computed(() => {
  const tourData = accommodation.value as any
  // Verificar se tem promoção baseado nos campos da API
  return tourData?.has_promotion || 
         (originalPrice.value && originalPrice.value > price.value) ||
         tourData?.discount_percentage > 0
})

const discount = computed(() => {
  const tourData = accommodation.value as any
  // Usar discount_percentage da API se disponível, senão calcular
  if (tourData?.discount_percentage) {
    return tourData.discount_percentage
  }
  if (hasPromo.value && originalPrice.value) {
    return Math.round((1 - (price.value / originalPrice.value)) * 100)
  }
  return 0
})

// Pricing Data for Psychology Component
const pricingData = computed(() => ({
  originalPrice: originalPrice.value || price.value,
  currentPrice: price.value,
  discount: discount.value,
  currency: 'BRL',
  unit: 'per_person' as const,
  // Only include real, verifiable comparison data
  comparisonPrices: originalPrice.value && originalPrice.value > price.value ? {
    lastMonth: originalPrice.value // Real previous price from API
  } : undefined
}))

// Funções utilitárias
const currencyBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Utils para formatar capacidade
function isFiniteNumber(n: any) {
  return typeof n === 'number' && Number.isFinite(n);
}

function formatRangeObj(r: any): string {
  const min = r?.min;
  const max = r?.max;
  if (isFiniteNumber(min) && isFiniteNumber(max)) {
    return min === max ? `${min}` : `${min}–${max}`;
  }
  return '';
}

function normalizeCapacity(val: any): string {
  if (val == null || val === '') return '—';

  // número simples
  if (typeof val === 'number') return `${val} pessoas`;

  // objeto {min,max}
  if (typeof val === 'object' && !Array.isArray(val)) {
    const core = formatRangeObj(val);
    return core ? `${core} pessoas` : '—';
  }

  // array de ranges/valores
  if (Array.isArray(val)) {
    const parts = val
      .map(v => normalizeCapacity(v).replace(/\s+pessoas$/i, ''))
      .filter(Boolean);
    const core = [...new Set(parts)].join(' / ');
    return core ? `${core} pessoas` : '—';
  }

  // string
  if (typeof val === 'string') {
    const s = val.trim();

    // pode vir com dois jsons separados por " - "
    const chunks = s.includes(' - ') ? s.split(' - ') : [s];
    const parts: string[] = [];

    for (const ch of chunks) {
      const t = ch.trim();

      // tenta JSON
      let parsed: any = null;
      if (t.startsWith('{') || t.startsWith('[')) {
        try {
          parsed = JSON.parse(t);
        } catch { /* segue */ }
      }
      if (parsed) {
        parts.push(normalizeCapacity(parsed).replace(/\s+pessoas$/i, ''));
        continue;
      }

      // tenta "1-4" ou "1–4"
      const m = t.match(/(\d+)\s*[–-]\s*(\d+)/);
      if (m) {
        parts.push(`${m[1]}–${m[2]}`);
        continue;
      }

      // número puro em string
      const onlyNum = t.match(/^\d+$/);
      if (onlyNum) {
        parts.push(t);
        continue;
      }
    }

    const core = parts.filter(Boolean).join(' / ');
    // se conseguiu normalizar, anexa "pessoas"; se não, devolve como veio
    return core ? `${core} pessoas` : s;
  }

  // fallback final
  return String(val);
}

const selectImage = (index: number) => {
  currentImageIndex.value = index
}

const scrollToBooking = () => {
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Função para abrir modal de confirmação
const openBookingConfirmation = () => {
  if (!selectedDate.value || !accommodation.value || !pricingBreakdown.value) {
    // Mostrar erro se dados não estiverem completos
    console.warn('Dados incompletos para confirmação de reserva')
    return
  }

  const bookingData = prepareBookingData(
    accommodation.value,
    selectedDate.value,
    participants.value,
    pricingBreakdown.value,
    savedProgress.childrenAges
  )

  openConfirmationModal(bookingData)
}

// Função para confirmar reserva
const handleConfirmBooking = async (data: any) => {
  const result = await confirmBooking(data)
  
  if (result?.success) {
    // Limpar dados salvos após confirmação bem-sucedida
    clearProgress()
    
    // Redirecionar ou mostrar mensagem de sucesso
  } else {
    // Mostrar erro
    console.error('Erro ao confirmar reserva:', result?.message || 'Erro desconhecido')
  }
}

// Função para carregar dados de comparação de preços
const loadPriceComparison = async () => {
  if (!accommodation.value || !pricingBreakdown.value) return
  
  try {
    const totalParticipants = participants.value.adults + participants.value.children
    const currentPrice = pricingBreakdown.value.total
    
    const data = await generateComparisonData(
      accommodation.value.id,
      currentPrice,
      totalParticipants,
      selectedDate.value || undefined
    )
    
    comparisonData.value = data
  } catch (error) {
    console.error('Erro ao carregar comparação de preços:', error)
  }
}

// Computed property para capacidade formatada
const formattedCapacity = computed(() => {
  // Usar type assertion para acessar propriedades que podem existir na resposta da API
  const tourData = accommodation.value as any
  const raw = tourData?.capacity ?? tourData?.details?.capacity ?? tourData?.maxParticipants ?? tourData?.minParticipants ?? tourData?.max_participants ?? tourData?.min_participants
  return normalizeCapacity(raw)
})

const openLightbox = () => {
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
}

const nextImage = () => {
  if (images.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  }
}

const prevImage = () => {
  if (images.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
  }
}

// Funções para textos alternativos acessíveis
const getMainImageAltText = (): string => {
  if (!accommodation.value) return 'Imagem do tour'
  
  const tourTitle = accommodation.value.title || 'Tour'
  const location = accommodation.value.location ? ` em ${accommodation.value.location}` : ''
  const currentImage = currentImageIndex.value + 1
  const totalImages = images.value.length
  
  if (totalImages > 1) {
    return `${tourTitle}${location} - Imagem ${currentImage} de ${totalImages}`
  }
  
  return `${tourTitle}${location} - Imagem principal`
}

const getThumbnailAltText = (index: number): string => {
  if (!accommodation.value) return `Miniatura ${index + 1}`
  
  const tourTitle = accommodation.value.title || 'Tour'
  const location = accommodation.value.location ? ` em ${accommodation.value.location}` : ''
  
  return `${tourTitle}${location} - Miniatura ${index + 1}`
}

// Funcionalidades de touch
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  if (images.value.length <= 1) return
  
  touchEndX.value = e.changedTouches[0].clientX
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - próxima imagem
      nextImage()
    } else {
      // Swipe right - imagem anterior
      prevImage()
    }
  }
}

// Resetar índice quando tour mudar
watch(accommodation, () => {
  currentImageIndex.value = 0
})

// Disponibilidade
const availability = ref<any[]>([])
const currentMonth = ref(new Date())
const availabilityLoading = ref(false)
const availabilityError = ref<string | null>(null)

// Participantes
const participants = ref({
  adults: 1,
  children: 0
})

// Estados de validação em tempo real
const participantValidation = ref({
  isAtLimit: false,
  isAtMinimum: false,
  message: '',
  type: 'info' // 'info', 'warning', 'error'
})

// Seleção de data
const selectedDate = ref<string | null>(null)
const selectedRange = ref<{ from: string; to: string; nights: number } | null>(null)

// Preços
const pricingBreakdown = ref<PricingBreakdown | null>(null)
const pricingLoading = ref(false)
const pricingError = ref<string | null>(null)

// Carregar tour
    const loadAccommodation = async () => {
      try {
        loading.value = true
        error.value = null

        
        // Usar endpoint específico para buscar accommodation com todas as imagens
        let accommodationData = null
        
        try {
          // Estratégia 1: Buscar accommodation específico com endpoint dedicado
          const response = await $fetch(`/api/accommodations/${slug}`) as any
          accommodationData = response.data
        } catch (specificError) {
          console.warn('⚠️ Falha no endpoint específico, tentando busca geral:', specificError)
          
          // Estratégia 2: Buscar na lista geral como fallback
          try {
            const { getAccommodationsUnified } = useUnifiedProducts()
            const unifiedResult = await getAccommodationsUnified({ limit: 100 })
            accommodationData = unifiedResult.data.find((p: any) => p.slug === slug || p.uuid === slug)
          } catch (unifiedError) {
            console.warn('⚠️ Falha na busca geral:', unifiedError)
          }
        }

        if (!accommodationData) {
          error.value = 'Não foi possível carregar os dados da acomodação. Isso pode ser devido a problemas temporários com o servidor. Tente recarregar a página em alguns instantes.'
          return
        }

        // Os dados já vêm completos da rota unificada
        const accommodationDetailsData = accommodationData
        const accommodationUuid = accommodationData.uuid
    
    // Normalizar com useProductDetails para garantir campos corretos
    const { normalizeStayDetails } = useProductDetails()
    const normalizedAccommodation = normalizeStayDetails(accommodationDetailsData)
    
    accommodation.value = normalizedAccommodation
    accommodationDetails.value = normalizedAccommodation
    
    // Carregar detalhes do tour (disponibilidade, etc.)
    // Usar UUID real do tour encontrado (já declarado acima)
    if (accommodationUuid && accommodation.value) {
      // Para páginas de acomodações, sempre permitir range selection
      const isAccommodation = true // Sempre true para páginas de acomodações
      
      // Extrair minNights e maxNights da rota unificada
      // A rota unificada retorna os campos como min_nights e max_nights
      const apiMinNights = (accommodationDetailsData as any)?.min_nights ||
                          (accommodationDetailsData as any)?.minNights ||
                          accommodation.value.minNights || 
                          (accommodation.value as any)?.min_nights ||
                          (accommodation.value as any)?.policies?.minNights ||
                          (accommodation.value as any)?.policies?.min_nights
      
      const apiMaxNights = (accommodationDetailsData as any)?.max_nights ||
                          (accommodationDetailsData as any)?.maxNights ||
                          accommodation.value.maxNights || 
                          (accommodation.value as any)?.max_nights ||
                          (accommodation.value as any)?.policies?.maxNights ||
                          (accommodation.value as any)?.policies?.max_nights
      
      
      // Tentar extrair informações de noites das políticas se não estiverem disponíveis diretamente
      let extractedMinNights = apiMinNights
      let extractedMaxNights = apiMaxNights
      
      if (!extractedMinNights || !extractedMaxNights) {
        const policiesText = (accommodation.value as any)?.policies || ''
        
        // Procurar por padrões como "mínimo X noites", "mínimo X dias", etc.
        const minNightsMatch = policiesText.match(/(?:mínimo|min)\s*(\d+)\s*(?:noites?|dias?)/i)
        if (minNightsMatch) {
          extractedMinNights = parseInt(minNightsMatch[1])
        }
        
        // Procurar por padrões como "máximo X noites", "máximo X dias", etc.
        const maxNightsMatch = policiesText.match(/(?:máximo|max)\s*(\d+)\s*(?:noites?|dias?)/i)
        if (maxNightsMatch) {
          extractedMaxNights = parseInt(maxNightsMatch[1])
        }
        
        // Debug: extração das políticas (removido após confirmação)
      }
      
      // Usar dados da API se disponíveis, senão usar fallbacks seguros
      const minNights = extractedMinNights && extractedMinNights > 0 ? extractedMinNights : 1
      const maxNights = extractedMaxNights && extractedMaxNights > 0 ? extractedMaxNights : 30
      
      // Validar que minNights não seja maior que maxNights
      const finalMinNights = Math.min(minNights, maxNights)
      const finalMaxNights = Math.max(minNights, maxNights)
      
      // Debug: configuração final (removido após confirmação)
      
      accommodationDetails.value = {
        id: slug,
        title: accommodation.value.title,
        description: accommodation.value.description || 'Descrição não disponível',
        duration: accommodation.value.duration || '',
        capacity: accommodation.value.capacity ? {
          min: accommodation.value.capacity,
          max: accommodation.value.capacity
        } : {
          min: 1,
          max: 10
        },
        minNights: finalMinNights,
        maxNights: finalMaxNights,
        allowRange: isAccommodation,
        includes: accommodation.value.includes || [],
        excludes: accommodation.value.excludes || [],
        itinerary: accommodation.value.itinerary || [],
        policies: []
      }
    } else {
      // Fallback se accommodation.value for null
      accommodationDetails.value = {
        id: slug,
        title: 'Tour não encontrado',
        description: 'Descrição não disponível',
        duration: '',
        capacity: {
          min: 1,
          max: 10
        },
        minNights: 1,
        maxNights: 1,
        allowRange: false,
        includes: [],
        excludes: [],
        itinerary: [],
        policies: []
      }
    }
    
    // Carregar disponibilidade inicial
    await loadAvailability()
    
    // Aplicar datas salvas após carregar disponibilidade
    applySavedDates()
    
  } catch (err: any) {
    console.error('❌ Erro crítico ao carregar accommodation:', err)
    error.value = 'Ocorreu um erro inesperado ao carregar os dados da acomodação. Por favor, tente recarregar a página ou entre em contato com o suporte se o problema persistir.'
  } finally {
    loading.value = false
  }
}

// Carregar disponibilidade
const loadAvailability = async () => {
  try {
    availabilityLoading.value = true
    availabilityError.value = null
    
    const month = currentMonth.value.getMonth() + 1
    const year = currentMonth.value.getFullYear()
    
    // Usar UUID real do tour para disponibilidade
    const tourId = accommodation.value?.uuid || accommodation.value?.id
    if (!tourId) {
      throw new Error('ID do tour não encontrado')
    }
    
    const availabilityData = await getTourAvailability(tourId, { 
      year,
      month,
      adults: participants.value.adults,
      children: participants.value.children
    })
    availability.value = availabilityData
  } catch (err: any) {
    console.warn('Could not load availability:', err)
    availabilityError.value = 'Não foi possível carregar a disponibilidade. Tente novamente mais tarde.'
    availability.value = []
  } finally {
    availabilityLoading.value = false
  }
}

// Preços base (carregados uma vez da API)
const basePricing = ref<PricingBreakdown | null>(null)

// Carregar preços base (apenas quando data muda)
const loadPricing = async () => {
  if (!selectedDate.value && !selectedRange.value) return
  
  try {
    pricingLoading.value = true
    pricingError.value = null
    
    // Usar UUID real do tour para preços
    const tourUuid = accommodation.value?.uuid || accommodation.value?.id || slug
    
    const pricingRequest: any = {
      id: tourUuid,
      adults: 1, // Sempre carregar base com 1 adulto
      children: 0
    }
    
    if (selectedDate.value) {
      pricingRequest.date = selectedDate.value
    } else if (selectedRange.value) {
      pricingRequest.from = selectedRange.value.from
      pricingRequest.to = selectedRange.value.to
    }
    
    const breakdown = await getTourPricing(pricingRequest)
    basePricing.value = breakdown
    updatePricingBreakdown() // Atualizar com participantes atuais
    
  } catch (err: any) {
    pricingError.value = err.message || 'Erro ao carregar preços'
    console.error('Error loading pricing:', err)
  } finally {
    pricingLoading.value = false
  }
}

// Atualizar preços baseado nos participantes atuais (sem recarregar da API)
const updatePricingBreakdown = () => {
  if (!basePricing.value) return
  
  const { adults, children } = participants.value
  
  // Calcular preços baseado nos participantes
  const adultsTotal = adults * (basePricing.value.adults?.pricePerPerson || 0)
  const childrenTotal = children * (basePricing.value.children?.pricePerPerson || 0)
  const subtotal = adultsTotal + childrenTotal
  
  // Manter taxas e descontos proporcionais
  const originalSubtotal = basePricing.value.adults?.total || 0
  const ratio = originalSubtotal > 0 ? subtotal / originalSubtotal : 1
  
  pricingBreakdown.value = {
    ...basePricing.value,
    adults: {
      count: adults,
      pricePerPerson: basePricing.value.adults?.pricePerPerson || 0,
      total: adultsTotal
    },
    children: {
      count: children,
      pricePerPerson: basePricing.value.children?.pricePerPerson || 0,
      total: childrenTotal
    },
    subtotal,
    taxes: (basePricing.value.taxes || 0) * ratio,
    fees: (basePricing.value.fees || 0) * ratio,
    total: subtotal + ((basePricing.value.taxes || 0) * ratio) + ((basePricing.value.fees || 0) * ratio)
  }
}

// Atualizar preços considerando as idades específicas das crianças
const updatePricingBreakdownWithChildrenAges = async (childrenAges: any[]) => {
  if (!basePricing.value || !accommodation.value) return
  
  const { adults, children } = participants.value
  
  // Calcular preços dos adultos
  const adultsTotal = adults * (basePricing.value.adults?.pricePerPerson || 0)
  
  // Calcular preços das crianças baseado nas idades específicas
  let childrenTotal = 0
  if (childrenAges && childrenAges.length > 0) {
    try {
      // Importar dinamicamente o composable de preços das crianças
      const { useChildrenPricing } = await import('@/composables/useChildrenPricing')
      const { calculateTotalChildrenPrice } = useChildrenPricing()
      
      // Calcular preço total das crianças baseado nas idades
      const basePrice = (accommodation.value as any)?.price || (accommodation.value as any)?.current_price || 0
      
      // Converter array de objetos para array de strings
      const ageStrings = childrenAges.map(child => child.age)
      childrenTotal = calculateTotalChildrenPrice(basePrice, ageStrings, accommodation.value.id)
    } catch (error) {
      console.error('Erro ao calcular preços das crianças:', error)
      // Fallback para preço padrão (50% do preço adulto)
      childrenTotal = children * (basePricing.value.children?.pricePerPerson || 0)
    }
  } else {
    // Se não há idades específicas, usar preço padrão
    childrenTotal = children * (basePricing.value.children?.pricePerPerson || 0)
  }
  
  const subtotal = adultsTotal + childrenTotal
  
  // Manter taxas e descontos proporcionais
  const originalSubtotal = basePricing.value.adults?.total || 0
  const ratio = originalSubtotal > 0 ? subtotal / originalSubtotal : 1
  
  // Calcular preço por pessoa das crianças
  const childrenPricePerPerson = children > 0 ? childrenTotal / children : 0
  
  pricingBreakdown.value = {
    ...basePricing.value,
    adults: {
      count: adults,
      pricePerPerson: basePricing.value.adults?.pricePerPerson || 0,
      total: adultsTotal
    },
    children: {
      count: children,
      pricePerPerson: childrenPricePerPerson,
      total: childrenTotal
    },
    subtotal,
    taxes: (basePricing.value.taxes || 0) * ratio,
    fees: (basePricing.value.fees || 0) * ratio,
    total: subtotal + ((basePricing.value.taxes || 0) * ratio) + ((basePricing.value.fees || 0) * ratio)
  }
}

// Debounced pricing loader (250ms delay)
const debouncedLoadPricing = debounce(loadPricing, 250)

// Handlers
const handleDateSelected = (date: string) => {
  selectedDate.value = date
  selectedRange.value = null
  debouncedLoadPricing()
}

const handleRangeSelected = (range: { from: string; to: string; nights: number }) => {
  selectedRange.value = range
  selectedDate.value = null
  debouncedLoadPricing()
}

const handleMonthChanged = async (month: { month: number; year: number }) => {
  currentMonth.value = new Date(month.year, month.month - 1)
  await loadAvailability()
}

const handleAvailabilityRetry = () => {
  loadAvailability()
}

const handleReserve = () => {
  // Abrir modal de confirmação em vez de reservar diretamente
  openBookingConfirmation()
}

// Função para formatar datas (local-safe)
const formatDate = (dateString: string): string => {
  // Usar função local-safe para evitar problemas de timezone
  const [year, month, day] = dateString.split('-').map(n => parseInt(n, 10))
  const date = new Date(year, month - 1, day) // month é 0-indexed
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Regras do produto para participantes
const productRules = computed(() => {
  const tourData = accommodation.value as any
  
  // Extrair maxParticipants de diferentes campos possíveis
  let maxParticipants = 10 // fallback padrão
  
  if (tourData?.max_participants) {
    maxParticipants = tourData.max_participants
  } else if (tourData?.capacity) {
    // Se capacity é um número simples
    if (typeof tourData.capacity === 'number') {
      maxParticipants = tourData.capacity
    }
    // Se capacity é um objeto {min, max}
    else if (tourData.capacity?.max) {
      maxParticipants = tourData.capacity.max
    }
    // Se capacity é uma string como "1-4"
    else if (typeof tourData.capacity === 'string') {
      const match = tourData.capacity.match(/(\d+)\s*[–-]\s*(\d+)/)
      if (match) {
        maxParticipants = parseInt(match[2])
      }
    }
  }
  
  return {
    maxParticipants,
    minAdults: 1, // Sempre pelo menos 1 adulto
    maxAdults: maxParticipants,
    maxChildren: maxParticipants
  }
})

const totalParticipants = computed(() => {
  return participants.value.adults + participants.value.children
})

const canIncreaseAdults = computed(() => {
  return totalParticipants.value < productRules.value.maxParticipants
})

const canIncreaseChildren = computed(() => {
  return totalParticipants.value < productRules.value.maxParticipants
})

// Validação em tempo real dos participantes
const validateParticipants = () => {
  // Só validar se o tour estiver carregado
  if (!accommodation.value) {
    participantValidation.value = {
      isAtLimit: false,
      isAtMinimum: false,
      message: '',
      type: 'info'
    }
    return
  }
  
  const { adults, children } = participants.value
  const total = adults + children
  const { maxParticipants, minAdults } = productRules.value
  
  // Resetar estado
  participantValidation.value = {
    isAtLimit: false,
    isAtMinimum: false,
    message: '',
    type: 'info'
  }
  
  // Verificar se atingiu o limite máximo
  if (total >= maxParticipants) {
    participantValidation.value = {
      isAtLimit: true,
      isAtMinimum: false,
      message: `Limite máximo de ${maxParticipants} participantes atingido`,
      type: 'warning'
    }
    return
  }
  
  // Verificar se está no mínimo
  if (adults < minAdults) {
    participantValidation.value = {
      isAtLimit: false,
      isAtMinimum: true,
      message: `Mínimo de ${minAdults} adulto${minAdults > 1 ? 's' : ''} necessário${minAdults > 1 ? 's' : ''}`,
      type: 'error'
    }
    return
  }
  
  // Verificar se está próximo do limite
  if (total >= maxParticipants - 1) {
    participantValidation.value = {
      isAtLimit: false,
      isAtMinimum: false,
      message: `Restam ${maxParticipants - total} vaga${maxParticipants - total > 1 ? 's' : ''}`,
      type: 'info'
    }
    return
  }
  
  // Estado normal
  participantValidation.value = {
    isAtLimit: false,
    isAtMinimum: false,
    message: `${total} de ${maxParticipants} participantes`,
    type: 'info'
  }
}

// Controles de participantes com validação
const increaseAdults = () => {
  if (canIncreaseAdults.value) {
    participants.value.adults++
    validateParticipants()
  }
}

const decreaseAdults = () => {
  if (participants.value.adults > productRules.value.minAdults) {
    participants.value.adults--
    validateParticipants()
  }
}

const increaseChildren = () => {
  if (canIncreaseChildren.value) {
    participants.value.children++
    validateParticipants()
  }
}

const decreaseChildren = () => {
  if (participants.value.children > 0) {
    participants.value.children--
    validateParticipants()
  }
}

// Função para aplicar sugestões inteligentes
const handleApplySuggestion = (suggestion: any) => {
  participants.value = {
    adults: suggestion.adults,
    children: suggestion.children
  }
  validateParticipants()
  
  // Salvar automaticamente a nova configuração
  debouncedSave({
    participants: {
      adults: suggestion.adults,
      children: suggestion.children
    }
  })
}

// Função para lidar com atualizações das idades das crianças
const handleChildrenAgesUpdate = (ages: any[]) => {
  // Salvar automaticamente as idades das crianças
  debouncedSave({
    childrenAges: ages
  })
  
  // Recalcular preços considerando as idades específicas das crianças
  updatePricingBreakdownWithChildrenAges(ages)
}

// Computed
const canReserve = computed(() => {
  return (selectedDate.value || selectedRange.value) && 
         participants.value.adults > 0 && 
         pricingBreakdown.value &&
         !pricingLoading.value &&
         !pricingError.value
})

// Comparação de preços
const priceComparison = computed(() => {
  if (!comparisonData.value || !pricingBreakdown.value) return null
  
  return calculatePriceComparison(comparisonData.value)
})


// Watchers
watch(() => participants.value, () => {
  // Atualizar preços localmente se já tiver preços base carregados
  if (basePricing.value) {
    updatePricingBreakdown()
  }
  // Validar participantes em tempo real
  validateParticipants()
}, { deep: true })

// Watcher para carregar comparação de preços quando preços mudarem
watch(() => pricingBreakdown.value, () => {
  if (pricingBreakdown.value && accommodation.value) {
    loadPriceComparison()
  }
}, { deep: true })

// Auto-save com ID específico do produto
const { 
  watchParticipants, 
  watchDates, 
  watchPricing, 
  restoreProgress, 
  getSaveStatus,
  clearProgress,
  debouncedSave
} = useAutoSave(accommodation.value?.id, slug)

// Lazy loading para imagens
const { useLazyImageGallery } = useLazyLoading()

// Modal de confirmação de reserva
const {
  isModalOpen,
  isProcessing,
  bookingData,
  openConfirmationModal,
  closeConfirmationModal,
  confirmBooking,
  prepareBookingData
} = useBookingConfirmation()

// Comparação de preços
const {
  comparisonData,
  isLoading: comparisonLoading,
  calculatePriceComparison,
  generateComparisonData
} = usePriceComparison()

// Handlers para UrgencyBanner
const handleUrgencyDismiss = () => {
}

const handleUrgentMessage = (message: string) => {
  // Aqui poderia implementar analytics ou outras ações
}

// Restaurar progresso salvo (sem tourId inicialmente)
const savedProgress = restoreProgress()

// Aplicar progresso salvo se disponível
if (savedProgress.participants) {
  participants.value = {
    adults: savedProgress.participants.adults || 1,
    children: savedProgress.participants.children || 0
  }
}

// Aplicar idades das crianças salvas se disponível
if (savedProgress.childrenAges && savedProgress.childrenAges.length > 0) {
  // As idades serão aplicadas automaticamente pelo componente ChildrenAgeSelector
  // quando ele detectar que há crianças e idades salvas
}

// Aplicar datas salvas após o tour ser carregado
const applySavedDates = () => {
  // Re-verificar progresso com o tourId atual
  const currentProgress = restoreProgress(accommodation.value?.id)
  
  if (currentProgress.selectedDate) {
    selectedDate.value = currentProgress.selectedDate
    // Recarregar preços para a data restaurada
    loadPricing()
  }

  if (currentProgress.selectedRange) {
    selectedRange.value = currentProgress.selectedRange
    // Recarregar preços para o range restaurado
    loadPricing()
  }
}

// Configurar watchers para auto-save
watchParticipants(participants)
watchDates(selectedDate, selectedRange)
watchPricing(pricingBreakdown)

// Salvar tourId quando disponível
watch(() => accommodation.value?.id, (tourId) => {
  if (tourId) {
    debouncedSave({ tourId })
  }
})

// Computed para status de salvamento
const saveStatus = computed(() => getSaveStatus())

// Lifecycle
onMounted(() => {
  isClient.value = true
  loadAccommodation()
  
  // Garantir smooth scroll para botões "Reservar agora"
  document.querySelectorAll('.accommodation-detail-page__cta, .price-summary__button')
    .forEach(btn => btn.addEventListener('click', () => {
      const el = document.querySelector('#booking')
      if(el){
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }))
})

// SEO dinâmico
const siteUrl = useRuntimeConfig().public.siteUrl

// Computed para SEO
const seoTitle = computed(() => accommodation.value?.title ?? 'Passeio')
const seoDescription = computed(() => {
  const desc = accommodation.value?.subtitle || accommodation.value?.description || ''
  return desc.length > 160 ? desc.slice(0, 160) + '...' : desc
})
const seoImage = computed(() => {
  const rawImg = accommodation.value?.image ?? '/og/default.jpg'
  return rawImg.startsWith('http') ? rawImg : `${siteUrl}${rawImg}`
})
const seoPrice = computed(() => accommodation.value?.price)
const seoUrl = computed(() => `${siteUrl}/accommodations/${slug}`)

// Aplicar SEO quando tour carregar
watch(accommodation, (newAccommodation) => {
  if (newAccommodation) {
    useHead({
      title: `${seoTitle.value} — Casa da Pedra`,
      meta: [
        { name: 'description', content: seoDescription.value },
        { property: 'og:title', content: seoTitle.value },
        { property: 'og:description', content: seoDescription.value },
        { property: 'og:image', content: seoImage.value },
        { property: 'og:url', content: seoUrl.value },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'canonical', href: seoUrl.value }],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: seoTitle.value,
            image: [seoImage.value],
            description: seoDescription.value,
            offers: seoPrice.value ? {
              '@type': 'Offer',
              priceCurrency: 'BRL',
              price: seoPrice.value,
              availability: 'https://schema.org/InStock',
              url: seoUrl.value
            } : undefined
          })
        }
      ]
    })
  }
}, { immediate: true })

// Funções da galeria já declaradas acima
</script>

<style scoped>
.accommodation-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Responsivo (mobile/tablet) – coluna única + padding menor */
@media (max-width: 1024px) {
  .accommodation-detail-page__main {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  /* Reduzir padding significativamente para telas menores */
  .accommodation-detail-page__info {
    padding: 1rem !important;
  }
  
  .accommodation-detail-page__booking {
    padding: 1rem !important;
  }
  
  /* Remover sticky do calendário em mobile */
  .accommodation-detail-page__booking-card {
    position: static !important;
    padding: 0 !important;
  }
  
  /* Calendário com respiro menor no mobile */
  .accommodation-detail-page__calendar {
    padding: 8px 0;
  }
}

/* Responsividade para telas pequenas */
@media (max-width: 600px) {
  .container {
    padding: 0 1rem;
  }
  
  .accommodation-detail-page__content {
    padding: 1rem 0;
  }
  
  .accommodation-detail-page__hero {
    margin-bottom: 1rem;
    border-radius: 8px;
  }
  
  .accommodation-detail-page__main {
    flex-direction: column;
    gap: 1rem;
  }
  
  .accommodation-detail-page__info {
    padding: 0.75rem !important;
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__section {
    margin-bottom: 1.5rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .accommodation-detail-page__description-html,
  .accommodation-detail-page__description-text {
    max-width: 100%;
    overflow-x: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .accommodation-detail-page__description-html * {
    max-width: 100% !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  .accommodation-detail-page__details-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .accommodation-detail-page__info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .accommodation-detail-page__includes,
  .accommodation-detail-page__excludes {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__booking {
    flex: none;
    width: 100%;
    max-width: 100%;
    order: -1; /* Move o booking para o topo em mobile */
    padding: 0.75rem !important;
  }
  
  .accommodation-detail-page__booking-card {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__calendar {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    margin-bottom: 1rem;
  }
  
  .calendar-availability {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    padding: 0.75rem;
  }
  
  .calendar-availability__days {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .calendar-availability__day {
    min-width: 40px;
    max-width: calc(100% / 7);
    font-size: 0.875rem;
  }
  
  .calendar-availability__price-indicator {
    font-size: 0.75rem;
    padding: 0.25rem;
  }
  
  .calendar-availability__price-text {
    font-size: 0.75rem;
  }
  
  .accommodation-detail-page__participants {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__participant-controls {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .accommodation-detail-page__participant-group {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__counter {
    width: 100%;
    max-width: 100%;
    justify-content: center;
  }
  
  .accommodation-detail-page__counter button {
    min-width: 40px;
    min-height: 40px;
    font-size: 1rem;
  }
  
  .accommodation-detail-page__counter span {
    min-width: 50px;
    font-size: 1rem;
  }
  
  .accommodation-detail-page__participant-progress {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__progress-bar {
    width: 100%;
    max-width: 100%;
  }
  
  .accommodation-detail-page__large-group {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__whatsapp-buttons {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;
    max-width: 100%;
  }
  
  .accommodation-detail-page__whatsapp-button {
    width: 100%;
    max-width: 100%;
    justify-content: center;
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .children-age-selector {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .children-age-selector__item {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .children-age-selector__child-info {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .children-age-selector__age-selector {
    width: 100%;
    max-width: 100%;
  }
  
  .children-age-selector__select {
    width: 100%;
    max-width: 100%;
  }
  
  .accommodation-detail-page__price-summary {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__price-comparison {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .accommodation-detail-page__title {
    font-size: 1.5rem;
    line-height: 1.3;
  }
  
  .accommodation-detail-page__subtitle {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .accommodation-detail-page__meta {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .accommodation-detail-page__meta-item {
    font-size: 0.875rem;
  }
  
  .accommodation-detail-page__price {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .accommodation-detail-page__price-current {
    font-size: 1.75rem;
  }
  
  .accommodation-detail-page__cta {
    width: 100%;
    margin-left: 0;
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
  
  .accommodation-detail-page__schedule {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .accommodation-detail-page__schedule-item {
    padding: 1rem;
  }
  
  .accommodation-detail-page__schedule-icon {
    width: 20px;
    height: 20px;
  }
  
  .accommodation-detail-page__schedule-content h4 {
    font-size: 1rem;
  }
  
  .accommodation-detail-page__schedule-content p {
    font-size: 0.875rem;
  }
  
  .accommodation-detail-page__important-info {
    padding: 1rem;
  }
  
  .accommodation-detail-page__important-info h3 {
    font-size: 1.25rem;
  }
  
  .accommodation-detail-page__important-info ul {
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__important-info li {
    font-size: 0.875rem;
    padding: 0.75rem;
  }
  
  .accommodation-detail-page__booking-card {
    padding: 1rem;
  }
  
  .accommodation-detail-page__booking-card h3 {
    font-size: 1.25rem;
  }
  
  .accommodation-detail-page__participant-controls {
    gap: 0.75rem;
  }
  
  .accommodation-detail-page__participant-group {
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__participant-label {
    font-size: 0.875rem;
  }
  
  .accommodation-detail-page__counter {
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__counter button {
    min-width: 36px;
    min-height: 36px;
    font-size: 1rem;
  }
  
  .accommodation-detail-page__counter input {
    min-width: 50px;
    font-size: 1rem;
  }
  
  .accommodation-detail-page__participant-progress {
    padding: 0.75rem;
  }
  
  .accommodation-detail-page__participant-progress h4 {
    font-size: 1rem;
  }
  
  .accommodation-detail-page__progress-bar {
    height: 8px;
  }
  
  .accommodation-detail-page__participant-feedback {
    padding: 0.75rem;
  }
  
  .accommodation-detail-page__participant-feedback p {
    font-size: 0.875rem;
  }
  
  .accommodation-detail-page__price-summary {
    margin-top: 1rem;
  }
  
  .accommodation-detail-page__price-comparison {
    margin-top: 1rem;
  }
  
  .breadcrumb {
    padding: 0.75rem 0;
    font-size: 0.8rem;
  }
  
  .breadcrumb svg {
    width: 14px;
    height: 14px;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
  color: #666;
  font-size: 0.875rem;
}

.breadcrumb a {
  color: var(--brand, #FF6700);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb svg {
  width: 16px;
  height: 16px;
}

/* Loading State */
.accommodation-detail-page__loading {
  padding: 2rem 0;
}

.accommodation-detail-page__skeleton {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.accommodation-detail-page__skeleton-hero {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.accommodation-detail-page__skeleton-content {
  padding: 2rem;
}

.accommodation-detail-page__skeleton-title {
  height: 2rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.accommodation-detail-page__skeleton-subtitle {
  height: 1.25rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 80%;
}

.accommodation-detail-page__skeleton-meta {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.accommodation-detail-page__error {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.accommodation-detail-page__error svg {
  width: 64px;
  height: 64px;
  color: #dc3545;
  margin-bottom: 1rem;
}

.accommodation-detail-page__error h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.accommodation-detail-page__error p {
  margin-bottom: 2rem;
}

.accommodation-detail-page__back {
  background: var(--brand, #FF6700);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.accommodation-detail-page__back:hover {
  background: var(--brand-600, #E55A00);
}

/* Content */
.accommodation-detail-page__content {
  padding: 2rem 0;
}

/* Layout Principal - Duas Colunas 50/50 */
.accommodation-detail-page__main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.accommodation-detail-page__info {
  background: white;
  border-radius: 12px;
  padding: 2rem; /* Restaurar padding para todas as seções */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 0;
}

.accommodation-detail-page__booking {
  background: white;
  border-radius: 12px;
  padding: 2rem; /* Restaurar padding para igualar com info */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 0;
}

.accommodation-detail-page__hero {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 0; /* Remover padding já que o pai info tem padding */
}

.accommodation-detail-page__hero-image {
  position: relative;
  height: 400px;
  margin: -2rem -2rem 0 -2rem; /* Compensar padding do info para a imagem */
}

.accommodation-detail-page__hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.accommodation-detail-page__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--brand, #FF6700);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.accommodation-detail-page__discount-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Galeria de Imagens */
.accommodation-detail-page__image-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

/* Regras removidas - substituídas pelas novas regras de galeria melhorada */

.accommodation-detail-page__image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.accommodation-detail-page__thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.accommodation-detail-page__thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: none;
  padding: 0;
}

.accommodation-detail-page__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.accommodation-detail-page__thumbnail.active {
  border-color: var(--brand, #FF6700);
  transform: scale(1.05);
}

.accommodation-detail-page__thumbnail:hover {
  border-color: var(--brand, #FF6700);
  opacity: 0.8;
}

.accommodation-detail-page__thumbnail-more {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.accommodation-detail-page__single-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* Lightbox */
.accommodation-detail-page__lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.accommodation-detail-page__lightbox-content {
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.accommodation-detail-page__lightbox-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 10001;
}

.accommodation-detail-page__lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.accommodation-detail-page__lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 10001;
}

.accommodation-detail-page__lightbox-prev {
  left: -2rem;
}

.accommodation-detail-page__lightbox-next {
  right: -2rem;
}

.accommodation-detail-page__lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.accommodation-detail-page__lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  overflow: hidden;
  border-radius: 12px;
}

.accommodation-detail-page__lightbox-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.accommodation-detail-page__lightbox-counter {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

.accommodation-detail-page__lightbox-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  max-width: 100%;
  padding: 1rem 0;
}

.accommodation-detail-page__lightbox-thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 45px;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: none;
  padding: 0;
}

.accommodation-detail-page__lightbox-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.accommodation-detail-page__lightbox-thumbnail.active {
  border-color: var(--brand, #FF6700);
}

.accommodation-detail-page__lightbox-thumbnail:hover {
  border-color: var(--brand, #FF6700);
  opacity: 0.8;
}

/* Mobile */
@media (max-width: 768px) {
  .accommodation-detail-page__lightbox {
    padding: 1rem;
  }
  
  .accommodation-detail-page__lightbox-nav {
    width: 40px;
    height: 40px;
  }
  
  .accommodation-detail-page__lightbox-prev {
    left: -1rem;
  }
  
  .accommodation-detail-page__lightbox-next {
    right: -1rem;
  }
  
  .accommodation-detail-page__lightbox-image {
    max-height: 60vh;
  }
}

.accommodation-detail-page__hero-content {
  padding: 2rem;
}

.accommodation-detail-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.accommodation-detail-page__subtitle {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.accommodation-detail-page__meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.accommodation-detail-page__schedule {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accommodation-detail-page__schedule-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.accommodation-detail-page__schedule-item .iconify {
  width: 16px;
  height: 16px;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__location,
.accommodation-detail-page__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.accommodation-detail-page__location svg,
.accommodation-detail-page__rating svg {
  width: 16px;
  height: 16px;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__price-promo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.accommodation-detail-page__price-original {
  font-size: 1.5rem;
  font-weight: 500;
  color: #9ca3af;
  text-decoration: line-through;
}

.accommodation-detail-page__price-current {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__price-normal {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand, #FF6700);
}

/* Main Content - removido para evitar conflito com definição principal */

.accommodation-detail-page__info {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.accommodation-detail-page__section {
  margin-bottom: 2rem;
}

.accommodation-detail-page__section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.accommodation-detail-page__section p {
  color: #666;
  line-height: 1.6;
}

.accommodation-detail-page__details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.accommodation-detail-page__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.accommodation-detail-page__info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid var(--brand, #FF6700);
}

.accommodation-detail-page__info-item .iconify {
  width: 24px;
  height: 24px;
  color: var(--brand, #FF6700);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.accommodation-detail-page__info-item h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.accommodation-detail-page__info-item p {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.accommodation-detail-page__detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.accommodation-detail-page__detail-item svg {
  width: 24px;
  height: 24px;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__detail-item h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.accommodation-detail-page__detail-item p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.accommodation-detail-page__includes,
.accommodation-detail-page__excludes {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0.5rem;
}

.accommodation-detail-page__includes li,
.accommodation-detail-page__excludes li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
  line-height: 1.4;
}

.accommodation-detail-page__includes svg {
  width: 16px;
  height: 16px;
  color: #28a745;
  margin-top: 2px;
  flex-shrink: 0;
}

.accommodation-detail-page__excludes svg {
  width: 16px;
  height: 16px;
  color: #dc3545;
  margin-top: 2px;
  flex-shrink: 0;
}

.accommodation-detail-page__itinerary {
  list-style: none;
  padding: 0;
}

.accommodation-detail-page__itinerary li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.accommodation-detail-page__itinerary li:last-child {
  border-bottom: none;
}

.accommodation-detail-page__step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--brand, #FF6700);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

/* Booking Sidebar */
.accommodation-detail-page__booking {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

/* Coluna de reserva com sticky para boa usabilidade */
.accommodation-detail-page__booking-card {
  position: sticky;
  top: calc(var(--app-header-height, 72px) + 16px);
  width: 100%;
  max-width: 100%;
  padding: 0; /* Remover padding já que o pai booking tem padding */
}

.accommodation-detail-page__booking-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.accommodation-detail-page__calendar {
  margin-bottom: 2rem;
}

/* Garantir que nada estoure horizontalmente */
.accommodation-detail-page__booking,
.accommodation-detail-page__booking-card,
.accommodation-detail-page__calendar,
.children-age-selector,
.accommodation-detail-page__large-group,
.price-summary {
  max-width: 100%;
  overflow: hidden;
}

/* Grelha do calendário sempre cabendo no container */
.calendar-availability__days {
  display: grid !important;
  grid-template-columns: repeat(7, minmax(36px, 1fr));
  gap: 6px;
}

/* Dias do calendário não podem fixar uma largura maior que o container */
.calendar-availability__day {
  min-width: 0;
}

/* Espaçamento coerente entre blocos para evitar "quebra visual" */
.accommodation-detail-page__large-group,
.children-age-selector,
.price-summary {
  margin-top: clamp(12px, 2vw, 20px);
}

.accommodation-detail-page__selected-dates {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 103, 0, 0.05);
  border: 1px solid rgba(255, 103, 0, 0.2);
  border-radius: 8px;
}

.accommodation-detail-page__selected-dates h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--brand, #FF6700);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accommodation-detail-page__date-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accommodation-detail-page__date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #333;
}

.accommodation-detail-page__date-item svg {
  width: 16px;
  height: 16px;
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__nights {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

.accommodation-detail-page__participants {
  margin-bottom: 2rem;
}

.accommodation-detail-page__participants h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.accommodation-detail-page__participant-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accommodation-detail-page__participant-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accommodation-detail-page__participant-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.accommodation-detail-page__counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.accommodation-detail-page__participant-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #0369a1;
  margin-top: 0.5rem;
}

.accommodation-detail-page__participant-info svg {
  width: 16px;
  height: 16px;
}

.accommodation-detail-page__participant-feedback {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  animation: feedback-appear 0.3s ease-out;
}

.accommodation-detail-page__participant-feedback--info {
  color: #1976d2;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
}

.accommodation-detail-page__participant-feedback--warning {
  color: #f57c00;
  background: #fff3e0;
  border: 1px solid #ffcc02;
}

.accommodation-detail-page__participant-feedback--error {
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.accommodation-detail-page__participant-feedback svg {
  width: 16px;
  height: 16px;
}

@keyframes feedback-appear {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.accommodation-detail-page__participant-progress {
  margin-top: 12px;
  padding: 8px 0;
}

.accommodation-detail-page__progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
  position: relative;
}

.accommodation-detail-page__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.accommodation-detail-page__progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  animation: progress-shine 2s infinite;
}

.accommodation-detail-page__progress-text {
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  font-weight: 500;
}

@keyframes progress-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.accommodation-detail-page__counter button {
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  touch-action: manipulation;
}

.accommodation-detail-page__counter button:hover:not(:disabled) {
  border-color: var(--brand, #FF6700);
  color: var(--brand, #FF6700);
}

.accommodation-detail-page__counter button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accommodation-detail-page__counter span {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}

.accommodation-detail-page__auto-save-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.accommodation-detail-page__save-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.accommodation-detail-page__save-indicator--blue {
  color: #1976d2;
}

.accommodation-detail-page__save-indicator--orange {
  color: #f57c00;
}

.accommodation-detail-page__save-indicator--green {
  color: #2e7d32;
}

.accommodation-detail-page__save-indicator--gray {
  color: #666;
}

.accommodation-detail-page__save-indicator svg {
  width: 16px;
  height: 16px;
}

.accommodation-detail-page__clear-save {
  background: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.accommodation-detail-page__clear-save:hover {
  background: rgba(220, 53, 69, 0.1);
}

.accommodation-detail-page__clear-save svg {
  width: 14px;
  height: 14px;
}

.accommodation-detail-page__price-summary {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .accommodation-detail-page__hero-content {
    padding: 1rem;
  }
  
  .accommodation-detail-page__title {
    font-size: 2rem;
  }
  
  .accommodation-detail-page__meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .accommodation-detail-page__info {
    padding: 1rem;
  }
  
  .accommodation-detail-page__booking-card {
    padding: 1rem;
  }
  
  .accommodation-detail-page__details-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos para descrição condicional */
.accommodation-detail-page__description-html {
  line-height: 1.6;
}

.accommodation-detail-page__description-html :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.accommodation-detail-page__description-html :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.accommodation-detail-page__description-html :deep(th),
.accommodation-detail-page__description-html :deep(td) {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.accommodation-detail-page__description-html :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.accommodation-detail-page__description-html :deep(a[href]) {
  color: var(--brand);
  text-decoration: underline;
}

.accommodation-detail-page__description-html :deep(a[href]:hover) {
  color: var(--brand-600);
}

.accommodation-detail-page__description-html :deep(h1),
.accommodation-detail-page__description-html :deep(h2),
.accommodation-detail-page__description-html :deep(h3),
.accommodation-detail-page__description-html :deep(h4),
.accommodation-detail-page__description-html :deep(h5),
.accommodation-detail-page__description-html :deep(h6) {
  margin: 1.5rem 0 0.5rem 0;
  font-weight: 600;
  color: var(--text);
}

.accommodation-detail-page__description-html :deep(h1) { font-size: 1.875rem; }
.accommodation-detail-page__description-html :deep(h2) { font-size: 1.5rem; }
.accommodation-detail-page__description-html :deep(h3) { font-size: 1.25rem; }
.accommodation-detail-page__description-html :deep(h4) { font-size: 1.125rem; }
.accommodation-detail-page__description-html :deep(h5) { font-size: 1rem; }
.accommodation-detail-page__description-html :deep(h6) { font-size: 0.875rem; }

.accommodation-detail-page__description-html :deep(ul),
.accommodation-detail-page__description-html :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.accommodation-detail-page__description-html :deep(li) {
  margin: 0.25rem 0;
}

.accommodation-detail-page__description-html :deep(blockquote) {
  border-left: 4px solid var(--brand);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: var(--muted);
}

.accommodation-detail-page__description-html :deep(pre) {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
}

.accommodation-detail-page__description-html :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.accommodation-detail-page__description-text {
  white-space: pre-line;
  line-height: 1.6;
}

/* ===== MELHORIAS SOLICITADAS ===== */

/* 1) Breadcrumb com respiro do topo */
.breadcrumb {
  margin-top: 16px;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,.06);
}

/* 2) Galeria melhorada - HERO altura maior e sem corte - v2.1 */
.accommodation-detail-page__main-image {
  position: relative !important;
  width: 100% !important;
  /* overriding qualquer aspect-ratio anterior */
  aspect-ratio: auto !important;

  /* altura responsiva muito maior para evitar cortes */
  height: clamp(500px, 70vh, 900px) !important;
  background: #f7f7f8 !important;
  border-radius: 14px !important;
  overflow: hidden !important;
}

/* não cortar a imagem */
.accommodation-detail-page__main-image-img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;          /* evita corte */
  object-position: center !important;      /* centraliza a composição */
  background: #f7f7f8 !important;          /* fundo neutro quando sobrar faixa */
}

/* setas/contador continuam posicionados corretamente com o novo height */
.accommodation-detail-page__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,.45);
  color: #fff;
  border: 0;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.accommodation-detail-page__nav:hover {
  background: rgba(0,0,0,.65);
}

.accommodation-detail-page__nav.prev {
  left: 10px;
}

.accommodation-detail-page__nav.next {
  right: 10px;
}

.accommodation-detail-page__thumbnails {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  overflow-x: visible;
  padding-bottom: 4px;
  scroll-snap-type: none;
  flex-wrap: wrap;
  justify-content: center;
}

.accommodation-detail-page__thumbnail {
  flex: 1 1 auto;
  max-width: 70px;
  width: 70px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  scroll-snap-align: none;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.accommodation-detail-page__thumbnail.active {
  border-color: #ff6a00;
}

.accommodation-detail-page__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.accommodation-detail-page__image-counter {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: rgba(0,0,0,.55);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: .85rem;
}

/* 3) Check-in e Check-out lado a lado */
.accommodation-detail-page__schedule {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 8px 16px;
  align-items: center;
}

.accommodation-detail-page__schedule-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media (max-width: 640px) {
  .accommodation-detail-page__schedule {
    grid-template-columns: 1fr;
  }
}

/* 4) Preço com promoção melhorado */
.accommodation-detail-page__price {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.accommodation-detail-page__price-box {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.accommodation-detail-page__price-promo {
  font-size: clamp(22px, 3.2vw, 34px);
  font-weight: 800;
  color: #ff6a00;
}

.accommodation-detail-page__price-regular {
  font-size: clamp(14px, 1.6vw, 18px);
  color: #9aa1a8;
  text-decoration: line-through;
}

.accommodation-detail-page__price-badge {
  background: #ffe8dc;
  color: #ff6a00;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: .85rem;
}

.accommodation-detail-page__price-only {
  font-size: clamp(22px, 3.2vw, 34px);
  font-weight: 800;
  color: #ff6a00;
}

.accommodation-detail-page__cta {
  margin-left: auto;
  background: #ff6a00;
  color: #fff;
  border: 0;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.accommodation-detail-page__cta:hover {
  filter: brightness(.95);
}

/* Tablet adjustments */
@media (max-width: 1024px) and (min-width: 769px) {
  .accommodation-detail-page__main-image {
    height: clamp(400px, 60vh, 700px) !important;
  }
  
  .accommodation-detail-page__thumbnails {
    gap: 7px;
  }
  
  .accommodation-detail-page__thumbnail {
    max-width: 65px;
    width: 65px;
    height: 47px;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .accommodation-detail-page__main-image {
    height: clamp(320px, 55vh, 600px) !important;
  }
  
  .accommodation-detail-page__price {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .accommodation-detail-page__cta {
    margin-left: 0;
    width: 100%;
  }
  
  .accommodation-detail-page__thumbnails {
    gap: 6px;
  }
  
  .accommodation-detail-page__thumbnail {
    max-width: 60px;
    width: 60px;
    height: 44px;
  }
}

/* Estilos para grupos grandes */
.accommodation-detail-page__large-group {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accommodation-detail-page__large-group-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.accommodation-detail-page__large-group-icon {
  width: 24px;
  height: 24px;
  color: #d97706;
  flex-shrink: 0;
}

.accommodation-detail-page__large-group-text h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 0.25rem 0;
}

.accommodation-detail-page__large-group-text p {
  font-size: 0.875rem;
  color: #a16207;
  margin: 0;
  line-height: 1.4;
}

.accommodation-detail-page__whatsapp-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.accommodation-detail-page__whatsapp-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #25d366;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.accommodation-detail-page__whatsapp-button:hover {
  background: #20ba5a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);
}

.accommodation-detail-page__whatsapp-button .icon {
  width: 16px;
  height: 16px;
}

/* Responsive para grupos grandes */
@media (max-width: 768px) {
  .accommodation-detail-page__large-group-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .accommodation-detail-page__whatsapp-buttons {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

/* ===== PATCH CSS MOBILE - MELHORIAS DE USABILIDADE ===== */
@media (max-width: 768px) {
  /* 1. Remover sticky no mobile */
  .accommodation-detail-page__booking,
  .accommodation-detail-page__booking-card,
  .accommodation-detail-page__calendar {
    position: static !important;
    top: auto !important;
  }

  /* Garantir layout em coluna única no mobile */
  .accommodation-detail-page__main {
    display: flex !important;
    flex-direction: column !important;
    gap: 1rem !important;
  }

  /* Garantir que booking não sobreponha info */
  .accommodation-detail-page__booking {
    order: 2 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .accommodation-detail-page__info {
    order: 1 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 2. Padding e largura otimizados no card de reserva */
  .accommodation-detail-page__booking-card {
    padding: 14px 16px !important;
    max-width: 100% !important;
  }

  /* 3. Calendário sem overflow */
  .calendar-availability { 
    width: 100%; 
    overflow: hidden; 
  }
  
  .calendar-availability__days {
    display: grid !important;
    grid-template-columns: repeat(7, 1fr) !important;
    gap: 8px !important;
  }
  
  .calendar-availability__day {
    min-height: 44px;
    display: inline-flex; 
    align-items: center; 
    justify-content: center;
  }

  /* 4. Ícones alinhados e acessíveis */
  .iconify { 
    width: 20px; 
    height: 20px; 
    display: inline-flex; 
    vertical-align: middle; 
  }

  /* 5. Tipografia acessível */
  .accommodation-detail-page__booking-card {
    font-size: clamp(15px, 1.6vw, 16px);
    line-height: 1.4;
  }
  
  .accommodation-detail-page__booking-card h3 {
    font-size: clamp(16px, 2.2vw, 18px);
    line-height: 1.5;
  }

  /* 6. Resumo do Preço - layout em coluna */
  .price-summary {
    padding: 14px 16px;
    display: flex; 
    flex-direction: column; 
    gap: 12px;
    font-size: clamp(15px, 1.6vw, 16px);
  }
  
  .price-summary__participants,
  .price-summary__line,
  .price-summary__total-line {
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    gap: 8px;
  }
  
  .price-summary__actions .price-summary__button {
    min-height: 48px; 
    font-size: 16px;
  }
  
  /* Remover ícones/pseudo-ícones extras do price-summary */
  .price-summary [class*="icon"], 
  .price-summary [class*="__icon"]::before { 
    content: none !important; 
  }

  /* 7. Economia Garantida - layout flex */
  .price-comparison__card { 
    padding: 14px 16px; 
  }
  
  .price-comparison__header {
    display: flex; 
    align-items: center; 
    gap: 8px;
  }
  
  .price-comparison__content { 
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
  }
  
  .price-comparison__savings-amount { 
    display: flex; 
    align-items: baseline; 
    gap: 6px; 
  }
  
  /* Remover pseudo-ícones duplicados do price-comparison */
  .price-comparison [class*="__icon"]::before { 
    content: none !important; 
  }

  /* 8. Divider responsivo */
  .price-summary__divider,
  .price-comparison__divider {
    border-top: 1px solid var(--border-muted, #e5e7eb);
    margin: 12px 0;
  }

  /* 9. Garantir que valores não causem wrap estranho */
  .price-summary__amount,
  .price-comparison__amount {
    min-width: 0;
    word-break: keep-all;
  }

  /* 10. Botões com hit area adequada */
  .calendar-availability__day,
  .price-summary__button,
  .price-comparison__button {
    min-height: 44px;
    touch-action: manipulation;
  }
}

/* ===== PATCH CSS GALERIA - NAVEGAÇÃO E CONTADOR ===== */

/* Contêiner da galeria (garante contexto e corte) */
.accommodation-detail-page__main-image {
  position: relative !important;
  overflow: hidden !important;
  border-radius: inherit;
}

/* Setas dentro da imagem */
.accommodation-detail-page__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.55);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s ease;
}

.accommodation-detail-page__nav:hover {
  background: rgba(0,0,0,.75);
  transform: translateY(-50%) scale(1.05);
}

.accommodation-detail-page__nav.prev { left: 38px; }
.accommodation-detail-page__nav.next { right: 38px; }

/* Contador dentro da imagem */
.accommodation-detail-page__image-counter {
  position: absolute;
  right: 38px;
  bottom: 38px;
  z-index: 2;
  padding: 8px 14px;
  border-radius: 9999px;
  background: rgba(0,0,0,.6);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  backdrop-filter: blur(2px);
  font-weight: 500;
}

/* Thumbs abaixo, sem sobrepor o contador */
.accommodation-detail-page__thumbnails {
  margin-top: 14px;
}

/* Desktop: setas aparecem no hover (melhora a limpeza visual) */
@media (hover:hover) and (pointer:fine) {
  .accommodation-detail-page__nav { 
    opacity: 0; 
    transition: opacity .2s ease, transform .2s ease, background .2s ease; 
  }
  .accommodation-detail-page__main-image:hover .accommodation-detail-page__nav { 
    opacity: 1; 
  }
}

/* Mobile: setas e contador um pouco menores e sempre visíveis */
@media (max-width: 768px) {
  .accommodation-detail-page__nav { 
    width: 36px; 
    height: 36px; 
    opacity: 1 !important; /* Sempre visíveis no mobile */
  }
  
  .accommodation-detail-page__nav.prev { left: 32px; }
  .accommodation-detail-page__nav.next { right: 32px; }
  
  .accommodation-detail-page__image-counter { 
    right: 32px; 
    bottom: 32px; 
    font-size: 11px; 
    padding: 6px 12px; 
  }
  
  /* Ajustar tamanho dos ícones das setas no mobile */
  .accommodation-detail-page__nav svg {
    width: 18px;
    height: 18px;
  }
  
  /* Suporte a swipe no mobile */
  .accommodation-detail-page__main-image {
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
  }
  
  .accommodation-detail-page__main-image-img {
    touch-action: pan-x;
    user-select: none;
    -webkit-user-drag: none;
  }
}

/* Trust Signals Section */
.accommodation-detail-page__trust {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

/* Reviews Section - Alinhamento com layout principal */
.accommodation-detail-page__reviews {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

/* Mobile adjustments para trust signals e reviews */
@media (max-width: 1024px) {
  .accommodation-detail-page__trust {
    padding: 1rem;
  }
  
  .accommodation-detail-page__reviews {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .accommodation-detail-page__trust {
    padding: 0.75rem;
  }
  
  .accommodation-detail-page__reviews {
    padding: 0.75rem;
  }
}
</style>