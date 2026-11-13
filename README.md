# MuniTotal — Landing con scroll effect (diseño aprobado)

Adaptación de la entrega `landing-scroll.zip` del cliente al proyecto **React + TypeScript + Vite** existente. Se mantuvieron los colores, las imágenes, los textos y la composición, con el comportamiento de scroll del export original. También se conservaron los modales y los formularios del REQ anterior.

## Qué incluye

- Header sticky, fondo translúcido al desplazarse y barra de progreso bordó.
- Scroll suave con enlaces `#inicio`, `#soluciones`, `#acompanamiento`, `#contacto`, compensados para que el encabezado fijo no tape el inicio de cada sección.
- Sección activa destacada en el menú del encabezado.
- Animación escalonada de aparición al ingresar al viewport (`IntersectionObserver`). Contempla `prefers-reduced-motion` y visibilidad de elementos enfocados mediante teclado.
- Diseño responsive de 320 px hasta desktop (CSS original del export, adaptado para React).
- Cuatro categorías del REQ con diálogos informativos: Software municipal GGMM, Infraestructura y hardware, Soluciones ciudadanas e Insumos municipales. Las etiquetas visuales siguen el diseño aprobado.
- Mapa interactivo de las 23 provincias y CABA (límites de Georef/IGN); 14 provincias con presencia destacadas, selección táctil y por teclado, tooltip, leyenda y listado accesible.
- Modal de contacto y formulario con POST a `/api/contact.php`, enlaces de correo, teléfono y WhatsApp.
- Enlaces a `ggmm.com.ar` e `inft.com.ar`.
- Metadatos SEO básicos y recurso fotográfico optimizado (WebP).

## Archivos

- `src/LandingScroll.tsx`: estructura visual portando `landing-scroll/index.html` a JSX, con los identificadores `data-pencil-id` del diseño y el código de scroll del `scroll.js` reimplementado en `useEffect` de React.
- `src/styles.css`: reglas del `scroll.css` entregado, más estilos ya existentes de modales y sección de provincias.
- `src/App.tsx`: modales, formulario, enlaces externos y contenido funcional de las cuatro áreas.
- `src/MapaArgentina.tsx`: mapa interactivo de provincias y comportamiento de selección.
- `scripts/sync-map-data.mjs`: sincronización del GeoJSON oficial.
- `public/hero-showroom.webp`: asset original `assets/munitotal-showroom.jpg`, convertido a WebP para el sitio.
- `api/contact.php` y `api/mail-config.example.php`: backend PHP y ejemplo de variables de correo para IIS.
- `integracion-inft/`: componente reutilizable de la unidad MuniTotal para la web de INFT (pendiente de integrar en el repositorio de esa web).

**Importante:** el ZIP recibido incluía una carpeta `.browser-profile` con datos temporales de un navegador. Esos archivos no se incluyeron en este proyecto ni se requieren en producción.

## Mapa interactivo de Argentina

La sección **Presencia territorial** se reemplazó por `src/MapaArgentina.tsx` (React Simple Maps 5). El color bordó indica las 14 provincias indicadas por el cliente; las otras jurisdicciones aparecen grises. El mapa permite hover, clic, Enter/Espacio, selección por listado y tiene un estado de error recuperable.

**Importante: se necesita descargar una vez el GeoJSON local antes de publicar:**

```powershell
npm install
npm run map:sync
```

El comando obtiene las geometrías oficiales de Georef y crea `public/data/argentina-provincias.geojson`. El mapa consulta primero ese archivo local; en desarrollo puede probar el servicio oficial en línea como respaldo. Para `npm run build` se comprueba que el archivo esté disponible y se intenta descargar si falta. El build se detiene si la descarga falla, para evitar publicar un mapa sin datos. **Conservá el GeoJSON en el repo** para no depender de la API al hacer deploys posteriores. Los límites oficiales incluyen 23 provincias y CABA; la vista cartográfica se centra en la Argentina continental/austral (sin el sector antártico).

Fuente: https://www.argentina.gob.ar/georef/descarga-de-la-base-completa

Para modificar la cobertura comercial, editar `PROVINCIAS_CON_PRESENCIA` en `src/MapaArgentina.tsx`. Este dato es proporcionado por INFT; no significa que se haya verificado una instalación en cada provincia.

## Ejecutar en Windows

```powershell
cd munitotal-web
npm install
npm run map:sync
npm run dev
```

Abrir la URL local informada por Vite (por defecto `http://localhost:5173`). Para crear el build:

```powershell
npm run build
```

Subir **el contenido de** `dist/` al sitio IIS de `munitotal.com.ar` después de probarlo en staging. El directorio `api/` se publica **por separado** en la raíz `/api` del sitio IIS. El build Vite no ejecuta código PHP.

### Configurar el formulario

1. Asegurar que el servidor IIS cuente con PHP y PHPMailer (autoload `../vendor/autoload.php` desde `api/contact.php`).
2. Crear `api/mail-config.php` a partir de `api/mail-config.example.php` únicamente en el servidor y agregar las credenciales SMTP válidas.
3. Verificar un envío real hacia `munitotal@inft.com.ar`. No subir credenciales a Git ni al ZIP.

En el entorno Vite, sin PHP, el formulario mostrará un mensaje de error de envío y ofrecerá los canales alternativos de contacto. Eso es esperado hasta probarlo en el entorno IIS con PHP.

## Pruebas recomendadas

- Comparar el hero con la maqueta original en 1440 px, 1024 px y 390 px.
- Probar enlaces del header: llevan a secciones visibles sin quedar tapadas por el menú sticky.
- Desplazarse a mitad de página: la barra avanza y las tarjetas aparecen con animación.
- Probar los cuatro modales, los enlaces GGMM/INFT, el contacto y el cierre con Escape.
- Probar la preferencia del sistema «Reducir movimiento» (sin animaciones ni contenido oculto).
- Verificar el formulario con PHPMailer habilitado en staging/producción.

## Pendientes antes de la publicación definitiva

- Validación visual y funcional en el navegador local después de `npm install`.
- Aprobación institucional del texto de privacidad (el aviso actual es preliminar).
- Prueba real de correo en IIS, verificación de bindings/certificado HTTPS del dominio.
- Integración de la nueva unidad de negocio en `inft.com.ar` a partir de su repositorio actual.

## Notas técnicas

- El segundo export del cliente usa **estilos CSS inline** en el HTML y archivos `scroll.css`/`scroll.js` para las animaciones. Por eso el JSX generado conserva estilos inline y los identificadores originales. La configuración de Tailwind existente queda en el proyecto por compatibilidad, pero este nuevo export no depende del CDN ni requiere clases Tailwind para sus efectos.
- El observer, los eventos de scroll y las preferencias de movimiento se montan y limpian dentro de `useEffect`, evitando ejecutar el script del cliente directamente sobre un árbol administrado por React.
- La maqueta incluye los enlaces visuales, pero no todos los formularios y ventanas requeridos por el REQ. Esos componentes están integrados desde la implementación anterior.
