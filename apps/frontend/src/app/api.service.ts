import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  CityDto,
  CreateNeedRequest,
  CreatePlaceRequest,
  EventDto,
  NeedDto,
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

  createNeed(body: CreateNeedRequest): Observable<NeedDto> {
    return this.http.post<NeedDto>(`${this.base}/needs`, body);
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

  createPlace(body: CreatePlaceRequest): Observable<PlaceDto> {
    return this.http.post<PlaceDto>(`${this.base}/places`, body);
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
