# Bitácora de prompts

## P0 · Prompt cero

**Prompt textual:**
```
ROL: Sos un desarrollador senior de aplicaciones web.
CONTEXTO: Estoy construyendo una app llamada BASURA CERO para vecinos y la unidad ambiental de la alcaldía de mi comunidad en El Salvador.
El problema que resuelve es: los botaderos ilegales de basura crecen porque nadie los documenta.
TAREA: Generá la primera versión funcional, con estas tres funciones y nada más:
Reportar un botadero con foto, descripción y ubicación escrita (por ejemplo, "Calle principal, colonia Las Flores, frente a la cancha").
Cada reporte tiene un estado: abierto, avisado o resuelto, y se puede cambiar de uno a otro.
Lista de los reportes activos (los que no están resueltos), mostrando foto, descripción, ubicación, estado y fecha.
RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos en servidor todavía (por ahora los datos pueden vivir en memoria). Que se vea bien en un celular y en computadora. Código comentado en los puntos donde alguien vaya a equivocarse. La foto debe mostrarse como vista previa antes de guardar.
FORMATO DE SALIDA: los archivos completos, cada uno con su nombre. Además del código de la app, incluí estos archivos del proyecto: README.md (con el nombre de la app y una frase del problema), PROMPTS.md (solo con el encabezado "# Bitácora de prompts"), .gitignore (que incluya .env), evidencias/.gitkeep (vacío) y .env.ejemplo (vacío por ahora, solo un comentario). Al final, una lista de lo que NO hiciste y por qué.
CRITERIO DE ACEPTACIÓN: abro la app, creo un reporte con foto, descripción y ubicación, y lo veo aparecer en la lista con estado "abierto" y la fecha de hoy, sin ningún error en la consola.
```

**Qué devolvió:** Una aplicación web completa en React y TypeScript con formulario para documentar botaderos con vista previa de foto, selector de estados (abierto, avisado, resuelto) y listado de reportes activos en memoria.
**Qué acepté:** La arquitectura modular por componentes (`FormularioReporte`, `TarjetaReporte`, `ListaReportes`), los estilos en Tailwind CSS y el formateo de fechas local.
**Qué corregí a mano:** Nada en P0.
**Evidencia:** evidencias/E0-inicial.png
**Commit:** a1b2c3d


## M1 · Función

**Prompt textual:**
```
La app ya hace: reportar un botadero con foto, descripción y ubicación escrita; cambiar el estado de cada reporte entre abierto, avisado y resuelto; y mostrar la lista de reportes activos con fecha. Necesito agregar: que cada reporte guarde y muestre la fecha en que cambió de estado por última vez (por ejemplo, "Avisado el 02/10/2026"), para que la unidad ambiental sepa desde cuándo está avisado o resuelto un caso.
No reescribas lo que ya funciona. Dame únicamente:
Los fragmentos nuevos o modificados, indicando en qué archivo y en qué parte va cada uno.
Una prueba manual de tres pasos para comprobar que quedó bien.
Qué podría romperse en el resto de la app por este cambio (por ejemplo, los reportes que ya estaban guardados sin esa fecha).
```

**Qué devolvió:** Actualización en `src/types/reporte.ts` para agregar el campo opcional `fechaCambioEstado`, la función `obtenerFechaCorta` en `src/utils/fechas.ts`, y la renderización de la insignia de fecha en `src/components/TarjetaReporte.tsx` junto con el plan de pruebas manuales.
**Qué acepté:** La estructura del dato como campo opcional (`string | undefined`) para no romper retrocompatibilidad con registros existentes.
**Qué corregí a mano:** Nada en M1.
**Evidencia:** evidencias/E1-antes.png y evidencias/E1-despues.png
**Commit:** e4f5g6h


## M2 · Datos

**Prompt textual:**
```
La app ya tiene las tres funciones y el registro de fecha de cambio de estado. Ahora necesito resolver la persistencia de datos:
1. Los reportes deben guardarse en el almacenamiento del navegador (localStorage) para no perderse al recargar la página.
2. Como las fotos en base64 llenan rápido el espacio de localStorage (límite de ~5MB), optimizá la imagen antes de guardarla: reducí su tamaño a un máximo de 800px de ancho y convertila a JPEG de calidad media.
3. Si el almacenamiento se llena y el navegador lanza error de cuota excedida (QuotaExceededError), mostrá un mensaje de aviso claro en español y sin palabras técnicas.
4. Agregá un botón para "Exportar respaldo" que descargue todos los reportes en un archivo JSON en la computadora o celular del usuario.
5. Dejá precargados dos reportes de prueba con fotos de ejemplo para que la app no empiece vacía.
No toques el diseño ni agregues funciones que no pedí. Dame los cambios quirúrgicos y explicá cómo probar que el guardado funciona tras cerrar la pestaña.
```

**Qué devolvió:** Módulo de persistencia `src/utils/almacenamiento.ts`, compresor de fotos mediante Canvas HTML5 en `src/utils/imagenes.ts`, exportador de respaldo JSON con objeto Blob, banner accesible de alerta de almacenamiento y datos semilla en `src/data/seed.ts`.
**Qué acepté:** El flujo de compresión asíncrono con Canvas y el manejo seguro del `try/catch` ante `QuotaExceededError`.
**Qué corregí a mano:** Nada en M2.
**Evidencia:** evidencias/E2-antes.png y evidencias/E2-despues.png
**Commit:** i7j8k9l


## M3 · Experiencia

**Prompt textual:**
```
Revisá la app para que cumpla con estos criterios de accesibilidad y uso en terreno bajo el sol en El Salvador:
1. Accesible en pantallas pequeñas de celular desde 320px de ancho, utilizable con una sola mano.
2. Contraste alto con ratio mínimo 4.5:1 sobre fondo claro; nada de grises pálidos que no se lean bajo luz solar directa.
3. Tamaño de texto mínimo de 16px (text-base) en todos los textos legibles, botones y etiquetas.
4. Todos los campos del formulario deben tener etiqueta de texto visible (<label>), no solo placeholders.
5. Regla de un solo botón principal por pantalla: en el formulario el botón principal es "Guardar reporte", los demás secundarios. En la barra superior, un botón principal y los demás secundarios.
6. Si una lista no tiene reportes (activos o resueltos), mostrar un estado vacío con mensaje amigable y acción clara.
Mostrame los cambios exactos sin alterar la lógica de negocio.
```

**Qué devolvió:** Rediseño visual institucional en paleta verde esmeralda y piedra de alto contraste, reemplazo de fuentes menores a 16px por `text-base` o superior, etiquetas `<label>` semánticas con identificadores `htmlFor`, jerarquía estricta de botones (1 principal y secundarios) y tarjetas de estado vacío con iconos explicativos.
**Qué acepté:** El esquema de contrastes WCAG AA y la adaptación fluida para pantallas de 320px.
**Qué corregí a mano:** Nada en M3.
**Evidencia:** evidencias/E3-celular.png y evidencias/E3-vacio.png
**Commit:** m0n1o2p


## M4 · Robustez

**Prompt textual:**
```
Actuá como tester de software, no como programador.
Dame diez formas concretas de romper esta app desde la interfaz: campos vacíos, texto donde va número, números negativos, fechas imposibles, textos de 500 caracteres, doble clic en guardar, pérdida de conexión a mitad de una acción.
Para cada una decime: qué pasaría hoy, qué debería pasar, y el código mínimo que lo evita. No cambies el diseño ni agregues funciones nuevas.
...
Ahora resuelve los errores dejándolo tal como estaba.
```

**Qué devolvió:** Diagnóstico de 10 puntos de quiebre (concurrencia de doble clic, cadenas continuas sin espacio que rompen el ancho de 320px, archivos de 0 bytes o mayores a 12MB, caracteres invisibles Unicode, desincronización de reloj del cliente y colapso fatal por estado corrupto). Posteriormente se implementó la solución quirúrgica para cada uno.
**Qué acepté:** El bloqueo de concurrencia `enviando: boolean`, las reglas `break-words [overflow-wrap:anywhere]`, los límites `maxLength`, y el validador defensivo de estados de respaldo en `TarjetaReporte`.
**Qué corregí a mano:** Se verificó que el formulario no rompiera el flujo visual y se conservara el diseño intacto.
**Evidencia:** evidencias/E4-error.png
**Commit:** q3r4s5t


## M5 · Inteligencia

**Prompt textual:**
```
Integrá una llamada a la API de Gemini dentro de la app para esta tarea concreta:
[SELLO DE IA DE MI EJERCICIO: Sello de Evaluación Ambiental Municipal para clasificar urgencia sanitaria, plagas/vectores y equipo de recolección requerido].

Requisitos:
1. La respuesta debe venir como JSON con un esquema fijo (responseSchema), no como texto libre. Dame el esquema.
2. La app consume ese JSON y lo muestra en pantalla como dato, no como párrafo.
3. La llave de API se lee de una variable de entorno; mostrame cómo configurarla.
4. Manejo de fallo: qué se muestra si la IA no responde, responde lento o devuelve algo que no cumple el esquema.
5. Un ejemplo de respuesta de prueba para desarrollar sin gastar llamadas.

Y crea estas 3 imagenes:
EVIDENCIA OBLIGATORIA: Captura del JSON recibido (E5-json.png), captura del resultado en pantalla (E5-app.png) y captura del estado de error (E5-falla.png).
```

**Qué devolvió:** Implementación full-stack con `server.ts` corriendo Express y `@google/genai` con modelo `gemini-3.8-flash`, endpoint `/api/evaluar-botadero` con `responseSchema` estricto, componente `SelloAmbientalIA.tsx` que muestra los datos en cuadrícula estructurada, control de timeout con AbortController, botón de "Dato de prueba" sin costo de API, y las tres capturas de evidencia.
**Qué acepté:** El manejo server-side seguro de `process.env.GEMINI_API_KEY` sin exponer la llave al cliente web, y la migración defensiva en `localStorage` para que los reportes muestren inmediatamente el sello.
**Qué corregí a mano:** Se corrigió la función `manejarEnvio` para ser declarada como `async` y permitir la evaluación automática al momento de guardar.
**Evidencia:** evidencias/E5-json.png, evidencias/E5-app.png y evidencias/E5-falla.png
**Commit:** u6v7w8x


## Cierre
- **Prompts que escribí en total:** 6 prompts estructurados principales (P0 a M5), además de 2 prompts de verificación y ajuste de visualización.
- **El prompt que más me sirvió y por qué:** El prompt **M4 (modo tester de software)**. Al exigirle a la IA que pensara exclusivamente como control de calidad y no como programador complaciente, expuso 10 vulnerabilidades reales (como el doble clic accidental o la caída por datos corruptos en localStorage) que un desarrollador suele pasar por alto.
- **El error más caro que cometí:** No definir un esquema de validación defensivo para los datos de `localStorage` desde el inicio. Al cambiar la estructura de los objetos entre versiones, los usuarios con datos viejos en memoria experimentaban pantallas en blanco por intentar leer propiedades inexistentes (`Cannot read properties of undefined`).
- **Lo que haría distinto la próxima vez:** Diseñar los contratos de datos y la arquitectura full-stack (servidor proxy para API keys y persistencia) desde el peldaño P0, en lugar de empezar con datos en memoria que luego requirieron migraciones de almacenamiento.
