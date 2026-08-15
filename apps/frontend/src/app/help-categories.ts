import type { NeedTag, PlaceType } from '@aee/shared-types';

export type HelpCategory = {
  id: NeedTag;
  title: string;
  hint: string;
};

/** Categorías de emergencia (no marketplace tipo plomería/mascotas). */
export const HELP_CATEGORIES: HelpCategory[] = [
  { id: 'FOOD', title: 'Alimentos', hint: 'Comida, mercados, kits' },
  { id: 'WATER', title: 'Agua', hint: 'Agua potable o para limpieza' },
  { id: 'MEDICINE', title: 'Medicinas', hint: 'Fármacos e insumos' },
  { id: 'CLOTHING', title: 'Ropa / cobijas', hint: 'Abrigo y vestuario' },
  { id: 'SHELTER', title: 'Techo / albergue', hint: 'Dónde dormir o refugiarse' },
  { id: 'VOLUNTEER', title: 'Voluntariado', hint: 'Manos, turnos, logística' },
  { id: 'BLOOD', title: 'Sangre / donación', hint: 'Campañas y bancos (enlace)' },
  { id: 'OTHER', title: 'Otra ayuda', hint: 'Algo distinto de emergencia' },
];

export const PLACE_KIND_FILTERS: Array<{ id: PlaceType | ''; label: string }> = [
  { id: '', label: 'Todos' },
  { id: 'DONATION_POINT', label: 'Acopio' },
  { id: 'HELP_CENTER', label: 'Centro de ayuda' },
  { id: 'SHELTER', label: 'Albergue' },
  { id: 'VOLUNTEER_POINT', label: 'Voluntariado' },
  { id: 'MEETING_POINT', label: 'Punto de encuentro' },
];

/** Ciudades frecuentes para chips (DIVIPOLA). */
export const CITY_CHIPS: Array<{ code: string; label: string }> = [
  { code: '', label: 'Todo el país' },
  { code: '27001', label: 'Quibdó' },
  { code: '66001', label: 'Pereira' },
  { code: '76001', label: 'Cali' },
  { code: '05001', label: 'Medellín' },
  { code: '11001', label: 'Bogotá' },
  { code: '08001', label: 'Barranquilla' },
  { code: '13001', label: 'Cartagena' },
  { code: '68001', label: 'Bucaramanga' },
  { code: '17001', label: 'Manizales' },
  { code: '73001', label: 'Ibagué' },
  { code: '50001', label: 'Villavicencio' },
];

export function needTagLabel(tag: string): string {
  return HELP_CATEGORIES.find((c) => c.id === tag)?.title ?? tag;
}
