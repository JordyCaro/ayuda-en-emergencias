# Inspiración UX — Colombia Ayuda & Red Manizales

**Fecha:** 2026-08-14  
**Referencias (solo inspiración de features, no copia de marca/UI):**

- https://colombia-ayuda-brown.vercel.app/
- https://redayudamanizales.com/

---

## Qué nos gusta de cada una

### Colombia Ayuda

| Característica | Qué aporta | ¿Lo tenemos? | ¿En qué fase? |
|----------------|------------|--------------|---------------|
| Banner de emergencia + contexto | Enmarca el “por qué” | Parcial (copy home) | **1** polish OK |
| Stats / última verificación | Sensación de “casi en tiempo real” | Parcial (`lastSuccessfulFetch`, timestamps) | **1–2** mejorar UI |
| **Organizaciones que necesitan ayuda** | Lista accionable de orgs | **No** como listado dedicado | **3 (spec 002)** |
| **Filtro por ciudad** | Encontrar cerca sin pelear con el mapa | Solo geo/bbox en mapa | **3** (+ DIVIPOLA) |
| Estoy en CO / abroad | Segmentación | No | **4+** opcional |
| No operar donaciones nosotros | Alineado con nuestra visión | Sí (constitution) | Ya |

### Red de Ayuda Manizales

| Característica | Qué aporta | ¿Lo tenemos? | ¿En qué fase? |
|----------------|------------|--------------|---------------|
| Acciones claras (necesito / quiero ayudar / mapa) | Orientación inmediata | Sí (recibir vs acompañar) | **1** |
| Ver publicaciones | Feed de necesidades/ofertas | Parcial (Comunidad lista) | **1–3** enriquecer |
| Quiero ayudar / voluntario | Matching oferta | **No** (OUT 001) | **4** (enlace; sin intermediarnos) |
| Mascotas / visita técnica | Verticales locales | **No** (OUT producto core) | Slice aparte si se aprueba |
| Canales oficiales y refugios | Enlaces a terceros | Parcial (Confianza) | **2–3** |

### Grilla “¿Qué necesitas?” (categorías con íconos)

| Característica | Nota | Fase |
|----------------|------|------|
| Categorías táctiles (agua, salud, techo…) | Ya tenemos chips/etiquetas en avisos | **1** — se puede mejorar UI |
| Categorías tipo marketplace (plomería, jurídico, pets…) | **No** es nuestro foco de emergencias | **No** meter en 1–2 |
| “¿Dónde lo necesitas?” + ciudad | Ubicación GPS hoy; falta selector ciudad | **3** con DIVIPOLA |

---

## Decisión de producto (importante)

Somos **capa que conecta**, no recaudamos donaciones.  
Por tanto:

1. **“Organizaciones que necesitan ayuda”** = lugares/orgs con aviso o Place (`HELP_CENTER` / org) + enlace a **su** canal — **no** un carrito de donación nuestro.  
2. **Filtro por ciudad** = DIVIPOLA + filtro en Comunidad / listado orgs — **Fase 3 (002)**.  
3. **Casi tiempo real** = timestamps visibles + “Última actualización” de connectors — polish **1–2**, sin fingir live si el poll es cada 15 min.  
4. **Grilla de necesidades** = sí para avisos de emergencia; **no** clonar catálogo tipo servicios del hogar.

---

## Ajustes al roadmap

| Fase | Incluye ahora explícitamente |
|------|------------------------------|
| **1** (MVP) | Avisos + mapa + IDEAM + Confianza. Mejorar copy “última sync”. |
| **2** (fuentes) | SISPRO salud + Places base. Stats de sync en UI Confianza/Comunidad. |
| **3 (002)** | **Publicar punto/org**, listado “Organizaciones / puntos que piden apoyo”, **filtro ciudad**, expiración. |
| **4** | “Quiero ayudar” / voluntariado por **enlace** (sin dinero ni matching laboral). |
| **5** | Donación solo como **descubrimiento** de canales de terceros. |
| **6–8** | Densidad territorial → deep-links oficiales → moderación. |
| **9** | Producción + API madura. |
| **12** | Offline / PWA avanzada — **última, casi opcional**. |

Canónico: [`ROADMAP-FASES.md`](ROADMAP-FASES.md) · Estado: [`../dev/ESTADO-FASES.md`](../dev/ESTADO-FASES.md) · Spec: [`../../specs/002-registro-facil-lugares/spec.md`](../../specs/002-registro-facil-lugares/spec.md)
