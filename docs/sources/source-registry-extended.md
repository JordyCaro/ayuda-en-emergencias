# Source Registry Extended — inventario amplio Colombia

**Pasada:** 2026-08-14  
**Registro corto:** [`source-registry.md`](source-registry.md)  
**Open source:** [`open-source-catalog.md`](open-source-catalog.md)

Principio: **integrar / enlazar / no reinventar**. Si no hay API redistribuible → deep-link + atribución, o vacío ciudadano propio.

---

## Matriz por necesidad de producto

| Necesidad del usuario | ¿Hay fuente usable? | Cómo | Status |
|----------------------|---------------------|------|--------|
| Qué está pasando (hidro) | Sí | IDEAM Alarma_Niveles | TESTING → connector 001 |
| Qué está pasando (sismos) | Parcial | Visor SGC deep-link; ArcGIS query BLOCKED | BLOCKED + deep-link |
| Emergencias históricas | Sí | UNGRD `wwkg-r6te` SODA | TESTING (histórico) |
| Zonas de amenaza / peligro (Bogotá) | Sí | IDIGER MapServer | TESTING |
| Dónde donar sangre (Bogotá) | Sí | GeoJSON + ArcGIS SDS | TESTING |
| Puntos de acopio donaciones | Parcial | Mapas Bogotá/IDECA (UI); SODA `gcd5-td78` 404; medios/ONG sin API | DISCOVERY / deep-link |
| Dinero a ONG oficiales | Parcial | Cruz Roja / ABACO sitios web | DEEP_LINK only |
| Bancos de alimentos | Parcial | ABACO web (26 bancos); OSM food_bank ~5 nodos CO | DEEP_LINK + OSM pobre |
| Hospitales / bomberos | Sí | Overpass/OSM | TESTING |
| Desaparecidos | No API oficial pública | SIRDEC consultas web; Apitude de pago | DEEP_LINK only |
| Mascotas perdidas | No API pública estable CO | DoggyMate/PetzLover apps; OSS Patas Perdidas (self-host) | DEEP_LINK / self-host ideas |
| Necesito ayuda / quiero ayudar | Vacío real | Nuestra API ciudadana | BUILD |
| Donaciones empresas↔ONG | No API nacional unificada | Curaduría + deep-links | MANUAL / post-001 |
| Datos humanitarios agregados | Sí | HDX CKAN API (~582 datasets CO) | TESTING (metadatos/descargas) |

---

## 1. Emergencias y peligro

### UNGRD — Emergencias (Datos.gov.co) ✅ conecta

```yaml
id: ungrd-emergencias-wwkg
name: Emergencias UNGRD
country: CO
provider: UNGRD (publicado en datos.gov.co)
url: https://www.datos.gov.co/Ambiente-y-Desarrollo-Sostenible/Emergencias-UNGRD-/wwkg-r6te
api_url: https://www.datos.gov.co/resource/wwkg-r6te.json
type: OFFICIAL / OPEN_DATA
tier: 1
coverage: Nacional (registros por municipio/evento)
update_frequency: HISTORICAL  # sample 2019; no tratar como tiempo real
format: Socrata SODA JSON
license: Datos abiertos (verificar metadatos del view)
redistribution: según portal; atribución requerida
authentication: none (app token recomendable a escala)
last_tested: 2026-08-14
status: TESTING
notes: |
  GET ?$limit=2 → 200. Campos: fecha, departamento, municipio, evento, divipola,
  fallecidos, heridos, desaparecidos, personas, familias, viviendas_*, vías, etc.
  Útil para contexto histórico / capas “eventos pasados”, NO como alerta live.
  Producto: EventType según evento (INCENDIO, INUNDACION…); verification=OFFICIAL;
  marcar updateFrequency=HISTORICAL en UI.
```

### IDIGER — Gestión del riesgo Bogotá ✅ conecta

```yaml
id: idiger-gestionriesgos
name: IDIGER Gestión del Riesgo (MapServer)
country: CO
provider: IDIGER / Catastro Bogotá
url: https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/emergencias/gestionriesgos/MapServer
api_url: .../MapServer/{layer}/query?where=1=1&f=json
type: OFFICIAL
tier: 1
coverage: Bogotá D.C. (amenazas, geología, respuesta sísmica, etc.)
update_frequency: HISTORICAL / UNKNOWN (capas de planificación)
format: ArcGIS REST JSON/geoJSON
license: IDIGER / distrital — verificar por dataset (algunos CC-BY-NC)
redistribution: LEGAL_REVIEW por capa (hay CC-BY-NC en portal)
authentication: none
last_tested: 2026-08-14
status: TESTING
notes: |
  Metadata 200; layer0 count=117. Capas de amenaza/respuesta sísmica — NO son
  “emergencia activa ahora”. UI: “Zona de amenaza (planificación)” ≠ alerta.
  Portal: https://www.idiger.gov.co/transparencia/datos-abiertos/bogota
  Datos abiertos Bogotá: 17 datasets IDIGER (package_search).
```

### IDEAM / SGC

Ver [`source-registry.md`](source-registry.md) (pasada anterior). Sin cambios de status.

### HDX — Humanitarian Data Exchange ✅ API catálogo

```yaml
id: hdx-colombia
name: HDX datasets Colombia
country: CO / GLOBAL
provider: OCHA HDX
url: https://data.humdata.org/
api_url: https://data.humdata.org/api/3/action/package_search?q=Colombia
type: OPEN_DATA / ORGANIZATION
tier: 2
coverage: Variable (acceso humanitario, HNO, UNGRD históricos, etc.)
update_frequency: por dataset
format: CKAN API + archivos XLSX/CSV/geo
license: por dataset (muchos CC-BY)
last_tested: 2026-08-14
status: TESTING
notes: |
  package_search → success, count≈582. HAPI endpoint probado devolvió 403 sin key —
  usar CKAN + descarga de resources. No realtime de acopios.
  Ejemplo: Acceso Humanitario Colombia, bases UNGRD en HNO.
```

---

### SISPRO / REPS — Prestadores de salud geo (cobertura país) ✅

```yaml
id: sispro-reps-ips-geo
name: SISPRO Prestadores Salud IPS Sede (FeatureServer)
country: CO
provider: MinSalud / SISPRO
api_url: https://sig.sispro.gov.co/arcgis_msp/rest/services/Visor/MPS_Proteccion_Social/FeatureServer/2
type: OFFICIAL
tier: 1
coverage: Nacional (~19913 puntos; Chocó 252, Amazonas 25, Risaralda/Pereira OK)
update_frequency: UNKNOWN
format: ArcGIS REST JSON/geoJSON
license: institucional MinSalud — atribución; LEGAL_REVIEW_LIGHT
last_tested: 2026-08-14
status: TESTING
notes: |
  returnCountOnly=19913; query por CodigoDepartamento funciona (ej. 66 Risaralda).
  Ancla MEDICAL nacional. Complementa OSM débil en costa/Eje.
  SODA tabular paralelo: https://www.datos.gov.co/resource/c36g-9fc2.json (REPS)
```

### REPS SODA (tabular nacional)

```yaml
id: reps-soda-c36g
api_url: https://www.datos.gov.co/resource/c36g-9fc2.json
status: TESTING
notes: Prestadores/sedes con depto/municipio/dirección (Leticia→todo el país). Join a SISPRO geo o geocode.
```

### Barranquilla — planes comunitarios gestión del riesgo

```yaml
id: barranquilla-planes-riesgo-9hmq
api_url: https://www.datos.gov.co/resource/9hmq-wa9y.json
status: TESTING
notes: Incluye campo puntos_de_encuentro (texto). No es feed de acopio live; útil contexto/prevención.
```

### UNGRD Emergencias 2023-2024

```yaml
id: ungrd-emergencias-rgre
api_url: https://www.datos.gov.co/resource/rgre-6ak4.json
status: TESTING
notes: SODA 200; histórico reciente. Complemento a wwkg-r6te.
```

### Cruz Roja Colombiana — DEEP_LINK

```yaml
id: cruz-roja-co
name: Cruz Roja Colombiana
url: https://www.cruzrojacolombiana.org/
donaciones: https://www.cruzrojacolombiana.org/accionistas-humanitarios/
type: ORGANIZATION
tier: 2
last_tested: 2026-08-14
status: DEEP_LINK
connectivity: sitio 200; sin API pública de puntos/donaciones detectada
notes: |
  Campañas (#TodosPorColombia) y puntos de acopio se publican en web/prensa
  durante emergencias — no hay feed estable. Curar Place DONATION_POINT
  manualmente o desde fuentes oficiales temporales con expiresAt corto.
  Nunca inventar cuentas bancarias; solo enlazar oficiales.
```

### ABACO — Bancos de alimentos — DEEP_LINK

```yaml
id: abaco-bancos-alimentos
name: Asociación de Bancos de Alimentos de Colombia
url: https://abaco.org.co/
type: ORGANIZATION
tier: 2
last_tested: 2026-08-14
status: DEEP_LINK
connectivity: sitio 200; localizador “26 bancos” en web, sin API JSON pública hallada
notes: Canal empresas→alimentos. UI: deep-link + ficha Place FOOD_BANK curada si hay coords oficiales.
```

### Mapas Bogotá / IDECA — centros de acopio (emergencia ago-2026)

```yaml
id: mapas-bogota-acopio
name: Mapas Bogotá — centros de acopio (IDECA)
url: https://mapas.bogota.gov.co/
provider: Alcaldía / Catastro / IDECA
type: OFFICIAL
tier: 1
last_tested: 2026-08-14
status: DISCOVERY
connectivity: portal Mapas Bogotá responde 200; capa acopio referida por medios oficiales
notes: |
  Prensa oficial: mapa interactivo de acopios actualizado por IDECA.
  Falta localizar FeatureServer/WFS estable de la capa “centros de acopio” para connector.
  Acción: inspeccionar “Ver datos” en Mapas Bogotá / geoitems IDECA y registrar URL WFS.
  Mientras: deep-link al mapa + Places curados con fuente=Alcaldía/IDECA.
```

### Datos.gov — Puntos de Recolección/Acopio SRS

```yaml
id: datosgov-acopio-srs
name: Puntos de Recolección y Centros de Acopio - SRS
url: https://www.datos.gov.co/d/gcd5-td78
api_url: https://www.datos.gov.co/resource/gcd5-td78.json
last_tested: 2026-08-14
status: BLOCKED
connectivity: resource JSON 404; api/views 404 — dataset enlazado pero no consumible SODA ahora
notes: No usar hasta que el resource vuelva o se confirme ID nuevo.
```

### Cuidar a Colombia (ciudadano, post-sismo 2026)

```yaml
id: cuidar-colombia
name: Cuidar a Colombia
url: https://cuidarcolombia.vercel.app/
type: ORGANIZATION / COMMUNITY
tier: 3
last_tested: 2026-08-14
status: DISCOVERY / DEEP_LINK
connectivity: 200; agrega donaciones/acopio/sangre/búsqueda con fuente y evidencia
notes: |
  Alineado filosóficamente (trazabilidad). No hallamos repo OSS ni API pública en esta pasada.
  Evaluar colaboración / no scrape agresivo. Posible deep-link en página Fuentes.
```

### Vacío: empresas donantes / receptores unificados

No existe API nacional abierta tipo “empresas que reciben/donan en emergencia”.  
Estrategia: Place + Organization curados, deep-links oficiales, reportes ciudadanos UNVERIFIED, moderación post-001.

---

## 3. Sangre (donar ayuda médica)

### Bancos de sangre Bogotá ✅ conecta

```yaml
id: bogota-bancos-sangre
name: Banco de sangre — Datos Abiertos Bogotá
url: https://datosabiertos.bogota.gov.co/dataset/banco-de-sangre
api_url_geojson: https://datosabiertos.bogota.gov.co/dataset/53472aaa-2b4f-4b15-8e43-3a243b518ca1/resource/b80a3352-b9b8-42e8-a007-66f665515dc0/download/bancosangre.geojson
api_url_arcgis: https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/salud/reddistritaldesangreyterapiacelular/MapServer/1
type: OFFICIAL
tier: 1
coverage: Bogotá D.C.
license: CC-BY-4.0 (metadatos portal)
last_tested: 2026-08-14
status: TESTING
notes: |
  GeoJSON 200 FeatureCollection; incluye Cruz Roja y otros con DIRECCION/TELEFONOS.
  PlaceType sugerido: MEDICAL / DONATION_POINT (sangre).
  Nacional: SIHEVI-INS es institucional; API pública ciudadana no confirmada → no scraping.
```

---

## 4. Dónde ir a ayudar (infraestructura / OSM)

### OpenStreetMap Overpass ✅ conecta

```yaml
id: osm-overpass-amenities
name: OSM Overpass — hospitales, bomberos, social_facility
api_url: https://overpass-api.de/api/interpreter
license: ODbL
last_tested: 2026-08-14
status: TESTING
notes: |
  Hospitales Medellín bbox: 42 nodes.
  fire_station en CO: 184 nodes.
  social_facility=food_bank en CO: solo ~5 nodes — cobertura pobre para bancos de alimentos.
  Polling: respetar política Overpass; cachear en DB; bbox por municipio.
  Producto: capas HELP_CENTER / MEDICAL / FIRE — no “necesidad activa”.
```

### Bomberos — datasets locales

```yaml
id: bomberos-valle-pbkp
api_url: https://www.datos.gov.co/resource/pbkp-84gb.json
status: TESTING
notes: Contactos bomberos voluntarios Valle (2018) — directorio, no emergencias live. 200 OK.

id: bomberos-bucaramanga-xtbx
api_url: https://www.datos.gov.co/resource/xtbx-vy35.json
status: TESTING
notes: Emergencias atendidas Bucaramanga — histórico local. 200 OK.
```

---

## 5. Desaparecidos

### SIRDEC / RND — DEEP_LINK (sin API oficial pública)

```yaml
id: rnd-sirdec-consultas
name: Consultas públicas SIRDEC (Medicina Legal)
url: https://siclico.medicinalegal.gov.co/consultasPublicas/Desaparecidos.xhtml
portal: https://www.medicinalegal.gov.co/rnd-registro-de-desaparecidos
last_tested: 2026-08-14
status: DEEP_LINK
connectivity: página JSF 200; formulario HTML — no API REST pública
notes: |
  NO crear base paralela. NO scrapear. UI: “Consultar en Medicina Legal” + ruta de atención.
  Apitude desaparecidos-co = wrapper de pago de terceros — LEGAL_REVIEW + costo; no default.
```

---

## 6. Mascotas

```yaml
id: doggymate
status: DEEP_LINK
notes: App CO reportes mascotas; sin API pública documentada hallada.

id: petzlover-co
url: https://www.petzlover.com/co/create-listing/lost-pet
status: DEEP_LINK

id: patas-perdidas-oss
url: https://github.com/alejandrorndev/patas-perdidas-back
status: DISCOVERY
notes: API REST OSS para self-host (no es red nacional viva). Sin LICENSE file en GitHub API (404) — revisar antes de reutilizar código.
```

Estrategia producto: deep-links + reportes propios LOST_PET/FOUND_PET (post-001) UNVERIFIED.

---

## 7. Voluntariado / coordinación humanitaria

Sin API nacional de “oportunidades de voluntariado en emergencia” estable.  
Cruz Roja / defensa civil / alcaldías: deep-link.  
Reportes ciudadanos de VOLUNTEER_POINT = vacío a construir (post-001).

---

## Priorización connectors / integraciones

| Prioridad | Fuente | Feature product |
|-----------|--------|-----------------|
| P0 (001) | IDEAM Alarma_Niveles | Eventos mapa |
| P0 (001) | Community needs | Necesito ayuda |
| P0 | DIVIPOLA | Municipios / cerca de ti |
| P1 | **SISPRO/REPS IPS geo (~20k)** | MEDICAL nacional |
| P1 | **Spec 002 auto-registro Places** | Acopios/ayuda sin API |
| P1 | UNGRD wwkg-r6te / rgre-6ak4 | Histórico emergencias |
| P1 | OSM Overpass | Capas (irregular) |
| P1 | Cali organismos socorro CSV | Socorro Cali |
| P1 | Medellín gestión riesgo / SAT | Puntos encuentro MED |
| P1 | Bogotá bancos sangre / IDIGER | Sangre + amenaza BOG |
| P2 | Barranquilla planes riesgo | Contexto / encuentro texto |
| P2 | HDX / IDECA acopio / más CDGRD | Oportunista |
| Deep-link | Cruz Roja, ABACO, SGC, SIRDEC, UNGRD… | CTAs |
| Skip auto | SGC query roto, gcd5-td78 404 | — |

## Legal rápido

- CC-BY / datos abiertos: atribución.  
- CC-BY-NC (algunos IDIGER): cuidado si hay uso comercial futuro.  
- Deep-link ≠ redistribución de PII.  
- Desaparecidos / mascotas: máxima privacidad.
