import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  CityDto,
  CreateNeedRequest,
  CreatePetReportRequest,
  CreatePlaceRequest,
  EventDto,
  ManageCloseRequest,
  ManagePreviewDto,
  ManageTargetKind,
  NeedCreateResponse,
  NeedDto,
  PetReportCreateResponse,
  PetReportDto,
  PlaceCreateResponse,
  PlaceDto,
  SourceDto,
} from '@aee/shared-types';

export interface SisproRunResponse {
  ok: boolean;
  placesUpserted: number;
  skipped?: boolean;
  truncated?: boolean;
  fetched?: number;
  bbox?: { west: number; south: number; east: number; north: number };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1';

  health(): Observable<{ status: string; database: string }> {
    return this.http.get<{ status: string; database: string }>(`${this.base}/health`);
  }

  sources(): Observable<{ data: SourceDto[] }> {
    return this.http.get<{ data: SourceDto[] }>(`${this.base}/sources`);
  }

  events(): Observable<{ data: EventDto[] }> {
    return this.http.get<{ data: EventDto[] }>(`${this.base}/events`);
  }

  needs(params?: {
    category?: string;
    intent?: 'NEED' | 'OFFER';
    cityCode?: string;
  }): Observable<{ data: NeedDto[] }> {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.intent) q.set('intent', params.intent);
    if (params?.cityCode) q.set('cityCode', params.cityCode);
    const qs = q.toString();
    return this.http.get<{ data: NeedDto[] }>(`${this.base}/needs${qs ? `?${qs}` : ''}`);
  }

  createNeed(body: CreateNeedRequest): Observable<NeedCreateResponse> {
    return this.http.post<NeedCreateResponse>(`${this.base}/needs`, body);
  }

  cities(q?: string): Observable<{ data: CityDto[] }> {
    const qs = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
    return this.http.get<{ data: CityDto[] }>(`${this.base}/geo/cities${qs}`);
  }

  places(params?: {
    type?: string;
    west?: number;
    south?: number;
    east?: number;
    north?: number;
    lat?: number;
    lng?: number;
    radius?: number;
    limit?: number;
    cityCode?: string;
    origin?: 'community' | 'official' | 'all';
    tag?: string;
    helpOnly?: boolean;
  }): Observable<{ data: PlaceDto[]; meta?: { limit: number; offset: number; count: number } }> {
    const q = new URLSearchParams();
    if (params?.type) q.set('type', params.type);
    if (params?.west != null) q.set('west', String(params.west));
    if (params?.south != null) q.set('south', String(params.south));
    if (params?.east != null) q.set('east', String(params.east));
    if (params?.north != null) q.set('north', String(params.north));
    if (params?.lat != null) q.set('lat', String(params.lat));
    if (params?.lng != null) q.set('lng', String(params.lng));
    if (params?.radius != null) q.set('radius', String(params.radius));
    if (params?.limit != null) q.set('limit', String(params.limit));
    if (params?.cityCode) q.set('cityCode', params.cityCode);
    if (params?.origin) q.set('origin', params.origin);
    if (params?.tag) q.set('tag', params.tag);
    if (params?.helpOnly) q.set('helpOnly', 'true');
    const qs = q.toString();
    return this.http.get<{
      data: PlaceDto[];
      meta?: { limit: number; offset: number; count: number };
    }>(`${this.base}/places${qs ? `?${qs}` : ''}`);
  }

  createPlace(body: CreatePlaceRequest): Observable<PlaceCreateResponse> {
    return this.http.post<PlaceCreateResponse>(`${this.base}/places`, body);
  }

  pets(params?: {
    kind?: 'LOST' | 'FOUND';
    species?: string;
    cityCode?: string;
  }): Observable<{ data: PetReportDto[] }> {
    const q = new URLSearchParams();
    if (params?.kind) q.set('kind', params.kind);
    if (params?.species) q.set('species', params.species);
    if (params?.cityCode) q.set('cityCode', params.cityCode);
    const qs = q.toString();
    return this.http.get<{ data: PetReportDto[] }>(`${this.base}/pets${qs ? `?${qs}` : ''}`);
  }

  createPet(body: CreatePetReportRequest): Observable<PetReportCreateResponse> {
    return this.http.post<PetReportCreateResponse>(`${this.base}/pets`, body);
  }

  managePreview(
    kind: ManageTargetKind,
    id: string,
    token: string,
  ): Observable<ManagePreviewDto> {
    const q = new URLSearchParams({ kind, id, token });
    return this.http.get<ManagePreviewDto>(`${this.base}/manage/preview?${q}`);
  }

  manageClose(body: ManageCloseRequest): Observable<unknown> {
    return this.http.post(`${this.base}/manage/close`, body);
  }

  /** Construye URL relativa para guardar/compartir. */
  manageUrl(kind: ManageTargetKind, id: string, manageToken: string): string {
    const q = new URLSearchParams({ kind, id, token: manageToken });
    return `/cerrar?${q.toString()}`;
  }

  runIdeam(): Observable<{ ok: boolean; eventsUpserted: number; skipped?: boolean }> {
    return this.http.post<{ ok: boolean; eventsUpserted: number; skipped?: boolean }>(
      `${this.base}/connectors/ideam/run`,
      {},
    );
  }

  runSispro(bbox: {
    west: number;
    south: number;
    east: number;
    north: number;
  }): Observable<SisproRunResponse> {
    return this.http.post<SisproRunResponse>(`${this.base}/connectors/sispro/run`, bbox);
  }
}
