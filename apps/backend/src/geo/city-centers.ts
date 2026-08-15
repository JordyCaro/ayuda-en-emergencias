/** Centros aproximados (WGS84) para avisos por ciudad sin pin exacto. */
export const CITY_CENTERS: Record<string, { lat: number; lng: number; name: string }> = {
  '05001': { lat: 6.2476, lng: -75.5658, name: 'Medellín' },
  '08001': { lat: 10.9685, lng: -74.7813, name: 'Barranquilla' },
  '11001': { lat: 4.711, lng: -74.0721, name: 'Bogotá' },
  '13001': { lat: 10.391, lng: -75.4794, name: 'Cartagena' },
  '15001': { lat: 5.5353, lng: -73.3678, name: 'Tunja' },
  '17001': { lat: 5.0689, lng: -75.5174, name: 'Manizales' },
  '19001': { lat: 2.4448, lng: -76.6147, name: 'Popayán' },
  '20001': { lat: 10.4631, lng: -73.2532, name: 'Valledupar' },
  '23001': { lat: 8.7479, lng: -75.8814, name: 'Montería' },
  '27001': { lat: 5.6947, lng: -76.6611, name: 'Quibdó' },
  '41001': { lat: 2.9273, lng: -75.2819, name: 'Neiva' },
  '47001': { lat: 11.2404, lng: -74.211, name: 'Santa Marta' },
  '50001': { lat: 4.142, lng: -73.6266, name: 'Villavicencio' },
  '52001': { lat: 1.2136, lng: -77.2811, name: 'Pasto' },
  '54001': { lat: 7.8891, lng: -72.4967, name: 'Cúcuta' },
  '63001': { lat: 4.5339, lng: -75.6811, name: 'Armenia' },
  '66001': { lat: 4.8143, lng: -75.6946, name: 'Pereira' },
  '68001': { lat: 7.1193, lng: -73.1227, name: 'Bucaramanga' },
  '73001': { lat: 4.4389, lng: -75.2322, name: 'Ibagué' },
  '76001': { lat: 3.4516, lng: -76.532, name: 'Cali' },
};

export function cityCenter(code: string): { lat: number; lng: number; name: string } | null {
  return CITY_CENTERS[code] ?? null;
}
