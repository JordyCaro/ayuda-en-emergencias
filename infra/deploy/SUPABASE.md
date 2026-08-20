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
En **Render** (y cualquier host solo IPv4) **no uses Direct**. Direct es IPv6 y falla con `ENETUNREACH`.  
Usa **Session pooler** (Connect → Session, puerto **5432**, usuario `postgres.xxxxx`):

```text
postgresql://postgres.TU_REF:TU_PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```

**No** uses Transaction (puerto 6543): TypeORM no va bien con ese modo.

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

### Cómo ves y pruebas Supabase (sin deploy)

Supabase **no es la web de la app**. El **home** (gráficas, 125 requests, Advisor rojo) es un monitor. Las filas están en **Table Editor**.

Barra izquierda, **segundo icono** (rejilla / Table Editor). Arriba elige schema **public**. Ahí salen `places`, `needs`, `pet_reports`, `events`, `sources`, `raw_records`, `moderation_audits`.

Si el Advisor dice “RLS Disabled” en `places` / `needs`, esas tablas **ya existen**. No abras Auth, Storage ni Realtime: esta app no los usa. RLS es para el REST de Supabase; nosotros entramos por Nest + URI Direct. Más adelante se puede apagar la Data API en Project Settings.

1. En Table Editor, abre `places` (el seeder suele dejar ~23 filas).  
   Si algunas tablas están vacías, es normal.
2. **SQL Editor** → `select count(*) from places;` debe devolver un número (no error de “relation does not exist”).
3. En tu PC, con `DATABASE_URL` apuntando a esa URI en `.env` (no en git):

```powershell
pnpm --filter @aee/shared-types build
pnpm --filter @aee/backend start:dev
```

Abre http://localhost:3000/api/v1/health/ready — debe decir `"status":"ready"`.  
Swagger: http://localhost:3000/api/docs.

Eso prueba: **tu laptop → API Nest → Postgres de Supabase**. Todavía no hay internet público; eso es Render + Netlify.

---

## 2. API en Render (gratis / fácil)

**Qué es Render:** un hosting para el **backend**. Tú no lo instalas en el repo. Creas una cuenta, conectas GitHub, y Render **construye y mantiene encendido** el API Nest 24/7 en internet (`https://algo.onrender.com`). Sin Render (o Railway/Fly), la API solo vive en tu PC (`localhost:3000`) y nadie más puede usarla.

| Dónde | Qué corre |
|-------|-----------|
| **Tu PC** | `pnpm dev:backend` → solo tú, apagas el laptop y muere |
| **Render** | el mismo Nest, pero con URL pública y `DATABASE_URL` de Supabase |

1. [render.com](https://render.com) → New → **Web Service** → conecta el repo `ayuda-en-emergencias`.  
2. Ajustes:

| Campo | Valor |
|-------|--------|
| Runtime | Node |
| Root Directory | *(vacío, raíz del monorepo)* |
| Build Command | `corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm --filter @aee/shared-types build && pnpm --filter @aee/backend build` |
| Start Command | `pnpm --filter @aee/backend start:prod` |

3. Environment:

| Key | Valor |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | la URI **Direct** de Supabase (añade `?sslmode=require` al final si no está) |
| `API_PORT` | `10000` (Render suele inyectar `PORT`; si falla, ver nota abajo) |
| `API_CORS_ORIGIN` | `https://ayudaenemergencias.com,https://www.ayudaenemergencias.com` |
| `OPS_TOKEN` | un string largo aleatorio |
| `MODERATION_TOKEN` | otro string largo aleatorio |
| `TYPEORM_SYNCHRONIZE` | `true` **solo el primer deploy** (crea tablas) |
| `TYPEORM_MIGRATIONS_RUN` | `true` |

Si Render no arranca porque el puerto: Nest usa `API_PORT` o 3000. Añade en el servicio `API_PORT` = el valor de `PORT` de Render, o pon `API_PORT` vacío y usa el fix de `PORT` (ver código: `process.env.PORT`).

4. Deploy. Prueba: `https://TU-API.onrender.com/api/v1/health/ready`  
   Debe decir `"status":"ready"`.

5. Cuando las tablas existan, cambia `TYPEORM_SYNCHRONIZE` a `false` y redeploy.

---

## 3. Front en Cloudflare Pages

Cloudflare (2026) mete el front en **Create a Worker** (GitHub). No busques otra pantalla. En el repo hay `wrangler.toml` (estáticos Angular, SPA). En **Create and deploy**:

| Campo | Valor |
|-------|--------|
| Project name | `ayuda-en-emergencias` |
| Build command | `corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm --filter @aee/shared-types build && pnpm --filter @aee/frontend build` |
| Deploy command | `npx wrangler deploy` |

Advanced: `NODE_VERSION` = `22`. URL típica: `https://ayuda-en-emergencias.jhordan-caro.workers.dev`.

En Render, `API_CORS_ORIGIN` = origen del front (https, sin slash final). Con dominio propio:

```text
https://ayudaenemergencias.com,https://www.ayudaenemergencias.com
```

(Varios orígenes separados por coma.)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → GitHub → repo `ayuda-en-emergencias`.

Dominio propio: en el Worker → **Settings** → **Domains & Routes** → **Add custom domain** → `ayudaenemergencias.com` y `www.ayudaenemergencias.com`. También queda declarado en `wrangler.toml` (se aplica en cada `wrangler deploy`). HTTPS lo pone Cloudflare. Si compraste el dominio en Cloudflare, no hace falta tocar DNS a mano.

---

## Si algo falla

| Error | Qué hacer |
|-------|-----------|
| `password authentication failed` | URI mala; usuario del pooler es `postgres.TU_REF`, no solo `postgres`. Reset password en Supabase si hace falta |
| SSL / `self-signed certificate` | El API ya ignora `sslmode=require` de la URI y usa SSL sin verificar CA. No hace falta pelear con certificados. |
| `ENETUNREACH` / IPv6 | Render no habla IPv6. Cambia `DATABASE_URL` al **Session pooler**, no Direct |
| SSL / `no pg_hba.conf` | Session pooler `*.pooler.supabase.com:5432`. No uses Direct ni Transaction 6543 |
| `relation does not exist` | Primer boot con `TYPEORM_SYNCHRONIZE=true` |
| Front sin datos / CORS | `API_CORS_ORIGIN` debe ser el origen exacto del front (https, sin slash final) |
| Next.js packages | Ignóralos; no los instales |

Orden: **PostGIS → API con DATABASE_URL → URL del API en el front → CORS**.
