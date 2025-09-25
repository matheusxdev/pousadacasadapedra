# Script de Deploy para Casa da Pedra (PowerShell)
# Execute este script para preparar o projeto para deploy na Vercel

Write-Host "🚀 Preparando Casa da Pedra para deploy na Vercel..." -ForegroundColor Green

# 1. Verificar se estamos na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na pasta raiz do projeto" -ForegroundColor Red
    exit 1
}

# 2. Verificar se o Git está inicializado
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# 3. Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Adicionando arquivos ao Git..." -ForegroundColor Yellow
    git add .
    git commit -m "feat: prepare project for Vercel deployment

- Add vercel.json configuration
- Update .gitignore for production
- Add deployment documentation
- Optimize build settings"
}

# 4. Verificar se o build funciona
Write-Host "🔨 Testando build de produção..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build de produção bem-sucedido!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build de produção. Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

# 5. Mostrar próximos passos
Write-Host ""
Write-Host "🎉 Projeto pronto para deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub chamado 'casadapedra'"
Write-Host "2. Execute os comandos abaixo para fazer push:"
Write-Host ""
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/casadapedra.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Acesse https://vercel.com e importe o repositório"
Write-Host "4. Configure as variáveis de ambiente:"
Write-Host "   - VITE_STARHUB_TOKEN=e50e22927bc6e4abb6a6a31a36cda59ec843dad324cb5e5fa85613f085db15ca" -ForegroundColor White
Write-Host "   - VITE_STARHUB_BASE_URL=https://api.starhubsolutions.com/v1" -ForegroundColor White
Write-Host ""
Write-Host "5. Clique em 'Deploy' e aguarde!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentacao completa em: VERCEL_DEPLOY.md" -ForegroundColor Cyan
