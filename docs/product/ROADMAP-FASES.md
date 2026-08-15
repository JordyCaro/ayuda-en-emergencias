# Roadmap de fases — cumplimiento del master

**Canónico.** Las demás tablas de fases del repo deben apuntar aquí.  
**Última actualización:** 2026-08-14  

Fuente de intención: master de emergencias + constitution + registries.  
Fuente de **comportamiento a construir**: siempre una `spec` aprobada en `/specs` (SDD). Este roadmap ordena el *qué* y el *cuándo relativo*; no autoriza código sin slice.

**Estado:** fases **0–7 hechas**. Siguiente: **Fase 8** (mascotas perdidas/encontradas — prioritaria).

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
| + Mascotas perdidas/encontradas | **Fase 8** (**prioritaria**, no marketplace) |
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
| **7** | Deep-links oficiales extra | `/oficiales`: SGC, RND, UNGRD, IDIGER… | `006` | **Hecha** |
| **8** | Mascotas perdidas / encontradas | Reportes UNVERIFIED de mascotas; no marketplace de servicios | `007+` | **Siguiente (prioritaria)** |
| **9** | Moderación y confianza operativa | Admin; VERIFIED/REJECTED; sin fingir autoridad | `admin` / slice | Pendiente |
| **10** | Plataforma de producción | Deploy HTTPS, migraciones, OpenAPI, métricas | infra + harden | Pendiente |
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

### Fase 7 — Deep-links oficiales extra *(hecha — 006)*

- UI `/oficiales`: SGC, RND/SIRDEC, UNGRD, IDIGER, Cruz Roja, 123.  
- **Personas desaparecidas:** solo enlace a Medicina Legal — sin base propia.  
- Seed sources `rnd`, `ungrd`, `idiger` (+ `sgc` ya existía).  
Spec: `specs/006-deep-links-oficiales/` (**APROBADA**).

### Fase 8 — Mascotas perdidas / encontradas *(siguiente — prioritaria)*

- Reportar mascota perdida o encontrada (señal `UNVERIFIED`, ciudad, foto opcional más adelante).  
- **No** es marketplace de veterinaria/paseos.  
- Moderación humana reforzada en Fase 9.  
- Slice: `007+` (abrir antes de código).

### Fase 9 — Moderación

- `apps/admin` (o equivalente).  
- Moderación de Places/avisos/mascotas → `VERIFIED` / ocultar abuso.  
- Audit trail mínimo. Sigue sin ser autoridad.

### Fase 10 — Producción y API madura

- Deploy real (HTTPS, backups, secretos).  
- Migraciones TypeORM (sin `synchronize` en prod).  
- Observabilidad de connectors.  
- OpenAPI = contrato real.

### Fase 11 — Multi-país

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
| RND / SGC / UNGRD UX (personas = solo enlace) | 7 |
| Mascotas perdidas/encontradas | **8 (prioritaria)** |
| Moderación humana | 9 |
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
| Futuros `007+` | 8 (mascotas), 9… |
| Docs-only / infra | 0, partes de 10 |

Si una idea está en este roadmap pero **OUT** del slice activo → no implementar; abrir o avanzar el slice correcto.

---

## Docs relacionados (mínimo)

| Doc | Rol |
|-----|-----|
| [`QUE-ES.md`](QUE-ES.md) | Propósito del producto |
| [`../sources/source-registry.md`](../sources/source-registry.md) | Inventario de fuentes |
| Constitution | Invariantes que ninguna fase puede romper |
