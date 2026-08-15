# Spec 003 — Quiero ayudar / voluntariado (enlace)

**Producto:** Ayuda en Emergencias  
**Feature:** `003-quiero-ayudar-enlace`  
**Fase:** 4  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner (continuar Fase 4)  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. Quien quiere ayudar encuentra en un solo flujo **avisos de necesidad** (comunidad) y **lugares/orgs** con canal externo.  
2. El contacto es **directo** (WhatsApp del aviso o URL del lugar) — la plataforma **no** intermedia ni asigna turnos.  
3. Copy explícito: no somos bolsa de empleo; no asignamos voluntarios; no pedimos ni custodiamos donaciones.  
4. Desde home/nav se llega claro a “Quiero ayudar”.  
5. Quien prefiere publicar un aporte usa el foro (`/buscar`, intent OFFER).

## 2. Alcance

### IN

- Hub `/ayudar` (alias `/quiero-ayudar`) con pestañas **Avisos** (NEED) y **Lugares**.  
- Avisos: filtro ciudad/categoría opcional; botón WhatsApp si hay número.  
- Lugares: reutilizar directorio Fase 3 (canal externo + Cómo llegar).  
- Disclaimer de no intermediación laboral / no donaciones.  
- CTA a publicar aporte → `/buscar` (OFFER).  
- Nav + home alineados a “Quiero ayudar” / Ayudar.

### OUT

- Matching, cola de turnos, nómina, “te asignamos”.  
- Pasarela o custodia de donaciones (Fase 5 = solo descubrimiento).  
- Moderación VERIFIED (Fase 8).  
- Offline (Fase 12).

## 3. Escenarios

### A — Responder a un aviso

**Given** hay avisos NEED con WhatsApp  
**When** abro Ayudar → Avisos y pulso WhatsApp  
**Then** se abre el chat con mensaje sugerido; nosotros no guardamos la conversación

### B — Ir al canal de una org

**Given** un Place con `externalUrl`  
**When** pulso “Ir a su canal”  
**Then** salgo a su sitio; copy deja claro que la ayuda es con ellos

### C — Publicar aporte

**Given** quiero ofrecer ayuda  
**When** uso “Puedo aportar”  
**Then** llego al foro en modo OFFER

## 4. Constraints

- Constitution: conectar, no intermediarios; avisos = señales; privacidad mínima.  
- Reutilizar Needs/Places API existentes (sin modelo nuevo de “VolunteerAssignment”).

## 5. Criterios de verificación

- [x] Tabs Avisos + Lugares en `/ayudar`  
- [x] Alias `/quiero-ayudar`  
- [x] WhatsApp en avisos NEED; canal en lugares  
- [x] Disclaimer visible  
- [x] CTA OFFER a `/buscar`  
- [x] Sin UI de “asignar voluntario”

## 6. Relación

| Ya existe (1–3) | Este slice |
|-----------------|------------|
| `/buscar` NEED/OFFER + WA | Consumir NEED en hub ayudar |
| `/ayudar` directorio Places | + pestaña avisos + disclaimer Fase 4 |
| `VOLUNTEER_POINT` | Sigue en Lugares |

## 7. Dependencias

- Fases 1–3 hechas.  
- Donación discovery → Fase 5.  

**Ajuste producto (004):** Quiero ayudar queda **solo lugares**; avisos NEED/OFFER viven en `/buscar`.
