# Spec 001 — MVP Mapa + Ayuda + Fuentes

**Producto:** Ayuda en Emergencias  
**Feature:** `001-mvp-mapa-ayuda`  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — gate humano/senior (delegado) + constitution check  
**Siguiente bloqueo de código:** Fase 0 discovery (T0.1–T0.2) antes de connectors reales

---

## 1. Outcomes

1. Una persona en Colombia puede abrir la Web/PWA y entender **qué está pasando** mediante alertas/eventos con **fuente y fecha**.  
2. Puede dejar un **aviso / comentario geolocalizado** (“en este lugar se necesita agua / ayuda con escombros…”) en poco tiempo, marcado como **no verificado**, **sin** que la plataforma prometa cumplimiento.  
3. Puede ver **Comunidad** (lista + mapa) con alertas oficiales y avisos de personas.  
4. Puede abrir **Confianza / Fuentes** y entender el origen de la información.  
5. Existe una **API REST** documentada con OpenAPI.

## 2. Alcance

### IN

- Home mobile-first con **3 CTAs:** Dejar aviso, Comunidad (mapa), Confianza/Fuentes.  
- Disclaimer: no somos autoridad; no manejamos donaciones; los avisos no garantizan ayuda.  
- Mapa (MapLibre) + lista: eventos/alertas; avisos de comunidad.  
- Al menos **un** connector oficial real (IDEAM). SGC: deep-link si BLOCKED.  
- Crear aviso (`Need` en modelo técnico) vía formulario libre + categoría suave + ubicación.  
- Listar avisos y eventos vía API.  
- Página Fuentes.  
- Trust visible (`verification` + fuente).  
- PWA instalable básica.

### OUT

- **Recaudar / custodiar donaciones** (dinero o especie) ni “pedirnos a nosotros”.  
- Matching donante–donatario operativo, voluntariado completo, mascotas, RND.  
- Pedidos rígidos tipo ticket (“pedido cumplido / cola de atención”).  
- CTAs de donar plata en home del 001 (enlaces a terceros → 002+).  
- Admin, push, offline avanzado, bots, IA como verdad, scraping agresivo.

## 3. Personas y escenarios

### Escenario A — Dejar un aviso

**Given** la app abierta  
**When** elijo dejar un aviso, indico ubicación, categoría suave y un texto libre (ej. “aquí se necesita agua”)  
**Then** el sistema guarda un registro con `verification=UNVERIFIED`, `source=USER`, responde 201, y muestra confirmación del estilo “Aviso publicado. Es una señal para la comunidad; no garantiza que alguien responda.” — sin afirmar que la ayuda ya viene

### Escenario B — Ver situación

**Given** hay eventos/alertas ingeridos de fuente oficial  
**When** abro el mapa  
**Then** cada ítem muestra nombre de fuente, que es oficial (o su verification), y marca temporal (`observedAt` / `publishedAt` / `retrievedAt` según exista)

### Escenario C — Transparencia

**Given** fuentes registradas en el sistema  
**When** abro Fuentes  
**Then** veo cada fuente, frecuencia esperada, última actualización exitosa o error, y un texto de que no prometemos cobertura total

### Escenario D — Sin datos oficiales

**Given** connector fallido o sin datos  
**When** abro el mapa  
**Then** la UI no inventa alertas; indica vacío o dato desactualizado según estado de la fuente

### Escenario E — API como producto

**Given** el backend levantado  
**When** un cliente llama `GET /api/v1/health` y los listados documentados  
**Then** las respuestas cumplen el OpenAPI del slice

## 4. Constraints

- Cumplir constitution (procedencia, trust, ética, privacidad).  
- Español en UI; claves i18n externalizadas (`es` mínimo).  
- Ubicación: GPS opcional; siempre alternativa de pin en mapa. No exigir precisión “exacta” como único camino.  
- Rate limit en `POST /needs` (por IP).  
- Sin cédula/teléfono/nombre obligatorio en el formulario 001.  
- Descripción: 1–2000 caracteres.  
- Geometría de Need: GeoJSON `Point` obligatorio; sin punto → `400`.

## 5. Criterios de verificación

- [ ] Home usable en viewport móvil con 3 CTAs + disclaimer  
- [ ] `POST /needs` + `GET /needs` funcionan vía API  
- [ ] Mapa renderiza; capas eventos y necesidades conmutables  
- [ ] Al menos un connector en registry con status `TESTING` o `INTEGRATED` **o** documentado `BLOCKED`/`LEGAL_REVIEW` con UI vacía honesta  
- [ ] Cada Event/Need en UI muestra fuente + verification + tiempo  
- [ ] OpenAPI describe endpoints del slice y coincide con lo implementado  
- [ ] Página Fuentes refleja el registry / API sources  
- [ ] Constitution Check del plan en verde  
- [ ] Atribución OSM visible en el mapa  

## 6. Edge cases

| Caso | Comportamiento esperado |
|------|-------------------------|
| API de fuente caída | Servir último dato en DB si existe; marcar fuente/estado; no ocultar el fallo en Fuentes |
| Need sin geometría | `400` — no aceptar |
| Descripción vacía o solo espacios | `400` |
| Descripción > 2000 chars | `400` |
| Spam de POSTs | `429` por rate limit |
| Licencia desconocida | No integrar redistribución; `LEGAL_REVIEW` en registry |
| Usuario sin GPS | Pin manual en mapa obligatorio para enviar |
| Duplicados cercanos | Mostrar ambos en 001 |
| Evento sin `sourceId` | No exponer en API pública |

## 7. Invariantes

- Ningún Need de usuario se muestra como `OFFICIAL`.  
- Ningún texto de UI afirma evacuación u orden oficial inventada.  
- Todo Event expuesto tiene `sourceId` y `verification`.  
- La API pública no llama en caliente a IDEAM/SGC por request de usuario (solo lee DB).  

## 8. Dependencias / supuestos

- Fase 0 (T0.1–T0.2) confirma endpoint usable **o** deja constancia de bloqueo.  
- Hosting/HTTPS al implementar; no bloquea esta spec.  
- Tiles OSM (o compatibles) con atribución.  

## 9. Open questions — CERRADAS

| # | Pregunta | Resolución |
|---|----------|------------|
| 1 | ¿MapLibre o Leaflet? | MapLibre (ADR 0004) |
| 2 | ¿Admin en 001? | No — 002 |
| 3 | ¿Offline reportes? | No en aceptación 001 |
| 4 | ¿SGC obligatorio día 1? | Ideal; si bloqueado, IDEAM solo o UI vacía + registry |
| 5 | ¿CTAs futuros en home? | **No** en 001 — solo 3 CTAs |
| 6 | ¿Need sin punto? | Rechazar `400` |
| 7 | ¿Demo seeds en prod? | **Prohibido** |

## 10. Registro de aprobación

| Campo | Valor |
|-------|--------|
| Spec | APROBADA |
| Plan | APROBADO (ver `plan.md`) |
| Analyze | PASS (`analyze.md`) |
| Código autorizado | **No aún** — completar Fase 0 mínima o decisión explícita de scaffold foundation (T1) sin connector |
| Notas | Foundation (T1–T2) puede iniciarse tras OK explícito; connectors reales requieren T0 |
