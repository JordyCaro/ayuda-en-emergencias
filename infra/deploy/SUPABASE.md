# Desplegar con Supabase (DB) + API + Front

Esta app **no es Next.js**. No uses la pestaña **Framework** ni `@supabase/supabase-js`.  
El backend (NestJS + TypeORM) necesita una **cadena Postgres Direct**.

```text
Front (Netlify / Cloudflare Pages)
        │  HTTPS
        ▼
API  (Render / Railway)     ← DATABASE_URL
        │
        ▼
Supabase Postgres + PostGIS
```

---

## 1. Supabase — solo la base de datos

1. Entra al proyecto en [supabase.com](https://supabase.com).  
2. Arriba: **Connect**.  
3. Elige **Direct** (o **ORM**), **no** Framework / Next.js.  
4. Copia la **URI** tipo:

```text
postgresql://postgres:TU_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

Si la contraseña tiene caracteres raros (`@`, `#`, `%`), hay que **URL-encodearla**.

5. Activa PostGIS. En el dashboard: **SQL Editor** → New query:

```sql
create extension if not exists postgis;
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
```

Run.

**No** uses `NEXT_PUBLIC_SUPABASE_URL` ni `PUBLISHABLE_KEY`. Eso es para otra clase de apps.

**No** subas la URI a GitHub ni al chat público.

---

## 2. API en Render (gratis / fácil)

1. [render.com](https://render.com) → New → **Web Service** → conecta el repo `ayuda-en-emergencias`.  
2. Ajustes:

| Campo | Valor |
|-------|--------|
| Runtime | Node |
| Root Directory | *(vacío, raíz del monorepo)* |
| Build Command | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @aee/shared-types build && pnpm --filter @aee/backend build` |
| Start Command | `pnpm --filter @aee/backend start:prod` |

3. Environment:

| Key | Valor |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | la URI **Direct** de Supabase (añade `?sslmode=require` al final si no está) |
| `API_PORT` | `10000` (Render suele inyectar `PORT`; si falla, ver nota abajo) |
| `API_CORS_ORIGIN` | `https://TU-FRONT.netlify.app` *(la pones cuando exista el front)* |
| `OPS_TOKEN` | un string largo aleatorio |
| `MODERATION_TOKEN` | otro string largo aleatorio |
| `TYPEORM_SYNCHRONIZE` | `true` **solo el primer deploy** (crea tablas) |
| `TYPEORM_MIGRATIONS_RUN` | `true` |

Si Render no arranca porque el puerto: Nest usa `API_PORT` o 3000. Añade en el servicio `API_PORT` = el valor de `PORT` de Render, o pon `API_PORT` vacío y usa el fix de `PORT` (ver código: `process.env.PORT`).

4. Deploy. Prueba: `https://TU-API.onrender.com/api/v1/health/ready`  
   Debe decir `"status":"ready"`.

5. Cuando las tablas existan, cambia `TYPEORM_SYNCHRONIZE` a `false` y redeploy.

---

## 3. Front (después de tener la URL del API)

1. En `apps/frontend/src/environments/environment.production.ts` pon:

```ts
apiBase: 'https://TU-API.onrender.com/api/v1',
```

2. Commit y deploy del front, **o** build local:

```powershell
pnpm --filter @aee/shared-types build
pnpm --filter @aee/frontend build
```

3. [netlify.com](https://netlify.com) → Add site → el repo, o arrastra `apps/frontend/dist/frontend/browser` (Angular 19 puede emitir en `browser/`).  
   Build en Netlify (monorepo):

| Campo | Valor |
|-------|--------|
| Base directory | *(raíz)* |
| Build command | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @aee/shared-types build && pnpm --filter @aee/frontend build` |
| Publish directory | `apps/frontend/dist/frontend/browser` |

Si esa carpeta no existe, usa `apps/frontend/dist/frontend`.

4. Vuelve a Render y pon `API_CORS_ORIGIN` = `https://tu-sitio.netlify.app`.

5. Abre el front. Si ves la home y `/origenes` carga fuentes, listo.

---

## Si algo falla

| Error | Qué hacer |
|-------|-----------|
| `password authentication failed` | URI Direct mala; reset password en Supabase → Project Settings → Database |
| SSL / `no pg_hba.conf` | Añade `?sslmode=require` a `DATABASE_URL` |
| `relation does not exist` | Primer boot con `TYPEORM_SYNCHRONIZE=true` |
| Front sin datos / CORS | `API_CORS_ORIGIN` debe ser el origen exacto del front (https, sin slash final) |
| Next.js packages | Ignóralos; no los instales |

Orden: **PostGIS → API con DATABASE_URL → URL del API en el front → CORS**.
