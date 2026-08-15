# AGENTS.md — Instrucciones para agentes de IA

Este repo usa **Spec-Driven Development (SDD)**. El intent vive en archivos, no solo en el chat.

Producto: **Ayuda en Emergencias**.

---

## Antes de escribir código de producto

1. Leer `.specify/memory/constitution.md`  
2. Identificar el slice activo (hoy: `specs/001-mvp-mapa-ayuda/` hecho; siguiente producto `specs/002-registro-facil-lugares/`)  
3. Leer `spec.md` → `plan.md` → `tasks.md`  
4. Si el pedido del usuario contradice el spec OUT o la constitution → **parar y preguntar**; no “ampliar el MVP porque es fácil”  
5. No implementar features OUT del spec activo  
6. Roadmap de fases (master): `docs/product/ROADMAP-FASES.md` — **offline = fase 12, última y casi opcional**  

## Mapa mental del monorepo

| Path | Qué es |
|------|--------|
| `apps/frontend` | UI Angular PWA (cliente) |
| `apps/backend` | API NestJS (servidor) |
| `apps/admin` | Moderación — fuera del 001 |
| `connectors/` | Ingestión de fuentes externas (lado servidor) |
| `packages/` | Código compartido |
| `infra/` | Docker/deploy — no es lógica de negocio |
| `specs/` | Contratos SDD (fuente de verdad de comportamiento) |
| `docs/` | Explicaciones; ADRs; source registry |

## Si algo sale mal

1. ¿La **spec** era ambigua? → actualizar spec/plan  
2. Regenerar o corregir código **después**  
3. No pelear solo con el código (anti vibe-coding)

## Cambios de comportamiento

Todo cambio no trivial actualiza `spec`/`plan`/`tasks` **y** código.  
Decisiones de stack → ADR en `docs/architecture/adr/`.

## Principios que nunca rompas

- Procedencia visible en todo dato  
- Reportes de usuario = `UNVERIFIED`  
- No inventar emergencias ni cantidades sin fuente  
- No scraping agresivo; licencia desconocida = `LEGAL_REVIEW`  
- API pública no proxy en caliente a terceros (connector → DB → API)

## Onboarding de contexto

Prioridad de lectura:

1. `README.md`  
2. `docs/product/QUE-ES.md`  
3. `docs/product/ROADMAP-FASES.md`  
4. `docs/dev/COMO-CORRER.md`  
5. `docs/MAPA-DEL-REPO.md`  
6. Constitution  
7. Spec/plan/tasks del slice activo  

## Estado del proyecto

Fases **0–3** hechas (001 + Places/SISPRO + registro lugares **002**). Siguiente: **Fase 4** (quiero ayudar / voluntariado enlace).  
Producto = **capa que conecta** (no intermedia donaciones).  
Avisos = comentarios geolocalizados, no tickets.  
Cumplimiento master = fases **0–9**; **offline = 12 (casi opcional)**.  
Ver `docs/product/ROADMAP-FASES.md` y `docs/dev/COMO-CORRER.md`.
