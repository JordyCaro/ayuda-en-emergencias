# Mejoras y correcciones (post-lanzamiento)

**Estado:** aprobado para implementar en rama `dev` (2026-08-18). **No mergear a `main`** hasta revisión.  
**Ajuste P0 `/buscar`:** se mantienen las pestañas Necesito / Puedo aportar; categoría y ciudad **solo filtran**. El muro se lista al elegir la pestaña.  
**Origen:** feedback de personas a las que se compartió la app en producción + revisión de UI.

La constitution manda *utilidad en &lt;30 s*, *conectar no intermediar*, *no hacernos pasar por autoridad*, *no inventar cifras*, *privacidad mínima*. Este doc clasifica cada idea contra eso.

---

## Qué está pasando (síntesis)

La gente entiende el producto (“el resto está super genial”). Lo que piden no es otro backend: es **menos fricción** y **más claridad**.

Tres hilos:

1. **Ver el muro como en Perdidos** — en Necesito / Puedo aportar hoy hay que elegir pestaña **y** categoría antes de ver tarjetas.
2. **Crisis ≠ formulario largo** — chat numerado, SOS, GPS, alarma, “que el celu indique dónde buscar”.
3. **Confianza visual** — el bloque “Lo que ya está en movimiento” y el botón Menú en móvil se leen mal.

---

## Orden propuesto (cuando se pida código)

| Prioridad | Qué | Tipo | Esfuerzo | Slice / notas |
|-----------|-----|------|----------|----------------|
| **P0** | Menú móvil: hamburguesa de 3 líneas, no dos rayas | Bug | Muy bajo | Hotfix UI, sin spec nueva |
| **P0** | `/buscar`: listar avisos al entrar (como `/perdidos`); categoría = filtro, no candado | UX | Bajo | Ajuste de `001` / copy; no cambia API |
| **P1** | Home: stats con títulos humanos + disclaimer | Copy | Bajo | No inventar cantidades; los números ya salen de la API |
| **P1** | Publicar aviso en 3 toques (chips), formulario largo opcional | UX | Medio | Sigue `POST /needs`; cumple “&lt;30 s” |
| **P2** | CTA SOS = **llamar 123** (grande); no enviar GPS a nosotros | Copy + layout | Bajo | Constitution: no somos despacho |
| **P2** | “Añadir a la pantalla de inicio” (PWA) + iconos del manifest | PWA | Bajo–medio | Manifest hoy tiene `icons: []` |
| **P3** | Wizard tipo chat (sin IA) | UX | Medio | Solo si P1 no alcanza |
| **Fuera** | Alarma / linterna / “busca aquí” nativo, SOS que despacha rescate, chat in-app, app de tiendas | — | — | Ver sección OUT |

---

## Feedback externo, uno por uno

### 1. “En Necesito ayuda / Puedo aportar, la listica como en Perdidos”

**Qué piden:** al abrir, ver tarjetas (etiqueta, texto, ciudad, hora) y un botón de publicar. No un cuestionario previo.

**Qué hay hoy:** `/perdidos` muestra el feed de inmediato y el formulario se abre con “Publicar mascota”. `/buscar` exige `intent` + `categoría` para revelar el muro (`buscar-page.component.ts`).

**Viabilidad:** alta. Misma API (`GET /needs`). Default razonable: pestaña **Necesito ayuda**, categoría **Todas**, chips de ciudad; el formulario detrás de “Publicar”.

**Cómo:** no bloquear el `*ngIf="intent && category"`. Filtros como en mascotas. Cuidado con mezclar **ejemplos DEMO** y avisos reales: si se ven juntos, alguien cree que hay ayuda que no existe (constitution IV). Marcar “Ejemplo” más fuerte o quitar demos en producción.

### 2. “El flujo web es latoso; en un derrumbe no hay paciencia”

**Qué piden:** menos campos, más toques.

**Viabilidad:** alta si se interpreta como **atajos**, no como chatbot con IA.

**Cómo (recomendado):** 1) Necesito / Puedo → 2) Agua / Alimentos / … → 3) ciudad (GPS opcional o chip) → 4) WhatsApp opcional → publicar. Texto libre opcional con placeholder. Eso ya cabe en el modelo `Need`.

**No hacer:** un bot conversacional con modelo de lenguaje que “entienda” la emergencia. Es caro, alucina, y choca con “no inventar afirmaciones”.

### 3. Webchat “1. Helpme 2. Help → 1 agua 2 alimentos”

**Viabilidad:** media. Es la misma idea que (2) con otra piel.

**Cómo:** pantalla de chips numerados (accesible, grande). No hace falta WebSocket ni WhatsApp Business API.

**Cuándo:** después de unificar el muro (P0). Si el muro + 3 toques basta, el “chat” es cosmética.

### 4. Botón SOS / emergencia + GPS a un servidor nuestro

**Qué piden:** un toque manda ubicación y “pide ayuda”.

**Viabilidad de un SOS verdadero (nosotros recibimos y alertamos):** **baja y peligrosa.** No somos línea 123, Cruz Roja ni UNGRD. Si el botón parece despacho, alguien deja de llamar al 123. Constitution I, IX, VIII (no guardar ubicación precisa sin necesidad).

**Cómo sí:** botón enorme **Llamar 123** (`tel:123`, ya existe en home, hoy es un enlace discreto). Segundo toque opcional: “Compartir mi ubicación por WhatsApp” abre `wa.me` con un texto y coords **hacia un contacto que elija la persona**, no hacia nuestra DB.

**GPS nuestro:** solo para “avisos cerca de mí” / pin en mapa, con permiso explícito, sin track continuo.

### 5. Botón que dispare alarma; el celular “indique por dónde buscar”

**Viabilidad:** **muy baja en web/PWA.** El navegador no puede forzar volumen, linterna ni modo SOS del sistema con fiabilidad (iOS/Android lo reservan a nativo). Una alarma en pestaña en segundo plano no sirve bajo escombros.

**Alternativa honesta:** en copy, enlazar a funciones del teléfono (SOS de emergencia del sistema, linterna). No prometamos sirena desde esta web.

App nativa (Play/App Store) = otro producto, no Fase 10.

### 6. Dejar WhatsApp y que la conversación sea ahí

**Ya está:** avisos y mascotas tienen WhatsApp opcional y deep-link. Reforzar el copy: “Nosotros no chateamos contigo; te conectamos.”

**No hacer:** bandeja de mensajes en la app (intermediarios, moderación, retención de datos).

### 7. “En la web el link se olvida” → hay que ser app

**Viabilidad:** media, **sin tiendas**. Ya es PWA (`display: standalone`) pero el manifest **no tiene iconos**, así que “Añadir a inicio” se ve mal o no invita.

**Cómo:** iconos 192/512, un banner “Instalar en el teléfono” en móvil, `start_url` al home. Offline de verdad = Fase **12** (opcional).

### 8. Batería a punto de morir

**Viabilidad:** media, mejoras concretas: hero de Unsplash pesado, menos peticiones al abrir, mapa no cargar hasta que se pida, evitar animaciones. No hace falta un modo “ahorro” con switch si recortamos lo gordo.

### 9. Mirar apps parecidas (p. ej. “Torre Negra”)

**Viabilidad:** sí investigar (constitution: integrar antes de construir). **No copiar** un centro de mando ni donaciones.

**Qué mirar:** tiempo hasta la primera acción, tamaño de botones, si mandan a 123, si piden cuenta.

---

## “Lo que ya está en movimiento”

No es un ticker animado: es un **título de marketing** sobre cuatro números de la API. Quien no conoce el proyecto lee “¿qué se está moviendo? ¿un operativo?”.

Los números actuales (avisos, lugares, alertas, fuentes) son honestos si salen de la API, pero las etiquetas son de equipo interno.

**Propuesta de copy (sin inventar cifras):**

| Hoy | Más claro |
|-----|-----------|
| Lo que ya está en movimiento | **Ahora mismo en la plataforma** |
| Avisos de la comunidad | **Avisos abiertos** (necesito / puedo aportar) |
| Lugares en el directorio | **Puntos para ayudar o pedir** (acopios, salud, etc.) |
| Alertas oficiales cargadas | **Alertas oficiales en el mapa** (p. ej. ríos / IDEAM) |
| Fuentes activas o en prueba | **Fuentes de datos conectadas** |

Nota al pie: *“Cifras de lo publicado aquí. No son un reporte de la UNGRD. Avisos de personas: sin verificar.”*

Si un número es 0 o muy bajo, no lo disfracemos: “Aún pocos avisos — publica el primero.”

---

## Menú en móvil (dos líneas)

**Causa:** el botón `.burger` usa `display: inline-flex` (fila) y **dos** `<span>` de 14px y 10px. El segundo tiene `margin-top: -6px` pensado para apilar, pero en flex-row quedan **dos rayas horizontales lado a lado** + la palabra “Menú”.

**Corrección:** contenedor del icono en columna (3 barras iguales), `aria-label="Abrir menú"`, texto “Menú” opcional o solo icono. Área táctil ≥ 44px. Cerrar al elegir un enlace (ya ocurre).

---

## Otras mejoras que vale incluir

1. **Home más corta en móvil:** hero a pantalla completa + stats + tres caminos + 123; “Qué es” y listado de fuentes más abajo o en `/origenes`.
2. **Quitar o aislar avisos DEMO** en producción (`buscar-page` mezcla ejemplos con API).
3. **Iconos PWA** vacíos en `manifest.webmanifest`.
4. **CORS / dominio:** ops, no producto; cuando cambie la URL del front, actualizar `API_CORS_ORIGIN` en Render.
5. **Fotos de mascota / lugar:** ya está en backlog del roadmap (fases 3 y 8); no es el primer corte.
6. **Recordar enlace `/cerrar`:** localStorage + “copiar” más visible (fase 9 del roadmap).
7. **Contraste del botón SOS** en el hero (hoy gris sobre foto).
8. **Nav:** “¿Qué necesitas?” es largo en móvil; “Avisos” o “Pedir / dar” si el menú sigue apretado.

---

## Explicitamente OUT (no entra en este corte)

| Idea | Por qué |
|------|---------|
| Centralita SOS con GPS en nuestra DB | Parecemos autoridad; riesgo legal y de falsa expectativa |
| Alarma / linterna / “busca aquí” del sistema | Web no puede; nativo = otro producto |
| Chat interno o WhatsApp Business como cola | Intermediamos; constitution X |
| Recaudar donaciones | Constitution IX–X |
| Base propia de desaparecidos | Constitution + Fase 7 = solo RND |
| App en Play Store como requisito | PWA primero; tiendas después si hay uso |

---

## Cómo se implementa (cuando se autorice)

1. Hotfix menú (P0).  
2. Muro `/buscar` al estilo `/perdidos` (P0).  
3. Copy de stats (P1).  
4. Publicar en 3 toques (P1).  
5. SOS = 123 + compartir ubicación por WhatsApp (P2).  
6. Iconos + prompt PWA (P2).

Si el comportamiento de `/buscar` se considera más que un hotfix, actualizar `specs/001-mvp-mapa-ayuda/spec.md` (flujo: ver lista **antes** de publicar) y luego el código.

Roadmap canónico: [`ROADMAP-FASES.md`](ROADMAP-FASES.md) (tabla “Mejoras posibles”).
