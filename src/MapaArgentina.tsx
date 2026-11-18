import { useEffect, useRef, useState, type ComponentProps, type MouseEvent as ReactMouseEvent } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps/core";
import { ArrowUpRight, CheckCircle2, MapPin, RotateCcw } from "lucide-react";

/**
 * Fuente geográfica: API Georef / Instituto Geográfico Nacional (Argentina).
 * La presencia comercial es un dato provisto por INFT, NO se calcula por GPS.
 * Para descargar una copia local: npm run map:sync
 */
export const PROVINCIAS_CON_PRESENCIA = [
  "Córdoba", "Chubut", "Santa Cruz", "Tierra del Fuego", "Neuquén",
  "San Luis", "Santiago del Estero", "Jujuy", "Salta", "Tucumán",
  "Mendoza", "Chaco", "Santa Fe", "Formosa", "Catamarca", "Corrientes",
] as const;

const FUENTE_OFICIAL = [
  "/data/argentina-provincias.geojson",
  "https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson",
  "https://apis.datos.gob.ar/georef/api/provincias.geojson",
];

type MapData = ComponentProps<typeof Geographies>["geography"];
type LoadState = "loading" | "ready" | "error";

type FeatureName = {
  properties?: Record<string, unknown> | null;
};

export function nombreProvincia(feature: FeatureName): string {
  const props = feature.properties ?? {};
  const name = props.nombre ?? props.name ?? props.FNA ?? props.NOMBRE ?? props.provincia ?? "";
  return typeof name === "string" ? name : String(name);
}

export function normalizarProvincia(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, " ").replace(/\s+/g, " ").trim().toLowerCase()
    .replace(/^provincia (?:de |del )?/, "").replace(/^ciudad autonoma de /, "");
}

function provinciaEnLista(name: string): boolean {
  const normalized = normalizarProvincia(name);
  return PROVINCIAS_CON_PRESENCIA.some(province => {
    const check = normalizarProvincia(province);
    // Georef devuelve “Tierra del Fuego, Antártida e Islas del Atlántico Sur”.
    return normalized === check || (check === "tierra del fuego" && normalized.startsWith(check));
  });
}

function nombreCorto(name: string): string {
  return normalizarProvincia(name).startsWith("tierra del fuego") ? "Tierra del Fuego" : name;
}

type GeoJsonFeature = {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties?: Record<string, unknown> | null;
};

type Position = [number, number];

/**
 * Algunos GeoJSON oficiales incluyen polígonos del sector antártico o
 * componentes que atraviesan el antimeridiano. Al proyectarlos, sus caminos
 * pueden ocupar miles de píxeles fuera de Argentina. Filtramos por COMPONENTE,
 * sin alterar los límites de las provincias continentales.
 */
function esPoligonoDelArea(polygon: unknown): boolean {
  if (!Array.isArray(polygon) || !Array.isArray(polygon[0])) return false;
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  let vertices = 0;
  for (const ring of polygon) {
    if (!Array.isArray(ring)) return false;
    for (const rawPoint of ring) {
      if (!Array.isArray(rawPoint) || rawPoint.length < 2) return false;
      const point = rawPoint as Position;
      const [lon, lat] = point;
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return false;
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      vertices++;
    }
  }
  // Incluye provincias continentales, Tierra del Fuego e islas australes;
  // excluye la Antártida y geometrías ubicadas al otro lado del meridiano 180°.
  return vertices >= 4
    && maxLat >= -58 && minLat <= -20
    && maxLon >= -77 && minLon <= -52
    && minLon >= -80 && maxLon <= -48
    && minLat >= -59 && maxLat <= -19
    && maxLon - minLon < 32 && maxLat - minLat < 42;
}

/**
 * d3-geo interpreta el exterior de un polígono esférico en sentido HORARIO.
 * GeoJSON RFC 7946 suele exportarlo en antihorario: sin este ajuste, el path
 * representa el complemento del polígono y tapa toda la web con su color.
 */
function orientarAnillo(ring: Position[], exterior: boolean): Position[] {
  let areaDoble = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    areaDoble += a[0] * b[1] - b[0] * a[1];
  }
  const sentidoHorario = areaDoble < 0;
  return sentidoHorario === exterior ? ring : [...ring].reverse();
}

function normalizarPoligono(polygon: unknown): Position[][] {
  return (polygon as Position[][]).map((ring, index) => orientarAnillo(ring, index === 0));
}

function normalizarGeometria(feature: GeoJsonFeature): GeoJsonFeature {
  const { geometry } = feature;
  const polygons = geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)
    ? geometry.coordinates
    : geometry.type === "Polygon" ? [geometry.coordinates] : [];
  return {
    ...feature,
    geometry: {
      type: "MultiPolygon",
      coordinates: polygons.filter(esPoligonoDelArea).map(normalizarPoligono),
    },
  };
}

function esGeoJsonValido(value: unknown): value is { type: "FeatureCollection"; features: GeoJsonFeature[] } {
  return Boolean(value && typeof value === "object" && "type" in value && value.type === "FeatureCollection"
    && "features" in value && Array.isArray(value.features) && value.features.length >= 23
    && value.features.every((feature: GeoJsonFeature) =>
      feature.type === "Feature" && feature.geometry &&
      (feature.geometry.type === "MultiPolygon" || feature.geometry.type === "Polygon")));
}

export default function MapaArgentina({ onContact }: { onContact: () => void }) {
  const [geography, setGeography] = useState<MapData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoadState("loading");
      for (const url of FUENTE_OFICIAL) {
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const payload: unknown = await response.json();
          if (!esGeoJsonValido(payload)) throw new Error("GeoJSON inválido o incompleto");
          if (controller.signal.aborted) return;
          setGeography({ type: "FeatureCollection", features: payload.features.map(normalizarGeometria) } as MapData);
          setLoadState("ready");
          return;
        } catch (error) {
          if (controller.signal.aborted) return;
          // En desarrollo se admite la API pública si aún no se descargó el GeoJSON local.
          console.warn(`[MapaArgentina] No se pudo cargar ${url}`, error);
        }
      }
      if (!controller.signal.aborted) setLoadState("error");
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const positionTooltip = (event: ReactMouseEvent<SVGElement>) => {
    const stage = stageRef.current;
    const tooltip = tooltipRef.current;
    if (!stage || !tooltip) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 80), rect.width - 80);
    const y = Math.max(event.clientY - rect.top - 15, 48);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const currentName = hovered ?? selected;
  const currentPresent = currentName ? provinciaEnLista(currentName) : false;

  return <section id="presencia" data-pencil-id="mapARG" className="federal-section federal-map-section" aria-labelledby="federal-title">
    <div className="federal-map-layout">
      <div className="federal-map-copy">
        <p className="eyebrow">PRESENCIA TERRITORIAL</p>
        <h2 id="federal-title">Estamos cerca de cada municipio.</h2>
        <p className="federal-map-intro">De norte a sur, acompañamos a los gobiernos locales con tecnología, equipamiento y atención personalizada.</p>

        <div className="federal-map-stat"><strong>{PROVINCIAS_CON_PRESENCIA.length}</strong><span>provincias donde INFT tiene presencia</span></div>

        <div className="federal-map-description">
          <h3>Explorá nuestra presencia</h3>
          <p>Seleccioná una provincia en el mapa o elegila en el listado.</p>
        </div>

        <div className="province-chips" aria-label="Provincias con presencia de INFT">
          {PROVINCIAS_CON_PRESENCIA.map(name => <button
            type="button"
            className={`province-chip ${selected === name ? "province-chip-selected" : ""}`}
            key={name}
            aria-pressed={selected === name}
            onClick={() => setSelected(name)}
          ><span className="province-chip-dot"/>{name}</button>)}
        </div>

        <div className="province-detail-card" role="status" aria-live="polite" aria-atomic="true">
          {currentName ? <>
            <div className="province-detail-icon"><MapPin size={19}/></div>
            <div className="province-detail-copy">
              <strong>{nombreCorto(currentName)}</strong>
              <span>{currentPresent ? "MuniTotal tiene presencia en esta provincia." : "Todavía no figura en nuestro listado de presencia."}</span>
            </div>
            {currentPresent && <CheckCircle2 className="province-detail-check" size={21} aria-label="Provincia con presencia"/>}
          </> : <>
            <div className="province-detail-icon"><MapPin size={19}/></div>
            <div className="province-detail-copy">
              <strong>Elegí una provincia</strong>
              <span>Conocé dónde acompañamos a los gobiernos locales.</span>
            </div>
          </>}
        </div>

        <button type="button" className="federal-link" onClick={onContact}>Hablemos de tu municipio <ArrowUpRight size={17}/></button>
      </div>

      <div className="federal-map-visual">
        <div className="federal-map-heading">
          <span>ARGENTINA</span>
          <span>COBERTURA TERRITORIAL</span>
        </div>
        <div className="province-map-stage" ref={stageRef} onMouseLeave={() => setHovered(null)}>
          {loadState === "loading" && <div className="province-map-message" role="status">Cargando mapa de Argentina...</div>}
          {loadState === "error" && <div className="province-map-message" role="alert">
            <p>No se pudo cargar el mapa.</p>
            <span>Podés consultar las provincias desde el listado de la izquierda.</span>
            <button type="button" onClick={() => setAttempt(n => n + 1)}><RotateCcw size={16}/> Reintentar</button>
          </div>}
          {loadState === "ready" && geography && <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [-64, -41], scale: 810 }}
            width={460}
            height={680}
            className="province-map-svg"
            style={{ overflow: "hidden" }}
            role="group"
            aria-label="Mapa interactivo de las provincias de Argentina"
          >
            <defs>
              <clipPath id="munitotal-argentina-map-clip" clipPathUnits="userSpaceOnUse">
                <rect x="0" y="0" width="460" height="680"/>
              </clipPath>
            </defs>
            <g clipPath="url(#munitotal-argentina-map-clip)">
            <Geographies geography={geography}>
              {({ geographies }) => geographies.map(geo => {
                const name = nombreProvincia(geo);
                const present = provinciaEnLista(name);
                const shortName = nombreCorto(name);
                const isSelected = selected === shortName;
                const isHovered = hovered === shortName;
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className={`province-map-shape ${present ? "has-presence" : "no-presence"} ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${shortName}: ${present ? "con presencia de INFT" : "sin presencia informada"}`}
                  aria-pressed={isSelected}
                  onMouseEnter={() => setHovered(shortName)}
                  onMouseMove={positionTooltip}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={event => {
                    const stage = stageRef.current?.getBoundingClientRect();
                    const shape = event.currentTarget.getBoundingClientRect();
                    const tooltip = tooltipRef.current;
                    if (stage && tooltip) {
                      tooltip.style.left = `${Math.max(80, Math.min(stage.width - 80, shape.left - stage.left + shape.width / 2))}px`;
                      tooltip.style.top = `${Math.max(48, shape.top - stage.top)}px`;
                    }
                    setHovered(shortName);
                  }}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected(shortName)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(shortName);
                    }
                  }}
                />;
              })}
            </Geographies>
            </g>
          </ComposableMap>}
          <div className={`province-map-tooltip ${hovered ? "is-visible" : ""}`} ref={tooltipRef} aria-hidden="true">
            <strong>{hovered ? nombreCorto(hovered) : ""}</strong>
            <span>{hovered && provinciaEnLista(hovered) ? "Con presencia" : "Sin presencia informada"}</span>
          </div>
        </div>
        <div className="federal-map-legend" aria-label="Leyenda">
          <span><i className="legend-presence"/> Con presencia</span>
          <span><i className="legend-other"/> Otras provincias</span>
        </div>
        <p className="federal-map-source">Límites provinciales: <a href="https://www.argentina.gob.ar/georef" rel="noopener noreferrer" target="_blank">Georef / IGN</a>. Presencia según información de INFT S.A.</p>
      </div>
    </div>
  </section>;
}
