# 03 — Especificación funcional

## Convenciones

- `RF`: requisito funcional.
- `RNF`: requisito no funcional.
- `MUST`: obligatorio para MVP.
- `SHOULD`: recomendado.
- `COULD`: opcional.

---

# RF-001 — Intro / Boot

**Prioridad:** MUST

El sistema debe presentar una intro temática antes del expediente.

### Comportamiento

- muestra estado de carga ficticio;
- revela nombre;
- revela estado del expediente;
- CTA claro;
- permite saltar intro;
- no depende de conectividad adicional.

### Criterios

- máximo 1 CTA primario;
- “Saltar intro” visible;
- si `prefers-reduced-motion`, usar versión reducida;
- después de completarse puede recordarse localmente.

---

# RF-002 — Expediente

**Prioridad:** MUST

Debe presentar la ficha inicial.

Campos:

- nombre;
- foto;
- ingreso;
- egreso;
- progreso;
- estado;
- diagnóstico ficticio;
- pronóstico.

Debe existir CTA a la siguiente escena.

---

# RF-003 — Timeline

**Prioridad:** MUST

Debe representar momentos relevantes.

Cada momento:

```ts
{
  id,
  date,
  title,
  description,
  type,
  media?,
  quote?
}
```

Requisitos:

- orden cronológico;
- entradas cortas;
- soporte para imagen opcional;
- soporte para frase;
- navegación natural por scroll;
- no convertir datos provisionales en hechos definitivos.

---

# RF-004 — Signos vitales

**Prioridad:** MUST

Debe mostrar métricas humorísticas.

Tipos soportados:

- número;
- porcentaje;
- texto;
- nivel/progreso.

No presentar estadísticas inventadas como datos reales. Si una cifra es deliberadamente absurda, el tono debe dejarlo claro.

---

# RF-005 — Galería

**Prioridad:** MUST

Debe permitir ver fotografías.

Mobile:

- swipe;
- tap;
- fullscreen/lightbox;
- captions.

Debe soportar:

- fecha;
- título;
- hallazgo;
- descripción opcional.

---

# RF-006 — Equipo tratante

**Prioridad:** MUST

Tarjetas de personas importantes.

Contenido:

- nombre;
- rol ficticio;
- foto opcional;
- mensaje;
- audio opcional.

No exigir foto ni audio para todos.

---

# RF-007 — Scrapbook

**Prioridad:** MUST

Debe mostrar recuerdos con estética física.

Tipos:

- foto;
- nota;
- captura;
- sticker;
- texto;
- fecha.

Debe priorizar legibilidad sobre realismo.

---

# RF-008 — Trivia

**Prioridad:** SHOULD

Trivia breve.

Requisitos:

- 3–5 preguntas;
- feedback inmediato;
- no bloquear avance;
- CTA “saltar”;
- resultado gracioso;
- no guardar datos personales.

Las preguntas definitivas deben surgir de contenido corroborado o de chistes internos aprobados.

---

# RF-009 — Achievements

**Prioridad:** SHOULD

Los achievements pueden desbloquearse durante la experiencia.

Requisitos:

- toast o tarjeta no intrusiva;
- persistencia local opcional;
- listado accesible al final;
- secretos no requeridos para comprender la historia.

---

# RF-010 — Easter eggs

**Prioridad:** COULD

Ejemplos:

- múltiples taps;
- gesto o interacción contextual;
- texto en consola;
- sorpresa asociada a elementos personales.

No deben ser necesarios para entender el sitio.

---

# RF-011 — Epicrisis

**Prioridad:** MUST

Resumen final del recorrido.

Campos:

- ingreso;
- evolución;
- dificultades;
- soporte;
- resultado;
- condición de alta.

Tono:

transición humor → emoción.

---

# RF-012 — Diagnóstico

**Prioridad:** MUST

Pantalla breve.

Contenido principal:

**MÉDICA**

Sin navegación compleja.

---

# RF-013 — Finale

**Prioridad:** MUST

Debe abandonar gradualmente la UI clínica.

Contenido:

- imagen principal;
- nombre;
- mensaje final;
- fecha;
- confetti opcional;
- acciones de revisita.

---

# RF-014 — Audio

**Prioridad:** SHOULD

- desactivado inicialmente;
- activación explícita;
- control accesible;
- recordar preferencia;
- permitir audios individuales.

---

# RF-015 — Progress

**Prioridad:** SHOULD

Indicador discreto del recorrido.

No usar un wizard empresarial.

Puede representarse como:

- línea;
- pulso;
- capítulos;
- porcentaje.

---

# RF-016 — Compartir

**Prioridad:** COULD

Usar Web Share API cuando exista.

Fallback:

copiar enlace.

---

# RF-017 — Revisita

**Prioridad:** SHOULD

Después de completar:

- repetir experiencia;
- ir a recuerdos;
- abrir galería;
- ver achievements.

---

# RF-018 — Preview compartible

**Prioridad:** MUST para el proceso de desarrollo

Después del vertical slice de M1 debe existir una preview en Vercel que pueda mostrarse a colaboradores antes de completar el contenido real.

### Requisitos

- debe poder recorrerse en mobile;
- puede contener fixtures y placeholders;
- no puede inventar biografía para completar huecos;
- debe permitir detectar qué falta en timeline, fotos, mensajes, trivia y recuerdos;
- la URL de preview no es la URL canónica de producción;
- el feedback debe transformarse en tareas o decisiones accionables.

La falta de audios, mensajes o galería final no bloquea la creación de esta preview.

---

# RF-019 — Ciclo de contenido

**Prioridad:** MUST

El contenido debe evolucionar en estas etapas:

```text
fixture
→ preview
→ feedback
→ corroboración/recolección dirigida
→ contenido real
→ freeze
```

Durante desarrollo pueden existir estados editoriales `confirmado`, `provisional` y `pendiente`. Esos estados son de autoría/planificación y no tienen por qué aparecer en la UI final.

En producción:

- no quedan placeholders;
- no quedan preguntas a corroborar visibles;
- no se presentan hechos conocidos como dudosos o incorrectos.

---

# RNF-001 — Mobile-first

La UI base se diseña para 360–430 px.

---

# RNF-002 — Performance

Objetivo en móvil real:

- LCP < 2.5 s;
- CLS < 0.1;
- INP < 200 ms cuando sea razonable;
- JS inicial limitado.

---

# RNF-003 — Accesibilidad

Objetivo mínimo: WCAG 2.2 AA en componentes principales.

---

# RNF-004 — Reduced motion

Toda animación protagonista debe tener alternativa.

---

# RNF-005 — Offline degradado

No se exige PWA completa, pero el contenido crítico no debe depender de APIs externas.

---

# RNF-006 — Indexación y publicación

La versión final de producción será **pública e indexable por buscadores**.

Requisitos:

- `robots.txt` debe permitir indexación en producción;
- no usar `noindex` en producción;
- canonical debe apuntar a la URL final de Vercel/dominio elegido;
- previews/development no deben competir como URL canónica;
- metadata y social preview deben ser deliberadas.

---

# RNF-007 — Navegadores

Soporte:

- Chrome Android;
- Samsung Internet;
- Safari iOS;
- Chrome desktop;
- Firefox desktop.

---

# RNF-008 — Idioma

Toda la experiencia visible debe estar en español.

No mezclar labels de UI en inglés salvo easter eggs deliberados o nombres de herramientas cuando tenga sentido.

---

# RNF-009 — Contenido desacoplado

Nombres, fechas, frases, fotos, audios, anécdotas, métricas y mensajes personales deben vivir en `src/content/` y validarse mediante contratos de dominio.

Los componentes React no pueden contener biografía hardcodeada.
