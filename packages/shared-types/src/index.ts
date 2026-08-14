export type SourceType =
  | 'OFFICIAL'
  | 'OPEN_DATA'
  | 'ORGANIZATION'
  | 'USER'
  | 'OTHER';

export type TrustTier = 1 | 2 | 3;

export type Verification =
  | 'OFFICIAL'
  | 'VERIFIED'
  | 'COMMUNITY_CONFIRMED'
  | 'UNVERIFIED'
  | 'OUTDATED'
  | 'EXPIRED'
  | 'REJECTED';

export type NeedCategory =
  | 'HELP'
  | 'WATER'
  | 'FOOD'
  | 'SHELTER'
  | 'MEDICAL'
  | 'TRANSPORT'
  | 'COMMUNICATION'
  | 'VOLUNTEER'
  | 'OTHER';

export type EventType =
  | 'HYDRO_ALERT'
  | 'EARTHQUAKE'
  | 'FLOOD'
  | 'FIRE'
  | 'LANDSLIDE'
  | 'OTHER';

export type UpdateFrequency =
  | 'REAL_TIME'
  | 'NEAR_REAL_TIME'
  | 'HOURLY'
  | 'DAILY'
  | 'HISTORICAL'
  | 'UNKNOWN';

export type IntegrationStatus =
  | 'DISCOVERY'
  | 'TESTING'
  | 'INTEGRATED'
  | 'BLOCKED'
  | 'LEGAL_REVIEW'
  | 'DEPRECATED';

export type NeedStatus = 'OPEN' | 'CLOSED' | 'EXPIRED';

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface SourceDto {
  id: string;
  name: string;
  type: SourceType;
  tier: TrustTier;
  country: string;
  url?: string | null;
  license?: string | null;
  updateFrequency?: UpdateFrequency | null;
  integrationStatus: IntegrationStatus;
  lastSuccessfulFetch?: string | null;
  attributionRequired?: boolean;
}

export interface EventDto {
  id: string;
  type: EventType;
  originalType?: string | null;
  sourceId: string;
  sourceName?: string;
  title?: string | null;
  summary?: string | null;
  geometry?: GeoJsonPoint | Record<string, unknown> | null;
  observedAt?: string | null;
  publishedAt?: string | null;
  retrievedAt: string;
  verification: Verification;
}

export interface NeedDto {
  id: string;
  category: NeedCategory;
  description: string;
  geometry: GeoJsonPoint;
  verification: Verification;
  status: NeedStatus;
  createdAt: string;
  source: 'USER';
}

export interface CreateNeedRequest {
  category: NeedCategory;
  description: string;
  geometry: GeoJsonPoint;
}
