# Ayuda en Emergencias

**Capa abierta que conecta** información de emergencias en Colombia: alertas oficiales, avisos de la comunidad en el mapa, y (más adelante) enlaces a centros de acopio, fundaciones y ONG.

> **No** somos autoridad de emergencias.  
> **No** pedimos ni recibimos donaciones (ni dinero ni especie). Solo conectamos información y actores.

| | |
|---|---|
| **Estado** | MVP **001** usable en local (API + PWA + PostGIS + IDEAM) |
| **Metodología** | Spec-Driven Development (SDD) |
| **Forma** | Monorepo pnpm (`apps/frontend`, `apps/backend`, …) |

---

## Empieza aquí

| Si eres… | Abre esto |
|----------|-----------|
| **Nuevo en el repo / compartir con alguien** | [`docs/product/QUE-ES.md`](docs/product/QUE-ES.md) → [`docs/dev/COMO-CORRER.md`](docs/dev/COMO-CORRER.md) |
| **Mapa de carpetas** | [`docs/MAPA-DEL-REPO.md`](docs/MAPA-DEL-REPO.md) |
| **Agente de IA** | [`AGENTS.md`](AGENTS.md) |
| **Contrato MVP** | [`specs/001-mvp-mapa-ayuda/spec.md`](specs/001-mvp-mapa-ayuda/spec.md) |
| **Reglas** | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) |

---

## Qué hace el MVP 001

1. **Inicio** — explica el producto.  
2. **Dejar un aviso** — comentario en un lugar (“hace falta agua / ayuda con escombros…”). No es un pedido que prometamos cumplir.  
3. **Comunidad** — lista + mapa: alertas oficiales (IDEAM) + avisos de personas (sin verificar).  
4. **Confianza** — de dónde sale cada dato.  
5. **API** — NestJS documentada en Swagger.

Detalle: [`docs/product/QUE-ES.md`](docs/product/QUE-ES.md)

---

## Cómo compilar y correr

Guía completa: **[`docs/dev/COMO-CORRER.md`](docs/dev/COMO-CORRER.md)**

```powershell
# Requisitos: Node 20+, pnpm 9, Docker Desktop
Copy-Item .env.example .env
pnpm install
pnpm --filter @aee/shared-types build
pnpm docker:up
pnpm dev:backend     # :3000  Swagger → /api/docs
pnpm dev:frontend    # :4200
```

Build:

```powershell
pnpm --filter @aee/shared-types build
pnpm --filter @aee/backend build
pnpm --filter @aee/frontend build
```

---

## Estructura del monorepo

```text
apps/frontend   → Angular PWA
apps/backend    → NestJS API + connector IDEAM
packages/       → tipos compartidos
infra/docker    → PostGIS
connectors/     → anclas de integraciones
specs/          → contratos SDD
docs/           → explicación humana
```

---

## Documentación índice

| Tema | Archivo |
|------|---------|
| Qué es / para qué | `docs/product/QUE-ES.md` |
| Visión | `docs/product/vision.md` |
| Correr / compilar | `docs/dev/COMO-CORRER.md` |
| Probar por fases | `docs/dev/COMO-PROBAR-FASES.md` |
| Spec 001 | `specs/001-mvp-mapa-ayuda/` |
| Fuentes | `docs/sources/` |
| ADRs | `docs/architecture/adr/` |

---

## Fuera de alcance (nosotros no lo hacemos)

- Recaudar o custodiar donaciones  
- Prometer cumplimiento de avisos  
- Voluntariado / mascotas / RND como producto propio en 001  

Esos vínculos a **terceros** se planifican en **002+**.
