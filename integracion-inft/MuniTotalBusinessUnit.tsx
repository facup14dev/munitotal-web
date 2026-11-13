// Componente independiente para incorporar en la web existente de INFT S.A.
// Importar junto con './MuniTotalBusinessUnit.css' dentro de la página de unidades.
// Ajustar integración y navegación al repositorio real de INFT.
import { ArrowUpRight, Building2, HeartHandshake, MonitorCog, Server, TrafficCone } from 'lucide-react';
import './MuniTotalBusinessUnit.css';

const offers = [
  {
    title: 'Software',
    text: 'Potenciado por la experiencia de GGMM: gestión de finanzas, atención ciudadana, obras públicas, seguridad y más.',
    icon: MonitorCog,
  },
  {
    title: 'Infraestructura y hardware',
    text: 'Equipamiento, servidores y tecnología para centros de monitoreo y puestos de trabajo.',
    icon: Server,
  },
  {
    title: 'Soluciones ciudadanas',
    text: 'Tótems, portales, herramientas de atención al vecino e infraestructura para mejorar la ciudad.',
    icon: HeartHandshake,
  },
  {
    title: 'Insumos municipales',
    text: 'Semaforización LED de última generación e insumos de uso diario para las oficinas municipales.',
    icon: TrafficCone,
  },
];

export default function MuniTotalBusinessUnit() {
  return (
    <section className="inft-munitotal" id="munitotal" aria-labelledby="inft-munitotal-heading">
      <div className="inft-munitotal__container">
        <div className="inft-munitotal__top">
          <div>
            <div className="inft-munitotal__tag"><Building2 size={16} /> Nueva unidad de negocio · Sector público</div>
            <h2 id="inft-munitotal-heading">MuniTotal <span>Todo lo que su municipio necesita, en un solo lugar.</span></h2>
          </div>
          <a className="inft-munitotal__primary" href="https://munitotal.com.ar/" target="_blank" rel="noopener noreferrer">Conocer MuniTotal <ArrowUpRight size={18} /></a>
        </div>
        <div className="inft-munitotal__intro">
          <p>En INFT S.A. llevamos más de 25 años transformando la gestión pública con soluciones tecnológicas a medida. Conocemos personalmente los desafíos diarios de los gobiernos locales y, por eso, dimos el siguiente paso: creamos <strong>MuniTotal</strong>, la unidad de negocios diseñada para resolver todas las necesidades operativas y tecnológicas de su municipio.</p>
          <p><strong>Un solo proveedor. Todo el municipio.</strong><br />Con el respaldo de INFT S.A., centralizamos en una sola propuesta integral:</p>
        </div>
        <div className="inft-munitotal__grid">
          {offers.map(({ title, text, icon: Icon }) => (
            <article className="inft-munitotal__card" key={title}>
              <div className="inft-munitotal__icon"><Icon size={25} strokeWidth={1.7}/></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <div className="inft-munitotal__bottom">
          <div><h3>Acompañamos a los municipios de la A a la Z.</h3><p>Simplificamos las compras sin perder lo más importante: la atención persona-persona.</p><p>¿Tiene un proyecto en mente o necesita equipar su municipio? No dude en escribirnos. Detrás de cada consulta hay una persona lista para asesorarlo de manera directa y ágil.</p></div>
          <a href="mailto:munitotal@inft.com.ar?subject=Consulta%20desde%20INFT%20-%20MuniTotal">Consultar por correo <ArrowUpRight size={17}/></a>
        </div>
      </div>
    </section>
  );
}
