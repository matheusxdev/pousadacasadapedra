# Páginas de Erro Personalizadas

Este documento descreve o sistema de páginas de erro personalizadas implementado no projeto Casa da Pedra.

## 📁 Arquivos Criados

### Páginas de Erro
- `src/pages/error.vue` - Página de erro genérica
- `src/pages/404.vue` - Página de erro 404 (não encontrado)
- `src/pages/500.vue` - Página de erro 500 (erro interno do servidor)

### Componentes
- `src/components/ErrorBoundary.vue` - Componente para capturar erros em componentes Vue

### Página de Teste
- `src/pages/test-error.vue` - Página para testar as telas de erro

## 🎨 Design

### Características Visuais
- **Cores da Marca**: Uso consistente de `--brand: #FF6700` e `--brand-600: #E55A00`
- **Layout Responsivo**: Adaptável para mobile e desktop
- **Ícones Semânticos**: Uso de Heroicons para melhor comunicação visual
- **Animações**: Transições suaves e efeitos hover
- **Tipografia**: Hierarquia clara com diferentes tamanhos de fonte

### Elementos Visuais Únicos
- **404**: Número grande com ícone de mapa sobreposto
- **500**: Ícone de ferramenta com efeitos de sparkle animados
- **ErrorBoundary**: Design minimalista para componentes

## 🌐 Internacionalização

Todas as páginas de erro suportam os três idiomas:
- **Português (pt)** - Idioma padrão
- **Inglês (en)** - Tradução completa
- **Espanhol (es)** - Tradução completa

### Chaves de Tradução
```json
{
  "error": {
    "goHome": "Ir para início",
    "goBack": "Voltar",
    "tryAgain": "Tentar novamente",
    "showDetails": "Mostrar detalhes técnicos",
    "notFound": {
      "title": "Página não encontrada",
      "message": "A página que você está procurando não existe ou foi movida.",
      "suggestions": "Talvez você queira visitar:"
    },
    "serverError": {
      "title": "Erro interno do servidor",
      "message": "Ocorreu um erro interno. Nossa equipe foi notificada e está trabalhando para resolver o problema.",
      "status": "Código de erro:",
      "help": "Se o problema persistir, entre em contato conosco.",
      "contact": "Fale conosco"
    },
    "boundary": {
      "title": "Algo deu errado",
      "message": "Ocorreu um erro inesperado. Tente recarregar a página ou entre em contato conosco se o problema persistir.",
      "report": "Reportar erro"
    }
  }
}
```

## 🔧 Funcionalidades

### Página de Erro Genérica (`error.vue`)
- **Detecção Automática**: Identifica o tipo de erro pelo `statusCode`
- **Mensagens Contextuais**: Diferentes mensagens para 404, 500, 403, etc.
- **Detalhes Técnicos**: Mostra stack trace em modo de desenvolvimento
- **Ações**: Botões para voltar ao início ou voltar à página anterior

### Página 404 (`404.vue`)
- **Sugestões de Navegação**: Links para páginas principais
- **Design Único**: Número 404 grande com ícone sobreposto
- **Navegação**: Botões para voltar ao início ou voltar

### Página 500 (`500.vue`)
- **Status do Erro**: Exibe código de erro 500
- **Ação de Retry**: Botão para tentar novamente
- **Suporte**: Link para contato
- **Animações**: Efeitos de sparkle no ícone

### ErrorBoundary (`ErrorBoundary.vue`)
- **Captura de Erros**: Intercepta erros em componentes Vue
- **Recuperação**: Opção de recarregar a página
- **Reporte**: Sistema para reportar erros (extensível)
- **Detalhes**: Stack trace em modo de desenvolvimento

## 🚀 Como Usar

### Páginas de Erro Automáticas
As páginas de erro são ativadas automaticamente pelo Nuxt.js quando ocorrem erros HTTP:
- **404**: Quando uma rota não existe
- **500**: Quando ocorre erro interno do servidor
- **error.vue**: Para outros tipos de erro

### ErrorBoundary em Componentes
```vue
<template>
  <ErrorBoundary>
    <ComponenteQuePodeFalhar />
  </ErrorBoundary>
</template>
```

### Simulação de Erros (Desenvolvimento)
Acesse `/test-error` para testar todas as páginas de erro:
- Simular erro 404
- Simular erro 500
- Simular erro de componente

## 🎯 Benefícios

### Para Usuários
- **Experiência Consistente**: Design uniforme em todas as páginas de erro
- **Navegação Clara**: Opções claras para continuar navegando
- **Informações Úteis**: Mensagens amigáveis e sugestões de navegação
- **Suporte**: Canais claros para obter ajuda

### Para Desenvolvedores
- **Debugging**: Detalhes técnicos em modo de desenvolvimento
- **Monitoramento**: Sistema de reporte de erros
- **Manutenção**: Código organizado e reutilizável
- **Testes**: Página dedicada para testar erros

## 🔮 Extensões Futuras

### Possíveis Melhorias
1. **Integração com Serviços de Monitoramento**
   - Sentry para tracking de erros
   - LogRocket para replay de sessões
   - Google Analytics para métricas de erro

2. **Personalização Avançada**
   - Temas customizáveis
   - Animações mais elaboradas
   - Integração com chatbot de suporte

3. **Analytics de Erro**
   - Dashboard de erros mais comuns
   - Métricas de recuperação
   - Relatórios automáticos

## 📝 Notas Técnicas

### Dependências
- **Vue 3**: Composition API
- **Nuxt 4**: Sistema de roteamento
- **Heroicons**: Ícones SVG
- **CSS Variables**: Sistema de design tokens

### Performance
- **Lazy Loading**: Páginas carregadas sob demanda
- **Otimização**: CSS otimizado e componentes leves
- **Caching**: Meta tags otimizadas para SEO

### Acessibilidade
- **ARIA Labels**: Atributos para screen readers
- **Contraste**: Cores com contraste adequado
- **Navegação por Teclado**: Suporte completo
- **Semântica**: HTML semântico correto
