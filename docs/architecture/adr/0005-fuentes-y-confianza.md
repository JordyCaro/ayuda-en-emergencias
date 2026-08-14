# ADR 0005 — Fuentes, confianza y legal

**Fecha:** 2026-08-14  
**Estado:** Aceptada

## Contexto

Muchas fuentes posibles. Licencias y frecuencia varían. Scraping es tentador y riesgoso.

## Decisión

1. **Source registry obligatorio** en `docs/sources/source-registry.md` antes de integrar  
2. **Tiers:** 1 Oficial → 2 Humanitario → 3 Comunidad (visible en UI)  
3. **Pipeline:** External → Connector → DB/cache → Public API (nunca proxy directo en caliente a terceros desde la API pública)  
4. **Polling** por defecto; webhooks si existen  
5. Licencia desconocida → `integration_status = LEGAL_REVIEW` — no integrar  
6. Scraping: **último recurso**, solo si legal, permitido y sostenible; preferir APIs/GeoJSON/OGC  
7. Deduplicación y normalización de tipos internos conservando valor original de la fuente  
8. No inventar datos ni cantidades  

## Prioridad discovery (Fase 0)

1. IDEAM alertas hidrológicas (Datos Abiertos + FeatureServer)  
2. SGC sismos (API/condiciones de uso)  
3. Datos.gov.co (inventario selectivo)  
4. OSM/HOT (base mapa + posibles capas)  
5. UNGRD/SNIGRD (solo si API reutilizable)  
6. Ushahidi / Sahana / RND / mascotas → investigación, no MVP 001  

## Consecuencias

- Connectors con DoD estricto (docs, licencia, errores, métricas)  
- Página Fuentes es parte del producto, no un afterthought
