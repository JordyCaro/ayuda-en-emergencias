# Mapa del repositorio — Ayuda en Emergencias

Guía para **humanos y agentes**. Si solo tienes 2 minutos, lee las secciones 1 y 2.

---

## 1. Idea en una frase

Somos un **monorepo**: una sola carpeta del proyecto que contiene **frontend**, **backend** y piezas compartidas, cada una en su sitio, para no mezclar pantallas con base de datos.

---

## 2. Front vs Back (lo importante)

| Carpeta | Rol | Tecnología prevista | ¿Es una app que corre sola? |
|---------|-----|---------------------|-----------------------------|
| **`apps/frontend`** | Interfaz del ciudadano (pantallas, mapa, formularios, PWA) | Angular | Sí — en el navegador |
| **`apps/backend`** | API REST, validación, PostgreSQL/PostGIS, jobs de connectors | NestJS | Sí — servidor |
| **`apps/admin`** | Reservada (cierre = `/cerrar` sin panel) | — | Futuro |
| **`connectors/`** | “Adaptadores” que traen datos de IDEAM, SGC, etc. | TypeScript | No solos — los dispara el backend |
| **`packages/`** | Librerías internas compartidas (tipos, geo…) | TypeScript | No — se importan |
| **`infra/`** | Docker + **deploy** (`infra/deploy/README.md`) | YAML/docs | Cómo encender / publicar |

Local: front `:4200` · API `:3000` · PostGIS `:5432`.  
Deploy gratis y capacidad: [`infra/deploy/README.md`](../infra/deploy/README.md).  
Mejoras por fase: [`product/ROADMAP-FASES.md`](product/ROADMAP-FASES.md).

```text
        Ciudadano
            │
            ▼
   ┌─────────────────┐
   │  apps/frontend  │  ← solo UI; habla HTTP con el backend
   └────────┬────────┘
            │  REST / GeoJSON
            ▼
   ┌─────────────────┐         ┌──────────────────┐
   │  apps/backend   │◄────────│   connectors/    │◄── IDEAM, SGC, …
   └────────┬────────┘         └──────────────────┘
            │
            ▼
      PostgreSQL+PostGIS
      (definido en infra/)
```

**Anti-confusión:**

- No busques el front dentro de `docs/` ni de `specs/` — ahí solo hay documentación/contratos.  
- No pongas pantallas Angular en `apps/backend`.  
- No pongas lógica de Nest ni SQL en `apps/frontend`.  
- `connectors/` es **backend-side** (datos externos → DB), aunque viva fuera de `apps/backend` para aislar fallos por fuente.

---

## 3. Qué es `infra/` (y qué no es)

`infra` = **infraestructura**: recetas para que el proyecto **corra** en tu PC o en un servidor.

| Dentro de infra (previsto) | Para qué |
|----------------------------|----------|
| `infra/docker/` | `docker-compose`: levantar base de datos PostGIS + backend (+ a veces nginx con el frontend compilado) con un comando |
| `infra/deploy/` | Notas/scripts de publicación (hosting, HTTPS, backups) cuando exista deploy |

**No es:**

- No es el código de la API  
- No es la UI  
- No es la documentación de producto  
- No es donde se definen features (eso es `specs/`)

Hoy la carpeta está **reservada** (solo README) porque aún no hay código. Cuando implementemos, aquí vivirá por ejemplo:

```text
infra/docker/docker-compose.yml   → servicios: db, backend, (frontend)
infra/docker/Dockerfile.backend
.env.example                      → (en root) variables, sin secretos reales
```

Analogía: `apps/*` son los **edificios**; `infra/` son los **planos eléctricos y el camión de mudanza**.

Más detalle: [`../infra/README.md`](../infra/README.md).

---

## 4. Dónde está la documentación (para otros devs / IAs)

Hay **tres capas**. No las mezcles:

### A) Contratos de trabajo (SDD) — fuente de verdad de *qué construir*

```text
specs/
  001-mvp-mapa-ayuda/
    spec.md       ← QUÉ y POR QUÉ (comportamiento, IN/OUT, aceptación)
    plan.md       ← CÓMO técnico (arquitectura del slice)
    tasks.md      ← TAREAS ordenadas (checklist de implementación)
    data-model.md
    contracts/    ← OpenAPI sketch
    analyze.md
    research.md
```

**Orden obligatorio:** leer `spec` → `plan` → ejecutar `tasks`.  
Si algo falla al implementar: **primero** corregir spec/plan, no solo el código.

### B) Conocimiento del proyecto (humano)

```text
docs/
  MAPA-DEL-REPO.md           ← este archivo
  product/QUE-ES.md          ← propósito
  product/ROADMAP-FASES.md   ← fases canónicas
  architecture/adr/          ← decisiones de stack
  sources/                   ← registry de APIs
  sdd/workflow.md            ← loop SDD
  legal/
  api/
  dev/COMO-CORRER.md
```

### C) Reglas permanentes

```text
.specify/memory/constitution.md   ← no negociable
AGENTS.md                         ← cómo debe comportarse una IA en este repo
.cursor/rules/                    ← reglas Cursor always-on
```

---

## 5. Cómo sigue un/a developer (o agente) el método SDD

```text
┌──────────────┐
│ Constitution │  ¿Viola algún principio? (fuentes, trust, ética…)
└──────┬───────┘
       ▼
┌──────────────┐
│   Spec 001   │  ¿Qué debe poder hacer el usuario?
└──────┬───────┘
       ▼
┌──────────────┐
│    Plan      │  ¿En qué carpeta va cada pieza? ¿Qué endpoints?
└──────┬───────┘
       ▼
┌──────────────┐
│   Tasks      │  T0 discovery → T1 setup → … marcar checkboxes
└──────┬───────┘
       ▼
┌──────────────┐
│  Código en   │  frontend / backend / connectors según la task
│  apps/*      │
└──────┬───────┘
       ▼
┌──────────────┐
│  Converge    │  ¿Cumple los criterios del spec?
└──────────────┘
```

**Nunca** empieces código de producto sin spec+plan aprobados del slice activo.  
**Nunca** implementes features marcadas OUT en el spec (donaciones, mascotas, etc. en el 001).

Guía larga: [`sdd/workflow.md`](sdd/workflow.md).  
Instrucciones IA: [`../AGENTS.md`](../AGENTS.md).

---

## 6. Tareas: dónde mirar

| Tipo de trabajo | Archivo |
|-----------------|---------|
| Tareas del MVP actual | `specs/001-mvp-mapa-ayuda/tasks.md` |
| Discovery de APIs (antes de connectors) | Fase 0 en ese mismo `tasks.md` + `docs/sources/source-registry.md` |
| Nueva feature grande | Crear `specs/002-.../` con su propio spec/plan/tasks |

Las tasks están numeradas `T0.x` (docs), `T1.x` (setup código), `T2.x` (cimientos), luego user stories.

---

## 7. Árbol comentado (referencia rápida)

```text
apps/frontend/     # UI ciudadana
apps/backend/      # API + orquestación
apps/admin/        # moderación (post-MVP)
connectors/        # IDEAM, SGC, … (servidor)
packages/          # shared-types, geo, validation
infra/docker/      # docker-compose, Dockerfiles
infra/deploy/      # cuando exista producción
specs/             # SDD por feature
docs/              # explicación y registry
.specify/          # constitution + plantillas
tests/             # e2e globales (futuro)
AGENTS.md          # contrato para agentes
README.md          # puerta de entrada
```

---

## 8. Estado actual

- Documentación + roadmap de fases (0–12): **sí** — [`product/ROADMAP-FASES.md`](product/ROADMAP-FASES.md)  
- Código MVP 001 + Places/SISPRO (fases 1–2): **sí** (local)  
- Siguiente producto: **Fase 3 / spec 002**  
- Offline avanzado: **fase 12**, última y casi opcional
