import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight, Building2, CheckCircle2, ExternalLink, Mail,
  MapPinned, MessageCircle, Phone, X,
} from "lucide-react";
import LandingScroll from "./LandingScroll";

type ModalKey = "software" | "hardware" | "citizen" | "supplies" | "digitalization" | "contact" | "privacy";
type FormState = "idle" | "sending" | "success" | "error";

const solutions: Record<Exclude<ModalKey, "contact" | "privacy">, {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  link?: { href: string; label: string };
}> = {
  software: {
    number: "01", eyebrow: "SOFTWARE MUNICIPAL", title: "Una gestión más simple. Un municipio conectado.",
    description: "Con la experiencia de GGMM, conectamos las áreas municipales para simplificar procesos, ordenar la información y mejorar la atención.",
    items: ["Administración y finanzas", "Trámites y expedientes", "Obras públicas", "Atención ciudadana", "Seguridad y gestión municipal"],
    link: { href: "https://www.ggmm.com.ar", label: "Visitar GGMM" },
  },
  hardware: {
    number: "02", eyebrow: "INFRAESTRUCTURA Y HARDWARE", title: "La tecnología que respalda tu gestión.",
    description: "Equipamiento y conectividad para que las distintas áreas municipales trabajen de forma integrada y segura.",
    items: ["Computadoras", "Servidores", "Tótems", "Conectividad interna", "Dispositivos", "Tecnología para centros de monitoreo"],
  },
  citizen: {
    number: "03", eyebrow: "SOLUCIONES CIUDADANAS", title: "Más cerca de cada vecino.",
    description: "Canales digitales y herramientas para simplificar el vínculo entre el municipio y las personas.",
    items: ["Digitalización de oficinas", "Pagos en línea", "Reclamos", "Turnos", "Trámites en línea", "Portales de autogestión"],
  },
  digitalization: {
    number: "05", eyebrow: "DIGITALIZACIÓN MUNICIPAL", title: "Menos papel. Más gestión y mejores servicios.",
    description: "Acompañamos la digitalización de procesos y documentación municipal para agilizar el trabajo cotidiano y acercar los servicios a los vecinos.",
    items: ["Digitalización de expedientes y documentación", "Firma electrónica y herramientas para la gestión digital", "Trámites y servicios en línea", "Canales digitales de atención y reclamos"],
  },
  supplies: {
    number: "04", eyebrow: "INSUMOS PARA MUNICIPIOS", title: "Todo para el trabajo diario.",
    description: "Centralizamos la provisión de equipamiento e insumos para acompañar las tareas y servicios municipales.",
    items: ["Semaforización LED", "Insumos para oficinas", "Equipamiento municipal", "Dispositivos de trabajo"],
  },
};

function ContactForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    name: "", municipality: "", email: "", phone: "", interest: "", message: "", website: "",
  });
  const update = (name: keyof typeof values, value: string) => setValues(v => ({ ...v, [name]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...values, unit: "munitotal" }),
      });
      const result: { ok?: boolean; message?: string } = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "No se pudo enviar la consulta.");
      setStatus("success");
    } catch (reason) {
      setStatus("error");
      setError(reason instanceof Error ? reason.message : "Ocurrió un problema con el envío.");
    }
  };

  if (status === "success") {
    return <div className="contact-success" role="status">
      <CheckCircle2 size={42} color="#36785a"/>
      <h3>¡Gracias por escribirnos!</h3>
      <p>Recibimos tu consulta y nos pondremos en contacto con vos.</p>
      <button type="button" className="outline-button" onClick={() => {
        setValues({ name: "", municipality: "", email: "", phone: "", interest: "", message: "", website: "" });
        setStatus("idle");
      }}>Enviar otra consulta</button>
    </div>;
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="field-row">
      <label>Nombre y apellido <span>*</span>
        <input required maxLength={120} autoComplete="name" value={values.name} onChange={e => update("name", e.target.value)} placeholder="Tu nombre"/>
      </label>
      <label>Municipio / Organización <span>*</span>
        <input required maxLength={120} autoComplete="organization" value={values.municipality} onChange={e => update("municipality", e.target.value)} placeholder="Nombre del municipio"/>
      </label>
    </div>
    <div className="field-row">
      <label>Correo electrónico <span>*</span>
        <input type="email" required maxLength={180} autoComplete="email" value={values.email} onChange={e => update("email", e.target.value)} placeholder="tu@email.com"/>
      </label>
      <label>Teléfono
        <input type="tel" maxLength={50} autoComplete="tel" value={values.phone} onChange={e => update("phone", e.target.value)} placeholder="Código de área y número"/>
      </label>
    </div>
    <label>¿Qué solución te interesa?
      <select value={values.interest} onChange={e => update("interest", e.target.value)}>
        <option value="">Seleccionar una opción</option>
        <option>Software GGMM</option>
        <option>Digitalización municipal</option>
        <option>Infraestructura y hardware</option>
        <option>Soluciones ciudadanas</option>
        <option>Insumos para municipios</option>
        <option>Consulta general</option>
      </select>
    </label>
    <label>Contanos qué necesitás <span>*</span>
      <textarea required rows={4} maxLength={4000} value={values.message} onChange={e => update("message", e.target.value)} placeholder="Describí tu consulta o proyecto..."/>
    </label>
    <div className="anti-spam" aria-hidden="true">
      <label htmlFor="company-site">Sitio web (dejar vacío)</label>
      <input id="company-site" name="website" autoComplete="off" tabIndex={-1} value={values.website} onChange={e => update("website", e.target.value)}/>
    </div>
    {status === "error" && <p className="form-error" role="alert">{error} Podés contactarnos también por correo o WhatsApp.</p>}
    <button type="submit" disabled={status === "sending"} className="primary-button">
      {status === "sending" ? "Enviando..." : "Enviar consulta"}<ArrowUpRight size={18}/>
    </button>
    <p className="form-note">Los campos marcados con * son obligatorios.</p>
  </form>;
}

function Modal({ modal, close, open }: { modal: ModalKey; close: () => void; open: (key: ModalKey) => void }) {
  const heading = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = originalOverflow; document.removeEventListener("keydown", escape); last?.focus(); };
  }, [close]);

  const solution = modal in solutions ? solutions[modal as keyof typeof solutions] : undefined;
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
    <div className={`modal-panel ${modal === "contact" ? "modal-contact" : ""}`} role="dialog" aria-modal="true" aria-labelledby={heading}>
      <button type="button" className="modal-close" aria-label="Cerrar ventana" onClick={close} ref={closeButton}><X size={22}/></button>
      {solution && <>
        <div className="modal-overline"><span>{solution.number}</span>{solution.eyebrow}</div>
        <h2 id={heading}>{solution.title}</h2>
        <p className="modal-lead">{solution.description}</p>
        <div className="modal-divider"/>
        <h3>¿Qué ofrecemos?</h3>
        <ul className="solution-list">{solution.items.map(item => <li key={item}><CheckCircle2 size={17}/>{item}</li>)}</ul>
        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={() => open("contact")}>Consultar por esta solución <ArrowUpRight size={18}/></button>
          {solution.link && <a className="outline-button" href={solution.link.href} target="_blank" rel="noopener noreferrer">{solution.link.label}<ExternalLink size={16}/></a>}
        </div>
      </>}
      {modal === "contact" && <>
        <div className="modal-overline"><Building2 size={18}/> CONTACTO DIRECTO</div>
        <h2 id={heading}>Hablemos de tu municipio.</h2>
        <p className="modal-lead"><strong>Siempre serás atendido por una persona.</strong> Contanos qué necesitás y te ayudamos a encontrar la solución.</p>
        <div className="contact-details">
          <a href="mailto:munitotal@inft.com.ar"><Mail size={18}/> munitotal@inft.com.ar</a>
          <a href="https://wa.me/5493512272454" target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> WhatsApp: 351 2272454</a>
          <a href="tel:+543512272454"><Phone size={18}/> 351 2272454</a>
          <span><MapPinned size={18}/> Eva Perón 124, Alta Gracia, Córdoba</span>
        </div>
        <ContactForm/>
      </>}
      {modal === "privacy" && <>
        <div className="modal-overline">INFORMACIÓN SOBRE PRIVACIDAD</div>
        <h2 id={heading}>Privacidad de tus consultas.</h2>
        <p className="modal-lead">Los datos que ingresás en el formulario son utilizados para responder tu consulta comercial y establecer contacto con vos.</p>
        <p>Si necesitás consultar sobre el tratamiento de tus datos, escribinos a <a href="mailto:munitotal@inft.com.ar">munitotal@inft.com.ar</a>.</p>
        <p className="form-note">Este aviso es una versión inicial y requiere revisión institucional antes de su publicación definitiva.</p>
      </>}
    </div>
  </div>;
}

export default function App() {
  const [modal, setModal] = useState<ModalKey | null>(null);
  const open = (value: string) => {
    if (!value.startsWith("open:")) return;
    const key = value.slice(5) as ModalKey;
    if (key === "software" || key === "hardware" || key === "citizen" || key === "supplies" || key === "digitalization" || key === "contact" || key === "privacy") setModal(key);
  };
  return <>
    <LandingScroll onAction={open}/>
    {modal && <Modal key={modal} modal={modal} close={() => setModal(null)} open={setModal}/>}
  </>;
}
