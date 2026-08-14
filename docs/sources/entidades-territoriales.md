# Entidades gubernamentales y territoriales — Colombia (no solo Bogotá)

**Pasada:** 2026-08-14  
**Meta de producto:** misma PWA en todo el país; ayudas y servicios **cerca de cada ciudad/municipio**.

Arquitectura: `Country → Region/Department → Municipality (DIVIPOLA) → Source → Connector`.  
Nunca `if (city === 'Bogota')` en el core.

---

## 1. Nivel nacional (SNGRD)

| Entidad | Rol | Datos / API hallados | Status | Uso producto |
|---------|-----|----------------------|--------|--------------|
| **UNGRD** | Coordina SNGRD; PMU nacional; desastre nacional | Portal + datos abiertos; dataset Emergencias `wwkg-r6te` SODA OK; SNIGRD anunciado (integración tiempo real — verificar API ciudadana) | TESTING / DISCOVERY | Eventos históricos; deep-link situacional |
| **SGC** | Sismos oficiales | Visor OK; FeatureServer query BLOCKED | BLOCKED + deep-link | Sismos |
| **IDEAM** | Hidro/meteo/alertas | Alarma_Niveles OK | TESTING | Alertas mapa |
| **Medicina Legal / RND** | Desaparecidos | SIRDEC consultas web | DEEP_LINK | Solo enlace |
| **Defensa Civil** | Socorro nacional | Transparencia → datos.gov; línea **144** | DEEP_LINK / DISCOVERY | Contacto / Places si hay dataset |
| **DNBC (Bomberos)** | Directorio nacional bomberos | Directorio web (HTML); no API JSON limpia hallada | DISCOVERY / DEEP_LINK | Scraping no; Overpass + datasets locales |
| **IGAC / DANE** | Cartografía / DIVIPOLA | DIVIPOLA `gdxc-w37w` SODA **200** | TESTING | Catálogo municipios + coords |
| **MinSalud / INS** | Sangre (SIHEVI) | Institucional; Bogotá tiene GeoJSON abierto | Parcial | Sangre local donde haya open data |
| **Datos.gov.co** | Catálogo federado | Muchos datasets locales publican aquí | Hub | Descubrimiento continuo |

### DIVIPOLA (base multi-ciudad) ✅

```text
GET https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=…
```

Campos: `cod_dpto`, `dpto`, `cod_mpio`, `nom_mpio`, `longitud`, `latitud`.  
Uso: resolver “cerca de mí” → municipio; seeds de `Region`/`Municipality`.

### Directorios institucionales (deep-link)

- Directorio SNGRD: https://portal.gestiondelriesgo.gov.co/Paginas/Directorio-del-Sistema.aspx  
- Datos abiertos UNGRD: https://portal.gestiondelriesgo.gov.co/Paginas/Datos-abiertos.aspx  
- DNBC: https://dnbc.gov.co/ · directorio bomberos (portal DNBC)  
- Defensa Civil datos: https://www.defensacivil.gov.co/transparencia-acceso-informacion-publica/7-datos-abiertos  

---

## 2. Nivel departamental — CDGRD

Cada departamento tiene **Consejo Departamental de Gestión del Riesgo (CDGRD)** / oficina de gestión del riesgo.  
**No hay API única nacional de CDGRD.** Patrón real:

1. Buscar en datos.gov.co por departamento.  
2. Buscar portal de la gobernación / “datos abiertos”.  
3. Deep-link a comunicados en emergencia.  
4. Connector solo si hay CSV/GeoJSON/ArcGIS estable.

| Departamento (prioridad post-sismo) | Pista de datos | Status |
|-------------------------------------|----------------|--------|
| **Chocó** (epicentro) | Gobernación / CMGRD Quibdó — sin API abierta hallada en pasada | DISCOVERY + deep-link |
| **Valle del Cauca** | Cali datos abiertos fuertes; bomberos Valle `pbkp-84gb` | Parcial TESTING |
| **Risaralda** (Pereira) | Acopios vía alcaldía/prensa; sin portal CKAN hallado | DISCOVERY |
| **Caldas** (Manizales) | Acopios/sangre vía alcaldía; sin API hallada | DISCOVERY |
| **Quindío** | ABACO menciona banco Armenia | DISCOVERY |
| **Cauca** | Afectación reportada ONU | DISCOVERY |
| **Antioquia** | Medellín GIS riesgo OK; campaña “Colombia se levanta” | Parcial TESTING |
| **Cundinamarca / Bogotá** | IDIGER + Mapas Bogotá | TESTING (ya documentado) |
| Otros 20+ depts | Federar vía DIVIPOLA + OSM + ciudadano | Plantilla connector |

---

## 3. Nivel municipal — CMGRD / alcaldías (ejemplos con prueba)

### Santiago de Cali ✅ CSV organismos de socorro

```yaml
id: cali-organismos-socorro
provider: Secretaría Gestión del Riesgo — Alcaldía de Cali
portal: https://datos.cali.gov.co/
dataset: ubicacion-organismos-de-socorro-y-secretaria-de-gestion-de-riesgo-2024
api_url: https://datos.cali.gov.co/dataset/02c6222a-136d-41f1-9c62-efd580a5afcb/resource/0950db10-b61d-4bc8-ad2f-7be7868fad32/download/dato_7_ubicaciones_organismos_socorro.csv
license: CC-BY
last_tested: 2026-08-14
status: TESTING
notes: |
  CSV 200. Columnas: Organismo|Sede|Nombre|Direccion|Barrio|Comuna|Telefono|Localizacion (lat,lng).
  Incluye estaciones de Bomberos con coordenadas.
  Ideal Place HELP_CENTER / FIRE para municipio CALI.
  Portal también lista emergencias históricas, PMU, mapas riesgo (revisar resources uno a uno).
```

Portal gestión riesgo Cali: https://www.cali.gov.co/gestiondelriesgo/publicaciones/143531/datos-abiertos/

### Medellín ✅ ArcGIS gestión del riesgo

```yaml
id: medellin-gestion-riesgo
provider: Alcaldía de Medellín
api_url: https://www.medellin.gov.co/servidormapas/rest/services/ambiente_dllo_sost/VM_Gestion_Riesgo_Publico/MapServer
last_tested: 2026-08-14
status: TESTING
notes: |
  Metadata 200. Capas: amenazas, SAT, puntos de encuentro (layer 17 count=39),
  sensores nivel, rutas evacuación, etc.
  Copy UI: amenaza/planificación ≠ sismo activo.
```

### Bogotá D.C.

Ya en registry: IDIGER, bancos sangre, Mapas Bogotá/IDECA (acopio DISCOVERY).

### Pereira / Manizales / Quibdó / Barranquilla

```yaml
status: DISCOVERY
notes: |
  Acopios activos post-sismo documentados en prensa y canales de alcaldía
  (CAFE Pereira, Plazoleta Jairo Varela Cali, etc.) — sin FeatureServer estable hallado.
  Estrategia: Place curado con source=ALCALDIA/CRUZ_ROJA, expiresAt corto,
  deep-link a comunicado oficial, o reporte ciudadano UNVERIFIED.
```

---

## 4. OSM como capa nacional “cerca de ti” (probado multi-ciudad)

| Ciudad (bbox approx) | Hospitales (nodes OSM) | Nota |
|----------------------|------------------------|------|
| Medellín | 42 | Bueno relativo |
| Cali | **297** | OSM denso |
| Pereira | 7 | Pobre → usar SISPRO |
| Quibdó | 2 | Pobre → SISPRO 252 en Chocó |
| Barranquilla | **2** | Muy pobre OSM |
| Bucaramanga | **3** | Muy pobre OSM |

**Conclusión:** OSM no garantiza cobertura país. **SISPRO/REPS (~19.9k IPS)** + **auto-registro Places (spec 002)** son obligatorios para “cerca de ti” en todo el territorio.

Ver estrategia: [`cobertura-nacional-estrategia.md`](cobertura-nacional-estrategia.md)

---

## 5. Cómo se ve “ayudas cerca en cada ciudad” en arquitectura

```text
Usuario en Pereira
  → geolocaliza / elige municipio DIVIPOLA
  → API ?lat=&lng=&radius=15000&municipality=PEREIRA
  → une:
       Needs UNVERIFIED cercanos
       Events IDEAM/UNGRD en radio o depto
       Places: OSM + connectors municipales + curados (acopio) + deep-links
  → cada ítem: fuente + verification + updatedAt
```

Connectors futuros sugeridos (post-001):

1. `connectors/co/ideam` (hecho en plan 001)  
2. `connectors/co/ungrd-emergencias`  
3. `connectors/co/osm-amenities` (bbox jobs por depto)  
4. `connectors/co/cali/organismos-socorro`  
5. `connectors/co/medellin/gestion-riesgo` (capas SAT/encuentro)  
6. `connectors/co/bogota/bancos-sangre`  
7. Curación manual / admin: `Places` acopio temporales por emergencia  

---

## 6. Protocolo ANDI–ABACO–UNGRD (contexto donaciones empresa)

Existe protocolo de coordinación empresas (ANDI) / bancos de alimentos (ABACO) / UNGRD para puntos de acopio en ciudades principales durante respuesta.  
PDF ReliefWeb (protocolo). Implica: **los acopios los definen territoriales + UNGRD**, no una API pública fija → nuestra capa debe absorber anuncios oficiales con caducidad.

---

## 7. Checklist de discovery territorial (repetible)

Para cada departamento/ciudad grande:

- [ ] ¿Portal datos abiertos / CKAN?  
- [ ] ¿Dataset socorro / acopio / albergue / emergencias?  
- [ ] ¿ArcGIS/WFS?  
- [ ] ¿Publica en datos.gov.co?  
- [ ] Probar URL → anotar en `source-registry-extended.md`  
- [ ] Si solo hay comunicado: deep-link + Place curado con `expiresAt`  

---

## 8. Prioridad siguiente discovery (humano/voluntarios)

1. WFS/capa acopio IDECA Bogotá  
2. Datasets Pereira / Manizales / Quibdó en datos.gov o geoportales  
3. Confirmar si SNIGRD expone API pública documentada  
4. Inventario ABACO 26 bancos con coords oficiales  
5. Directorio DNBC → ¿export CSV?
