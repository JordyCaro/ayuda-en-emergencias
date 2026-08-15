import type { NeedCategory } from '@aee/shared-types';

export type CatMeta = {
  title: string;
  hint: string;
  short: string;
};

export const NEED_CATS: Record<NeedCategory, CatMeta> = {
  HELP: { title: 'Ayuda general', hint: 'No estoy seguro qué pedir', short: 'Ayuda' },
  WATER: { title: 'Agua', hint: 'Para beber o limpiar', short: 'Agua' },
  FOOD: { title: 'Comida', hint: 'Alimentos para hoy', short: 'Comida' },
  SHELTER: { title: 'Techo', hint: 'Un lugar seguro para estar', short: 'Techo' },
  MEDICAL: { title: 'Salud', hint: 'Atención o medicinas', short: 'Salud' },
  TRANSPORT: { title: 'Transporte', hint: 'Moverse o salir', short: 'Viaje' },
  COMMUNICATION: { title: 'Comunicación', hint: 'Avisar a alguien', short: 'Avisar' },
  VOLUNTEER: { title: 'Manos amigas', hint: 'Personas que ayuden', short: 'Manos' },
  OTHER: { title: 'Otra necesidad', hint: 'Algo distinto', short: 'Otra' },
};

export const NEED_LABELS = Object.fromEntries(
  Object.entries(NEED_CATS).map(([k, v]) => [k, { title: v.title, hint: v.hint }]),
) as Record<NeedCategory, { title: string; hint: string }>;

export function statusLabel(status: string): string {
  switch (status) {
    case 'INTEGRATED':
      return 'Activa';
    case 'TESTING':
      return 'En prueba';
    case 'BLOCKED':
      return 'No disponible aún';
    case 'LEGAL_REVIEW':
      return 'En revisión';
    case 'DISCOVERY':
      return 'Explorando';
    case 'DEPRECATED':
      return 'Retirada';
    default:
      return status;
  }
}

export function eventPlainTitle(type: string, title?: string | null): string {
  const raw = title?.trim() ?? '';
  const looksLikeFieldName =
    !raw ||
    /^(nivelalerta|alerta|null|undefined)$/i.test(raw) ||
    /^layer_\d+$/i.test(raw) ||
    (/^[A-Z][a-zA-Z0-9]+$/.test(raw) && !raw.includes(' ') && raw.length < 32);

  if (!looksLikeFieldName) return raw;

  switch (type) {
    case 'HYDRO_ALERT':
      return 'Alerta de ríos o niveles (IDEAM)';
    case 'EARTHQUAKE':
      return 'Temblor o sismo';
    case 'FLOOD':
      return 'Inundación';
    case 'FIRE':
      return 'Incendio';
    case 'LANDSLIDE':
      return 'Deslizamiento';
    default:
      return 'Aviso oficial';
  }
}

export function eventPlainDetail(summary?: string | null): string {
  const s = summary?.trim() ?? '';
  if (!s) return 'Fuente oficial';
  return s
    .replace(/\s*\(layer_\d+\)/gi, '')
    .replace(/Registro hidrológico IDEAM.*/i, 'Dato hidrológico IDEAM')
    .replace(/^Nivel\/alerta:\s*/i, 'Nivel: ')
    .trim();
}

export function placeTypeLabel(type: string): string {
  switch (type) {
    case 'DONATION_POINT':
      return 'Acopio / donaciones';
    case 'HELP_CENTER':
      return 'Centro de ayuda';
    case 'SHELTER':
      return 'Albergue';
    case 'VOLUNTEER_POINT':
      return 'Voluntariado';
    case 'MEETING_POINT':
      return 'Punto de encuentro';
    case 'MEDICAL':
      return 'Salud';
    default:
      return 'Punto de ayuda';
  }
}

