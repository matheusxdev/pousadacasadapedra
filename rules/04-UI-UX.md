# UI/UX Guidelines

## Layout e Container
- **Container**: mesma largura em todas as seções
- **Max-width**: 1200px
- **Padding lateral**: 2rem desktop, 1rem mobile
- **Centralizado**: `margin: 0 auto`

## Grids Responsivos
- **Desktop (≥1024px)**: 4 colunas
- **Tablet (768px-1023px)**: 2-3 colunas
- **Mobile (<768px)**: carrossel horizontal com scroll-snap
- **Gap consistente**: 2rem desktop, 1.5rem mobile

## Cards e Alinhamento
- **Cards alinhados** pela base (botão encostado)
- **Altura consistente**: `height: 100%`
- **Botão fixo**: `margin-top: auto`
- **Aspect ratio**: 16:9 para imagens

## Hero Slider
- **CTA contido** (não exagerado)
- **Setas funcionais** (não só decorativas)
- **Dots clicáveis** com indicador ativo
- **Autoplay** com pausa on-hover
- **Animações suaves** (transition: 0.3s ease)

## Category Cards
- **Ícone NÃO some** no hover
- **Círculo mantém cor** de fundo
- **Ícone com stroke**: `#fff`
- **Hover suave** sem mudanças bruscas

## Acessibilidade
- **:focus-visible** para navegação por teclado
- **Alt text** em todas as imagens
- **Contraste adequado** (WCAG AA)
- **ARIA labels** quando necessário
- **Navegação por teclado** funcional

## Estados Visuais
- **Loading**: skeleton com animação
- **Error**: ícone + mensagem + ação
- **Empty**: ícone + mensagem + CTA
- **Hover**: transform suave (translateY(-2px))

## Espaçamentos
- **Seções**: 3rem entre seções principais
- **Elementos**: 1rem entre elementos relacionados
- **Cards**: 2rem gap entre cards
- **Padding interno**: 1.5rem desktop, 1rem mobile
