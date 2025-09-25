<template>
  <ClientOnly>
    <div class="trust-signals">
      <div class="trust-signals__container">
        <!-- Security Badges -->
        <div class="trust-signals__section">
          <h3 class="trust-signals__title">Segurança e Confiança</h3>
          <div class="trust-signals__grid">
            <div class="trust-signals__badge trust-signals__badge--security">
              <Icon name="heroicons:shield-check" class="trust-signals__badge-icon" />
              <div class="trust-signals__badge-content">
                <span class="trust-signals__badge-title">SSL Seguro</span>
                <span class="trust-signals__badge-desc">Dados protegidos</span>
              </div>
            </div>
            
            <div class="trust-signals__badge trust-signals__badge--payment">
              <Icon name="heroicons:credit-card" class="trust-signals__badge-icon" />
              <div class="trust-signals__badge-content">
                <span class="trust-signals__badge-title">Pagamento Seguro</span>
                <span class="trust-signals__badge-desc">Cartões aceitos</span>
              </div>
            </div>
            
            <div class="trust-signals__badge trust-signals__badge--guarantee">
              <Icon name="heroicons:check-badge" class="trust-signals__badge-icon" />
              <div class="trust-signals__badge-content">
                <span class="trust-signals__badge-title">Garantia Total</span>
                <span class="trust-signals__badge-desc">7 dias para cancelar</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div class="trust-signals__section">
          <h3 class="trust-signals__title">Certificações</h3>
          <div class="trust-signals__certifications">
            <div class="trust-signals__cert trust-signals__cert--tourism">
              <div class="trust-signals__cert-icon">
                <Icon name="heroicons:star" />
              </div>
              <div class="trust-signals__cert-content">
                <span class="trust-signals__cert-title">Turismo Responsável</span>
                <span class="trust-signals__cert-desc">Certificado Embratur</span>
              </div>
            </div>
            
            <div class="trust-signals__cert trust-signals__cert--quality">
              <div class="trust-signals__cert-icon">
                <Icon name="heroicons:star" />
              </div>
              <div class="trust-signals__cert-content">
                <span class="trust-signals__cert-title">Qualidade Comprovada</span>
                <span class="trust-signals__cert-desc">ISO 9001</span>
              </div>
            </div>
            
            <div class="trust-signals__cert trust-signals__cert--sustainability">
              <div class="trust-signals__cert-icon">
                <Icon name="heroicons:globe-alt" />
              </div>
              <div class="trust-signals__cert-content">
                <span class="trust-signals__cert-title">Turismo Sustentável</span>
                <span class="trust-signals__cert-desc">Certificado Green</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="trust-signals__section">
          <h3 class="trust-signals__title">Nossa História</h3>
          <div class="trust-signals__stats">
            <div class="trust-signals__stat">
              <div class="trust-signals__stat-number">15+</div>
              <div class="trust-signals__stat-label">Anos de experiência</div>
            </div>
            
            <div class="trust-signals__stat">
              <div class="trust-signals__stat-number">50K+</div>
              <div class="trust-signals__stat-label">Clientes satisfeitos</div>
            </div>
            
            <div class="trust-signals__stat">
              <div class="trust-signals__stat-number">98%</div>
              <div class="trust-signals__stat-label">Taxa de aprovação</div>
            </div>
            
            <div class="trust-signals__stat">
              <div class="trust-signals__stat-number">24/7</div>
              <div class="trust-signals__stat-label">Suporte disponível</div>
            </div>
          </div>
        </div>

        <!-- Customer Service -->
        <div class="trust-signals__section">
          <h3 class="trust-signals__title">Atendimento ao Cliente</h3>
          <div class="trust-signals__support">
            <div class="trust-signals__support-item">
              <Icon name="heroicons:phone" class="trust-signals__support-icon" />
              <div class="trust-signals__support-content">
                <span class="trust-signals__support-title">Telefone</span>
                <span class="trust-signals__support-desc">(22) 99999-9999</span>
              </div>
            </div>
            
            <div class="trust-signals__support-item">
              <Icon name="heroicons:chat-bubble-left-ellipsis" class="trust-signals__support-icon" />
              <div class="trust-signals__support-content">
                <span class="trust-signals__support-title">WhatsApp</span>
                <span class="trust-signals__support-desc">Resposta rápida</span>
              </div>
            </div>
            
            <div class="trust-signals__support-item">
              <Icon name="heroicons:envelope" class="trust-signals__support-icon" />
              <div class="trust-signals__support-content">
                <span class="trust-signals__support-title">Email</span>
                <span class="trust-signals__support-desc">contato@casadapedra.net</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="trust-signals__section">
          <h3 class="trust-signals__title">Formas de Pagamento</h3>
          <div class="trust-signals__payments">
            <div class="trust-signals__payment">
              <Icon name="heroicons:credit-card" />
              <span>Cartão de Crédito</span>
            </div>
            <div class="trust-signals__payment">
              <Icon name="heroicons:banknotes" />
              <span>PIX</span>
            </div>
            <div class="trust-signals__payment">
              <Icon name="heroicons:building-library" />
              <span>Transferência</span>
            </div>
            <div class="trust-signals__payment">
              <Icon name="heroicons:currency-dollar" />
              <span>Dinheiro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  showStats?: boolean
  showSupport?: boolean
  showPayments?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  showSupport: true,
  showPayments: true,
  compact: false
})

// Animate stats on mount
const statsAnimated = ref(false)

onMounted(() => {
  // Animate stats after a short delay
  setTimeout(() => {
    statsAnimated.value = true
  }, 500)
})
</script>

<style scoped>
.trust-signals {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.trust-signals__container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.trust-signals__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trust-signals__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trust-signals__title::before {
  content: '';
  width: 0.25rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 0.125rem;
}

/* Security Badges */
.trust-signals__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.trust-signals__badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.trust-signals__badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.trust-signals__badge-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: white;
}

.trust-signals__badge--security .trust-signals__badge-icon {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.trust-signals__badge--payment .trust-signals__badge-icon {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.trust-signals__badge--guarantee .trust-signals__badge-icon {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.trust-signals__badge-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.trust-signals__badge-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.trust-signals__badge-desc {
  font-size: 0.75rem;
  color: #64748b;
}

/* Certifications */
.trust-signals__certifications {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.trust-signals__cert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.trust-signals__cert-icon {
  width: 2rem;
  height: 2rem;
  padding: 0.375rem;
  border-radius: 50%;
  color: white;
}

.trust-signals__cert--tourism .trust-signals__cert-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.trust-signals__cert--quality .trust-signals__cert-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.trust-signals__cert--sustainability .trust-signals__cert-icon {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.trust-signals__cert-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.trust-signals__cert-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.8rem;
}

.trust-signals__cert-desc {
  font-size: 0.7rem;
  color: #64748b;
}

/* Statistics */
.trust-signals__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.trust-signals__stat {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.trust-signals__stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trust-signals__stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Customer Support */
.trust-signals__support {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.trust-signals__support-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.trust-signals__support-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
}

.trust-signals__support-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.trust-signals__support-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.8rem;
}

.trust-signals__support-desc {
  font-size: 0.7rem;
  color: #64748b;
}

/* Payment Methods */
.trust-signals__payments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.trust-signals__payment {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

.trust-signals__payment svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #059669;
}

/* Responsive */
@media (max-width: 768px) {
  .trust-signals {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .trust-signals__container {
    gap: 1.5rem;
  }
  
  .trust-signals__grid,
  .trust-signals__certifications,
  .trust-signals__stats,
  .trust-signals__support,
  .trust-signals__payments {
    grid-template-columns: 1fr;
  }
  
  .trust-signals__badge {
    padding: 0.75rem;
  }
  
  .trust-signals__stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .trust-signals__badge,
  .trust-signals__cert,
  .trust-signals__support-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .trust-signals__badge-content,
  .trust-signals__cert-content,
  .trust-signals__support-content {
    align-items: center;
  }
}
</style>
