# veloce
Veloce é um SaaS B2B para lava-rápidos, centros de lavagem e estéticas automotivas. 
 
  A plataforma foi projetada para organizar clientes, veículos, serviços, agendamentos e a operação diária de estabelecimentos automotivos. 
 
  ## Stack 
 
  - Laravel 13 
  - PHP 8.4 
  - Laravel Sanctum 
  - Angular 17 
  - TypeScript 
  - SCSS 
  - MySQL 8.4 
  - Docker Compose 
  - PHPUnit 
 
  ## Estrutura 
 
  ```text 
  frontend/   Aplicação Angular 
  backend/    API Laravel 
  docs/       Documentação do produto e arquitetura 
  infra/      Configurações de infraestrutura 
  compose.yaml 
 
  ## Funcionalidades atuais 
 
  • Cadastro e login de usuários 
  • Autenticação via Laravel Sanctum 
  • Cadastro inicial de estabelecimento 
  • Estrutura multi-tenant por estabelecimento 
  • Endpoint de saúde da API 
  • Interface operacional responsiva 
  • Verificação da conexão com o banco de dados 
 
  ## Executando localmente 
 
  cp .env.example .env 
  docker compose up -d mysql 
 
  cd backend 
  cp .env.example .env 
  php artisan key:generate 
  php artisan migrate 
  php artisan serve --host=127.0.0.1 --port=8000

  Em outro terminal: 
 
  cd frontend 
  npm install 
  npm start 
 
  Acesse: 
 
  http://localhost:4200 
 
  ## Testes 
 
  Backend: 
 
  cd backend 
  php artisan test 
 
  Frontend: 
 
  cd frontend 
  npm run build 
 
  ## Próximos módulos 
 
  • Clientes e veículos 
  • Catálogo de serviços e preços 
  • Agendamentos 
  • Fila operacional 
  • Histórico de atendimentos 
  • Dashboard operacional 
  • Pagamentos e sinal via Pix 
 
  ## Status 
 
  Projeto em desenvolvimento inicial 
