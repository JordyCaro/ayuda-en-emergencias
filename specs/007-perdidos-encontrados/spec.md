# Spec 007 — Perdidos / encontrados (mascotas + personas)

**Producto:** Ayuda en Emergencias  
**Feature:** `007-perdidos-encontrados`  
**Fase:** 8  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. Quien perdió o encontró una **mascota** puede publicar una señal (`LOST` / `FOUND`) con ciudad y contacto opcional (WhatsApp).  
2. Los reportes de mascota son **`UNVERIFIED`**, expiran, y no son marketplace.  
3. **Personas:** la UI lleva a RND/SIRDEC y líneas de atención — **sin** fichas propias de desaparecidos (constitution).  
4. Nav clara: **Perdidos** → `/perdidos`.  
5. API pública: `GET/POST /api/v1/pets`.

## 2. Alcance

### IN

- Modelo `PetReport` (species, status LOST|FOUND, description, city, geometry, whatsapp opcional).  
- UI `/perdidos` con pestañas Mascotas | Personas.  
- Personas: enlaces RND + 123 / 141 / 155; copy calmado (sin banner alarmista).  
- Rate-limit POST; expiresAt default ~14 días.  
- Docs roadmap Fase 8 hecha.

### OUT

- Base propia de personas desaparecidas / scrapeo SIRDEC.  
- Fotos (puede ser fase posterior).  
- Matching automático “esta es tu mascota”.  
- Marketplace vet/paseos.  
- Moderación admin (Fase 9).

## 3. Escenarios

### A — Mascota perdida

**Given** perdí un perro en Pereira  
**When** publico LOST con ciudad y WhatsApp  
**Then** aparece en listado UNVERIFIED; otro puede escribir por WA

### B — Persona

**Given** busco a una persona  
**When** abro Perdidos → Personas  
**Then** voy a la consulta RND/SIRDEC; no hay formulario nuestro de desaparecidos

## 4. Constraints

- Constitution VIII–IX: personas → oficial; privacidad mínima.  
- WhatsApp opcional; no cédulas ni datos sensibles de personas.

## 5. Criterios

- [x] API pets + UI mascotas  
- [x] Tab personas solo deep-link  
- [x] Nav /perdidos  
- [x] Roadmap Fase 8 hecha  

## 6. Dependencias

- Geo cities, throttling.  
- Moderación → Fase 9.
