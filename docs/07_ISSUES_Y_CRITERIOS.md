# 07 — Issues, tareas y criterios de aceptación

Este backlog está pensado para convertir cada sección en una issue de GitHub.

## Labels sugeridos

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

---

# ISSUE 001 — Inicializar aplicación y quality gates

**Milestone:** M0  
**Prioridad:** P0  
**Labels:** `type:chore`, `area:core`

## Objetivo

Crear la base técnica del proyecto.

## Tareas

- [ ] crear aplicación Next.js + TypeScript
- [ ] habilitar modo estricto
- [ ] configurar ESLint
- [ ] configurar Prettier
- [ ] configurar Vitest
- [ ] configurar Testing Library
- [ ] configurar Playwright
- [ ] agregar scripts `lint`, `typecheck`, `test`, `test:e2e`, `build`
- [ ] crear CI
- [ ] crear estructura inicial
- [ ] documentar comandos

## Criterios de aceptación

- [ ] `npm run lint` pasa
- [ ] `npm run typecheck` pasa
- [ ] `npm test` pasa
- [ ] `npm run build` pasa
- [ ] CI ejecuta gates en PR
- [ ] proyecto corre localmente
- [ ] README explica setup

---

# ISSUE 002 — Implementar sistema de diseño mobile-first

**Milestone:** M0  
**Prioridad:** P0  
**Labels:** `type:design`, `area:core`

## Tareas

- [ ] definir spacing
- [ ] definir typography
- [ ] definir radii
- [ ] definir surfaces
- [ ] definir tokens de fase clínica
- [ ] definir tokens de fase humana
- [ ] crear Button
- [ ] crear Card
- [ ] crear Section
- [ ] crear IconButton
- [ ] crear VisuallyHidden
- [ ] safe-area support

## Criterios de aceptación

- [ ] diseño usable desde 360 px
- [ ] ninguna primitive depende de hover
- [ ] focus visible
- [ ] targets táctiles adecuados
- [ ] tokens centralizados
- [ ] no hay colores hardcodeados repetidos en features

---

# ISSUE 003 — Definir schemas y contenido desacoplado

**Milestone:** M0  
**Prioridad:** P0  
**Labels:** `type:content`, `area:core`

## Tareas

- [ ] implementar schemas de profile
- [ ] timeline
- [ ] stats
- [ ] gallery
- [ ] team
- [ ] memories
- [ ] quiz
- [ ] achievements
- [ ] finale
- [ ] validar contenido al construir

## Criterios de aceptación

- [ ] contenido inválido falla de manera clara
- [ ] componentes no contienen biografía hardcodeada
- [ ] existe fixture/demo
- [ ] assets se referencian con rutas consistentes

---

# ISSUE 004 — Implementar shell narrativo y progreso

**Milestone:** M1  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:core`

## Objetivo

Crear el contenedor de toda la experiencia.

## Tareas

- [ ] sección vertical
- [ ] navegación por anchors
- [ ] progreso
- [ ] soporte de revisita
- [ ] hook de sección activa
- [ ] reduced motion

## Criterios de aceptación

- [ ] scroll natural
- [ ] no existe scroll hijacking
- [ ] progreso no tapa contenido
- [ ] navegación accesible por teclado
- [ ] 360 px sin overflow horizontal

---

# ISSUE 005 — Boot / apertura del expediente

**Milestone:** M1  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] animación inicial
- [ ] estado de búsqueda
- [ ] revelar protagonista
- [ ] CTA
- [ ] “saltar intro”
- [ ] persistir intro vista
- [ ] reduced-motion variant

## Criterios de aceptación

- [ ] el usuario puede avanzar inmediatamente
- [ ] la intro no bloquea artificialmente más de lo necesario
- [ ] funciona sin audio
- [ ] segunda visita no obliga a repetir
- [ ] screen reader recibe texto coherente

---

# ISSUE 006 — Expediente principal

**Milestone:** M1  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] profile header
- [ ] portrait
- [ ] ingreso/egreso
- [ ] status
- [ ] progreso 100%
- [ ] diagnóstico
- [ ] pronóstico
- [ ] CTA

## Criterios de aceptación

- [ ] datos vienen del content layer
- [ ] layout correcto 360–430 px
- [ ] imagen optimizada
- [ ] sin apariencia de formulario editable
- [ ] metáfora claramente ficticia

---

# ISSUE 007 — Vertical slice del finale

**Milestone:** M1  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Objetivo

Tener final funcional temprano.

## Tareas

- [ ] pantalla Diagnóstico
- [ ] pantalla Alta
- [ ] foto principal
- [ ] mensaje final dummy
- [ ] transición clínica → humana

## Criterios de aceptación

- [ ] flujo Boot → Expediente → Finale completo
- [ ] finale funciona sin JS animation
- [ ] contraste correcto
- [ ] CTA de volver al inicio

---

# ISSUE 008 — Anamnesis

**Milestone:** M2  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] layout
- [ ] texto de origen
- [ ] foto opcional
- [ ] frase
- [ ] transición al timeline

## Criterios de aceptación

- [ ] máximo 3 bloques principales
- [ ] textos editables desde content
- [ ] legible sin animación

---

# ISSUE 009 — Timeline de evolución

**Milestone:** M2  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] timeline vertical
- [ ] cards por categoría
- [ ] image support
- [ ] quote support
- [ ] reveal progresivo
- [ ] anchors opcionales

## Criterios de aceptación

- [ ] orden cronológico validado
- [ ] 10+ entradas no degradan UX
- [ ] imágenes lazy
- [ ] 360 px sin zig-zag
- [ ] reduced motion estable

---

# ISSUE 010 — Dashboard de signos vitales

**Milestone:** M2  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] stat card
- [ ] number
- [ ] percentage
- [ ] progress
- [ ] text metric
- [ ] count-up opcional

## Criterios de aceptación

- [ ] no usar charts pesados sin necesidad
- [ ] valor final disponible sin animación
- [ ] métricas humorísticas identificables
- [ ] grid mobile legible

---

# ISSUE 011 — Galería “Estudios complementarios”

**Milestone:** M2  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:media`

## Tareas

- [ ] carrusel mobile
- [ ] scroll snap
- [ ] captions
- [ ] lightbox
- [ ] swipe
- [ ] keyboard desktop
- [ ] image preload selectivo

## Criterios de aceptación

- [ ] lightbox tiene focus trap
- [ ] Escape cierra en desktop
- [ ] swipe no impide scroll vertical accidentalmente
- [ ] alt text obligatorio
- [ ] no descarga originales enormes

---

# ISSUE 012 — Equipo tratante

**Milestone:** M3  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] cards
- [ ] foto opcional
- [ ] rol ficticio
- [ ] mensaje
- [ ] layout mobile
- [ ] fallback sin imagen

## Criterios de aceptación

- [ ] personas sin foto se ven intencionales
- [ ] mensajes largos no rompen layout
- [ ] contenido tipado
- [ ] roles no son ofensivos

---

# ISSUE 013 — Scrapbook digital

**Milestone:** M3  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:media`

## Tareas

- [ ] tipos de memoria
- [ ] polaroid
- [ ] sticky note
- [ ] screenshot
- [ ] sticker
- [ ] composición mobile
- [ ] composición desktop opcional
- [ ] zoom de fotos

## Criterios de aceptación

- [ ] nada requiere drag
- [ ] orden de lectura accesible
- [ ] decoraciones no interfieren con texto
- [ ] layout no desborda 360 px
- [ ] 20 elementos mantienen buena performance

---

# ISSUE 014 — Mensajes de audio

**Milestone:** M3  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:media`

## Tareas

- [ ] player accesible
- [ ] play/pause
- [ ] duración
- [ ] una reproducción a la vez
- [ ] lazy loading
- [ ] fallback

## Criterios de aceptación

- [ ] no autoplay
- [ ] audio no forma parte del critical path
- [ ] controles tienen labels
- [ ] cambiar de audio pausa anterior

---

# ISSUE 015 — Trivia

**Milestone:** M4  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] question card
- [ ] opciones
- [ ] reactions
- [ ] progreso
- [ ] resultado
- [ ] skip
- [ ] replay

## Criterios de aceptación

- [ ] 3–5 preguntas
- [ ] no hay bloqueo por respuesta
- [ ] touch friendly
- [ ] usable con teclado
- [ ] estado local únicamente

---

# ISSUE 016 — Motor de achievements

**Milestone:** M4  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:core`

## Tareas

- [ ] definición de triggers
- [ ] store
- [ ] unlock
- [ ] persistencia
- [ ] toast
- [ ] lista final

## Criterios de aceptación

- [ ] un logro no se anuncia repetidamente
- [ ] limpiar storage no rompe experiencia
- [ ] secretos no se muestran antes de desbloquear
- [ ] toast accesible y no bloqueante

---

# ISSUE 017 — Easter eggs

**Milestone:** M4  
**Prioridad:** P2  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] definir 3–5 secretos
- [ ] implementar triggers
- [ ] agregar achievement secreto
- [ ] agregar mensaje DevTools opcional

## Criterios de aceptación

- [ ] cero contenido esencial está oculto
- [ ] no interfieren con navegación
- [ ] no generan errores en mobile

---

# ISSUE 018 — Epicrisis

**Milestone:** M5  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] layout
- [ ] ingreso
- [ ] evolución
- [ ] soporte
- [ ] resultado
- [ ] condición de alta
- [ ] transición tonal

## Criterios de aceptación

- [ ] puede leerse en menos de 90 s
- [ ] el humor disminuye progresivamente
- [ ] contenido configurable
- [ ] visualmente precede al diagnóstico

---

# ISSUE 019 — Finale definitivo

**Milestone:** M5  
**Prioridad:** P0  
**Labels:** `type:feature`, `area:story`

## Tareas

- [ ] diagnóstico “MÉDICA”
- [ ] transición visual
- [ ] fotografía
- [ ] mensaje
- [ ] fecha
- [ ] confetti
- [ ] volver a recuerdos
- [ ] repetir

## Criterios de aceptación

- [ ] UI clínica desaparece
- [ ] reduced motion elimina efectos intensos
- [ ] sin audio sigue siendo emotivo
- [ ] no existe CTA comercial ni distracción

---

# ISSUE 020 — Control global de sonido

**Milestone:** M5  
**Prioridad:** P1  
**Labels:** `type:feature`, `area:media`

## Tareas

- [ ] sound toggle
- [ ] estado
- [ ] persistencia
- [ ] integración con música
- [ ] integración con audios
- [ ] respetar navegación

## Criterios de aceptación

- [ ] sonido inicia apagado
- [ ] control siempre accesible cuando hay audio
- [ ] no reproduce dos fuentes involuntariamente

---

# ISSUE 021 — Auditoría de accesibilidad

**Milestone:** M6  
**Prioridad:** P0  
**Labels:** `type:test`, `area:accessibility`

## Tareas

- [ ] headings
- [ ] landmarks
- [ ] keyboard
- [ ] focus
- [ ] lightbox
- [ ] color contrast
- [ ] alt text
- [ ] reduced motion
- [ ] screen reader smoke test

## Criterios de aceptación

- [ ] sin violaciones críticas en axe
- [ ] experiencia completa con teclado
- [ ] focus nunca queda perdido
- [ ] todos los controles tienen nombre accesible

---

# ISSUE 022 — Auditoría de performance

**Milestone:** M6  
**Prioridad:** P0  
**Labels:** `type:test`, `area:performance`

## Tareas

- [ ] bundle review
- [ ] image optimization
- [ ] lazy loading
- [ ] font strategy
- [ ] audio lazy
- [ ] remove unused deps
- [ ] Lighthouse mobile
- [ ] test red móvil

## Criterios de aceptación

- [ ] LCP objetivo < 2.5 s
- [ ] CLS < 0.1
- [ ] no existen assets individuales absurdamente pesados
- [ ] contenido inicial no espera audio/video

---

# ISSUE 023 — E2E del recorrido principal

**Milestone:** M6  
**Prioridad:** P0  
**Labels:** `type:test`, `area:core`

## Tareas

- [ ] primera visita
- [ ] skip intro
- [ ] recorrido completo
- [ ] galería
- [ ] trivia
- [ ] finale
- [ ] revisita
- [ ] reduced motion

## Criterios de aceptación

- [ ] tests en viewport mobile
- [ ] tests pasan en CI
- [ ] recorrido crítico cubierto
- [ ] no depender de timings frágiles

---

# ISSUE 024 — Metadata, privacidad y social preview

**Milestone:** M6  
**Prioridad:** P1  
**Labels:** `type:chore`, `area:core`

## Tareas

- [ ] title
- [ ] description
- [ ] favicon
- [ ] OG image
- [ ] robots
- [ ] noindex por defecto
- [ ] review EXIF
- [ ] revisar screenshots

## Criterios de aceptación

- [ ] no indexación accidental
- [ ] preview al compartir es intencional
- [ ] no expone información sensible

---

# ISSUE 025 — Deploy productivo y QR

**Milestone:** M7  
**Prioridad:** P0  
**Labels:** `type:chore`, `area:core`

## Tareas

- [ ] crear proyecto Vercel
- [ ] dominio
- [ ] HTTPS
- [ ] production env
- [ ] release tag
- [ ] generar QR
- [ ] probar QR impreso
- [ ] probar múltiples teléfonos

## Criterios de aceptación

- [ ] QR abre URL final
- [ ] URL no depende de preview deployment
- [ ] HTTPS válido
- [ ] Android y iOS probados
- [ ] existe rollback/redeploy claro

---

# ISSUE 026 — Freeze y auditoría del contenido final

**Milestone:** M7  
**Prioridad:** P0  
**Labels:** `type:content`

## Tareas

- [ ] revisar nombres
- [ ] fechas
- [ ] ortografía
- [ ] consentimiento de fotos sensibles
- [ ] captions
- [ ] mensajes
- [ ] audios
- [ ] eliminar placeholders
- [ ] comprobar assets rotos

## Criterios de aceptación

- [ ] cero texto placeholder
- [ ] cero imagen rota
- [ ] cero nombre incorrecto
- [ ] contenido aprobado por organizadores
- [ ] build final etiquetada

---

## Issues opcionales post-MVP

### Guestbook privado

Agregar mensajes de invitados después del festejo.

### Modo “archivo”

Después del evento, convertir la landing en una versión más tranquila para revisitar.

### PWA

Instalable como recuerdo.

### Cápsula del tiempo

Contenido que solo se revela en una fecha futura.

### Exportable

Generar PDF/imagen de la epicrisis como recuerdo.
