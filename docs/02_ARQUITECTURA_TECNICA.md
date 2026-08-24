# 02 — Arquitectura técnica

## 1. Objetivo técnico

Construir una experiencia:

- estática;
- rápida;
- tipada;
- fácil de mantener;
- desplegable en Vercel;
- con contenido desacoplado;
- sin infraestructura innecesaria.

## 2. Stack recomendado

### Frontend

- **Next.js con App Router**
- **React**
- **TypeScript estricto**
- **Tailwind CSS**
- **Motion / Framer Motion** para transiciones
- CSS nativo para efectos simples

### Validación de datos

- Zod o esquema equivalente

### Testing

- Vitest
- Testing Library
- Playwright

### Tooling

- ESLint
- Prettier
- TypeScript `strict`
- GitHub Actions

### Deploy

- Vercel

## 3. Por qué Next.js

Este proyecto no requiere SSR para funcionar, pero Next.js aporta:

- buen pipeline de imágenes;
- routing simple;
- metadata/OG;
- deploy trivial;
- estructura escalable;
- posibilidad de agregar funcionalidades server-side sin migración grande.

La aplicación debe mantenerse **static-first**.

## 4. Arquitectura lógica

```text
Presentation
│
├── scenes
├── shared UI
├── motion
└── layouts
     │
     ▼
Application
│
├── content selectors
├── progression
├── achievements
└── feature state
     │
     ▼
Domain
│
├── schemas
├── types
└── rules
     │
     ▼
Content
│
├── JSON / TS
├── images
├── audio
└── video
```

No es necesario implementar Clean Architecture ceremonial.

La separación tiene que servir al proyecto, no complicarlo.

## 5. Estructura propuesta

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── opengraph-image.*
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── boot/
│   ├── expediente/
│   ├── anamnesis/
│   ├── timeline/
│   ├── vitales/
│   ├── gallery/
│   ├── team/
│   ├── scrapbook/
│   ├── quiz/
│   ├── achievements/
│   ├── epicrisis/
│   └── finale/
│
├── content/
│   ├── profile.ts
│   ├── timeline.ts
│   ├── stats.ts
│   ├── team.ts
│   ├── memories.ts
│   ├── quiz.ts
│   ├── achievements.ts
│   └── finale.ts
│
├── domain/
│   ├── schemas/
│   └── types/
│
├── hooks/
├── lib/
├── styles/
└── test/
```

Assets:

```text
public/
├── images/
│   ├── profile/
│   ├── timeline/
│   ├── gallery/
│   ├── team/
│   └── scrapbook/
├── audio/
└── icons/
```

## 6. Estado

Mantener mínimo estado global.

Estado global justificable:

```ts
type ExperienceState = {
  introSeen: boolean;
  soundEnabled: boolean;
  unlockedAchievements: string[];
  completedQuiz: boolean;
};
```

Puede resolverse con:

- Context + reducer;
- Zustand si la complejidad crece.

No introducir Redux.

## 7. Persistencia

`localStorage` solo para:

- intro vista;
- achievements;
- sonido;
- progreso opcional.

Nunca debe ser necesario limpiar storage para volver a experimentar el sitio.

## 8. Contenido

Preferencia:

**TypeScript data modules validados en build.**

Ventajas:

- autocompletado;
- tipado;
- revisión por Git;
- cero runtime fetching.

Alternativa:

JSON + schema.

## 9. Imágenes

Requisitos:

- formatos modernos;
- `sizes` correcto;
- lazy loading;
- dimensiones conocidas;
- imágenes críticas optimizadas;
- placeholders.

No servir originales de 8–20 MB.

## 10. Audio

Carga bajo demanda.

No incluir todos los audios en el bundle inicial.

## 11. Animaciones

Reglas:

- animaciones de entrada < 700 ms salvo escenas especiales;
- evitar bloquear scroll;
- respetar `prefers-reduced-motion`;
- nada esencial depende de animación;
- máximo una animación protagonista por viewport.

## 12. Scrapbook

El scrapbook debe ser mobile-first.

Desktop puede incorporar drag libre.

Mobile:

- tarjetas táctiles;
- carrusel;
- expandir;
- pequeños elementos superpuestos;
- drag opcional, nunca obligatorio.

## 13. Trivia

100% client-side.

No hay respuestas sensibles ni puntuación competitiva.

## 14. Achievements

Modelo event-driven simple.

Ejemplo:

```ts
type AchievementTrigger =
  | "open-expediente"
  | "finish-timeline"
  | "tap-stethoscope-5"
  | "finish-quiz"
  | "reach-finale";
```

## 15. Observabilidad

Para un regalo personal no es obligatorio analytics.

Si se agrega:

- privacy-friendly;
- sin cookies cuando sea posible;
- solo métricas agregadas.

## 16. Seguridad

No existen inputs críticos en MVP.

Aun así:

- CSP razonable;
- evitar HTML arbitrario;
- sanitizar contenido si en el futuro existe guestbook;
- dependencias auditadas;
- secretos fuera del repo.

## 17. Backend futuro

Solo agregar backend si se incorpora:

- guestbook;
- subida de fotos;
- mensajes posteriores;
- administración remota.

Opción:

- Supabase;
- Vercel Functions + DB.

No diseñar el MVP alrededor de esa posibilidad.
