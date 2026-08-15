# Cómo correr el proyecto en local

Guía base para **ti y otros devs**. Si solo tienes 10 minutos, sigue la sección *Arranque rápido*.

Repo: monorepo **Ayuda en Emergencias** (TypeScript).  
Detalle de carpetas: [`../MAPA-DEL-REPO.md`](../MAPA-DEL-REPO.md) · Producto: [`../product/QUE-ES.md`](../product/QUE-ES.md)

---

## Idea en 30 segundos

| Pieza | Qué es | Cómo corre en local |
|-------|--------|---------------------|
| **Frontend** | Angular PWA (`apps/frontend`) | Node: `pnpm dev:frontend` → **:4200** |
| **Backend** | NestJS API (`apps/backend`) | Node: `pnpm dev:backend` → **:3000** |
| **Base de datos** | PostgreSQL + PostGIS | **Solo esto** usa Docker → **:5432** |

**Docker no ejecuta la app.** Solo levanta Postgres. Front y API siempre van con **Node + pnpm**.

```text
Navegador :4200  →  (proxy /api)  →  API :3000  →  PostGIS :5432
```

---

## Requisitos

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| **Node.js** | 20 o superior | Front + API |
| **pnpm** | 9.x | Instalar y scripts del monorepo |
| **Git** | cualquiera reciente | Clonar |
| **Docker Desktop** | con motor corriendo | PostGIS local (recomendado) |

Opcional sin Docker: Postgres/PostGIS en la nube (Neon, Supabase, etc.) y poner `DATABASE_URL` en `.env`.

### Windows (PowerShell) — si `pnpm` no se reconoce

```powershell
npm install -g pnpm@9
$env:Path = "$env:APPDATA\npm;" + $env:Path
```

---

## Arranque rápido (primera vez)

```powershell
git clone https://github.com/JordyCaro/ayuda-en-emergencias.git
cd ayuda-en-emergencias   # o la carpeta donde clonaste

Copy-Item .env.example .env

pnpm install
pnpm --filter @aee/shared-types build

# 1) Abrir Docker Desktop y esperar a que esté "Running"
pnpm docker:up

# 2) Dos terminales:
pnpm dev:backend     # http://localhost:3000/api/v1  · Swagger /api/docs
pnpm dev:frontend    # http://localhost:4200
```

Abre **http://localhost:4200**. Si ves la home y datos (o al menos la UI), listo.

| Qué | URL |
|-----|-----|
| App | http://localhost:4200 |
| Health | http://localhost:3000/api/v1/health |
| Swagger | http://localhost:3000/api/docs |

---

## Cada día (ya instalado)

```powershell
# Docker Desktop abierto
pnpm docker:up          # si el contenedor no está up
pnpm dev:backend
pnpm dev:frontend
```

No hace falta `pnpm install` cada vez (solo si cambió el lockfile).  
`shared-types` solo rebuild si tocaste `packages/shared-types`.

---

## Variables de entorno

1. Copia `.env.example` → `.env` en la **raíz** del monorepo.  
2. **No subas** `.env` a git (secretos).  
3. Valores por defecto de desarrollo:

| Variable | Uso típico local |
|----------|------------------|
| `DATABASE_URL` | `postgresql://aee:aee@localhost:5432/ayuda_emergencias` |
| `API_PORT` | `3000` |
| `API_CORS_ORIGIN` | `http://localhost:4200` |
| `OPS_TOKEN` / `MODERATION_TOKEN` | tokens de dev (connectors / ops) |

El front en local usa proxy: `apps/frontend/proxy.conf.json` manda `/api` → `:3000`.

---

## Docker: qué hace y si falla

### Comandos

```powershell
pnpm docker:up      # docker compose … up -d  → contenedor aee-postgis
pnpm docker:down
pnpm docker:logs
docker ps           # debe listar aee-postgis (healthy)
```

Compose: `infra/docker/docker-compose.yml`.

### Si “Docker no me corre”

1. **Abre Docker Desktop** y espera el estado *Running* (el icono de la ballena).  
2. En Windows hace falta **WSL2**; tras instalar Docker a veces hay que reiniciar el PC.  
3. Prueba en terminal: `docker version` y `docker ps`.  
   - Si fallan → el problema es la instalación de Docker, no el repo.  
4. Puerto **5432** libre (otra Postgres local puede chocar; cambia `POSTGRES_PORT` en `.env`).  
5. Vuelve a: `pnpm docker:up`.

### Alternativa sin Docker

1. Crea un Postgres **con PostGIS** (Neon / Supabase / otra).  
2. En `.env`: `DATABASE_URL=postgresql://…`  
3. Sigue con `pnpm dev:backend` y `pnpm dev:frontend` (igual).

---

## Compilar (build)

```powershell
pnpm --filter @aee/shared-types build
pnpm --filter @aee/backend build
pnpm --filter @aee/frontend build
```

| Salida | Path |
|--------|------|
| API | `apps/backend/dist` |
| UI | `apps/frontend/dist/frontend` |

API compilada: `pnpm --filter @aee/backend start:prod`.

Deploy: [`../../infra/deploy/README.md`](../../infra/deploy/README.md).

---

## Mapa rápido del repo

| Path | Rol |
|------|-----|
| `apps/frontend` | UI Angular |
| `apps/backend` | API Nest + connectors |
| `packages/shared-types` | Tipos compartidos (hay que build) |
| `infra/docker` | PostGIS local / prod-like |
| `specs/` | Contratos SDD por feature |
| `docs/product/` | Qué es + roadmap |

---

## Smoke test manual (2–3 min)

1. Home `/` — carga.  
2. `/buscar` — listar o publicar un aviso (guarda el enlace de cierre).  
3. `/ayudar` — directorio / filtros.  
4. `/perdidos` — pestaña Mascotas / Personas.  
5. `/origenes` — fuentes y canales.  
6. Health: http://localhost:3000/api/v1/health → `"status":"ok"`.

Sync manual IDEAM (opcional): `POST /api/v1/connectors/ideam/run` (en prod lleva `X-Ops-Token`).

---

## Problemas frecuentes

| Síntoma | Qué hacer |
|---------|-----------|
| `pnpm` no existe | `npm i -g pnpm@9` + PATH `%APPDATA%\npm` |
| Backend no conecta DB | Docker Desktop up + `pnpm docker:up` + `DATABASE_URL` |
| `EADDRINUSE` puerto 3000 | Cierra el Nest viejo o mata el proceso en :3000 |
| Front sin datos / errores API | Backend en :3000; abre Swagger; revisa proxy |
| Contenedor no healthy | `pnpm docker:logs`; reinicia Docker Desktop |
| Cambios en tipos no se ven | `pnpm --filter @aee/shared-types build` y reinicia API/front |
| IDEAM 0 eventos | Red; mira `lastError` en `/api/v1/sources` o `/connectors/status` |

---

## Stack (para orientarte)

- Front: **Angular** + TypeScript + MapLibre  
- API: **NestJS** + TypeORM  
- DB: **PostgreSQL + PostGIS**  
- Tooling: **pnpm** workspaces  

Primera vez: la fricción suele ser Docker Desktop / WSL, no el código.  
Día a día: dos comandos `dev:*` y listo.
