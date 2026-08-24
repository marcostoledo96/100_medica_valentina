# 08 — Calidad, accesibilidad y performance

## 1. Quality gates

Todo PR debe pasar:

```text
lint
typecheck
unit tests
build
```

Antes de release:

```text
e2e
accessibility audit
performance audit
mobile device smoke test
```

## 2. Unit tests

No testear detalles de implementación.

Priorizar:

- schema validation;
- progression;
- achievements;
- content selectors;
- formatting;
- reduced-motion helpers.

## 3. Component tests

Priorizar:

- gallery/lightbox;
- audio player;
- quiz;
- achievement toast;
- progress;
- controls.

## 4. E2E

Recorrido crítico:

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

## 5. Viewports

Playwright mínimo:

- 390×844;
- 1280×800.

Smoke manual:

- Samsung/Chrome o Samsung Internet;
- iPhone/Safari si se dispone.

## 6. Accesibilidad

### Semántica

- un `h1`;
- jerarquía coherente;
- `main`;
- `section`;
- botones reales;
- links reales.

### Focus

- visible;
- modal con focus trap;
- restauración al cerrar;
- nada `tabindex` positivo.

### Motion

- consultar `prefers-reduced-motion`;
- no animar texto de forma ilegible;
- no flashes.

### Audio

- control explícito;
- label;
- estado visible;
- no autoplay.

### Imágenes

- alt contextual;
- decorativas con alt vacío.

## 7. Performance budget

Objetivos iniciales, a ajustar con mediciones:

- JS inicial: mantenerlo tan bajo como sea razonable;
- imagen hero optimizada;
- audio fuera de critical path;
- fuentes: máximo 2 familias principales;
- ninguna fotografía original innecesariamente grande.

## 8. Web Vitals

Objetivos:

- LCP < 2.5 s;
- CLS < 0.1;
- INP < 200 ms en condiciones razonables.

## 9. Imágenes

Proceso recomendado:

```text
original
→ crop
→ resize
→ remove metadata
→ WebP/AVIF
→ final
```

Mantener originales fuera de `public`.

## 10. Fallos

La experiencia debe degradar bien.

### Si falla una imagen

Mostrar fallback visual.

### Si falla un audio

La historia sigue.

### Si JS tarda

Contenido principal debe aparecer progresivamente.

### Si se interrumpe la animación

La siguiente acción sigue disponible.

## 11. Compatibilidad

No usar features experimentales sin fallback.

## 12. Checklist Release Candidate

- [ ] lint
- [ ] typecheck
- [ ] tests
- [ ] build
- [ ] E2E
- [ ] axe
- [ ] Lighthouse mobile
- [ ] 360 px
- [ ] 390 px
- [ ] 430 px
- [ ] Chrome Android
- [ ] Samsung Internet
- [ ] Safari iOS
- [ ] reduced motion
- [ ] sonido apagado inicialmente
- [ ] galería usable
- [ ] QR probado
- [ ] noindex verificado
- [ ] contenido final auditado
