# Ayuda en Emergencias

**Capa abierta que conecta** información de emergencias en Colombia: datos oficiales (cuando se integran), avisos de la comunidad (“necesito” / “puedo aportar”), y directorio de acopios u organizaciones.

> **No** somos autoridad de emergencias.  
> **No** pedimos ni recibimos donaciones (ni dinero ni especie). Solo conectamos información y actores.

| | |
|---|---|
| **Estado** | Fases **0–7** hechas. Siguiente: **Fase 8** (perdidos/encontrados). |
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
| **Contratos** | [`001`](specs/001-mvp-mapa-ayuda/) … [`006`](specs/006-deep-links-oficiales/) |
| **Reglas** | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) |

---

## Qué hace hoy

1. **Inicio** — qué es, utilidad, conteos reales, fuentes.  
2. **¿Qué necesitas?** (`/buscar`) — avisos necesito / puedo aportar.  
3. **Quiero ayudar** (`/ayudar`) — lugares + cómo ayudar + Cerca de mí.  
4. **Publicar lugar** (`/publicar-punto`) — acopios/bodegas/centros (crecimiento).  
5. **Orígenes** (`/origenes`) — canales oficiales + integraciones.  
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
