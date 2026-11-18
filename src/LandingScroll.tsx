import { useEffect, useRef, type MouseEvent, type KeyboardEvent } from "react";
import MapaArgentina from "./MapaArgentina";
import { DigitalizacionDestacada, NosotrosEmpresa, TestimonioGerardo } from "./MejorasComerciales";

/**
 * Port fiel de landing-scroll/index.html y scroll.css del cliente.
 * Los identificadores data-pencil-id se preservan porque el efecto de scroll
 * utiliza esos identificadores para revelar los elementos de la maqueta.
 */
interface LandingScrollProps { onAction: (action: string) => void; }
const sections: [string, string][] = [["Ejw9O","inicio"],["xm2nb","soluciones"],["WmtGi","acompanamiento"],["nosotrosEmpresa","nosotros"],["HoEnZ","contacto"]];
const groups = [
  ["cid50","VyvhM","CFdrG","wJixt","UWSFL","KMvqy"],
  ["l8mlT","MeFev","vqMax","evxul"], ["O6nbJ1","m7gF1"],
  ["YDZc8","IaUi0","g4BGBl","rK9wy"], ["zfVmC","fLndA","YS0jG","n328tV"],
  ["mapARG"], ["oXHjc","LlggU"]
];

export default function LandingScroll({ onAction }: LandingScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const activate = (element: HTMLElement) => {
    const action = element.dataset.action;
    if (action) onAction(action);
  };
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (target && event.currentTarget.contains(target)) activate(target);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target as HTMLElement;
    if (!target.matches("[data-action]")) return;
    event.preventDefault();
    activate(target);
  };

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const node = (id: string) => root.querySelector<HTMLElement>(`[data-pencil-id="${id}"]`);
    const header = node("VEugx");
    const progress = root.querySelector<HTMLElement>(".scroll-progress");
    if (!header || !progress) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveals = groups.flat().map(id => node(id)).filter((element): element is HTMLElement => Boolean(element));
    let observer: IntersectionObserver | undefined;
    const reveal = (element: HTMLElement) => {
      element.classList.replace("reveal-pending", "reveal-visible");
      observer?.unobserve(element);
    };
    if ("IntersectionObserver" in window && !reduced.matches) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      groups.forEach(group => group.forEach((id, index) => {
        const element = node(id);
        if (!element) return;
        element.style.setProperty("--reveal-delay", `${Math.min(index, 3)*80}ms`);
        element.classList.add("reveal-pending");
        observer?.observe(element);
      }));
    }
    const focus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement)?.closest<HTMLElement>(".reveal-pending");
      if (element) { element.style.setProperty("--reveal-delay", "0ms"); reveal(element); }
    };
    root.addEventListener("focusin", focus);
    const onReducedChange = () => {
      if (reduced.matches) { observer?.disconnect(); reveals.forEach(reveal); }
    };
    reduced.addEventListener("change", onReducedChange);

    let queued = false;
    let frame = 0;
    const updateScroll = () => {
      queued = false;
      const doc = document.documentElement;
      const height = doc.scrollHeight - window.innerHeight;
      const fraction = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      progress.style.transform = `scaleX(${fraction})`;
      header.classList.toggle("is-scrolled", window.scrollY > 16);
      const headerHeight = header.getBoundingClientRect().height;
      doc.style.setProperty("--header-offset", `${headerHeight}px`);
      let current = "inicio";
      for (const [id, name] of sections) {
        const section = node(id);
        if (section && section.getBoundingClientRect().top <= headerHeight + 100) current = name;
      }
      if (fraction >= 0.99) current = "contacto";
      let marked = false;
      for (const link of header.querySelectorAll<HTMLAnchorElement>("a[href^='#']")) {
        if (!marked && link.hash === `#${current}`) { link.setAttribute("aria-current", "location"); marked = true; }
        else link.removeAttribute("aria-current");
      }
    };
    const schedule = () => {
      if (!queued) { queued = true; frame = requestAnimationFrame(updateScroll); }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    void document.fonts?.ready.then(schedule);
    updateScroll();
    return () => {
      observer?.disconnect();
      root.removeEventListener("focusin", focus);
      reduced.removeEventListener("change", onReducedChange);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);

  return (
    <div className="landing-scroll" ref={container} onClick={handleClick} onKeyDown={handleKeyDown}>
    <div data-pencil-id="bi8Au" data-pencil-name="MuniTotal · Landing desktop" style={{"alignItems": "flex-start", "backgroundColor": "#F8F7F4", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "0px", "height": "fit-content", "justifyContent": "flex-start", "overflow": "hidden", "width": "1440px"}}>
      <div role="navigation" aria-label="Navegación principal" data-pencil-id="VEugx" data-pencil-name="Navegación principal" style={{"alignItems": "center", "borderColor": "#DEDCD7", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "99.5px", "justifyContent": "space-between", "margin": "0px 0px -0.5px 0px", "padding": "0px 72px", "width": "1440px"}}>
        <a data-pencil-id="UtE6e" data-pencil-name="MuniTotal identidad" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "8px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}} href="#inicio" className="scroll-link">
          <div data-pencil-id="SBWJ8" data-pencil-name="Marca MuniTotal" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "29px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-1.2px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            MuniTotal
          </div>
          <div data-pencil-id="xoFOS" data-pencil-name="Acento de marca" style={{"backgroundColor": "#852940", "borderRadius": "50%", "boxSizing": "border-box", "flexShrink": "0", "height": "7px", "width": "7px"}} />
        </a>
        <div data-pencil-id="FHYQL" data-pencil-name="Enlaces principales" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "32px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
          <a data-pencil-id="Hx2kQ" data-pencil-name="Soluciones" style={{"boxSizing": "border-box", "color": "#454A50", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#soluciones" className="scroll-link">
            Soluciones
          </a>
          <a data-pencil-id="N7jUx" data-pencil-name="Cómo trabajamos" style={{"boxSizing": "border-box", "color": "#454A50", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#acompanamiento" className="scroll-link">
            Cómo trabajamos
          </a>
          <a data-pencil-id="hSOxx" data-pencil-name="Nosotros" style={{"boxSizing": "border-box", "color": "#454A50", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#nosotros" className="scroll-link">
            Nosotros
          </a>
        </div>
        <a data-pencil-id="h2dc9l" data-pencil-name="Contacto principal" style={{"alignItems": "center", "backgroundColor": "#852940", "borderRadius": "5px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "20px", "height": "fit-content", "justifyContent": "flex-start", "outlineOffset": "-0.5px", "outline": "1px solid #852940", "padding": "17px 22px", "width": "fit-content"}} href="#contacto" className="scroll-link">
          <div data-pencil-id="ngl0s" data-pencil-name="Contacto principal texto" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Hablemos de tu municipio
          </div>
          <svg data-pencil-id="N327o" data-pencil-name="Contacto principal flecha" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "18px", "width": "18px"}}>
            <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#FFFFFF" />
          </svg>
        </a>
        <div className="scroll-progress" aria-hidden="true" />
      </div>
      <div data-pencil-id="Ejw9O" data-pencil-name="Hero · Un solo proveedor" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "52px", "height": "fit-content", "justifyContent": "flex-start", "padding": "68px 72px 64px 72px", "width": "100%"}} id="inicio">
        <div data-pencil-id="lUddb" data-pencil-name="Propuesta de valor" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "25px", "height": "fit-content", "justifyContent": "flex-start", "width": "592px"}}>
          <div data-pencil-id="cid50" data-pencil-name="Etiqueta de especialidad" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "9px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
            <div data-pencil-id="iMEdf" data-pencil-name="Indicador" style={{"backgroundColor": "#852940", "borderRadius": "50%", "boxSizing": "border-box", "flexShrink": "0", "height": "6px", "width": "6px"}} />
            <div data-pencil-id="KJ06X" data-pencil-name="Especialidad" style={{"boxSizing": "border-box", "color": "#852940", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "700", "letterSpacing": "1.5px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              SOLUCIONES INTEGRALES PARA GOBIERNOS LOCALES
            </div>
          </div>
          <div data-pencil-id="VyvhM" data-pencil-name="Título principal" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "flex-start", "width": "100%"}}>
            <div data-pencil-id="xqoNU" data-pencil-name="Todo tu municipio" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "61px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-2.8px", "lineHeight": "66px", "textAlign": "left", "width": "100%"}}>
              Todo tu municipio.
            </div>
            <div data-pencil-id="Z6Dimm" data-pencil-name="Un solo proveedor" style={{"boxSizing": "border-box", "color": "#852940", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "61px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-2.8px", "lineHeight": "66px", "textAlign": "left", "width": "100%"}}>
              Un solo
              <br />
              proveedor.
            </div>
          </div>
          <div data-pencil-id="CFdrG" data-pencil-name="Descripción principal" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "17px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "28px", "textAlign": "left", "width": "510px"}}>
            Tecnología, equipamiento y servicios que conectan cada área de tu municipio. Todo integrado, con un equipo que te acompaña.
          </div>
          <button type="button" className="hero-digitalizacion-cta" data-action="open:digitalization">
            <span>Servicio destacado</span>
            <strong>Digitalización municipal</strong>
            <span aria-hidden="true">↗</span>
          </button>
          <div data-pencil-id="wJixt" data-pencil-name="Acciones del hero" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "24px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
            <a data-pencil-id="waGdY" data-pencil-name="Solicitar asesoramiento" style={{"alignItems": "center", "backgroundColor": "#852940", "borderRadius": "5px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "20px", "height": "fit-content", "justifyContent": "flex-start", "outlineOffset": "-0.5px", "outline": "1px solid #852940", "padding": "17px 22px", "width": "fit-content"}} href="#contacto" className="scroll-link">
              <div data-pencil-id="u6bYw4" data-pencil-name="Solicitar asesoramiento texto" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Solicitar asesoramiento
              </div>
              <svg data-pencil-id="nR38C" data-pencil-name="Solicitar asesoramiento flecha" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "18px", "width": "18px"}}>
                <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#FFFFFF" />
              </svg>
            </a>
            <a data-pencil-id="DG17q" data-pencil-name="Explorar soluciones" style={{"boxSizing": "border-box", "color": "#444A50", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#soluciones" className="scroll-link">
              Explorar soluciones ↓
            </a>
          </div>
          <div data-pencil-id="UWSFL" data-pencil-name="Compromiso de atención" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "9px", "height": "fit-content", "justifyContent": "flex-start", "padding": "5px 0px 0px 0px", "width": "fit-content"}}>
            <svg data-pencil-id="K2E9T" data-pencil-name="Atención personal" data-icon-name="users-round" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "17px", "width": "17px"}}>
              <path d="M5.36279 1.20313q-0.54688 0.07178-1.0459 0.31103-0.49561 0.23584-0.88525 0.61523-0.47852 0.44775-0.74512 0.99122-0.43408 0.9126-0.34179 1.88671 0.09229 0.9707 0.70752 1.76709 0.08545 0.14014 0.25293 0.31104 0.16748 0.16748 0.29394 0.27685l0.10938 0.08545-0.24952 0.12647q-0.71436 0.3623-1.30224 0.95019-0.25293 0.23926-0.3999 0.42383-0.14697 0.18115-0.31446 0.43067-0.12646 0.18457-0.28711 0.49902-0.16064 0.31445-0.23242 0.50928-0.32129 0.88184-0.33496 1.73633 0 0.18115 0.00684 0.23242 0.00684 0.04785 0.03418 0.1333 0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445 0.02734-0.07178 0.03418-0.12647 0.00684-0.05811 0.02051-0.25292 0.02734-0.4751 0.12646-0.875 0.09912-0.3999 0.29395-0.78956 0.44775-0.93994 1.30225-1.5415 0.85449-0.60156 1.87646-0.71435 0.93652-0.11279 1.81836 0.1914 0.88184 0.30078 1.55518 0.9707 0.48877 0.49219 0.79638 1.14502 0.30762 0.64941 0.36573 1.30567l0.04101 0.40674q0.01367 0.16748 0.04102 0.25976 0.03076 0.08887 0.12646 0.18115 0.09912 0.08887 0.18115 0.12647 0.08545 0.03418 0.22559 0.03418 0.14014 0 0.22217-0.03418 0.08545-0.0376 0.18115-0.1333 0.09912-0.09912 0.1333-0.18115 0.0376-0.08545 0.0376-0.28028 0.01367-0.57422-0.16065-1.24756-0.17432-0.67334-0.48193-1.23046-0.3794-0.68701-0.95361-1.24073-0.57422-0.55371-1.26123-0.90234l-0.24951-0.12647 0.06835-0.05468q0.09912-0.08545 0.30762-0.30078 0.21191-0.21875 0.29395-0.33155 0.49219-0.65625 0.64599-1.49707 0.04102-0.18115 0.04102-0.52295 0-0.34521-0.02735-0.54004-0.12646-0.89551-0.63916-1.60302-0.50928-0.70752-1.32275-1.08692-0.52979-0.24951-1.104-0.32129-0.18457-0.01367-0.45117-0.01367-0.26318 0-0.417 0.02735z m4.74414 0.39306q-0.12647 0.02734-0.23242 0.11279-0.10254 0.08203-0.15722 0.19483-0.04443 0.08545-0.05127 0.22558-0.00684 0.14014 0.02734 0.23926 0.0376 0.0957 0.10596 0.17432 0.07178 0.0752 0.22558 0.17432 0.38965 0.26318 0.64942 0.64257 0.25977 0.37939 0.35888 0.84082 0.04102 0.15381 0.04102 0.46143 0 0.30762-0.04102 0.46143-0.08545 0.39307-0.28369 0.73828-0.19482 0.3418-0.48877 0.57763-0.15381 0.12646-0.19482 0.17774-0.04102 0.04785-0.09912 0.14355-0.05469 0.12646-0.04102 0.28711 0.01367 0.16064 0.09912 0.27344 0.02734 0.05811 0.2666 0.2666 1.00488 0.84082 1.55176 2.15674 0.33838 0.79639 0.39307 1.65088 0.01367 0.29395 0.03418 0.3999 0.02051 0.10596 0.07861 0.18799 0.15381 0.23926 0.42383 0.2666 0.27344 0.02734 0.47168-0.18115 0.12646-0.11279 0.15381-0.25293 0.02734-0.14014 0.01367-0.46143-0.04101-0.65967-0.21191-1.26806-0.16748-0.6084-0.48877-1.23731-0.4751-0.95361-1.16211-1.68164l-0.18116-0.18115 0.06836-0.08545q0.08545-0.08203 0.19825-0.26318 0.46142-0.67334 0.58105-1.46973 0.11963-0.7998-0.1333-1.56885-0.16748-0.51953-0.49219-0.96728-0.32129-0.44775-0.75537-0.76905-0.2666-0.19824-0.42041-0.25293-0.15381-0.05469-0.30762-0.01367z m-3.87597 0.76904q0.71436 0.12646 1.24414 0.65284 0.5332 0.52295 0.65967 1.25097 0.01367 0.14014 0.0205 0.3794 0.00684 0.23926-0.0205 0.3623-0.07178 0.44775-0.29053 0.82715-0.21533 0.37939-0.55029 0.64258-0.54688 0.43408-1.24073 0.50586-0.69043 0.06836-1.30566-0.25293-0.47852-0.25293-0.79297-0.69385-0.31445-0.44092-0.41357-0.95703-0.02734-0.14014-0.02735-0.3999 0-0.25977 0.01367-0.38623 0.14014-0.79639 0.73487-1.33985 0.59473-0.54688 1.38086-0.60498 0.29395-0.02734 0.58789 0.02735l0-0.01368z" fill="#852940" />
            </svg>
            <div data-pencil-id="zJOFO" data-pencil-name="Siempre una persona" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              Siempre te atiende una persona.
            </div>
          </div>
        </div>
        <div data-pencil-id="KMvqy" data-pencil-name="Centro de soluciones · Imagen" style={{"alignItems": "flex-start", "backgroundColor": "#222B30", "borderRadius": "8px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "0px", "height": "478px", "justifyContent": "flex-start", "overflow": "hidden"}}>
          <div data-pencil-id="Eucfb" data-pencil-name="MuniTotal en acción" style={{"alignItems": "flex-start", "backgroundImage": "url('/hero-showroom.webp')", "backgroundPosition": "center", "backgroundRepeat": "no-repeat", "backgroundSize": "cover", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flex": "1 1 0", "gap": "0px", "justifyContent": "flex-start", "width": "100%"}} />
          <div data-pencil-id="vurq8" data-pencil-name="Pie de imagen" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "space-between", "padding": "22px 24px", "width": "100%"}}>
            <div data-pencil-id="bz03p" data-pencil-name="Descripción del showroom" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "5px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
              <div data-pencil-id="Ngnki" data-pencil-name="Etiqueta imagen" style={{"boxSizing": "border-box", "color": "#D2B8BE", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "10px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "1.1px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                TECNOLOGÍA CERCA DE LAS PERSONAS
              </div>
              <div data-pencil-id="r3CuM" data-pencil-name="Centro de soluciones" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "17px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Un centro. Todas las soluciones.
              </div>
            </div>
            <svg data-pencil-id="v52BEV" data-pencil-name="Explorar el centro" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "24px", "width": "24px"}}>
              <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>
      <div data-pencil-id="XA2ER" data-pencil-name="Áreas de solución" style={{"alignItems": "flex-start", "backgroundColor": "#EFEEEA", "borderColor": "#DEDDD8", "borderStyle": "solid", "borderWidth": "1px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "96px", "justifyContent": "flex-start", "margin": "-0.5px 0px -0.5px 0px", "padding": "29px 72px", "width": "1440px"}}>
        <div data-pencil-id="l8mlT" data-pencil-name="Software municipal" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flex": "1 1 0", "gap": "13px", "height": "fit-content", "justifyContent": "flex-start", "padding": "8px 20px 8px 0px"}} data-action="open:software" role="button" tabIndex={0}>
          <svg data-pencil-id="rX4jt" data-pencil-name="Software municipal ícono" data-icon-name="panels-top-left" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "23px", "width": "23px"}}>
            <path d="M2.60449 1.20313q-0.50586 0.08545-0.87842 0.43749-0.36914 0.34863-0.50927 0.86475-0.02734 0.08545-0.02735 0.71436l-0.01367 3.78027 0.01367 3.78027q0 0.62891 0.02735 0.71436 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.48877-0.14014 0.81689-0.46826 0.33154-0.33154 0.47168-0.82031 0.02734-0.08545 0.02735-0.71436l0.01367-3.78027-0.01367-3.78027q0-0.62891-0.02735-0.71436-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168l-0.14013-0.04102-4.32715 0q-4.3374 0-4.4502 0.02734z m8.70899 1.17578q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0.01367 1.89014-9.35156 0 0.01367-1.89014 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.08545 0 4.22803 0l4.15967 0 0.09912 0.04102z m-6.6377 6.37109l0 2.92578-0.88183 0q-0.88184 0-0.98096-0.02734-0.29395-0.05811-0.43408-0.33496l-0.04102-0.09912-0.01367-5.39014 2.35156 0 0 2.92578z m6.98633-0.23926l0 2.70362-0.04102 0.09912q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-2.73096 0.02734l-2.63183 0 0-5.85156 5.85156 0-0.01367 2.68652z" fill="#852940" />
          </svg>
          <div data-pencil-id="BH8tS" data-pencil-name="Software municipal etiqueta" style={{"boxSizing": "border-box", "color": "#373D42", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Software municipal
          </div>
        </div>
        <div data-pencil-id="MeFev" data-pencil-name="Infraestructura y hardware" style={{"alignItems": "center", "borderColor": "#D7D5CF", "borderStyle": "solid", "borderWidth": "0px 0px 0px 1px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flex": "1 1 0", "gap": "13px", "height": "39px", "justifyContent": "flex-start", "margin": "0px 0px 0px -0.5px", "padding": "8px 20px 8px 26px", "width": "323.5px"}} data-action="open:hardware" role="button" tabIndex={0}>
          <svg data-pencil-id="E0SgqX" data-pencil-name="Infraestructura y hardware ícono" data-icon-name="server" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "23px", "width": "23px"}}>
            <path d="M2.15674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.33496-0.43408 0.81005-0.02734 0.12646-0.04102 0.32471l0 2.64551 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-2.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.76904-0.44775-0.48877-1.13476-0.56055-0.16748-0.01367-4.81592-0.01367-4.64844 0-4.82959 0.02734z m9.74463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 2.6045-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-2.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 4.85694-0.02734l4.76123 0.01367 0.09912 0.04102z m-8.55518 1.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z m-1.18945 4.66211q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.3794-0.30762 0.32129-0.43408 0.79638-0.02734 0.12646-0.04102 0.32471l0 2.64551 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-2.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.78271-0.44775-0.4751-1.13476-0.54688-0.16748-0.01367-4.81592-0.01367-4.64844 0-4.82959 0.02734z m9.74463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 2.6045-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-2.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 4.85694-0.02734l4.76123 0.01367 0.09912 0.04102z m-8.55518 1.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z" fill="#852940" />
          </svg>
          <div data-pencil-id="EdNJP" data-pencil-name="Infraestructura y hardware etiqueta" style={{"boxSizing": "border-box", "color": "#373D42", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Infraestructura y hardware
          </div>
        </div>
        <div data-pencil-id="vqMax" data-pencil-name="Atención ciudadana" style={{"alignItems": "center", "borderColor": "#D7D5CF", "borderStyle": "solid", "borderWidth": "0px 0px 0px 1px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flex": "1 1 0", "gap": "13px", "height": "39px", "justifyContent": "flex-start", "margin": "0px 0px 0px -0.5px", "padding": "8px 20px 8px 26px", "width": "323.5px"}} data-action="open:citizen" role="button" tabIndex={0}>
          <svg data-pencil-id="I4iFzW" data-pencil-name="Atención ciudadana ícono" data-icon-name="messages-square" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "23px", "width": "23px"}}>
            <path d="M2.15674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.32129-0.43408 0.78271l-0.04102 0.16748 0 5.72852q0 0.58789 0.01367 0.68359 0.07178 0.43408 0.44092 0.67334 0.37256 0.23926 0.79297 0.12646 0.14014-0.04443 0.229-0.09912 0.09229-0.05469 0.28711-0.22216 0.14014-0.14014 0.57422-0.57422 0.4751-0.46484 0.62207-0.60157 0.14697-0.14014 0.21875-0.17089l0.0957-0.04102 4.6211-0.01367 0.15381-0.05469q0.36572-0.11279 0.65283-0.34863 0.28711-0.23926 0.44092-0.56397 0.14014-0.28027 0.18115-0.60156 0.01367-0.16748 0-2.04394l0-1.87647-0.04102-0.16748q-0.12646-0.46143-0.43408-0.76904-0.44775-0.48877-1.13476-0.56055-0.16748-0.01367-3.06592-0.01367-2.89844 0-3.07959 0.02734z m6.24463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 3.78028-0.04102 0.09912q-0.11279 0.22217-0.35205 0.32129-0.05469 0.01367-2.35156 0.02734l-2.31055 0-0.14013 0.04102q-0.14014 0.04443-0.30762 0.12988-0.16748 0.08203-0.28028 0.16064-0.11279 0.0752-0.65625 0.62207l-0.54687 0.52979 0.01367-5.71143 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 3.10694-0.02734l3.01123 0.01367 0.09912 0.04102z m3.07959 2.89844q-0.18457 0.05811-0.29053 0.21191-0.10254 0.15381-0.10254 0.33496 0 0.23926 0.16748 0.40674 0.08545 0.08203 0.17432 0.11963 0.09228 0.03418 0.24609 0.05468 0.15381 0.02051 0.23584 0.05811 0.08545 0.03418 0.16065 0.11279 0.07861 0.0752 0.12304 0.1709l0.04102 0.09912 0.01367 5.73877-0.57422-0.57422q-0.44775-0.43408-0.60156-0.56396-0.15381-0.1333-0.33496-0.21875-0.12646-0.05469-0.29395-0.09912l-0.1709-0.04102-2.27978-0.01367q-2.29688-0.01367-2.35156-0.02734-0.22559-0.08545-0.35205-0.33496-0.01367-0.05811-0.02735-0.14014-0.01367-0.08545-0.01367-0.3794-0.01367-0.42041-0.03418-0.48193-0.02051-0.06494-0.07861-0.14014-0.05469-0.07861-0.1128-0.11963-0.15381-0.11279-0.3623-0.11279-0.23926 0-0.40674 0.16748-0.12646 0.11279-0.15381 0.25977-0.02734 0.14697-0.01367 0.56738 0 0.2666 0.00684 0.36572 0.00684 0.0957 0.03418 0.2085 0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 4.59375 0.01367 0.08203 0.04102q0.08545 0.04443 0.82715 0.78613 0.5332 0.51611 0.65625 0.63574 0.12646 0.11963 0.22559 0.16065 0.22558 0.11279 0.46142 0.11279 0.32129 0 0.58106-0.19482 0.25977-0.19824 0.37256-0.53321 0.01367-0.07178 0.02734-0.51953l0.01367-4.95605q-0.01367-0.69727-0.02734-0.93653-0.01367-0.18115-0.04102-0.32129-0.11279-0.39307-0.39307-0.70068-0.28027-0.30762-0.65966-0.46143-0.19482-0.07178-0.45459-0.10595-0.25977-0.03418-0.36914 0.02051z" fill="#852940" />
          </svg>
          <div data-pencil-id="kcXS3" data-pencil-name="Atención ciudadana etiqueta" style={{"boxSizing": "border-box", "color": "#373D42", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Atención ciudadana
          </div>
        </div>
        <div data-pencil-id="evxul" data-pencil-name="Insumos y equipamiento" style={{"alignItems": "center", "borderColor": "#D7D5CF", "borderStyle": "solid", "borderWidth": "0px 0px 0px 1px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flex": "1 1 0", "gap": "13px", "height": "39px", "justifyContent": "flex-start", "margin": "0px 0px 0px -0.5px", "padding": "8px 0px 8px 26px", "width": "323.5px"}} data-action="open:supplies" role="button" tabIndex={0}>
          <svg data-pencil-id="LdI5H" data-pencil-name="Insumos y equipamiento ícono" data-icon-name="package" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "23px", "width": "23px"}}>
            <path d="M6.65137 0.61523q-0.22559 0.05811-0.43408 0.15381-0.14014 0.07178-2.16358 1.23389-2.02344 1.16211-2.10889 1.2168-0.58789 0.39307-0.74169 1.07666-0.02734 0.11279-0.02735 0.49218l0 2.21143 0 2.14307q0 0.43408 0.02734 0.52978 0.07178 0.35205 0.26661 0.63916 0.19482 0.28711 0.48877 0.48194 0.18457 0.11279 2.19775 1.26806 2.0166 1.15527 2.12939 1.19629 0.19482 0.08203 0.34864 0.11963 0.15723 0.03418 0.37256 0.03418 0.21875 0 0.39306-0.04102 0.17432-0.04443 0.38281-0.1538 0.15381-0.07178 2.12598-1.19629 1.97559-1.12793 2.11572-1.22705 0.31104-0.19482 0.50586-0.48194 0.19482-0.28711 0.2666-0.63916 0.02734-0.0957 0.02735-0.52978l0-2.14307 0-2.14307q0-0.43408-0.02735-0.52978-0.07178-0.32471-0.25976-0.61865-0.18799-0.29395-0.45459-0.4751-0.12647-0.08203-2.15674-1.24414-2.03027-1.16211-2.18408-1.23389-0.18115-0.08203-0.32129-0.11621-0.14014-0.0376-0.37939-0.0376-0.28027 0-0.38965 0.01367z m0.57422 1.18946q0.0957 0.04443 1.96533 1.10742 1.86963 1.06299 1.86963 1.07666 0 0.01367-0.70752 0.41357-0.70752 0.3999-0.73487 0.39991-0.02734 0-2.03711-1.14844-2.00977-1.14844-2.00976-1.16211 0-0.01367 0.48193-0.28711 0.48535-0.27344 0.63916-0.35547 0.12646-0.07178 0.18116-0.08545 0.05811-0.01367 0.17431 0 0.11963 0.01367 0.17774 0.04102z m-0.81348 2.52246q2.03027 1.16211 2.02344 1.16894-0.00684 0.00684-0.70752 0.41358-0.44775 0.26318-0.58789 0.33496-0.14014 0.06836-0.17432 0.05469-0.03418-0.01367-2.03027-1.15528-1.99609-1.1416-1.9961-1.14843 0-0.00684 0.71436-0.417 0.71436-0.41357 0.71435-0.41357l2.04395 1.16211z m-2.03027 1.8457l2.04394 1.16211 0 2.33789q0 2.33789-0.01367 2.32422l-1.91748-1.09033q-1.91748-1.09375-1.98242-1.15528-0.06152-0.06494-0.11963-0.17431l-0.05469-0.11279 0-2.2251q-0.01367-2.24219 0-2.24219 0.01367 0 2.04395 1.17578z m7.28027 1.06641l0 2.2251-0.05469 0.11279q-0.05811 0.10938-0.12305 0.17431-0.06152 0.06152-1.979 1.15528l-1.91748 1.09033q-0.01367 0.01367-0.01367-2.32422l0-2.33789 3.15137-1.80469q0.92285-0.51953 0.93652-0.52636 0.01367-0.00684 0 2.23535z" fill="#852940" />
          </svg>
          <div data-pencil-id="WOzmy" data-pencil-name="Insumos y equipamiento etiqueta" style={{"boxSizing": "border-box", "color": "#373D42", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Insumos y equipamiento
          </div>
        </div>
      </div>
      <DigitalizacionDestacada onAction={onAction}/>
      <div data-pencil-id="xm2nb" data-pencil-name="Soluciones · De la A a la Z" style={{"alignItems": "flex-start", "backgroundColor": "#FFFFFF", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "44px", "height": "fit-content", "justifyContent": "flex-start", "padding": "80px 72px", "width": "100%"}} id="soluciones">
        <div data-pencil-id="sfueN" data-pencil-name="Introducción a soluciones" style={{"alignItems": "flex-end", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "80px", "height": "fit-content", "justifyContent": "space-between", "width": "100%"}}>
          <div data-pencil-id="O6nbJ1" data-pencil-name="Título de soluciones" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "16px", "height": "fit-content", "justifyContent": "flex-start", "width": "690px"}}>
            <div data-pencil-id="iAKQf" data-pencil-name="Etiqueta soluciones" style={{"boxSizing": "border-box", "color": "#852940", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "700", "letterSpacing": "1.6px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              UN ECOSISTEMA, MUCHAS RESPUESTAS
            </div>
            <div data-pencil-id="sDMxp" data-pencil-name="Soluciones de la A a la Z" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "42px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-1.5px", "lineHeight": "48px", "textAlign": "left", "width": "100%"}}>
              De la A a la Z en
              <br />
              soluciones municipales.
            </div>
          </div>
          <div data-pencil-id="m7gF1" data-pencil-name="Introducción soluciones" style={{"boxSizing": "border-box", "color": "#666B70", "flexShrink": "0", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "16px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "26px", "textAlign": "left", "width": "370px"}}>
            Desde la gestión diaria hasta los servicios en la calle. Encontrá lo que tu municipio necesita para avanzar.
          </div>
        </div>
        <div data-pencil-id="xZgI1" data-pencil-name="Oferta integral" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "48px", "height": "fit-content", "justifyContent": "flex-start", "width": "100%"}}>
          <div data-pencil-id="YDZc8" data-pencil-name="Software municipal destacado" style={{"alignItems": "flex-start", "backgroundColor": "#F3F0EC", "borderRadius": "8px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "24px", "height": "fit-content", "justifyContent": "flex-start", "padding": "32px", "width": "558px"}}>
            <div data-pencil-id="DES9L" data-pencil-name="Categoría destacada" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "space-between", "width": "100%"}}>
              <svg data-pencil-id="Nvd5m" data-pencil-name="Ícono software" data-icon-name="panels-top-left" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "28px", "width": "28px"}}>
                <path d="M2.60449 1.20313q-0.50586 0.08545-0.87842 0.43749-0.36914 0.34863-0.50927 0.86475-0.02734 0.08545-0.02735 0.71436l-0.01367 3.78027 0.01367 3.78027q0 0.62891 0.02735 0.71436 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.48877-0.14014 0.81689-0.46826 0.33154-0.33154 0.47168-0.82031 0.02734-0.08545 0.02735-0.71436l0.01367-3.78027-0.01367-3.78027q0-0.62891-0.02735-0.71436-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168l-0.14013-0.04102-4.32715 0q-4.3374 0-4.4502 0.02734z m8.70899 1.17578q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0.01367 1.89014-9.35156 0 0.01367-1.89014 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.08545 0 4.22803 0l4.15967 0 0.09912 0.04102z m-6.6377 6.37109l0 2.92578-0.88183 0q-0.88184 0-0.98096-0.02734-0.29395-0.05811-0.43408-0.33496l-0.04102-0.09912-0.01367-5.39014 2.35156 0 0 2.92578z m6.98633-0.23926l0 2.70362-0.04102 0.09912q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-2.73096 0.02734l-2.63183 0 0-5.85156 5.85156 0-0.01367 2.68652z" fill="#852940" />
              </svg>
              <div data-pencil-id="kmBoW" data-pencil-name="Número software" style={{"boxSizing": "border-box", "color": "#79706F", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "10px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "1.2px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                01 / SOFTWARE
              </div>
            </div>
            <div data-pencil-id="H2qJo" data-pencil-name="Texto software" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "12px", "height": "fit-content", "justifyContent": "flex-start", "width": "100%"}}>
              <div data-pencil-id="oTPgD" data-pencil-name="Título software" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "27px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-0.7px", "lineHeight": "32px", "textAlign": "left", "width": "100%"}}>
                Una gestión más simple.
                <br />
                Un municipio conectado.
              </div>
              <div data-pencil-id="BQ99r" data-pencil-name="Descripción software" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "15px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "24px", "textAlign": "left", "width": "100%"}}>
                Centralizá la información y conectá las áreas de tu gobierno con herramientas para el trabajo de todos los días.
              </div>
            </div>
            <div data-pencil-id="g3ups" data-pencil-name="Módulos de gestión" style={{"alignItems": "flex-start", "backgroundColor": "#FFFFFF", "borderRadius": "6px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "flex-start", "outlineOffset": "-0.5px", "outline": "1px solid #E0DCD6", "overflow": "hidden", "width": "100%"}}>
              <div data-pencil-id="ZJh3y" data-pencil-name="Cabecera de módulos" style={{"alignItems": "center", "backgroundColor": "#852940", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "space-between", "padding": "14px 18px", "width": "100%"}}>
                <div data-pencil-id="eFyLc" data-pencil-name="Gestión integrada" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                  Gestión municipal
                </div>
                <svg data-pencil-id="duWcM" data-pencil-name="Menú gestión" data-icon-name="grid-2x2" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "15px", "width": "15px"}}>
                  <path d="M2.60449 1.20313q-0.50586 0.08545-0.87842 0.43749-0.36914 0.34863-0.50927 0.86475-0.02734 0.08545-0.02735 0.71436l-0.01367 3.78027 0.01367 3.78027q0 0.62891 0.02735 0.71436 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.48877-0.14014 0.81689-0.46826 0.33154-0.33154 0.47168-0.82031 0.02734-0.08545 0.02735-0.71436l0.01367-3.78027-0.01367-3.78027q0-0.62891-0.02735-0.71436-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168l-0.14013-0.04102-4.32715 0q-4.3374 0-4.4502 0.02734z m3.82129 3.16503l0 2.05762-4.10156 0 0.01367-3.64014 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.08545 0 1.83545-0.01367l1.76367 0 0 2.04394z m4.8877-1.98925q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0.01367 3.64014-4.10156 0 0-4.10156 3.64013 0.01367 0.09913 0.04102z m-4.8877 7.23925l0 2.05762-1.76367 0q-1.75 0-1.84912-0.02734-0.29395-0.05811-0.43408-0.33496l-0.04102-0.09913-0.01367-3.64013 4.10156 0 0 2.04394z m5.25-0.22558l-0.01367 1.82177-0.04102 0.09913q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-1.84912 0.02734l-1.76367 0 0-4.10156 4.10156 0 0 1.81836z" fill="#FFFFFF" />
                </svg>
              </div>
              <div data-pencil-id="KYC4n" data-pencil-name="Administración y finanzas" style={{"alignItems": "center", "borderColor": "#ECE9E5", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "13px", "height": "66.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "17px 18px", "width": "494px"}}>
                <svg data-pencil-id="R2NjM" data-pencil-name="Administración y finanzas ícono" data-icon-name="chart-no-axes-combined" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "19px", "width": "19px"}}>
                  <path d="M12.6123 1.20313q-0.06836 0.02734-0.45458 0.41357-0.38281 0.38623-2.10547 2.0918l-2.46436 2.46435-0.90918-0.90918q-0.65967-0.64258-0.80664-0.78271-0.14697-0.14014-0.24268-0.18457-0.37939-0.18115-0.75878 0-0.0957 0.04443-0.38282 0.31787-0.28711 0.27344-1.7705 1.77051l-1.62696 1.62353q-0.3623 0.3623-0.44775 0.50244-0.05469 0.08545-0.05469 0.19824l0 0.04102q0 0.23926 0.18115 0.42041 0.11279 0.11279 0.28028 0.14697 0.16748 0.03418 0.32129-0.02051 0.08545-0.02734 0.36572-0.30078 0.28027-0.27344 1.62353-1.63379l1.89014-1.87304 0.90918 0.90918q0.92627 0.90918 0.99463 0.95019 0.14014 0.08545 0.33496 0.10596 0.19824 0.02051 0.33838-0.02051l0.02734-0.01367q0.11279-0.02734 0.22217-0.14014 0.1709-0.12646 0.67334-0.6289l3.7666-3.7666q0.46143-0.44775 0.64258-0.64942 0.18115-0.20508 0.22559-0.29053 0.02734-0.06836 0.02734-0.14013l0-0.05469q0-0.12646-0.04102-0.23926-0.09912-0.19482-0.29394-0.29394-0.08545-0.04102-0.22559-0.04102-0.14014 0-0.23925 0.02734z m-1.09033 4.06054q-0.11279 0.02734-0.21875 0.11279-0.10254 0.08203-0.15381 0.17432-0.04785 0.09229-0.04785 0.2461-0.01367 0.19482-0.02734 0.90917l0.01367 5.67042 0.04102 0.11279q0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445l0.04102-0.09912 0.01367-3.31885q0-3.31543-0.01367-3.40088-0.07178-0.2666-0.33496-0.37939-0.07178-0.04102-0.19141-0.04785-0.11963-0.00684-0.18799 0.00683z m-6.94531 2.33789q-0.18115 0.01367-0.31445 0.14698-0.1333 0.1333-0.17432 0.31445-0.01367 0.11279 0 2.21142l0 2.10206 0.04102 0.11279q0.05811 0.0957 0.14013 0.18115 0.21191 0.19482 0.50586 0.14697 0.29395-0.04785 0.42041-0.31445l0.04102-0.09912 0.01367-4.34082-0.04102-0.0957q-0.08545-0.19824-0.25293-0.30079-0.16748-0.10596-0.37939-0.06494z m4.64844 0q-0.12646 0.01367-0.2461 0.10596-0.11621 0.08887-0.17431 0.21533l-0.04102 0.09912 0 4.38184 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.1128 0-2.10205q0.01367-2.09863 0-2.21142-0.05469-0.23584-0.24609-0.36914-0.18799-0.1333-0.44092-0.09229z m-2.37891 1.17578q-0.12646 0.02734-0.23242 0.12647-0.10254 0.09912-0.16064 0.22558l-0.02735 0.09571 0 3.19238 0.04102 0.08545q0.04443 0.06836 0.12646 0.15381 0.08545 0.08203 0.16065 0.12646 0.07861 0.04102 0.24609 0.04102 0.16748 0 0.24268-0.04102 0.07861-0.04443 0.16064-0.12646 0.08545-0.08545 0.12988-0.15381l0.04102-0.08545 0-3.19238-0.02734-0.09571q-0.08545-0.21191-0.29395-0.31103-0.08545-0.05469-0.20508-0.06152-0.11621-0.00684-0.20166 0.0205z m-4.7168 1.17579q-0.09912 0.04443-0.1914 0.12988-0.08887 0.08203-0.1333 0.16406l-0.04102 0.09912 0 2.05762 0.04102 0.09912q0.12646 0.2666 0.42041 0.31445 0.29395 0.04785 0.50586-0.14697 0.08203-0.08545 0.14013-0.18115l0.04102-0.11279 0-2.00293-0.04102-0.1128q-0.09912-0.19482-0.29394-0.29394-0.08545-0.04102-0.21875-0.04102-0.1333 0-0.22901 0.02735z" fill="#852940" />
                </svg>
                <div data-pencil-id="gYBg1" data-pencil-name="Administración y finanzas contenido" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "4px", "height": "fit-content", "justifyContent": "flex-start"}}>
                  <div data-pencil-id="lPt4e" data-pencil-name="Administración y finanzas nombre" style={{"boxSizing": "border-box", "color": "#30363B", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                    Administración y finanzas
                  </div>
                  <div data-pencil-id="evokV" data-pencil-name="Administración y finanzas detalle" style={{"boxSizing": "border-box", "color": "#74797E", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                    Información para decidir
                  </div>
                </div>
                <svg data-pencil-id="mgAoM" data-pencil-name="Administración y finanzas estado" data-icon-name="check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "15px", "width": "15px"}}>
                  <path d="M11.48096 2.95313q-0.07178 0.01367-0.12989 0.0581-0.05469 0.04102-3.07617 3.06592l-3.0249 3.00781-1.28857-1.28857q-1.28857-1.28516-1.38086-1.32618-0.08887-0.04443-0.22217-0.04443-0.1333 0-0.23242 0.0376-0.0957 0.03418-0.18799 0.11279-0.08887 0.0752-0.1333 0.1709-0.02734 0.07178-0.03418 0.11279-0.00684 0.04102-0.00684 0.14014l0 0.04102q-0.01367 0.11279 0.04102 0.19824 0.07178 0.10938 0.36572 0.40332 0.19482 0.21191 0.96729 0.98096l1.49707 1.48339q0.28027 0.2666 0.38964 0.33838 0.07178 0.05469 0.18457 0.04102l0.09571 0.01367q0.07178 0 0.14013-0.02734 0.08545-0.07178 0.32129-0.28711 0.23926-0.21875 0.79981-0.76221l2.2832-2.2832q2.08496-2.09863 2.7002-2.71387 0.61524-0.61865 0.64599-0.68701 0.04102-0.08545 0.04102-0.23926 0-0.09912-0.00684-0.14014-0.00684-0.04102-0.03418-0.11279-0.04443-0.08203-0.13672-0.16406-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02734z" fill="#5A7965" />
                </svg>
              </div>
              <div data-pencil-id="Rcns5" data-pencil-name="Trámites y expedientes" style={{"alignItems": "center", "borderColor": "#ECE9E5", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "13px", "height": "66.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "17px 18px", "width": "494px"}}>
                <svg data-pencil-id="mjE5p" data-pencil-name="Trámites y expedientes ícono" data-icon-name="files" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "19px", "width": "19px"}}>
                  <path d="M6.24463 0.60156q-0.30762 0.02734-0.60156 0.16748-0.32471 0.16748-0.56397 0.44776-0.23584 0.28027-0.34863 0.64599l-0.05469 0.15381 0.01367 6.55225q0 0.51611 0.02735 0.58789 0.08545 0.29395 0.19482 0.48877 0.11279 0.19482 0.31104 0.37939 0.30762 0.29395 0.75537 0.42041l0.16748 0.04102 5.20898 0 0.16748-0.04102q0.50244-0.14014 0.8374-0.4956 0.33838-0.35889 0.4375-0.87842 0.02734-0.08203 0.02735-0.48877l0-1.87647q0-2.2251-0.01367-2.33789-0.07178-0.43408-0.32129-0.81347-0.05811-0.10938-1.23389-1.29199-1.17578-1.18604-1.31592-1.28174-0.42041-0.32129-0.99463-0.3794-0.14014-0.02734-1.33642-0.02734-1.19629 0-1.36377 0.02734z m1.93115 2.43701l0.01367 1.14844q0 0.16748 0.02735 0.24951 0.08545 0.2666 0.28711 0.47168 0.20508 0.20166 0.47168 0.28711l0.13671 0.04102 2.56348 0.01367 0 1.73633q0 1.73633-0.02051 1.84912-0.02051 0.10938-0.0581 0.18799-0.03418 0.0752-0.12647 0.15381-0.08887 0.0752-0.16748 0.11279-0.0752 0.03418-0.39648 0.03418l-2.15674 0-2.15674 0q-0.32129 0-0.3999-0.03418-0.0752-0.0376-0.16748-0.11279-0.08887-0.07861-0.12647-0.15381-0.03418-0.07861-0.05468-0.18799-0.02051-0.11279-0.02051-3.29834 0-3.18555 0.02734-3.29834 0.02734-0.16748 0.14698-0.30078 0.11963-0.1333 0.27343-0.17432 0.06836-0.01367 0.98096-0.01367l0.92285 0 0 1.28857z m2.19776 0l1.04931 1.03565-2.09863 0 0-1.03565q0-1.03564 0.01367-1.04931l1.03565 1.04931z m-7.68702 0.4751q-0.48877 0.07178-0.875 0.38623-0.38281 0.31445-0.53662 0.76221l-0.01367 0.04101q-0.05811 0.12646-0.07178 0.28028-0.01367 0.19824-0.01367 0.82715l0 6.17285 0.05469 0.15381q0.11279 0.36572 0.34863 0.65283 0.23926 0.28711 0.56397 0.44092 0.29395 0.14014 0.60156 0.16748 0.16748 0.02734 2.61816 0.01367l2.05762 0q0.42041-0.01367 0.50244-0.02734 0.35205-0.07178 0.63233-0.26661 0.28027-0.19482 0.47509-0.46142 0.08203-0.14014 0.10938-0.22217 0.03076-0.08545 0.03076-0.21191-0.01367-0.23926-0.16064-0.38623-0.14697-0.14697-0.38623-0.16065-0.32129-0.01367-0.51612 0.2666-0.12646 0.18115-0.28027 0.25293l-0.09912 0.04102-4.95606 0-0.09912-0.04102q-0.28027-0.14014-0.32129-0.44775-0.02734-0.11279-0.01367-3.35986l0-2.56348q0-0.54688 0.02734-0.71436 0.01367-0.11279 0.05811-0.16748l0.02734-0.02734q0.06836-0.11279 0.18799-0.16748 0.11963-0.05811 0.32813-0.08545 0.12646-0.01367 0.20166-0.04785 0.07861-0.0376 0.15039-0.11963 0.22217-0.22559 0.16748-0.51953-0.05469-0.29395-0.34863-0.42041-0.07178-0.04102-0.19825-0.04785-0.12646-0.00684-0.25293 0.00683z" fill="#852940" />
                </svg>
                <div data-pencil-id="QuMQD" data-pencil-name="Trámites y expedientes contenido" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "4px", "height": "fit-content", "justifyContent": "flex-start"}}>
                  <div data-pencil-id="Ql3NG" data-pencil-name="Trámites y expedientes nombre" style={{"boxSizing": "border-box", "color": "#30363B", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                    Trámites y expedientes
                  </div>
                  <div data-pencil-id="hvdSJ" data-pencil-name="Trámites y expedientes detalle" style={{"boxSizing": "border-box", "color": "#74797E", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                    Procesos ágiles y conectados
                  </div>
                </div>
                <svg data-pencil-id="KkBlR" data-pencil-name="Trámites y expedientes estado" data-icon-name="check" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "15px", "width": "15px"}}>
                  <path d="M11.48096 2.95313q-0.07178 0.01367-0.12989 0.0581-0.05469 0.04102-3.07617 3.06592l-3.0249 3.00781-1.28857-1.28857q-1.28857-1.28516-1.38086-1.32618-0.08887-0.04443-0.22217-0.04443-0.1333 0-0.23242 0.0376-0.0957 0.03418-0.18799 0.11279-0.08887 0.0752-0.1333 0.1709-0.02734 0.07178-0.03418 0.11279-0.00684 0.04102-0.00684 0.14014l0 0.04102q-0.01367 0.11279 0.04102 0.19824 0.07178 0.10938 0.36572 0.40332 0.19482 0.21191 0.96729 0.98096l1.49707 1.48339q0.28027 0.2666 0.38964 0.33838 0.07178 0.05469 0.18457 0.04102l0.09571 0.01367q0.07178 0 0.14013-0.02734 0.08545-0.07178 0.32129-0.28711 0.23926-0.21875 0.79981-0.76221l2.2832-2.2832q2.08496-2.09863 2.7002-2.71387 0.61524-0.61865 0.64599-0.68701 0.04102-0.08545 0.04102-0.23926 0-0.09912-0.00684-0.14014-0.00684-0.04102-0.03418-0.11279-0.04443-0.08203-0.13672-0.16406-0.08887-0.08545-0.18115-0.11963-0.08887-0.0376-0.20849-0.0376-0.11963 0-0.18799 0.02734z" fill="#5A7965" />
                </svg>
              </div>
            </div>
            <div data-pencil-id="jWZNu" data-pencil-name="Enlace software" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "12px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}} data-action="open:software" role="button" tabIndex={0}>
              <div data-pencil-id="p9HoMz" data-pencil-name="Conocer software" style={{"boxSizing": "border-box", "color": "#852940", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Conocer las soluciones de software
              </div>
              <svg data-pencil-id="UDxBm" data-pencil-name="Flecha software" data-icon-name="arrow-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "17px", "width": "17px"}}>
                <path d="M6.90088 2.35156q-0.18115 0.02734-0.32129 0.16748-0.11279 0.11279-0.14697 0.28028-0.03418 0.16748 0.02051 0.32129 0.02734 0.08545 0.25976 0.3247 0.23242 0.23584 1.36377 1.37061 1.58252 1.58252 1.58252 1.59619 0 0.01367-3.45557 0.01367l-3.44531 0-0.08545 0.04102q-0.22217 0.11279-0.30078 0.33838-0.0752 0.22217 0.00684 0.43408 0.05811 0.0957 0.14013 0.18115 0.08545 0.08203 0.16748 0.11963 0.08545 0.03418 0.53321 0.03418l3.01123 0q3.42822 0 3.42822 0.01367 0 0.01367-1.58252 1.59619-1.13135 1.13477-1.36377 1.37402-0.23242 0.23584-0.25976 0.3213-0.05469 0.15381-0.02051 0.32128 0.03418 0.16748 0.14697 0.28028 0.18115 0.18115 0.42041 0.18115l0.04102 0q0.11279 0 0.19824-0.05469 0.14014-0.09912 0.51611-0.46484l1.68164-1.67822q2.1123-2.10205 2.15332-2.18409 0.07178-0.12646 0.07178-0.28027 0-0.15381-0.07178-0.28027-0.04102-0.08203-2.1499-2.18067-2.10547-2.10205-2.17725-2.13623-0.06836-0.0376-0.23584-0.06494-0.04102 0-0.12646 0.01367z" fill="#852940" />
              </svg>
            </div>
          </div>
          <div data-pencil-id="MJpka" data-pencil-name="Más soluciones" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "0px", "height": "fit-content", "justifyContent": "flex-start"}}>
            <div data-pencil-id="IaUi0" data-pencil-name="Infraestructura que te respalda" style={{"alignItems": "flex-start", "borderColor": "#E2E1DC", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "22px", "height": "139.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "27px 0px", "width": "690px"}} data-action="open:hardware" role="button" tabIndex={0}>
              <div data-pencil-id="Fbkty" data-pencil-name="Infraestructura que te respalda símbolo" style={{"alignItems": "center", "backgroundColor": "#2A6D8312", "borderRadius": "6px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "48px", "justifyContent": "center", "width": "48px"}}>
                <svg data-pencil-id="wiYwp" data-pencil-name="Infraestructura que te respalda ícono" data-icon-name="server" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "25px", "width": "25px"}}>
                  <path d="M2.15674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.33496-0.43408 0.81005-0.02734 0.12646-0.04102 0.32471l0 2.64551 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-2.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.76904-0.44775-0.48877-1.13476-0.56055-0.16748-0.01367-4.81592-0.01367-4.64844 0-4.82959 0.02734z m9.74463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 2.6045-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-2.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 4.85694-0.02734l4.76123 0.01367 0.09912 0.04102z m-8.55518 1.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z m-1.18945 4.66211q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.3794-0.30762 0.32129-0.43408 0.79638-0.02734 0.12646-0.04102 0.32471l0 2.64551 0.04102 0.16748q0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 9.83008 0 0.16748-0.04102q0.25293-0.07178 0.44092-0.18115 0.18799-0.11279 0.36914-0.29394 0.18457-0.18457 0.29394-0.37256 0.11279-0.18799 0.18457-0.44092l0.04102-0.16748 0-2.83008-0.04102-0.16748q-0.12646-0.46143-0.43408-0.78271-0.44775-0.4751-1.13476-0.54688-0.16748-0.01367-4.81592-0.01367-4.64844 0-4.82959 0.02734z m9.74463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 2.6045-0.02735 0.08545q-0.12646 0.26318-0.37939 0.33496-0.08203 0.02734-4.82959 0.02734-4.74756 0-4.82959-0.02734-0.25293-0.07178-0.37939-0.33496l-0.02735-0.08545 0-2.6045 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 4.85694-0.02734l4.76123 0.01367 0.09912 0.04102z m-8.55518 1.13476q-0.25293 0.08545-0.37939 0.30762-0.04102 0.08545-0.04102 0.23926 0 0.15381 0.03418 0.23926 0.0376 0.08203 0.1333 0.18115 0.15381 0.15381 0.3999 0.16748 0.24609 0.01367 0.42041-0.16065 0.17432-0.17432 0.17432-0.41357 0-0.23926-0.16748-0.3999-0.16748-0.16064-0.39307-0.17432-0.14014 0-0.18115 0.01367z" fill="#2A6D83" />
                </svg>
              </div>
              <div data-pencil-id="WNc77" data-pencil-name="Infraestructura que te respalda contenido" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "11px", "height": "fit-content", "justifyContent": "flex-start"}}>
                <div data-pencil-id="W3g2RF" data-pencil-name="Infraestructura que te respalda título" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "23px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-0.5px", "lineHeight": "normal", "textAlign": "left", "width": "100%"}}>
                  Infraestructura que te respalda
                </div>
                <div data-pencil-id="z5ZvI" data-pencil-name="Infraestructura que te respalda descripción" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "15px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "23px", "textAlign": "left", "width": "100%"}}>
                  Equipamiento y tecnología para que cada área pueda trabajar mejor.
                </div>
                <div data-pencil-id="IxsIy" data-pencil-name="Infraestructura que te respalda categorías" style={{"boxSizing": "border-box", "color": "#2A6D83", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                  Servidores · Redes · CCTV
                </div>
              </div>
              <svg data-pencil-id="OZ4bC" data-pencil-name="Infraestructura que te respalda enlace" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "20px", "width": "20px"}}>
                <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#852940" />
              </svg>
            </div>
            <div data-pencil-id="g4BGBl" data-pencil-name="Más cerca de cada vecino" style={{"alignItems": "flex-start", "borderColor": "#E2E1DC", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "22px", "height": "139.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "27px 0px", "width": "690px"}} data-action="open:citizen" role="button" tabIndex={0}>
              <div data-pencil-id="uSsEA" data-pencil-name="Más cerca de cada vecino símbolo" style={{"alignItems": "center", "backgroundColor": "#71618D12", "borderRadius": "6px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "48px", "justifyContent": "center", "width": "48px"}}>
                <svg data-pencil-id="OnfLe" data-pencil-name="Más cerca de cada vecino ícono" data-icon-name="messages-square" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "25px", "width": "25px"}}>
                  <path d="M2.15674 0.60156q-0.29395 0.02734-0.58789 0.16748-0.29395 0.14014-0.50586 0.36573-0.30762 0.32129-0.43408 0.78271l-0.04102 0.16748 0 5.72852q0 0.58789 0.01367 0.68359 0.07178 0.43408 0.44092 0.67334 0.37256 0.23926 0.79297 0.12646 0.14014-0.04443 0.229-0.09912 0.09229-0.05469 0.28711-0.22216 0.14014-0.14014 0.57422-0.57422 0.4751-0.46484 0.62207-0.60157 0.14697-0.14014 0.21875-0.17089l0.0957-0.04102 4.6211-0.01367 0.15381-0.05469q0.36572-0.11279 0.65283-0.34863 0.28711-0.23926 0.44092-0.56397 0.14014-0.28027 0.18115-0.60156 0.01367-0.16748 0-2.04394l0-1.87647-0.04102-0.16748q-0.12646-0.46143-0.43408-0.76904-0.44775-0.48877-1.13476-0.56055-0.16748-0.01367-3.06592-0.01367-2.89844 0-3.07959 0.02734z m6.24463 1.20313q0.19482 0.09912 0.29394 0.29394l0.04102 0.09912 0 3.78028-0.04102 0.09912q-0.11279 0.22217-0.35205 0.32129-0.05469 0.01367-2.35156 0.02734l-2.31055 0-0.14013 0.04102q-0.14014 0.04443-0.30762 0.12988-0.16748 0.08203-0.28028 0.16064-0.11279 0.0752-0.65625 0.62207l-0.54687 0.52979 0.01367-5.71143 0.04102-0.09912q0.11279-0.24951 0.37939-0.32129 0.08545-0.02734 3.10694-0.02734l3.01123 0.01367 0.09912 0.04102z m3.07959 2.89844q-0.18457 0.05811-0.29053 0.21191-0.10254 0.15381-0.10254 0.33496 0 0.23926 0.16748 0.40674 0.08545 0.08203 0.17432 0.11963 0.09228 0.03418 0.24609 0.05468 0.15381 0.02051 0.23584 0.05811 0.08545 0.03418 0.16065 0.11279 0.07861 0.0752 0.12304 0.1709l0.04102 0.09912 0.01367 5.73877-0.57422-0.57422q-0.44775-0.43408-0.60156-0.56396-0.15381-0.1333-0.33496-0.21875-0.12646-0.05469-0.29395-0.09912l-0.1709-0.04102-2.27978-0.01367q-2.29688-0.01367-2.35156-0.02734-0.22559-0.08545-0.35205-0.33496-0.01367-0.05811-0.02735-0.14014-0.01367-0.08545-0.01367-0.3794-0.01367-0.42041-0.03418-0.48193-0.02051-0.06494-0.07861-0.14014-0.05469-0.07861-0.1128-0.11963-0.15381-0.11279-0.3623-0.11279-0.23926 0-0.40674 0.16748-0.12646 0.11279-0.15381 0.25977-0.02734 0.14697-0.01367 0.56738 0 0.2666 0.00684 0.36572 0.00684 0.0957 0.03418 0.2085 0.07178 0.25293 0.18115 0.44092 0.11279 0.18799 0.29394 0.37256 0.18457 0.18115 0.37256 0.29394 0.18799 0.10938 0.44092 0.18115l0.16748 0.04102 4.59375 0.01367 0.08203 0.04102q0.08545 0.04443 0.82715 0.78613 0.5332 0.51611 0.65625 0.63574 0.12646 0.11963 0.22559 0.16065 0.22558 0.11279 0.46142 0.11279 0.32129 0 0.58106-0.19482 0.25977-0.19824 0.37256-0.53321 0.01367-0.07178 0.02734-0.51953l0.01367-4.95605q-0.01367-0.69727-0.02734-0.93653-0.01367-0.18115-0.04102-0.32129-0.11279-0.39307-0.39307-0.70068-0.28027-0.30762-0.65966-0.46143-0.19482-0.07178-0.45459-0.10595-0.25977-0.03418-0.36914 0.02051z" fill="#71618D" />
                </svg>
              </div>
              <div data-pencil-id="Xphem" data-pencil-name="Más cerca de cada vecino contenido" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "11px", "height": "fit-content", "justifyContent": "flex-start"}}>
                <div data-pencil-id="Z7QOCI" data-pencil-name="Más cerca de cada vecino título" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "23px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-0.5px", "lineHeight": "normal", "textAlign": "left", "width": "100%"}}>
                  Más cerca de cada vecino
                </div>
                <div data-pencil-id="x3Ox2T" data-pencil-name="Más cerca de cada vecino descripción" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "15px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "23px", "textAlign": "left", "width": "100%"}}>
                  Canales y herramientas para una atención ciudadana accesible y ágil.
                </div>
                <div data-pencil-id="W66UsI" data-pencil-name="Más cerca de cada vecino categorías" style={{"boxSizing": "border-box", "color": "#71618D", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                  Autogestión · Tótems · Digitalización
                </div>
              </div>
              <svg data-pencil-id="VelhG" data-pencil-name="Más cerca de cada vecino enlace" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "20px", "width": "20px"}}>
                <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#852940" />
              </svg>
            </div>
            <div data-pencil-id="rK9wy" data-pencil-name="Todo para el trabajo diario" style={{"alignItems": "flex-start", "borderColor": "#E2E1DC", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "22px", "height": "139.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "27px 0px", "width": "690px"}} data-action="open:supplies" role="button" tabIndex={0}>
              <div data-pencil-id="W0Gpi" data-pencil-name="Todo para el trabajo diario símbolo" style={{"alignItems": "center", "backgroundColor": "#4B756712", "borderRadius": "6px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "48px", "justifyContent": "center", "width": "48px"}}>
                <svg data-pencil-id="rPsnW" data-pencil-name="Todo para el trabajo diario ícono" data-icon-name="package" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "25px", "width": "25px"}}>
                  <path d="M6.65137 0.61523q-0.22559 0.05811-0.43408 0.15381-0.14014 0.07178-2.16358 1.23389-2.02344 1.16211-2.10889 1.2168-0.58789 0.39307-0.74169 1.07666-0.02734 0.11279-0.02735 0.49218l0 2.21143 0 2.14307q0 0.43408 0.02734 0.52978 0.07178 0.35205 0.26661 0.63916 0.19482 0.28711 0.48877 0.48194 0.18457 0.11279 2.19775 1.26806 2.0166 1.15527 2.12939 1.19629 0.19482 0.08203 0.34864 0.11963 0.15723 0.03418 0.37256 0.03418 0.21875 0 0.39306-0.04102 0.17432-0.04443 0.38281-0.1538 0.15381-0.07178 2.12598-1.19629 1.97559-1.12793 2.11572-1.22705 0.31104-0.19482 0.50586-0.48194 0.19482-0.28711 0.2666-0.63916 0.02734-0.0957 0.02735-0.52978l0-2.14307 0-2.14307q0-0.43408-0.02735-0.52978-0.07178-0.32471-0.25976-0.61865-0.18799-0.29395-0.45459-0.4751-0.12647-0.08203-2.15674-1.24414-2.03027-1.16211-2.18408-1.23389-0.18115-0.08203-0.32129-0.11621-0.14014-0.0376-0.37939-0.0376-0.28027 0-0.38965 0.01367z m0.57422 1.18946q0.0957 0.04443 1.96533 1.10742 1.86963 1.06299 1.86963 1.07666 0 0.01367-0.70752 0.41357-0.70752 0.3999-0.73487 0.39991-0.02734 0-2.03711-1.14844-2.00977-1.14844-2.00976-1.16211 0-0.01367 0.48193-0.28711 0.48535-0.27344 0.63916-0.35547 0.12646-0.07178 0.18116-0.08545 0.05811-0.01367 0.17431 0 0.11963 0.01367 0.17774 0.04102z m-0.81348 2.52246q2.03027 1.16211 2.02344 1.16894-0.00684 0.00684-0.70752 0.41358-0.44775 0.26318-0.58789 0.33496-0.14014 0.06836-0.17432 0.05469-0.03418-0.01367-2.03027-1.15528-1.99609-1.1416-1.9961-1.14843 0-0.00684 0.71436-0.417 0.71436-0.41357 0.71435-0.41357l2.04395 1.16211z m-2.03027 1.8457l2.04394 1.16211 0 2.33789q0 2.33789-0.01367 2.32422l-1.91748-1.09033q-1.91748-1.09375-1.98242-1.15528-0.06152-0.06494-0.11963-0.17431l-0.05469-0.11279 0-2.2251q-0.01367-2.24219 0-2.24219 0.01367 0 2.04395 1.17578z m7.28027 1.06641l0 2.2251-0.05469 0.11279q-0.05811 0.10938-0.12305 0.17431-0.06152 0.06152-1.979 1.15528l-1.91748 1.09033q-0.01367 0.01367-0.01367-2.32422l0-2.33789 3.15137-1.80469q0.92285-0.51953 0.93652-0.52636 0.01367-0.00684 0 2.23535z" fill="#4B7567" />
                </svg>
              </div>
              <div data-pencil-id="Ig42i" data-pencil-name="Todo para el trabajo diario contenido" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "11px", "height": "fit-content", "justifyContent": "flex-start"}}>
                <div data-pencil-id="qBE8O" data-pencil-name="Todo para el trabajo diario título" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "23px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-0.5px", "lineHeight": "normal", "textAlign": "left", "width": "100%"}}>
                  Todo para el trabajo diario
                </div>
                <div data-pencil-id="xIagW" data-pencil-name="Todo para el trabajo diario descripción" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "15px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "23px", "textAlign": "left", "width": "100%"}}>
                  Insumos y equipamiento para acompañar los servicios de tu municipio.
                </div>
                <div data-pencil-id="Wp90n" data-pencil-name="Todo para el trabajo diario categorías" style={{"boxSizing": "border-box", "color": "#4B7567", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                  Insumos · Dispositivos · Equipamiento
                </div>
              </div>
              <svg data-pencil-id="uwPjr" data-pencil-name="Todo para el trabajo diario enlace" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "20px", "width": "20px"}}>
                <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#852940" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div data-pencil-id="WmtGi" data-pencil-name="Acompañamiento · Personas y tecnología" style={{"alignItems": "flex-start", "backgroundColor": "#232D32", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "92px", "height": "fit-content", "justifyContent": "flex-start", "padding": "76px 72px", "width": "100%"}} id="acompanamiento">
        <div data-pencil-id="zfVmC" data-pencil-name="Promesa de acompañamiento" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "24px", "height": "fit-content", "justifyContent": "flex-start", "width": "570px"}}>
          <div data-pencil-id="BJeF9" data-pencil-name="Etiqueta acompañamiento" style={{"boxSizing": "border-box", "color": "#DAB5BF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "1.5px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            UN EQUIPO, DE PRINCIPIO A FIN
          </div>
          <div data-pencil-id="JyTgy" data-pencil-name="Personas detrás de la tecnología" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "43px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-1.5px", "lineHeight": "49px", "textAlign": "left", "width": "100%"}}>
            Detrás de cada solución,
            <br />
            hay personas.
          </div>
          <div data-pencil-id="f9Q3jm" data-pencil-name="Descripción acompañamiento" style={{"boxSizing": "border-box", "color": "#BCC5C9", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "16px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "27px", "textAlign": "left", "width": "480px"}}>
            Entendemos los desafíos de la gestión pública. Por eso, te acompañamos desde la primera conversación y en cada paso que sigue.
          </div>
          <div data-pencil-id="mi5Gw" data-pencil-name="Compromiso humano" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "12px", "height": "fit-content", "justifyContent": "flex-start", "padding": "14px 0px 0px 0px", "width": "100%"}}>
            <svg data-pencil-id="ik6F0" data-pencil-name="Contacto humano" data-icon-name="handshake" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "23px", "width": "23px"}}>
              <path d="M1.59619 1.18945q-0.12646 0.04102-0.23926 0.14698-0.10938 0.10596-0.14697 0.21191-0.03418 0.10254-0.3418 3.38037l-0.29394 3.27441 0.04101 0.12647q0.02734 0.12646 0.1128 0.22559 0.12646 0.14014 2.03027 2.03027 1.90381 1.89014 1.98926 1.9585 0.26318 0.19482 0.60156 0.29394 0.15381 0.04101 0.39649 0.05811 0.24609 0.01367 0.41357-0.03077 0.58789-0.11279 0.98096-0.51611 0.19482-0.21191 0.30761-0.43408l0.07178-0.14014q0 0 0.15381 0.06836 0.18115 0.09912 0.33496 0.1333 0.15381 0.03418 0.37598 0.03418 0.2666 0.01367 0.46826-0.02734 0.20508-0.04101 0.43066-0.15381 0.4751-0.23926 0.7417-0.70068 0.05469-0.0957 0.11621-0.23584 0.06494-0.14014 0.07862-0.23926l0.02734-0.09912 0.2666 0q0.22559 0 0.35547-0.02735 0.1333-0.02734 0.34521-0.11279 0.30762-0.10938 0.57422-0.37598 0.2666-0.2666 0.38282-0.56738 0.11963-0.30078 0.14697-0.58105l0-0.14014 0.33838 0q0.22217-0.01367 0.28369-0.02051 0.06494-0.00684 0.12305-0.03418 0.12305-0.05811 0.22217-0.18115 0.09912-0.12646 0.12646-0.2666 0.01367-0.07178-0.28711-3.33252-0.30078-3.26416-0.32812-3.35303-0.02734-0.09229-0.1128-0.18799-0.08545-0.09912-0.17773-0.14013-0.08887-0.04443-0.21533-0.05811-0.12647-0.01367-0.23243 0.02051-0.10254 0.03418-0.20849 0.14014-0.10254 0.10596-0.14014 0.19824-0.03418 0.08887-0.03418 0.21533 0 0.06836-0.00683 0.09229-0.00684 0.02051-0.03418 0.0205-0.14014 0.04102-0.36573 0.07862-0.22217 0.03418-0.28027 0.03418-0.14014 0-0.42041-0.1709-0.41699-0.24951-0.78272-0.38281-0.3623-0.1333-0.78271-0.20508-0.22559-0.04102-0.62549-0.04102-0.39648 0-0.62207 0.04102-0.70068 0.12646-1.25781 0.44775l-0.1709 0.08545-4.00244 0 0-0.05469q0-0.04443-0.02734-0.14013-0.02734-0.09912-0.14014-0.21192-0.11279-0.11279-0.19824-0.14013-0.08203-0.02734-0.19483-0.02735-0.11279 0-0.16748 0.01367z m7.2666 1.17578q0.2666 0.04443 0.50244 0.14356 0.23926 0.0957 0.57422 0.29053 0.30762 0.16748 0.42041 0.22558 0.25293 0.0957 0.51612 0.1128 0.2666 0.01367 0.61865-0.05811 0.2666-0.05469 0.27344-0.04785 0.00684 0.00684 0.21533 2.21826l0.21191 2.32422-0.28027 0-1.24756-1.23389q-0.93652-0.93652-1.19629-1.17236-0.25977-0.23926-0.45459-0.35205-0.44775-0.25293-0.98779-0.28711-0.54004-0.03418-1.01514 0.16064-0.28027 0.11279-0.48535 0.25977-0.20166 0.14697-0.55029 0.49219-0.34863 0.3418-0.40674 0.36914-0.12646 0.08203-0.32813 0.08203-0.20166 0-0.34179-0.08203-0.29395-0.19482-0.29395-0.56055 0-0.16748 0.06836-0.30762 0.02734-0.05469 0.92969-0.96386 0.90576-0.9126 1.0459-1.0254 0.65625-0.52979 1.52441-0.60156 0.32129-0.04102 0.68701 0.01367z m-4.45361 1.13477q-0.46143 0.4751-0.60156 0.65283-0.14014 0.17432-0.23242 0.38623-0.08887 0.2085-0.10938 0.3418-0.02051 0.12988-0.02051 0.36914 0 0.23926 0.02051 0.37256 0.02051 0.12988 0.11963 0.3418 0.10938 0.30762 0.37598 0.57421 0.2666 0.2666 0.57421 0.37598 0.21191 0.09912 0.3418 0.11963 0.1333 0.02051 0.37256 0.02051 0.23926 0 0.36914-0.02051 0.1333-0.02051 0.32813-0.10254 0.19824-0.08545 0.36572-0.21191 0.16748-0.12646 0.49219-0.44776 0.28027-0.2666 0.3623-0.33496 0.08545-0.07178 0.18115-0.12646 0.51953-0.25293 1.05274 0 0.10938 0.05469 0.28369 0.22558 0.17773 0.16748 1.11426 1.09033l0.21191 0.22217q0.62891 0.61865 0.79639 0.79981 0.23926 0.23926 0.29394 0.34863 0.04102 0.08545 0.04102 0.21191l0 0.04102q0 0.11279-0.01367 0.15381-0.01367 0.04102-0.04102 0.11279-0.12647 0.28027-0.39307 0.34863-0.12647 0.04443-0.28027 0.03077-0.15381-0.01709-0.23584-0.08545-0.05811-0.02734-0.85791-0.8169-0.79639-0.79297-0.86475-0.83398-0.11279-0.07178-0.27343-0.07178-0.16064 0-0.28711 0.07178-0.2085 0.0957-0.28028 0.32812-0.06836 0.229 0.04444 0.45459 0.02734 0.06836 0.68359 0.7417l0.50586 0.50244q0.15381 0.1709 0.19483 0.24268 0.04102 0.06836 0.05468 0.17773 0.04443 0.33838-0.19482 0.57422-0.29395 0.28027-0.70069 0.12647-0.05469-0.02734-0.18115-0.1333-0.12646-0.10596-0.57422-0.56739-0.67334-0.65625-0.7417-0.69726-0.11279-0.07178-0.27343-0.07178-0.16064 0-0.28711 0.07178-0.2085 0.0957-0.28028 0.32812-0.06836 0.229 0.02735 0.45459 0.04443 0.06836 0.2666 0.29395 0.18115 0.18115 0.23584 0.28027 0.05811 0.0957 0.07178 0.22217 0.05811 0.32471-0.18116 0.56055-0.29395 0.28027-0.70068 0.14013-0.06836-0.02734-0.35547-0.30761-0.28711-0.28027-1.60303-1.58252l-1.84912-1.8628 0.44776-5.01074 2.77197 0-0.58789 0.57422z" fill="#DAB5BF" />
            </svg>
            <div data-pencil-id="OiLTD" data-pencil-name="Compromiso directo" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              Un vínculo cercano. Una respuesta integral.
            </div>
          </div>
        </div>
        <div data-pencil-id="dZzYb" data-pencil-name="Cómo trabajamos" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "27px", "height": "fit-content", "justifyContent": "flex-start"}}>
          <div data-pencil-id="fLndA" data-pencil-name="Paso 01" style={{"alignItems": "flex-start", "borderColor": "#465055", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "24px", "height": "81.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "0px 0px 25px 0px", "width": "634px"}}>
            <div data-pencil-id="F19zK" data-pencil-name="Número 01" style={{"boxSizing": "border-box", "color": "#DAB5BF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              01
            </div>
            <div data-pencil-id="FeQr2" data-pencil-name="Escuchamos tu necesidad" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "10px", "height": "fit-content", "justifyContent": "flex-start"}}>
              <div data-pencil-id="UGS8y" data-pencil-name="Escuchamos tu necesidad título" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "21px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-0.3px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Escuchamos tu necesidad
              </div>
              <div data-pencil-id="dFkXs" data-pencil-name="Escuchamos tu necesidad detalle" style={{"boxSizing": "border-box", "color": "#BCC5C9", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "22px", "textAlign": "left", "width": "100%"}}>
                Conocemos tu municipio y definimos juntos las prioridades.
              </div>
            </div>
          </div>
          <div data-pencil-id="YS0jG" data-pencil-name="Paso 02" style={{"alignItems": "flex-start", "borderColor": "#465055", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "24px", "height": "81.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "0px 0px 25px 0px", "width": "634px"}}>
            <div data-pencil-id="l9I8YW" data-pencil-name="Número 02" style={{"boxSizing": "border-box", "color": "#DAB5BF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              02
            </div>
            <div data-pencil-id="TIGH4" data-pencil-name="Conectamos las soluciones" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "10px", "height": "fit-content", "justifyContent": "flex-start"}}>
              <div data-pencil-id="ttnir" data-pencil-name="Conectamos las soluciones título" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "21px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-0.3px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Conectamos las soluciones
              </div>
              <div data-pencil-id="jxe2G" data-pencil-name="Conectamos las soluciones detalle" style={{"boxSizing": "border-box", "color": "#BCC5C9", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "22px", "textAlign": "left", "width": "100%"}}>
                Integramos tecnología, equipamiento y servicios a tu medida.
              </div>
            </div>
          </div>
          <div data-pencil-id="n328tV" data-pencil-name="Paso 03" style={{"alignItems": "flex-start", "borderColor": "#465055", "borderStyle": "solid", "borderWidth": "0px 0px 1px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "24px", "height": "81.5px", "justifyContent": "flex-start", "margin": "0px 0px -0.5px 0px", "padding": "0px 0px 25px 0px", "width": "634px"}}>
            <div data-pencil-id="rqV5x" data-pencil-name="Número 03" style={{"boxSizing": "border-box", "color": "#DAB5BF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "13px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              03
            </div>
            <div data-pencil-id="AGsPQ" data-pencil-name="Te acompañamos siempre" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "10px", "height": "fit-content", "justifyContent": "flex-start"}}>
              <div data-pencil-id="N5HtU" data-pencil-name="Te acompañamos siempre título" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "21px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-0.3px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
                Te acompañamos siempre
              </div>
              <div data-pencil-id="n0krpS" data-pencil-name="Te acompañamos siempre detalle" style={{"boxSizing": "border-box", "color": "#BCC5C9", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "14px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "22px", "textAlign": "left", "width": "100%"}}>
                Un equipo disponible para ayudarte en el día a día.
              </div>
            </div>
          </div>
        </div>
      </div>
      <NosotrosEmpresa/>
      <TestimonioGerardo onAction={onAction}/>
      <MapaArgentina onContact={() => onAction("open:contact")}/>
      <div data-pencil-id="HoEnZ" data-pencil-name="Contacto · Próximo paso" style={{"alignItems": "center", "backgroundColor": "#EEE5E2", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "90px", "height": "fit-content", "justifyContent": "flex-start", "padding": "76px 72px", "width": "100%"}} id="contacto">
        <div data-pencil-id="oXHjc" data-pencil-name="Invitación a conversar" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flex": "1 1 0", "gap": "18px", "height": "fit-content", "justifyContent": "flex-start"}}>
          <div data-pencil-id="Xg5sw" data-pencil-name="Etiqueta contacto" style={{"boxSizing": "border-box", "color": "#852940", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "700", "letterSpacing": "1.25px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            EL PRÓXIMO PASO EMPIEZA CON UNA CONVERSACIÓN
          </div>
          <div data-pencil-id="oordG" data-pencil-name="Título contacto" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "43px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "-1.5px", "lineHeight": "49px", "textAlign": "left", "width": "100%"}}>
            Tu municipio puede más.
            <br />
            Hagámoslo posible.
          </div>
          <div data-pencil-id="qJ9fW" data-pencil-name="Descripción contacto" style={{"boxSizing": "border-box", "color": "#686265", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "16px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "26px", "textAlign": "left", "width": "100%"}}>
            Contanos qué necesitás. Encontramos la solución juntos.
          </div>
        </div>
        <div data-pencil-id="LlggU" data-pencil-name="Acción de contacto" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "15px", "height": "fit-content", "justifyContent": "flex-start", "width": "320px"}}>
          <div data-pencil-id="v489hB" data-pencil-name="Solicitar asesoramiento final" style={{"alignItems": "center", "backgroundColor": "#852940", "borderRadius": "5px", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "space-between", "padding": "21px 25px", "width": "100%"}} data-action="open:contact" role="button" tabIndex={0}>
            <div data-pencil-id="PLppi" data-pencil-name="Texto asesoramiento final" style={{"boxSizing": "border-box", "color": "#FFFFFF", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "15px", "fontStyle": "normal", "fontWeight": "600", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              Solicitar asesoramiento
            </div>
            <svg data-pencil-id="glloN" data-pencil-name="Flecha asesoramiento final" data-icon-name="arrow-up-right" data-icon-set="lucide" viewBox="0 0 13.99993896484375 14" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{"boxSizing": "border-box", "flexShrink": "0", "height": "20px", "width": "20px"}}>
              <path d="M3.94775 3.51367q-0.14014 0.04102-0.25976 0.15381-0.11963 0.11279-0.16065 0.25293-0.05469 0.19482 0.02735 0.39307 0.08545 0.19482 0.25293 0.29394 0.08545 0.02734 0.19482 0.04102 0.1709 0.01367 0.65967 0.02734l3.83496 0-2.45068 2.45068q-1.65088 1.65088-2.05762 2.07129-0.40332 0.42041-0.43408 0.4751-0.10938 0.23926-0.01367 0.46485 0.09912 0.22217 0.32128 0.32128 0.22559 0.0957 0.46485-0.01367 0.05469-0.03076 0.4751-0.43408 0.42041-0.40674 2.07129-2.05762l2.45068-2.45068 0 2.21143q0 2.2251 0.02734 2.31054 0.02734 0.18115 0.15381 0.29395 0.19824 0.19482 0.46143 0.17431 0.2666-0.02051 0.42041-0.24609l0.02734-0.02734q0.04443-0.05469 0.05811-0.18116 0.01367-0.15381 0.02734-0.68701l0-5.37646-0.04102-0.09571q-0.02734-0.11279-0.12646-0.21191-0.09912-0.09912-0.21192-0.12646l-0.0957-0.04102-3.01123 0q-2.99414 0-3.06592 0.01367z" fill="#FFFFFF" />
            </svg>
          </div>
          <div data-pencil-id="Ri4HB" data-pencil-name="Contacto sin compromiso" style={{"boxSizing": "border-box", "color": "#73676B", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            Atención personal, desde el primer contacto.
          </div>
        </div>
      </div>
      <div data-pencil-id="D2Zj5" data-pencil-name="Pie de página" style={{"alignItems": "flex-start", "backgroundColor": "#F8F7F4", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "34px", "height": "fit-content", "justifyContent": "flex-start", "padding": "42px 72px 28px 72px", "width": "100%"}}>
        <div data-pencil-id="xjvZm" data-pencil-name="Identidad y navegación de cierre" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "fit-content", "justifyContent": "space-between", "width": "100%"}}>
          <div data-pencil-id="yZIEd" data-pencil-name="Identidad de cierre" style={{"alignItems": "flex-start", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "flexShrink": "0", "gap": "9px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
            <div data-pencil-id="PMYyE" data-pencil-name="Marca de cierre" style={{"boxSizing": "border-box", "color": "#202429", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "25px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "-1px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              MuniTotal
            </div>
            <div data-pencil-id="YSeVx" data-pencil-name="Lema de cierre" style={{"boxSizing": "border-box", "color": "#666B70", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
              Un solo proveedor. Todo el municipio.
            </div>
          </div>
          <div data-pencil-id="yt69E" data-pencil-name="Navegación de cierre" style={{"alignItems": "center", "boxSizing": "border-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "30px", "height": "fit-content", "justifyContent": "flex-start", "width": "fit-content"}}>
            <a data-pencil-id="cQR6g" data-pencil-name="Soluciones pie" style={{"boxSizing": "border-box", "color": "#494E53", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#soluciones" className="scroll-link">
              Soluciones
            </a>
            <a data-pencil-id="j0vti" data-pencil-name="Cómo trabajamos pie" style={{"boxSizing": "border-box", "color": "#494E53", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#acompanamiento" className="scroll-link">
              Cómo trabajamos
            </a>
            <a href="#nosotros" className="scroll-link">Nosotros</a>
            <a data-pencil-id="GW2AP" data-pencil-name="Contacto pie" style={{"boxSizing": "border-box", "color": "#494E53", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "12px", "fontStyle": "normal", "fontWeight": "500", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} href="#contacto" className="scroll-link">
              Contacto
            </a>
          </div>
        </div>
        <div data-pencil-id="Z4i36" data-pencil-name="Información legal" style={{"alignItems": "flex-start", "borderColor": "#DEDCD7", "borderStyle": "solid", "borderWidth": "1px 0px 0px 0px", "boxSizing": "content-box", "display": "flex", "flexDirection": "row", "flexShrink": "0", "gap": "0px", "height": "33.5px", "justifyContent": "space-between", "margin": "-0.5px 0px 0px 0px", "padding": "21px 0px 0px 0px", "width": "1296px"}}>
          <div data-pencil-id="azqls" data-pencil-name="Derechos" style={{"boxSizing": "border-box", "color": "#777B7E", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}}>
            © {new Date().getFullYear()} MuniTotal · Una unidad de negocios de INFT S.A.
          </div>
          <div data-pencil-id="Q58iI" data-pencil-name="Privacidad" style={{"boxSizing": "border-box", "color": "#777B7E", "fontFamily": "Inter, system-ui, sans-serif", "fontSize": "11px", "fontStyle": "normal", "fontWeight": "400", "letterSpacing": "0px", "lineHeight": "normal", "textAlign": "left", "whiteSpace": "nowrap"}} data-action="open:privacy" role="button" tabIndex={0}>
            Política de privacidad
          </div>
        </div>
      </div>
    </div>
      <div className="corporate-footer">
        <span>Con el respaldo de <a href="https://www.inft.com.ar" target="_blank" rel="noopener noreferrer">INFT S.A.</a></span>
        <span>Software municipal por <a href="https://www.ggmm.com.ar" target="_blank" rel="noopener noreferrer">GGMM</a></span>
        <a href="mailto:munitotal@inft.com.ar">munitotal@inft.com.ar</a>
      </div>
    </div>
  );
}
