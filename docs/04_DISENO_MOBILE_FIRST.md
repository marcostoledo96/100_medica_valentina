# 04 — Diseño mobile-first

## 1. Viewport objetivo

Diseño base:

**390 × 844 px**

Validar como mínimo:

- 360 px;
- 390 px;
- 412 px;
- 430 px.

Desktop no debe determinar decisiones del layout principal.

## 2. Regla de oro

La web debe poder recorrerse:

- con una mano;
- en vertical;
- sin hover;
- sin teclado;
- sin precisar zoom.

## 3. Touch targets

Mínimo recomendado:

**44 × 44 px**

Separación suficiente entre acciones.

## 4. Layout

### Mobile

- una columna;
- ancho completo controlado;
- padding lateral 16–20 px;
- elementos protagonista full-bleed cuando corresponda.

### Tablet

Se puede ampliar:

- tarjetas;
- timeline;
- galería.

### Desktop

Máximo de contenido sugerido:

900–1100 px.

Evitar “estirar” el diseño móvil a 1920 px.

## 5. Navegación

No usar header alto persistente.

Preferencias:

- progress rail discreto;
- botón sonido flotante;
- acceso de volver solo cuando haga falta.

## 6. Safe areas

Soportar:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

Especialmente si existen controles fijos.

## 7. Jerarquía tipográfica

### Display

Para momentos:

- diagnóstico;
- nombre;
- alta.

### UI

Para expediente y datos.

### Manuscrita

Solo para scrapbook y detalles puntuales.

No usar tipografía manuscrita en párrafos largos.

## 8. Sistema visual

### Fase clínica

- superficies oscuras o neutras;
- líneas finas;
- estados;
- números;
- pequeños acentos verdes;
- ritmo estructurado.

### Fase humana

- fotografías;
- papeles;
- texturas;
- sombras suaves;
- composición menos rígida.

### Finale

- mínima interfaz;
- espacio;
- fotografía;
- texto.

## 9. Color

No depender únicamente de rojo/verde para significado.

Los colores definitivos deben derivarse de:

- personalidad de ella;
- fotografías;
- identidad del festejo.

No copiar la identidad visual oficial de UBA.

## 10. Timeline

Mobile:

```text
● 2020
│
│ título
│ texto
│ imagen
│
● 2021
```

Evitar timeline zig-zag desktop adaptado a teléfonos.

## 11. Galería

Mobile:

- `scroll-snap`;
- swipe horizontal;
- 1 foto principal;
- preview parcial de la siguiente.

No grids de 4 columnas.

## 12. Equipo tratante

Puede usar:

- carrusel;
- tarjetas verticales;
- lista con avatar.

La frase debe tener prioridad sobre decoraciones.

## 13. Scrapbook

### Mobile

Composición guiada.

Ejemplo:

- foto inclinada;
- sticky note;
- siguiente foto;
- captura;
- sticker.

### Desktop

Puede existir composición más libre.

No exigir drag en touch.

## 14. Animación

### Permitido

- fade;
- reveal;
- scale leve;
- parallax muy suave;
- line drawing;
- count-up;
- confetti final.

### Evitar

- scroll hijacking;
- videos background pesados;
- 3D WebGL sin valor narrativo;
- blur permanente;
- partículas constantes;
- elementos que persiguen el cursor.

## 15. Reduced motion

Si el usuario reduce movimiento:

- quitar parallax;
- reemplazar count-up por valor final;
- reducir transiciones;
- sin confetti explosivo.

## 16. Feedback táctil

Puede usarse `navigator.vibrate()` de forma opcional y muy limitada.

No hacerlo requisito.

## 17. Loading

Nunca mostrar spinner genérico si puede integrarse a narrativa.

La intro puede esconder la carga real, pero no debe bloquear artificialmente varios segundos.

## 18. Empty / error states

Ejemplo galería sin audio:

> Este recuerdo no tiene audio.

No usar errores técnicos visibles.

## 19. Orientación

Optimizar vertical.

Landscape debe seguir siendo usable, no necesariamente artístico.

## 20. Checklist de revisión mobile

- [ ] 360 px sin scroll horizontal
- [ ] sin hover requerido
- [ ] botones alcanzables
- [ ] captions legibles
- [ ] lightbox usable
- [ ] audio controlable
- [ ] teclado no rompe layout
- [ ] reduced motion
- [ ] Android Chrome
- [ ] Samsung Internet
- [ ] iPhone Safari
