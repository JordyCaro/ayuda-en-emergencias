# Research 001 — Discovery de fuentes

**Estado:** Fase 0 ejecutada + **pasada extendida** 2026-08-14  
**Detalle amplio:** `docs/sources/source-registry-extended.md` · `open-source-catalog.md`

## Método

Localizar API → docs → auth → licencia → límites → redistribución → probar endpoint → anotar en registry.

## Conclusión ejecutiva

1. **Connector #1:** IDEAM `OSPA/Alarma_Niveles` (OK).  
2. **SGC automático:** BLOCKED → deep-link.  
3. **Nuevo usable:** UNGRD emergencias SODA; IDIGER MapServer; bancos sangre Bogotá GeoJSON; OSM Overpass hospitales/bomberos.  
4. **Donaciones/acopio/ONG:** casi todo deep-link (Cruz Roja, ABACO); acopio IDECA por descubrir WFS; `gcd5-td78` 404.  
5. **Desaparecidos / mascotas:** sin API oficial pública útil → deep-link (+ reportes propios post-001).  
6. **OSS:** Sahana MIT; Ushahidi AGPL; ResponseGrid GPL — estudiar, no merge ciego.

## Log de pruebas

| Fecha | Fuente | Qué se probó | Resultado | Siguiente paso |
|-------|--------|--------------|-----------|----------------|
| 2026-08-14 | IDEAM Alarma_Niveles | query + count | 200; usable | Connector 001 |
| 2026-08-14 | IDEAM Alertas_Nacional | query | 200; sample 2022 | Validar frescura |
| 2026-08-14 | IDEAM CSV hidro | CSV | 200 | Parser opcional |
| 2026-08-14 | SGC FeatureServer | count + query | count OK; query **400** | Deep-link |
| 2026-08-14 | datos.gov estaciones/sensores | SODA | 200 | Apoyo |
| 2026-08-14 | OSM tiles | PNG | 200 | UI mapa |
| 2026-08-14 | UNGRD wwkg-r6te | SODA limit 2 | **200** histórico | Capa P1 |
| 2026-08-14 | gcd5-td78 acopio | SODA | **404** | BLOCKED |
| 2026-08-14 | IDIGER gestionriesgos | meta + count | **200** | Capas amenaza BOG |
| 2026-08-14 | HDX package_search CO | CKAN | **200** ~582 datasets | Catálogo P2 |
| 2026-08-14 | HDX HAPI | GET | **403** | Sin key / no priorizar |
| 2026-08-14 | Bancos sangre Bogotá | GeoJSON | **200** CC-BY | Places sangre |
| 2026-08-14 | Overpass hospitales MED | count | 42 | Capas OSM |
| 2026-08-14 | Overpass fire_station CO | count | 184 | Capas OSM |
| 2026-08-14 | Overpass food_bank CO | count | ~5 | Cobertura pobre |
| 2026-08-14 | SIRDEC consultas | HTML | 200 formulario | Deep-link only |
| 2026-08-14 | Cruz Roja / ABACO | home | 200 sin API | Deep-link |
| 2026-08-14 | Cuidar Colombia | site | 200 | Deep-link / collab |
| 2026-08-14 | Bomberos Valle/Buca | SODA | 200 | Directorios locales |
| 2026-08-14 | DIVIPOLA gdxc-w37w | SODA | **200** municipios+coords | Base multi-ciudad |
| 2026-08-14 | Cali organismos socorro CSV | download | **200** bomberos+latlng | Connector municipal P1 |
| 2026-08-14 | Medellín VM_Gestion_Riesgo | MapServer + layer17 count | **200**; 39 puntos encuentro | Capas SAT/encuentro |
| 2026-08-14 | OSM hospitales Quibdó / fire Cali | Overpass | 2 / 6 | Cobertura desigual |
| 2026-08-14 | OSM hospitales Cali / Pereira | Overpass | **297** / **7** | Cali denso; Pereira pobre |
| 2026-08-14 | UNGRD Emergencias 2023-2024 | catálogo `rgre-6ak4` | Dataset listado | Complemento a `wwkg-r6te` |
| 2026-08-14 | SISPRO IPS FeatureServer | count + query Risaralda/Chocó/Amazonas | **19913** pts; Chocó 252; Amazonas 25 | Connector MEDICAL nacional |
| 2026-08-14 | REPS SODA c36g-9fc2 | limit 2 | 200 (hasta Leticia) | Join tabular |
| 2026-08-14 | Barranquilla 9hmq-wa9y | SODA | 200; puntos_de_encuentro texto | Contexto |
| 2026-08-14 | OSM hospitals BAQ / BGA | Overpass | 2 / 3 | OSM insuficiente solo |
| 2026-08-14 | Spec 002 registro Places | docs | DRAFT | Cubre huecos sin API |

## Endpoints de referencia (copia rápida)

```text
# IDEAM primario
http://dhime.ideam.gov.co/server/rest/services/OSPA/Alarma_Niveles/MapServer/0/query?where=1=1&outFields=*&returnGeometry=true&f=json

# UNGRD emergencias
https://www.datos.gov.co/resource/wwkg-r6te.json?$limit=10

# IDIGER Bogotá
https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/emergencias/gestionriesgos/MapServer?f=pjson

# Sangre Bogotá GeoJSON
https://datosabiertos.bogota.gov.co/dataset/53472aaa-2b4f-4b15-8e43-3a243b518ca1/resource/b80a3352-b9b8-42e8-a007-66f665515dc0/download/bancosangre.geojson

# Overpass
https://overpass-api.de/api/interpreter

# SGC visor (deep-link)
https://sgc.gov.co/sismos

# SIRDEC (deep-link)
https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml

# DIVIPOLA municipios
https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=20

# Cali organismos de socorro
https://datos.cali.gov.co/dataset/02c6222a-136d-41f1-9c62-efd580a5afcb/resource/0950db10-b61d-4bc8-ad2f-7be7868fad32/download/dato_7_ubicaciones_organismos_socorro.csv

# Medellín gestión riesgo
https://www.medellin.gov.co/servidormapas/rest/services/ambiente_dllo_sost/VM_Gestion_Riesgo_Publico/MapServer?f=pjson
```

## Campos a normalizar (IDEAM Alarma_Niveles)

| Campo fuente | Uso interno |
|--------------|-------------|
| `objectid` + `location` / `dataset` | `sourceRecordId` |
| `nombre` / `datasetlabel` | title |
| `eventtimestamp` / `lastupdated` | observedAt / publishedAt |
| geometry Point | geometry |
| capa 0/1/2 o flags amarilla/naranja/roja | properties.severityLevel |
| — | type=`HYDRO_ALERT`, verification=`OFFICIAL`, sourceId=`ideam-alarma-niveles` |

## Legal / atribución (mínimo)

- IDEAM: mostrar “Fuente: IDEAM” + link al servicio/institución.  
- Datos.gov / IDEAM datasets: respetar cláusulas de datos crudos no validados en copy de UI.  
- OSM: © OpenStreetMap contributors.  
- SGC: no redistribuir catálogo hasta LEGAL_REVIEW + query usable; deep-link permitido.  
- Bogotá sangre: CC-BY-4.0.  
- IDIGER: revisar capas CC-BY-NC.  
- Desaparecidos: nunca scrapear SIRDEC.

## Decisiones que afectan el plan

| Decisión | Impacto en tasks |
|----------|------------------|
| Connector #1 = IDEAM Alarma_Niveles | T3.1 tras “empezar código” |
| SGC = BLOCKED | Deep-link polish |
| UNGRD / OSM / sangre BOG | Candidatos P1 post-001 o polish |
| Donaciones/acopio | Deep-link + curaduría; buscar WFS IDECA |
| Sahana MIT / Ushahidi AGPL / ResponseGrid GPL | Study-only (ver open-source-catalog) |

## Ushahidi / Sahana / RND / mascotas

Documentados en pasada extendida: deep-links + catálogo OSS. Fuera de implementación 001.
