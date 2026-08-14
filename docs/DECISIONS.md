# Decisiones senior fijadas (2026-08-14)

Delegadas por el product owner. Detalle en ADRs.

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
| Nombres apps | `apps/frontend` + `apps/backend` (claridad front/back) |
| MVP 001 | Mapa + eventos/alertas oficiales + Necesito ayuda + Fuentes |
| OUT 001 | Donaciones, voluntariado, mascotas, RND, admin completo, offline reports |
| Idioma | Español primero; i18n preparado |
| País | Colombia; core multi-país-ready |
| Git remote / código | **Aún no** |

## Siguiente paso recomendado

1. Revisar y aprobar `specs/001-mvp-mapa-ayuda/spec.md` + `plan.md`  
2. Ejecutar Fase 0 discovery (completar `docs/sources/source-registry.md` con pruebas reales)  
3. Solo entonces autorizar código según `tasks.md`
