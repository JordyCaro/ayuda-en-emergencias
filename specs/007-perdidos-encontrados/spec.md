# Spec 007 — Perdidos / encontrados (mascotas + personas)

**Producto:** Ayuda en Emergencias  
**Feature:** `007-perdidos-encontrados`  
**Fase:** 8  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner; 2026-08-18 avisos comunitarios de personas (ADR 0006)  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. Quien perdió o encontró una **mascota** puede publicar una señal (`LOST` / `FOUND`) con ciudad, contacto opcional (WhatsApp) y **foto opcional**.  
2. Los reportes de mascota son **`UNVERIFIED`**, expiran, y no son marketplace.  
3. **Personas:** RND/SIRDEC y líneas de atención **siempre visibles**. El muro comunitario (`LOOKING` / `SEEN` / `FOUND`) es como mascotas: `UNVERIFIED`, 7 días, foto opcional — **no** es el registro oficial.  
4. Nav clara: **Perdidos** → `/perdidos`.  
5. API: `GET/POST /api/v1/pets`, `GET/POST /api/v1/people`, fotos en `/:id/photo`.

## 2. Alcance

### IN

- Modelo `PetReport` (species, LOST|FOUND, description, city, geometry, whatsapp opcional, foto JPEG opcional).  
- Modelo `PersonReport` (LOOKING|SEEN|FOUND, description, city, geometry, whatsapp opcional, foto JPEG opcional).  
- UI `/perdidos` con pestañas Mascotas | Personas.  
- Personas: muro como mascotas; canales oficiales en fichas laterales (escritorio) o compactas (celular), con disclaimer.  
- Rate-limit POST; expiresAt 7 días (luego se borra).  

### OUT

- Scrapeo SIRDEC / hacernos pasar por RND.  
- Campos de cédula o “ficha oficial”.  
- Matching automático.  
- Marketplace vet/paseos.

## 3. Escenarios

### A — Mascota perdida

**Given** perdí un perro en Pereira  
**When** publico LOST con ciudad y WhatsApp  
**Then** aparece en listado UNVERIFIED; otro puede escribir por WA

### B — Persona (oficial)

**Given** busco a una persona  
**When** abro Perdidos → Personas  
**Then** veo RND/SIRDEC y 123/141/155 **y** el muro comunitario (sin verificar)

### C — Se vio desorientada

**Given** vi a alguien desorientada en un barrio  
**When** publico SEEN con ciudad y descripción  
**Then** sale UNVERIFIED 7 días; el copy dice que también hay que llamar al 123 / RND

## 4. Constraints

- Constitution VIII–IX + ADR 0006.  
- WhatsApp opcional; no cédulas ni datos de menores.  

## 5. Criterios

- [x] API pets + UI mascotas  
- [x] Tab personas con canales oficiales  
- [x] Avisos comunitarios de personas + foto opcional  
- [x] Nav /perdidos  

## 6. Dependencias

- Geo cities, throttling.  
- Moderación → Fase 9.
