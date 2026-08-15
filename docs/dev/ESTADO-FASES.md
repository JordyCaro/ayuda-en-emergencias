# Estado de las fases — Ayuda en Emergencias

Última actualización: 2026-08-14

**Roadmap canónico (todas las fases del master):** [`../product/ROADMAP-FASES.md`](../product/ROADMAP-FASES.md)

Este archivo es el **tablero de estado** corto. No redefine el orden: solo resume dónde estamos.

---

## A) Fases de producto (resumen)

| Fase | Nombre | Estado |
|------|--------|--------|
| **0** | Discovery de fuentes | **Hecha** |
| **1** | Foundation + núcleo (001) | **Hecha** |
| **2** | Connectors oficiales + Places base | **Hecha (robusta)** |
| **3** | Lugares / orgs (002) | **Hecha** (spec APROBADA) |
| **4** | Quiero ayudar / voluntariado (enlace) | Pendiente |
| **5** | Donación solo descubrimiento (enlace terceros) | Pendiente |
| **6** | Densificación territorial | Pendiente |
| **7** | Deep-links oficiales extra (RND, SGC, UNGRD…) | Pendiente |
| **8** | Moderación y confianza operativa | Pendiente |
| **9** | Plataforma de producción + API madura | Pendiente |
| **10** | Verticales opcionales (mascotas…) | Opcional |
| **11** | Multi-país | Opcional |
| **12** | Offline / PWA avanzada | **Última, casi opcional** |

**Cumplimiento master:** fases **0–9**. Offline (**12**) no bloquea ese cierre.

Inspiración UX: [`../product/INSPIRACION-REFERENCIAS.md`](../product/INSPIRACION-REFERENCIAS.md)  
Backend / APIs: [`FASES-Y-BACKEND.md`](FASES-Y-BACKEND.md)

---

## B) Fases internas del slice 001 (tasks.md)

| Fase 001 | Estado |
|----------|--------|
| 0 Discovery | Hecha |
| 1 Setup | Hecha (CI stub) |
| 2 Foundational | Hecha |
| 3 Eventos + mapa + IDEAM | Hecha |
| 4 Avisos | Hecha |
| 5 Fuentes UI | Hecha |
| 6 Polish | Parcial |

---

## Qué entrega la Fase 3 (producto) — hecha

1. Spec **002** APROBADA + UI `/publicar-punto`  
2. `GET /api/v1/geo/cities` (DIVIPOLA curado) + `cityCode` en Places  
3. Comunidad: filtro **Puntos** + selector de ciudad  
4. Copy: sin donaciones vía nosotros; UNVERIFIED por defecto  

Siguiente producto: **Fase 4** (quiero ayudar / voluntariado por enlace).

---

## Qué entrega la Fase 2 (producto) — robusta

1. Modelo **Place** + `GET/POST /api/v1/places` con DTO validado (`class-validator`)  
2. Connector **SISPRO/REPS** con **paginación** ArcGIS, bbox validado, throttle, skip concurrente explícito  
3. Listado con `limit`/`offset` + meta; places comunitarios **expiran** (cron)  
4. UI Comunidad: filtros Alertas / Avisos / Salud + errores visibles + sync status  
5. Confianza: `lastSuccessfulFetch` + `lastError`  
6. Tests geo (`pnpm --filter @aee/backend test`) + OpenAPI sketch con `/places` y SISPRO  

Base para **Fase 3 / 002** (orgs, ciudad, acopio) — sin abrir aún ese slice.

---

## Features de otras webs → fase

| Feature | Fase |
|---------|------|
| Listado “organizaciones que necesitan ayuda” | **3 (002)** |
| Filtro por ciudad | **3** (+ DIVIPOLA) |
| Publicar punto de acopio / ONG | **3 (002)** |
| Sensación “casi tiempo real” | Polish **1–2** + visible en **3** |
| Quiero ayudar / voluntariado (enlace) | **4** |
| Donar vía canales de terceros | **5** |
| Moderación | **8** |
| Mascotas / marketplace hogar | **10** (opcional) |
| Offline avanzado | **12** (casi opcional) |

---

## Cómo probar Fase 2

```text
POST /api/v1/connectors/sispro/run
Body JSON: { "west": -74.2, "south": 4.5, "east": -74.0, "north": 4.8 }
→ GET /api/v1/places?type=MEDICAL
→ Comunidad → filtro Salud / Actualizar zona
```

Docs: [`QUE-ES.md`](../product/QUE-ES.md) · [`COMO-CORRER.md`](COMO-CORRER.md) · [`ROADMAP-FASES.md`](../product/ROADMAP-FASES.md)
