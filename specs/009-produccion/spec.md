# Spec 009 — Producción y API madura

**Producto:** Ayuda en Emergencias  
**Feature:** `009-produccion`  
**Fase:** 10  
**Estado:** APROBADA  
**Aprobación:** 2026-08-14 — product owner  
**Fecha:** 2026-08-14  

---

## 1. Outcomes

1. La API puede correr en **modo producción** sin `synchronize`.  
2. Hay **baseline de migraciones** TypeORM + script de apply.  
3. **Docker** empaqueta backend (+ compose con DB).  
4. **Health** live/ready y **estado de connectors** consultable.  
5. OpenAPI exportado como contrato versionado.  
6. Checklist de deploy (HTTPS, secretos, backups) documentado — hosting real puede ser del operador.

## 2. Alcance

### IN

- `synchronize` off cuando `NODE_ENV=production` (ya) + migraciones.  
- Dockerfiles + `docker-compose.prod.yml`.  
- `GET /health/live`, `GET /health/ready`.  
- `GET /connectors/status`.  
- Token ops opcional `OPS_TOKEN` para disparar connectors en prod.  
- OpenAPI JSON en `specs/009-produccion/contracts/`.  
- Docs deploy lean en `infra/deploy/`.

### OUT

- Contratar hosting / dominio / TLS en nombre del proyecto (el operador lo hace con el checklist).  
- Multi-región, Kubernetes, CDN.  
- Multi-país (Fase 11).  
- Offline PWA avanzada (Fase 12).

## 3. Criterios

- [ ] `pnpm --filter @aee/backend build` + migration scripts.  
- [ ] Compose prod levanta API+DB en doc.  
- [ ] Health/connectors status responden.  
- [ ] Roadmap: Fase 10 hecha (con nota: deploy cloud = operador).
