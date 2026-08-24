# 05 — Modelo de datos y contenido

## 1. Regla

El contenido debe poder cambiarse sin editar componentes.

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

```ts
type Memory = {
  id: string;
  type: "photo" | "note" | "screenshot" | "text" | "sticker";
  src?: string;
  text?: string;
  date?: string;
  alt?: string;
  rotation?: number;
};
```

`rotation` solo decorativo.

La lectura nunca debe depender de una transformación extrema.

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

## 12. Content checklist

Antes de desarrollo visual completo, reunir:

- [ ] nombre visible
- [ ] año de inicio
- [ ] fecha/año de finalización
- [ ] retrato principal
- [ ] 8–15 momentos timeline
- [ ] 15–30 fotografías
- [ ] 5–10 personas de equipo tratante
- [ ] 8–20 recuerdos scrapbook
- [ ] 4–8 estadísticas
- [ ] 3–5 preguntas trivia
- [ ] 6–10 achievements
- [ ] mensaje final
- [ ] música opcional
- [ ] audios opcionales

## 13. Curación

No subir todo.

### Fotos

Elegir:

- momentos distintos;
- diferentes etapas;
- personas importantes;
- calidad suficiente;
- fotografías que cuenten algo.

### Timeline

Preferible 10 hitos excelentes que 40 irrelevantes.

### Mensajes

Máximo recomendado por tarjeta:

50–80 palabras.

## 14. Privacidad

Clasificar cada asset:

- `public`;
- `friends-only`;
- `private`.

Aunque técnicamente todos estén en la misma build, esta clasificación obliga a revisar qué se publicará.

## 15. Metadatos sensibles

Eliminar EXIF de fotografías antes del deploy cuando contenga:

- ubicación;
- dispositivo;
- datos innecesarios.

## 16. Screenshots

Revisar capturas de WhatsApp.

Ocultar:

- teléfonos;
- nombres de terceros;
- información médica;
- información laboral sensible;
- datos personales no pertinentes.

## 17. Naming de assets

```text
timeline-2022-primer-hospital.webp
gallery-001.webp
team-mama.webp
memory-chat-final.webp
audio-amiga-lucia.m4a
```

No usar:

```text
IMG_20260824_143721.jpg
WhatsApp Image 2026...
```

## 18. Alt text

Describir la fotografía, no el archivo.

Bien:

> Ana y tres amigas con guardapolvo frente al Hospital de Clínicas.

Mal:

> Foto 7.
