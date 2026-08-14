# connectors/ — integraciones (lado servidor)

Un directorio por país/fuente. Los dispara el **backend**, no el frontend.

```text
IDEAM/SGC  →  connectors/co/...  →  apps/backend  →  DB  →  API  →  apps/frontend
```

## Layout

```text
connectors/co/ideam/
connectors/co/sgc/
connectors/co/datos-gov/
connectors/community/   # escritura ciudadana (POST /needs), no poll
```

## DoD

Ver constitution + `docs/sources/source-registry.md`.

**Sin código aún.** Status de fuentes: DISCOVERY.
