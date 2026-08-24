# 09 — Deploy y release

## 1. Ambientes

### Local

Desarrollo.

### Preview

Cada PR.

### Production

URL del QR.

## 2. Hosting

Recomendado:

**Vercel**

## 3. Dominio

Opciones:

- subdominio personal;
- dominio corto nuevo;
- `dra-nombre.*`;
- nombre creativo del proyecto.

Evitar URLs largas porque terminan impresas o compartidas.

## 4. Privacidad

Por defecto:

```text
noindex
nofollow opcional
```

Si el contenido es personal, no depender únicamente de “nadie conoce el link”.

Para mayor privacidad se puede agregar protección posterior.

## 5. QR

El QR físico debe apuntar a una URL estable.

No apuntar directamente a:

- preview;
- branch URL;
- build hash.

Ideal:

```text
https://dominio.com/
```

## 6. QR impreso

Validar:

- 3 tamaños;
- papel real;
- poca luz;
- Android;
- iOS;
- cámara nativa.

Incluir texto fallback corto debajo.

## 7. Freeze

48–72 horas antes del festejo:

- congelar features;
- solo correcciones;
- reemplazar contenido;
- ejecutar auditoría.

## 8. Backup

Mantener:

- tag Git;
- commit SHA;
- export de contenido;
- assets finales;
- QR final.

## 9. Release tags

Ejemplo:

```text
v0.1.0-prototype
v0.5.0-content-complete
v0.9.0-rc1
v1.0.0-celebration
```

## 10. Checklist producción

- [ ] dominio final
- [ ] HTTPS
- [ ] noindex
- [ ] favicon
- [ ] OG
- [ ] responsive
- [ ] audios
- [ ] imágenes
- [ ] mobile devices
- [ ] QR
- [ ] analytics desactivado o revisado
- [ ] errores de consola
- [ ] enlaces
- [ ] content freeze
- [ ] `v1.0.0`

## 11. Después del festejo

No hace falta apagar la web.

Puede transformarse en un **modo archivo**:

- intro más corta;
- acceso directo a recuerdos;
- mantener timeline;
- mantener mensajes;
- retirar elementos temporales.

## 12. Evolución opcional

Una futura versión puede agregar:

- cápsula de tiempo;
- mensajes posteriores;
- fotos del propio festejo;
- recuerdos de la Jura;
- primera residencia;
- primer año como médica.

Esto debería hacerse como nueva etapa narrativa y no inflar el MVP original.
