# Spec 002 — Registro fácil de lugares y puntos de ayuda

**Producto:** Ayuda en Emergencias  
**Feature:** `002-registro-facil-lugares`  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — gate product owner (continuar Fase 3)  
**Fecha:** 2026-08-14  
**Motivación:** Cobertura nacional donde no hay API de acopios/ONG; el sismo 2026 mostró listas por ciudad que caducan rápido.

---

## 1. Outcomes

1. Cualquier persona en Colombia puede **publicar un punto** (acopio, ayuda, voluntariado, albergue, otro) en &lt;30 segundos.  
2. Una **organización o entidad** puede registrarse con un flujo simple (nombre, tipo, punto, enlace / “qué necesitan”).  
3. Existe un listado tipo **“Organizaciones / puntos que piden apoyo”** con **filtro por ciudad** (DIVIPOLA) y orden por actualización reciente.  
4. Los puntos aparecen en el mapa **cerca del usuario**, con badge no verificado / oficial y **fecha de actualización**.  
5. Puntos de emergencia pueden **expirar** automáticamente.  
6. Nosotros **no** recaudamos donaciones: solo enlazamos al canal de la org/punto.

## 2. Alcance

### IN

- CTA: **“Publicar punto”** (home / nav / Comunidad).  
- Tipos Place: `DONATION_POINT`, `HELP_CENTER`, `SHELTER`, `VOLUNTEER_POINT`, `MEETING_POINT`, `OTHER` (+ `MEDICAL` solo lectura desde SISPRO).  
- Formulario: tipo → título → descripción → ciudad DIVIPOLA → pin GPS → URL opcional.  
- `POST /api/v1/places` + `GET` con geo, `cityCode`, `sourceId`.  
- `GET /api/v1/geo/cities` catálogo DIVIPOLA (subset curado + búsqueda).  
- UI listado / filtro en Comunidad (capa **Puntos**).  
- `expiresAt` default 72h; cron de expiración (ya en Fase 2).  
- Copy: no promesa de cumplimiento; no pasarela de dinero.

### OUT (002)

- Pagos / pasarela.  
- KYC / NIT obligatorio.  
- Scraping de redes.  
- Admin completo / VERIFIED por moderador (Fase 8).  
- Offline.

## 3. Escenarios

### A — Voluntario publica acopio

**Given** estoy en Pereira  
**When** publico DONATION_POINT con pin y “reciben agua y no perecederos”  
**Then** el punto sale en Comunidad (filtro Puntos) como UNVERIFIED con ciudad y fecha

### B — ONG con enlace

**Given** tengo URL del comunicado  
**When** registro el Place con esa URL  
**Then** queda UNVERIFIED y la UI muestra el enlace

### C — Filtro ciudad

**Given** hay puntos en varias ciudades  
**When** filtro por código DIVIPOLA  
**Then** solo veo puntos de esa ciudad

### D — Expiración

**Given** un acopio con expiresAt pasado  
**When** consulto listados  
**Then** no aparece como ACTIVE

## 4. Constraints

- Constitution: trust visible, no autoridad falsa, privacidad mínima, no donaciones.  
- Rate limit en POST places.  
- Español primero.

## 5. Criterios de verificación

- [ ] Flujo &lt;30s en móvil  
- [ ] Place en GET places con geo / cityCode  
- [ ] Badge UNVERIFIED por defecto (community)  
- [ ] expiresAt respetado  
- [ ] OpenAPI actualizado  
- [ ] No se muestra como OFFICIAL sin ser connector oficial  

## 6. Relación

| 001 / Fase 2 | 002 / Fase 3 |
|--------------|--------------|
| Need (aviso) | Place comunitario (acopio/ONG) |
| SISPRO MEDICAL | Complementa con puntos USER |
| Places API base | Ciudad DIVIPOLA + UI publicar + filtro |

## 7. Dependencias

- Place + expiración de Fase 2.  
- Moderación completa → Fase 8.
