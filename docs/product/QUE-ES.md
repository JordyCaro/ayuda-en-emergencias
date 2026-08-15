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

1. Trae **alertas / datos oficiales** cuando hay API legal y viable (IDEAM, SISPRO/REPS, etc.).  
2. Deja publicar **avisos** de necesidad u oferta (WhatsApp opcional): son **señales**, no tickets.  
3. **Quiero ayudar**: ver avisos NEED y lugares/orgs con canal externo (sin matching laboral).  
4. Muestra **de dónde sale cada dato** (Fuentes).  
5. Más adelante: donación **solo como enlace** a terceros (Fase 5).

---

## Qué no hacemos (importante)

| No hacemos | Por qué |
|------------|---------|
| Cobrar / recibir donaciones | No somos intermediarios financieros ni de especie |
| Asignar voluntarios / turnos | Solo enlazamos; el contacto es entre personas/orgs |
| Prometer que “la ayuda llega” | Un aviso no es un ticket de servicio |
| Inventar emergencias ni cifras | Solo datos con fuente o avisos no verificados |
| Reemplazar al 123 / UNGRD / Cruz Roja | Derivamos a canales oficiales |

---

## Superficie actual (fases 0–4)

| Pieza | Ruta | Qué hace |
|-------|------|----------|
| **Inicio** | `/` | Qué es, utilidad, conteos reales, fuentes |
| **¿Qué necesitas?** | `/buscar` | Foro Necesito / Puedo aportar |
| **Quiero ayudar** | `/ayudar` | Avisos NEED + directorio de lugares |
| **Publicar punto** | `/publicar-punto` | Registro de acopio / org |
| **Fuentes** | `/fuentes-detalle` | Registry de fuentes |
| **API** | `:3000/api/v1` | NestJS + Swagger |

Nav: **¿Qué necesitas? · Quiero ayudar · Publicar · Fuentes**.

---

## Roadmap corto

| Fase | Idea | Estado |
|------|------|--------|
| **0–3** | Discovery → Places → registro lugares | Hechas |
| **4 / 003** | Quiero ayudar (enlace) | Hecha |
| **5** | Donación solo enlace a terceros | Pendiente |
| **6–9** | Densidad → deep-links → moderación → prod | Pendiente |
| **12** | Offline avanzado | Última, casi opcional |

Detalle: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)

---

## Documentos relacionados

- Roadmap: [`ROADMAP-FASES.md`](ROADMAP-FASES.md)  
- Cómo correr: [`../dev/COMO-CORRER.md`](../dev/COMO-CORRER.md)  
- Fuentes: [`../sources/source-registry.md`](../sources/source-registry.md)  
- Specs: `specs/001` · `002` · `003`  
- Constitution: [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md)  
