#!/bin/bash

# Script de Deploy para Casa da Pedra
# Execute este script para preparar o projeto para deploy na Vercel

echo "🚀 Preparando Casa da Pedra para deploy na Vercel..."

# 1. Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    exit 1
fi

# 2. Verificar se o Git está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório Git..."
    git init
    git branch -M main
fi

# 3. Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adicionando arquivos ao Git..."
    git add .
    git commit -m "feat: prepare project for Vercel deployment

- Add vercel.json configuration
- Update .gitignore for production
- Add deployment documentation
- Optimize build settings"
fi

# 4. Verificar se o build funciona
echo "🔨 Testando build de produção..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build de produção bem-sucedido!"
else
    echo "❌ Erro no build de produção. Corrija os erros antes de fazer deploy."
    exit 1
fi

# 5. Mostrar próximos passos
echo ""
echo "🎉 Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Crie um repositório no GitHub chamado 'casadapedra'"
echo "2. Execute os comandos abaixo para fazer push:"
echo ""
echo "   git remote add origin https://github.com/SEU_USUARIO/casadapedra.git"
echo "   git push -u origin main"
echo ""
echo "3. Acesse https://vercel.com e importe o repositório"
echo "4. Configure as variáveis de ambiente:"
echo "   - VITE_STARHUB_TOKEN=e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca"
echo "   - VITE_STARHUB_BASE_URL=https://api.starhubsolutions.com/v1"
echo ""
echo "5. Clique em 'Deploy' e aguarde!"
echo ""
echo "📖 Documentação completa em: VERCEL_DEPLOY.md"
