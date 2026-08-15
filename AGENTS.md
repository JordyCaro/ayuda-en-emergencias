# AGENTS.md — Instrucciones para agentes de IA

Este repo usa **Spec-Driven Development (SDD)**. El intent vive en archivos, no solo en el chat.

Producto: **Ayuda en Emergencias** — capa abierta que **conecta** (no intermedia donaciones).

---

## Documentación lean (obligatorio)

- **No** crear docs de estado, rumbo, inspiración, “resúmenes de fase” o visiones duplicadas.  
- Docs vivos mínimos: `README` · `QUE-ES` · `ROADMAP-FASES` · `COMO-CORRER` · `MAPA-DEL-REPO` · `sources/*registry*` · ADRs · `sdd/workflow` · constitution · `specs/`.  
- Comportamiento nuevo → actualizar **spec/plan/tasks** (y código). El roadmap solo si cambia el orden de fases.  
- Si un markdown no sirve a un contribuidor externo o a un slice → no lo escribas.

---

## Antes de escribir código de producto

1. Leer `.specify/memory/constitution.md`  
2. Slice activo: `001`–`009` hechos; siguientes opcionales **11** (multi-país) / **12** (offline).  
   - Personas: **nunca** base propia de desaparecidos (constitution).  
   - Publicar lugar = capacidad estratégica de crecimiento.  
3. Leer `spec.md` → `plan.md` → `tasks.md`  
4. Si el pedido contradice OUT del spec o la constitution → **parar y preguntar**  
5. No implementar OUT del slice activo  
6. Roadmap: `docs/product/ROADMAP-FASES.md` — **offline = fase 12, casi opcional**

## Mapa mental del monorepo

| Path | Qué es |
|------|--------|
| `apps/frontend` | UI Angular PWA |
| `apps/backend` | API NestJS |
| `apps/admin` | Moderación — futuro |
| `connectors/` | Ingestión de fuentes |
| `packages/` | Código compartido |
| `infra/` | Docker/deploy — no lógica de negocio |
| `specs/` | Contratos SDD |
| `docs/` | Explicaciones mínimas + ADRs + registry |

## Si algo sale mal

1. ¿La **spec** era ambigua? → actualizar spec/plan  
2. Regenerar o corregir código **después**  
3. No pelear solo con el código  

## Principios que nunca rompas

- Procedencia visible en todo dato  
- Reportes de usuario = `UNVERIFIED`  
- No inventar emergencias ni cantidades sin fuente  
- No scraping agresivo; licencia desconocida = `LEGAL_REVIEW`  
- API pública no proxy en caliente a terceros (connector → DB → API)  
- No recaudar/custodiar donaciones  

## Onboarding de contexto

1. `README.md`  
2. `docs/product/QUE-ES.md`  
3. `docs/product/ROADMAP-FASES.md`  
4. `docs/dev/COMO-CORRER.md`  
5. Constitution  
6. Spec/plan/tasks del slice activo  

## Estado del proyecto

Fases **0–10** hechas. Opcional: **11** multi-país · **12** offline.  
Superficie: `/` · `/buscar` · `/ayudar` · `/perdidos` · `/publicar-punto` · `/origenes` · `/cerrar`.  
Publicar lugar = motor de crecimiento (acopios comunitarios + API).  
Offline = **12**.
