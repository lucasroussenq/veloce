# Veloce Customers and Vehicles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar cadastro e consulta de clientes e veículos vinculados ao estabelecimento autenticado.

**Architecture:** A API Laravel expõe recursos protegidos por Sanctum. Clientes e veículos carregam `establishment_id`; o controller deriva o estabelecimento do usuário autenticado e nunca aceita esse campo do cliente. O Angular consome a API em uma página operacional com listagem e formulários reativos simples.

**Tech Stack:** Laravel 13, Eloquent, Sanctum, PHPUnit, Angular 17, Reactive Forms, TypeScript, SCSS.

## Global Constraints

- Não implementar serviços, agenda, pagamentos ou WhatsApp nesta entrega.
- Toda consulta deve ser filtrada pelo estabelecimento autenticado.
- Não aceitar `establishment_id` no payload público.
- Validar backend com PHPUnit e frontend com `npm run build`.

### Task 1: Customer and vehicle persistence

**Files:**
- Create: migrations for `customers` and `vehicles`
- Create: `backend/app/Models/Customer.php`, `backend/app/Models/Vehicle.php`
- Modify: `backend/app/Models/Establishment.php`
- Create: `backend/tests/Feature/CustomerVehicleApiTest.php`

- [ ] Write failing API tests for tenant-scoped customer/vehicle creation and cross-tenant isolation.
- [ ] Implement migrations, relationships and factories/test setup.
- [ ] Run focused tests and migrations.

### Task 2: Customer and vehicle API

**Files:**
- Create: `backend/app/Http/Controllers/Api/CustomerController.php`
- Create: `backend/app/Http/Controllers/Api/VehicleController.php`
- Modify: `backend/routes/api.php`

- [ ] Add protected index/store/show endpoints for customers and nested vehicles.
- [ ] Validate vehicle ownership through the authenticated establishment.
- [ ] Run the complete backend suite.

### Task 3: Angular operational screens

**Files:**
- Create: `frontend/src/app/core/api/customer.service.ts`
- Create: `frontend/src/app/features/customers/customers-page.component.*`
- Modify: `frontend/src/app/app.routes.ts`
- Modify: `frontend/src/app/shared/layout/app-shell.component.*`
- Modify: `frontend/src/styles.scss`

- [ ] Add `/clientes` route with reactive customer and vehicle forms.
- [ ] Add loading, empty, success and error states using real API data.
- [ ] Run Angular production build.
