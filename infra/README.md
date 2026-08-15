# infra/ — Infraestructura (no es lógica de producto)

## Qué hay

| Path | Rol |
|------|-----|
| `docker/docker-compose.yml` | PostGIS local (dev) |
| `docker/docker-compose.prod.yml` | PostGIS + API (prod-like) |
| `docker/Dockerfile.backend` | Imagen Nest |
| `docker/init-postgis.sql` | Extensiones PostGIS/uuid |
| `deploy/README.md` | Checklist HTTPS, secretos, backups |

## Dev

```bash
pnpm docker:up
pnpm dev:backend
pnpm dev:frontend
```

## Prod-like

```bash
docker compose -f infra/docker/docker-compose.prod.yml up -d --build
```

Ver `deploy/README.md`.
