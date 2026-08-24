# 00 — Propósito y principios

## 1. Propósito

Crear una experiencia web pública, indexable y personal que celebre la graduación de Valentina en Medicina (UBA).

La web debe funcionar como:

- regalo;
- recuerdo;
- experiencia interactiva;
- archivo de momentos de la carrera;
- elemento central del festejo físico mediante QR;
- sitio que pueda seguir existiendo y evolucionando después del festejo.

No se busca construir una aplicación sanitaria.

## 2. Idea central

El sitio presenta inicialmente a la protagonista como si fuera una paciente dentro de un sistema hospitalario ficticio.

La carrera es reinterpretada como una internación prolongada:

- ingreso → inicio de Medicina;
- antecedentes → materias, parciales y dificultades;
- evolución → años de carrera;
- estudios complementarios → fotografías;
- equipo tratante → amigos y familiares;
- signos vitales → estadísticas humorísticas;
- epicrisis → resumen del recorrido;
- diagnóstico definitivo → MÉDICA;
- alta → final de la carrera.

## 3. Transformación narrativa

### Inicio

- frío;
- preciso;
- clínico;
- tipografía funcional;
- lenguaje de sistema;
- datos y estados.

### Desarrollo

Empiezan a aparecer:

- fotografías;
- frases reales;
- nombres;
- audios;
- humor;
- elementos manuscritos;
- composición más orgánica.

### Final

La metáfora médica desaparece.

La última pantalla debe ser humana, emotiva y sencilla. No tiene que sentirse como una “pantalla de software”.

## 4. Principios de producto

### P01 — Personal antes que espectacular

Una foto real con una historia concreta vale más que una animación compleja sin significado.

### P02 — Mobile-first real

El diseño de 360–430 px es el diseño principal. Desktop es una adaptación posterior.

### P03 — Una sola historia

No diseñar una colección de widgets. Cada sección debe responder:

> ¿Por qué esta pantalla existe dentro del relato?

### P04 — Humor con cariño

La parodia médica puede ser exagerada, pero nunca humillante.

Evitar bromas sobre:

- salud real;
- diagnósticos verdaderos;
- pacientes;
- notas/recursadas si no están explícitamente aprobadas;
- hechos que no ocurrieron sólo porque funcionan como chiste.

### P05 — No fingir ser un sistema real

Debe quedar claro que es una experiencia de celebración. No utilizar marcas oficiales de hospitales ni copiar interfaces clínicas 1:1.

### P06 — Publicación consciente

La versión final será pública e indexable. El contenido debe revisarse antes del release para evitar datos ajenos innecesarios o información de pacientes/terceros que no corresponda publicar.

Las fotos aportadas para el proyecto pueden formar parte de producción; el foco de la revisión no es esconder el regalo sino garantizar que lo visible sea deliberado.

### P07 — Contenido desacoplado

Fotos, frases, mensajes, años, achievements y textos deben vivir fuera de los componentes.

### P08 — Progressive enhancement

La historia debe seguir siendo comprensible si:

- no carga audio;
- se reduce movimiento;
- falla una animación;
- se abre desde un teléfono lento.

### P09 — Sin backend salvo necesidad concreta

El MVP debe poder existir como sitio estático.

### P10 — El final manda

Toda la experiencia debe construir hacia:

**MÉDICA → ALTA DEFINITIVA**

### P11 — Preview antes que investigación exhaustiva

No bloquear el desarrollo esperando toda la biografía, fotos, mensajes o audios.

Primero se construye un vertical slice con contenido confirmado y fixtures controlados. Después se publica una preview y se usa esa experiencia visible para pedir información concreta a quienes mejor conocen cada etapa.

Flujo:

```text
vertical slice
→ preview
→ feedback
→ recolección dirigida
→ contenido real progresivo
→ freeze
```

Ningún dato dudoso debe presentarse como hecho definitivo sólo para completar visualmente la preview.

## 5. No objetivos

Este proyecto no intenta:

- enseñar medicina;
- dar recomendaciones clínicas;
- reemplazar una historia clínica;
- crear un portfolio profesional;
- ser una plantilla comercial;
- ser reutilizable para cualquier graduado antes de ser excelente para Valentina;
- mostrar cada año o cada materia sólo porque existen.

## 6. Métrica de éxito

No se mide por pageviews.

El proyecto es exitoso si:

1. Valen reconoce detalles personales y siente que la experiencia fue hecha específicamente para ella;
2. puede recorrerla cómodamente desde su celular;
3. amigos y familia entienden la historia sin explicación adicional;
4. el final produce una sensación clara de cierre;
5. la preview ayuda a descubrir mejores recuerdos y contenido;
6. el sitio sigue siendo un recuerdo valioso después del festejo.
