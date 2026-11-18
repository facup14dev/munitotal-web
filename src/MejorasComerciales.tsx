import { useState } from "react";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, FileCheck2, FileText,
  Handshake, Play, ScanLine, ShieldCheck, UsersRound,
} from "lucide-react";

type ActionHandler = (action: string) => void;

export function DigitalizacionDestacada({ onAction }: { onAction: ActionHandler }) {
  return (
    <section className="digitalizacion-feature" aria-labelledby="digitalizacion-heading" data-pencil-id="digitalizacionFeature">
      <div className="digitalizacion-feature__content">
        <div className="digitalizacion-feature__symbol" aria-hidden="true"><ScanLine size={32} strokeWidth={1.65}/></div>
        <div className="digitalizacion-feature__copy">
          <p className="eyebrow">SOLUCIÓN DESTACADA · TRANSFORMACIÓN DIGITAL</p>
          <h2 id="digitalizacion-heading">Digitalización municipal. <em>Menos papel, más gestión.</em></h2>
          <p>Expedientes digitales, firma electrónica y herramientas para simplificar los trámites y la atención ciudadana.</p>
          <div className="digitalizacion-feature__tags" aria-label="Servicios de digitalización">
            <span><FileText size={15}/> Expedientes</span>
            <span><FileCheck2 size={15}/> Firma electrónica</span>
            <span><BadgeCheck size={15}/> Trámites digitales</span>
          </div>
        </div>
        <button type="button" className="digitalizacion-feature__button" onClick={() => onAction("open:digitalization")}>
          Conocer el servicio <ArrowUpRight size={18} aria-hidden="true"/>
        </button>
      </div>
    </section>
  );
}

export function NosotrosEmpresa() {
  return (
    <section id="nosotros" className="nosotros-empresa" aria-labelledby="nosotros-heading" data-pencil-id="nosotrosEmpresa">
      <div className="nosotros-empresa__content">
        <div className="nosotros-empresa__copy">
          <p className="eyebrow">QUIÉNES SOMOS</p>
          <h2 id="nosotros-heading">La experiencia de INFT. <span>La mirada integral de MuniTotal.</span></h2>
          <p>Con el respaldo de INFT S.A. y la experiencia de GGMM, reunimos en una sola propuesta software, infraestructura, soluciones ciudadanas e insumos para gobiernos locales.</p>
          <p>Conocemos los desafíos de la gestión municipal y acompañamos a cada equipo con soluciones concretas y atención directa.</p>
          <div className="nosotros-empresa__links">
            <a href="https://www.inft.com.ar" target="_blank" rel="noopener noreferrer">Conocer INFT <ArrowUpRight size={17}/></a>
            <a href="https://www.ggmm.com.ar" target="_blank" rel="noopener noreferrer">Conocer GGMM <ArrowUpRight size={17}/></a>
          </div>
        </div>
        <div className="nosotros-empresa__aside">
          <div className="nosotros-empresa__mark"><Handshake size={31}/></div>
          <p className="nosotros-empresa__caption">NUESTRO COMPROMISO</p>
          <p className="nosotros-empresa__promise">Siempre te atiende una persona.</p>
          <p className="nosotros-empresa__description">Un equipo que escucha, asesora y acompaña a tu municipio de principio a fin.</p>
          <div className="nosotros-empresa__foot"><UsersRound size={18}/> Personas detrás de cada solución</div>
        </div>
      </div>
    </section>
  );
}

type VideoSource =
  | { kind: "youtube" | "vimeo"; url: string }
  | { kind: "file"; url: string };

// Acepta un MP4/WebM en IIS (/videos/...) o un HTTPS externo para la demo.
// No permite esquemas inseguros ni URLs relativas ambiguas.
function parseVideoSource(input: string | undefined): VideoSource | null {
  const raw = input?.trim();
  if (!raw) return null;
  const isLocalPath = raw.startsWith("/") && !raw.startsWith("//");
  if (!isLocalPath && !raw.startsWith("https://")) return null;
  try {
    const url = new URL(raw, "https://munitotal.com.ar");
    if (url.protocol !== "https:") return null;
    if (isLocalPath) {
      if (!/\.(mp4|webm)$/i.test(url.pathname)) return null;
      return { kind: "file", url: `${url.pathname}${url.search}` };
    }
    const host = url.hostname.toLowerCase();
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be", "www.youtube-nocookie.com"].includes(host)) {
      const id = host.endsWith("youtu.be") ? url.pathname.slice(1) :
        url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : url.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return { kind: "youtube", url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
      return null;
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = url.pathname.match(/(?:\/video)?\/(\d+)(?:\/|$)/)?.[1];
      if (id) {
        const hash = url.searchParams.get("h");
        return { kind: "vimeo", url: `https://player.vimeo.com/video/${id}${hash ? `?h=${encodeURIComponent(hash)}&autoplay=1` : "?autoplay=1"}` };
      }
      return null;
    }
    // Archivo directo en IIS/CDN (no servicios que requieren iframe).
    if (/\.(mp4|webm)$/i.test(url.pathname)) return { kind: "file", url: url.toString() };
    return null;
  } catch {
    return null;
  }
}

const source = parseVideoSource(import.meta.env.VITE_TESTIMONIO_VIDEO_URL);


 const configuredPoster = import.meta.env.VITE_TESTIMONIO_POSTER_URL;
 const poster = configuredPoster?.startsWith("https://") || configuredPoster?.startsWith("/") ? configuredPoster : "/hero-showroom.webp";
 const configuredSubtitles = import.meta.env.VITE_TESTIMONIO_SUBTITULOS_URL;

 const subtitles = configuredSubtitles?.startsWith("https://") ||
   (configuredSubtitles?.startsWith("/") && !configuredSubtitles.startsWith("//"))
   ? configuredSubtitles : undefined;

export function TestimonioGerardo({ onAction }: { onAction: ActionHandler }) {
  const [play, setPlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const retryVideo = () => {
    setVideoError(false);
    setPlay(false);
  };
  return (
    <section id="testimonio" className="testimonio-section" aria-labelledby="testimonio-heading" data-pencil-id="testimonioGerardo">
      <div className="testimonio-section__container">
        <div className="testimonio-section__intro">
          <p className="eyebrow">TESTIMONIOS</p>
          <h2 id="testimonio-heading">La experiencia, <span>en primera persona.</span></h2>
          <p>Conocé el testimonio de Gerardo y el valor de contar con un equipo que acompaña a los municipios.</p>
          <button className="testimonio-section__link" type="button" onClick={() => onAction("open:contact")}>Hablemos de tu municipio <ArrowRight size={18}/></button>
        </div>
        <div className="testimonio-section__video-wrap">
          <div className="testimonio-section__video">
            {source && videoError ? (
              <div className="testimonio-section__error" role="alert">
                <strong>No se pudo cargar el video.</strong>
                <span>Verificá tu conexión o intentá nuevamente.</span>
                <button type="button" onClick={retryVideo}>Volver a intentar</button>
              </div>
            ) : source && play ? (
              source.kind === "file" ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  poster={poster}
                  className="testimonio-section__player"
                  onError={() => setVideoError(true)}
                  aria-label="Testimonio completo de Gerardo"
                >
                  <source src={source.url} type={source.url.toLowerCase().includes(".webm") ? "video/webm" : "video/mp4"}/>
                  {subtitles && <track kind="captions" src={subtitles} srcLang="es" label="Español"/>}
                  Tu navegador no admite la reproducción de este video.
                </video>
              ) : (
                <iframe className="testimonio-section__player" src={source.url} title="Testimonio de Gerardo sobre MuniTotal" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
              )
            ) : source ? (
              <button type="button" onClick={() => setPlay(true)} className="testimonio-section__poster" aria-label="Reproducir testimonio de Gerardo">
                <img src={poster} alt="" loading="lazy"/>
                <span className="testimonio-section__play"><Play size={31} fill="currentColor"/></span>
                <span className="testimonio-section__play-label">Reproducir testimonio completo · aprox. 20 minutos</span>
              </button>
            ) : (
              <div className="testimonio-section__placeholder">
                <img src={poster} alt="" loading="lazy"/>
                <div className="testimonio-section__pending"><Play size={24}/><strong>Testimonio de Gerardo</strong><span>Video en preparación</span></div>
              </div>
            )}
          </div>
          <div className="testimonio-section__video-meta">
            <span><ShieldCheck size={17}/> Una atención cercana y personalizada</span>
            <span>{source ? "Video completo · aprox. 20 minutos" : "Pendiente de incorporar el video aprobado"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
