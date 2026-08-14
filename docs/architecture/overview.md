# Arquitectura — overview

## Diagrama conceptual

```text
        FUENTES (oficiales | open data | orgs | ciudadanos)
                           │
                    CONNECTORS (por país/fuente)
                           │
              raw → validate → normalize → dedupe
                           │
                  PostgreSQL + PostGIS
                           │
                    API pública (NestJS)
                           │
              ┌────────────┼────────────┐
           Web/PWA      Admin*      Terceros*
                         (* post-MVP / externo)
```

## Principio de datos

La API pública **nunca** golpea fuentes externas en cada request. Solo lee DB/cache alimentada por connectors.

```text
External source → Connector → Database → Public API → Clients
```

## Bounded contexts (lógicos)

| Contexto | Responsabilidad |
|----------|-----------------|
| **Catalog / Sources** | Registry, licencias, health, last_fetch |
| **Ingestion** | Connectors, raw payloads, jobs de polling |
| **Core domain** | Events/Alerts, Needs, Reports, Places |
| **Trust** | verification, moderación, rechazo, expiración |
| **Delivery** | REST/OpenAPI, GeoJSON, rate limits |
| **Experience** | Angular PWA, mapa, formularios, página fuentes |

## Apps

| App | Rol |
|-----|-----|
| `apps/frontend` | **FRONTEND** — UI ciudadana (Angular PWA) |
| `apps/backend` | **BACKEND** — API NestJS + orquestación de connectors |
| `apps/admin` | Moderación (slice posterior) |

Ver mapa narrado: [`../MAPA-DEL-REPO.md`](../MAPA-DEL-REPO.md).

Connectors viven en `/connectors` como módulos invocables por workers (mismo proceso Nest al inicio; separar solo si duele).

## Modelo de entidades (conceptual)

```text
Source
 └── ConnectorRun / RawRecord
      └── Normalized Record
           ├── Event / Alert
           ├── Need
           ├── Report
           └── Place
```

Detalle: `specs/001-mvp-mapa-ayuda/data-model.md`.

## Multi-país

```text
Country → Region → Source → Connector
```

Core sin `if (country === 'CO')`. Connectors bajo `connectors/co/...`.

## Seguridad MVP

HTTPS, validación, sanitización, rate limit, límites de tamaño, CORS estricto, secretos fuera del repo, logs, backups. No confiar en el cliente.

## Offline (expectativa honesta)

PWA: cache de shell + datos recientes. Reportes offline completos = post-001.  
Sin canal de red no hay envío al servidor — no prometer “offline en tiempo real”.

## Observabilidad

Por connector: `last_successful_fetch`, errores, latency, `source_update_frequency`.  
Página Fuentes refleja estado para transparencia.

## Referencias

- Constitution  
- ADRs 0001–0005  
- Spec 001 plan.md  
- Master original (material de explore; no contrato)
