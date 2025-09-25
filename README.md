# Casa da Pedra - Sistema de Reservas Completo

Sistema completo de reservas para a Casa da Pedra, uma agência de turismo moderna com suporte a múltiplos idiomas e autenticação inteligente.

## 🚀 Características

- **Design Responsivo**: Interface moderna e adaptável para todos os dispositivos
- **Internacionalização**: Suporte completo para Português, Espanhol e Inglês
- **Autenticação Inteligente**: Sistema que identifica clientes automaticamente
- **Componentes Reutilizáveis**: Arquitetura modular com componentes padronizados
- **Integração API**: Conectado à API StarHub para dados em tempo real
- **Carrinho de Compras**: Sistema completo de carrinho com persistência
- **Calendário Interativo**: Seleção de datas com disponibilidade em tempo real
- **Sistema de Pagamento**: Múltiplas formas de pagamento (Cartão, PIX, Boleto)

## 🛠️ Tecnologias

- **Vue 3** com Composition API
- **TypeScript** para tipagem estática
- **Pinia** para gerenciamento de estado
- **Vue Router** com suporte a idiomas
- **Vue I18n** para internacionalização
- **Tailwind CSS** para estilização
- **Heroicons** para ícones
- **Date-fns** para manipulação de datas
- **Vite** como bundler

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🌐 Internacionalização

O sistema detecta automaticamente o idioma do usuário baseado em:
1. Configuração salva no localStorage
2. Idioma do navegador
3. País detectado por IP (futuro)
4. Fallback para Português

### Idiomas Suportados
- 🇧🇷 Português (pt)
- 🇪🇸 Español (es)  
- 🇺🇸 English (en)

## 🔐 Sistema de Autenticação

### Autenticação Inteligente
- **Sem Login Obrigatório**: Usuários podem fazer reservas sem criar conta
- **Identificação Automática**: Sistema identifica clientes existentes por CPF/Email
- **Criação Automática**: Contas são criadas automaticamente durante a reserva
- **Login Social**: Suporte a Google e Facebook (futuro)

### Fluxo de Reserva
1. Usuário preenche dados pessoais
2. Sistema verifica se cliente existe
3. Se não existe, solicita criação de senha
4. Cliente é automaticamente registrado
5. Próximas reservas são facilitadas

## 🎨 Design System

### Cores Principais
- **Azul Primário**: `#002279` - Navegação e textos principais
- **Laranja Primário**: `#fc6807` - Botões e destaques
- **Cinza**: Escala completa para backgrounds e textos

### Componentes Reutilizáveis
- `NavHeader`: Cabeçalho com navegação e seletor de idioma
- `Button`: Botões padronizados com múltiplas variantes
- `Calendar`: Calendário interativo com disponibilidade
- `LanguageSelector`: Seletor de idiomas com bandeiras

## 📱 Páginas Principais

- **Home**: Página inicial com busca e destaques
- **Tours**: Listagem de passeios com filtros
- **Tour Detail**: Detalhes completos do passeio
- **Booking**: Fluxo completo de reserva
- **Profile**: Área do cliente
- **Login/Register**: Autenticação

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_STARHUB_BASE_URL=https://api.starhubsolutions.com/v1
VITE_STARHUB_TOKEN=seu_token_aqui
```

### Rotas com Idiomas
- `/` - Português (padrão)
- `/en/` - Inglês
- `/es/` - Espanhol
- `/pt/` - Português (explícito)

## 📊 Estado Global (Pinia)

### Stores
- **LanguageStore**: Gerenciamento de idiomas
- **AuthStore**: Autenticação e dados do usuário
- **CartStore**: Carrinho de compras

## 🚀 Deploy

### Build para Produção
```bash
npm run build:prod
```

### Servidor Node.js
```bash
npm start
```

### PM2
```bash
npm run pm2:start    # Iniciar
npm run pm2:stop     # Parar  
npm run pm2:restart  # Reiniciar
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── NavHeader.vue
│   ├── Button.vue
│   ├── Calendar.vue
│   └── LanguageSelector.vue
├── views/               # Páginas principais
│   ├── Home.vue
│   ├── Tours.vue
│   ├── TourDetail.vue
│   ├── Booking.vue
│   ├── Profile.vue
│   ├── Login.vue
│   └── Register.vue
├── stores/              # Estado global (Pinia)
│   ├── language.ts
│   ├── auth.ts
│   └── cart.ts
├── i18n/                # Internacionalização
│   ├── index.ts
│   └── locales/
│       ├── pt.json
│       ├── es.json
│       └── en.json
├── api/                 # Integração com APIs
│   └── starhub.ts
└── router/              # Configuração de rotas
    └── index.ts
```

## 🔄 API Integration

### StarHub API
- **Base URL**: `https://api.starhubsolutions.com/v1`
- **Autenticação**: Token via header
- **Endpoints**: Tours, disponibilidade, reservas, pagamentos

### Fallback System
- Sistema inteligente com fallback para dados mockados
- Garante funcionamento mesmo com problemas de API
- Logs detalhados para debugging

## 🎯 Próximos Passos

- [ ] Integração com gateway de pagamento real
- [ ] Sistema de notificações (email/SMS)
- [ ] Dashboard administrativo
- [ ] Sistema de avaliações
- [ ] Integração com redes sociais
- [ ] App mobile (PWA)

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

*Desenvolvido com ❤️ usando Vue 3 + TypeScript + Vite*