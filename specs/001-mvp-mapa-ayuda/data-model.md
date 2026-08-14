# Data model 001

## Enums

```text
SourceType: OFFICIAL | OPEN_DATA | ORGANIZATION | USER | OTHER
TrustTier: 1 | 2 | 3
Verification: OFFICIAL | VERIFIED | COMMUNITY_CONFIRMED | UNVERIFIED | OUTDATED | EXPIRED | REJECTED
NeedCategory: HELP | WATER | FOOD | SHELTER | MEDICAL | TRANSPORT | COMMUNICATION | VOLUNTEER | OTHER
EventType: HYDRO_ALERT | EARTHQUAKE | FLOOD | FIRE | LANDSLIDE | OTHER
PlaceType: HELP_CENTER | DONATION_POINT | SHELTER | VOLUNTEER_POINT | MEDICAL | MEETING_POINT | OTHER
UpdateFrequency: REAL_TIME | NEAR_REAL_TIME | HOURLY | DAILY | HISTORICAL | UNKNOWN
IntegrationStatus: DISCOVERY | TESTING | INTEGRATED | BLOCKED | LEGAL_REVIEW | DEPRECATED
```

## Source

| Campo | Tipo | Notas |
|-------|------|-------|
| id | string PK | slug estable `ideam`, `sgc` |
| name | string | |
| type | SourceType | |
| tier | TrustTier | |
| country | string | ISO `CO` |
| url | string? | |
| apiUrl | string? | |
| license | string? | |
| attributionRequired | boolean | |
| redistributionAllowed | boolean? | null = unknown |
| updateFrequency | UpdateFrequency | |
| integrationStatus | IntegrationStatus | |
| lastSuccessfulFetch | timestamptz? | |
| lastError | text? | |
| notes | text? | |

## RawRecord

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | |
| sourceId | FK | |
| sourceRecordId | string? | id externo |
| payload | jsonb | |
| retrievedAt | timestamptz | |
| contentHash | string? | dedupe raw |

## Event (normalized)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | |
| type | EventType | normalizado |
| originalType | string? | valor fuente |
| sourceId | FK | |
| sourceRecordId | string | unique con sourceId |
| title | string? | |
| summary | text? | |
| geometry | geometry | Point o Polygon/MultiPolygon |
| observedAt | timestamptz? | |
| publishedAt | timestamptz? | |
| retrievedAt | timestamptz | |
| expiresAt | timestamptz? | |
| verification | Verification | OFFICIAL típico para Tier 1 |
| rawRecordId | FK? | |
| properties | jsonb | extras tipados por connector |
| lastSeenAt | timestamptz | |

Unique: `(sourceId, sourceRecordId)`.

## Need (aviso / comentario geolocalizado)

En producto se llama **aviso**. Técnicamente la tabla/API sigue `needs` en el MVP 001.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | |
| category | NeedCategory | etiqueta suave (agua, comida…), no un SLA |
| description | text | comentario libre: qué se necesita en ese lugar |
| geometry | geometry(Point) | requerido 001 |
| source | const USER | |
| verification | UNVERIFIED default | |
| status | OPEN \| CLOSED \| EXPIRED | no implica “cumplido por la plataforma” |
| createdAt | timestamptz | |
| updatedAt | timestamptz | |
| expiresAt | timestamptz? | política simple post-MVP |
| country | CO default | |

Sin teléfono/documento en 001.  
Copy de UI: no usar “pedido garantizado”; sí “aviso / señal para la comunidad”.

La plataforma **no** opera donaciones; los avisos no son solicitudes formales a “Ayuda en Emergencias”.

## Place (stub schema, no UI completa 001)

Reservado para help points posteriores. Misma idea genérica; no migrar UI en 001 salvo necesidad.

## Report (futuro)

Tipos CRITICAL_SITUATION, DAMAGED_INFRASTRUCTURE, etc. En 001, **Need** cubre el caso “necesito ayuda”. Unificar o separar en 002 según aprendizaje.

## Reglas

- Conservar `originalType` / properties de fuente  
- No borrar raw al normalizar  
- Expiración: job puede marcar OUTDATED/EXPIRED sin borrar histórico inmediato
