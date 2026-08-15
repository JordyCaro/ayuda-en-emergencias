# Plan 003 — Quiero ayudar (enlace)

**Spec:** `spec.md` (APROBADA)  
**Constitution Check:** PASS (solo enlace/encuentro; sin matching laboral ni donaciones)

## Enfoque

1. Extender UI de `ayudar-page` con tabs `needs` | `places` (default `places` o query `?tab=`).  
2. Cargar `GET /needs?intent=NEED` (+ filtros ciudad/categoría si ya hay UI).  
3. WhatsApp deep-link reutilizado del patrón de `/buscar`.  
4. Ruta alias `quiero-ayudar` → `ayudar`.  
5. Query `?intent=OFFER` en `/buscar` para CTA “Puedo aportar”.  
6. Actualizar solo docs vivos: ROADMAP (Fase 4 hecha), QUE-ES, README, AGENTS.

## No construir

- Entidades nuevas, admin, pasarela, matching.

## Tasks

Ver `tasks.md`.
