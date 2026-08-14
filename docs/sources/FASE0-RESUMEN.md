# Fase 0 — Resumen

**Última ampliación:** 2026-08-14 — cobertura país + auto-registro (spec 002)

## Respuesta a “¿más ciudades + registrar nosotros?”

**Sí, las dos cosas a la vez:**

1. **Seguir integrando** lo nacional (REPS/SISPRO ~20k IPS, DIVIPOLA, IDEAM, UNGRD, Cali, Medellín…).  
2. **Spec 002** — registro fácil de puntos/acopios por ciudadanos y organizaciones, para ciudades sin API (Pereira, Manizales, municipios pequeños…).

Doc guía: [`cobertura-nacional-estrategia.md`](cobertura-nacional-estrategia.md)  
Spec: [`../../specs/002-registro-facil-lugares/spec.md`](../../specs/002-registro-facil-lugares/spec.md)

## Hallazgo clave

OSM es irregular (Barranquilla 2 hospitales vs Cali 297).  
**SISPRO FeatureServer** da cobertura de salud **real a escala país** (probado Chocó/Amazonas/Risaralda).

## Docs

| Archivo | Contenido |
|---------|-----------|
| `cobertura-nacional-estrategia.md` | Capas A/B/C + orden de build |
| `contexto-sismo-2026.md` | Por qué |
| `entidades-territoriales.md` | SNGRD + ciudades |
| `source-registry-extended.md` | Inventario |
| `specs/002-…/spec.md` | Auto-registro Places |

## Gate

001 sigue siendo el primer código. 002 es el acelerador de cobertura. Discovery de más alcaldías **no bloquea**.
