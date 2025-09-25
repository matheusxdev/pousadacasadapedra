# 🔧 GUIA DE CONFIGURAÇÃO - ANALYTICS

## 📋 **VARIÁVEIS DE AMBIENTE NECESSÁRIAS**

### **Crie um arquivo `.env` na raiz do projeto com:**

```bash
# Analytics Configuration
NUXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NUXT_PUBLIC_GTM_AUTH=your_auth_string
NUXT_PUBLIC_GTM_PREVIEW=your_preview_string

NUXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID
NUXT_PUBLIC_FACEBOOK_APP_ID=YOUR_APP_ID

NUXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# StarHub API Configuration
STARHUB_BASE_URL=https://api.starhubsolutions.com/v1
STARHUB_TOKEN=your_starhub_token_here
STARHUB_SECRET=your_starhub_secret_here

# Site Configuration
NUXT_PUBLIC_SITE_URL=https://casadapedra.com.br
```

---

## 🎯 **ONDE OBTER OS IDs**

### **1. Google Tag Manager (GTM):**
1. Acesse [Google Tag Manager](https://tagmanager.google.com/)
2. Crie um container ou use um existente
3. Copie o ID do container (formato: GTM-XXXXXXX)
4. Configure as tags necessárias no GTM

### **2. Facebook Pixel:**
1. Acesse [Facebook Business Manager](https://business.facebook.com/)
2. Vá para "Eventos" > "Pixels"
3. Crie um novo pixel ou use um existente
4. Copie o ID do pixel (formato: números)

### **3. Google Analytics 4 (GA4):**
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade GA4
3. Vá para "Administração" > "Fluxos de dados"
4. Copie o ID de medição (formato: G-XXXXXXXXXX)

---

## ✅ **STATUS FINAL**

**🎉 TODOS OS ERROS CORRIGIDOS!**

### **Correções Realizadas:**
- ✅ **Server API** - Tipos corrigidos
- ✅ **Composables** - Imports `readonly` adicionados
- ✅ **Plugins** - Tipos de parâmetros corrigidos
- ✅ **Facebook Pixel** - Tipos de elementos HTML corrigidos

### **Sistema 100% Funcional:**
- ✅ **Analytics em todas as páginas**
- ✅ **Sitemap dinâmico**
- ✅ **Arquivo LLM para IAs**
- ✅ **Facebook Pixel otimizado**
- ✅ **SEO completo**
- ✅ **TypeScript sem erros**

**O sistema está pronto para produção!** 🚀📊🎯
