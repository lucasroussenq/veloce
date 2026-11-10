# Customers and Vehicles Completion Plan

**Goal:** Fechar o primeiro módulo operacional com edição, exclusão e detalhes completos de clientes e veículos.

**Scope:** API Sanctum já existente, isolamento pelo `TenantContext`, formulários Angular reutilizados para criar/editar e confirmação explícita antes de exclusões.

**Stop condition:** Usuário autenticado consegue listar, criar, editar e excluir clientes e veículos somente do estabelecimento selecionado; build e testes passam.
