# Cómo ver y probar el MVP 001

Producto: ver [`../product/QUE-ES.md`](../product/QUE-ES.md).  
Arranque: ver [`COMO-CORRER.md`](COMO-CORRER.md).

## Idea rápida

| Pantalla | Para qué |
|----------|----------|
| Inicio | Explica que conectamos info; no pedimos donaciones |
| Dejar aviso | Comentario en un lugar (sin garantía de respuesta) |
| Comunidad | Lista + mapa: alertas oficiales + avisos |
| Confianza | De dónde sale cada dato |

## Checklist manual

1. `pnpm docker:up` + backend + frontend  
2. Health `ok`  
3. Fuentes lista IDEAM / SGC / OSM  
4. Publicar un aviso → aparece en Comunidad  
5. Actualizar → IDEAM (si la red responde)  
6. Leer disclaimer: aviso ≠ promesa; no donaciones vía nosotros  

## API

- Swagger: http://localhost:3000/api/docs  
- `POST /api/v1/connectors/ideam/run` — sync manual  
- `POST /api/v1/needs` — crea aviso (modelo técnico `Need`)  
