# Estrategia de cobertura nacional — aprovechar lo existente + registrar fácil

**Fecha:** 2026-08-14  
**Objetivo:** que en **cualquier municipio** de Colombia una persona pueda ver algo útil cerca: servicios, ayuda, o al menos reportar / publicar un punto.

---

## Idea en una frase

```text
APIs nacionales (país entero)
  + connectors municipales (donde existan)
  + OSM (gratis, irregular)
  + AUTO-REGISTRO fácil (ciudadanos, alcaldías, ONG, bomberos, bancos de alimentos)
  = cobertura real de Colombia
```

No esperamos a que cada ciudad tenga open data perfecto. **El vacío se llena con registro propio**, siempre `UNVERIFIED` o moderado, con fuente visible.

---

## Capa A — Nacional (máxima cobertura geográfica)

| Fuente | Qué cubre | Prueba | Prioridad connector |
|--------|-----------|--------|---------------------|
| **DIVIPOLA** `gdxc-w37w` | Todos los municipios + coords | OK | Foundation (catálogo) |
| **SISPRO / REPS geo** FeatureServer | **~19.913** sedes IPS con punto (incluye Chocó 252, Amazonas 25, Risaralda/Pereira…) | OK | **P1 alto** — capa MEDICAL nacional |
| **REPS** SODA `c36g-9fc2` | Prestadores/sedes (dirección, depto, municipio; geo vía SISPRO o geocode) | OK | Apoyo / join |
| **IDEAM** Alarma_Niveles | Alertas hidro | OK | P0 (001) |
| **UNGRD** `wwkg-r6te`, `rgre-6ak4` | Emergencias históricas | OK | P1 |
| **OSM Overpass** | Hospitales/bomberos/amenities | OK pero **desigual** | P1 con cache |
| **SGC** | Sismos | Deep-link / BLOCKED query | Deep-link |

**Insight:** OSM solo no basta (Barranquilla ~2 hospitales en Overpass vs miles de IPS en REPS/SISPRO). **REPS/SISPRO es el ancla de salud a escala país.**

---

## Capa B — Territorial (ciudad / depto cuando haya API)

| Ciudad / entidad | Dataset útil | Status |
|------------------|--------------|--------|
| Cali | Organismos socorro CSV + coords | TESTING |
| Medellín | GIS riesgo / puntos encuentro | TESTING |
| Bogotá | IDIGER, sangre GeoJSON, Mapas/IDECA | TESTING / DISCOVERY |
| Barranquilla | Planes comunitarios riesgo `9hmq-wa9y` (incluye puntos de encuentro en texto) | TESTING (no es acopio live) |
| Bucaramanga | Emergencias bomberos `xtbx-vy35` | TESTING histórico |
| Valle | Bomberos voluntarios `pbkp-84gb` | TESTING directorio |
| Pereira / Manizales / Quibdó / Armenia… | Poco open data de acopio | → **auto-registro + deep-link** |

Voluntarios pueden seguir el checklist en `entidades-territoriales.md` ciudad por ciudad sin bloquear el producto.

---

## Capa C — Auto-registro (la que cierra el mapa)

### Quién puede registrar (roles)

| Quién | Qué registra | Trust inicial |
|-------|--------------|---------------|
| **Cualquier persona** | Necesidad, situación, “aquí reciben ayuda” (punto) | `UNVERIFIED` |
| **Organización / alcaldía / bomberos / banco alimentos** (formulario org) | Place oficial temporal o permanente + link evidencia | `UNVERIFIED` → moderación → `VERIFIED` / `COMMUNITY_CONFIRMED` |
| **Equipo plataforma** (admin) | Curaduría desde comunicado oficial | `VERIFIED` / `OFFICIAL` si fuente es entidad |

### Flujo “registrar en &lt;30s” (misma filosofía que Necesito ayuda)

```text
Abrir → “Publicar un punto de ayuda / acopio / voluntariado”
  → tipo (DONATION_POINT | HELP_CENTER | SHELTER | VOLUNTEER_POINT | MEDICAL | OTHER)
  → pin en mapa (o GPS)
  → qué reciben / horarios (texto libre, sin cantidades inventadas)
  → opcional: enlace a comunicado oficial / foto
  → enviar
  → visible como “Reportado por la comunidad / organización. Sin verificación oficial.”
```

### Por qué esto escala el país

- Pereira sin API → el CMGRD o un voluntario publica el CAFE Consota en 30s.  
- Empresa que abre bodega → registra Place + link.  
- Municipio pequeño → no espera open data; usa el mismo formulario.  
- Caducidad: `expiresAt` por defecto (ej. 72h en emergencia) renovable.

### Spec

Detalle de comportamiento: [`../../specs/002-registro-facil-lugares/spec.md`](../../specs/002-registro-facil-lugares/spec.md)  
(Implementación **después** o en paralelo controlado al 001; no diluye el MVP mapa+needs+fuentes.)

---

## Orden práctico de desarrollo

| Orden | Qué | Efecto cobertura |
|-------|-----|------------------|
| 1 | MVP 001 (API + needs + IDEAM + mapa) | Columna vertebral |
| 2 | DIVIPOLA + “cerca de mí” | Todo municipio direccionable |
| 3 | Connector **SISPRO/REPS** (IPS puntos) | Salud en casi todo el país |
| 4 | **Spec 002** registro fácil de Places | Acopios/voluntariado donde no hay API |
| 5 | Connectors Cali / Medellín / Bogotá | Densificar ciudades grandes |
| 6 | OSM amenities cacheado por depto | Relleno barato |
| 7 | Discovery continuo CDGRD | Connectors oportunistas |

---

## Principios (no negociables)

1. Integrar primero (REPS, IDEAM, Cali…).  
2. Auto-registro **nunca** se muestra como oficial sin evidencia.  
3. Multi-ciudad desde el modelo (DIVIPOLA), no hardcode.  
4. `expiresAt` en puntos de emergencia.  
5. Seguir buscando entidades; el producto no se detiene si faltan APIs.
