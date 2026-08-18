# Deploy, capacidad y opciones gratis

Checklist Fase 10 + guía práctica. **No** pedimos ni custodiamos donaciones; solo conectamos señales y lugares.

**Despliegue con Supabase (paso a paso):** [`SUPABASE.md`](SUPABASE.md).


## Dónde está el código

| Pieza | Path | Tecnología | Local |
|-------|------|------------|-------|
| **Frontend (PWA)** | `apps/frontend` | Angular | `pnpm dev:frontend` → `http://localhost:4200` |
| **Backend (API)** | `apps/backend` | NestJS | `pnpm dev:backend` → `http://localhost:3000` · Swagger `/api/docs` |
| **DB** | `infra/docker` | PostgreSQL + PostGIS | `pnpm docker:up` → `:5432` |
| **Tipos** | `packages/shared-types` | TS | build antes de front/back |

En local el front hace **proxy** de `/api` → `:3000` (`apps/frontend/proxy.conf.json`). En producción el front debe llamar al origen real del API (`API_CORS_ORIGIN` en el back).

---

## Qué se puede publicar hoy (alcance)

Sin cuenta:

| Acción | Ruta UI | API |
|--------|---------|-----|
| Aviso “necesito” / “puedo aportar” | `/buscar` | `POST /api/v1/needs` |
| Lugar de acopio / ayuda | `/publicar-punto` | `POST /api/v1/places` |
| Mascota perdida/encontrada | `/perdidos` | `POST /api/v1/pets` |
| Cerrar lo propio (enlace secreto) | `/cerrar` | `POST /api/v1/manage/close` |
| Ver directorio / cerca de mí | `/ayudar` | `GET /api/v1/places` |
| Personas desaparecidas | `/perdidos` → RND/SIRDEC | *sin base propia* |

Todo lo comunitario nace `UNVERIFIED` y puede expirar.

---

## Capacidad actual (si miles de personas usan la app)

### Lectura (ver listados)

- Diseñado para **muchas lecturas** en un solo nodo Nest + Postgres, si el hosting aguanta CPU/RAM.
- Listados truncados: avisos/mascotas ~**200** por respuesta; lugares hasta ~**800** con filtros.
- Cuellos reales: tamaño de DB de Places (SISPRO/OSM), CPU del plan gratis, cold start.

### Escritura (registrar ayuda / necesidad / lugar)

Límites actuales (por IP, ventana ~1 min):

| Endpoint | Tope aprox. |
|----------|-------------|
| Global API | **60** req/min |
| `POST /needs` | **10**/min |
| `POST /places` | **8**/min |
| `POST /pets` | **8**/min |

Implicación: **miles de registros totales en días/semanas** es plausible.  
**Miles de altas concurrentes en el mismo minuto** no: el rate-limit y un solo proceso lo frenan (a propósito, anti-spam).

Orden de magnitud realista en **plan gratis / 1 instancia**:

| Escenario | ¿Aguanta hoy? |
|-----------|----------------|
| Pico de lectura (cientos viendo a la vez) | Sí en planes decentes; en free tier puede haber sleep/cold start |
| Miles de avisos/lugares **acumulados** | Sí, si Postgres managed tiene disco; listados siguen paginados/truncados |
| Spike de **miles de POST/min** | No — rate-limit + 1 API. Haría falta cola, más instancias, límites por ciudad |
| Sync connectors (SISPRO/OSM) bajo carga | Independiente; no debe bloquear writes ciudadanos |

### Qué faltaría para “emergencia nacional viral”

1. Hosting siempre encendido (no free-sleep).  
2. Postgres managed con backup.  
3. CDN estático para el front.  
4. Rate-limit más fino + índices DB revisados.  
5. Observabilidad (errores 5xx, latencia).  
6. Opcional: cola Redis / workers para connectors.

Mejoras por fase: [`docs/product/ROADMAP-FASES.md`](../../docs/product/ROADMAP-FASES.md) (sección *Mejoras posibles*).

---

## Dónde desplegar **gratis** (razonable)

Combinación típica:

| Capa | Opción gratis (ejemplos) | Notas |
|------|--------------------------|--------|
| **Front** | Cloudflare Pages, Netlify, Vercel, GitHub Pages | Build: `pnpm --filter @aee/frontend build` → servir `apps/frontend/dist/frontend` |
| **API** | Render / Railway / Fly.io (free o crédito) | Imagen `infra/docker/Dockerfile.backend` o `node dist/main.js` |
| **DB** | Neon, Supabase, Railway Postgres, Render Postgres | Preferir **PostGIS** (Neon/Supabase lo permiten o extensión). Sin PostGIS, parte geo puede degradarse |

### Pasos mínimos

1. Crear DB Postgres (+ PostGIS si se puede) → copiar `DATABASE_URL`.  
2. Desplegar API con env: `NODE_ENV=production`, `DATABASE_URL`, `API_CORS_ORIGIN=https://tu-front`, `OPS_TOKEN`, `MODERATION_TOKEN`, `TYPEORM_MIGRATIONS_RUN=true`, `TYPEORM_SYNCHRONIZE=false`.  
3. Build front con la URL del API (hoy el proxy solo es local: hay que apuntar `ApiService` / env de build al API público — ver mejora abajo).  
4. HTTPS lo dan Pages/Render/etc.  
5. Health: `GET /api/v1/health/ready`.

### Limitaciones de lo gratis

- Sleep / cold start (primera petición lenta).  
- Cuotas de horas-RAM y de DB.  
- No es ideal para un pico nacional; sirve para **piloto público** y validar uso.

### Alternativa un solo VPS

`docker compose -f infra/docker/docker-compose.prod.yml` en un VPS barato + Caddy/nginx. Más control; ya no es “gratis”.

---

## Checklist de producción (siempre)

1. Secretos fuertes fuera de git.  
2. `synchronize` off; migraciones on.  
3. CORS al dominio del front.  
4. Backup DB.  
5. `OPS_TOKEN` para connectors.  
6. Monitorear `/health/ready` y `/connectors/status`.

```bash
docker compose -f infra/docker/docker-compose.prod.yml up -d --build
pnpm --filter @aee/backend migration:run   # si no usas migrationsRun al boot
```

### Front y API en hosts distintos

1. Edita `apps/frontend/src/environments/environment.production.ts` → `apiBase: 'https://TU-API/api/v1'`.  
2. `pnpm --filter @aee/frontend build`.  
3. Sube `apps/frontend/dist/frontend` a Pages/Netlify/etc.  
4. En el API: `API_CORS_ORIGIN=https://tu-front`.

### Mismo dominio (recomendado)

Caddy/nginx: `/` → estáticos del front; `/api` → Nest. Entonces `apiBase` puede quedar `/api/v1`.

---

## Hueco conocido (mitigado)

`ApiService` usa `environment.apiBase`. En prod, o mismo origen con proxy, o URL absoluta del API en `environment.production.ts` antes del build.
