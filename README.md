# Ayuda en Emergencias

**Capa abierta que conecta** información de emergencias en Colombia: datos oficiales (cuando se integran), avisos de la comunidad (“necesito” / “puedo aportar”), y directorio de acopios u organizaciones.

> **No** somos autoridad de emergencias.  
> **No** pedimos ni recibimos donaciones (ni dinero ni especie). Solo conectamos información y actores.

| | |
|---|---|
| **Estado** | Fases **0–3** hechas. Siguiente: **Fase 4** (slice `003+`). |
| **Metodología** | Spec-Driven Development (SDD) — lean |
| **Forma** | Monorepo pnpm (`apps/frontend`, `apps/backend`, …) |

---

## Empieza aquí

| Si eres… | Abre esto |
|----------|-----------|
| **Propósito** | [`docs/product/QUE-ES.md`](docs/product/QUE-ES.md) |
| **Correr en local** | [`docs/dev/COMO-CORRER.md`](docs/dev/COMO-CORRER.md) |
| **Roadmap** | [`docs/product/ROADMAP-FASES.md`](docs/product/ROADMAP-FASES.md) |
| **Mapa del repo** | [`docs/MAPA-DEL-REPO.md`](docs/MAPA-DEL-REPO.md) |
| **Agente de IA** | [`AGENTS.md`](AGENTS.md) |
| **Specs** | [`specs/001-mvp-mapa-ayuda/`](specs/001-mvp-mapa-ayuda/) · [`specs/002-registro-facil-lugares/`](specs/002-registro-facil-lugares/) |
| **Reglas** | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) |

---

## Qué hace hoy

1. **Inicio** — qué es, utilidad, conteos reales, fuentes.  
2. **¿Qué necesitas?** (`/buscar`) — avisos necesito / puedo aportar.  
3. **Ayudar** (`/ayudar`) — directorio de lugares + mini-mapa.  
4. **Publicar punto** — registro de acopio / org.  
5. **Fuentes** — procedencia e integración.  
6. **API** — NestJS `/api/v1` + Swagger.

---

## Cómo correr

```powershell
Copy-Item .env.example .env
pnpm install
pnpm --filter @aee/shared-types build
pnpm docker:up
pnpm dev:backend     # :3000  Swagger → /api/docs
pnpm dev:frontend    # :4200
```

Detalle: [`docs/dev/COMO-CORRER.md`](docs/dev/COMO-CORRER.md)

---

## Documentación (mínima)

Preferimos **pocos docs vivos** + specs SDD. No crear memos de estado, inspiración o resúmenes duplicados.

| Tema | Archivo |
|------|---------|
| Propósito | `docs/product/QUE-ES.md` |
| Fases | `docs/product/ROADMAP-FASES.md` |
| Correr | `docs/dev/COMO-CORRER.md` |
| Fuentes | `docs/sources/source-registry.md` |
| ADRs | `docs/architecture/adr/` |
| Workflow SDD | `docs/sdd/workflow.md` |

---

## Fuera de alcance

- Recaudar o custodiar donaciones  
- Prometer cumplimiento de avisos  
- Base oficial de desaparecidos / app de mascotas  

**Offline avanzado:** fase **12**, última y casi opcional.
