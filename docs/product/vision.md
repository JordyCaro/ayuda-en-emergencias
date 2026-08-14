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
4. Más adelante enlaza lugares y organizaciones de terceros para donar **en sus canales**.

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
| Donar / acopio / ONG | *Post-001 / 002+*: ver y **enlazar** terceros; nosotros no cobramos |

## Fases

| Fase | Contenido |
|------|-----------|
| 0 | Discovery de fuentes |
| 1–4 (slice **001**) | Foundation + IDEAM + avisos + mapa + fuentes |
| **002+** | Registro fácil de lugares (acopio, fundaciones…) |
| + | Más connectors, moderación, cobertura país |

## Métrica

> ¿Cuántas personas encontraron una acción o información útil (con fuente)?

## Mensaje de equipo

Conectar lo que ya existe. No inventar emergencias. No manejar el dinero ni la especie. Un aviso es una señal, no una promesa.
