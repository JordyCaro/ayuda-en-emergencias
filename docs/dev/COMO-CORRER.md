# Cómo correr y compilar el proyecto

Requisitos: **Node.js 20+**, **pnpm 9**, **Docker Desktop** (PostGIS).

En Windows (PowerShell), si `pnpm` no se reconoce:

```powershell
$env:Path = "$env:APPDATA\npm;" + $env:Path
# o: npm install -g pnpm@9
```

---

## 1. Clonar e instalar

```powershell
git clone <URL-DEL-REPO>.git
cd <carpeta-del-repo>
Copy-Item .env.example .env
pnpm install
pnpm --filter @aee/shared-types build
```

---

## 2. Base de datos

```powershell
pnpm docker:up
# contenedor: aee-postgis · puerto 5432 · user/pass/db en .env
```

Comprobar: `docker ps` → `aee-postgis` healthy.

---

## 3. Desarrollo (dos terminales)

```powershell
pnpm dev:backend    # http://localhost:3000/api/v1  · Swagger /api/docs
pnpm dev:frontend   # http://localhost:4200  (proxy /api → :3000)
```

### URLs útiles

| Qué | URL |
|-----|-----|
| App | http://localhost:4200 |
| Health | http://localhost:3000/api/v1/health |
| Swagger | http://localhost:3000/api/docs |
| Fuentes | http://localhost:3000/api/v1/sources |
| Traer IDEAM a mano | `POST http://localhost:3000/api/v1/connectors/ideam/run` |

---

## 4. Compilar (build de producción local)

```powershell
pnpm --filter @aee/shared-types build
pnpm --filter @aee/backend build
pnpm --filter @aee/frontend build
```

- Backend: `apps/backend/dist`
- Frontend: `apps/frontend/dist/frontend`

Arranque backend compilado:

```powershell
pnpm --filter @aee/backend start:prod
```

---

## 5. Qué hace cada carpeta (rápido)

| Path | Rol |
|------|-----|
| `apps/frontend` | Angular PWA |
| `apps/backend` | NestJS API + jobs IDEAM |
| `packages/shared-types` | Enums/DTOs compartidos |
| `infra/docker` | PostGIS |
| `specs/001-mvp-mapa-ayuda` | Contrato del MVP |
| `docs/product/QUE-ES.md` | Explicación de producto |

---

## 6. Probar el MVP en 2 minutos

1. Abrir inicio → leer de qué va.  
2. **Dejar un aviso** → texto + ubicación → publicar.  
3. **Comunidad** → ver el aviso; **Actualizar** para traer alertas IDEAM.  
4. **Confianza** → ver fuentes.

Más detalle por fases: [`COMO-PROBAR-FASES.md`](COMO-PROBAR-FASES.md)

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| Backend no conecta DB | Docker Desktop abierto + `pnpm docker:up` + `DATABASE_URL` en `.env` |
| Frontend sin datos | Backend en :3000; proxy `apps/frontend/proxy.conf.json` |
| `pnpm` no existe | `npm i -g pnpm@9` y PATH de `%APPDATA%\npm` |
| IDEAM 0 eventos | Red/firewall; ver `lastError` en `/sources` |

---

## Variables (`.env.example`)

No subas `.env` con secretos. Copia desde `.env.example` (usuario/clave locales de desarrollo).
