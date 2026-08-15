export const environment = {
  production: true,
  /**
   * Por defecto mismo origen `/api/v1` (nginx/Caddy hace proxy).
   * Build con API externo:
   *   set AEE_API_BASE=https://tu-api.onrender.com/api/v1
   * (ver scripts/set-api-base o editar este archivo antes del build)
   */
  apiBase: '/api/v1',
};
