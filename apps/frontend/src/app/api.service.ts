import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { CreateNeedRequest, EventDto, NeedDto, SourceDto } from '@aee/shared-types';

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

  needs(): Observable<{ data: NeedDto[] }> {
    return this.http.get<{ data: NeedDto[] }>(`${this.base}/needs`);
  }

  createNeed(body: CreateNeedRequest): Observable<NeedDto> {
    return this.http.post<NeedDto>(`${this.base}/needs`, body);
  }

  runIdeam(): Observable<{ ok: boolean; eventsUpserted: number }> {
    return this.http.post<{ ok: boolean; eventsUpserted: number }>(
      `${this.base}/connectors/ideam/run`,
      {},
    );
  }
}
