# Veloce Auth and Tenant Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar o primeiro fluxo de negócio do Veloce: autenticação por token, estabelecimento inicial e contexto de tenant.

**Architecture:** Laravel Sanctum protege a API. Um registro cria usuário e estabelecimento numa transação e associa ambos pela tabela pivô `establishment_user`; endpoints autenticados resolvem o usuário atual e retornam seus estabelecimentos sem confiar em IDs enviados pelo cliente.

**Tech Stack:** Laravel 13, Sanctum, Eloquent, PHPUnit, Angular 17, TypeScript, SCSS.

## Global Constraints

- Não implementar clientes, veículos, serviços, agenda, pagamentos, WhatsApp ou IA nesta sprint.
- Não versionar tokens ou credenciais.
- A associação usuário-estabelecimento deve permitir múltiplos estabelecimentos futuros.
- Todo endpoint protegido deve exigir `auth:sanctum`.

### Task 1: Sanctum and tenant schema

**Files:**
- Modify: `backend/composer.json`, `backend/composer.lock`
- Create: `backend/database/migrations/*_create_establishments_table.php`
- Create: `backend/database/migrations/*_create_establishment_user_table.php`
- Create: `backend/app/Models/Establishment.php`
- Modify: `backend/app/Models/User.php`

- [ ] Add Sanctum and publish its migration/config.
- [ ] Create establishment and user pivot schema with unique association and role.
- [ ] Run migrations and model tests.

### Task 2: Auth API

**Files:**
- Create: `backend/app/Http/Controllers/Api/AuthController.php`
- Modify: `backend/routes/api.php`
- Create: `backend/tests/Feature/AuthApiTest.php`

- [ ] Write failing feature tests for register, login, `/api/me` and logout.
- [ ] Implement validation, transactions, token issuing/revocation and tenant serialization.
- [ ] Run the focused and complete backend suites.

### Task 3: Angular authentication surface

**Files:**
- Modify: `frontend/src/app/app.routes.ts`, `frontend/src/app/app.config.ts`
- Create: `frontend/src/app/core/auth/auth.service.ts`
- Create: `frontend/src/app/features/auth/login-page.component.*`
- Modify: `frontend/src/app/shared/layout/app-shell.component.*`

- [ ] Add login route and reactive form with loading/error states.
- [ ] Store the Sanctum token locally and attach it to authenticated requests.
- [ ] Keep the operational overview available after authentication.
- [ ] Run production build.
