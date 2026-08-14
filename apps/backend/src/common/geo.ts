/** Validación geo compartida (Fase 2). */

export interface BBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

/** Límites amplios para Colombia + margen (incluye mar territorial aproximado). */
const CO_BOUNDS = {
  west: -82,
  south: -5,
  east: -66,
  north: 16,
};

export function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    isFiniteNumber(lat) &&
    isFiniteNumber(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function parseOptionalNumber(raw: string | undefined): number | undefined {
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number.NaN;
}

/**
 * Valida bbox. Si `requireColombia` es true, exige intersección razonable con CO.
 * Lanza Error con mensaje usable en BadRequestException.
 */
export function assertValidBBox(
  bbox: BBox,
  opts?: { requireColombia?: boolean; maxSpanDeg?: number },
): BBox {
  const { west, south, east, north } = bbox;
  if (
    !isFiniteNumber(west) ||
    !isFiniteNumber(south) ||
    !isFiniteNumber(east) ||
    !isFiniteNumber(north)
  ) {
    throw new Error('bbox inválido: west/south/east/north deben ser números finitos');
  }
  if (west >= east || south >= north) {
    throw new Error('bbox inválido: west < east y south < north');
  }
  if (!isValidLatLng(south, west) || !isValidLatLng(north, east)) {
    throw new Error('bbox inválido: coordenadas fuera de rango lat/lng');
  }
  const maxSpan = opts?.maxSpanDeg ?? 8;
  if (east - west > maxSpan || north - south > maxSpan) {
    throw new Error(
      `bbox demasiado grande (máx ${maxSpan}° por lado). Acerca el mapa e intenta de nuevo.`,
    );
  }
  if (opts?.requireColombia !== false) {
    const intersects =
      east >= CO_BOUNDS.west &&
      west <= CO_BOUNDS.east &&
      north >= CO_BOUNDS.south &&
      south <= CO_BOUNDS.north;
    if (!intersects) {
      throw new Error('bbox fuera del área de cobertura (Colombia)');
    }
  }
  return bbox;
}

export function clampLimit(raw: number | undefined, fallback = 200, max = 800): number {
  if (raw == null || !Number.isFinite(raw) || raw <= 0) return fallback;
  return Math.min(Math.floor(raw), max);
}

export function clampOffset(raw: number | undefined): number {
  if (raw == null || !Number.isFinite(raw) || raw < 0) return 0;
  return Math.floor(raw);
}
