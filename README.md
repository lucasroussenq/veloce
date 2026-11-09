# Veloce

Base do Veloce, um SaaS B2B para lava-rápidos, centros de lavagem e estéticas automotivas.

## Stack

- Backend: Laravel 13, PHP 8.4, API REST, Eloquent e PHPUnit.
- Frontend: Angular 19, TypeScript, SCSS, Router e HttpClient.
- Banco: MySQL 8.4 LTS via Docker Compose.

## Pré-requisitos

PHP 8.4+, Composer 2+, Node.js 18.19+, npm 9+ e Docker com Compose.

## Instalação

```bash
cp .env.example .env
docker compose up -d mysql

cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Em outro terminal:

```bash
cd frontend
npm install
npm start -- --host 127.0.0.1 --port 4200
```

Abra `http://localhost:4200`. A tela inicial consulta `http://localhost:8000/api/health`.

## Verificações

```bash
docker compose ps
cd backend && php artisan test
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
cd frontend && npm run build
```

O endpoint `GET http://localhost:8000/api/health` verifica a aplicação e a conexão com o MySQL. Quando o banco não está disponível, responde HTTP 503 sem expor credenciais.

## Primeiro acesso

O frontend abre a tela de acesso. É possível criar o primeiro usuário e estabelecimento ou entrar com uma conta existente. A API oferece `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me` e `POST /api/auth/logout`; os endpoints protegidos usam Laravel Sanctum.

## Escopo da Sprint 00

Esta sprint entrega infraestrutura, integração básica e design system operacional. Clientes, veículos, serviços, agendamentos, fila, funcionários, pagamentos, Pix, autenticação e múltiplos estabelecimentos ficam para as próximas sprints.

## Documentação

- [Visão do produto](docs/product/vision.md)
- [Escopo do MVP](docs/product/mvp.md)
- [Decisões de arquitetura](docs/architecture/decisions.md)
- [Backlog](docs/backlog.md)
