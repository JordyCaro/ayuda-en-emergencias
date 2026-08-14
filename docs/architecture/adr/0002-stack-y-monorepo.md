# ADR 0002 — Stack y monorepo

**Fecha:** 2026-08-14  
**Estado:** Aceptada

## Contexto

El master propone Angular + NestJS + PostGIS. Hay que fijar monorepo y evitar over-engineering para 1–3 devs.

## Decisión

| Capa | Elección | Por qué |
|------|----------|---------|
| Frontend | **Angular + TypeScript + PWA** | Ya alineado al master; un solo frontend; Service Worker + IndexedDB |
| Backend | **NestJS + REST + OpenAPI** | Estructura clara, Swagger nativo, buen fit API-first |
| DB | **PostgreSQL + PostGIS** | Geoqueries reales (radio, capas, polígonos de alertas) |
| Monorepo | **pnpm workspaces** | Simple; sin Nx/Turborepo hasta que el tamaño lo justifique |
| Layout | `apps/frontend` + `apps/backend` + `packages/` + `connectors/` + `infra/` | Nombres explícitos front/back; connectors aislados |
| Admin | App separada `apps/admin` | No mezclar moderación con UX ciudadana en el mismo bundle MVP |

## Consecuencias

- Shared types en `packages/shared-types`  
- Connectors desacoplados del HTTP API  
- CI futuro por workspace  

## Alternativas rechazadas

- Nx/Turborepo día 1 → complejidad sin beneficio con equipo chico  
- Next.js en lugar de Angular → contradice master ya decidido; no reabrir sin ADR  
- Mongo-only → geo débil vs PostGIS  
- Microservicios → innecesario
