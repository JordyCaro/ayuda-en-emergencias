# Constitution — Ayuda en Emergencias

**Estado:** activa  
**Nivel SDD:** Spec-Anchored (L2) en API, datos y trust; L1 aceptable en UI exploratoria  
**Enmiendas:** solo con decisión explícita documentada en ADR + actualización de esta constitution

---

## 1. Propósito

Somos una **capa abierta de integración** para emergencias: descubrimos, normalizamos y presentamos información accionable.  
**No** somos autoridad de emergencias, sistema meteorológico, detector sísmico ni base oficial de desaparecidos.

## 2. Principios no negociables

### I. Integrar antes de construir

Antes de cualquier feature de datos: investigar API, dataset, estándar, plataforma u open source existente.  
Si es legal y técnicamente viable → integrar. Solo construir el vacío real.

### II. Fuente antes que interfaz

Primero origen del dato; después UI. Ningún dato sin procedencia visible.

### III. Procedencia obligatoria

Todo registro expuesto debe conservar, como mínimo:

- `sourceId` / nombre de fuente  
- URL u origen cuando exista  
- `retrievedAt`  
- `publishedAt` / `observedAt` de la fuente cuando exista  
- tipo de fuente (`OFFICIAL` | `ORGANIZATION` | `USER` | …)  
- `verification` (ver modelo de confianza)

### IV. No convertir datos en afirmaciones falsas

- Lluvia ≠ inundación automática  
- Reporte ciudadano ≠ hecho confirmado  
- Diferenciar: observado, reportado, oficial, verificado, no verificado, antiguo, expirado  

Textos de UI deben reflejar incertidumbre (ej. “Reportado por ciudadanos. Sin confirmación oficial.”).

### V. Utilidad sobre cantidad

MVP delgado y usable. Preferir una acción completa en &lt;30s a muchas pantallas incompletas.

### VI. API primero

La Web/PWA es un consumidor. La API pública es producto. OpenAPI desde el inicio.

### VII. Gratis para la persona

No cobramos por acceder a información de emergencia.

### VIII. Privacidad mínima necesaria

No almacenar documentos de identidad, teléfonos públicos ni direcciones privadas salvo necesidad legal real.  
Casos de personas desaparecidas: **siempre** mostrar RND/SIRDEC y líneas oficiales primero. Pueden existir avisos comunitarios `UNVERIFIED` (busco / se vio / encontré), con caducidad corta, **sin cédulas** y sin presentarnos como autoridad ni como registro oficial.

### IX. Ética

Nunca:

- hacernos pasar por autoridad  
- emitir órdenes de evacuación propias  
- inventar emergencias o cantidades sin fuente  
- reemplazar organismos de socorro  
- publicar datos personales sensibles sin controles  
- hacer scraping agresivo de portales oficiales  
- **pedir, recaudar o custodiar donaciones** (dinero o especie) en nombre de la plataforma  

### X. Conectar, no intermediarios

Somos capa de **información y encuentro**. Los flujos de donación, acopio y ayuda material ocurren en **canales de terceros** (fundaciones, ONG, centros de acopio). Nosotros enlazamos y mostramos; no operamos la donación.

Los avisos de comunidad son **señales / comentarios geolocalizados**, no pedidos que la plataforma prometa cumplir. UI y copy deben evitar expectativas de “ticket atendido”.

### XI. Spec como contrato

Cambios de comportamiento no triviales actualizan `spec`/`plan`/`tasks` **y** código.  
Si el agente falla: primero corregir el contrato, luego regenerar.

## 3. Stack fijado (Plan-level, binding)

| Capa | Elección |
|------|----------|
| Frontend | Angular + TypeScript + PWA |
| Mapas | MapLibre GL JS + OSM (atribución obligatoria) |
| Backend | Node.js + NestJS + REST + OpenAPI |
| DB | PostgreSQL + PostGIS |
| Monorepo | pnpm workspaces (sin Nx/Turborepo en MVP) |
| Infra | Docker + HTTPS + CI básico |

Cambiar stack requiere ADR + enmienda a esta sección.

## 4. Modelo de confianza (invariante)

Estados permitidos:

```text
OFFICIAL | VERIFIED | COMMUNITY_CONFIRMED | UNVERIFIED | OUTDATED | EXPIRED | REJECTED
```

Reportes / avisos de usuario nacen como `UNVERIFIED` con `source = USER`. En producto se llaman **avisos** (comentarios en el mapa), no “pedidos” con promesa de cumplimiento.

## 5. Estándares de ingeniería

- Validación y sanitización en backend; no confiar en el frontend  
- Secretos fuera del repo  
- Rate limiting y protección antispam en endpoints públicos de escritura  
- Tests mínimos por connector (DoD de connector en vision/docs)  
- i18n: español primero; claves externalizadas; inglés preparado  
- Código open source cuando licencias y seguridad lo permitan  

## 6. Anti-patrones (el agente NUNCA debe)

1. Inventar cantidades (“500 cajas”, “100 atrapados”) sin fuente  
2. Presentar reportes ciudadanos como alertas oficiales  
3. Codificar `if (country === 'CO')` en el core (usar Country/Region/Source/Connector)  
4. Construir detector sísmico, clima propio o mapa mundial propio  
5. Spec novela del producto entero; specs por feature vertical  
6. Implementar features OUT del spec activo “porque es fácil”  
7. Scraping agresivo o redistribuir datos con licencia desconocida (`LEGAL_REVIEW`)  
8. Empezar código de producto sin spec+plan aprobados para el slice  

## 7. Alcance por defecto del MVP (slice 001)

**IN:** mapa/comunidad, eventos/alertas oficiales (connectors Tier 1 viables), **avisos** geolocalizados (“aquí se necesita…”, sin garantía de atención), página Fuentes/Confianza, API base.  
**OUT del 001 (y de la plataforma como operador):** recaudar o custodiar donaciones (dinero o especie), voluntariado completo, mascotas, casos de desaparecidos (salvo enlace), push, offline avanzado, bots, IA como verdad, admin completo. Enlazar acopio/ONG/fundaciones de terceros → slices **002+**.

## 8. Gobernanza

- Constitution Check en cada `plan.md`  
- Gate humano: aprobar `spec.md` + `plan.md` antes de implementar  
- Este archivo se actualiza con cuidado; no en cada feature  

---

*Derivada del master de producto y del SDD-MASTER del equipo. 2026-08-14.*
