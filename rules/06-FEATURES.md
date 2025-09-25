# Features - Funcionalidades

## Home - Destaques
- **Sem abas** - mostrar passeios e pousadas misturados (aleatório)
- **CTA**: "Ver todos os passeios →"
- **Dados**:
  - Tours: `GET /tours?limit=8&status=active`
  - Stays: `GET /products/extended?type=accommodation&limit=8`
- **Grid**: mesma grade/gaps dos cards das outras seções
- **Estados**: skeleton + empty + erro

## Lista de Passeios (/tours)
- **Filtros**: busca, preço min/max, local, ordenar
- **Grid**: mesma grade da home
- **Paginação**: navegação entre páginas
- **Estados**: loading, error, empty
- **Cards**: FeaturedCard com dados da API

## Lista de Pousadas (/accommodations)
- **Filtros**: busca, tipo, local, preço min/max
- **Grid**: mesma grade da home
- **Paginação**: navegação entre páginas
- **Estados**: loading, error, empty
- **Cards**: FeaturedCard com dados da API

## Página de Passeio (/tours/[slug])
- **Galeria**: imagens do tour
- **Info**: rating, duração, capacidade, localização
- **Includes/Excludes**: o que está incluído
- **Meeting Point**: local de encontro
- **Política**: cancelamento, etc.
- **Painel lateral**:
  - CalendarAvailability (datas da API)
  - Seleção de participantes
  - PriceSummary (pricing da API)
  - Botão Reservar
- **Para tours**: date-picker simples (dia único)

## Página de Pousada (/accommodations/[slug])
- **Galeria**: imagens da acomodação
- **Amenities**: comodidades disponíveis
- **Policies**: políticas de cancelamento, check-in/out
- **Horários**: check-in/checkout específicos
- **Range date-picker**: check-in/checkout com mínimo de noites
- **Bloqueio**: tipo Airbnb (não permite checkout antes do mínimo)
- **Preço total**: cálculo com breakdown detalhado
- **CTA**: reservar/adicionar ao carrinho

## Funcionalidades Comuns
- **Breadcrumb**: navegação hierárquica
- **Loading states**: skeleton durante carregamento
- **Error handling**: mensagens amigáveis + ação
- **Empty states**: quando não há resultados
- **Responsive**: adaptação para mobile/tablet/desktop
- **i18n**: todas as strings traduzidas
- **SEO**: meta tags dinâmicas

## Integração API
- **Todas as páginas** consomem API real (sem mocks)
- **Tratamento de erros** padronizado
- **Cache** quando apropriado
- **Loading states** durante requisições
- **Retry** em caso de erro
