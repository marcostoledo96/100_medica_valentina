# 05 — Modelo de datos y contenido

## 1. Regla de Oro y Arquitectura de Datos

El contenido debe poder cambiarse sin editar componentes.

Los componentes consumen datos tipados/validados desde `src/content/`; **nunca** contienen biografía, frases, fechas, URLs de fotos o mensajes personales hardcodeados dentro del JSX.

### Ubicación del código y contratos
- **Schemas Zod:** `src/domain/schemas/*.schema.ts` (exportan schemas y tipos inferidos con `z.infer`).
- **Tipos de Dominio:** `src/domain/types/index.ts` (re-exporta los tipos TypeScript derivados directamente de Zod, sin duplicación manual).
- **Módulos de Contenido:** `src/content/*.ts` (contiene fixtures y datos desacoplados validados con sus respectivos schemas).
- **Validación Central:** `src/content/index.ts` (construye el objeto compuesto `ExperienceContent`, ejecuta `validateExperienceContent()` y exporta `experienceContent` validado en tiempo de carga con `ContentValidationError` accionable).

### Convención de Assets Locales
- **Imágenes:** Deben iniciar con `/images/` y tener extensión válida (`.webp`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.gif`, `.avif`).
- **Audios:** Deben iniciar con `/audio/` y tener extensión válida (`.mp3`, `.m4a`, `.wav`, `.ogg`, `.aac`, `.webm`).
- No se admiten URLs externas arbitrarias ni strings vacíos. Todo asset faltante se modela como campo opcional (`.optional()`).
- Todo elemento de imagen/captura exige obligatoriamente texto alternativo (`alt`) no vacío para accesibilidad (WCAG 2.2 AA).

### Cómo agregar o modificar contenido
1. Editar o agregar los datos en el módulo correspondiente de `src/content/` (ej. `timeline.ts`, `memories.ts`).
2. Si se agregan nuevos campos o variantes, actualizar primero el schema Zod correspondiente en `src/domain/schemas/`.
3. Ejecutar los tests con `npm test` para asegurar que el contenido cumple con todas las restricciones de validación (unión discriminada, unicidad de IDs, formato de assets, etc.).

## 2. Profile

```ts
type Profile = {
  firstName: string;
  fullName: string;
  startYear: number;
  graduationYear: number;
  portrait: string;
  status: string;
  diagnosis: string;
  prognosis: string;
};
```

## 3. Timeline

```ts
type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  description: string;
  category:
    | "academic"
    | "personal"
    | "hospital"
    | "funny"
    | "milestone";
  image?: string;
  quote?: string;
};
```

## 4. Stat

```ts
type Stat = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  format: "number" | "percentage" | "text" | "progress";
  note?: string;
  humorous?: boolean;
};
```

## 5. Gallery item

```ts
type GalleryItem = {
  id: string;
  image: string;
  date?: string;
  title: string;
  finding?: string;
  caption?: string;
  alt: string;
};
```

## 6. Team member

```ts
type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo?: string;
  message: string;
};
```

## 7. Memory

La implementación debe usar una unión discriminada por `type` para impedir estados imposibles.

Referencia conceptual:

```ts
type Memory =
  | { id: string; type: "photo"; src: string; alt: string; date?: string; rotation?: number }
  | { id: string; type: "screenshot"; src: string; alt: string; date?: string; rotation?: number }
  | { id: string; type: "note"; text: string; date?: string; rotation?: number }
  | { id: string; type: "text"; text: string; date?: string; rotation?: number }
  | { id: string; type: "sticker"; src: string; alt?: string; rotation?: number };
```

`rotation` es sólo decorativo. La lectura nunca depende de una transformación extrema.

## 8. Quiz

```ts
type QuizQuestion = {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    reaction: string;
  }[];
};
```

No es necesario que exista una respuesta “correcta”.

## 9. Achievement

```ts
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  secret: boolean;
  trigger: string;
};
```

## 10. Audio message

```ts
type AudioMessage = {
  id: string;
  author: string;
  title?: string;
  src: string;
  duration?: number;
};
```

## 11. Finale

```ts
type Finale = {
  headline: string;
  message: string[];
  image: string;
  date: string;
};
```

## 12. Ciclo de contenido preview-first

No es necesario reunir todo el contenido real antes de desarrollar la experiencia.

### Etapa A — Fixtures de M0/M1

Crear fixtures mínimos, válidos y claramente demo/provisionales para poder construir schemas, layout y vertical slice.

Los fixtures **no deben inventar biografía real**.

### Etapa B — Preview

La primera preview puede combinar:

- datos confirmados;
- contenido provisional marcado internamente;
- placeholders intencionales.

La preview existe para descubrir qué falta, no para aparentar que todo está terminado.

### Etapa C — Feedback y recolección dirigida

Después de mostrar la preview, preguntar a grupos concretos únicamente por el material que mejora secciones reales:

- compañeros de Medicina → timeline, materias, hospitales, hábitos, frases y fotos académicas;
- familia → origen de la vocación, infancia/adolescencia, orgullo y mensaje final;
- pareja → hábitos/frases, fotos significativas, música y mensaje reservado;
- scouts → personalidad, historias antiguas, fotos y chistes internos;
- secundaria → transición adolescente → CBC/Medicina;
- Esnaola/música → faceta creativa, música, fotos y recuerdos fuera de Medicina.

### Etapa D — Contenido real progresivo

Reemplazar fixtures por contenido real sin esperar a tener el 100% del material.

### Etapa E — Freeze

Antes de producción:

- eliminar placeholders;
- resolver o descartar todo lo provisional;
- corregir hechos/datos dudosos;
- validar schemas completos;
- revisar assets rotos.

## 13. Estado editorial

Durante la producción puede mantenerse, fuera de la UI final, un inventario simple:

```text
confirmado
provisional
pendiente
```

Este estado puede vivir en documentación/checklists y **no necesita formar parte del schema público de runtime**.

Reglas:

- `confirmado`: puede entrar a producción.
- `provisional`: puede aparecer en preview sólo si queda claro internamente que debe revisarse.
- `pendiente`: usar placeholder o directamente omitir la sección/dato.

Nunca mostrar “PREGUNTA A CORROBORAR” al usuario final.

## 14. Objetivo de contenido para versión completa

No es requisito para la primera preview. Sí es una referencia para M5–M7:

- [ ] nombre visible
- [ ] año de inicio y egreso
- [ ] retrato principal
- [ ] 8–15 momentos timeline
- [ ] 15–30 fotografías útiles
- [ ] 5–10 personas/grupos representativos en equipo tratante
- [ ] 8–20 recuerdos scrapbook
- [ ] 4–8 estadísticas
- [ ] 3–5 preguntas trivia
- [ ] 6–10 achievements
- [ ] mensaje final
- [ ] música opcional
- [ ] audios opcionales

Estos números son orientativos. La calidad narrativa tiene prioridad sobre llenar cuotas.

## 15. Curación

### Fotos

Elegir:

- momentos distintos;
- diferentes etapas;
- personas importantes;
- calidad suficiente;
- fotografías que cuenten algo.

Preferir 15 fotos con historia a 50 casi iguales.

### Timeline

Preferible 10 hitos excelentes que 40 irrelevantes.

### Mensajes

Máximo recomendado por tarjeta/modal: 50–80 palabras, salvo el contenido reservado para el cierre.

### Audios

Referencia: 15–30 segundos. Deben sonar naturales, no como discursos formales.

## 16. Publicación de fotos y capturas

La versión final es pública e indexable y las fotos aportadas al proyecto se consideran aptas para publicación según la decisión del PO.

Aun así, antes del freeze revisar capturas/fotos para evitar mostrar por accidente:

- números de teléfono;
- información de pacientes;
- datos de terceros no relacionados;
- contenido claramente ajeno al homenaje.

No bloquear la recolección por una política de privacidad más estricta que la decisión de producto vigente.

## 17. Naming de assets

```text
timeline-2022-primer-hospital.webp
gallery-001.webp
team-mama.webp
memory-chat-final.webp
audio-amiga-lucia.m4a
```

Evitar nombres crudos como:

```text
IMG_20260824_143721.jpg
WhatsApp Image 2026...
```

## 18. Alt text

Describir la fotografía, no el archivo.

Bien:

> Valentina y tres amigas con guardapolvo frente a la Facultad.

Mal:

> Foto 7.

## 19. Regla de corroboración

No todas las preguntas pendientes merecen investigación.

Corroborar primero lo que cambia la narrativa:

1. por qué/cuándo eligió Medicina;
2. hitos realmente memorables de la carrera;
3. frases/latiguillos auténticos;
4. hábitos de estudio propios;
5. fotos académicas clave;
6. música o símbolos relevantes;
7. mensaje final.

Los detalles que no mejoran una sección concreta pueden quedar fuera del proyecto.
