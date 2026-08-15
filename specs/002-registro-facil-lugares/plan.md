# Plan 002 — Registro fácil de lugares

**Spec:** `spec.md` (APROBADA)  
**Constitution Check:** PASS (trust, expiración, rate-limit, no donaciones)

## Enfoque técnico

1. Catálogo DIVIPOLA curado en backend (`GET /geo/cities`).  
2. Extender `Place` con `cityCode` (+ municipio/depto ya existentes).  
3. Validar `CreatePlaceDto` con ciudad + tipos comunitarios.  
4. UI `/publicar-punto` + capa **Puntos** y filtro ciudad en Comunidad.  
5. OpenAPI + docs de fase.

## Ya reutilizado de Fase 2

- Entity/API Places, throttle POST, cron expire, Confianza.

## Tasks

Ver `tasks.md`.
