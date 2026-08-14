# Catálogo open source — estudiar / reutilizar / interoperar

**Fecha:** 2026-08-14  
**Regla:** revisar licencia antes de copiar código. Preferir ideas + interoperabilidad a forks masivos.

---

## Plataformas humanitarias (referencia de dominio)

| Proyecto | Repo / URL | Licencia | Qué aporta | Encaje |
|----------|------------|----------|------------|--------|
| **Sahana Eden** | https://github.com/sahana/eden · sahanafoundation.org | **MIT** | Coordinación desastres: orgs, requests, shelters, missing, REST/S3XML | Estudiar modelo de datos; no redeploy entero en MVP |
| **Ushahidi Platform** | https://github.com/ushahidi/platform | **AGPL-3.0** | Crowdsourcing de reportes + mapa + API | AGPL contagia: cuidado al linkear código; ideas de reportes OK; instancias con API si existen |
| **ResponseGrid** | https://github.com/GlobalEmergency/ResponseGrid | **GPL-3.0** | Puntos logísticos, needs/offers matching, voluntariado, mapa Leaflet, PWA, provenance | Muy alineado a “dónde ayudar”; GPL → estudiar UX/API, no merge ciego |
| **CrisisNET** (histórico) | github.com/ushahidi/crisisnet | — | Agregador crisis (beta viejo) | Solo referencia histórica |

## Proyectos Colombia / región (inspiración)

| Proyecto | URL | Notas | Encaje |
|----------|-----|-------|--------|
| **Vigía Córdoba** | https://github.com/Cespial/vigia-cordoba | Alertas inundación Córdoba; IDEAM/UNGRD/ENSO; Next+Mapbox | Reutilizar enfoque de connectors + índices; stack distinto (Next) |
| **EcoGuard (Nariño)** | https://github.com/DivergenteNM/ecoguard | Amenazas ambientales Nariño; cita UNGRD/IDEAM/SGC | Ideas de features geo; validar licencia en repo |
| **Cuidar a Colombia** | https://cuidarcolombia.vercel.app/ | Agrega acopio/donaciones/sangre/búsqueda con evidencia | Deep-link / posible colaboración; sin repo OSS hallado |
| **centros-acopio** | https://github.com/rafnixg/centros-acopio | Directorio acopios (VE) + API REST | Patrón de Places + mapa; adaptar a CO |
| **Onde Doar / Hemocione** | https://github.com/Hemocione/ondedoar | Mapa donación sangre (BR) MapLibre | Patrón sangre; datos CO = Bogotá GeoJSON |

## Mascotas

| Proyecto | URL | Notas |
|----------|-----|-------|
| Patas Perdidas API | https://github.com/alejandrorndev/patas-perdidas-back | Self-host Node; **LICENSE no publicado vía API** — no copiar hasta clarificar |
| Sanos y Salvos geo-service | https://github.com/Axel-DaMage/fullstack-ss-geo-service | Microservicio geo mascotas | Estudiar endpoints; no es red nacional |

## Mapas / geo (ya decididos en ADR)

| Pieza | Licencia típica | Uso |
|-------|-----------------|-----|
| MapLibre GL JS | BSD-3 | Frontend mapas |
| OpenStreetMap data | ODbL | Base + Overpass amenities |
| PostGIS | GPL (DB) | Ya en stack |

## Qué NO hacer

1. Copiar Ushahidi/ResponseGrid sin análisis AGPL/GPL.  
2. Scrapear Cuidar Colombia / Cruz Roja.  
3. Redeploy Sahana completo “porque existe”.  
4. Presentar un fork de mascotas como autoridad nacional.

## Acciones recomendadas (docs, no código aún)

- [ ] ADR corto: “OSS reference list” (Sahana/Ushahidi/ResponseGrid = study-only salvo MIT slices)  
- [ ] Extraer de ResponseGrid/Sahana: lista de entidades Place/Need/Offer para alinear `data-model` post-001  
- [ ] Contactar / deep-link Cuidar Colombia si hay voluntad de interoperar JSON  
- [ ] Cuando haya WFS acopio IDECA → connector Places  
