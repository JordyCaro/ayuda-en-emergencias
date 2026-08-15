# Spec 006 — Deep-links oficiales extra

**Producto:** Ayuda en Emergencias  
**Feature:** `006-deep-links-oficiales`  
**Fase:** 7  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. La persona llega a **canales oficiales** (SGC, RND/SIRDEC, UNGRD, IDIGER, Cruz Roja…) sin que inventemos datos.  
2. **Personas desaparecidas:** solo deep-link a Medicina Legal / RND — **nunca** base propia.  
3. **Sismos:** deep-link al visor SGC mientras el connector esté `BLOCKED`.  
4. Copy explícito: no somos autoridad; confirma siempre en el sitio oficial.  
5. Fuentes seed incluyen ids de deep-link (status `BLOCKED` o `DISCOVERY` según caso).

## 2. Alcance

### IN

- Página `/oficiales` (o sección fuerte en Fuentes) con tarjetas de deep-link.  
- Nav + home CTA.  
- Seed sources: `sgc`, `rnd`, `ungrd`, `idiger` (urls oficiales).  
- Disclaimer personas desaparecidas.  
- Docs: Fase 7 hecha; **mascotas** elevadas a fase prioritaria siguiente (no marketplace).

### OUT

- Connector SGC query hasta dejar de estar BLOCKED.  
- Base propia de desaparecidos o scrapeo SIRDEC.  
- Registro de mascotas en este slice (Fase 8 reordenada).  
- Checkout / matching.

## 3. Escenarios

### A — Buscar desaparecido

**Given** necesito consultar un desaparecido  
**When** abro Oficiales → Personas desaparecidas  
**Then** salgo a SIRDEC/RND; copy dice que no somos el registro oficial

### B — Sismo

**Given** quiero ver sismos  
**When** abro SGC  
**Then** voy al visor oficial

## 4. Constraints

- Constitution: no autoridad; no inventar; personas → derivar a oficial.  
- Lean docs.

## 5. Criterios

- [x] `/oficiales` con deep-links  
- [x] Personas solo enlace oficial  
- [x] SGC / UNGRD / IDIGER enlazados  
- [x] Roadmap Fase 7 + mascotas prioritarias  

## 6. Dependencias

- Source registry Fase 0.  
- Mascotas perdidas/encontradas → Fase 8 (elevada).
