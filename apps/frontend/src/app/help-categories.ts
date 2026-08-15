import type { NeedCategory, NeedTag, PlaceType } from '@aee/shared-types';

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
  { id: 'BLOOD', title: 'Sangre', hint: 'Campañas / bancos (enlace a ellos)' },
  { id: 'OTHER', title: 'Otra ayuda', hint: 'Algo distinto de emergencia' },
];

/** Categorías del foro (NeedCategory API). */
export type ForumCat = {
  id: NeedCategory;
  title: string;
  needHint: string;
  offerHint: string;
};

export const FORUM_CATEGORIES: ForumCat[] = [
  {
    id: 'WATER',
    title: 'Agua',
    needHint: 'Necesito agua o filtros',
    offerHint: 'Tengo agua / puedo llevar',
  },
  {
    id: 'FOOD',
    title: 'Mercado / comida',
    needHint: 'Necesito alimentos',
    offerHint: 'Tengo mercado y no sé dónde llevarlo',
  },
  {
    id: 'CLOTHING',
    title: 'Ropa / cobijas',
    needHint: 'Necesito ropa o abrigo',
    offerHint: 'Tengo ropa y no sé dónde dejarla',
  },
  {
    id: 'TRANSPORT',
    title: 'Vehículo / transporte',
    needHint: 'Necesito un vehículo para mover ayudas',
    offerHint: 'Tengo vehículo libre para llevar ayuda',
  },
  {
    id: 'VOLUNTEER',
    title: 'Voluntariado',
    needHint: 'Necesito manos (alistar, repartir, escombros…)',
    offerHint: 'Quiero ayudar y no sé dónde',
  },
  {
    id: 'SHELTER',
    title: 'Techo / albergue',
    needHint: 'Necesito un lugar seguro',
    offerHint: 'Puedo ofrecer techo temporal (con cuidado)',
  },
  {
    id: 'MEDICAL',
    title: 'Salud / medicinas',
    needHint: 'Necesito orientación o insumos',
    offerHint: 'Puedo orientar o aportar insumos (sin diagnóstico)',
  },
  {
    id: 'BLOOD',
    title: 'Sangre',
    needHint: 'Se necesita donación de sangre',
    offerHint: 'Puedo donar sangre / informar campañas',
  },
  {
    id: 'OTHER',
    title: 'Otra ayuda',
    needHint: 'Otra necesidad de emergencia',
    offerHint: 'Otro aporte que puedo hacer',
  },
];

export const PLACE_KIND_FILTERS: Array<{ id: PlaceType | ''; label: string }> = [
  { id: '', label: 'Todos' },
  { id: 'DONATION_POINT', label: 'Llevar ayuda / acopio' },
  { id: 'HELP_CENTER', label: 'Centro de ayuda' },
  { id: 'SHELTER', label: 'Albergue' },
  { id: 'VOLUNTEER_POINT', label: 'Voluntariado' },
  { id: 'MEDICAL', label: 'Hospital / salud' },
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

export function forumCatLabel(id: string): string {
  return FORUM_CATEGORIES.find((c) => c.id === id)?.title ?? id;
}
