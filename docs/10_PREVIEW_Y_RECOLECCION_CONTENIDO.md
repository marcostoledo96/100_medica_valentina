# 10 — Preview y recolección dirigida de contenido

## 1. Propósito

Este documento define cómo usar la primera preview de `%100 médica` para obtener mejor contenido sin bloquear el desarrollo esperando una entrevista exhaustiva.

La idea central es simple:

> Primero mostramos algo concreto. Después preguntamos exactamente lo que falta.

## 2. Flujo canónico

```text
vertical slice
→ preview en Vercel
→ feedback de colaboradores
→ detectar huecos concretos
→ preguntar a la mejor fuente
→ incorporar contenido real
→ repetir si hace falta
→ freeze
```

La preview es una herramienta de producto y también una herramienta de investigación.

## 3. Qué puede contener la preview

### Confirmado

Datos que ya sabemos con suficiente certeza.

Puede mostrarse normalmente.

### Provisional

Dato razonable que todavía debe corroborarse.

Puede usarse de forma controlada durante desarrollo, pero debe estar registrado internamente como pendiente de revisión.

No convertirlo en una afirmación contundente si afecta la historia.

### Placeholder

Hueco deliberado porque todavía no existe contenido.

Ejemplos:

- foto temporal;
- mensaje demo;
- entrada mínima de timeline;
- estadística ficticia claramente marcada como fixture en desarrollo.

Un placeholder es preferible a inventar una anécdota.

## 4. Qué debe validar la preview

Antes de pedir material a mucha gente, comprobar:

1. ¿se entiende la metáfora de expediente clínico?
2. ¿se percibe la transformación hacia algo humano/cálido?
3. ¿el recorrido funciona bien en celular?
4. ¿el humor se siente propio de Valen o demasiado genérico?
5. ¿el finale se entiende aunque todavía sea provisional?
6. ¿los colaboradores pueden señalar recuerdos/fotos que mejorarían una sección concreta?

## 5. Cómo pedir feedback

Evitar:

> “¿Qué le agregarías a la página?”

Preferir:

> “En esta parte contamos su carrera. ¿Qué momento de Medicina falta sí o sí?”

> “Acá mostramos hábitos de estudio. ¿Qué hacía Valen siempre antes de rendir?”

> “Esta es la galería. ¿Tenés una foto que represente mejor esta etapa?”

> “Acá van mensajes. ¿Qué le dirías en 3–6 líneas?”

La pregunta debe señalar una pantalla/sección real.

## 6. Fuentes recomendadas

### Compañeros/as de Medicina

Buscar principalmente:

- 3–5 hitos de carrera;
- materia/examen/rotación memorable;
- anécdota graciosa;
- frase/latiguillo real;
- hábito de estudio;
- fotos de Facultad, ambo, apuntes, hospital o compañeros.

Son la mejor fuente para:

- timeline;
- signos vitales;
- trivia;
- achievements;
- galería académica.

### Familia

Buscar:

- cuándo empezó a hablar de ser médica;
- por qué eligió Medicina;
- una foto de infancia/adolescencia útil;
- momento de mayor orgullo;
- mensaje final;
- audio opcional.

Son la mejor fuente para:

- anamnesis;
- inicio del timeline;
- cierre emocional.

### Pareja

Buscar:

- hábito/frase inconfundible;
- anécdota de estos años;
- foto significativa;
- canción de Tini/u otra música que la represente;
- mensaje reservado para el finale;
- audio opcional.

### Amigos/as scouts

Buscar:

- anécdota que represente su personalidad;
- chiste interno o costumbre;
- rasgo que se mantenga desde hace años;
- fotos de esa etapa;
- mensaje corto.

Objetivo: mostrar quién es Valen fuera de Medicina.

### Amigos/as de secundaria

Buscar:

- recuerdo de cuándo empezó a hablar de Medicina/UBA;
- anécdota adolescente;
- fotos de transición secundaria → CBC;
- rasgo/frase que todavía conserve;
- mensaje corto.

### Amigos/as del Esnaola / música

Buscar:

- recuerdo creativo/musical;
- canción o artista significativo;
- anécdota de esa etapa;
- fotos;
- mensaje corto.

Objetivo: sumar una faceta no médica al scrapbook.

## 7. Kit mínimo para cualquiera

Si alguien no quiere responder preguntas, pedir sólo:

```text
1 foto
+ 1 recuerdo de 2–5 líneas
+ 1 mensaje de 3–6 líneas
+ 1 audio opcional de 15–30 s
```

Eso alcanza para producir contenido útil.

## 8. Priorización de preguntas

No investigar todo.

Orden recomendado:

1. origen de la vocación;
2. hitos reales de Medicina;
3. frases/latiguillos auténticos;
4. hábitos propios;
5. fotos académicas clave;
6. música/símbolos personales;
7. mensajes reservados para el final.

Una pregunta sólo vale la pena si puede mejorar una sección concreta.

## 9. Inventario de huecos

Después de cada ronda de preview mantener una tabla simple:

| Sección | Falta | Estado | Mejor fuente | Acción |
|---|---|---|---|---|
| Anamnesis | Motivo real para elegir Medicina | pendiente | Familia | preguntar |
| Timeline | 3 hitos académicos memorables | pendiente | Medicina | preguntar |
| Galería | foto con ambo | pendiente | Medicina | pedir foto |
| Finale | mensaje reservado | pendiente | Familia/pareja | pedir después |

Estados permitidos:

```text
confirmado
provisional
pendiente
resuelto
descartado
```

No es necesario convertir este inventario en parte del runtime.

## 10. Cómo procesar feedback

Cada comentario debe terminar en una de estas categorías:

### Bug / incumplimiento de spec

Corregir en la issue correspondiente.

### Contenido faltante

Agregar al inventario y preguntar a la mejor fuente.

### Mejora de UX con impacto real

Crear/ajustar issue con criterio verificable.

### Idea opcional

Backlog; no bloquear MVP.

### Opinión aislada que contradice la visión

Registrar si aporta contexto, pero no implementarla automáticamente.

## 11. Reglas de contenido

- no inventar recuerdos;
- no convertir aproximaciones en citas literales;
- preferir una anécdota concreta a cinco adjetivos;
- preferir una foto con contexto a muchas fotos repetidas;
- mensajes deben sonar como quien los escribió, no como copy corporativo;
- humor alto está permitido, pero debe apoyarse en la personalidad real de Valen;
- no usar notas/recursadas ni hechos académicos sensibles si no están aprobados;
- no usar información de pacientes.

## 12. Cuándo termina la recolección

No termina cuando “contestamos todas las preguntas”.

Termina cuando cada sección importante tiene suficiente material para cumplir su propósito narrativo.

Puede quedar información sin investigar si no mejora la experiencia.

## 13. Salida obligatoria de Issue #27

La Issue #27 debe producir:

- URL de preview;
- capturas mobile;
- inventario de huecos;
- resumen de feedback;
- lista de preguntas dirigida por grupo;
- primera tanda de material recibido;
- decisiones de contenido registradas.

## 14. Freeze

Antes de #26:

- ningún placeholder visible en producción;
- ningún “a corroborar” visible;
- hechos importantes confirmados o eliminados;
- fotos y audios funcionales;
- mensajes revisados;
- contenido validado por schemas;
- feedback importante resuelto o descartado explícitamente.

La versión final puede seguir creciendo después del festejo con fotos de la celebración y la Jura, pero `v1.0.0-celebration` debe cerrar una experiencia completa por sí misma.
