# Diretrizes UI/UX

## 🎨 Visão Geral do Design

O Casa da Pedra foi desenvolvido com foco em uma experiência de usuário moderna, limpa e intuitiva, seguindo princípios de design centrado no usuário.

## 🎯 Princípios de Design

### 1. Simplicidade
- Interface limpa e minimalista
- Hierarquia visual clara
- Foco nos elementos essenciais

### 2. Consistência
- Padrões visuais uniformes
- Componentes reutilizáveis
- Comportamento previsível

### 3. Acessibilidade
- Contraste AA/AAA
- Navegação por teclado
- Suporte a leitores de tela

### 4. Responsividade
- Mobile-first
- Adaptação fluida
- Performance otimizada

## 🎨 Sistema de Cores

### Paleta Principal
```css
:root {
  /* Cores Primárias */
  --primary-blue: #002279;      /* Azul principal */
  --primary-orange: #fc6807;    /* Laranja principal */
  
  /* Cores Neutras */
  --surface: #ffffff;           /* Fundo principal */
  --surface-secondary: #f8fafc; /* Fundo secundário */
  --text: #1a1a1a;             /* Texto principal */
  --text-secondary: #64748b;   /* Texto secundário */
  --border: #e2e8f0;           /* Bordas */
  
  /* Estados */
  --success: #10b981;          /* Sucesso */
  --warning: #f59e0b;          /* Aviso */
  --error: #ef4444;            /* Erro */
  --info: #3b82f6;             /* Informação */
}
```

### Uso das Cores
- **Azul Primário**: Botões principais, links, elementos de destaque
- **Laranja Primário**: CTAs, hover states, elementos de ação
- **Superfície**: Fundos de cards, modais, seções
- **Texto**: Hierarquia de informação

## 📐 Sistema de Espaçamento

### Escala de Espaçamento
```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

### Aplicação
- **Cards**: `padding: var(--space-lg)`
- **Seções**: `margin: var(--space-xl) 0`
- **Elementos**: `gap: var(--space-md)`

## 🔤 Tipografia

### Hierarquia de Texto
```css
/* Títulos */
.hero-slider__title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
}

.section__title {
  font-size: clamp(1.875rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
}

/* Subtítulos */
.hero-slider__subtitle {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  font-weight: 400;
  line-height: 1.5;
}

/* Texto Corpo */
.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}

/* Texto Pequeno */
.small-text {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}
```

### Contraste e Legibilidade
- **Títulos**: Contraste mínimo 4.5:1
- **Texto**: Contraste mínimo 4.5:1
- **Links**: Contraste mínimo 3:1
- **Botões**: Contraste mínimo 4.5:1

## 🧩 Componentes

### Botões

#### Botão Primário
```css
.btn-primary {
  background-color: var(--primary-blue);
  color: var(--surface);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 200ms ease-in-out;
}

.btn-primary:hover {
  background-color: var(--primary-orange);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### Botão Secundário
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 200ms ease-in-out;
}

.btn-secondary:hover {
  background-color: var(--primary-blue);
  color: var(--surface);
}
```

### Cards

#### Card Base
```css
.card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

#### Card de Listagem
```css
.listing-card {
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-in-out;
}

.listing-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### Formulários

#### Campo de Entrada
```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 200ms ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 34, 121, 0.1);
}

.input--error {
  border-color: var(--error);
}
```

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First */
.component { }

/* Tablet */
@media (min-width: 768px) {
  .component { }
}

/* Desktop */
@media (min-width: 1200px) {
  .component { }
}
```

### Grid System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.grid {
  display: grid;
  gap: var(--space-lg);
}

.grid--2-cols {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3-cols {
  grid-template-columns: repeat(3, 1fr);
}

.grid--4-cols {
  grid-template-columns: repeat(4, 1fr);
}

/* Responsivo */
@media (max-width: 767px) {
  .grid--2-cols,
  .grid--3-cols,
  .grid--4-cols {
    grid-template-columns: 1fr;
  }
}
```

### SearchCard Responsivo
```css
.search-card__fields {
  display: grid;
  gap: var(--space-md);
}

/* Desktop */
@media (min-width: 1200px) {
  .search-card__fields {
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    grid-template-areas: "destino checkin checkout hospedes buscar";
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1199px) {
  .search-card__fields {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
      "destino destino destino"
      "checkin checkout hospedes"
      "buscar buscar buscar";
  }
}

/* Mobile */
@media (max-width: 767px) {
  .search-card__fields {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "destino"
      "checkin"
      "checkout"
      "hospedes"
      "buscar";
  }
}
```

## 🎭 Animações e Transições

### Transições Padrão
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}
```

### Microinterações
```css
/* Hover Effects */
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Focus States */
.interactive:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Loading States */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-blue);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### HeroSlider Animations
```css
@keyframes kenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.06); }
}

.hero-slider__slide--entering {
  animation: kenBurns 8s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .hero-slider__slide--entering {
    animation: none;
  }
}
```

## ♿ Acessibilidade

### Contraste
- **AA**: Contraste mínimo 4.5:1 para texto normal
- **AAA**: Contraste mínimo 7:1 para texto pequeno
- **Botões**: Contraste mínimo 4.5:1

### Navegação por Teclado
```css
.interactive:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-blue);
  color: var(--surface);
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### ARIA Labels
```vue
<template>
  <button 
    aria-label="Trocar idioma"
    aria-expanded="false"
    aria-haspopup="true"
  >
    <span class="fi fi-br" aria-hidden="true"></span>
  </button>
</template>
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🎨 Estados Visuais

### Estados de Botão
```css
.btn {
  /* Normal */
  background-color: var(--primary-blue);
  color: var(--surface);
  
  /* Hover */
  &:hover {
    background-color: var(--primary-orange);
    transform: translateY(-2px);
  }
  
  /* Active */
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
  
  /* Focus */
  &:focus-visible {
    outline: 2px solid var(--primary-blue);
    outline-offset: 2px;
  }
  
  /* Disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}
```

### Estados de Formulário
```css
.input {
  /* Normal */
  border-color: var(--border);
  
  /* Focus */
  &:focus {
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(0, 34, 121, 0.1);
  }
  
  /* Error */
  &--error {
    border-color: var(--error);
  }
  
  /* Success */
  &--success {
    border-color: var(--success);
  }
}
```

## 📊 Métricas de UX

### Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Acessibilidade
- **Contraste**: AA/AAA compliance
- **Navegação**: Suporte completo a teclado
- **Screen Readers**: Compatibilidade total
- **Reduced Motion**: Respeitado

### Usabilidade
- **Mobile-First**: Design otimizado para mobile
- **Touch Targets**: Mínimo 44px
- **Loading States**: Feedback visual claro
- **Error Handling**: Mensagens claras e úteis
