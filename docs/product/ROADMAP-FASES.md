# Roadmap de fases — cumplimiento del master

**Canónico.** Las demás tablas de fases del repo deben apuntar aquí.  
**Última actualización:** 2026-08-14  

Fuente de intención: master de emergencias + constitution + registries.  
Fuente de **comportamiento a construir**: siempre una `spec` aprobada en `/specs` (SDD). Este roadmap ordena el *qué* y el *cuándo relativo*; no autoriza código sin slice.

**Estado:** fases **0–10 hechas** (deploy cloud = checklist del operador). Siguiente opcional: **Fase 11** (multi-país) o **12** (offline).  
**Motor de crecimiento:** `/publicar-punto` (acopios/bodegas/centros de la comunidad) + API pública.

---

## Reglas fijas (no se reordenan)

1. **Integrar antes de construir** — connectors / open data / OSS antes que inventar fuentes.  
2. **Conectar, no intermediarios** — no pedimos, recaudamos ni custodiamos donaciones (dinero o especie).  
3. **Avisos = señales** — no son tickets que la plataforma prometa cumplir.  
4. **Procedencia visible** en todo dato.  
5. **Personas desaparecidas** → solo deep-link oficial (RND/SIRDEC); **nunca** base propia.  
6. **Offline / PWA avanzada** = **última fase y casi opcional**.

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
| 5 Moderación | **Fase 9** |
| + Donaciones | **Fase 5** (solo enlaces a terceros) |
| + Voluntariado | **Fase 4** (encuentro / deep-link, sin matching de nómina) |
| + Mascotas / personas perdidas-encontradas | **Fase 8** (mascotas = reportes; personas = RND) |
| + RND / desaparecidos | **Fase 7** (deep-link oficial; nunca autoridad) |
| + Offline avanzado | **Fase 12** (última, casi opcional) |
| + API externa amplia | **Fase 10** (producción + ops) |

El slice **001** colapsó master 1+3+4 en un MVP usable. El resto del master se parte en fases 2–12 para no mezclar contratos.

---

## Tabla maestra de fases

| Fase | Nombre | Outcome (cumplimiento) | Slice SDD | Estado |
|------|--------|------------------------|-----------|--------|
| **0** | Discovery de fuentes | Inventario legal/técnico, pruebas de endpoints, OSS | docs `sources/` | **Hecha** |
| **1** | Foundation + núcleo accionable | Monorepo, API, PostGIS, PWA, avisos, IDEAM | `001` | **Hecha** |
| **2** | Connectors oficiales + Places | SISPRO/REPS → Places; sync robusto | post-001 | **Hecha** |
| **3** | Registro fácil de lugares / orgs | Acopio/ONG; ciudad DIVIPOLA; expiración | `002` | **Hecha** |
| **4** | Quiero ayudar / voluntariado (enlace) | Lugares + cómo ayudar; sin matching laboral | `003` | **Hecha** |
| **5** | Descubrimiento llevar ayuda (enlace) | Acopio/especie vía terceros; cero pasarela | `004` | **Hecha** |
| **6** | Densificación territorial | OSM multi-ciudad; cerca de mí | `005` | **Hecha** |
| **7** | Orígenes / deep-links oficiales | Página unificada canales + estado de integración | `006` | **Hecha** |
| **8** | Perdidos / encontrados | Mascotas UNVERIFIED; personas → RND | `007` | **Hecha** |
| **9** | Cierre comunitario (sin moderador) | Enlace secreto `/cerrar`; sin panel admin | `008` | **Hecha** |
| **10** | Plataforma de producción | Migraciones, Docker prod, health, connectors status, OpenAPI, checklist deploy | `009` | **Hecha** (hosting = operador) |
| **11** | Multi-país / expansión | País #2 con discovery propio | opcional | Opcional |
| **12** | Offline / PWA avanzada | Cache crítico; cola offline | **Última** | **Casi opcional** |

**Cumplimiento master (ajustado):** fases **0–10** con specs.  
**Personas desaparecidas** no son un “CRUD nuestro”: viven en Fase **7** como enlace.  
**Mascotas** dejan de ser “vertical opcional tipo marketplace” y pasan a **Fase 8 crítica** (perdidas/encontradas).

---

## Detalle por fase

### Fase 0 — Discovery *(hecha)*

- Source registry + extended + catálogo OSS.  
- Pruebas reales (IDEAM, SISPRO, UNGRD SODA, IDIGER, etc.).  
- Contexto sismo / entidades nacionales-territoriales.  
Docs: `docs/sources/`.

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

### Fase 3 — Lugares / orgs *(hecha — 002)*

- Publicar puntos de acopio / ONG / ayuda (`/publicar-punto`) con procedencia comunitaria.  
- Filtro por ciudad (DIVIPOLA).  
- Listado / directorio “quién necesita apoyo” (`/ayudar`; mapa como complemento).  
- `expiresAt` y copy: no donamos nosotros.  
Spec: `specs/002-registro-facil-lugares/` (**APROBADA**).

**UX post-002 (sin cambiar el outcome):** nav centrada en **¿Qué necesitas?** (foro de avisos) + **Ayudar** (directorio) + **Fuentes**; home con utilidad temprana y stats/API reales. El mapa ya no es la puerta principal.

### Fase 4 — Quiero ayudar / voluntariado (enlace) *(hecha — 003)*

- Hub `/ayudar` (alias `/quiero-ayudar`): **lugares** + cómo ayudar (ajuste 004: sin tab avisos).  
- Contacto: canal externo del Place o Cómo llegar.  
- Avisos de comunidad → `/buscar`.  
Spec: `specs/003-quiero-ayudar-enlace/` (**APROBADA**).

### Fase 5 — Donación solo como descubrimiento *(hecha — 004)*

- En Quiero ayudar: filtros “qué puedes llevar” + tipo **Llevar ayuda / acopio**.  
- Deep-links a orgs curadas (Cruz Roja, ABACO, bancos de alimentos…); acción **fuera**.  
- Sin checkout, wallets ni campañas de dinero como producto.  
Spec: `specs/004-donacion-descubrimiento-enlace/` (**APROBADA**).

### Fase 6 — Densificar territorio *(hecha — 005)*

- Sync nacional por capitales: SISPRO + OSM help (amenities ampliados, nodos/ways).  
- Más ciudades ancla; pausa entre Overpass.  
- Quiero ayudar: **Cerca de mí** (radio + orden por distancia).  
Spec: `specs/005-densificacion-territorial/` (**APROBADA**).

### Fase 7 — Orígenes / deep-links *(hecha — 006)*

- Vista unificada **`/origenes`**: canales oficiales del país + estado de lo que integramos.  
- Redirects: `/oficiales`, `/fuentes`, `/fuentes-detalle` → `/origenes`.  
- Personas desaparecidas: enlace a RND/SIRDEC (sin base propia).  
Spec: `specs/006-deep-links-oficiales/` (**APROBADA**; UI fusionada post-entrega).

### Fase 8 — Perdidos / encontrados ✅

- **Mascotas:** `POST/GET /api/v1/pets` — perdida/encontrada (`UNVERIFIED`), ciudad, WhatsApp opcional, ~14d.  
- **Personas:** pestaña en `/perdidos` → RND/SIRDEC + 123/141/155 (sin CRUD nuestro).  
- No marketplace de servicios.  
- Spec: `specs/007-perdidos-encontrados/` (**APROBADA**).

### Publicar (transversal, refuerzo continuo)

- `/publicar-punto` es **capacidad estratégica**: bodegas, colegios, orgs habilitan acopio para la zona.  
- Alimenta el directorio y la **API pública**; crece con uso real.  
- Cuidado: rate-limit, expiración, copy claro, moderación (Fase 9).

### Fase 9 — Cierre comunitario (sin moderador) ✅

- Al publicar aviso/lugar/mascota → **enlace secreto** para cerrarlo sin cuenta (`/cerrar`).  
- Sin panel de moderación en el producto público.  
- Spec: `specs/008-moderacion/` (**APROBADA**, pivote self-close).

### Fase 10 — Producción y API madura ✅

- Migraciones TypeORM baseline + `synchronize` off en prod.  
- Docker prod (`Dockerfile.backend`, `docker-compose.prod.yml`).  
- Health `live` / `ready`; `GET /connectors/status`; `OPS_TOKEN` en connectors.  
- Checklist deploy: `infra/deploy/README.md` (HTTPS/secretos/backups = operador).  
- Spec: `specs/009-produccion/` (**APROBADA**).

### Fase 11 — Multi-país *(opcional)*

- Reusar modelo `country` + discovery Fase 0 por país.

### Fase 12 — Offline / PWA avanzada *(última, casi opcional)*

- Service worker más allá de “instalable”.  
- **No bloquea** el cierre de cumplimiento 0–10.

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
| RND / SGC / UNGRD / orígenes unificados | 7 |
| Mascotas + personas (RND) perdidos/encontrados | **8** |
| Moderación (cuidar Publicar) | 9 |
| Deploy + API madura | 10 |
| Multi-país | 11 (opc.) |
| Offline avanzado | **12 (casi opc.)** |

---

## Relación con slices SDD

| Slice | Fases que cubre |
|-------|-----------------|
| `001-mvp-mapa-ayuda` | 1 (+ arranque hacia 2) |
| `002-registro-facil-lugares` | 3 |
| `003-quiero-ayudar-enlace` | 4 |
| `004-donacion-descubrimiento-enlace` | 5 |
| `005-densificacion-territorial` | 6 |
| `006-deep-links-oficiales` | 7 |
| `007-perdidos-encontrados` | 8 |
| `008-moderacion` (cierre comunitario) | 9 |
| `009-produccion` | 10 |
| Docs-only / infra | 0, partes de 10–12 |

Si una idea está en este roadmap pero **OUT** del slice activo → no implementar; abrir o avanzar el slice correcto.

---

## Mejoras posibles por fase (backlog honesto)

No son deuda bloqueante. Priorizar solo si hay uso real.

Feedback de gente que ya usó el deploy (menú móvil, muro `/buscar` como `/perdidos`, stats de home, SOS = 123, PWA): [`MEJORAS-LANZAMIENTO.md`](MEJORAS-LANZAMIENTO.md). **No implementar** ese doc hasta aprobar el orden P0–P2.

| Fase | Mejoras posibles |
|------|------------------|
| **0** | Re-discovery anual; más datasets territoriales; marcar fuentes muertas |
| **1** | Mapa MapLibre más usable; tests E2E; i18n EN |
| **2** | Menos ruido IPS; sync incremental; métricas exportables |
| **3** | Fotos de lugar; horarios; verificación ligera de URL |
| **4** | Orden por cercanía + frescura; filtros guardados |
| **5** | Más acopios curados; copy más claro “enlace a tercero” |
| **6** | Más ciudades OSM; cola de sync; cache Overpass |
| **7** | Badges de frescura; más líneas regionales; deep-links SGC/UNGRD vivos |
| **8** | Fotos de mascota; “ya apareció” más visible; filtros especie/zona |
| **9** | Recordar enlace de cierre (copiar + QR); “mis avisos” en localStorage |
| **10** | Hosting real + CDN; backups automáticos; observabilidad (logs/métricas); cola Redis |
| **11** | Segundo país solo con discovery + constitution check |
| **12** | SW de lectura offline; cola de avisos al volver la red |

Deploy gratis / capacidad: [`infra/deploy/README.md`](../../infra/deploy/README.md).

---

## Docs relacionados (mínimo)

| Doc | Rol |
|-----|-----|
| [`QUE-ES.md`](QUE-ES.md) | Propósito del producto |
| [`../sources/source-registry.md`](../sources/source-registry.md) | Inventario de fuentes |
| [`../../infra/deploy/README.md`](../../infra/deploy/README.md) | Deploy gratis, capacidad, checklist |
| Constitution | Invariantes que ninguna fase puede romper |
