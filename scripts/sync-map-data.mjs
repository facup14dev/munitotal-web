/**
 * Descarga GeoJSON de las provincias desde Georef (fuente oficial de Argentina).
 * Uso: npm run map:sync
 *       npm run build (lo ejecuta automáticamente si falta el archivo)
 * Nunca incorporar geometrías dibujadas a mano o datos no validados.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const file = join(process.cwd(), "public", "data", "argentina-provincias.geojson");
const urls = [
  "https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson",
  "https://apis.datos.gob.ar/georef/api/provincias.geojson",
];

function isValid(data) {
  return data?.type === "FeatureCollection" && Array.isArray(data.features)
    && data.features.length >= 23 && data.features.every(f => f.type === "Feature" && f.geometry);
}

// El mapa muestra Argentina continental y austral; Antártida se reserva para un mapa aparte.
// Las geometrías de Tierra del Fuego pueden incluir regiones antárticas separadas.
function withinDisplayArea(polygon) {
  let maxLat = -Infinity;
  for (const ring of polygon) for (const point of ring) maxLat = Math.max(maxLat, point[1]);
  return maxLat > -58;
}

function processGeometry(geometry) {
  if (!geometry) return geometry;
  if (geometry.type === "MultiPolygon") return {
    ...geometry,
    coordinates: geometry.coordinates.filter(withinDisplayArea),
  };
  return geometry;
}

function roundedCoordinates(value) {
  if (typeof value === "number") return Math.round(value * 100000) / 100000;
  return Array.isArray(value) ? value.map(roundedCoordinates) : value;
}

async function main() {
  if (process.argv.includes("--if-missing")) {
    try {
      const existing = JSON.parse(await readFile(file, "utf8"));
      if (isValid(existing)) {
        console.log("GeoJSON provincial local: OK.");
        return;
      }
    } catch { /* descargar */ }
  }

  const errors = [];
  for (const url of urls) {
    try {
      console.log(`Descargando provincias desde ${url}`);
      const res = await fetch(url, { headers: { accept: "application/geo+json, application/json" }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!isValid(data)) throw new Error("La API no devolvió un FeatureCollection con 23+ jurisdicciones");
      const features = data.features.map(feature => {
        const geometry = processGeometry(feature.geometry);
        return { type: "Feature", properties: feature.properties, geometry: {
          ...geometry, coordinates: roundedCoordinates(geometry.coordinates),
        }};
      });
      await mkdir(join(process.cwd(), "public", "data"), { recursive: true });
      await writeFile(file, JSON.stringify({ type: "FeatureCollection", features }), "utf8");
      console.log(`Guardado: ${file} (${features.length} jurisdicciones).`);
      return;
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  console.error("No se pudieron descargar los límites provinciales oficiales:");
  for (const e of errors) console.error(` - ${e}`);
  console.error("Revisá tu conexión e intentá: npm run map:sync");
  process.exitCode = 1;
}

await main();
