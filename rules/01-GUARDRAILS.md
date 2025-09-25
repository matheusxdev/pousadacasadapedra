# Guardrails - Regras Rígidas

## CSS e Design
- **Sem Tailwind**; CSS puro em SFCs, seguindo BEM
- **Não tocar** no roteamento já existente (apenas corrigir quando solicitado)

## API e Dados
- **Em API**: usar as rotas StarHub documentadas; não inventar campos
- **Se endpoint não existir** no `/server/api`, crie proxy simples (com headers e cache leve)
- **Erro 404/500**: tratamento amigável no UI (mensagem + opção voltar)

## Refatoração e Arquivos
- **Sem refactors "grandes"** sem pedido explícito
- **Sem deletar** componentes/arquivos existentes
- **Pergunte ao invés de supor** (quando algo estiver ambíguo)

## Comportamento
- **Não alucinar** dados ou endpoints
- **Consulte /docs** quando em dúvida sobre contratos
- **Mantenha consistência** com arquitetura existente

## Exceções
- Apenas quando **explicitamente solicitado**
- Com **aprovação prévia** do usuário
- **Documentando** todas as mudanças
