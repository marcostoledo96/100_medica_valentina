# 02 — Arquitectura técnica

## 1. Objetivo técnico

Construir una experiencia:

- 100% frontend;
- SPA;
- estática;
- rápida;
- tipada;
- fácil de mantener;
- desplegable en Vercel;
- con contenido desacoplado;
- sin backend ni base de datos.

## 2. Stack canónico

### Frontend

- **Vite**
- **React**
- **TypeScript estricto**
- **Tailwind CSS**
- **Motion / Framer Motion**
- CSS nativo para efectos simples

### Validación de datos

- Zod

### Testing

- Vitest
- Testing Library
- Playwright

### Tooling

- ESLint
- Prettier
- GitHub Actions
- npm
- Node.js 24

### Deploy

- Vercel

## 3. Decisión Vite SPA

El proyecto no requiere SSR, Server Components, API Routes ni routing de servidor.

Se adopta **Vite + React SPA** porque:

- reduce complejidad;
- encaja con un sitio 100% estático;
- permite previews de Vercel simples;
- mantiene el bundle y el runtime bajo control;
- evita infraestructura que no aporta valor al regalo.

Si en el futuro aparece una necesidad real de backend, debe abrirse una decisión arquitectónica nueva; no se diseña el MVP alrededor de esa posibilidad.

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
├── schemas Zod
├── inferred types
└── rules
     │
     ▼
Content
│
├── TypeScript modules
├── images
├── audio
└── video
```

No implementar Clean Architecture ceremonial. La separación existe para mantener contratos claros y contenido desacoplado, no para agregar capas vacías.

## 5. Estructura propuesta

```text
src/
├── main.tsx
├── App.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
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
├── content/
│   ├── profile.ts
│   ├── timeline.ts
│   ├── stats.ts
│   ├── gallery.ts
│   ├── team.ts
│   ├── memories.ts
│   ├── quiz.ts
│   ├── achievements.ts
│   ├── audio.ts
│   ├── epicrisis.ts
│   └── finale.ts
├── domain/
│   ├── schemas/
│   └── types/
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
├── video/
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

Preferencia inicial:

- Context + reducer o hooks locales;
- Zustand sólo si la complejidad real lo justifica.

No introducir Redux.

## 7. Persistencia

`localStorage` sólo para:

- intro vista;
- achievements;
- sonido;
- progreso opcional.

Nunca debe ser necesario limpiar storage para volver a experimentar el sitio.

## 8. Contenido

Preferencia:

**TypeScript data modules validados con Zod.**

Ventajas:

- autocompletado;
- tipado;
- revisión por Git;
- cero runtime fetching;
- fixtures controlados para la preview.

No hardcodear contenido personal en JSX.

## 9. Ciclo preview-first

La arquitectura debe soportar que el código avance antes que el contenido final.

```text
schemas + fixtures
→ vertical slice
→ Vercel preview
→ feedback/recolección
→ reemplazo progresivo por contenido real
→ validación final
```

No crear lógica distinta para “modo preview”. La misma aplicación debe poder renderizar fixtures o contenido real mediante el content layer.

## 10. Imágenes

Requisitos:

- formatos modernos cuando sea razonable;
- lazy loading;
- dimensiones conocidas;
- imágenes críticas optimizadas;
- placeholders/fallbacks;
- evitar originales innecesariamente pesados.

Vite no aporta un pipeline de imágenes equivalente a un framework SSR; cualquier optimización debe ser explícita y simple.

## 11. Audio y video

- carga bajo demanda;
- no formar parte del critical path;
- nunca autoplay con sonido;
- si se alojan videos externamente, documentar el proveedor y fallback;
- si se sirven como assets estáticos, controlar tamaño y compatibilidad móvil.

## 12. Animaciones

- entradas <700 ms salvo momentos especiales;
- cero scroll hijacking;
- respetar `prefers-reduced-motion`;
- nada esencial depende de animación;
- máximo una animación protagonista por viewport.

## 13. Scrapbook

Mobile:

- composición guiada;
- tarjetas táctiles;
- expandir;
- pequeños elementos superpuestos;
- drag opcional, nunca obligatorio.

Desktop puede incorporar composición más libre.

## 14. Trivia

100% client-side.

No hay puntuación competitiva ni backend.

## 15. Achievements

Modelo event-driven simple con triggers canónicos, sin strings mágicos dispersos.

## 16. Vercel: preview y producción

### Preview

- utilizada desde M1 para feedback;
- URL compartible con colaboradores;
- no debe actuar como URL canónica de producción;
- puede usar fixtures/placeholders.

### Production

- build estática;
- URL final del QR;
- **indexable por buscadores**;
- canonical apunta a producción;
- metadata/OG/robots se resuelven como assets estáticos de la SPA.

## 17. Seguridad básica

No existen inputs críticos en MVP.

Aun así:

- evitar HTML arbitrario;
- dependencias auditadas;
- secretos fuera del repo;
- no publicar información de pacientes ni datos de terceros que no correspondan al homenaje.

## 18. Backend futuro

Sólo considerar backend si aparece una necesidad concreta como guestbook o subida remota de contenido.

Cualquier incorporación debe abrir una nueva decisión arquitectónica; no forma parte del MVP actual.
