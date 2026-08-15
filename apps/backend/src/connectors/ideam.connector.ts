import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import type {
  ConnectorFetchResult,
  NormalizedEventInput,
  SourceConnector,
} from './connector.interface';

interface ArcGisFeature {
  attributes?: Record<string, unknown>;
  geometry?: {
    x?: number;
    y?: number;
    rings?: number[][][];
  };
}

interface ArcGisQueryResponse {
  features?: ArcGisFeature[];
  error?: { message?: string; code?: number };
}

const LAYER_IDS = [0, 1, 2] as const;
const BASE =
  'http://dhime.ideam.gov.co/server/rest/services/OSPA/Alarma_Niveles/MapServer';

@Injectable()
export class IdeamConnector implements SourceConnector {
  readonly sourceId = 'ideam';
  private readonly logger = new Logger(IdeamConnector.name);

  async fetch(): Promise<ConnectorFetchResult> {
    const fetchedAt = new Date();
    const layers: Record<string, ArcGisQueryResponse> = {};

    for (const layerId of LAYER_IDS) {
      const url =
        `${BASE}/${layerId}/query?where=1%3D1&outFields=*&returnGeometry=true&f=json`;
      this.logger.log(`Fetching IDEAM layer ${layerId}`);
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(45_000),
      });
      if (!res.ok) {
        throw new Error(`IDEAM layer ${layerId} HTTP ${res.status}`);
      }
      layers[`layer_${layerId}`] = (await res.json()) as ArcGisQueryResponse;
    }

    return { rawPayload: { layers }, fetchedAt };
  }

  validate(raw: unknown): boolean {
    if (!raw || typeof raw !== 'object') return false;
    const layers = (raw as { layers?: Record<string, ArcGisQueryResponse> }).layers;
    if (!layers) return false;
    return Object.values(layers).some(
      (l) => Array.isArray(l.features) && l.features.length >= 0 && !l.error,
    );
  }

  normalize(raw: unknown, fetchedAt: Date): NormalizedEventInput[] {
    const layers = (raw as { layers: Record<string, ArcGisQueryResponse> }).layers;
    const out: NormalizedEventInput[] = [];

    for (const [layerKey, layer] of Object.entries(layers)) {
      for (const feature of layer.features ?? []) {
        const attrs = feature.attributes ?? {};
        const objectId =
          attrs.OBJECTID ?? attrs.objectid ?? attrs.FID ?? attrs.fid;
        const station =
          (attrs.NOMBRE as string) ||
          (attrs.Nombre as string) ||
          (attrs.ESTACION as string) ||
          (attrs.Estacion as string) ||
          (attrs.name as string) ||
          null;
        const nivel =
          attrs.NIVEL ?? attrs.Nivel ?? attrs.ALERTA ?? attrs.estado ?? null;
        const { lat, lng, geometry } = this.extractGeometry(feature);
        const sourceRecordId = `${layerKey}:${String(objectId ?? this.hashFeature(feature))}`;

        const stationClean =
          station &&
          !/^(NivelAlerta|ALERTA|null)$/i.test(String(station).trim()) &&
          String(station).trim().length > 2
            ? String(station).trim()
            : null;

        out.push({
          type: 'HYDRO_ALERT',
          originalType: String(nivel ?? layerKey),
          sourceId: this.sourceId,
          sourceRecordId,
          title: stationClean
            ? `Estación ${stationClean}`
            : 'Alerta de ríos o niveles (IDEAM)',
          summary:
            nivel != null
              ? `Nivel o estado reportado: ${String(nivel)} · IDEAM`
              : 'Dato hidrológico oficial · IDEAM',
          geometry,
          lat,
          lng,
          observedAt: null,
          publishedAt: null,
          retrievedAt: fetchedAt,
          verification: 'OFFICIAL',
          properties: { layerKey, attributes: attrs },
        });
      }
    }
    return out;
  }

  private extractGeometry(feature: ArcGisFeature): {
    lat: number | null;
    lng: number | null;
    geometry: Record<string, unknown> | null;
  } {
    const g = feature.geometry;
    if (!g) return { lat: null, lng: null, geometry: null };
    if (typeof g.x === 'number' && typeof g.y === 'number') {
      return {
        lng: g.x,
        lat: g.y,
        geometry: { type: 'Point', coordinates: [g.x, g.y] },
      };
    }
    if (g.rings?.[0]?.[0]) {
      const [x, y] = g.rings[0][0];
      return {
        lng: x,
        lat: y,
        geometry: { type: 'Point', coordinates: [x, y] },
      };
    }
    return { lat: null, lng: null, geometry: null };
  }

  private hashFeature(feature: ArcGisFeature): string {
    return createHash('sha1')
      .update(JSON.stringify(feature))
      .digest('hex')
      .slice(0, 16);
  }
}
