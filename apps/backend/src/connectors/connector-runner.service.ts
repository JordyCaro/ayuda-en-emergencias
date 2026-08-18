import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { IdeamConnector } from './ideam.connector';
import {
  DEFAULT_SISPRO_BBOX,
  SisproBBox,
  SisproConnector,
} from './sispro.connector';
import { OsmHelpConnector } from './osm-help.connector';
import { EventsService } from '../events/events.service';
import { SourcesService } from '../sources/sources.service';
import { PlacesService } from '../places/places.service';
import { NeedsService } from '../needs/needs.service';
import { PetsService } from '../pets/pets.service';
import { PeopleService } from '../people/people.service';
import { RawRecordEntity } from '../events/raw-record.entity';
import { NATIONAL_SYNC_CITIES } from '../geo/city-bboxes';
import { findCityByCode } from '../geo/cities.seed';

export interface SisproRunResult {
  placesUpserted: number;
  skipped: boolean;
  truncated: boolean;
  fetched: number;
}

export interface NationalSyncResult {
  sispro: { cities: number; placesUpserted: number };
  osm: { cities: number; placesUpserted: number };
  skipped: boolean;
}

export interface ConnectorStatusSnapshot {
  running: { ideam: boolean; sispro: boolean; national: boolean };
  last: {
    ideam?: { at: string; ok: boolean; detail?: string };
    sispro?: { at: string; ok: boolean; detail?: string };
    national?: { at: string; ok: boolean; detail?: string };
  };
}

@Injectable()
export class ConnectorRunnerService {
  private readonly logger = new Logger(ConnectorRunnerService.name);
  private ideamRunning = false;
  private sisproRunning = false;
  private nationalRunning = false;
  private readonly last: ConnectorStatusSnapshot['last'] = {};

  constructor(
    private readonly ideam: IdeamConnector,
    private readonly sispro: SisproConnector,
    private readonly osmHelp: OsmHelpConnector,
    private readonly events: EventsService,
    private readonly places: PlacesService,
    private readonly needs: NeedsService,
    private readonly pets: PetsService,
    private readonly people: PeopleService,
    private readonly sources: SourcesService,
    @InjectRepository(RawRecordEntity)
    private readonly rawRepo: Repository<RawRecordEntity>,
  ) {}

  @Cron(process.env.IDEAM_POLL_CRON ?? '0 */15 * * * *')
  async scheduledIdeam(): Promise<void> {
    await this.runIdeam();
  }

  /** Sync SISPRO en capitales (no solo Bogotá) cada 6h. */
  @Cron(process.env.SISPRO_POLL_CRON ?? '0 0 */6 * * *')
  async scheduledSispro(): Promise<void> {
    await this.runNationalDirectorySync({ includeOsm: false, cityLimit: 12 });
  }

  /** OSM help points por ciudad (más liviano) cada 12h. */
  @Cron(process.env.OSM_HELP_POLL_CRON ?? '0 30 */12 * * *')
  async scheduledOsmHelp(): Promise<void> {
    await this.runNationalDirectorySync({ includeSispro: false, cityLimit: 16 });
  }

  /** Primera carga OSM (pocas ciudades) al arrancar el API. */
  async warmOsmHelp(): Promise<void> {
    setTimeout(() => {
      void this.runNationalDirectorySync({
        includeSispro: false,
        includeOsm: true,
        cityLimit: 8,
      }).catch((err) =>
        this.logger.warn(
          `warmOsmHelp failed: ${err instanceof Error ? err.message : String(err)}`,
        ),
      );
    }, 4000);
  }

  /** Mantiene acopios comunitarios visibles; borra avisos/mascotas caducados (cada hora). */
  @Cron(process.env.PLACES_EXPIRE_CRON ?? '0 15 * * * *')
  async scheduledExpirePlaces(): Promise<void> {
    const places = await this.places.keepCommunityPlaces();
    const needs = await this.needs.purgeExpired();
    const pets = await this.pets.purgeExpired();
    const people = await this.people.purgeExpired();
    if (places > 0) this.logger.log(`Restored ${places} community places to the map`);
    if (needs > 0) this.logger.log(`Purged ${needs} expired needs`);
    if (pets > 0) this.logger.log(`Purged ${pets} expired pet reports`);
    if (people > 0) this.logger.log(`Purged ${people} expired person reports`);
  }

  getStatus(): ConnectorStatusSnapshot {
    return {
      running: {
        ideam: this.ideamRunning,
        sispro: this.sisproRunning,
        national: this.nationalRunning,
      },
      last: { ...this.last },
    };
  }

  async runIdeam(): Promise<{ eventsUpserted: number; skipped: boolean }> {
    if (this.ideamRunning) {
      this.logger.warn('IDEAM fetch already running — skip');
      return { eventsUpserted: 0, skipped: true };
    }
    this.ideamRunning = true;
    try {
      const { rawPayload, fetchedAt } = await this.ideam.fetch();
      if (!this.ideam.validate(rawPayload)) {
        throw new Error('IDEAM payload failed validation');
      }

      const hash = createHash('sha256')
        .update(JSON.stringify(rawPayload))
        .digest('hex');
      const raw = await this.rawRepo.save(
        this.repoCreateRaw('ideam', `batch:${fetchedAt.toISOString()}`, rawPayload, fetchedAt, hash),
      );

      const normalized = this.ideam.normalize(rawPayload, fetchedAt);
      for (const item of normalized) {
        await this.events.upsertNormalized({
          ...item,
          rawRecordId: raw.id,
        });
      }

      await this.sources.markFetchSuccess('ideam');
      this.logger.log(`IDEAM OK — ${normalized.length} events upserted`);
      this.last.ideam = {
        at: new Date().toISOString(),
        ok: true,
        detail: `eventsUpserted=${normalized.length}`,
      };
      return { eventsUpserted: normalized.length, skipped: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`IDEAM fetch failed: ${message}`);
      await this.sources.markFetchError('ideam', message);
      this.last.ideam = { at: new Date().toISOString(), ok: false, detail: message };
      throw err;
    } finally {
      this.ideamRunning = false;
    }
  }

  async runSispro(bbox: SisproBBox = DEFAULT_SISPRO_BBOX): Promise<SisproRunResult> {
    if (this.sisproRunning) {
      this.logger.warn('SISPRO fetch already running — skip');
      return { placesUpserted: 0, skipped: true, truncated: false, fetched: 0 };
    }
    this.sisproRunning = true;
    try {
      const { rawPayload, fetchedAt } = await this.sispro.fetch(bbox);
      if (!this.sispro.validate(rawPayload)) {
        throw new Error('SISPRO payload failed validation');
      }

      const truncated = Boolean(
        (rawPayload as { truncated?: boolean }).truncated,
      );
      const hash = createHash('sha256')
        .update(JSON.stringify({ bbox, count: (rawPayload as { features?: unknown[] }).features?.length }))
        .digest('hex');
      await this.rawRepo.save(
        this.repoCreateRaw(
          'sispro',
          `bbox:${fetchedAt.toISOString()}`,
          {
            bbox,
            truncated,
            featureCount: (rawPayload as { features?: unknown[] }).features?.length ?? 0,
          },
          fetchedAt,
          hash,
        ),
      );

      const places = this.sispro.extractPlaces(rawPayload, fetchedAt);
      const placesUpserted = await this.places.upsertOfficialBatch(
        places.map((p) => ({
          type: 'MEDICAL' as const,
          title: p.title,
          description: p.description,
          lat: p.lat,
          lng: p.lng,
          sourceId: 'sispro',
          sourceRecordId: p.sourceRecordId,
          verification: 'OFFICIAL' as const,
          address: p.address,
          municipality: p.municipality,
          department: p.department,
          cityCode: this.matchCityCode(p.municipality, p.department),
          externalUrl: p.externalUrl,
          needTags: ['MEDICINE'],
          retrievedAt: p.retrievedAt,
          properties: p.properties,
        })),
      );

      await this.sources.markFetchSuccess('sispro');
      this.logger.log(
        `SISPRO OK — ${placesUpserted} places upserted` +
          (truncated ? ' (truncated: hit page cap)' : ''),
      );
      this.last.sispro = {
        at: new Date().toISOString(),
        ok: true,
        detail: `placesUpserted=${placesUpserted};truncated=${truncated}`,
      };
      return {
        placesUpserted,
        skipped: false,
        truncated,
        fetched: places.length,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`SISPRO fetch failed: ${message}`);
      await this.sources.markFetchError('sispro', message);
      this.last.sispro = { at: new Date().toISOString(), ok: false, detail: message };
      throw err;
    } finally {
      this.sisproRunning = false;
    }
  }

  /**
   * Barrido nacional por capitales: SISPRO (salud) + OSM (centros sociales / ONG).
   * Evita un bbox país-entero (timeouts Overpass / abuso ArcGIS).
   */
  async runNationalDirectorySync(opts?: {
    includeSispro?: boolean;
    includeOsm?: boolean;
    cityLimit?: number;
  }): Promise<NationalSyncResult> {
    if (this.nationalRunning) {
      this.logger.warn('National directory sync already running — skip');
      return {
        sispro: { cities: 0, placesUpserted: 0 },
        osm: { cities: 0, placesUpserted: 0 },
        skipped: true,
      };
    }
    this.nationalRunning = true;
    const includeSispro = opts?.includeSispro !== false;
    const includeOsm = opts?.includeOsm !== false;
    const cities = NATIONAL_SYNC_CITIES.slice(0, opts?.cityLimit ?? NATIONAL_SYNC_CITIES.length);

    let sisproCities = 0;
    let sisproPlaces = 0;
    let osmCities = 0;
    let osmPlaces = 0;

    try {
      for (const city of cities) {
        if (includeSispro) {
          try {
            const r = await this.runSispro(city.bbox);
            if (!r.skipped) {
              sisproCities += 1;
              sisproPlaces += r.placesUpserted;
            }
          } catch (err) {
            this.logger.warn(
              `SISPRO ${city.name} failed: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }

        if (includeOsm) {
          try {
            const { rows, fetchedAt } = await this.osmHelp.fetchCity(city);
            const n = await this.places.upsertOfficialBatch(
              rows.map((p) => ({
                type: p.type,
                title: p.title,
                description: p.description,
                lat: p.lat,
                lng: p.lng,
                sourceId: 'osm',
                sourceRecordId: p.sourceRecordId,
                verification: 'UNVERIFIED' as const,
                address: p.address,
                municipality: p.municipality,
                department: findCityByCode(city.code)?.department ?? null,
                cityCode: p.cityCode,
                externalUrl: p.externalUrl,
                needTags: p.needTags,
                retrievedAt: fetchedAt,
                properties: p.properties,
              })),
            );
            osmCities += 1;
            osmPlaces += n;
            await this.sources.markFetchSuccess('osm');
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.warn(`OSM help ${city.name} failed: ${message}`);
            await this.sources.markFetchError('osm', message);
          }
          // Evitar martillar Overpass entre ciudades
          await sleep(1500);
        }
      }

      this.logger.log(
        `National sync done — SISPRO cities=${sisproCities} places=${sisproPlaces}; OSM cities=${osmCities} places=${osmPlaces}`,
      );
      this.last.national = {
        at: new Date().toISOString(),
        ok: true,
        detail: `sisproPlaces=${sisproPlaces};osmPlaces=${osmPlaces}`,
      };
      return {
        sispro: { cities: sisproCities, placesUpserted: sisproPlaces },
        osm: { cities: osmCities, placesUpserted: osmPlaces },
        skipped: false,
      };
    } finally {
      this.nationalRunning = false;
    }
  }

  private matchCityCode(
    municipality: string | null,
    department: string | null,
  ): string | null {
    if (!municipality) return null;
    const norm = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    const m = norm(municipality);
    const d = department ? norm(department) : '';
    const hit = NATIONAL_SYNC_CITIES.find((c) => {
      const city = findCityByCode(c.code);
      if (!city) return false;
      const cn = norm(city.name.replace(', D.C.', ''));
      if (m.includes(cn) || cn.includes(m)) {
        if (!d) return true;
        return norm(city.department).includes(d) || d.includes(norm(city.department));
      }
      return false;
    });
    return hit?.code ?? null;
  }

  private repoCreateRaw(
    sourceId: string,
    sourceRecordId: string,
    payload: unknown,
    retrievedAt: Date,
    contentHash: string,
  ) {
    return this.rawRepo.create({
      sourceId,
      sourceRecordId,
      payload: payload as Record<string, unknown>,
      retrievedAt,
      contentHash,
    });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
