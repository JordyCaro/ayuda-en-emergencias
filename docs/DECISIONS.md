# Decisiones senior fijadas

Delegadas por el product owner. Detalle en ADRs y constitution.

| Tema | Decisión |
|------|----------|
| Nombre | **Ayuda en Emergencias** (`ayuda-en-emergencias`) |
| SDD tooling | Markdown en `specs/` + constitution (sin Spec Kit CLI día 0) |
| Madurez | L2 Spec-Anchored en API/datos; L1 UI exploratoria |
| Frontend | Angular + PWA |
| Mapas | **MapLibre GL JS** + OSM |
| Backend | NestJS + OpenAPI |
| DB | PostgreSQL + PostGIS |
| Monorepo | **pnpm workspaces** (no Nx/Turborepo) |
| Nombres apps | `apps/frontend` + `apps/backend` |
| MVP 001 | Mapa + eventos/alertas oficiales + avisos + Fuentes |
| OUT 001 | Donaciones propias, voluntariado completo, mascotas, RND, admin, offline avanzado |
| Donaciones | **Nunca** recaudar/custodiar; solo enlace a terceros (Fase 5 del roadmap) |
| Offline | **Última fase (12), casi opcional** — no bloquea cumplimiento 0–9 |
| Idioma | Español primero; i18n preparado |
| País | Colombia; core multi-país-ready |
| Roadmap canónico | [`product/ROADMAP-FASES.md`](product/ROADMAP-FASES.md) |

## Siguiente paso recomendado

1. Aprobar y ejecutar **Fase 3 / spec 002** (lugares/orgs + filtro ciudad).  
2. Seguir el orden del roadmap; no saltar a offline.  
3. Todo cambio de comportamiento no trivial: spec → plan → tasks → código.
