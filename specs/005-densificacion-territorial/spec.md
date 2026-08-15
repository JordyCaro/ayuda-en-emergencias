# Spec 005 — Densificación territorial

**Producto:** Ayuda en Emergencias  
**Feature:** `005-densificacion-territorial`  
**Fase:** 6  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. Más puntos de ayuda en **más ciudades** vía sync OSM (cacheado) + SISPRO por capitales.  
2. Quiero ayudar ofrece **Cerca de mí** (geolocalización + radio) sin inventar lugares.  
3. Listados con lat/lng ordenan por **distancia** cuando hay radio.  
4. Overpass más completo (nodos/ways útiles) sin bbox país-entero.  
5. Procedencia `osm` / `sispro` / `curated` / `community` visible vía Fuentes.

## 2. Alcance

### IN

- Ampliar query OSM help (social_facility, shelter, ngo, community_centre, food_bank, fire_station, blood…).  
- Más ciudades ancla en `NATIONAL_SYNC_CITIES` si faltan del directorio.  
- Throttle entre ciudades Overpass.  
- API places: `lat`/`lng`/`radius` + orden por distancia.  
- UI `/ayudar`: botón Cerca de mí.  
- Docs: Fase 6 hecha.

### OUT

- Scraping agresivo de portales municipales.  
- Inventar acopios sin fuente.  
- Matching / donación dinero.  
- Offline (12).

## 3. Criterios

- [x] OSM sync multi-ciudad + amenities ampliados  
- [x] Cerca de mí en Quiero ayudar  
- [x] Places cercanos por radio ordenados  
- [x] Roadmap Fase 6 hecha  

## 4. Dependencias

- Places API, connectors national, Quiero ayudar (fases 3–5).
