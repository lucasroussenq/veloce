# Veloce Sprint 00 — Design

## Intent

Entregar uma base executável para o SaaS B2B Veloce, voltada à operação diária de lava-rápidos, com frontend e backend separados, banco local reproduzível e uma primeira tela que confirma a integração ponta a ponta.

## Goals

- Inicializar Laravel como API REST e Angular como aplicação web.
- Executar MySQL 8.4 LTS com Docker Compose.
- Expor `GET /api/health` com verificação real da conexão com o banco.
- Preparar configuração de CORS, ambientes, migrations, seeders e isolamento futuro por estabelecimento.
- Criar uma base visual responsiva, reutilizável e operacional, sem landing page de marketing.
- Documentar instalação, visão, MVP, decisões e backlog.

## Non-goals

- Não implementar clientes, veículos, serviços, agendamentos, fila, pagamentos, WhatsApp, IA ou marketplace.
- Não implementar autenticação ou Sanctum nesta sprint; apenas deixar a API organizada para recebê-los.
- Não adicionar microserviços, Kubernetes ou infraestrutura de produção.

## Constraints

- Laravel 13 compatível com PHP 8.4, Angular 17 compatível com Node 18, TypeScript, SCSS e MySQL 8.4.
- O repositório deve manter `frontend/`, `backend/`, `docs/`, `infra/` e `compose.yaml` na raiz.
- Nenhum segredo deve ser versionado; apenas `.env.example` será documentado.
- O trabalho será executado no workspace atual porque o repositório ainda não é um checkout Git inicializado e a especificação pede a entrega neste diretório.

## Approaches

1. **CLIs oficiais com frontend/backend separados — escolhido.** Gera a estrutura suportada por Laravel e Angular, reduz decisões manuais e mantém os ciclos de desenvolvimento independentes. O custo é executar dois servidores locais.
2. **Laravel servindo o build do Angular.** Simplifica o número de portas e o deploy inicial, mas mistura responsabilidades e dificulta a separação solicitada.
3. **Dockerizar PHP, Node e MySQL.** Maximiza a paridade entre máquinas, porém adiciona imagens, volumes e troubleshooting desnecessários para a fundação local.

## Decisões de design

- **Visual:** anchor Swiss, com superfícies neutras, azul cobalto como acento, regras finas, grade assimétrica e tipografia sans. A faixa de status da API é o elemento distintivo da tela inicial.
- **Backend:** `/api` como fronteira pública; health check em controller dedicado; conexão verificada via `DB::connection()->getPdo()`.
- **Multi-tenancy:** as futuras tabelas de negócio deverão carregar `establishment_id` e consultas deverão passar por escopo/serviço de tenant; Sprint 00 documenta a regra, sem inventar módulos.
- **Frontend:** Angular standalone, `provideHttpClient`, router e serviço de health separado do componente visual.
- **Banco:** MySQL no Compose, com banco, usuário e senha configuráveis por ambiente.

## Builder notes

O builder deve priorizar uma base pequena, legível e verificável. Dependências devem ser instaladas somente quando necessárias para gerar os projetos e executar os testes. A tela inicial deve exibir somente informações reais da integração ou estados explicitamente vazios, sem dados fictícios.
