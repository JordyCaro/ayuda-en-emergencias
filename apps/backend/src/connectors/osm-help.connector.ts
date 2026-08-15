import { Injectable, Logger } from '@nestjs/common';
import type { CityBBox } from '../geo/city-bboxes';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

export interface OsmHelpPlaceRow {
  sourceRecordId: string;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  municipality: string | null;
  cityCode: string | null;
  type: 'HELP_CENTER' | 'DONATION_POINT' | 'SHELTER' | 'VOLUNTEER_POINT' | 'MEDICAL' | 'OTHER';
  externalUrl: string | null;
  needTags: string[];
  retrievedAt: Date;
  properties: Record<string, unknown>;
}

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

@Injectable()
export class OsmHelpConnector {
  readonly sourceId = 'osm';
  private readonly logger = new Logger(OsmHelpConnector.name);

  async fetchCity(city: CityBBox): Promise<{ rows: OsmHelpPlaceRow[]; fetchedAt: Date }> {
    const fetchedAt = new Date();
    const { west, south, east, north } = city.bbox;
    const bb = `${south},${west},${north},${east}`;
    // Nodos + ways (out center). Sin bbox país-entero.
    const query =
      `[out:json][timeout:45];` +
      `(` +
      `nwr["amenity"="social_facility"](${bb});` +
      `nwr["amenity"="shelter"](${bb});` +
      `nwr["amenity"="community_centre"](${bb});` +
      `nwr["amenity"="food_bank"](${bb});` +
      `nwr["office"="ngo"](${bb});` +
      `nwr["amenity"="blood_bank"](${bb});` +
      `nwr["healthcare"="blood_donation"](${bb});` +
      `nwr["amenity"="fire_station"](${bb});` +
      `node["amenity"="hospital"](${bb});` +
      `);out center 80;`;

    const elements = await this.queryOverpass(query);
    const rows = elements
      .map((el) => this.toRow(el, city, fetchedAt))
      .filter((r): r is OsmHelpPlaceRow => r != null);

    this.logger.log(`OSM help ${city.name}: ${rows.length} places`);
    return { rows, fetchedAt };
  }

  private async queryOverpass(query: string): Promise<OverpassElement[]> {
    let lastError: unknown;
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const url = `${endpoint}?data=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'AyudaEnEmergencias/0.4 (national help densify; contact via repo)',
          },
          signal: AbortSignal.timeout(55_000),
        });
        if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
        const json = (await res.json()) as OverpassResponse;
        return Array.isArray(json.elements) ? json.elements : [];
      } catch (err) {
        lastError = err;
        this.logger.warn(
          `Overpass failed @ ${endpoint}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  private toRow(
    el: OverpassElement,
    city: CityBBox,
    fetchedAt: Date,
  ): OsmHelpPlaceRow | null {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    const tags = el.tags ?? {};
    const name = (tags.name || tags['name:es'] || '').trim();
    if (!name) return null;

    const amenity = tags.amenity || tags.office || tags.healthcare || '';
    const type = this.mapType(amenity, tags);
    const needTags = this.guessTags(tags);
    const website = tags.website || tags['contact:website'] || '';
    const street = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');

    return {
      sourceRecordId: `osm:${el.type}:${el.id}`,
      title: name.slice(0, 512),
      description: this.describe(amenity, tags),
      lat,
      lng,
      address: street || null,
      municipality: city.name,
      cityCode: city.code,
      type,
      externalUrl: website.startsWith('http') ? website : null,
      needTags,
      retrievedAt: fetchedAt,
      properties: {
        amenity,
        osmId: el.id,
        osmType: el.type,
        socialFacility: tags.social_facility ?? null,
      },
    };
  }

  private mapType(
    amenity: string,
    tags: Record<string, string>,
  ): OsmHelpPlaceRow['type'] {
    if (amenity === 'hospital' || tags.healthcare === 'hospital') return 'MEDICAL';
    if (amenity === 'shelter' || tags.shelter_type) return 'SHELTER';
    if (amenity === 'blood_bank' || tags.healthcare === 'blood_donation') return 'HELP_CENTER';
    if (amenity === 'fire_station') return 'VOLUNTEER_POINT';
    if (amenity === 'food_bank') return 'DONATION_POINT';
    if (amenity === 'community_centre') return 'HELP_CENTER';
    if (amenity === 'social_facility') {
      const kind = (tags.social_facility || '').toLowerCase();
      if (kind.includes('food') || kind.includes('soup')) return 'DONATION_POINT';
      if (kind.includes('shelter')) return 'SHELTER';
      return 'HELP_CENTER';
    }
    if (amenity === 'ngo') return 'VOLUNTEER_POINT';
    return 'OTHER';
  }

  private guessTags(tags: Record<string, string>): string[] {
    const blob =
      `${tags.social_facility ?? ''} ${tags.description ?? ''} ${tags.amenity ?? ''} ${tags.healthcare ?? ''}`.toLowerCase();
    const out: string[] = [];
    if (/food|comida|soup|banco|food_bank/.test(blob)) out.push('FOOD');
    if (/water|agua/.test(blob)) out.push('WATER');
    if (/shelter|albergue|refugio/.test(blob)) out.push('SHELTER');
    if (/blood|sangre|hemocentro/.test(blob)) out.push('BLOOD');
    if (/volunteer|volunt|fire_station|bombero|community_centre/.test(blob)) {
      out.push('VOLUNTEER');
    }
    if (/hospital|clinic|medicine|farmac/.test(blob)) out.push('MEDICINE');
    if (out.length === 0) out.push('OTHER');
    return out;
  }

  private describe(amenity: string, tags: Record<string, string>): string {
    const bits = [
      amenity === 'social_facility'
        ? 'Centro social / ayuda comunitaria'
        : amenity === 'community_centre'
          ? 'Centro comunitario'
          : amenity === 'food_bank'
            ? 'Banco de alimentos / acopio (mapa abierto)'
            : amenity === 'shelter'
              ? 'Albergue o refugio'
              : amenity === 'ngo'
                ? 'Organización / ONG'
                : amenity === 'blood_bank' || tags.healthcare === 'blood_donation'
                  ? 'Punto / campaña de sangre'
                  : amenity === 'fire_station'
                    ? 'Estación de bomberos — posible punto de voluntariado'
                    : amenity === 'hospital'
                      ? 'Hospital / atención en salud'
                      : 'Punto de ayuda',
      tags.opening_hours ? `Horario: ${tags.opening_hours}` : null,
    ].filter(Boolean);
    return bits.join(' · ');
  }
}
