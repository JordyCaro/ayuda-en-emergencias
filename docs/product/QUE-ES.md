# Qué es Ayuda en Emergencias

Documento para humanos (y quien reciba el repo). Léelo antes de mirar el código.

---

## En una frase

Somos una **web que conecta**: información oficial, avisos de la comunidad, y (más adelante) centros de acopio, fundaciones y ONG.  
**No** somos la autoridad de emergencias. **No** pedimos ni recibimos donaciones (ni dinero ni especie). Solo **mostramos y enlazamos** para que otros se encuentren.

---

## Para qué existe

Después de una emergencia la información se parte: un lado tiene alertas, otro tiene puntos de acopio, otro publica “hacen falta agua”.  
La gente no sabe **qué es oficial**, **qué es un comentario de alguien**, ni **adónde ir**.

Esta plataforma:

1. Trae **alertas / datos oficiales** cuando hay API legal y viable (hoy: IDEAM en el MVP).  
2. Deja que una persona deje un **aviso en el mapa** (“en este punto se necesita agua / ayuda con escombros…”): es un **comentario geolocalizado**, no un “pedido” que la plataforma prometa cumplir.  
3. Muestra **de dónde sale cada dato** (página Confianza / Fuentes).  
4. En el futuro: ayudar a **ver** centros de acopio, fundaciones, ONG y rutas de donación **de terceros** — sin que nosotros manejemos la donación.

---

## Qué no hacemos (importante)

| No hacemos | Por qué |
|------------|---------|
| Cobrar / recibir donaciones | No somos intermediarios financieros ni de especie |
| Prometer que “la ayuda llega” | Un aviso no es un ticket de servicio |
| Inventar emergencias | Solo datos con fuente o avisos marcados como no verificados |
| Reemplazar al 123 / UNGRD / cruz roja | Derivamos a canales oficiales |
| Pedir teléfono, cédula, etc. | Privacidad mínima |

---

## MVP 001 — qué incluye hoy

| Pieza | Qué hace |
|-------|----------|
| **Inicio** | Explica el producto y lleva a las 3 acciones |
| **Dejar un aviso** | Comentario en un lugar: categoría suave + texto libre + ubicación |
| **Comunidad (mapa)** | Lista + mapa: alertas oficiales + avisos de personas |
| **Confianza** | Registro de fuentes (IDEAM, SGC bloqueado, OSM…) |
| **API** | NestJS `/api/v1` + Swagger |
| **DB** | PostgreSQL + PostGIS (Docker) |

### Qué queda fuera del 001 (y es intencional)

Donaciones (flujo propio), voluntariado completo, mascotas, personas desaparecidas, panel admin, “quiero ayudar” como matching, registro masivo de lugares (ver slice **002**).

---

## Avisos ≠ pedidos rígidos

Antes se pensó como “necesidades / pedidos”. Eso se **suaviza**:

- El usuario deja un **aviso / comentario** en un punto del mapa.  
- Texto del estilo: *“Aquí se necesitan agua y manos para escombros”*.  
- La UI deja claro: **no garantiza** que alguien responda; es señal para la comunidad y para quien quiera ayudar por su cuenta.  
- Evitamos lenguaje de “pedido cumplido / ticket abierto” para no llenar el mapa de expectativas falsas.

En código el modelo sigue llamándose `Need` por compatibilidad del MVP; en producto se habla de **aviso**.

---

## Cómo encaja el mapa

El mapa **no** es un GPS de rutas. Es un **tablero**:

- Puntos **oficiales** (ej. alertas IDEAM).  
- Puntos **de avisos** de personas (sin verificar).  

La lista es para leer; el mapa es para ver **dónde**.

---

## Roadmap corto

| Fase | Idea |
|------|------|
| **0** | Discovery de fuentes |
| **1 / 001** | Alertas + avisos + fuentes + API |
| **2** | SISPRO salud + Places (validación, sync paginado, expiración) |
| **3 / 002** | Orgs/acopio, filtro ciudad, “quién necesita apoyo” (sin donar nosotros) |
| **4–5** | Quiero ayudar + donación solo por enlace a terceros |
| **6–8** | Densidad territorial → deep-links oficiales → moderación |
| **9** | Producción + API madura |
| **10–11** | Verticales / multi-país (opcionales) |
| **12** | Offline / PWA avanzada — **última, casi opcional** |

Detalle completo: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)

---

## Documentos relacionados

- Roadmap fases: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)  
- Visión: [`vision.md`](vision.md)  
- Inspiración refs: [`INSPIRACION-REFERENCIAS.md`](INSPIRACION-REFERENCIAS.md)  
- Estado fases: [`../dev/ESTADO-FASES.md`](../dev/ESTADO-FASES.md)  
- Cómo correr: [`../dev/COMO-CORRER.md`](../dev/COMO-CORRER.md)  
- Spec 001: [`../../specs/001-mvp-mapa-ayuda/spec.md`](../../specs/001-mvp-mapa-ayuda/spec.md)  
- Spec 002: [`../../specs/002-registro-facil-lugares/spec.md`](../../specs/002-registro-facil-lugares/spec.md)  
- Constitution: [`../../.specify/memory/constitution.md`](../../.specify/memory/constitution.md)  
