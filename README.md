# %100 médica

Experiencia web interactiva **mobile-first y en español** para celebrar la graduación de Valentina en Medicina (UBA).

La propuesta mezcla cuatro ideas principales:

1. **Expediente / dashboard clínico ficticio** para presentar la carrera como una historia clínica.
2. **Storytelling cinematográfico** para recorrer la experiencia por escenas.
3. **Scrapbook digital** para fotos, capturas, anécdotas y recuerdos.
4. **Gamificación ligera** mediante achievements, trivia, secretos y pequeños easter eggs.

El resultado no debe sentirse como una plantilla de graduación ni como una aplicación hospitalaria real. Tiene que sentirse como **una experiencia hecha específicamente para Valen**.

## Principio rector

La interfaz comienza fría, clínica y estructurada. A medida que avanza el recorrido, la UI se vuelve más humana, cálida y personal. El final rompe deliberadamente con la estética hospitalaria para revelar el verdadero mensaje:

> La historia nunca fue sobre una paciente.  
> Fue sobre todo lo que tuvo que recorrer para convertirse en médica.

## Stack

- React + Vite
- TypeScript estricto
- Tailwind CSS
- Motion / Framer Motion
- Zod
- Vitest + Testing Library
- Playwright
- GitHub Actions
- Vercel

Arquitectura: **SPA 100% estática**, sin backend ni base de datos.

## Flujo de producto y contenido

El proyecto adopta un flujo **preview-first**:

```text
Foundation
  ↓
Vertical slice
  ↓
Preview en Vercel
  ↓
Feedback con amigos/familia
  ↓
Recolección dirigida de fotos, recuerdos, mensajes y audios
  ↓
Contenido real progresivo
  ↓
Hardening + freeze
  ↓
Producción + QR
```

No hace falta completar una entrevista exhaustiva ni reunir todos los assets antes de construir. La primera preview puede usar datos confirmados, fixtures claramente provisionales y placeholders intencionales, pero **nunca debe inventar biografía para llenar huecos**.

## Objetivos del MVP

- Diseñar primero para 360–430 px.
- Ejecutar la experiencia completa desde un QR.
- Contar la historia en aproximadamente 5–10 minutos.
- Incluir fotografías, mensajes y momentos reales.
- Mantener contenido personal separado de la lógica de UI.
- Ser accesible, rápida y usable con una mano.
- Evitar apariencia de plantilla genérica generada por IA.
- Funcionar como sitio estático desplegado en Vercel.
- Mantener la versión final **indexable por buscadores**.

## Documentación

| Documento                                                                            | Contenido                                    |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| [00_PROPÓSITO_Y_PRINCIPIOS](docs/00_PROPOSITO_Y_PRINCIPIOS.md)                       | Propósito y principios de producto           |
| [01_VISIÓN_Y_EXPERIENCIA](docs/01_VISION_Y_EXPERIENCIA.md)                           | Narrativa y recorrido completo               |
| [02_ARQUITECTURA_TÉCNICA](docs/02_ARQUITECTURA_TECNICA.md)                           | Stack, capas y decisiones técnicas           |
| [03_ESPECIFICACIÓN_FUNCIONAL](docs/03_ESPECIFICACION_FUNCIONAL.md)                   | Requisitos funcionales/no funcionales        |
| [04_DISEÑO_MOBILE_FIRST](docs/04_DISENO_MOBILE_FIRST.md)                             | UX, responsive e interacción                 |
| [05_MODELO_DE_DATOS_Y_CONTENIDO](docs/05_MODELO_DE_DATOS_Y_CONTENIDO.md)             | Schemas, content layer y ciclo del contenido |
| [06_ROADMAP](docs/06_ROADMAP.md)                                                     | Fases, gates y orden de construcción         |
| [07_ISSUES_Y_CRITERIOS](docs/07_ISSUES_Y_CRITERIOS.md)                               | Mapa del backlog real de GitHub              |
| [08_CALIDAD_ACCESIBILIDAD_PERFORMANCE](docs/08_CALIDAD_ACCESIBILIDAD_PERFORMANCE.md) | Gates de calidad                             |
| [09_DEPLOY_Y_RELEASE](docs/09_DEPLOY_Y_RELEASE.md)                                   | Preview, producción, QR y release            |
| [10_PREVIEW_Y_RECOLECCION_CONTENIDO](docs/10_PREVIEW_Y_RECOLECCION_CONTENIDO.md)     | Protocolo de feedback y recolección dirigida |

## Alcance inicial

### MVP

- Boot / introducción.
- Expediente principal.
- Timeline.
- Signos vitales.
- Galería.
- Equipo tratante.
- Scrapbook.
- Trivia corta.
- Achievements.
- Epicrisis.
- Finale.
- Música/audio opcional.
- SEO/OG.
- Accesibilidad.
- Performance.
- Deploy en Vercel + QR.

### Fuera del MVP

- Login.
- Usuarios.
- Panel administrativo.
- Base de datos.
- Comentarios públicos.
- Chat.
- APIs médicas.
- Datos clínicos reales.
- Funciones que pretendan simular atención médica real.

## Desarrollo y Quality Gates

### Requisitos

- Node.js >= 24
- npm >= 11

### Instalación

```bash
npm ci
```

### Comandos disponibles

```bash
# Desarrollo local (puerto 5173)
npm run dev

# Compilación de producción
npm run build

# Preview del build local
npm run preview

# Linter (ESLint con 0 warnings)
npm run lint

# Formato de código (Prettier)
npm run format
npm run format:check

# Verificación de tipos TypeScript
npm run typecheck

# Tests unitarios e integración (Vitest + Testing Library)
npm test
npm run test:watch

# Tests End-to-End (Playwright mobile y desktop)
npm run test:e2e
```

## Estado actual

- Repositorio creado.
- Documentación base creada.
- Backlog materializado en GitHub: Issues **#1–#27**.
- Sprint actual: **M0 — Foundation**.
- La primera preview compartible queda formalizada por la **Issue #27** después del vertical slice de M1.

Orden inmediato recomendado:

1. #1 — Foundation React/Vite + quality gates.
2. #2 y #3 — Design system + content/domain contracts.
3. #4–#7 — Vertical slice.
4. #27 — Preview en Vercel + feedback/recolección dirigida.
