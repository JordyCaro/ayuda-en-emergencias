# Roadmap de fases — cumplimiento del master

**Canónico.** Las demás tablas de fases del repo deben apuntar aquí.  
**Última actualización:** 2026-08-14  

Fuente de intención: master de emergencias + decisiones de producto del repo (constitution, visión, registries).  
Fuente de **comportamiento a construir**: siempre una `spec` aprobada en `/specs` (SDD). Este roadmap ordena el *qué* y el *cuándo relativo*; no autoriza código sin slice.

---

## Reglas fijas (no se reordenan)

1. **Integrar antes de construir** — connectors / open data / OSS antes que inventar fuentes.  
2. **Conectar, no intermediarios** — no pedimos, recaudamos ni custodiamos donaciones (dinero o especie).  
3. **Avisos = señales** — no son tickets que la plataforma prometa cumplir.  
4. **Procedencia visible** en todo dato.  
5. **Offline / PWA avanzada** = **última fase y casi opcional** (el producto se considera completo sin ella si el resto está).

---

## Cómo se lee el master vs este roadmap

El master condensaba:

| Master (alto nivel) | Cómo lo cubrimos aquí |
|---------------------|------------------------|
| 0 Discovery | **Fase 0** |
| 1 Foundation | **Fase 1** (parte) |
| 2 Connectors Tier 1 | **Fases 1–2** (+ más en 6–7) |
| 3 Reportes / necesidades | **Fase 1** (avisos) |
| 4 Mapa y acciones home | **Fase 1** |
| 5 Moderación | **Fase 8** |
| + Donaciones | **Fase 5** (solo enlaces a terceros) |
| + Voluntariado | **Fase 4** (encuentro / deep-link, sin matching de nómina) |
| + Mascotas | **Fase 10** (opcional, slice aparte) |
| + RND / desaparecidos | **Fase 7** (deep-link oficial; nunca autoridad) |
| + Offline avanzado | **Fase 12** (última, casi opcional) |
| + API externa amplia | **Fase 9** (API pública madura + ops) |

El slice **001** colapsó master 1+3+4 en un MVP usable. El resto del master se parte en fases 2–12 para no mezclar contratos.

---

## Tabla maestra de fases

| Fase | Nombre | Outcome (cumplimiento) | Slice SDD | Estado |
|------|--------|------------------------|-----------|--------|
| **0** | Discovery de fuentes | Inventario legal/técnico, pruebas de endpoints, OSS, contexto | docs `sources/` | **Hecha** |
| **1** | Foundation + núcleo accionable | Monorepo, API, PostGIS, PWA, avisos, mapa, Confianza, IDEAM | `001` | **Hecha** |
| **2** | Connectors oficiales + Places | SISPRO/REPS → Places salud; modelo Place; filtros; sync robusto | post-001 | **Hecha (robusta)** |
| **3** | Registro fácil de lugares / orgs | Acopio, fundaciones, ONG; filtro ciudad (DIVIPOLA); listado “quién necesita apoyo”; expiración | `002` (DRAFT) | **Siguiente** |
| **4** | Quiero ayudar / voluntariado (enlace) | Flujo “quiero ayudar” sin dinero: ver avisos/puntos + enlaces a canales de orgs; sin intermediación laboral | `003+` | Pendiente |
| **5** | Descubrimiento de donación (solo enlace) | Mostrar *dónde* donar en canales de terceros (sitios/orgs verificables); **cero** pasarela ni custodia | `004+` | Pendiente |
| **6** | Densificación territorial | Connectors municipales (Cali/Medellín/Bogotá…), OSM amenities cacheado, cobertura multi-depto | `005+` | Pendiente |
| **7** | Deep-links y datos oficiales extra | UX a SGC/RND/UNGRD/IDIGER según registry; connectors solo si dejan de estar `BLOCKED`/`LEGAL_REVIEW` | docs + slice | Pendiente |
| **8** | Moderación y confianza operativa | Admin mínimo; cola VERIFIED/REJECTED; sin fingir autoridad nacional | `admin` / slice | Pendiente |
| **9** | Plataforma de producción | Deploy HTTPS, migraciones formales, jobs robustos, rate limits, OpenAPI alineado, métricas, API pública madura, push opcional | infra + harden | Pendiente |
| **10** | Verticales opcionales | Mascotas u otros marketplaces locales **solo** si se aprueba slice; fuera del core | opcional | Opcional |
| **11** | Multi-país / expansión | Activar arquitectura multi-país cuando haya país #2 con discovery propio | opcional | Opcional |
| **12** | Offline / PWA avanzada | Cache de mapa/datos críticos, cola offline de avisos, etc. | **Última** | **Casi opcional** |

**Criterio de “producto completo” respecto al master:** fases **0–9** entregadas con specs aprobadas.  
**10–11** = expansión. **12** = mejora de resiliencia; el cumplimiento del master **no** depende de ella.

---

## Detalle por fase

### Fase 0 — Discovery *(hecha)*

- Source registry + extended + catálogo OSS.  
- Pruebas reales (IDEAM, SISPRO, UNGRD SODA, IDIGER, etc.).  
- Contexto sismo / entidades nacionales-territoriales.  
Docs: `docs/sources/`, `docs/product/contexto-sismo-2026.md`.

### Fase 1 — Foundation + núcleo *(hecha, slice 001)*

- Stack binding (Angular PWA, NestJS, PostGIS, MapLibre).  
- Avisos geolocalizados `UNVERIFIED`.  
- Eventos IDEAM + UI Comunidad + Confianza.  
- API `/api/v1` + Swagger.  
Spec: `specs/001-mvp-mapa-ayuda/`.

### Fase 2 — Connectors + Places *(hecha, robusta)*

- Modelo `Place` + API con validación DTO y bbox.  
- Connector SISPRO/REPS: páginas ArcGIS, throttle, métricas de skip/truncated.  
- Filtros Comunidad: Alertas / Avisos / Salud.  
- Expiración de places comunitarios; errores de fuente visibles en Confianza.  
- Tests de helpers geo + contrato OpenAPI actualizado.

### Fase 3 — Lugares / orgs *(siguiente — 002)*

- Publicar puntos de acopio / ONG / ayuda con procedencia `USER` u `ORGANIZATION`.  
- Filtro por ciudad (DIVIPOLA).  
- Listado “organizaciones / puntos que piden apoyo”.  
- `expiresAt` y copy “no donamos nosotros”.  
Spec: `specs/002-registro-facil-lugares/` (DRAFT).

### Fase 4 — Quiero ayudar / voluntariado (enlace)

- CTA claro desde home/comunidad.  
- Ver necesidades/puntos cercanos + instrucciones de contacto **de la org**.  
- No: bolsa de empleo, nómina, ni “asignamos voluntarios”.

### Fase 5 — Donación solo como descubrimiento

- Fichas/listados con `donationUrl` / canales de terceros.  
- UI que deje explícito: la donación ocurre fuera.  
- Prohibido: checkout, wallets, inventario de especie nuestro.

### Fase 6 — Densificar territorio

- Connectors ciudad / CDGRD oportunistas (registry).  
- OSM Overpass cacheado por depto (amenities útiles).  
- Mejor “cerca de mí” a escala nacional.  
Ver: `docs/sources/cobertura-nacional-estrategia.md`.

### Fase 7 — Deep-links oficiales extra

- RND / desaparecidos → solo derivación oficial.  
- SGC mientras esté `BLOCKED` → visor oficial.  
- UNGRD / datasets históricos → connector o deep-link según licencia.  
- Nunca presentarnos como base oficial de desaparecidos.

### Fase 8 — Moderación

- `apps/admin` (o equivalente).  
- Moderación de Places/avisos → `VERIFIED` / ocultar abuso.  
- Audit trail mínimo. Sigue sin ser autoridad.

### Fase 9 — Producción y API madura

- Deploy real (HTTPS, backups, secretos).  
- Migraciones TypeORM (sin `synchronize` en prod).  
- Observabilidad de connectors (`last_fetch`, errores).  
- OpenAPI = contrato real; clientes externos posibles.  
- Push notifications: opcional dentro de esta fase si hay spec.

### Fase 10 — Verticales opcionales

- Mascotas, plomería, jurídico tipo marketplace: **no** core.  
- Solo con spec nueva y aprobación explícita.

### Fase 11 — Multi-país

- Reusar modelo `country` + discovery Fase 0 por país.  
- Sin hardcode Colombia-only en dominio.

### Fase 12 — Offline / PWA avanzada *(última, casi opcional)*

- Service worker más allá de “instalable”.  
- Cache de tiles/datos recientes; cola de avisos offline.  
- **No bloquea** el cierre de cumplimiento master 0–9.  
- Implementar solo si hay necesidad operativa clara (redes caídas post-desastre) y spec dedicada.

---

## Mapa feature → fase (checklist master)

| Capacidad del master / discovery | Fase |
|----------------------------------|------|
| Inventario de fuentes + licencias | 0 |
| Repo, Docker, CI, API, DB | 1 |
| Mapa + home accionable | 1 |
| Avisos / reportes ciudadanos | 1 |
| Connector IDEAM | 1 |
| Connector salud (SISPRO) | 2 |
| Modelo Places | 2–3 |
| Registro acopio / ONG fácil | 3 |
| Filtro ciudad / DIVIPOLA | 3 |
| Quiero ayudar / voluntariado enlace | 4 |
| Donar vía terceros (descubrimiento) | 5 |
| Densidad municipal + OSM | 6 |
| RND / SGC / UNGRD UX | 7 |
| Moderación humana | 8 |
| Deploy + API externa amplia + ops | 9 |
| Mascotas / verticales | 10 (opc.) |
| Multi-país | 11 (opc.) |
| Offline avanzado | **12 (casi opc.)** |

---

## Relación con slices SDD

| Slice | Fases que cubre |
|-------|-----------------|
| `001-mvp-mapa-ayuda` | 1 (+ arranque hacia 2) |
| `002-registro-facil-lugares` | 3 |
| Futuros `003+` | 4, 5, 6… una capacidad vertical por slice |
| Docs-only / infra | 0, partes de 7 y 9 |

Si una idea está en este roadmap pero **OUT** del slice activo → no implementar; abrir o avanzar el slice correcto.

---

## Documentos satélite

| Doc | Rol |
|-----|-----|
| [`../dev/ESTADO-FASES.md`](../dev/ESTADO-FASES.md) | Estado corto + alineación con tasks 001 |
| [`../dev/FASES-Y-BACKEND.md`](../dev/FASES-Y-BACKEND.md) | Guía para backend / APIs vs vacío |
| [`vision.md`](vision.md) | Visión condensada (apunta aquí) |
| [`INSPIRACION-REFERENCIAS.md`](INSPIRACION-REFERENCIAS.md) | Features de webs de referencia → fase |
| [`../sources/cobertura-nacional-estrategia.md`](../sources/cobertura-nacional-estrategia.md) | Orden técnico de cobertura país |
| Constitution | Invariantes que ninguna fase puede romper |
