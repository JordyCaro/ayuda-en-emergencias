import { Injectable, Logger } from '@nestjs/common';
import type { ConnectorFetchResult, SourceConnector } from './connector.interface';
import type { BBox } from '../common/geo';

export type SisproBBox = BBox;

interface ArcGisFeature {
  attributes?: Record<string, unknown>;
  geometry?: { x?: number; y?: number };
}

interface ArcGisQueryResponse {
  features?: ArcGisFeature[];
  exceededTransferLimit?: boolean;
  error?: { message?: string };
}

export interface SisproPlaceRow {
  sourceRecordId: string;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  municipality: string | null;
  department: string | null;
  externalUrl: string | null;
  retrievedAt: Date;
  properties: Record<string, unknown>;
}

const LAYER =
  'https://sig.sispro.gov.co/arcgis_msp/rest/services/Visor/MPS_Proteccion_Social/FeatureServer/2';

const PAGE_SIZE = 500;
/** Cap de páginas por sync (evita timeouts / abuso). 20 * 500 = 10k máx por bbox. */
const MAX_PAGES = 20;

/** Default: área amplia Bogotá D.C. */
export const DEFAULT_SISPRO_BBOX: SisproBBox = {
  west: -74.25,
  south: 4.45,
  east: -73.95,
  north: 4.85,
};

@Injectable()
export class SisproConnector implements SourceConnector {
  readonly sourceId = 'sispro';
  private readonly logger = new Logger(SisproConnector.name);

  async fetch(bbox: SisproBBox = DEFAULT_SISPRO_BBOX): Promise<ConnectorFetchResult> {
    const fetchedAt = new Date();
    const allFeatures: ArcGisFeature[] = [];
    let truncated = false;

    for (let page = 0; page < MAX_PAGES; page++) {
      const offset = page * PAGE_SIZE;
      const { features, exceeded } = await this.fetchPage(bbox, offset);
      allFeatures.push(...features);
      this.logger.log(
        `SISPRO page ${page + 1}: +${features.length} (total ${allFeatures.length})`,
      );
      if (features.length < PAGE_SIZE) {
        truncated = false;
        break;
      }
      if (exceeded || page === MAX_PAGES - 1) {
        truncated = true;
        break;
      }
    }

    return {
      rawPayload: {
        bbox,
        features: allFeatures,
        truncated,
        pageSize: PAGE_SIZE,
        maxPages: MAX_PAGES,
      },
      fetchedAt,
    };
  }

  private async fetchPage(
    bbox: SisproBBox,
    resultOffset: number,
  ): Promise<{ features: ArcGisFeature[]; exceeded: boolean }> {
    const geometry = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;
    const url =
      `${LAYER}/query?where=1%3D1` +
      `&geometry=${encodeURIComponent(geometry)}` +
      `&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects` +
      `&outFields=OBJECTID,Nombre,NombrePrestador,Direccion,NOM_DPTO,NOM_MPIO,CodigoDepartamento,URL` +
      `&returnGeometry=true&outSR=4326` +
      `&resultRecordCount=${PAGE_SIZE}&resultOffset=${resultOffset}&f=json`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`SISPRO HTTP ${res.status}`);
    const json = (await res.json()) as ArcGisQueryResponse;
    if (json.error?.message) throw new Error(`SISPRO: ${json.error.message}`);
    return {
      features: Array.isArray(json.features) ? json.features : [],
      exceeded: Boolean(json.exceededTransferLimit),
    };
  }

  validate(raw: unknown): boolean {
    if (!raw || typeof raw !== 'object') return false;
    const features = (raw as ArcGisQueryResponse).features;
    return Array.isArray(features);
  }

  normalize(_raw: unknown, _fetchedAt: Date): [] {
    return [];
  }

  extractPlaces(raw: unknown, fetchedAt: Date): SisproPlaceRow[] {
    const features = (raw as ArcGisQueryResponse).features ?? [];
    const out: SisproPlaceRow[] = [];
    const seen = new Set<string>();

    for (const f of features) {
      const a = f.attributes ?? {};
      const lng = typeof f.geometry?.x === 'number' ? f.geometry.x : null;
      const lat = typeof f.geometry?.y === 'number' ? f.geometry.y : null;
      if (lng == null || lat == null) continue;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const objectId = a.OBJECTID ?? a.objectid;
      if (objectId == null || objectId === '') continue;
      const sourceRecordId = `ips:${String(objectId)}`;
      if (seen.has(sourceRecordId)) continue;
      seen.add(sourceRecordId);

      const title = String(a.Nombre || a.NombrePrestador || 'Prestador de salud').slice(
        0,
        512,
      );
      const urlRaw = a.URL != null ? String(a.URL).trim() : '';
      out.push({
        sourceRecordId,
        title,
        description: a.NombrePrestador
          ? `Prestador: ${String(a.NombrePrestador)}`
          : 'Sede IPS (SISPRO / REPS)',
        lat,
        lng,
        address: a.Direccion != null ? String(a.Direccion) : null,
        municipality: a.NOM_MPIO != null ? String(a.NOM_MPIO) : null,
        department: a.NOM_DPTO != null ? String(a.NOM_DPTO) : null,
        externalUrl: urlRaw.startsWith('http') ? urlRaw : null,
        retrievedAt: fetchedAt,
        properties: {
          objectId,
          codigoDepartamento: a.CodigoDepartamento ?? null,
        },
      });
    }
    return out;
  }
}
