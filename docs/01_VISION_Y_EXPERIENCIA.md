# 01 — Visión y experiencia

## 1. Nombre del proyecto

**%100 médica**

El nombre visible del producto es definitivo.

## 2. Usuario principal

Valentina.

## 3. Usuarios secundarios

- familia;
- amistades;
- compañeros de carrera;
- invitados al festejo;
- colaboradores que verán la preview y aportarán recuerdos antes del release.

## 4. Contexto de uso final

Caso principal:

1. Valen termina su última materia;
2. recibe el elemento físico del festejo con estética de receta/alta;
3. encuentra un QR;
4. abre `%100 médica` desde el celular;
5. recorre la experiencia completa;
6. comparte la web con quienes quiera después del festejo.

## 5. Contexto de validación previa

Antes del release final existe una **preview de Vercel**.

La preview no busca tener todo el contenido definitivo. Su objetivo es:

- validar ritmo narrativo;
- validar el salto visual clínica → humana → finale;
- mostrar a amigos/familia qué tipo de material falta;
- generar preguntas concretas en vez de entrevistas exhaustivas;
- descubrir anécdotas y fotos que no surgirían sin ver la experiencia.

La preview puede usar datos confirmados, fixtures provisionales y placeholders intencionales. Nunca debe inventar hechos biográficos para verse completa.

## 6. Duración

Objetivo final:

**5–10 minutos** para una primera experiencia completa.

La preview de M1 puede ser mucho más corta: sólo debe demostrar el arco narrativo.

## 7. Estructura narrativa

### Escena 00 — Boot

Objetivo: intriga.

Ejemplo conceptual:

> SISTEMA DE EGRESOS  
> Consultando expediente...

Secuencia:

- loading breve;
- identificación del expediente;
- nombre;
- estado;
- CTA “Abrir historia clínica”.

Debe existir “Saltar intro”.

---

### Escena 01 — Expediente

Presenta:

- nombre;
- foto;
- año de ingreso;
- año de egreso;
- estado;
- progreso 100%;
- diagnóstico ficticio;
- pronóstico.

CTA:

**Ver evolución**

---

### Escena 02 — Anamnesis

Cómo comenzó la historia.

Puede incluir:

- por qué eligió Medicina;
- foto de primeros años;
- frase de esa época;
- primera gran anécdota.

Si estos datos todavía no están corroborados durante la preview, la sección puede mantenerse mínima o usar un placeholder editorial claro.

---

### Escena 03 — Evolución

Timeline de momentos relevantes.

No tiene que ser “cada año”.

Cada entrada debe justificar su existencia.

Tipos:

- académico;
- personal;
- gracioso;
- hospital;
- amistad;
- hito.

No usar como reales frases como “no llego”, materias traumáticas o anécdotas si nadie las confirmó.

---

### Escena 04 — Signos vitales

Dashboard ficticio de métricas humorísticas.

Ejemplos válidos sólo si están confirmados o son claramente absurdos:

- consumo de mate;
- fotos de apuntes;
- horas de estudio;
- cantidad de grupos;
- uso intensivo de herramientas de estudio;
- otras costumbres propias de Valen.

No presentar cifras inventadas con apariencia de dato real.

---

### Escena 05 — Estudios complementarios

Galería fotográfica con:

- swipe;
- tap;
- zoom;
- captions;
- fecha opcional;
- hallazgo/observación humorística opcional.

---

### Escena 06 — Equipo tratante

Familiares y amigos.

Cada persona puede incluir:

- nombre;
- foto;
- “especialidad” humorística;
- vínculo;
- mensaje corto/mediano;
- audio opcional.

Los mensajes se recolectan principalmente después de mostrar la preview.

---

### Escena 07 — Archivo histórico

La UI clínica cede espacio a un scrapbook.

Elementos:

- polaroids;
- notas;
- capturas;
- tickets;
- stickers;
- frases;
- fechas;
- recuerdos.

No debe requerir drag obligatorio en mobile.

---

### Escena 08 — Evaluación

Trivia / minijuego breve de 3–5 preguntas.

Objetivo: descanso lúdico, no desafío real.

Las mejores preguntas deben surgir de anécdotas recogidas después de la preview.

Debe poder omitirse.

---

### Escena 09 — Achievements

Pueden aparecer durante todo el recorrido.

Deben apoyarse en hechos reales, hitos claros o chistes explícitamente absurdos. Los achievements secretos agregan rejugabilidad, pero no contienen información esencial.

---

### Escena 10 — Epicrisis

Recapitula la historia:

- ingreso;
- evolución;
- dificultades;
- soporte;
- resultado;
- estado al alta.

El tono pasa lentamente del humor a lo emocional.

---

### Escena 11 — Diagnóstico definitivo

Pantalla breve:

> Diagnóstico definitivo  
> **MÉDICA**

Debe sentirse como un momento.

---

### Escena 12 — Alta

Se rompe la estética clínica.

Contenido:

- fotografía protagonista;
- Dra. Valentina / forma final acordada;
- mensaje final;
- fecha;
- posible audio;
- confetti moderado.

El cierre debe poder funcionar aunque el sonido esté apagado.

## 8. Navegación

### Principal

Scroll narrativo vertical y nativo.

### Secundaria

Indicador de progreso discreto.

No usar navbar tradicional como eje de la experiencia.

### Accesos rápidos después de completar

- volver a fotos;
- volver al scrapbook;
- escuchar mensajes;
- compartir;
- repetir experiencia.

## 9. Estados

### Primera visita

Experiencia guiada.

### Visita posterior

Puede ofrecer:

- volver al inicio;
- ir a recuerdos.

No bloquear contenido por progreso.

## 10. Sonido

Nunca autoplay con volumen.

Opciones:

- botón “Activar sonido”;
- música ambiental;
- audios de amigos;
- efecto sutil de monitor al inicio.

El sitio debe funcionar completo sin audio.

## 11. Tono emocional

Referencia:

- ~40% humor y anécdota;
- ~35% nostalgia/recuerdos;
- ~15% sorpresa lúdica;
- ~10% cierre emotivo.

El último 15–20% debe reducir el humor para que el cierre tenga peso.

## 12. Criterio de preview

La primera preview está lograda cuando alguien cercano puede verla y responder preguntas concretas como:

- “¿Qué momento falta en este timeline?”
- “¿Qué frase real pondrías acá?”
- “¿Qué foto representa mejor esta etapa?”
- “¿Qué hábito de estudio de Valen debería aparecer en signos vitales?”

Si la preview sólo genera comentarios visuales y no ayuda a obtener mejores recuerdos, todavía no cumple su propósito de producto.
