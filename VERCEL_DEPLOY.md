# Casa da Pedra - Deploy na Vercel

## 🚀 Deploy Rápido

### 1. Criar Repositório no GitHub
```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit - Casa da Pedra project"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/casadapedra.git
git push -u origin main
```

### 2. Deploy na Vercel

1. **Acesse [vercel.com](https://vercel.com)**
2. **Faça login com GitHub**
3. **Clique em "New Project"**
4. **Importe o repositório `casadapedra`**
5. **Configure as variáveis de ambiente:**

#### Variáveis de Ambiente Obrigatórias:
```
VITE_STARHUB_TOKEN=e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca
VITE_STARHUB_BASE_URL=https://api.starhubsolutions.com/v1
```

#### Variáveis Opcionais (Analytics):
```
NUXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NUXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID
NUXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

6. **Clique em "Deploy"**

### 3. Configurações Automáticas

O projeto já está configurado com:
- ✅ **vercel.json** - Configuração de deploy
- ✅ **Nuxt 4** - Framework otimizado para Vercel
- ✅ **API Routes** - Serverless functions
- ✅ **SSR/SSG** - Renderização otimizada
- ✅ **Região Brasil** - `gru1` (São Paulo)

## 📋 Checklist Pré-Deploy

- [x] Projeto compila sem erros TypeScript
- [x] Todas as rotas API funcionando
- [x] Variáveis de ambiente configuradas
- [x] Imagens e assets otimizados
- [x] SEO configurado
- [x] Responsive design
- [x] Performance otimizada

## 🔧 Comandos Úteis

```bash
# Build local para testar
npm run build
npm run preview

# Verificar se está tudo ok
npm run dev
```

## 🌐 URLs de Teste

Após o deploy, teste estas URLs:
- `/` - Homepage
- `/accommodations` - Acomodações
- `/tours` - Tours
- `/api/products/unified` - API unificada
- `/api/reviews` - API de reviews

## 📞 Suporte

Se houver problemas no deploy:
1. Verifique os logs na Vercel
2. Confirme as variáveis de ambiente
3. Teste localmente primeiro
4. Verifique se todas as dependências estão no `package.json`

---
**Status**: ✅ Pronto para deploy na Vercel!
