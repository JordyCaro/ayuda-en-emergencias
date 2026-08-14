# Quickstart (validación humana del slice 001)

Usar **después** de implementar. Hoy: N/A (sin código).

## Dev up (previsto)

```bash
# desde root
pnpm install
docker compose -f infra/docker/docker-compose.yml up -d
pnpm --filter backend dev
pnpm --filter frontend start
```

## Smoke

1. `GET /api/v1/health` → 200  
2. `GET /api/v1/sources` → lista con statuses  
3. Trigger connector o esperar cron → events &gt; 0 **o** fuente en error visible  
4. `POST /api/v1/needs` con point + category + description → 201  
5. Abrir `/mapa` → ver capas  
6. Abrir `/necesito-ayuda` → completar flujo  
7. Abrir `/fuentes` → coherente con API  

## Converge

Marcar checklist en `checklists/requirements.md`.
