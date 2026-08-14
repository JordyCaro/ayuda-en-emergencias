# ADR 0003 — Alcance del MVP (slice 001)

**Fecha:** 2026-08-14  
**Estado:** Aceptada

## Contexto

El master describe muchas pantallas. SDD prohíbe especificar el producto entero el día 1. Hay que elegir una vertical delgada útil.

## Decisión — Feature `001-mvp-mapa-ayuda`

### IN

1. Home con acciones: Necesito ayuda, Ver mapa, Fuentes (+ stubs visibles “próximamente” para Quiero ayudar / Donar / Reportar ampliado si hace falta, sin implementar flujos completos)  
2. Mapa con capas: eventos/alertas oficiales + necesidades/reportes  
3. Connector(s) Tier 1 viables tras discovery (prioridad: IDEAM alertas hidrológicas; SGC sismos si API usable)  
4. Flujo **Necesito ayuda** (&lt;30s): ubicación → categoría → descripción → enviar → `UNVERIFIED`  
5. API REST base + OpenAPI sketch  
6. Página **Fuentes** (transparencia)  
7. Modelo de datos genérico (Source, Record/Event, Need/Report, Place stub)

### OUT (explícito para 001)

- Donaciones (mostrar receptores oficiales)  
- Voluntariado completo  
- Mascotas  
- Personas desaparecidas (más allá de enlace futuro a recurso oficial)  
- Moderación admin completa (puede ser 002)  
- Offline avanzado / sync IndexedDB completo  
- Notificaciones, bots, IA  
- Multi-país real (sí: modelo Country-ready; no: connectors extranjeros)

## Criterio de éxito

Una persona en Colombia puede abrir la PWA, ver situación/alertas con fuente y fecha, reportar una necesidad, y entender de dónde salen los datos — en una sesión corta.

## Consecuencias

- Spec 001 es el único contrato implementable al empezar código  
- Features OUT requieren `002+` con su propia spec
