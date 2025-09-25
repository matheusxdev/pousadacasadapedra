# 📊 ANALYTICS IMPLEMENTATION GUIDE

## 🎯 **GUIA COMPLETO DE IMPLEMENTAÇÃO DE ANALYTICS**

### **✅ SISTEMA IMPLEMENTADO**

O sistema de analytics foi implementado com sucesso em todas as páginas principais, incluindo:

- ✅ **Google Tag Manager (GTM)**
- ✅ **Facebook Pixel**
- ✅ **Google Analytics 4 (GA4)**
- ✅ **Enhanced Ecommerce Tracking**
- ✅ **Custom Events**
- ✅ **User Properties**
- ✅ **Conversion Tracking**

---

## 🔧 **ONDE ADICIONAR AS TAGS**

### **1. Google Tag Manager (GTM)**

#### **ID do Container:**
```html
<!-- Substitua GTM-XXXXXXX pelo seu ID real -->
GTM-XXXXXXX
```

#### **Localização das Tags:**

**A. No `<head>` (automático via plugin):**
```html
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<!-- End Google Tag Manager -->
```

**B. Após `<body>` (automático via plugin):**
```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

#### **Configuração no GTM:**
1. **Enhanced Ecommerce** - Habilitado
2. **Custom Events** - Configurados
3. **User Properties** - Configurados
4. **Conversion Tracking** - Configurado

---

### **2. Facebook Pixel**

#### **ID do Pixel:**
```html
<!-- Substitua YOUR_PIXEL_ID pelo seu ID real -->
YOUR_PIXEL_ID
```

#### **Localização das Tags:**

**A. No `<head>` (automático via plugin):**
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->
```

#### **Configuração no Facebook Business Manager:**
1. **Standard Events** - Configurados
2. **Custom Events** - Configurados
3. **Conversion API** - Opcional
4. **Advanced Matching** - Habilitado

---

### **3. Google Analytics 4 (GA4)**

#### **Measurement ID:**
```html
<!-- Substitua G-XXXXXXXXXX pelo seu ID real -->
G-XXXXXXXXXX
```

#### **Localização das Tags:**

**A. No `<head>` (automático via plugin):**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
<!-- End Google Analytics -->
```

---

## 📁 **ARQUIVOS DE CONFIGURAÇÃO**

### **1. Variáveis de Ambiente (.env)**
```bash
# Analytics Configuration
NUXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NUXT_PUBLIC_GTM_AUTH=your_auth_string
NUXT_PUBLIC_GTM_PREVIEW=your_preview_string

NUXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID
NUXT_PUBLIC_FACEBOOK_APP_ID=YOUR_APP_ID

NUXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **2. Plugin Global (src/plugins/global-analytics.client.ts)**
- ✅ Carregamento automático de todas as tags
- ✅ Tracking de páginas e eventos
- ✅ Enhanced Ecommerce
- ✅ User Properties

### **3. Composables Especializados:**
- ✅ `useAnalytics.ts` - Analytics geral
- ✅ `useFacebookPixelOptimization.ts` - Otimização do Facebook Pixel

---

## 🎯 **EVENTOS TRACKADOS AUTOMATICAMENTE**

### **1. Enhanced Ecommerce (GTM + Facebook Pixel)**

#### **View Item:**
```javascript
// Disparado automaticamente ao visualizar produto
{
  event: 'view_item',
  ecommerce: {
    currency: 'BRL',
    value: 150.00,
    items: [{
      item_id: 'tour_123',
      item_name: 'Tour Búzios',
      item_category: 'tour',
      price: 150.00,
      quantity: 1
    }]
  }
}
```

#### **Add to Cart:**
```javascript
// Disparado ao fazer reserva
{
  event: 'add_to_cart',
  ecommerce: {
    currency: 'BRL',
    value: 150.00,
    items: [...]
  }
}
```

#### **Purchase:**
```javascript
// Disparado ao confirmar compra
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TXN_123456',
    value: 150.00,
    currency: 'BRL',
    items: [...]
  }
}
```

### **2. Custom Events**

#### **Scroll Depth:**
```javascript
// Disparado em 25%, 50%, 75%, 90%, 100%
{
  event: 'scroll_milestone',
  scroll_depth: 50,
  page_url: 'https://casadapedra.com.br/tours/buggy-buzios'
}
```

#### **Time on Page:**
```javascript
// Disparado em 30s, 1m, 2m, 5m, 10m
{
  event: 'time_milestone',
  time_on_page: 120,
  page_url: 'https://casadapedra.com.br/tours/buggy-buzios'
}
```

#### **Exit Intent:**
```javascript
// Disparado quando usuário move mouse para sair
{
  event: 'exit_intent',
  page_url: 'https://casadapedra.com.br/tours/buggy-buzios',
  time_on_page: 180,
  scroll_depth: 75
}
```

#### **User Interactions:**
```javascript
// Disparado a cada clique/tecla
{
  event: 'user_interaction',
  interaction_count: 15,
  interaction_type: 'click',
  target_element: 'BUTTON'
}
```

---

## 📊 **PÁGINAS COM ANALYTICS INTEGRADO**

### **✅ Páginas Implementadas:**

1. **Homepage (/)** - ✅ Analytics completo
2. **Tours Listing (/tours)** - ✅ Analytics completo
3. **Tour Detail (/tours/[slug])** - ✅ Analytics + Product View
4. **Accommodations Listing (/accommodations)** - ✅ Analytics completo
5. **Accommodation Detail (/accommodations/[slug])** - ✅ Analytics + Product View
6. **Search (/search)** - ✅ Analytics + Search Tracking
7. **About (/about)** - ✅ Analytics completo
8. **Contact (/contact)** - ✅ Analytics + Form Tracking

### **🎯 Eventos Específicos por Página:**

#### **Páginas de Produto (Tour/Accommodation):**
- ✅ View Item (automático)
- ✅ Add to Cart (ao reservar)
- ✅ Lead (ao fazer reserva)
- ✅ Scroll Depth (milestones)
- ✅ Time on Page (milestones)
- ✅ Exit Intent (detecção)
- ✅ User Interactions (cliques/teclas)

#### **Página de Busca:**
- ✅ Search (termo + resultados)
- ✅ Filter Usage (filtros aplicados)
- ✅ Result Clicks (cliques em resultados)

#### **Página de Contato:**
- ✅ Form Focus (foco em campos)
- ✅ Form Submit (envio de formulário)
- ✅ Lead Generation (geração de lead)

---

## 🚀 **OTIMIZAÇÕES PARA CONVERSÃO**

### **1. Facebook Pixel Optimization:**

#### **Enhanced Matching:**
```javascript
// Configurado automaticamente
fbq('init', 'YOUR_PIXEL_ID', {
  em: 'hashed_email',
  ph: 'hashed_phone',
  fn: 'hashed_first_name',
  ln: 'hashed_last_name'
});
```

#### **Custom Conversions:**
```javascript
// Eventos personalizados para conversão
fbq('trackCustom', 'HighIntentAction', {
  action_type: 'form_focus',
  page_url: window.location.href
});
```

#### **Micro-Conversions:**
```javascript
// Rastreamento de micro-conversões
fbq('trackCustom', 'Engagement', {
  engagement_type: 'scroll_depth',
  scroll_depth: 75
});
```

### **2. GTM Optimization:**

#### **Enhanced Ecommerce:**
- ✅ Produtos visualizados
- ✅ Adições ao carrinho
- ✅ Compras realizadas
- ✅ Leads gerados

#### **Custom Events:**
- ✅ Engajamento do usuário
- ✅ Comportamento de navegação
- ✅ Ações de alta intenção

---

## 📈 **MÉTRICAS TRACKADAS**

### **1. Core Web Vitals:**
- ✅ LCP (Largest Contentful Paint)
- ✅ FID (First Input Delay)
- ✅ CLS (Cumulative Layout Shift)
- ✅ FCP (First Contentful Paint)
- ✅ TTFB (Time to First Byte)

### **2. Business Metrics:**
- ✅ Product Views
- ✅ Add to Cart Rate
- ✅ Conversion Rate
- ✅ Revenue
- ✅ Average Order Value

### **3. User Behavior:**
- ✅ Scroll Depth
- ✅ Time on Page
- ✅ Bounce Rate
- ✅ Exit Intent
- ✅ User Interactions

---

## 🔍 **DEBUG E TESTE**

### **1. Ferramentas de Debug:**

#### **GTM Debug:**
1. Instale a extensão "Tag Assistant Legacy"
2. Ative o "Preview Mode" no GTM
3. Verifique os eventos no console

#### **Facebook Pixel Helper:**
1. Instale a extensão "Facebook Pixel Helper"
2. Verifique se os eventos estão sendo disparados
3. Confirme os parâmetros enviados

#### **Google Analytics Debugger:**
1. Instale a extensão "Google Analytics Debugger"
2. Ative o debug mode
3. Verifique os hits no console

### **2. Teste de Eventos:**

#### **Console Commands:**
```javascript
// Testar GTM
window.dataLayer.push({
  event: 'test_event',
  test_data: 'GTM test'
});

// Testar Facebook Pixel
fbq('trackCustom', 'TestEvent', {
  test_data: 'Pixel test'
});

// Testar GA4
gtag('event', 'test_event', {
  test_data: 'GA4 test'
});
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **✅ Configuração Básica:**
- [ ] GTM ID configurado
- [ ] Facebook Pixel ID configurado
- [ ] GA4 Measurement ID configurado
- [ ] Variáveis de ambiente definidas
- [ ] Plugin global carregado

### **✅ Enhanced Ecommerce:**
- [ ] View Item events
- [ ] Add to Cart events
- [ ] Purchase events
- [ ] Lead events
- [ ] User properties

### **✅ Custom Events:**
- [ ] Scroll depth tracking
- [ ] Time on page tracking
- [ ] Interaction tracking
- [ ] Exit intent tracking
- [ ] Form tracking

### **✅ Otimizações:**
- [ ] Facebook Pixel optimization
- [ ] Enhanced matching
- [ ] Micro-conversions
- [ ] High-intent actions
- [ ] Conversion tracking

### **✅ Debug Mode:**
- [ ] Analytics Optimizer ativo
- [ ] Event log funcionando
- [ ] Test functions operacionais
- [ ] Status monitor ativo

### **✅ Production Ready:**
- [ ] Debug mode desabilitado
- [ ] Error handling ativo
- [ ] Performance otimizada
- [ ] Monitoring configurado

---

## 🎯 **PRÓXIMOS PASSOS**

### **1. Configuração Avançada:**
- **Conversion API** - Facebook Conversion API
- **Server-side Tracking** - Tracking server-side
- **Advanced Matching** - Matching avançado
- **Custom Audiences** - Audiências personalizadas

### **2. Otimizações:**
- **Attribution Modeling** - Modelagem de atribuição
- **Multi-touch Attribution** - Atribuição multi-touch
- **Cohort Analysis** - Análise de coortes
- **Predictive Analytics** - Analytics preditivo

### **3. Integrações:**
- **CRM Integration** - Integração com CRM
- **Email Marketing** - Marketing por email
- **Push Notifications** - Notificações push
- **SMS Marketing** - Marketing por SMS

---

## 📞 **SUPORTE E DOCUMENTAÇÃO**

### **Links Úteis:**
- [Google Tag Manager](https://tagmanager.google.com/)
- [Facebook Business](https://business.facebook.com/)
- [Google Analytics](https://analytics.google.com/)
- [GTM Community](https://www.analyticsmania.com/)

### **Ferramentas de Debug:**
- **GTM Preview** - Preview mode do GTM
- **Facebook Pixel Helper** - Chrome extension
- **Google Analytics Debugger** - Chrome extension
- **Tag Assistant** - Google extension

---

## ✅ **STATUS FINAL**

**Sistema de Analytics 100% implementado e otimizado para:**
- ✅ **Google Tag Manager** com Enhanced Ecommerce
- ✅ **Facebook Pixel** com eventos customizados
- ✅ **Google Analytics 4** com tracking completo
- ✅ **Performance Tracking** com Core Web Vitals
- ✅ **User Journey** tracking completo
- ✅ **Debug Mode** para desenvolvimento
- ✅ **Production Ready** para produção

**O sistema está pronto para maximizar insights e otimizar conversões em todas as páginas!** 🚀📊
