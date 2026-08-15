# Deploy — checklist Fase 10

No automatizamos el hosting (depende del operador). Esta es la lista mínima para salir a público.

## Antes de publicar

1. Generar secretos fuertes: `POSTGRES_PASSWORD`, `OPS_TOKEN`, `MODERATION_TOKEN`.  
2. `.env` solo en el servidor (nunca en git).  
3. `NODE_ENV=production` → sin `synchronize`; migraciones con `TYPEORM_MIGRATIONS_RUN=true`.  
4. HTTPS delante (Caddy / nginx / Cloudflare / balanceador del hosting).  
5. `API_CORS_ORIGIN` = origen real del front (no `*`).  
6. Backup diario del volumen Postgres (`aee_pgdata_prod` o managed DB).  
7. Healthchecks: `/api/v1/health/live` y `/api/v1/health/ready`.  
8. Connectors: `GET /api/v1/connectors/status`; runs con header `X-Ops-Token`.

## Arranque contenedores

```bash
# desde la raíz del monorepo
docker compose -f infra/docker/docker-compose.prod.yml up -d --build
```

Front: construir `pnpm --filter @aee/frontend build` y servir `dist` detrás del mismo HTTPS (nginx/Caddy) o hosting estático apuntando al API.

## Migraciones (CLI local)

```bash
pnpm --filter @aee/backend migration:run
```
