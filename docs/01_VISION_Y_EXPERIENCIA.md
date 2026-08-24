# 01 — Visión y experiencia

## 1. Nombre conceptual

Nombre provisional:

**Alta Médica**

Opciones futuras:

- Epicrisis
- Alta Definitiva
- Caso Cerrado
- Expediente Dra. [Apellido]
- Historia de una Médica
- Código Dra.

El nombre de repositorio no necesita ser el nombre visible del producto.

## 2. Usuario principal

La protagonista.

## 3. Usuarios secundarios

- familia;
- amistades;
- compañeros de carrera;
- invitados al festejo.

## 4. Contexto de uso

Caso principal:

1. recibe una tarjeta, cartel o regalo;
2. encuentra un QR;
3. abre la web desde el celular;
4. experimenta el recorrido completo;
5. comparte algunas pantallas con quienes están alrededor.

## 5. Duración

Objetivo:

**5–10 minutos** para una primera experiencia completa.

No hacer una web que requiera 30 minutos de lectura.

## 6. Estructura narrativa

### Escena 00 — Boot

Objetivo: intriga.

Ejemplo:

> SISTEMA DE EGRESOS  
> Consultando expediente...

Secuencia:

- loading breve;
- identificación del expediente;
- nombre;
- estado;
- CTA “Abrir historia clínica”.

Duración máxima sugerida: 4–6 s si el usuario no interactúa.

Debe existir “saltar intro”.

---

### Escena 01 — Expediente

Presenta:

- nombre;
- foto;
- año de ingreso;
- año de egreso;
- estado;
- progreso 100%;
- diagnóstico inicial ficticio;
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

No superar 2–3 bloques cortos.

---

### Escena 03 — Evolución

Timeline de momentos.

No tiene que ser “cada año”.

Cada entrada debe justificar su existencia.

Tipos:

- académico;
- personal;
- gracioso;
- hospital;
- amistad;
- hito.

Ejemplo:

> 2022  
> “No llego al parcial.”  
> Llegó.

---

### Escena 04 — Signos vitales

Dashboard ficticio.

Ejemplos:

- cafés;
- horas de sueño;
- PDFs;
- “no llego”;
- finales aprobados;
- guardias;
- km recorridos;
- mensajes enviados al grupo.

Los valores pueden ser reales o deliberadamente absurdos.

Si son inventados, deben sentirse claramente humorísticos.

---

### Escena 05 — Estudios complementarios

Galería fotográfica.

Naming:

- estudio;
- fecha;
- hallazgo;
- observación.

Interacciones:

- swipe;
- tap;
- zoom;
- captions.

---

### Escena 06 — Equipo tratante

Familiares y amigos.

Cada persona puede incluir:

- nombre;
- foto;
- “especialidad” humorística;
- vínculo;
- mensaje corto.

Ejemplos:

- Soporte vital
- Guardia emocional
- Consultoría pre-parcial
- Provisión de mate
- Servicio de rescate académico

---

### Escena 07 — Archivo histórico

Cambio visual importante.

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

Trivia / minijuego de 3–5 preguntas.

Objetivo:

descanso lúdico, no desafío real.

Ejemplos:

- ¿Qué hacer la noche antes de un final?
- ¿Cuál fue la frase más repetida?
- ¿Qué bebida sostuvo la carrera?

Debe poder omitirse.

---

### Escena 09 — Achievements

No necesariamente una pantalla independiente.

Los logros pueden aparecer durante todo el recorrido.

Logros sugeridos:

- Anatomía Survivor
- “No llego”
- Guardia Infinita
- Café IV
- Final Boss
- 100% Completion

Los achievements secretos agregan rejugabilidad.

---

### Escena 10 — Epicrisis

Recapitula la historia.

Formato:

- motivo de ingreso;
- evolución;
- complicaciones;
- tratamiento;
- respuesta;
- estado al alta.

El tono pasa lentamente del humor a lo emocional.

---

### Escena 11 — Diagnóstico definitivo

Pantalla de transición.

Muy poco contenido.

> Diagnóstico definitivo  
> **MÉDICA**

Debe sentirse como un momento.

---

### Escena 12 — Alta

Se rompe la estética clínica.

Contenido:

- gran fotografía;
- nombre;
- mensaje final;
- fecha;
- posible audio;
- confetti moderado.

Ejemplo conceptual:

> Entraste queriendo convertirte en médica.  
> Hoy te vas habiéndolo conseguido.

---

## 7. Navegación

### Principal

Scroll narrativo vertical.

### Secundaria

Indicador de progreso discreto.

No usar navbar tradicional como eje de la experiencia.

### Accesos rápidos

Después de completar el recorrido:

- volver a fotos;
- volver al scrapbook;
- escuchar mensajes;
- compartir.

## 8. Estados

### Primera visita

Experiencia guiada.

### Visita posterior

Puede ofrecer:

**Volver al inicio**  
**Ir a recuerdos**

No bloquear contenido por “progreso”.

## 9. Sonido

Nunca autoplay con volumen.

Opciones:

- botón “Activar sonido”;
- música ambiental;
- audios de amigos;
- efecto sutil de monitor al inicio.

El sitio debe funcionar completo sin audio.

## 10. Emoción

Distribución sugerida:

- 35% humor;
- 35% nostalgia;
- 20% sorpresa;
- 10% solemnidad.

El último 15–20% del recorrido debe reducir el humor para que el cierre tenga peso.
