# Tasks 001 — MVP Mapa + Ayuda + Fuentes

**Spec + Plan:** APROBADOS (`APPROVAL.md`)  
**Fase 0:** COMPLETADA 2026-08-14 — IDEAM `TESTING` (candidato #1); SGC `BLOCKED`  
**Código:** MVP 001 usable; copy de producto = avisos (no pedidos rígidos); sin donaciones propias.  
**Connectors:** T3.1 IDEAM implementado; T3.7 SGC no automático (deep-link).
**Docs:** `docs/product/QUE-ES.md` · `docs/dev/COMO-CORRER.md`

Convención: `[ ]` pendiente · paths relativos al root del monorepo.  

---

## Fase 0 — Discovery (docs, paralelo, bloquea connectors reales)

- [x] T0.1 Completar entradas IDEAM en `docs/sources/source-registry.md` con URL/API probadas, licencia, frecuencia  
- [x] T0.2 Completar entrada SGC (API, términos, rate limit) → status **BLOCKED** (query features falla; deep-link visor)  
- [x] T0.3 Inventariar datasets Datos.gov.co relevantes (`hp9r-jxuu`, `57sv-p2fu` + notas)  
- [x] T0.4 Confirmar tiles OSM + atribución para UI  
- [x] T0.5 Actualizar `research.md` con resultados de pruebas manuales  
- [x] T0.6 Inventario extendido: donaciones, ONG, RND, mascotas, OSM amenities, HDX, OSS (`source-registry-extended.md`, `open-source-catalog.md`)  
- [x] T0.7 Contexto sismo ago-2026 + entidades territoriales nacionales/multi-ciudad (`contexto-sismo-2026.md`, `entidades-territoriales.md`)  
- [x] T0.8 Cobertura país: REPS/SISPRO + estrategia auto-registro (`cobertura-nacional-estrategia.md`, `specs/002-registro-facil-lugares/`)  

Detalle: `docs/sources/` · `research.md`  

## Fase 1 — Setup (cuando se autorice código)

- [x] T1.1 Init git local (si se aprueba) + `.gitignore` (node, .env, dist)  
- [x] T1.2 `pnpm-workspace.yaml` + root `package.json`  
- [x] T1.3 Scaffold `apps/backend` NestJS  
- [x] T1.4 Scaffold `apps/frontend` Angular + PWA schematic  
- [x] T1.5 `infra/docker/docker-compose.yml` (PostGIS + backend)  
- [x] T1.6 `.env.example`  
- [x] T1.7 CI mínimo (lint/test stub) — opcional si aún no hay remote  

---

## Fase 2 — Foundational

- [x] T2.1 Migraciones: sources, raw_records, events, needs (`apps/backend`)  
- [x] T2.2 `packages/shared-types` enums: verification, need categories, source types  
- [x] T2.3 Módulo Nest `SourcesModule` + `GET /api/v1/sources`  
- [x] T2.4 `GET /api/v1/health`  
- [x] T2.5 OpenAPI/Swagger habilitado  
- [x] T2.6 Framework connector: interface `fetch/validate/normalize/upsert` + logging  

> **Nota producto:** la “Fase 2 de producto” (más fuentes oficiales) continúa **fuera** de este checklist 001 — ver `docs/dev/ESTADO-FASES.md` (SISPRO + Places).  

---

## Fase 3 — User Story: Eventos + Mapa (P1)

- [x] T3.1 Connector `connectors/co/ideam` según registry  
- [x] T3.2 Job scheduling (cron) + métricas last_fetch  
- [x] T3.3 `GET /api/v1/events` con filtros lat/lng/radius/type/updatedSince  
- [x] T3.4 `GET /api/v1/events/:id`  
- [x] T3.5 UI ruta `/mapa` MapLibre + capa eventos  
- [x] T3.6 UI detalle/popup: fuente, verification, timestamps  
- [x] T3.7 SGC automático: **SKIP en 001** (BLOCKED). Opcional polish: deep-link a https://sgc.gov.co/sismos en Fuentes  

---

## Fase 4 — User Story: Necesito ayuda (P1)

- [x] T4.1 `POST /api/v1/needs` + validación + rate limit  
- [x] T4.2 `GET /api/v1/needs` + geo filter  
- [x] T4.3 UI `/necesito-ayuda` flujo &lt;30s  
- [x] T4.4 Capa mapa necesidades  
- [x] T4.5 Home CTA “Necesito ayuda”  

---

## Fase 5 — User Story: Fuentes (P1)

- [x] T5.1 UI `/fuentes` leyendo API sources  
- [x] T5.2 Copy de limitaciones / no cobertura total  
- [x] T5.3 Home link a Fuentes  

---

## Fase 6 — Polish

- [ ] T6.1 i18n es mínimo  
- [x] T6.2 Estados vacíos y error de red  
- [x] T6.3 Atribución OSM en mapa  
- [x] T6.4 README quickstart de desarrollo  
- [ ] T6.5 Converge: recorrer checklist `checklists/requirements.md`  

Detalle de prueba local: `docs/dev/COMO-PROBAR-FASES.md`  

---

## Paralelo sugerido (2 devs)

- Dev A: Fase 2 + 3 (API/connectors)  
- Dev B: Fase 4 UI needs + mapa shell en paralelo tras T2.3  

## Explicitamente NO en 001

Admin, donaciones, voluntariado, mascotas, RND, offline sync, push.
