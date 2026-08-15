# Spec 004 — Descubrimiento de dónde ayudar (enlace a terceros)

**Producto:** Ayuda en Emergencias  
**Feature:** `004-donacion-descubrimiento-enlace`  
**Fase:** 5  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. En **Quiero ayudar** la persona ve **solo lugares** (acopio, albergue, centro, voluntariado, salud…) y **cómo ayudar** vía canal de la org o Cómo llegar.  
2. “Donación” en producto = **llevar ayuda en especie / acopio / canal de la org**, **no** recaudar dinero en nuestra web.  
3. Filtros “qué se necesita” + “tipo de lugar” (incl. llevar ayuda / acopio) bastan para descubrir terceros.  
4. Copy: la acción ocurre **fuera**; no somos intermediarios; no hay checkout ni billeteras.  
5. Avisos de comunidad (NEED/OFFER) viven en `/buscar`, no en Quiero ayudar.

## 2. Alcance

### IN

- `/ayudar` sin pestaña Avisos; solo directorio de Places.  
- Labels suaves: “Llevar ayuda / acopio”, no “dona plata aquí”.  
- Destacar `externalUrl` como “Ir a su canal” / cómo ayudar.  
- Seed curado: orgs reconocibles (Cruz Roja, ABACO, bancos de alimentos, etc.) con deep-link.  
- Disclaimer de no custodia / no pasarela.  
- Docs vivos: roadmap Fase 5 hecha.

### OUT

- Pasarela, wallets, QR de dinero nuestro, inventario de especie.  
- Listados de “recaudaciones” o campañas de dinero ajenas como producto principal.  
- Matching de voluntarios (sigue OUT).  
- Moderación completa (Fase 8).  
- Garantías legales falsas.

## 3. Escenarios

### A — Llevar alimentos

**Given** filtro Alimentos o tipo Llevar ayuda  
**When** abro un banco de alimentos / ABACO  
**Then** veo su canal externo; copy dice que donamos/llevamos allí, no aquí

### B — Solo lugares

**Given** estoy en Quiero ayudar  
**When** miro la página  
**Then** no hay tab Avisos; avisos están en ¿Qué necesitas?

## 4. Constraints

- Constitution IX–X: no recaudar/custodiar; solo enlace.  
- Preferir orgs curadas / `externalUrl` claro.  
- Español primero; tono de “dónde llevar ayuda”, no de crowdfunding.

## 5. Criterios de verificación

- [x] `/ayudar` sin avisos  
- [x] Filtros qué se necesita + tipo (acopio/albergue/…)  
- [x] Sin UI de pago  
- [x] Disclaimer no intermediarios  
- [x] Roadmap Fase 5 hecha  

## 6. Relación

| Fase 3–4 | Fase 5 |
|----------|--------|
| Places + Quiero ayudar | Enfoque lugares + discovery “llevar ayuda” sin dinero en-app |
| `/buscar` avisos | Sigue siendo el foro |

## 7. Dependencias

- Places + curated seed.  
- Legal formal (términos) → antes de prod masiva (Fase 9 + revisión humana).
