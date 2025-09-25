<template>
  <div class="transfers-page">
    <!-- Hero -->
    <div class="transfers-page__hero">
      <div class="transfers-page__hero-content">
        <h1 class="transfers-page__title">{{ $t('transfers.hero.title') }}</h1>
        <div class="transfers-page__divider"></div>
        <p class="transfers-page__description">
          {{ $t('transfers.hero.subtitle') }}
          {{ $t('transfers.hero.description') }}
        </p>
      </div>
      <img
        class="transfers-page__hero-image"
        src="/images/transfers/Foto-principal.jpg-1000x616.webp"
        alt="Transfer privativo"
        loading="lazy"
      />
    </div>

    <!-- Cards -->
    <ClientOnly>
      <div class="transfers-page__cards">
        <TransferCard
          :title="$t('transfers.rentACar.title')"
          img="/images/transfers/WhatsApp-Image-2022-10-10-at-13.28.29-1.png-768x576.webp"
          :to="getTransferRoute('rent-a-car')"
        />
        <TransferCard
          :title="$t('transfers.regular.title')"
          img="/images/transfers/Transfer-Regular-6.webp"
          :to="getTransferRoute('regular')"
        />
        <TransferCard
          :title="$t('transfers.private.title')"
          img="/images/transfers/transfer-privado-rio-buzios-06.jpg"
          :to="getTransferRoute('private')"
        />
      </div>
      <template #fallback>
        <div class="transfers-page__cards">
          <div class="transfer-card-skeleton">
            <div class="transfer-card-skeleton__image"></div>
            <div class="transfer-card-skeleton__content">
              <div class="transfer-card-skeleton__title"></div>
              <div class="transfer-card-skeleton__button"></div>
            </div>
          </div>
          <div class="transfer-card-skeleton">
            <div class="transfer-card-skeleton__image"></div>
            <div class="transfer-card-skeleton__content">
              <div class="transfer-card-skeleton__title"></div>
              <div class="transfer-card-skeleton__button"></div>
            </div>
          </div>
          <div class="transfer-card-skeleton">
            <div class="transfer-card-skeleton__image"></div>
            <div class="transfer-card-skeleton__content">
              <div class="transfer-card-skeleton__title"></div>
              <div class="transfer-card-skeleton__button"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import TransferCard from '~/components/TransferCard.vue'
import { useSafeLocale } from '@/composables/useSafeLocale'

const { getSafeLocale } = useSafeLocale()

const getTransferRoute = (slug: string) => {
  const currentLocale = getSafeLocale()
  const baseRoute = `/transfers/${slug}`
  
  // Adicionar prefixo de idioma se necessário
  if (currentLocale === 'pt') {
    return baseRoute
  } else {
    return `/${currentLocale}${baseRoute}`
  }
}

useHead({
  title: 'Traslados em Búzios — Casa da Pedra',
  meta: [
    { name: 'description', content: 'Serviços de traslado da Casa da Pedra: Rent a Car, Transfer Regular e Transfer Privado em Búzios.' },
    { property: 'og:title', content: 'Traslados em Búzios — Casa da Pedra' },
    { property: 'og:description', content: 'Serviços de traslado da Casa da Pedra: Rent a Car, Transfer Regular e Transfer Privado em Búzios.' },
    { property: 'og:image', content: '/og/transfers.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<style scoped>
.transfers-page {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2.5rem 1rem;
}

@media (min-width: 1024px) {
  .transfers-page {
    padding: 3.5rem 1.5rem;
  }
}

.transfers-page__hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 1024px) {
  .transfers-page__hero {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }
}

.transfers-page__hero-content {
  order: 2;
}

@media (min-width: 1024px) {
  .transfers-page__hero-content {
    order: 1;
  }
}

.transfers-page__title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

@media (min-width: 1024px) {
  .transfers-page__title {
    font-size: 3rem;
  }
}

.transfers-page__divider {
  height: 0.25rem;
  width: 6rem;
  background: #FF6700;
  border-radius: 0.125rem;
  margin-bottom: 1.5rem;
}

.transfers-page__description {
  max-width: 36rem;
  color: #334155;
  font-size: 1rem;
  line-height: 1.75;
}

.transfers-page__hero-image {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  order: 1;
}

@media (min-width: 1024px) {
  .transfers-page__hero-image {
    order: 2;
  }
}

.transfers-page__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .transfers-page__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .transfers-page__cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Skeleton loader */
.transfer-card-skeleton {
  border-radius: 1rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.transfer-card-skeleton__image {
  aspect-ratio: 16/11;
  width: 100%;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.transfer-card-skeleton__content {
  padding: 1rem;
}

.transfer-card-skeleton__title {
  height: 1rem;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.transfer-card-skeleton__button {
  height: 2rem;
  width: 6rem;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 9999px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>