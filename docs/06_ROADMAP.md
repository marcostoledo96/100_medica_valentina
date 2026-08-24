# 06 — Roadmap

## Estrategia

Construir primero la **columna vertebral narrativa**.

No empezar por easter eggs, efectos, backend ni por una recolección exhaustiva de contenido.

El flujo canónico es:

```text
Foundation
→ Vertical slice
→ Preview Gate
→ Feedback + recolección dirigida
→ Story / Memories / Delight
→ Finale
→ Hardening
→ Freeze
→ Release
```

---

# Fase 0 — Fundación

### Objetivo

Repo listo para desarrollar.

### Entregables

- Vite + React;
- TypeScript strict;
- lint/format;
- testing;
- CI;
- estructura;
- content schemas/fixtures;
- metadata inicial.

### Exit criteria

`main` puede desplegar una aplicación mínima pero saludable.

---

# Fase 1 — Vertical slice

### Objetivo

Probar el concepto completo con contenido mínimo.

Construir:

1. shell narrativo;
2. Boot;
3. Expediente;
4. una transición mínima de historia;
5. Diagnóstico;
6. Finale provisional.

No hace falta tener todavía fotos, mensajes, audios, timeline real completo ni trivia final.

### Razón

Permite validar el ritmo y la dualidad clínica → humana antes de fabricar todas las features o pedir material a mucha gente.

### Exit criteria

Puede recorrerse desde inicio a final en teléfono y está listo para convertirse en preview.

---

# Preview Gate — Issue #27

### Objetivo

Publicar la primera preview en Vercel y usarla como herramienta de investigación.

### Entregables

- URL compartible;
- recorrido mobile funcional;
- inventario de contenido `confirmado / provisional / pendiente`;
- feedback de colaboradores;
- lista de huecos por sección;
- preguntas dirigidas según grupo/persona;
- primera ronda de fotos, recuerdos, mensajes y audios.

### Regla

La preview puede usar fixtures/placeholders controlados.

No completar huecos inventando biografía.

### Exit criteria

Los colaboradores pueden ver la idea y responder **qué falta concretamente** en vez de contestar una entrevista abstracta.

El Preview Gate no bloquea que el desarrollo técnico de M2–M5 continúe con fixtures mientras llega el contenido real.

---

# Fase 2 — Historia

Construir:

- anamnesis;
- timeline completo;
- signos vitales;
- galería.

Contenido real se incorpora progresivamente a partir del feedback de #27.

### Exit criteria

La carrera ya se entiende aunque todavía falten features sociales o algunos assets definitivos.

---

# Fase 3 — Personas y recuerdos

Construir:

- equipo tratante;
- scrapbook;
- mensajes;
- audios opcionales.

La preview previa debe orientar qué personas/grupos y qué tipo de material pedir.

### Exit criteria

La experiencia deja de sentirse genérica y reconoce distintas etapas de la vida de Valen, no sólo Medicina.

---

# Fase 4 — Juego y sorpresa

Construir:

- trivia;
- achievements;
- easter eggs;
- microinteracciones.

Priorizar chistes internos y hechos reales obtenidos durante la recolección. No usar clichés médicos sólo para llenar esta fase.

### Exit criteria

La web tiene elementos descubribles sin distraer del relato.

---

# Fase 5 — Epicrisis y final

Pulir:

- epicrisis;
- diagnóstico;
- transición visual;
- música;
- finale;
- confetti;
- revisita.

### Exit criteria

El último 20% tiene ritmo emocional coherente y ya utiliza contenido suficientemente maduro.

---

# Fase 6 — Hardening

Trabajar:

- accesibilidad;
- performance;
- cross-browser;
- imágenes;
- reduced motion;
- fallbacks;
- metadata/SEO;
- canonical;
- social preview;
- producción **indexable**.

### Exit criteria

Todos los gates de calidad pasan.

---

# Fase 7 — Freeze + Release

### Freeze de contenido

- resolver feedback pendiente de #27;
- eliminar fixtures/placeholders;
- revisar hechos provisionales;
- validar fotos, mensajes, audios y captions;
- build candidata.

### Release

- dominio/URL final de Vercel;
- canonical;
- indexación habilitada;
- QR;
- prueba con teléfonos reales;
- release tag;
- backup.

### Exit criteria

QR físico apunta a producción estable e indexable.

---

## Milestones

| Milestone | Contenido |
|---|---|
| M0 — Foundation | Fase 0 |
| M1 — Prototype | Vertical slice + Preview Gate #27 |
| M2 — Story | Fase 2 |
| M3 — Memories | Fase 3 |
| M4 — Delight | Fase 4 |
| M5 — Finale | Fase 5 |
| M6 — Release Candidate | Fase 6 |
| M7 — Celebration | Freeze + Release |

## Dependencias críticas

```text
#1 Foundation
   ↓
#2 Design system + #3 Content contracts
   ↓
#4–#7 Vertical slice
   ↓
#27 Preview Gate
   ├──────────────→ feedback / recolección de contenido
   │
   └──────────────→ M2–M5 desarrollo técnico con fixtures
                       ↓
                 contenido real progresivo
                       ↓
                 Hardening + #26 Freeze
                       ↓
                    #25 Release
```

## Definition of Done global

Una issue está terminada cuando:

- comportamiento implementado;
- responsive mobile;
- accesibilidad básica;
- tests acordes;
- no rompe reduced motion;
- contenido no hardcodeado si corresponde;
- lint/typecheck/build pasan;
- no inventa datos personales para cerrar visualmente la feature;
- documentación actualizada si cambió una decisión.

## Política de feedback

Los comentarios que surgen de la preview no se implementan automáticamente.

Clasificarlos como:

1. **bug / incumplimiento de spec** → corregir en la issue correspondiente;
2. **contenido faltante** → incorporar a la recolección dirigida;
3. **mejora de UX validada** → issue nueva o ajuste explícito de alcance;
4. **idea opcional** → backlog, no bloquear el MVP.
