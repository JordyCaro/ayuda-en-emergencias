# Source Registry — Ayuda en Emergencias

Inventario vivo. **Ningún connector = INTEGRATED sin prueba documentada + licencia clara.**  

| Documento | Contenido |
|-----------|-----------|
| **Este archivo** | Prioridad MVP 001 (IDEAM, SGC, OSM tiles, community) |
| [`source-registry-extended.md`](source-registry-extended.md) | Donaciones, ONG, UNGRD, IDIGER, sangre, RND, mascotas, HDX… |
| [`cobertura-nacional-estrategia.md`](cobertura-nacional-estrategia.md) | APIs nacionales + auto-registro |
| [`entidades-territoriales.md`](entidades-territoriales.md) | SNGRD + CDGRD/CMGRD + ciudades |
| [`../product/contexto-sismo-2026.md`](../product/contexto-sismo-2026.md) | Por qué: terremoto 10 ago 2026 |
| [`open-source-catalog.md`](open-source-catalog.md) | Sahana, Ushahidi, ResponseGrid, proyectos CO |
| [`FASE0-RESUMEN.md`](FASE0-RESUMEN.md) | Resumen ejecutivo |
| [`../../specs/002-registro-facil-lugares/spec.md`](../../specs/002-registro-facil-lugares/spec.md) | Registrar puntos fácil (draft) |

Última pasada: **2026-08-14** (MVP + extendida).

## Leyenda de status

`DISCOVERY` · `TESTING` · `INTEGRATED` · `BLOCKED` · `LEGAL_REVIEW` · `DEPRECATED`

---

## Tier 1 — Prioridad MVP 001

### IDEAM — Alarma niveles de ríos (MapServer) ✅ candidato #1

```yaml
id: ideam-alarma-niveles
name: IDEAM OSPA Alarma Niveles de Ríos
country: CO
provider: IDEAM
url: http://dhime.ideam.gov.co/server/rest/services/OSPA/Alarma_Niveles/MapServer
api_url: >
  http://dhime.ideam.gov.co/server/rest/services/OSPA/Alarma_Niveles/MapServer/{0|1|2}/query
  ?where=1=1&outFields=*&returnGeometry=true&f=json
type: OFFICIAL
tier: 1
coverage: Colombia (puntos de estaciones / umbrales)
update_frequency: UNKNOWN  # hay eventtimestamp/lastupdated por feature; no asumir realtime
format: ArcGIS REST JSON (también geoJSON en servicio)
license: Copyright IDEAM (copyrightText del servicio). Términos de redistribución no explícitos en el endpoint.
redistribution: LEGAL_REVIEW_LIGHT — uso con atribución IDEAM; confirmar ToS institucionales antes de prod masiva
authentication: none
rate_limit: MaxRecordCount 1000; no documentado — polling conservador (15–60 min)
webhook: false
polling: true
last_tested: 2026-08-14
status: TESTING
notes: |
  Capas: 0 Alarma Amarilla (count=7 al probar), 1 Naranja, 2 Roja. geometryType=Point, SR=4326.
  Campos útiles: objectid, location, dataset, nombre, eventtimestamp, lastupdated, value,
  amarilla/naranja/roja, levels_*.
  Prueba OK: metadata 200 + query JSON con features.
  EventType interno sugerido: HYDRO_ALERT (nivel de río / umbral), verification=OFFICIAL.
  NO afirmar “inundación confirmada” solo por umbral — UI: “Alarma de nivel (IDEAM)”.
```

### IDEAM — Alertas nacionales (polígonos municipales)

```yaml
id: ideam-alertas-nacional
name: IDEAM OSPA Alertas Nacional
country: CO
provider: IDEAM
url: http://dhime.ideam.gov.co/server/rest/services/OSPA/Alertas_Nacional/MapServer
api_url: >
  http://dhime.ideam.gov.co/server/rest/services/OSPA/Alertas_Nacional/MapServer/0/query
  ?where=1=1&outFields=*&returnGeometry=true&f=json&outSR=4326
type: OFFICIAL
tier: 1
coverage: Municipios CO (polígonos)
update_frequency: UNKNOWN
format: ArcGIS REST JSON / geoJSON
license: Copyright IDEAM
redistribution: LEGAL_REVIEW_LIGHT + atribución
authentication: none
rate_limit: MaxRecordCount 1000
webhook: false
polling: true
last_tested: 2026-08-14
status: TESTING
notes: |
  count≈50 al probar. Campos: encabezado, fecha_inicio/fin, hora_*, fenomeno, nombre_alarma,
  color_hex_alarma, sinopsis, nombre_depto, codigo, nombre (municipio).
  PRECAUCIÓN: sample feature con fecha_inicio 2022/9/28 — posible desactualización del layer.
  Antes de INTEGRATED: validar frescura (¿hay alertas del día?). Si stale → no usar como primaria.
  Secundario respecto a Alarma_Niveles para el connector 001.
```

### IDEAM — CSV Alertas hidrológicas (OSPA Datos Abiertos)

```yaml
id: ideam-alertas-hidro-csv
name: IDEAM Alertas Hidrológicas CSV (bart.ideam.gov.co)
country: CO
provider: IDEAM / OSPA
url: https://bart.ideam.gov.co/ospa/DatosAbiertos/Alertas_Hidrologicas/
api_url: https://bart.ideam.gov.co/ospa/DatosAbiertos/Alertas_Hidrologicas/alertas_hidrologicas.csv
type: OFFICIAL
tier: 1
coverage: Subzonas hidrográficas (matriz temporal)
update_frequency: DAILY  # archivo visto actualizado 2026-07-07 en listing; revalidar
format: CSV delimitado ; (matriz fechas en columnas)
license: Datos abiertos IDEAM — confirmar página institucional
redistribution: TBD / atribución IDEAM
authentication: none
rate_limit: archivo completo ~1.4MB al probar — no spamear
webhook: false
polling: true
last_tested: 2026-08-14
status: TESTING
notes: |
  Útil como complemento; parser más complejo (wide format por fechas).
  No es el camino más simple para MVP geo — preferir MapServer Alarma_Niveles.
```

### Datos.gov.co — Catálogo Nacional de Estaciones IDEAM

```yaml
id: datosgov-ideam-estaciones
name: Catálogo Nacional de Estaciones del IDEAM
country: CO
provider: IDEAM vía Datos Abiertos Colombia
url: https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Cat-logo-Nacional-de-Estaciones-del-IDEAM/hp9r-jxuu
api_url: https://www.datos.gov.co/resource/hp9r-jxuu.json
type: OPEN_DATA
tier: 1
coverage: Red de estaciones CO
update_frequency: HISTORICAL / UNKNOWN (catálogo)
format: Socrata SODA JSON
license: Metadatos indican consumo ciudadano con cláusulas IDEAM (datos crudos / no validados en algunos productos)
redistribution: Ver metadatos del dataset + atribución IDEAM
authentication: none (app token Socrata recomendable a escala)
rate_limit: políticas Socrata / datos.gov.co
webhook: false
polling: true
last_tested: 2026-08-14
status: TESTING
notes: |
  Prueba OK: GET resource retorna estaciones con lat/lon, departamento, municipio, código.
  Útil como referencia geo, no como “alerta” por sí sola. Post-001 o apoyo a connectors.
```

### Datos.gov.co — Datos de estaciones IDEAM y terceros (sensores)

```yaml
id: datosgov-ideam-estaciones-datos
name: Datos de Estaciones de IDEAM y de Terceros
country: CO
provider: IDEAM / terceros vía datos.gov.co
url: https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Datos-de-Estaciones-de-IDEAM-y-de-Terceros/57sv-p2fu
api_url: https://www.datos.gov.co/resource/57sv-p2fu.json
type: OPEN_DATA
tier: 1
coverage: Observaciones de sensores (ej. nivel horario)
update_frequency: NEAR_REAL_TIME  # sample 2026-08-14T13:20:00
format: Socrata SODA JSON
license: Ver metadatos; IDEAM advierte datos crudos no validados
redistribution: atribución + cláusulas del dataset
authentication: none (token recomendable)
rate_limit: Socrata
webhook: false
polling: true
last_tested: 2026-08-14
status: TESTING
notes: |
  Sample OK con valorobservado, latitud/longitud, descripcionsensor=Nivel horario.
  NO convertir automáticamente en “inundación”. Evento tipo observación hidrométrica si se usa.
  Candidato post-001 o capa avanzada; no bloquea MVP si Alarma_Niveles basta.
```

### SGC — Catálogo de sismos (ArcGIS) ⚠️ query inestable

```yaml
id: sgc-catalogo-sismos
name: SGC Catálogo de sismos (ArcGIS)
country: CO
provider: Servicio Geológico Colombiano
url: https://srvags.sgc.gov.co/arcgis/rest/services/catalogo_sismos
api_url: https://srvags.sgc.gov.co/arcgis/rest/services/catalogo_sismos/catalogo_de_sismos_2/FeatureServer
type: OFFICIAL
tier: 1
coverage: Colombia (catálogo; ~16290 features countOnly)
update_frequency: UNKNOWN
format: ArcGIS REST (JSON; geoJSON no listado en supportedQueryFormats del FS)
license: Copyright Text: Servicio Geológico Colombiano
redistribution: LEGAL_REVIEW — confirmar términos geoservicios SGC antes de redistribuir
authentication: none aparente en lectura metadata
rate_limit: MaxRecordCount 1000; servicio lento
webhook: false
polling: true
last_tested: 2026-08-14
status: BLOCKED
notes: |
  Metadata y returnCountOnly=true OK (count=16290).
  Query de features (outFields / geometría) devolvió HTTP 200 con error 400
  "Unable to perform query operation" en FeatureServer.
  MapServer query hizo timeout (>40s) en esta pasada.
  Visor público: https://sgc.gov.co/sismos (deep-link UI OK).
  RSNC consulta experta web: error ORA-28000 account locked (2026-08-14) — no usable.
  Decisión 001: NO connector SGC hasta query estable + revisión legal.
  Mitigación producto: enlace “Ver sismos oficiales (SGC)” en Fuentes/home secundario (spec post o polish).
```

### UNGRD / SNIGRD

```yaml
id: ungrd-snigrd
name: UNGRD / SNIGRD
country: CO
provider: UNGRD
status: DISCOVERY
last_tested: null
notes: Sin API pública clara en esta pasada. No scraping. Fuera de 001.
```

---

## Tier 2 — Cartografía / humanitario

### OpenStreetMap (tiles base)

```yaml
id: osm-tiles
name: OpenStreetMap raster tiles
country: GLOBAL
provider: OSMF / community
url: https://www.openstreetmap.org/
api_url: https://tile.openstreetmap.org/{z}/{x}/{y}.png
type: OPEN_DATA
tier: 2
coverage: Global
update_frequency: NEAR_REAL_TIME
format: PNG tiles
license: ODbL — atribución obligatoria © OpenStreetMap contributors
redistribution: según ODbL / política de tiles
authentication: none
rate_limit: Política de uso de tiles OSMF — User-Agent identificable; no abusar; considerar tile provider alterno en prod
webhook: false
polling: false
last_tested: 2026-08-14
status: TESTING
notes: |
  GET tile 6/20/30.png → 200 image/png con User-Agent de research.
  UI debe mostrar atribución. Para producción evaluar tiles dedicados (evitar saturar tile.openstreetmap.org).
```

### HOT / Ushahidi / Sahana

```yaml
status: DISCOVERY
notes: Investigación diferida post-001 (ver research.md).
```

---

## Tier 3 — Comunidad

### Citizen needs (plataforma propia)

```yaml
id: community-needs
name: Necesidades ciudadanas — Ayuda en Emergencias
country: CO
provider: Plataforma propia
api_url: POST /api/v1/needs
type: USER
tier: 3
update_frequency: REAL_TIME
status: DISCOVERY  # hasta implementar API
notes: verification=UNVERIFIED; rate limit obligatorio.
```

---

## Diferidos

| Tema | Acción 001 |
|------|------------|
| RND desaparecidos | Solo deep-link futuro |
| Mascotas | Fuera |
| Cruz Roja / socorro | Post-001 |
| SGC connector | Bloqueado hasta API query OK + legal |

## Decisión de connector #1 (Fase 0)

| Prioridad | Fuente | Motivo |
|-----------|--------|--------|
| **1** | `ideam-alarma-niveles` | Query estable, geo Point, campos de tiempo, oficial |
| 2 | `ideam-alertas-nacional` | Geo útil pero posible stale |
| 3 | `datosgov-ideam-estaciones-datos` | Casi tiempo real pero es observación, no alerta |
| — | `sgc-catalogo-sismos` | BLOCKED para connector automático |

## DoD connector (recordatorio)

Documentación, tests, licencia/atribución, frecuencia, errores, upsert, logging, last_fetch, fallback, no afirmar de más en UI.
