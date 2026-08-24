# 09 — Deploy y release

## 1. Hosting canónico

El proyecto se desplegará en **Vercel**.

Arquitectura de deploy:

```text
GitHub
  ↓
Vercel Preview Deployments
  ↓
validación / feedback
  ↓
Vercel Production
  ↓
QR final
```

## 2. Ambientes

### Local

Desarrollo.

### Preview

Dos usos:

1. preview automática de PRs;
2. **preview de producto de M1 (#27)** para mostrar la experiencia a colaboradores y recolectar contenido dirigido.

La preview:

- puede usar fixtures/placeholders;
- no es la URL del QR final;
- no es canonical de producción;
- no necesita estar completa para ser útil.

### Production

URL pública, estable e indexable a la que apunta el QR del festejo.

## 3. Estrategia de preview M1

Después del vertical slice (#7):

1. desplegar en Vercel;
2. validar 360/390/430 px;
3. compartir con un grupo reducido;
4. mostrar la experiencia, no sólo screenshots;
5. preguntar por huecos concretos;
6. registrar feedback;
7. lanzar recolección dirigida por grupo;
8. continuar M2–M5 mientras llega contenido.

No esperar a tener todas las fotos/mensajes/audios para crear la preview.

## 4. URL y dominio

La URL final debe ser estable y razonablemente corta.

Puede usarse:

- dominio propio;
- subdominio;
- dominio de Vercel si se decide mantenerlo.

La decisión exacta puede cerrarse más cerca del release.

## 5. Indexación

Decisión vigente:

**Producción será indexable por buscadores.**

Requisitos:

- `robots.txt` permite indexación de producción;
- no usar `noindex` en producción;
- canonical apunta a la URL final;
- title/description/OG correctos;
- previews no se presentan como canonical.

Si Vercel o la configuración elegida protege automáticamente previews de indexación, mantener ese comportamiento; no es necesario que las previews sean descubribles por buscadores.

## 6. QR

El QR físico debe apuntar a la URL estable de producción.

No apuntar directamente a:

- Vercel Preview Deployment;
- branch URL;
- build hash;
- URL temporal.

## 7. QR impreso

Validar:

- varios tamaños razonables;
- papel real;
- poca luz;
- Android;
- iOS cuando sea posible;
- cámara nativa.

Incluir texto/URL fallback si el diseño físico lo permite.

El concepto actual del objeto físico es una pieza con estética de **receta/alta médica** que integra el QR.

## 8. Freeze

Antes del festejo:

- congelar nuevas features;
- resolver feedback importante de #27;
- reemplazar/eliminar fixtures;
- revisar contenido provisional;
- comprobar fotos/mensajes/audios;
- ejecutar auditoría final;
- sólo aceptar fixes después del freeze.

## 9. Backup

Mantener:

- tag Git;
- commit SHA;
- contenido final;
- assets finales;
- QR final;
- URL de producción.

## 10. Release tags

Referencia:

```text
v0.1.0-prototype
v0.2.0-preview
v0.5.0-content-complete
v0.9.0-rc1
v1.0.0-celebration
```

## 11. Checklist producción

- [ ] URL/dominio final
- [ ] HTTPS
- [ ] producción indexable
- [ ] canonical correcto
- [ ] robots correcto
- [ ] title/description
- [ ] favicon
- [ ] OG/social preview
- [ ] responsive
- [ ] audios/videos
- [ ] imágenes
- [ ] mobile devices
- [ ] errores de consola
- [ ] enlaces
- [ ] content freeze
- [ ] QR
- [ ] release tag
- [ ] rollback/redeploy documentado

## 12. Release y QR

Orden recomendado:

```text
#26 content freeze
→ RC final
→ #21/#22/#23/#24 verdes
→ production deploy
→ confirmar URL/canonical/indexación
→ generar QR final
→ probar QR físico
→ tag v1.0.0-celebration
```

No imprimir el QR definitivo antes de estabilizar la URL de producción.

## 13. Después del festejo

La web debe seguir existiendo.

Evoluciones ya previstas:

- fotos del propio festejo;
- Jura;
- posibles recuerdos adicionales descubiertos después.

No es necesario convertir el proyecto en una plataforma permanente ni agregar backend para estas actualizaciones: pueden seguir siendo contenido estático versionado.

## 14. Modo archivo futuro

Si la intro deja de tener sentido meses después, puede evaluarse un modo archivo:

- intro más corta;
- acceso directo a recuerdos;
- mantener timeline;
- mantener mensajes;
- mantener finale como registro del momento.

Ese cambio debe hacerse después del evento y en una issue independiente.
