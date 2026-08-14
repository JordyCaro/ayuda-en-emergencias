import type { EventType, Verification } from '@aee/shared-types';

export interface ConnectorFetchResult {
  rawPayload: unknown;
  fetchedAt: Date;
}

export interface NormalizedEventInput {
  type: EventType;
  originalType?: string | null;
  sourceId: string;
  sourceRecordId: string;
  title?: string | null;
  summary?: string | null;
  geometry?: Record<string, unknown> | null;
  lat?: number | null;
  lng?: number | null;
  observedAt?: Date | null;
  publishedAt?: Date | null;
  retrievedAt: Date;
  verification: Verification;
  properties?: Record<string, unknown>;
}

export interface SourceConnector {
  readonly sourceId: string;
  fetch(): Promise<ConnectorFetchResult>;
  validate(raw: unknown): boolean;
  normalize(raw: unknown, fetchedAt: Date): NormalizedEventInput[];
}
