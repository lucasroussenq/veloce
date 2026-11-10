# Veloce — orientações para agentes

## Objetivo

Veloce é um SaaS B2B para operação de lava-rápidos, centros de lavagem e estéticas automotivas.

## Estrutura

- `backend/`: API Laravel, domínio, migrations e testes PHPUnit.
- `frontend/`: aplicação Angular, componentes, estilos e testes.
- `docs/`: visão, MVP, arquitetura e backlog.
- `infra/`: suporte local de infraestrutura.

## Regras de implementação

- Respeitar a separação frontend/backend e usar `/api` para endpoints.
- Não adicionar pagamentos, WhatsApp, IA, marketplace ou módulos operacionais fora do escopo sem solicitação explícita.
- Toda futura tabela de negócio deve prever `establishment_id` e toda consulta deve aplicar o tenant atual.
- Nunca versionar `.env`, credenciais ou tokens.
- Preferir soluções pequenas, testáveis e compatíveis com PHP 8.4, Node 18 e MySQL 8.4.
- Para toda task que altere comportamento, criar ou atualizar testes antes da implementação e executá-los antes de concluir.
- Antes de afirmar que algo funciona, executar os testes/builds correspondentes.

## Comandos

O ambiente usa `rtk` como proxy de terminal; quando disponível, prefixe comandos de shell com `rtk`. Comandos principais estão no `README.md`.
