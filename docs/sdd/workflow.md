# Workflow SDD — Ayuda en Emergencias

Basado en SDD-MASTER. Tooling: **Markdown en repo** (sin CLI obligatorio).

## Loop

```text
Constitution → Specify → Clarify → Plan → Checklist → Tasks → Analyze → Implement → Converge
```

## Onboarding rápido

- Humanos: [`COMO-EMPEZAR.md`](COMO-EMPEZAR.md) + [`../MAPA-DEL-REPO.md`](../MAPA-DEL-REPO.md)  
- Agentes: [`../../AGENTS.md`](../../AGENTS.md)

## Dónde vive cada artifact

| Artifact | Ruta |
|----------|------|
| Constitution | `.specify/memory/constitution.md` |
| Feature spec | `specs/NNN-nombre/spec.md` |
| Plan técnico | `specs/NNN-nombre/plan.md` |
| Tasks | `specs/NNN-nombre/tasks.md` |
| Data model | `specs/NNN-nombre/data-model.md` |
| Research | `specs/NNN-nombre/research.md` |
| Contratos API | `specs/NNN-nombre/contracts/` |
| ADRs | `docs/architecture/adr/` |
| Mapa front/back/infra | `docs/MAPA-DEL-REPO.md` |

## Reglas

1. **Specify** = comportamiento (qué/por qué). Sin detalle de librerías salvo constraints ya fijados en constitution.  
2. **Plan** = cómo (stack, carpetas, esquemas). Debe pasar Constitution Check.  
3. **Tasks** = unidades ordenadas con paths.  
4. Si el output es incorrecto → arreglar spec/plan, no solo parchear código.  
5. No backfill de specs futuras: una feature a la vez.  
6. Hotfix trivial → no ciclo completo.  

## Gate humano (obligatorio)

Antes de escribir código de producto del slice:

- [ ] Spec con IN/OUT, aceptación, edge cases  
- [ ] Ambigüedades cerradas  
- [ ] Plan alineado a constitution  
- [ ] Tasks revisadas  
- [ ] Analyze mental: sin contradicciones graves  

## Naming de features

```text
001-mvp-mapa-ayuda
002-moderacion
003-donaciones-oficiales
…
```

Flow-forward: cada cambio grande = carpeta nueva. Living spec solo si el mismo contrato sigue activo.
