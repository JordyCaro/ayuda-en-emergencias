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
  | 'CLOTHING'
  | 'BLOOD'
  | 'OTHER';

/** Aviso de foro: necesito ayuda vs puedo aportar. */
export type NeedIntent = 'NEED' | 'OFFER';

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

export type PlaceType =
  | 'HELP_CENTER'
  | 'DONATION_POINT'
  | 'SHELTER'
  | 'VOLUNTEER_POINT'
  | 'MEDICAL'
  | 'MEETING_POINT'
  | 'OTHER';

export type PlaceStatus = 'ACTIVE' | 'EXPIRED' | 'HIDDEN';

/** Etiquetas de qué se necesita / recibe (emergencia — no marketplace). */
export type NeedTag =
  | 'FOOD'
  | 'WATER'
  | 'MEDICINE'
  | 'CLOTHING'
  | 'SHELTER'
  | 'VOLUNTEER'
  | 'BLOOD'
  | 'OTHER';

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
  lastError?: string | null;
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
  intent: NeedIntent;
  description: string;
  geometry: GeoJsonPoint;
  verification: Verification;
  status: NeedStatus;
  createdAt: string;
  source: 'USER';
  cityCode?: string | null;
  municipality?: string | null;
  /** Solo dígitos con prefijo país si hay contacto (ej. 57300…). */
  contactWhatsapp?: string | null;
}

/** Respuesta de creación: el token solo se entrega una vez. */
export interface NeedCreateResponse extends NeedDto {
  manageToken: string;
}

export interface CreateNeedRequest {
  category: NeedCategory;
  intent: NeedIntent;
  description: string;
  geometry?: GeoJsonPoint;
  cityCode?: string;
  contactWhatsapp?: string;
}

export interface PlaceDto {
  id: string;
  type: PlaceType;
  title: string;
  description?: string | null;
  geometry: GeoJsonPoint;
  sourceId: string;
  sourceName?: string;
  verification: Verification;
  status: PlaceStatus;
  address?: string | null;
  municipality?: string | null;
  department?: string | null;
  cityCode?: string | null;
  externalUrl?: string | null;
  needTags?: NeedTag[];
  retrievedAt?: string | null;
  updatedAt?: string | null;
}

export interface PlaceCreateResponse extends PlaceDto {
  manageToken: string;
}

export interface CreatePlaceRequest {
  type: PlaceType;
  title: string;
  description?: string;
  geometry: GeoJsonPoint;
  cityCode: string;
  externalUrl?: string;
  needTags?: NeedTag[];
}

export interface CityDto {
  code: string;
  name: string;
  department: string;
  departmentCode: string;
}

/** Mascota: perdida o encontrada (señal comunitaria). */
export type PetReportKind = 'LOST' | 'FOUND';

export type PetSpecies = 'DOG' | 'CAT' | 'OTHER';

export type PetReportStatus = 'OPEN' | 'CLOSED' | 'EXPIRED';

export interface PetReportDto {
  id: string;
  kind: PetReportKind;
  species: PetSpecies;
  description: string;
  geometry: GeoJsonPoint;
  verification: Verification;
  status: PetReportStatus;
  createdAt: string;
  source: 'USER';
  cityCode?: string | null;
  municipality?: string | null;
  contactWhatsapp?: string | null;
}

export interface PetReportCreateResponse extends PetReportDto {
  manageToken: string;
}

export type ManageTargetKind = 'place' | 'need' | 'pet';

export interface ManagePreviewDto {
  kind: ManageTargetKind;
  id: string;
  title: string;
  status: string;
  municipality?: string | null;
}

export interface ManageCloseRequest {
  kind: ManageTargetKind;
  id: string;
  manageToken: string;
}

export interface CreatePetReportRequest {
  kind: PetReportKind;
  species: PetSpecies;
  description: string;
  geometry?: GeoJsonPoint;
  cityCode?: string;
  contactWhatsapp?: string;
}

/** Moderación (Fase 9) — no es autoridad estatal. */
export type ModerationTargetKind = 'place' | 'need' | 'pet';

export type ModerationAction = 'VERIFY' | 'HIDE';

export interface ModerationQueueItem {
  kind: ModerationTargetKind;
  id: string;
  title: string;
  detail?: string | null;
  municipality?: string | null;
  cityCode?: string | null;
  verification: Verification;
  status: string;
  createdAt: string;
}

export interface ModerationAuditDto {
  id: string;
  targetKind: ModerationTargetKind;
  targetId: string;
  action: ModerationAction;
  actor: string;
  note?: string | null;
  createdAt: string;
}

export interface ModerateRequest {
  note?: string;
}
