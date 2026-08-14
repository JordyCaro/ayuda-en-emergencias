# infra/ — Infraestructura (no es frontend ni backend)

## ¿Qué es esto?

Aquí **no** vive la lógica de la app. Aquí viven las **recetas** para:

1. Levantar el proyecto en tu máquina (Docker)  
2. Más adelante: publicarlo en un servidor (HTTPS, backups, etc.)

```text
apps/frontend  →  el producto que se ve
apps/backend   →  el producto que calcula/guarda
infra/         →  el “cómo lo enciendo” (DB, contenedores, deploy)
```

## Carpetas

### `docker/`

Cuando exista código, aquí irá algo como:

| Archivo (previsto) | Función |
|--------------------|---------|
| `docker-compose.yml` | Un comando levanta PostGIS + backend (+ opcional frontend/nginx) |
| `Dockerfile.backend` | Cómo empaquetar la API en una imagen |
| `Dockerfile.frontend` | Cómo construir la PWA estática (opcional) |

**Analogía:** el `docker-compose` es el interruptor que enciende base de datos + API juntos, sin instalar PostgreSQL a mano.

### `deploy/`

Notas o scripts de producción (dominio, HTTPS, hosting barato, backups).  
Vacío hasta que haya algo que desplegar.

## Qué NO poner aquí

- Componentes Angular → `apps/frontend`  
- Controllers Nest → `apps/backend`  
- Specs / tareas → `specs/`  
- Inventario de APIs IDEAM → `docs/sources/`  

## Estado actual

Solo esta documentación. **Aún no hay** `docker-compose.yml` porque todavía no hay código (decisión consciente).

Cuando se autorice la Fase 1 de `tasks.md`, la task `T1.5` creará el compose aquí.
