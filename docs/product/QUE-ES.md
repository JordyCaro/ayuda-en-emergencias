# Qué es Ayuda en Emergencias

Documento para humanos (y quien reciba el repo). Léelo antes de mirar el código.

---

## Propósito exacto (una frase)

Somos una **capa abierta que conecta**: datos oficiales cuando se pueden integrar, avisos de la comunidad (“necesito” / “puedo aportar”), y directorio de acopios u organizaciones — para que la gente **se encuentre**.  
**No** somos la autoridad de emergencias. **No** pedimos, recaudamos ni custodiamos donaciones. Solo **mostramos, enlazamos y señalamos**.

---

## Para qué existe

Después de una emergencia la información se parte: un lado tiene alertas, otro tiene puntos de acopio, otro publica “hacen falta agua”.  
La gente no sabe **qué es oficial**, **qué es un comentario de alguien**, ni **adónde ir**.

Esta plataforma:

1. Trae **alertas / datos oficiales** cuando hay API legal y viable (IDEAM, SISPRO/REPS, etc.; otras en discovery o deep-link).  
2. Deja publicar **avisos** de necesidad u oferta (con categoría y contacto por WhatsApp si la persona lo deja): son **señales**, no tickets que prometamos cumplir.  
3. Muestra un **directorio** de lugares / orgs (acopio, ayuda, bancos de alimentos…) con filtro por ciudad y mapa como complemento.  
4. Muestra **de dónde sale cada dato** (Fuentes / procedencia).  
5. Más adelante: “quiero ayudar” y donación **solo como enlace** a canales de terceros (fases 4–5).

---

## Qué no hacemos (importante)

| No hacemos | Por qué |
|------------|---------|
| Cobrar / recibir donaciones | No somos intermediarios financieros ni de especie |
| Prometer que “la ayuda llega” | Un aviso no es un ticket de servicio |
| Inventar emergencias ni cifras | Solo datos con fuente o avisos marcados como no verificados |
| Reemplazar al 123 / UNGRD / Cruz Roja | Derivamos a canales oficiales |
| Pedir cédula / datos sensibles | Privacidad mínima |

---

## Superficie actual (fases 0–3 + UX)

| Pieza | Ruta | Qué hace |
|-------|------|----------|
| **Inicio** | `/` | Qué es, para qué sirve, actividad en vivo (conteos reales), caminos y fuentes |
| **¿Qué necesitas?** | `/buscar` | Foro: Necesito / Puedo aportar → categoría → avisos + publicar |
| **Ayudar** | `/ayudar` | Directorio de lugares/orgs + mini-mapa; filtro ciudad; Cómo llegar |
| **Publicar punto** | `/publicar-punto` | Registro fácil de acopio / org (spec **002**) |
| **Fuentes** | `/fuentes-detalle` | Registry de fuentes e integración (IDEAM, SISPRO, OSM…) |
| **API** | `:3000/api/v1` | NestJS + Swagger |
| **DB** | Docker | PostgreSQL + PostGIS |

Nav primaria: **¿Qué necesitas? · Ayudar · Publicar · Fuentes**.  
El mapa dejó de ser la puerta principal; sigue como **complemento** del directorio. Redirects: `/mapa`, `/comunidad` → `/ayudar`.

### Qué queda fuera (intencional)

Donaciones propias, matching laboral de voluntarios, mascotas, desaparecidos (RND), panel admin completo, offline avanzado (fase **12**).

---

## Avisos ≠ pedidos rígidos

- El usuario publica una **señal** (“necesito agua”, “tengo carro libre”).  
- Si deja WhatsApp, **hablan ustedes**; nosotros no intermediamos la conversación.  
- La UI no garantiza respuesta ni “ticket cerrado”.  

En código el modelo puede seguir llamándose `Need`; en producto se habla de **aviso**.

---

## Fuentes (Fase 0 → connectors)

Discovery en `docs/sources/`. Integradas o en prueba según registry (p. ej. IDEAM eventos, SISPRO places de salud, OSM ayuda, lugares curados).  
Home y Fuentes muestran **estado real** de integración — no stats inventadas de afectados.

---

## Roadmap corto

| Fase | Idea | Estado |
|------|------|--------|
| **0** | Discovery de fuentes | Hecha |
| **1 / 001** | Alertas + avisos + API + PWA | Hecha |
| **2** | SISPRO + Places robusto | Hecha |
| **3 / 002** | Orgs/acopio, ciudad DIVIPOLA, publicar punto | Hecha |
| **4–5** | Quiero ayudar + donación solo enlace | Pendiente (siguiente producto) |
| **6–8** | Densidad territorial → deep-links → moderación | Pendiente |
| **9** | Producción + API madura | Pendiente |
| **10–11** | Verticales / multi-país | Opcional |
| **12** | Offline / PWA avanzada | Última, casi opcional |

Detalle: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)

---

## Documentos relacionados

- Roadmap: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)  
- Cómo correr: [`../dev/COMO-CORRER.md`](../dev/COMO-CORRER.md)  
- Fuentes: [`../sources/source-registry.md`](../sources/source-registry.md)  
- Specs: `specs/001-…` · `specs/002-…`  
- Constitution: [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md)  
