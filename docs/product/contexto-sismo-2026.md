# Contexto: terremoto Colombia — 10 de agosto de 2026

**Propósito de este documento:** explicar *por qué* existe **Ayuda en Emergencias** y qué problema de información se vio en la respuesta real.  
**No es fuente de verdad operativa.** Las cifras cambian; siempre preferir UNGRD / SGC / alcaldías con fecha.

**Última revisión documental:** 2026-08-14

---

## Qué pasó (síntesis)

| Campo | Dato (preliminar / reportado en fuentes públicas) |
|-------|-----------------------------------------------------|
| Fecha/hora | **10 ago 2026**, ~07:34 COT |
| Magnitud | **~7,4–7,5** (SGC / USGS según fuente) |
| Epicentro | **San José del Palmar, Chocó** (también referido como zona San Juan del Palmar en SITREP ONU) |
| Profundidad | Orden de ~100 km (varía por agencia) |
| Alcance sentido | Amplio; ONU SITREP 1: sentido en **16 departamentos**; afectaciones principales en **Chocó, Caldas, Risaralda, Quindío, Cauca, Valle del Cauca** |
| Respuesta Estado | **Declaratoria de desastre de carácter nacional**; PMU / coordinación vía **UNGRD** |
| Ciudades con daño fuerte reportado | **Cali, Pereira, Quibdó, Manizales**, entre otras; impactos también en Eje Cafetero y Valle |

Cifras de víctimas **divergen entre cortes** (prensa, Asocapitales, Wikipedia en evolución). En producto **nunca** fijar un número sin fuente + `retrievedAt`.

### Fuentes de contexto (consultar originales)

- ONU Colombia — Informe de Situación 1 (10 ago 2026): https://colombia.un.org/es/320794-informe-de-situaci%C3%B3n-1-colombia-terremoto-agosto-2026-10-de-agosto-de-2026  
- SGC / visor de sismos: https://sgc.gov.co/sismos  
- UNGRD portal: https://portal.gestiondelriesgo.gov.co/  
- Cobertura prensa (acopios por ciudad): El Espectador, Infobae, Caracol, Semana, Cambio, etc.  
- Wikipedia (agregador, verificar): “2026 Colombia earthquake”

---

## El problema que vimos (y que atacamos)

En las primeras horas y días:

1. **La información existía** (alcaldías, Cruz Roja, bancos de alimentos, UNGRD, SGC, prensa).  
2. Estaba **dispersa por ciudad**, en tweets, comunicados, listas que **cambian cada pocas horas**.  
3. Una persona en Medellín, Bogotá, Barranquilla o Cali preguntaba lo mismo:  
   - ¿Qué pasó cerca?  
   - ¿Dónde llevo ayuda **aquí**?  
   - ¿Dónde dono sangre / dinero con canal oficial?  
   - ¿Cómo reporto una necesidad sin inventar autoridad?

**Ayuda en Emergencias** nace como **capa nacional de descubrimiento**: misma app en todo el país, resultados **cerca de ti** (municipio / radio), siempre con **fuente y fecha**.

No reemplazamos a la UNGRD, al SGC ni a las alcaldías. Las **conectamos** y, donde falte API, **enlazamos** o permitimos reporte ciudadano `UNVERIFIED`.

---

## Lecciones de diseño (producto)

| Lección del sismo | Implicación en la plataforma |
|-------------------|------------------------------|
| Acopios se abren **por ciudad** y cambian rápido | `Place` con `expiresAt`, `verification`, fuente; curaduría + deep-link; no “verdad eterna” |
| Bogotá dona para el Pacífico/Eje | “Cerca de mí” ≠ “zona afectada”; UI debe distinguir **dónde ayudar localmente** vs **dónde hay daño** |
| Listas en prensa sin coords | Geocodificar con cuidado; marcar evidencia débil |
| No hay API única de acopios nacionales | Modelo multi-fuente: nacional (IDEAM/UNGRD) + municipal (Cali, Medellín…) + ciudadano |
| Desaparecidos / reunificación | Solo deep-link a canales oficiales (SIRDEC / líneas); cero base paralela |
| Cobertura OSM desigual (p.ej. pocos hospitales en Quibdó en Overpass) | OSM ayuda pero no basta; reportes + datos alcaldía |

---

## Cobertura geográfica objetivo

```text
Colombia completa (DIVIPOLA)
  ├── Capas nacionales: IDEAM, UNGRD histórico, OSM, SGC (deep-link/API si abre)
  ├── Capas territoriales cuando existan APIs: Cali, Medellín, Bogotá, …
  └── Capas ciudadanas: needs/reports en cualquier municipio
```

Filtros API ya previstos: `country=CO`, `department`, `municipality`, `lat/lng/radius`.

Ver: [`entidades-territoriales.md`](../sources/entidades-territoriales.md).

---

## Relación con el MVP 001

El slice 001 no resuelve toda la respuesta humanitaria del sismo. Sí entrega el **esqueleto nacional**:

- Mapa + eventos oficiales (IDEAM)  
- Necesito ayuda (ciudadano)  
- Fuentes transparentes  

Donaciones/acopios multi-ciudad = **specs 002+** alimentadas por este discovery y por curaduría con `expiresAt`.
