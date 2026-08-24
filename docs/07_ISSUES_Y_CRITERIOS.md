# 07 — Backlog e issues

## 1. Fuente de verdad operativa

El backlog ya fue materializado como issues reales en GitHub.

A partir de este punto:

- este documento mantiene **mapa, orden y dependencias de alto nivel**;
- el cuerpo de cada GitHub Issue contiene la **spec operativa**, tareas, criterios de aceptación y evidencia requerida;
- no duplicar aquí specs extensas que puedan quedar desactualizadas.

Jerarquía para ejecutar una tarea:

1. `AGENTS.md`;
2. GitHub Issue real;
3. documentación de dominio/arquitectura aplicable;
4. este mapa de backlog.

Si una issue y este documento divergen, corregir la documentación o la issue de forma explícita; no elegir silenciosamente una interpretación.

Repositorio de issues:

`https://github.com/marcostoledo96/100_medica_valentina/issues`

## 2. Labels lógicos

Mientras no estén materializados todos los labels/milestones del repositorio, conservar esta taxonomía en el cuerpo de las issues:

```text
type:feature
type:chore
type:test
type:content
type:design
area:core
area:story
area:media
area:accessibility
area:performance
priority:p0
priority:p1
priority:p2
```

## 3. Backlog sincronizado

### M0 — Foundation

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#1](https://github.com/marcostoledo96/100_medica_valentina/issues/1) | P0 | Inicializar aplicación React/Vite y quality gates | — |
| [#2](https://github.com/marcostoledo96/100_medica_valentina/issues/2) | P0 | Implementar sistema de diseño mobile-first y tokens | #1 |
| [#3](https://github.com/marcostoledo96/100_medica_valentina/issues/3) | P0 | Definir schemas Zod y content layer desacoplado | #1 |

### M1 — Prototype + Preview Gate

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#4](https://github.com/marcostoledo96/100_medica_valentina/issues/4) | P0 | Implementar shell narrativo y progreso | #1, #2, #3 |
| [#5](https://github.com/marcostoledo96/100_medica_valentina/issues/5) | P0 | Implementar boot y apertura del expediente | #3, #4 |
| [#6](https://github.com/marcostoledo96/100_medica_valentina/issues/6) | P0 | Implementar expediente principal | #2, #3, #4 |
| [#7](https://github.com/marcostoledo96/100_medica_valentina/issues/7) | P0 | Implementar vertical slice del finale | #4, #5, #6 |
| [#27](https://github.com/marcostoledo96/100_medica_valentina/issues/27) | P0 | Publicar preview M1 y coordinar recolección dirigida | #1–#7 |

### M2 — Story

| # | Prioridad | Issue | Dependencias técnicas mínimas |
|---:|:---:|---|---|
| [#8](https://github.com/marcostoledo96/100_medica_valentina/issues/8) | P1 | Implementar anamnesis | #2, #3, #4 |
| [#9](https://github.com/marcostoledo96/100_medica_valentina/issues/9) | P0 | Implementar timeline de evolución | #2, #3, #4 |
| [#10](https://github.com/marcostoledo96/100_medica_valentina/issues/10) | P1 | Implementar dashboard de signos vitales | #2, #3, #4 |
| [#11](https://github.com/marcostoledo96/100_medica_valentina/issues/11) | P0 | Implementar galería “Estudios complementarios” | #2, #3, #4 |

**Nota:** #8–#11 pueden implementarse con fixtures mientras #27 genera contenido real. La falta de material definitivo no bloquea el trabajo técnico.

### M3 — Memories

| # | Prioridad | Issue | Dependencias técnicas mínimas |
|---:|:---:|---|---|
| [#12](https://github.com/marcostoledo96/100_medica_valentina/issues/12) | P0 | Implementar equipo tratante | #2, #3, #4 |
| [#13](https://github.com/marcostoledo96/100_medica_valentina/issues/13) | P0 | Implementar scrapbook digital | #2, #3, #4 |
| [#14](https://github.com/marcostoledo96/100_medica_valentina/issues/14) | P1 | Implementar mensajes de audio | #2, #3, #4 |

Contenido definitivo de estas features debe beneficiarse de la recolección iniciada en #27.

### M4 — Delight

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#15](https://github.com/marcostoledo96/100_medica_valentina/issues/15) | P1 | Implementar trivia interactiva | #2, #3, #4 |
| [#16](https://github.com/marcostoledo96/100_medica_valentina/issues/16) | P1 | Implementar motor de achievements | #3, #4 |
| [#17](https://github.com/marcostoledo96/100_medica_valentina/issues/17) | P2 | Implementar easter eggs | #16 + features trigger |

Trivia/achievements/easter eggs deben preferir hechos y chistes internos descubiertos durante feedback, no clichés genéricos.

### M5 — Finale

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#18](https://github.com/marcostoledo96/100_medica_valentina/issues/18) | P0 | Implementar epicrisis | M2/M3 suficientemente maduros |
| [#19](https://github.com/marcostoledo96/100_medica_valentina/issues/19) | P0 | Implementar finale definitivo | #7, #18 |
| [#20](https://github.com/marcostoledo96/100_medica_valentina/issues/20) | P1 | Implementar control global de sonido | #14, #19 |

### M6 — Release Candidate

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#21](https://github.com/marcostoledo96/100_medica_valentina/issues/21) | P0 | Auditar accesibilidad WCAG 2.2 AA | features principales |
| [#22](https://github.com/marcostoledo96/100_medica_valentina/issues/22) | P0 | Auditar performance y Web Vitals | features principales |
| [#23](https://github.com/marcostoledo96/100_medica_valentina/issues/23) | P0 | Implementar E2E del recorrido principal | recorrido crítico completo |
| [#24](https://github.com/marcostoledo96/100_medica_valentina/issues/24) | P1 | Configurar metadata, indexación y social preview | #19 + URL final suficientemente definida |

Decisión vigente: **producción es indexable**. Preview/development no deben actuar como canonical.

### M7 — Celebration

| # | Prioridad | Issue | Dependencias |
|---:|:---:|---|---|
| [#26](https://github.com/marcostoledo96/100_medica_valentina/issues/26) | P0 | Realizar freeze y auditoría del contenido final | #27 + contenido principal |
| [#25](https://github.com/marcostoledo96/100_medica_valentina/issues/25) | P0 | Realizar deploy productivo y generar QR | #21–#24, #26 |

## 4. Ruta crítica actual

```text
#1
├── #2
└── #3
     ↓
#4 → #5/#6 → #7
              ↓
             #27
          ┌───┴─────────────┐
          │                 │
feedback/contenido      M2–M5 código
          │                 │
          └──────┬──────────┘
                 ↓
          M6 hardening
                 ↓
             #26 freeze
                 ↓
             #25 release
```

## 5. Política de refinamiento SDD

Antes de pasar una issue a un agente ejecutor:

1. leer el cuerpo real de la issue;
2. confirmar dependencias completadas o justificar por qué puede ejecutarse en paralelo;
3. definir/confirmar schemas Zod cuando haya dominio/contenido;
4. definir props de componentes desacopladas;
5. definir fixtures mínimos si el contenido real todavía no existe;
6. fijar criterios verificables mobile/accessibility/tests;
7. prohibir hardcoding de biografía en JSX;
8. exigir receipts de quality gates.

## 6. Regla preview-first

No crear nuevas mega-issues de “completar todo el contenido”.

El contenido se incorpora por sección después de #27. Si una ronda de feedback descubre algo nuevo:

- si completa una feature existente → trabajar en su issue;
- si corrige un hecho → content change acotado;
- si agrega una feature real → nueva issue independiente;
- si es sólo una idea opcional → backlog, sin bloquear MVP.

## 7. Definition of Done global

Además de los criterios propios de cada GitHub Issue:

- responsive mobile 360–430 px;
- accesibilidad coherente con WCAG 2.2 AA;
- reduced motion;
- contenido desacoplado;
- cero datos inventados presentados como hechos;
- tests acordes al riesgo;
- lint/typecheck/build verdes;
- documentación actualizada si cambia una decisión.
