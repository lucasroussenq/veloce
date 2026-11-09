# Veloce Sprint 00 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a fundação Laravel + Angular + MySQL do Veloce com health check funcional, base visual responsiva e documentação mínima reproduzível.

**Architecture:** Monorepo com `backend/` Laravel como API REST e `frontend/` Angular standalone como cliente separado. MySQL 8.4 roda em Docker Compose; o frontend acessa a API por URL configurável e o backend valida a conexão no endpoint `/api/health`.

**Tech Stack:** PHP 8.4, Laravel 13, Composer, Angular 17, TypeScript, SCSS, Angular Router, HttpClient, PHPUnit, MySQL 8.4, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-11-09-veloce-sprint-00-design.md`

## Global Constraints

- Usar Laravel, PHP, API REST, Eloquent ORM e PHPUnit ou Pest.
- Usar Angular, TypeScript, SCSS, Angular Router, componentes reutilizáveis e formulários reativos quando houver formulários.
- Usar MySQL 8.4 LTS em Docker Compose; não usar PostgreSQL.
- Não implementar pagamentos, WhatsApp, IA, marketplace ou módulos operacionais completos.
- Não versionar credenciais ou segredos.
- Preservar separação entre frontend e backend e preparar isolamento por estabelecimento.

## Review Focus

- Banco indisponível: `/api/health` deve responder estado degradado com status HTTP coerente, sem vazar credenciais.
- API em origem diferente: CORS e URL de ambiente devem permitir o frontend local consultar o backend.
- Primeiro carregamento lento/erro de rede: a tela inicial deve exibir estado de carregamento e erro explícitos.
- Mobile estreito: navegação e cards devem continuar legíveis sem overflow horizontal.
- Ambiente sem dependências globais: os comandos documentados devem usar CLIs locais ou `npx` quando possível.

### Task 1: Repository foundation and documentation

**Files:**
- Create: `README.md`, `AGENTS.md`, `.gitignore`, `.env.example`, `compose.yaml`
- Create: `docs/product/vision.md`, `docs/product/mvp.md`, `docs/architecture/decisions.md`, `docs/backlog.md`
- Create: `infra/mysql/init/README.md`

**Interfaces:**
- Produces the repository layout, environment contract and commands consumed by later tasks and developers.

- [ ] Write documentation and repository files with the exact Sprint 00 scope, local commands, environment variables and tenant rule.
- [ ] Verify required paths exist and no secret values are present.

### Task 2: Laravel API and database integration

**Files:**
- Create: generated `backend/` Laravel application
- Modify: `backend/routes/api.php`, `backend/.env.example`, `backend/config/cors.php`
- Create: `backend/app/Http/Controllers/Api/HealthController.php`
- Create: `backend/tests/Feature/HealthEndpointTest.php`

**Interfaces:**
- Produces `GET /api/health` returning JSON with `status`, `application`, `database`, and `timestamp` fields; healthy response uses HTTP 200 and degraded database response uses HTTP 503.

- [ ] Write the health feature test and run it to observe failure before the controller/route exists.
- [ ] Generate Laravel, configure MySQL environment defaults, add the health route/controller and CORS.
- [ ] Run migrations, run the health feature test and the complete backend test suite.

### Task 3: Angular client and Veloce design system

**Files:**
- Create: generated `frontend/` Angular application
- Modify: `frontend/src/app/app.routes.ts`, `frontend/src/app/app.config.ts`, `frontend/src/styles.scss`
- Create: `frontend/src/app/core/api/health.service.ts`
- Create: `frontend/src/app/shared/layout/app-shell.component.*`
- Create: `frontend/src/app/features/overview/overview-page.component.*`
- Create: `frontend/src/environments/environment*.ts`

**Interfaces:**
- Consumes `GET /api/health` from the backend using the configured `apiBaseUrl`.
- Produces a responsive overview route at `/` with health loading, healthy and error states.

- [ ] Write the Angular service/component tests for API URL usage and visible loading/healthy/error states; run them red.
- [ ] Generate Angular, implement the Swiss visual tokens, shell, router, HttpClient and health integration.
- [ ] Run Angular unit tests and production build.

### Task 4: End-to-end local verification and handoff

**Files:**
- Modify: `README.md` only if verification exposes incorrect commands or assumptions.
- Create: `.gitkeep` files only where an empty required directory needs to be retained.

**Interfaces:**
- Verifies the contracts produced by Tasks 1–3 together.

- [ ] Start MySQL with Compose and verify container readiness.
- [ ] Run Laravel migrations and exercise `/api/health` against the live database.
- [ ] Start Angular and verify the frontend build and API configuration.
- [ ] Run backend and frontend test suites, record actual results and list any unavailable system dependency.
