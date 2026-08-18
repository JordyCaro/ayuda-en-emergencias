import { CITIES, findCityByCode, type CityRecord } from './cities.seed';
import { CITY_CENTERS } from './city-centers';
import { NATIONAL_SYNC_CITIES } from './city-bboxes';

export type ResolvedPlace = {
  cityCode: string | null;
  municipality: string | null;
};

export type OsmAddress = {
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
};

const NOMINATIM_UA =
  'AyudaEnEmergencias/1.0 (https://github.com/JordyCaro/ayuda-en-emergencias)';

export function foldName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(d c|dc)\b/g, '')
    .trim();
}

const CITY_ALIASES: Record<string, string> = {
  bogota: '11001',
  cartagena: '13001',
  'san andres': '88001',
};

export function matchCityByName(name: string): CityRecord | undefined {
  const f = foldName(name);
  if (!f) return undefined;
  const alias = CITY_ALIASES[f];
  if (alias) return findCityByCode(alias);
  return CITIES.find((c) => foldName(c.name) === f);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Ciudad DIVIPOLA más cercana; ignora si está a más de 80 km. */
export function nearestCity(lat: number, lng: number): CityRecord | undefined {
  let best: { city: CityRecord; d: number } | undefined;
  for (const [code, c] of Object.entries(CITY_CENTERS)) {
    const city = findCityByCode(code);
    if (!city) continue;
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (!best || d < best.d) best = { city, d };
  }
  if (!best || best.d > 80) return undefined;
  return best.city;
}

export function formatOsmPlace(addr: OsmAddress): {
  label: string | null;
  cityCode: string | null;
} {
  const road = addr.road || addr.pedestrian;
  const barrio = addr.neighbourhood || addr.suburb || addr.quarter || addr.city_district;
  const cityName = addr.city || addr.town || addr.village || addr.municipality;
  const matched =
    (cityName ? matchCityByName(cityName) : undefined) ||
    (addr.municipality ? matchCityByName(addr.municipality) : undefined);

  const parts: string[] = [];
  if (road) parts.push(road);
  if (barrio && foldName(barrio) !== foldName(road || '')) parts.push(barrio);
  const cityLabel = matched?.name || cityName;
  if (cityLabel && !parts.some((p) => foldName(p) === foldName(cityLabel))) {
    parts.push(cityLabel);
  }
  const label = parts.join(', ').slice(0, 128) || null;
  return { label, cityCode: matched?.code ?? null };
}

async function reverseNominatim(lat: number, lng: number): Promise<OsmAddress | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '18');
  url.searchParams.set('accept-language', 'es');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2800);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': NOMINATIM_UA,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { address?: OsmAddress };
    return json.address ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Estima ciudad / barrio a partir de un punto GPS.
 * Nominatim (1 req, fail-open) + respaldo DIVIPOLA por cercanía.
 */
export async function resolvePlaceFromPoint(lat: number, lng: number): Promise<ResolvedPlace> {
  const osm = await reverseNominatim(lat, lng);
  if (osm) {
    const formatted = formatOsmPlace(osm);
    if (formatted.label) {
      return {
        cityCode: formatted.cityCode ?? nearestCity(lat, lng)?.code ?? null,
        municipality: formatted.label,
      };
    }
  }

  const near = nearestCity(lat, lng);
  if (near) {
    return { cityCode: near.code, municipality: near.name };
  }

  const box = NATIONAL_SYNC_CITIES.find(
    (c) => lng >= c.bbox.west && lng <= c.bbox.east && lat >= c.bbox.south && lat <= c.bbox.north,
  );
  if (box) {
    const city = findCityByCode(box.code);
    return { cityCode: box.code, municipality: city?.name ?? box.name };
  }

  return { cityCode: null, municipality: null };
}
