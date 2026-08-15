# Fases, alcance y estrategia (APIs públicas → backend propio)

Documento para el equipo (incl. nuevos devs de backend).  
Producto: **capa que conecta** información de emergencias en Colombia. **No** recaudamos donaciones.

**Roadmap canónico:** [`../product/ROADMAP-FASES.md`](../product/ROADMAP-FASES.md)

Principio: **primero integrar** (APIs públicas / open data / OSS) → **después construir** solo el vacío (API propia, normalización, UI, trust).

---

## 1. Todas las fases (producto)

| Fase | Nombre | Alcance | Estado hoy |
|------|--------|---------|------------|
| **0** | Discovery | Inventario de fuentes, licencias, pruebas | **Hecha** |
| **1** | MVP 001 | Monorepo, PWA, avisos, IDEAM, Confianza, API Nest | **Hecha** |
| **2** | Connectors + Places | SISPRO/REPS, modelo Place, filtros Comunidad, validación, paginación sync | **Hecha (robusta)** |
| **3** | Lugares / orgs (**002**) | Acopio/ONG, filtro ciudad, “quién necesita apoyo” | **Hecha** |
| **4** | Quiero ayudar | Voluntariado / ayuda sin dinero: encuentro + enlaces | Pendiente |
| **5** | Donación (enlace) | Descubrir canales de terceros; cero custodia | Pendiente |
| **6** | Densificar territorio | Municipales + OSM cache | Pendiente |
| **7** | Deep-links oficiales | RND, SGC, UNGRD UX / connectors si legales | Pendiente |
| **8** | Moderación | Admin, VERIFIED en places/avisos | Pendiente |
| **9** | Producción + API madura | Deploy, jobs, OpenAPI real, métricas, push opc. | Pendiente |
| **10** | Verticales | Mascotas… solo con slice aprobado | Opcional |
| **11** | Multi-país | Segundo país con discovery propio | Opcional |
| **12** | Offline avanzado | **Última, casi opcional** — no bloquea cierre 0–9 | Casi opcional |

---

## 2. ¿Hasta dónde usamos APIs públicas?

```text
HOY (Fases 0–2)
  Fuentes externas ──connector──► Nuestra DB (PostGIS) ──► Nuestra API ──► PWA
       ▲
       └── IDEAM, SISPRO, (SGC deep-link), OSM tiles, datos.gov.co (discovery)

FASE 3+
  + DIVIPOLA (ciudades)
  + Places creados por usuarios/orgs (dato “nuestro”, no API pública)
  + Más connectors municipales / OSM Overpass
  + Enlaces de donación/voluntariado a terceros (Fases 4–5)
  + Moderación sobre datos ya en nuestra DB (Fase 8)
```

| Tipo de dato | Origen | ¿Backend propio? |
|--------------|--------|------------------|
| Alertas ríos | API pública IDEAM | Sí: normalizamos y guardamos |
| Sedes IPS / salud | API pública SISPRO | Sí: sync por bbox → `places` |
| Sismos | SGC (query bloqueado) | Solo deep-link por ahora (Fase 7) |
| Mapa base | OSM (tiles públicos) | No proxy de tiles en 001–2 |
| Avisos ciudadanos | **Nuestro** `POST /needs` | Sí: contenido generado aquí |
| Acopio / ONG | **Nuestro** `POST /places` (Fase 3) + enlaces | Sí: registro; donación fuera |
| Donaciones $ / especie | Sitios de **terceros** (Fase 5) | **No** las operamos |
| Offline | Cache/cola local (Fase 12) | Cliente; API sigue siendo fuente de verdad online |

**Regla:** el backend propio **ya existe** desde Fase 1 (Nest + Postgres). No esperamos a “terminar APIs públicas” para tener API. Lo que se pospone es **inventar fuentes** que ya existan fuera.

---

## 3. Qué es “backend propio” vs “connector”

| Pieza | Rol | Quién suele tocarlo |
|-------|-----|---------------------|
| `apps/backend` | API REST, validación, auth futura, jobs, DB | **Dev backend** |
| `connectors/` / módulos connector | `fetch → validate → normalize → upsert` | Backend + datos |
| `apps/frontend` | PWA Angular | Frontend |
| `packages/shared-types` | Contratos TS compartidos | Ambos |
| `infra/docker` | PostGIS local | Backend / DevOps |
| `specs/` | Contrato de comportamiento (SDD) | Producto + ambos |

El backend propio **no sustituye** a IDEAM/SISPRO: **orquesta**, guarda historial, aplica trust y expone API estable.

---

## 4. Open source primero

1. APIs / open data licenciados (`docs/sources/`).  
2. Librerías OSS (Nest, Angular, MapLibre, PostGIS…).  
3. Catálogo OSS humanitario: `docs/sources/open-source-catalog.md`.  
4. Solo entonces código a medida.

Constitution: `.specify/memory/constitution.md`.

---

## 5. Dónde puede ayudar un dev de backend YA

### Corto plazo (restos opcionales de Fase 2)

- Índices PostGIS `geography` reales (hoy lat/lng + btree).  
- Migraciones TypeORM formales (dejar `synchronize` solo en dev).  
- Auth en connectors de sync si se expone a internet.

### Siguiente gran slice — Fase 3 / **002**

- DIVIPOLA + filtro `city`.  
- UX de acopio/ONG (tipos y listados “quién pide apoyo”).  
- **Sin** pasarela de pagos ni custodia.

### Después (orden del roadmap)

4 → ayuda/voluntariado enlace · 5 → donación enlace · 6 → densidad · 7 → deep-links · 8 → admin · 9 → prod · **12 offline al final**.

Arranque: [`COMO-CORRER.md`](COMO-CORRER.md) · [`../product/QUE-ES.md`](../product/QUE-ES.md) · [`../MAPA-DEL-REPO.md`](../MAPA-DEL-REPO.md)

---

## 6. Resumen en una frase por fase

| Fase | En una frase |
|------|----------------|
| 0 | Sabemos qué fuentes existen y cuáles se pueden usar. |
| 1 | Hay producto mínimo: avisos + alertas IDEAM + transparencia. |
| 2 | Hay salud nacional (SISPRO) y Places en nuestra DB. |
| 3 | La comunidad/orgs publican puntos y se filtran por ciudad. |
| 4 | Quien quiere ayudar encuentra señales y canales, sin intermediarnos. |
| 5 | Quien quiere donar llega al canal del tercero, no a nuestra caja. |
| 6 | Hay densidad de datos más allá de Bogotá/demo. |
| 7 | Derivamos bien a oficiales cuando no podemos integrar. |
| 8 | Hay curaduría humana sin fingir autoridad. |
| 9 | El sistema aguanta producción y clientes externos de API. |
| 10 | Verticales solo si el producto lo pide con spec. |
| 11 | El mismo modelo sirve fuera de Colombia. |
| 12 | Offline mejora resiliencia; **no** define el cumplimiento del master. |
