# Decisões de arquitetura

## Monólito modular

Laravel concentra a API e o domínio em um monólito modular. Microserviços e Kubernetes não agregam valor nesta fase.

## Frontend separado

Angular roda como aplicação separada e consome uma API REST. Isso mantém ciclos de UI e backend independentes e permite evolução para deploys separados.

## Multi-tenancy por estabelecimento

O estabelecimento será o tenant. Entidades de negócio devem ter `establishment_id`; o tenant atual deve ser resolvido pela autenticação e aplicado em escopos/serviços de consulta. Nenhuma consulta deve confiar apenas em IDs recebidos pelo cliente.

## Banco local

MySQL 8.4 roda via Docker Compose para reduzir divergência entre ambientes. Segredos locais ficam em `.env` não versionado.

## API health

`GET /api/health` é um endpoint público de diagnóstico local, sem informações sensíveis, retornando 200 quando app e banco estão disponíveis e 503 quando a conexão falha.
