/** SSL para Postgres hosted (Supabase, Neon, Render). Local Docker no lo usa. */
export function postgresSslFromUrl(url: string): { rejectUnauthorized: boolean } | undefined {
  const u = url.toLowerCase();
  const needsSsl =
    u.includes('sslmode=require') ||
    u.includes('supabase.co') ||
    u.includes('neon.tech') ||
    u.includes('render.com') ||
    u.includes('pooler.supabase');
  if (!needsSsl) return undefined;
  return { rejectUnauthorized: false };
}
