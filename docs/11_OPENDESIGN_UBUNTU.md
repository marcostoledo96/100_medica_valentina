# OpenDesign en Ubuntu — instalación, arranque y troubleshooting

Este documento registra el flujo validado para usar **OpenDesign en Ubuntu** durante la exploración visual de `%100 médica`.

La instalación utilizada trabaja en modo local con:

- OpenDesign ejecutado desde el repositorio fuente;
- interfaz web local;
- daemon local;
- CLI `od`;
- **Pi** como agente local de diseño.

> Este runbook fue validado con OpenDesign `0.20.3`, Node.js `24.x` y el workspace de OpenDesign usando `pnpm 10.33.2`.

## 1. Ubicación local esperada

En esta máquina OpenDesign vive en:

```text
~/Apps/open-design
```

Antes de arrancar, comprobar:

```bash
node --version
pnpm --version
git --version
command -v od
command -v pi
```

Valores observados al validar este flujo:

```text
Node: v24.x
pnpm del workspace: 10.33.2
od: ~/.local/bin/od
pi: ~/.local/bin/pi
```

OpenDesign fija su propia versión de pnpm para el workspace. No es necesario forzar una actualización global de pnpm para abrir la aplicación.

## 2. Primera preparación o actualización

Desde una terminal:

```bash
cd ~/Apps/open-design
git status
git pull
pnpm install
```

`git status` debe mostrar un árbol de trabajo limpio antes de actualizar.

Si `pnpm install` informa que el lockfile ya está actualizado, no hace falta realizar ninguna otra instalación.

## 3. Forma recomendada de abrir OpenDesign

Para evitar puertos aleatorios, usar siempre puertos fijos:

```bash
cd ~/Apps/open-design
pnpm tools-dev stop
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

Cuando todo funciona debe aparecer algo equivalente a:

```text
OpenDesign dev server ready

Web:    http://127.0.0.1:17573/
Daemon: http://127.0.0.1:17456/

Press Ctrl+C to stop
```

Mientras se usa OpenDesign, **esa terminal debe permanecer abierta**.

Abrir en el navegador:

```text
http://127.0.0.1:17573/
```

## 4. Verificar que el runtime está vivo

En una segunda terminal:

```bash
cd ~/Apps/open-design
pnpm tools-dev status
```

Con la aplicación abierta, el daemon y la web deben aparecer activos.

También se puede verificar la conexión directa entre `od` y el daemon:

```bash
od project list --daemon-url http://127.0.0.1:17456
```

Si devuelve una lista de proyectos —aunque esté vacía— la conexión `od -> daemon` funciona.

## 5. Verificar que OpenDesign detecta Pi

OpenDesign detecta agentes locales desde su endpoint `/api/agents`.

Para inspeccionarlos:

```bash
curl -s http://127.0.0.1:17456/api/agents | python3 -m json.tool
```

Buscar una entrada similar a:

```text
id: pi
name: Pi
available: true
path: /home/marcos/.local/bin/pi
```

Si `Pi` aparece como `available: true`, OpenDesign puede usarlo como runtime local.

## 6. Error de login Cloud / Vela

Al abrir OpenDesign desde código fuente en Ubuntu puede aparecer el onboarding Cloud con errores como:

```text
/api/integrations/vela/status -> 503
/api/integrations/vela/login -> 500
/api/amr/models -> 500
```

o un mensaje equivalente a:

```text
vela binary not found
```

Ese error pertenece al flujo **OpenDesign Cloud / AMR**. No implica que el daemon local, la UI web, `od` o Pi estén rotos.

Para el flujo de `%100 médica` usamos **Pi local**, por lo que no es necesario resolver Vela para empezar la exploración visual.

No instalar un paquete arbitrario llamado `vela` sólo por compartir ese nombre: primero hay que comprobar que se trate específicamente del runtime esperado por OpenDesign.

## 7. Saltar el onboarding Cloud usando un proyecto local

Si la interfaz queda atrapada en `/onboarding`, crear un proyecto local mediante `od`:

```bash
od project create \
  --name "%100 médica — Exploración visual" \
  --mode design \
  --daemon-url http://127.0.0.1:17456 \
  --json
```

El comando devuelve un `project.id`.

Abrir después:

```text
http://127.0.0.1:17573/projects/<PROJECT_ID>
```

La ruta de proyecto permite entrar directamente al laboratorio local sin depender del login Cloud.

## 8. Problemas frecuentes

### `desktop exited before exposing status`

En Ubuntu, si:

```bash
pnpm tools-dev
```

intenta levantar la superficie desktop y falla, usar el modo web:

```bash
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

### `daemon is already running ... owner-bound starts require a clean namespace`

Hay un proceso previo todavía activo.

Ejecutar:

```bash
pnpm tools-dev stop
```

Luego volver a iniciar OpenDesign.

### `ECONNREFUSED 127.0.0.1:17456`

No hay daemon escuchando en ese puerto.

Comprobar:

```bash
pnpm tools-dev status
```

Si está detenido, iniciar nuevamente:

```bash
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

### Puertos aleatorios

`tools-dev` puede asignar puertos dinámicos si no se especifican. Para evitar perder la conexión entre navegador y CLI, este proyecto usa:

```text
Web:    17573
Daemon: 17456
```

## 9. Cerrar OpenDesign

Si está corriendo en foreground, usar `Ctrl+C` en la terminal principal.

Si quedó algún proceso administrado activo:

```bash
cd ~/Apps/open-design
pnpm tools-dev stop
```

## 10. Resumen rápido

Para abrir OpenDesign en una sesión normal:

```bash
cd ~/Apps/open-design
pnpm tools-dev stop
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

Luego abrir:

```text
http://127.0.0.1:17573/
```

Para comprobar Pi:

```bash
curl -s http://127.0.0.1:17456/api/agents | python3 -m json.tool
```

Para listar proyectos:

```bash
od project list --daemon-url http://127.0.0.1:17456
```

## 11. Regla para `%100 médica`

Durante la fase de exploración visual:

- OpenDesign funciona como laboratorio de diseño;
- Pi funciona como agente local;
- GitHub sigue siendo la fuente de verdad del proyecto;
- no se debe modificar el repositorio real desde un experimento de OpenDesign hasta que una dirección visual haya sido comparada y aprobada;
- el login Cloud/Vela no es requisito para el flujo local actual.
