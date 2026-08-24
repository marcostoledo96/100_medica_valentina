# AGENTS.md — Reglas, Metodología y Orquestación de Agentes

> Repositorio: `https://github.com/marcostoledo96/100_medica_valentina.git`  
> Proyecto: **%100 médica** (Experiencia web interactiva mobile-first para festejo de graduación).  
> Arquitectura: **100% Frontend / Single-Page Application (SPA)** / Cero Base de Datos.  
> Metodología: **Gentle AI (Spec-Driven Development / SDD & RDD)**.

---

## 1. Topología del Equipo y Roles de Agentes

El desarrollo de este proyecto se ejecuta mediante una separación estricta de responsabilidades entre el **Orquestador**, el **Ejecutor** y el **Human Lead (PO)**.

```
┌─────────────────────────────────────────────────────────────┐
│                 CHATGPT PRO (Orquestador & Auditor)         │
│  - Desglose de issues, planning y refinamiento narrativo   │
│  - Generación de prompts de implementación atómicos        │
│  - Auditoría de Pull Requests y control de calidad         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prompts / Tareas / Specs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 ANTIGRAVITY / GEMINI (Ejecutor)             │
│  - Implementación de código en React + TS + Tailwind + Motion│
│  - Ejecución de tests (Vitest, Testing Library, Playwright) │
│  - Creación de ramas, commits convencionales y reportes     │
└──────────────────────────────┬──────────────────────────────┘
                               │ PR / Diffs / Receipts
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 HUMAN LEAD / PRODUCT OWNER (Marcos)         │
│  - Coordinación, provisión de fotos/anécdotas y feedback    │
│  - Merge y despliegue final en Vercel                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.1. ChatGPT Pro (Orquestador & Auditor)
- **Rol:** Arquitecto de Producto, Planificador de Tareas y Auditor de PRs.
- **Responsabilidades:**
  1. Analizar la documentación (`docs/`) e investigar referencias de diseño.
  2. Generar tareas atómicas basadas en `docs/07_ISSUES_Y_CRITERIOS.md`.
  3. Auditar diffs de código y PRs verificando que cumplan accesibilidad, performance y estética anti-IA genérica.
  4. Proveer los prompts precisos de ejecución para el agente desarrollador.

### 1.2. Antigravity / Gemini (Ejecutor de Código)
- **Rol:** Senior Frontend Developer & UI/UX Craftsman.
- **Responsabilidades:**
  1. Ejecutar las tareas y especificaciones dadas con máxima precisión técnica.
  2. Mantener TypeScript estricto, cero warnings de ESLint y cobertura de tests.
  3. Seguir estrictamente el sistema de diseño y las pautas anti-AI-slop.
  4. Realizar commits bajo estándar **Conventional Commits** sin ninguna mención de autoría de IA.

---

## 2. Directivas de Diseño: Anti-AI-Slop & Alta Fidelidad

Este proyecto **NO DEBE PARECER una plantilla genérica generada por IA** (sin gradientes violetas/azules predecibles, sin tarjetas idénticas de Bootstrap/Tailwind genérico, sin scroll-jacking pesado).

### 2.1. Dualidad Estética de la Experiencia
El sitio narra una evolución visual y emocional en 3 fases:

1. **Fase Clínica (Inicio / Expediente / Signos Vitales):**
   - *Atmósfera:* Quirúrgica, pulcra, digital pero creíble, datos estructurados.
   - *Tipografía:* Monospace para códigos/datos + Sans técnica y legible.
   - *Paleta:* Fondos neutros/oscuros clínicos, acentos verde monitor/cian hospitalario sutil, líneas de grilla fina, pills de estado (`ESTABLE`, `EN OBSERVACIÓN`).
2. **Fase Humana / Transición (Timeline / Equipo Tratante / Scrapbook):**
   - *Atmósfera:* Cálida, orgánica, nostálgica, personal.
   - *Elementos:* Texturas sutiles de papel, fotos tipo Polaroid con rotación leve (`-2deg` a `3deg`), notas adhesivas, cintas adhesivas simuladas, stickers, capturas con sombras suaves.
   - *Tipografía:* Introducción de Serif editorial cálida y acentos manuscritos puntuales.
3. **Fase Finale (Diagnóstico / Alta Definitiva):**
   - *Atmósfera:* Minimalista, emotiva, humana.
   - *Elementos:* Desaparición total del marco clínico. Foto a pantalla completa/protagonista, texto de alto impacto, mensaje de cierre, confetti sutil, sonido opcional.

### 2.2. Reglas de Interacción Mobile-First
- **Viewport Base:** Diseñado primordialmente para 360px a 430px (iPhone / Android moderno).
- **One-Hand Usability:** Todos los botones y CTAs principales dentro del área natural del pulgar.
- **Touch Targets:** Mínimo `44x44px` para cualquier elemento interactivo.
- **Zero Scroll Hijacking:** El scroll vertical del navegador siempre es nativo y fluido.
### 2.3. Tono Narrativo: Humor Cálido y Parodia Médica Relatable
- **Enfoque:** El sitio tiene un fuerte fin humorístico basado en la complicidad, la exageración cariñosa y las vivencias reales de la carrera (cafés infinitos, guardias eternas, diagnósticos cómicos, anécdotas de parciales).
- **Límites de la Parodia:** Humor inteligente y cercano, sin caer en el absurdo sin sentido ni en bromas sobre salud real, pacientes o temas delicados.
- **Distribución Emocional:** ~40% humor/anécdota cómica, ~35% nostalgia/recuerdos, ~15% sorpresa lúdica, ~10% cierre emotivo.


## 3. Arquitectura Técnica & Estándares de Código

### 3.1. Stack Tecnológico
- **Core:** React 18+ (SPA estática)
- **Lenguaje:** TypeScript con modo `strict: true`
- **Estilos:** Tailwind CSS con tokens centralizados
- **Animaciones:** Framer Motion / Motion + CSS transitions nativas
- **Validación de Datos:** Zod
- **Testing:** Vitest + Testing Library + Playwright (E2E)
- **Iconografía:** Lucide React + SVGs custom
- **Deploy:** Vercel (Sitio estático)

### 3.2. Regla de Oro: Contenido 100% Desacoplado
- **PROHIBIDO:** Escribir nombres personales, fechas, URLs de fotos o textos narrativos hardcodeados dentro de los componentes de React.
- **OBLIGATORIO:** Todo el contenido vive en `src/content/*.ts` y es tipado/validado mediante esquemas Zod en `src/domain/schemas/*.ts`.

```text
src/
├── components/          # UI Primitives reutilizables (Button, Card, Lightbox, etc.)
├── features/            # Módulos narrativos de la experiencia
│   ├── boot/            # Escena 00: Boot inicial
│   ├── expediente/      # Escena 01: Ficha clínica inicial
│   ├── anamnesis/       # Escena 02: Origen y vocación
│   ├── timeline/        # Escena 03: Evolución de la carrera
│   ├── vitales/         # Escena 04: Dashboard cómico de signos vitales
│   ├── gallery/         # Escena 05: Estudios complementarios
│   ├── team/            # Escena 06: Equipo tratante (familia/amigos)
│   ├── scrapbook/       # Escena 07: Archivo histórico / recuerdos
│   ├── quiz/            # Escena 08: Trivia interactiva
│   ├── achievements/    # Escena 09: Logros y easter eggs
│   ├── epicrisis/       # Escena 10: Resumen clínico final
│   └── finale/          # Escena 11 y 12: Alta definitiva y celebración
├── content/             # Archivos de datos TS con todo el contenido real/mock
├── domain/              # Schemas Zod y tipos TypeScript
├── hooks/               # Custom hooks (audio, sound, achievements, intersection)
└── lib/                 # Utilidades generales
```

---

## 4. Metodología de Trabajo (Gentle AI / SDD)

1. **Spec First:** Toda funcionalidad comienza con una especificación clara del issue (`docs/07_ISSUES_Y_CRITERIOS.md`).
2. **Atomic Commits:** Commits pequeños y con formato convencional:
   - `feat(timeline): implement vertical mobile timeline card`
   - `test(quiz): add unit tests for trivia score calculator`
   - `chore(deps): configure tailwind typography plugin`
3. **NO AI Attribution:** No incluir `Co-Authored-By`, ni frases generadas por IA en los mensajes de commit.
4. **Quality Gates Obligatorios:** Antes de dar por cerrada una tarea o emitir PR:
   - `npm run lint` -> 0 errores.
   - `npm run typecheck` -> 0 errores de TypeScript.
   - `npm test` -> Todos los tests unitarios pasando.
   - `npm run build` -> Compilación estática exitosa.

---

## 5. Protocolo de Comunicación entre ChatGPT y Antigravity

- **Para planificar o investigar:** Usar a ChatGPT Pro con el prompt maestro provisto para estructurar issues, refinar copies y definir componentes.
- **Para ejecutar código:** Pasar el prompt generado por ChatGPT directamente al agente Antigravity en este workspace.
- **Para auditar:** Copiar el `git diff` o resumen de cambios a ChatGPT Pro para validación de arquitectura antes de mergear.
