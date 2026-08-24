# 06 — Roadmap

## Estrategia

Construir primero la **columna vertebral narrativa**.

No empezar por easter eggs, shaders, efectos o backend.

---

# Fase 0 — Fundación

### Objetivo

Repo listo para desarrollar.

### Entregables

- scaffold;
- TypeScript strict;
- lint/format;
- testing;
- CI;
- estructura;
- content schema;
- metadata inicial.

### Exit criteria

`main` puede desplegar una aplicación vacía pero saludable.

---

# Fase 1 — Vertical slice

### Objetivo

Probar el concepto completo con contenido mínimo.

Construir:

1. Boot.
2. Expediente.
3. Una entrada de timeline.
4. Diagnóstico.
5. Finale.

Sin pulir.

### Razón

Permite validar el ritmo antes de fabricar 10 features.

### Exit criteria

Puede recorrerse desde inicio a final en teléfono.

---

# Fase 2 — Historia

Construir:

- anamnesis;
- timeline completo;
- signos vitales;
- galería.

### Exit criteria

La carrera ya se entiende aunque no existan features sociales.

---

# Fase 3 — Personas y recuerdos

Construir:

- equipo tratante;
- scrapbook;
- mensajes;
- audios opcionales.

### Exit criteria

La experiencia deja de sentirse genérica.

---

# Fase 4 — Juego y sorpresa

Construir:

- trivia;
- achievements;
- easter eggs;
- microinteracciones.

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

El último 20% tiene ritmo emocional coherente.

---

# Fase 6 — Hardening

Trabajar:

- accesibilidad;
- performance;
- test cross-browser;
- imágenes;
- reduced motion;
- fallbacks;
- noindex;
- OG;
- seguridad básica.

### Exit criteria

Todos los gates de calidad pasan.

---

# Fase 7 — Release

- dominio;
- QR;
- prueba con teléfonos reales;
- backup;
- release tag;
- freeze de contenido.

### Exit criteria

QR físico apunta a producción estable.

---

## Orden recomendado de milestones

| Milestone | Contenido |
|---|---|
| M0 — Foundation | Fase 0 |
| M1 — Prototype | Fase 1 |
| M2 — Story | Fase 2 |
| M3 — Memories | Fase 3 |
| M4 — Delight | Fase 4 |
| M5 — Finale | Fase 5 |
| M6 — Release Candidate | Fase 6 |
| M7 — Celebration | Fase 7 |

## Dependencias críticas

```text
Foundation
   ↓
Content model
   ↓
Vertical slice
   ↓
Story
   ↓
Memories
   ↓
Finale
   ↓
Hardening
   ↓
Release
```

Trivia y achievements pueden desarrollarse en paralelo después del vertical slice.

## Definition of Done global

Una issue está terminada cuando:

- comportamiento implementado;
- responsive mobile;
- accesibilidad básica;
- tests acordes;
- no rompe reduced motion;
- contenido no hardcodeado si corresponde;
- lint/typecheck pasan;
- documentación actualizada si cambió una decisión.
