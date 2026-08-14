# Plan 001 — MVP Mapa + Ayuda + Fuentes

**Spec:** `spec.md` (APROBADA)  
**Estado:** APROBADO — 2026-08-14  
**Constitution Check:** PASS  
- Integrar primero · API-first · procedencia · trust · stack fijado · OUT respetado · home 3 CTAs · sin seeds prod

---

## 1. Enfoque técnico

Monorepo **pnpm workspaces**. En 001 se implementan:

| Pieza | Path | Rol |
|-------|------|-----|
| Frontend | `apps/frontend` | Angular PWA |
| Backend | `apps/backend` | NestJS API + jobs connectors |
| Connectors | `connectors/co/*` | Ingestión aislada por fuente |
| Infra | `infra/docker` | PostGIS + backend (+ frontend opcional) |

Connectors = módulos TypeScript invocados por scheduler en el backend (mismo proceso Nest al inicio).

## 2. Arquitectura del slice

```text
[apps/frontend] --REST/GeoJSON--> [apps/backend] --SQL--> [PostgreSQL/PostGIS]
                                         ↑
                                 [connectors/co/ideam]
                                 [connectors/co/sgc?]
                                 [POST /needs = community]
```

Principio: **External → Connector → DB → API → Frontend**. Nunca proxy en caliente.

## 3. Estructura de carpetas (implementación)

```text
apps/frontend/          rutas: '' (home), map, need-help, sources
apps/backend/           modules: health, sources, events, needs, ingestion
packages/shared-types/
packages/geo/
packages/validation/
connectors/co/ideam/
connectors/co/sgc/      # solo si T0.2 OK
connectors/community/   # convención; escritura vía needs controller
infra/docker/           docker-compose: db, backend, (frontend)
```

## 4. Data store

- PostgreSQL 16+ + PostGIS  
- Esquema: `data-model.md`  
- Índices GIST en geometrías; índices por `observed_at` / `created_at`  
- `raw_records.payload` JSONB  

## 5. API (contrato)

Fuente: `contracts/openapi-v1-sketch.yaml` (actualizar si el impl diverge — contrato vivo).

| Método | Path | Notas |
|--------|------|--------|
| GET | `/api/v1/health` | liveness |
| GET | `/api/v1/sources` | transparencia |
| GET | `/api/v1/events` | filtros geo + type + updatedSince |
| GET | `/api/v1/events/:id` | |
| GET | `/api/v1/needs` | filtros geo + category |
| POST | `/api/v1/needs` | rate limit; UNVERIFIED |
| GET | `/api/v1/needs/:id` | |

Versionado: `/api/v1`. Swagger UI en desarrollo.

## 6. Ingestion

| Connector | Cadencia inicial | Gate |
|-----------|------------------|------|
| `co/ideam` | 15 min–1 h (según discovery) | T0.1 PASS |
| `co/sgc` | 5–15 min | T0.2 PASS; si no → no ship |
| community | request-time | siempre (POST needs) |

Pipeline: fetch → store raw → normalize → upsert `(sourceId, sourceRecordId)` → metrics (`lastSuccessfulFetch`, errores).

## 7. Frontend

- Angular (standalone components si la versión estable lo permite)  
- Rutas lazy: `map`, `need-help`, `sources`; home eager  
- MapLibre **lazy-loaded** (no en bundle inicial del home)  
- Badges: fuente + verification en cada ítem  
- i18n: `es.json`  
- Disclaimer en home (copy de no-autoridad)  
- Atribución OSM en control del mapa  

## 8. Seguridad 001

| Control | Detalle |
|---------|---------|
| Validación | DTOs en boundary (class-validator o Zod) |
| Rate limit | POST `/needs`: p.ej. 10/hora/IP (ajustable) |
| CORS | allowlist de orígenes |
| Headers | Helmet |
| Descripción | max 2000 |
| Auth ciudadano | ninguna en 001 (anónimo + rate limit) |
| Auth admin | 002 |

## 9. Infra local

```text
infra/docker/docker-compose.yml
  services: db (postgis), backend, frontend (opcional)
```

Root `.env.example` — sin secretos reales en git.

## 10. Testing

- Unit: normalizers IDEAM (y SGC si aplica)  
- Smoke API: health, POST need, GET events/needs  
- Manual: `quickstart.md` + checklist spec §5  

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| API fuente cambia | Connector aislado + status en registry |
| Sin fuente oficial lista | UI vacía + Fuentes honestas; foundation igual puede avanzar |
| Scope creep | Rechazar OUT; nueva carpeta `specs/002-…` |
| Geo UX | Solo Point + pin en mapa en 001 |
| Confundir front/back | Paths `apps/frontend` vs `apps/backend` |

## 12. Orden de implementación

Ver `tasks.md`:

0. Discovery (T0) — docs  
1. Setup monorepo (T1) — **requiere OK explícito para empezar código**  
2. Foundational (T2)  
3. Eventos + mapa (T3)  
4. Needs (T4)  
5. Fuentes UI (T5)  
6. Polish (T6)  

**Política de arranque de código:**  
- T1–T2 (scaffold + DB + health/sources vacíos) pueden empezar tras esta aprobación si el equipo lo pide.  
- T3 connectors reales **bloqueados** hasta T0.1 (IDEAM) o decisión documentada de mock **solo en dev** etiquetado DEMO.

## 13. Fuera de este plan

Admin, donaciones, voluntariado, mascotas, RND, offline reports, dedupe ML, multi-país connectors, CTAs ayudar/donar.

## 14. Registro de aprobación

| Campo | Valor |
|-------|--------|
| Plan | APROBADO |
| Alineado a spec | Sí |
| Analyze | PASS |
| Listo para | Fase 0 en paralelo; T1 cuando se autorice código |
