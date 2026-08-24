# 08 — Calidad, accesibilidad y performance

## 1. Quality gates

Todo PR de código debe pasar:

```text
lint
format:check
typecheck
unit tests
build
```

Cuando corresponda al alcance:

```text
component tests
E2E
accessibility checks
```

Antes de release:

```text
E2E completo
accessibility audit
performance audit
mobile device smoke test
content audit
indexing/canonical check
```

## 2. Preview Quality Gate

Antes de compartir la preview de M1 (#27), verificar como mínimo:

- [ ] build saludable
- [ ] recorrido Boot → Expediente → Finale funcional
- [ ] 360 px sin overflow
- [ ] 390 px validado
- [ ] 430 px validado
- [ ] sin errores fatales de consola
- [ ] CTAs principales accesibles
- [ ] reduced motion no rompe el recorrido
- [ ] fixtures/placeholders no inventan hechos reales
- [ ] URL de Vercel Preview compartible
- [ ] preview no se presenta como URL canónica de producción

La preview **no necesita** contenido completo, Lighthouse perfecto ni todos los assets definitivos. Su objetivo es validar producto y obtener mejor feedback.

## 3. Unit tests

No testear detalles de implementación.

Priorizar:

- schema validation;
- progression;
- achievements;
- content selectors;
- formatting;
- reduced-motion helpers;
- fallbacks ante contenido opcional.

## 4. Component tests

Priorizar:

- gallery/lightbox;
- audio player;
- quiz;
- achievement toast;
- progress;
- controls;
- componentes con estados sin imagen/audio.

## 5. E2E

Recorrido crítico final:

```text
load
→ skip/complete intro
→ expediente
→ timeline
→ gallery
→ scrapbook
→ epicrisis
→ diagnóstico
→ alta
```

No depender de sleeps arbitrarios ni de la duración exacta de animaciones.

## 6. Viewports

Playwright mínimo:

- 390×844;
- 1280×800.

Validación responsive adicional:

- 360 px;
- 412 px;
- 430 px.

Smoke manual de release:

- Android Chrome;
- Samsung Internet cuando sea posible;
- iPhone Safari cuando haya dispositivo disponible.

## 7. Accesibilidad

### Semántica

- un `h1` principal coherente;
- jerarquía de headings;
- `main`;
- `section` cuando corresponda;
- botones reales;
- links reales.

### Focus

- visible;
- overlays/lightbox con focus trap;
- restauración al cerrar;
- nada `tabindex` positivo.

### Motion

- consultar `prefers-reduced-motion`;
- no animar texto de forma ilegible;
- no flashes;
- el contenido final existe aunque se omitan transiciones.

### Audio

- control explícito;
- label;
- estado visible;
- nunca autoplay con sonido.

### Imágenes

- alt contextual cuando aportan información;
- decorativas con alt vacío.

## 8. Performance budget

Objetivos iniciales, a ajustar con mediciones:

- JS inicial tan bajo como sea razonable;
- imagen hero optimizada;
- audio/video fuera del critical path;
- fuentes limitadas;
- ninguna fotografía original innecesariamente grande.

## 9. Web Vitals

Objetivos de release:

- LCP < 2.5 s;
- CLS < 0.1;
- INP < 200 ms en condiciones razonables.

No aprobar/rechazar únicamente por un score global de Lighthouse: documentar condiciones y principales costos.

## 10. Imágenes

Proceso recomendado:

```text
original
→ crop si hace falta
→ resize
→ formato web apropiado
→ final
```

No sacrificar calidad visible por optimizaciones extremas.

## 11. Contenido

### Preview

Puede incluir:

- confirmado;
- provisional;
- placeholder.

No puede inventar biografía para cubrir huecos.

### Production

Debe contener:

- cero placeholders;
- cero “a corroborar” visibles;
- cero assets rotos;
- cero datos conocidos como incorrectos;
- feedback relevante de #27 resuelto o descartado explícitamente.

## 12. Fallos

La experiencia debe degradar bien.

### Si falla una imagen

Mostrar fallback visual o mantener layout coherente.

### Si falla un audio/video

La historia sigue.

### Si JS tarda

Contenido principal debe aparecer progresivamente.

### Si se interrumpe la animación

La siguiente acción sigue disponible.

## 13. Compatibilidad

No usar features experimentales sin fallback.

## 14. Indexación

Decisión de producto:

**Producción será indexable.**

Antes del release verificar:

- `robots.txt` permite producción;
- no existe `noindex` accidental;
- canonical apunta a producción;
- preview/development no compiten como canonical;
- title/description/OG son correctos.

## 15. Checklist Release Candidate

- [ ] lint
- [ ] format:check
- [ ] typecheck
- [ ] tests
- [ ] build
- [ ] E2E
- [ ] axe + revisión manual
- [ ] Lighthouse/mobile profiling
- [ ] 360 px
- [ ] 390 px
- [ ] 430 px
- [ ] Chrome Android
- [ ] Samsung Internet cuando sea posible
- [ ] Safari iOS cuando sea posible
- [ ] reduced motion
- [ ] sonido apagado inicialmente
- [ ] galería usable
- [ ] contenido final auditado
- [ ] producción indexable
- [ ] canonical verificado
- [ ] social preview verificado
- [ ] QR probado
