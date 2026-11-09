# Veloce UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevar a tela operacional inicial para uma experiência Swiss premium, bonita, clara e reutilizável.

**Architecture:** Preservar Angular standalone, o shell existente e a integração real com `/api/health`. Concentrar a mudança no sistema de tokens e nos templates/estilos da tela, sem introduzir bibliotecas visuais ou dados fictícios.

**Tech Stack:** Angular 17, TypeScript, SCSS, Router e HttpClient.

## Global Constraints

- Manter a tela responsiva e legível em celulares.
- Não criar landing page, dados fictícios ou funcionalidades fora do escopo.
- Usar uma única direção visual Swiss: superfícies neutras, navy/ink, um acento cobalto e regras finas.
- Validar com `npm run build`.

### Task 1: Polish the operational shell

**Files:**
- Modify: `frontend/src/app/shared/layout/app-shell.component.html`
- Modify: `frontend/src/styles.scss`

- [ ] Refinar marca, navegação, cabeçalho, espaçamento, tipografia e tokens responsivos.
- [ ] Manter navegação e conteúdo acessíveis, sem ícones Unicode ou strings decorativas.

### Task 2: Polish the overview states

**Files:**
- Modify: `frontend/src/app/features/overview/overview-page.component.html`
- Modify: `frontend/src/styles.scss`

- [ ] Reorganizar banner, cards e estado vazio para hierarquia visual mais clara.
- [ ] Preservar os estados loading, online e indisponível.

### Task 3: Verify the UI build

**Files:**
- Modify: `frontend/package-lock.json` only if dependency metadata changes.

- [ ] Run `npm run build` and confirm the production bundle completes.
