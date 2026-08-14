# Plan 002 (borrador corto) — Registro fácil de lugares

**Spec:** `spec.md` (DRAFT)  
**Constitution Check (preliminar):** PASS si trust/expiración/rate-limit se respetan

## Enfoque

Reutilizar `Place` del data-model 001. Endpoint `POST/GET /api/v1/places`.  
Frontend: un flujo hermano de “Necesito ayuda”.  
Default `verification=UNVERIFIED`, `source=USER` o `ORGANIZATION`.  
Job/cron marca EXPIRED.

## No bloquea

Connectors SISPRO/REPS y Cali/Medellín siguen en paralelo (capa A/B).

## Tasks (alto nivel, cuando se apruebe)

1. Migración Place + índices geo  
2. API places + rate limit  
3. UI publicar punto  
4. Capa mapa Places  
5. Expiración + copy trust  
6. (Opcional) cola moderación mínima  

## Aprobación

Pendiente gate humano formal.  
**Nota 2026-08-14:** el modelo `Place` + `GET/POST /api/v1/places` y el connector SISPRO (MEDICAL oficial) ya arrancaron en **Fase 2 de producto**. El 002 completa el flujo “Publicar punto de acopio/ONG” en UI y expiración.
