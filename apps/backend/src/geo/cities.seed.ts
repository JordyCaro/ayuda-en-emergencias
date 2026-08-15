/** Subset DIVIPOLA (DANE) — capitales y ciudades frecuentes. Código = 5 dígitos. */

export interface CityRecord {
  code: string;
  name: string;
  department: string;
  departmentCode: string;
}

export const CITIES: CityRecord[] = [
  { code: '05001', name: 'Medellín', department: 'Antioquia', departmentCode: '05' },
  { code: '05088', name: 'Bello', department: 'Antioquia', departmentCode: '05' },
  { code: '05360', name: 'Itagüí', department: 'Antioquia', departmentCode: '05' },
  { code: '05380', name: 'La Estrella', department: 'Antioquia', departmentCode: '05' },
  { code: '05631', name: 'Sabaneta', department: 'Antioquia', departmentCode: '05' },
  { code: '08001', name: 'Barranquilla', department: 'Atlántico', departmentCode: '08' },
  { code: '08758', name: 'Soledad', department: 'Atlántico', departmentCode: '08' },
  { code: '11001', name: 'Bogotá, D.C.', department: 'Bogotá, D.C.', departmentCode: '11' },
  { code: '13001', name: 'Cartagena de Indias', department: 'Bolívar', departmentCode: '13' },
  { code: '15001', name: 'Tunja', department: 'Boyacá', departmentCode: '15' },
  { code: '17001', name: 'Manizales', department: 'Caldas', departmentCode: '17' },
  { code: '18001', name: 'Florencia', department: 'Caquetá', departmentCode: '18' },
  { code: '19001', name: 'Popayán', department: 'Cauca', departmentCode: '19' },
  { code: '20001', name: 'Valledupar', department: 'Cesar', departmentCode: '20' },
  { code: '23001', name: 'Montería', department: 'Córdoba', departmentCode: '23' },
  { code: '25001', name: 'Agua de Dios', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25175', name: 'Chía', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25214', name: 'Cota', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25290', name: 'Fusagasugá', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25307', name: 'Girardot', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25473', name: 'Mosquera', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25754', name: 'Soacha', department: 'Cundinamarca', departmentCode: '25' },
  { code: '25799', name: 'Zipaquirá', department: 'Cundinamarca', departmentCode: '25' },
  { code: '27001', name: 'Quibdó', department: 'Chocó', departmentCode: '27' },
  { code: '41001', name: 'Neiva', department: 'Huila', departmentCode: '41' },
  { code: '44001', name: 'Riohacha', department: 'La Guajira', departmentCode: '44' },
  { code: '47001', name: 'Santa Marta', department: 'Magdalena', departmentCode: '47' },
  { code: '50001', name: 'Villavicencio', department: 'Meta', departmentCode: '50' },
  { code: '52001', name: 'Pasto', department: 'Nariño', departmentCode: '52' },
  { code: '54001', name: 'Cúcuta', department: 'Norte de Santander', departmentCode: '54' },
  { code: '63001', name: 'Armenia', department: 'Quindío', departmentCode: '63' },
  { code: '66001', name: 'Pereira', department: 'Risaralda', departmentCode: '66' },
  { code: '66088', name: 'Dosquebradas', department: 'Risaralda', departmentCode: '66' },
  { code: '68001', name: 'Bucaramanga', department: 'Santander', departmentCode: '68' },
  { code: '68276', name: 'Floridablanca', department: 'Santander', departmentCode: '68' },
  { code: '68307', name: 'Girón', department: 'Santander', departmentCode: '68' },
  { code: '68547', name: 'Piedecuesta', department: 'Santander', departmentCode: '68' },
  { code: '70001', name: 'Sincelejo', department: 'Sucre', departmentCode: '70' },
  { code: '73001', name: 'Ibagué', department: 'Tolima', departmentCode: '73' },
  { code: '76001', name: 'Cali', department: 'Valle del Cauca', departmentCode: '76' },
  { code: '76109', name: 'Buenaventura', department: 'Valle del Cauca', departmentCode: '76' },
  { code: '76111', name: 'Buga', department: 'Valle del Cauca', departmentCode: '76' },
  { code: '76520', name: 'Palmira', department: 'Valle del Cauca', departmentCode: '76' },
  { code: '76834', name: 'Tuluá', department: 'Valle del Cauca', departmentCode: '76' },
  { code: '81001', name: 'Arauca', department: 'Arauca', departmentCode: '81' },
  { code: '85001', name: 'Yopal', department: 'Casanare', departmentCode: '85' },
  { code: '86001', name: 'Mocoa', department: 'Putumayo', departmentCode: '86' },
  { code: '88001', name: 'San Andrés', department: 'Archipiélago de San Andrés', departmentCode: '88' },
  { code: '91001', name: 'Leticia', department: 'Amazonas', departmentCode: '91' },
  { code: '94001', name: 'Inírida', department: 'Guainía', departmentCode: '94' },
  { code: '95001', name: 'San José del Guaviare', department: 'Guaviare', departmentCode: '95' },
  { code: '97001', name: 'Mitú', department: 'Vaupés', departmentCode: '97' },
  { code: '99001', name: 'Puerto Carreño', department: 'Vichada', departmentCode: '99' },
];

export function findCityByCode(code: string): CityRecord | undefined {
  return CITIES.find((c) => c.code === code);
}

export function searchCities(q?: string, limit = 40): CityRecord[] {
  const query = (q ?? '').trim().toLowerCase();
  if (!query) return CITIES.slice(0, limit);
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.department.toLowerCase().includes(query) ||
      c.code.includes(query),
  ).slice(0, limit);
}
