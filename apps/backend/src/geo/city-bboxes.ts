import type { BBox } from '../common/geo';

/** Capitales / ciudades ancla para sync nacional por bbox (no solo Bogotá). */
export interface CityBBox {
  code: string;
  name: string;
  bbox: BBox;
}

/**
 * Ventanas ~0.35–0.55° alrededor del centro urbano.
 * Suficiente para Overpass/SISPRO local sin timeout nacional.
 */
export const NATIONAL_SYNC_CITIES: CityBBox[] = [
  { code: '11001', name: 'Bogotá', bbox: { west: -74.25, south: 4.45, east: -73.95, north: 4.85 } },
  { code: '05001', name: 'Medellín', bbox: { west: -75.7, south: 6.1, east: -75.45, north: 6.35 } },
  { code: '76001', name: 'Cali', bbox: { west: -76.6, south: 3.3, east: -76.45, north: 3.55 } },
  { code: '08001', name: 'Barranquilla', bbox: { west: -74.9, south: 10.9, east: -74.75, north: 11.05 } },
  { code: '13001', name: 'Cartagena', bbox: { west: -75.6, south: 10.35, east: -75.45, north: 10.5 } },
  { code: '68001', name: 'Bucaramanga', bbox: { west: -73.15, south: 7.05, east: -73.05, north: 7.2 } },
  { code: '66001', name: 'Pereira', bbox: { west: -75.8, south: 4.75, east: -75.65, north: 4.9 } },
  { code: '17001', name: 'Manizales', bbox: { west: -75.55, south: 5.02, east: -75.45, north: 5.12 } },
  { code: '73001', name: 'Ibagué', bbox: { west: -75.3, south: 4.38, east: -75.15, north: 4.5 } },
  { code: '50001', name: 'Villavicencio', bbox: { west: -73.7, south: 4.1, east: -73.55, north: 4.2 } },
  { code: '54001', name: 'Cúcuta', bbox: { west: -72.55, south: 7.85, east: -72.45, north: 7.95 } },
  { code: '52001', name: 'Pasto', bbox: { west: -77.35, south: 1.15, east: -77.2, north: 1.3 } },
  { code: '47001', name: 'Santa Marta', bbox: { west: -74.25, south: 11.2, east: -74.15, north: 11.3 } },
  { code: '41001', name: 'Neiva', bbox: { west: -75.35, south: 2.88, east: -75.25, north: 2.98 } },
  { code: '63001', name: 'Armenia', bbox: { west: -75.75, south: 4.5, east: -75.65, north: 4.58 } },
  { code: '27001', name: 'Quibdó', bbox: { west: -76.7, south: 5.65, east: -76.6, north: 5.75 } },
  { code: '19001', name: 'Popayán', bbox: { west: -76.65, south: 2.4, east: -76.55, north: 2.5 } },
  { code: '23001', name: 'Montería', bbox: { west: -75.95, south: 8.7, east: -75.8, north: 8.85 } },
  { code: '20001', name: 'Valledupar', bbox: { west: -73.3, south: 10.42, east: -73.2, north: 10.52 } },
  { code: '15001', name: 'Tunja', bbox: { west: -73.4, south: 5.5, east: -73.3, north: 5.6 } },
  { code: '70001', name: 'Sincelejo', bbox: { west: -75.45, south: 9.25, east: -75.35, north: 9.35 } },
  { code: '44001', name: 'Riohacha', bbox: { west: -73.0, south: 11.5, east: -72.88, north: 11.58 } },
  { code: '18001', name: 'Florencia', bbox: { west: -75.65, south: 1.58, east: -75.55, north: 1.68 } },
];
