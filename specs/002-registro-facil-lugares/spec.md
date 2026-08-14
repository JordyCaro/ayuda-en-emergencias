# Spec 002 — Registro fácil de lugares y puntos de ayuda

**Producto:** Ayuda en Emergencias  
**Feature:** `002-registro-facil-lugares`  
**Estado:** DRAFT (listo para refine; implementación tras o en paralelo controlado al 001)  
**Fecha:** 2026-08-14  
**Motivación:** Cobertura nacional donde no hay API de acopios/ONG; el sismo 2026 mostró listas por ciudad que caducan rápido.

---

## 1. Outcomes

1. Cualquier persona en Colombia puede **publicar un punto** (acopio, ayuda, voluntariado, albergue, otro) en &lt;30 segundos.  
2. Una **organización o entidad** puede registrarse con un flujo simple (nombre, tipo, punto, enlace de evidencia).  
3. Los puntos aparecen en el mapa **cerca del usuario**, con badge de no verificado / verificado.  
4. Puntos de emergencia pueden **expirar** automáticamente y renovarse.  
5. El equipo puede marcar VERIFIED sin convertir el registro ciudadano en autoridad.

## 2. Alcance

### IN

- CTA home o mapa: **“Publicar punto de ayuda”** (además de Necesito ayuda).  
- Tipos Place: `DONATION_POINT`, `HELP_CENTER`, `SHELTER`, `VOLUNTEER_POINT`, `MEDICAL`, `MEETING_POINT`, `OTHER`.  
- Formulario mínimo: tipo → pin → título corto → descripción (qué reciben / horarios) → opcional URL evidencia.  
- `POST /api/v1/places` (o extensión de reports tipados PLACE).  
- Listado/filtro geo de Places junto a needs/events.  
- `expiresAt` default configurable (ej. 72h si tipo donación en “modo emergencia”).  
- Distinción UI: “Publicado por la comunidad” vs “Verificado”.  

### OUT (002)

- Pagos / pasarela de dinero.  
- KYC pesado / NIT obligatorio en v1 del registro org (opcional campo texto).  
- Scraping de redes.  
- Reemplazar REPS/IDEAM (siguen siendo connectors).  
- Admin completo (puede reutilizar 002-moderacion luego).

## 3. Escenarios

### A — Voluntario publica acopio

**Given** estoy en Pereira  
**When** publico DONATION_POINT con pin y “reciben agua y no perecederos”  
**Then** el punto sale en el mapa como UNVERIFIED con fuente USER/ORG y fecha

### B — ONG con evidencia

**Given** tengo URL del comunicado de la alcaldía  
**When** registro el Place con esa URL  
**Then** queda UNVERIFIED pero la UI muestra el enlace; un moderador puede pasar a VERIFIED

### C — Expiración

**Given** un acopio con expiresAt pasado  
**When** consulto el mapa  
**Then** no se muestra como activo (o se marca EXPIRED)

### D — No inventar

**Given** el formulario  
**When** intento poner cantidades sin fuente (“500 kits”)  
**Then** el copy desalienta cantidades; no hay campos numéricos de stock inventados

## 4. Constraints

- Constitution: trust visible, no autoridad falsa, privacidad mínima.  
- Rate limit estricto en POST places.  
- Sin teléfono obligatorio público en v1 (opcional y no indexado si se agrega después).  
- Español + i18n keys.

## 5. Criterios de verificación

- [ ] Flujo &lt;30s en móvil  
- [ ] Place aparece en GET places con geo filter  
- [ ] Badge UNVERIFIED por defecto  
- [ ] expiresAt respetaado en listados  
- [ ] OpenAPI actualizado  
- [ ] No se muestra como OFFICIAL sin moderación  

## 6. Relación con 001

| 001 | 002 |
|-----|-----|
| Need (“necesito ayuda”) | Place (“aquí ayudan / reciben”) |
| Events oficiales | Complementa huecos de acopio |
| Fuentes page | Incluye “puntos comunitarios” |

001 puede shippear sin 002. 002 es el **acelerador de cobertura país**.

## 7. Dependencias

- Modelo Place ya esbozado en data-model 001.  
- Moderación ligera recomendada pronto (spec 003 o ampliación admin).  
- Estrategia: `docs/sources/cobertura-nacional-estrategia.md`
