# Prompt de Auditoría: Issue #3 & Pull Request #31

> **Destinatario:** ChatGPT Pro (Orquestador, Arquitecto de Producto y Auditor de Calidad).  
> **Proyecto:** `%100 médica` (`https://github.com/marcostoledo96/100_medica_valentina`).  
> **PR a Auditar:** [#31 — feat(content): implement zod schemas and decoupled content layer](https://github.com/marcostoledo96/100_medica_valentina/pull/31).  
> **Issue Asociada:** [#3 — Definir schemas Zod y content layer desacoplado](https://github.com/marcostoledo96/100_medica_valentina/issues/3).  
> **SHA del Commit:** `fab9d0fb62e127155b59d9a6da8b01aed8aa9807`.

---

## Instrucciones para la Sesión de Auditoría

Copia y pega el siguiente prompt íntegro en una nueva sesión de ChatGPT Pro para realizar la auditoría de arquitectura, calidad y decisión de merge:

```markdown
Actuá como Principal Frontend Architect, Auditor de Calidad y Orquestador de Producto del proyecto "%100 médica" (https://github.com/marcostoledo96/100_medica_valentina).

Tu responsabilidad en esta sesión es auditar de forma rigurosa y adversaria la implementación de la **Issue #3** plasmada en la **Pull Request #31** (`feat/issue-3-content-layer` -> `main`) y emitir un veredicto definitivo:
**¿ESTÁ APTO PARA MERGE A MAIN? (APPROVED / CHANGES REQUESTED / BLOCKED)**.

---

### 1. CONTEXTO Y FUENTES DE AUTORIDAD

1. **`AGENTS.md`**: Topología de agentes, separación estricta de responsabilidades (ChatGPT Auditor / Gemini Ejecutor / Marcos PO), convenciones de commits sin atribución de IA y regla de oro de contenido 100% desacoplado.
2. **Issue #3**: Crear el contrato de datos Zod y la capa de contenido (`src/content/`) desacoplada de React, con fixtures puramente demo/mock (cero datos reales de Valentina).
3. **`docs/05_MODELO_DE_DATOS_Y_CONTENIDO.md`**: Especificación de modelos, tipos, convención de assets locales y ciclo preview-first.
4. **`docs/07_ISSUES_Y_CRITERIOS.md`**: Backlog y criterios de aceptación.

---

### 2. RESUMEN DE LA IMPLEMENTACIÓN EN PR #31

- **Schemas Zod (`src/domain/schemas/`):**
  - `shared.schema.ts`: `IdSchema` (slug alfanumérico), `NonEmptyStringSchema` (rechaza whitespace), `LocalImagePathSchema` (`/images/...`), `LocalAudioPathSchema` (`/audio/...`), helper `hasUniqueIds`.
  - `profile.schema.ts`: `ProfileSchema` con validación `graduationYear >= startYear`.
  - `timeline.schema.ts`: `TimelineCategorySchema`, `TimelineEntrySchema`, `TimelineCollectionSchema` (unicidad de IDs).
  - `stats.schema.ts`: `StatFormatSchema`, `StatSchema` (`value: number | string`), `StatCollectionSchema`.
  - `gallery.schema.ts`: `GalleryItemSchema` (exige `alt` obligatorio no vacío para accesibilidad), `GalleryCollectionSchema`.
  - `team.schema.ts`: `TeamMemberSchema` (foto local opcional, mensaje obligatorio), `TeamCollectionSchema`.
  - `memories.schema.ts`: `MemorySchema` usando `z.discriminatedUnion('type', ...)` sobre 5 variantes estrictas (`photo`, `screenshot`, `note`, `text`, `sticker`) con `.strict()` para impedir campos imposibles (ej. fotos con texto o notas con `src`). Restringe rotación decorativa a `[-45, 45]`.
  - `quiz.schema.ts`: `QuizOptionSchema`, `QuizQuestionSchema` (mínimo 2 opciones, unicidad de IDs de opciones), `QuizCollectionSchema`.
  - `achievements.schema.ts`: `AchievementSchema`, `AchievementCollectionSchema`.
  - `audio.schema.ts`: `AudioMessageSchema` (duración acotada), `AudioCollectionSchema`.
  - `finale.schema.ts`: `FinaleSchema` (párrafos de mensaje `min(1)`, imagen, fecha).
  - `experience.schema.ts`: `ExperienceContentSchema` que valida la experiencia completa de forma atómica.
  - `index.ts`: Re-exporta schemas y tipos inferidos.
- **Tipos de Dominio (`src/domain/types/index.ts`):**
  - Re-exporta exclusivamente tipos derivados mediante `z.infer<typeof Schema>` (cero interfaces manuales duplicadas).
- **Módulos de Contenido Demo (`src/content/`):**
  - `profile.ts`, `timeline.ts`, `stats.ts`, `gallery.ts`, `team.ts`, `memories.ts`, `quiz.ts`, `achievements.ts`, `audio.ts`, `finale.ts`.
  - Todos usan datos genéricos/demo (`Persona Demo`, `/images/demo/...`, `Hito Demo`). Ningún dato biográfico real inventado ni fotos reales.
- **Validación Centralizada (`src/content/index.ts`):**
  - Agrega los módulos y ejecuta `validateExperienceContent(rawExperienceContent)`.
  - Exporta `experienceContent` validado en runtime e inmutable.
  - Arroja `ContentValidationError` con detalle claro de cada issue si falla.
  - Ofrece `safeValidateExperienceContent()` para validación programática.
- **Suite de Tests (Vitest):**
  - 96 tests pasando en 13 suites cubriendo casos válidos, rechazo de whitespace, IDs duplicados, discriminated unions, campos imposibles, rutas de assets inválidas y límites numéricos.
- **Quality Gates:**
  - `npm run lint` -> 0 errores, 0 warnings.
  - `npm run format:check` -> OK (Prettier).
  - `npm run typecheck` -> OK (`tsc -b --noEmit`).
  - `npm test` -> 96/96 tests pasando.
  - `npm run build` -> Compilación Vite limpia.
  - `npm run test:e2e` -> Smoke tests Playwright pasando.

---

### 3. CHECKLIST DE AUDITORÍA REQUERIDO

Por favor, evaluá y respondé punto por punto:

1. **Arquitectura & Desacoplamiento:**
   - ¿Cumple con la separación `Zod schema → z.infer → fixture/content → validación → consumidor`?
   - ¿Se evitó duplicar interfaces TypeScript manualmente?
   - ¿Queda la UI 100% independiente del contenido narrativo?

2. **Modelado Zod & Anti-Estados Imposibles:**
   - ¿El `MemorySchema` resuelve correctamente las variantes mediante `z.discriminatedUnion` y previene campos cruzados inválidos?
   - ¿Las restricciones de formato de assets locales (`/images/...`, `/audio/...`) son seguras y consistentes?
   - ¿Se previene la existencia de strings vacíos o compuestos sólo de whitespace?
   - ¿Se valida la unicidad de IDs en todas las colecciones?

3. **Accesibilidad & Calidad:**
   - ¿Se exige `alt` descriptivo obligatorio en imágenes/galería/memorias visuales?
   - ¿Las restricciones numéricas (años de carrera, duración de audio, rotación de scrapbook) son sólidas?

4. **Privacidad & Cero Datos Reales:**
   - ¿Los fixtures son inequívocamente mocks/placeholders reemplazables y no contienen biografía real de Valentina?

5. **Cobertura de Tests:**
   - ¿Los tests prueban comportamiento negativo y defensivo o sólo casos felices?

6. **Git Discipline:**
   - ¿El commit sigue Conventional Commits sin mención de autoría de IA?

---

### 4. FORMATO DEL REPORTE DE AUDITORÍA

Tu respuesta debe estructurarse así:

1. **Veredicto Final:** `[APPROVED PARA MERGE]` / `[CHANGES REQUESTED]` / `[BLOCKED]`
2. **Análisis Técnico Detallado:** Evaluación por sección del checklist.
3. **Puntos Fuertes Destacados:** Aspectos de excelencia en la arquitectura o modelado.
4. **Observaciones o Recomendaciones Menores (si existen):** Sugerencias no bloqueantes para issues subsiguientes (ej. M1 / #4).
5. **Instrucciones para el PO (Marcos):** Confirmación para proceder al merge en GitHub o pasos requeridos.
```
