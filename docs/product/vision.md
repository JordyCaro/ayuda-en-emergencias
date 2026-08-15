# Visión de producto — Ayuda en Emergencias

Documento condensado del master. La fuente de verdad de **comportamiento a construir** son las specs en `/specs`, no este archivo.  
**Roadmap completo de fases:** [`ROADMAP-FASES.md`](ROADMAP-FASES.md)

## Visión en una frase

**Ayuda en Emergencias** es una **capa abierta que conecta** información y actores de una emergencia en Colombia: datos oficiales, avisos de la comunidad, y (próximos slices) centros de acopio, fundaciones y ONG.  
No reemplazamos a las autoridades. **No pedimos ni administramos donaciones** (dinero o especie): solo ayudamos a que donantes, receptores y organizaciones **se encuentren** con información clara y con fuente.

Contexto sismo: [`contexto-sismo-2026.md`](contexto-sismo-2026.md) · Qué es (lenguaje humano): [`QUE-ES.md`](QUE-ES.md)

## Problema

La información existe pero está dispersa. Una persona no sabe qué es oficial, qué es un comentario de alguien, ni adónde acudir (acopio, fundación, ONG) **sin que una web intermedia “pida” la donación**.

## Solución

Web/PWA + API que:

1. Integra fuentes oficiales cuando es legal/técnicamente viable.  
2. Permite **avisos geolocalizados** (“aquí se necesita agua / ayuda con escombros”) como **comentarios**, no como pedidos que la plataforma deba cumplir.  
3. Muestra procedencia y verificación siempre.  
4. Enlaza lugares y organizaciones de terceros para donar o ayudar **en sus canales**.

## Qué no somos

- Autoridad nacional de emergencias / clima / sismos  
- Recaudadores ni custodios de donaciones  
- Garantía de que un aviso será atendido  
- Base oficial de desaparecidos, app de mascotas, etc.

## Usuarios (30 segundos)

| Intención | Flujo |
|-----------|--------|
| Dejar un aviso | Ubicación → texto (y categoría suave) → publicar como no verificado |
| Entender qué pasa | Comunidad: lista + mapa (oficiales + avisos) |
| Ver origen | Confianza / Fuentes |
| Donar / acopio / ONG | Fases **3–5**: ver y **enlazar** terceros; nosotros no cobramos |
| Quiero ayudar | Fase **4**: señales + canales de orgs |

## Fases (resumen)

| Fase | Contenido | Estado |
|------|-----------|--------|
| 0 | Discovery de fuentes | Hecha |
| 1 | Foundation + núcleo (slice **001**) | Hecha |
| 2 | Connectors oficiales + Places base | Hecha (robusta) |
| 3 | Registro lugares/orgs (**002**) | Hecha |
| 4 | Quiero ayudar / voluntariado (enlace) | Pendiente |
| 5 | Donación solo descubrimiento | Pendiente |
| 6 | Densificación territorial | Pendiente |
| 7 | Deep-links oficiales (RND, SGC…) | Pendiente |
| 8 | Moderación | Pendiente |
| 9 | Producción + API madura | Pendiente |
| 10–11 | Verticales / multi-país | Opcional |
| **12** | **Offline / PWA avanzada** | **Última, casi opcional** |

Detalle, checklist master y criterios de cierre: [`ROADMAP-FASES.md`](ROADMAP-FASES.md).

## Métrica

> ¿Cuántas personas encontraron una acción o información útil (con fuente)?

## Mensaje de equipo

Conectar lo que ya existe. No inventar emergencias. No manejar el dinero ni la especie. Un aviso es una señal, no una promesa. Offline al final, si hace falta.
