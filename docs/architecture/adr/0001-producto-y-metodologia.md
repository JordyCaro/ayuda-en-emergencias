# ADR 0001 — Producto, nombre y metodología

**Fecha:** 2026-08-14  
**Estado:** Aceptada  
**Decisor:** criterios senior / practicidad (delegación del product owner)

## Contexto

Proyecto greenfield. Hay un master de producto extenso y una guía SDD. Hay que fijar nombre, rigor metodológico y tooling sin fricción para 1–3 voluntarios.

## Decisión

1. **Nombre de producto:** Ayuda en Emergencias  
2. **Slug:** `ayuda-en-emergencias`  
3. **Metodología:** Spec-Driven Development, madurez **Spec-Anchored (L2)** en API/datos/trust; L1 en UI exploratoria  
4. **Tooling SDD:** Markdown versionado en `specs/` + constitution en `.specify/memory/` **sin** depender de Spec Kit CLI ni OpenSpec en el día 0  
   - Motivo: cero fricción de instalación, funciona en Cursor Plan Mode, portable  
   - Adopción posterior de Spec Kit es compatible (misma forma mental)  
5. **Repo remoto / código de producto:** aún no. Solo documentación y estructura en carpeta local  

## Consecuencias

- El intent vive en archivos, no solo en el chat  
- Ciclo: constitution → specify → clarify → plan → tasks → (luego) implement → converge  
- No hay ceremonia de CLI; hay disciplina de archivos  

## Alternativas rechazadas

- Spec Kit CLI obligatorio desde día 0 → overhead innecesario sin remote  
- OpenSpec → pensado brownfield; aquí somos greenfield  
- Vibe-coding directo → alto drift en dominio sensible (emergencias)
