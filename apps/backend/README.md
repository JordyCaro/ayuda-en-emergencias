# apps/backend — NestJS API

Puerto: **3000** · Prefijo: `/api/v1` · Swagger: `/api/docs`

```powershell
# desde la raíz del monorepo (con PostGIS arriba)
pnpm docker:up
pnpm --filter @aee/shared-types build
pnpm dev:backend
```

Endpoints MVP: `health`, `sources`, `events`, `needs`, `POST connectors/ideam/run`.
