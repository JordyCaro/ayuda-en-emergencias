# ADR 0004 — Mapas y geolocalización

**Fecha:** 2026-08-14  
**Estado:** Aceptada

## Contexto

Master: MapLibre **o** Leaflet. Hay que elegir uno.

## Decisión

- **MapLibre GL JS** como librería de mapa  
- **OpenStreetMap** (y tiles compatibles) como base cartográfica  
- Atribución OSM/HOT visible según licencia  
- Geolocalización: GPS opcional, selección manual en mapa, búsqueda de lugar; **nunca** obligar ubicación exacta  
- API geográfica: GeoJSON donde aplique; filtros `lat`, `lng`, `radius`  

## Por qué MapLibre (vs Leaflet)

- Vector tiles modernos, mejor rendimiento en móviles  
- Ecosistema activo post-Mapbox GL  
- Suficiente para capas de alertas (polígonos) + puntos  

Leaflet sigue siendo válido; no lo usamos para no mantener dos abstracciones.

## Consecuencias

- Bundle mapa más pesado que Leaflet básico → cuidado en PWA (lazy load del mapa)  
- No construir tiles propios en MVP
