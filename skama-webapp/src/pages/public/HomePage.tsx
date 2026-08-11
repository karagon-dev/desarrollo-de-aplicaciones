import { Link as RouterLink } from 'react-router-dom';

import { ROUTES } from '../../routes/routePaths';

const values = [
  {
    icon: 'M',
    title: 'Misión',
    text: 'Crear joyas exclusivas que celebren la elegancia, la identidad costarricense y la belleza natural de las esmeraldas, ofreciendo una experiencia premium en cada visita.',
  },
  {
    icon: 'V',
    title: 'Visión',
    text: 'Consolidar nuestra firma como una casa de joyería reconocida por su lujo sereno, su atención personalizada y sus colecciones atemporales.',
  },
  {
    icon: 'S',
    title: 'Valores',
    text: 'Autenticidad, excelencia artesanal, calidad premium, confianza, elegancia y compromiso con una experiencia de compra sofisticada y segura.',
  },
  {
    icon: 'U',
    title: 'Ubicaciones',
    text: 'Centros comerciales del país: Multiplaza Escazú, Oxígeno y City Mall. Souvenirs en Jacó, Santa Teresa y Playa Tamarindo, Guanacaste.',
  },
];

const processSteps = [
  { number: '01', label: 'Diseño exclusivo' },
  { number: '02', label: 'Materiales premium' },
  { number: '03', label: 'Elaboración artesanal' },
];

export function HomePage() {
  return (
    <div className="sk-page sk-home-page">
      <section className="sk-hero-home" aria-labelledby="home-hero-title">
        <div className="sk-hero-home__inner">
          <div className="sk-hero-home__copy">
            <p className="sk-kicker">De Costa Rica para el mundo</p>
            <h1 id="home-hero-title">Descubre el lujo de las esmeraldas.</h1>
            <p className="sk-lede">
              Inspiradas en la riqueza natural de nuestro país, nuestras colecciones combinan
              diseño contemporáneo, materiales de alta calidad y esmeraldas cuidadosamente
              seleccionadas para crear joyas inolvidables.
            </p>
            <div className="sk-actions" aria-label="Acciones principales">
              <RouterLink className="sk-button sk-button--primary sk-button--lg" to={ROUTES.catalog}>
                Explorar colecciones
              </RouterLink>
            </div>
            <div className="sk-stat-grid" aria-label="Indicadores de la marca">
              <div className="sk-stat">
                <strong>16</strong>
                <span>Colecciones</span>
              </div>
              <div className="sk-stat">
                <strong>100%</strong>
                <span>Esmeraldas naturales</span>
              </div>
              <div className="sk-stat">
                <strong>500+</strong>
                <span>Clientes satisfechos</span>
              </div>
              <div className="sk-stat">
                <strong>Ediciones</strong>
                <span>Limitadas</span>
              </div>
            </div>
          </div>

          <div className="sk-hero-showcase" aria-label="Composición editorial de nuestra joyería">
            <span className="sk-hero-showcase__halo" aria-hidden="true" />
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--portrait">
              <img
                src="/assets/images/hero/skama-hero-exterior.png"
                alt="Exterior moderno de SKAMA Jewelry en Jacó"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--landscape">
              <img
                src="/assets/images/hero/skama-hero-jewelry-detail.png"
                alt="Joyería con collares, anillos, aretes y esmeraldas en una vitrina"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--detail">
              <img
                src="/assets/images/hero/skama-hero-interior.png"
                alt="Interior de joyería con vitrinas, mármol negro y detalles dorados"
              />
            </picture>
            <div className="sk-hero-showcase__caption" aria-hidden="true">
              <span>Editorial</span>
              <strong>Emerald Focus</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="sk-section sk-section--story" id="brand-story" aria-labelledby="brand-story-title">
        <div className="sk-story-panel">
          <p className="sk-kicker">Nuestra historia</p>
          <h2 id="brand-story-title">Una joyería nacida para plasmar la naturaleza costarricense.</h2>
          <p>
            Nuestros inicios se plasmaron en Jacó durante el año 2025 con la visión de transformar
            la riqueza natural del país en piezas de alta joyería inspiradas en su flora y fauna.
            Cada colección representa elegancia, sofisticación y el orgullo de reflejar una nación
            que alberga cerca del cinco por ciento de la biodiversidad mundial.
          </p>
          <p>
            Desde entonces buscamos ofrecer una experiencia única, donde cada colección transmita
            identidad cultural, inspiración natural, artesanía costarricense y lujo contemporáneo
            para visitantes nacionales y extranjeros.
          </p>
        </div>
      </section>

      <section className="sk-section sk-section--experience" aria-labelledby="experience-title">
        <div className="sk-split sk-experience-split">
          <figure className="sk-split-media sk-split-media--boutique">
            <img
              src="/assets/images/hero/skama-about-exterior-complete.png"
              alt="Fachada completa de SKAMA Jewelry"
              loading="lazy"
            />
          </figure>
          <div className="sk-split-copy">
            <p className="sk-kicker">Nuestra historia</p>
            <h2 id="experience-title">Más que una joyería, una experiencia inolvidable.</h2>
            <p>
              Nuestros espacios fueron diseñados para transmitir exclusividad desde el primer momento.
              Cada visita combina arquitectura contemporánea, materiales nobles e iluminación
              cuidadosamente estudiada para ofrecer una experiencia única, donde cada persona descubre
              el verdadero valor de una joya creada con dedicación y pasión.
            </p>
            <p>
              Nuestros asesores acompañan cada elección con atención personalizada, mientras nuestros
              artesanos sostienen un compromiso constante con la calidad, la precisión y el carácter
              distintivo de nuestras colecciones.
            </p>
          </div>
        </div>
      </section>

      <section className="sk-section sk-section--process" aria-labelledby="craft-title">
        <div className="sk-split sk-process-split">
          <div className="sk-split-copy">
            <p className="sk-kicker">Nuestro proceso</p>
            <h2 id="craft-title">Cada detalle refleja la dedicación de nuestros artesanos.</h2>
            <p>
              En nuestras instalaciones, cada pieza es elaborada por profesionales especializados en alta
              joyería que trabajan cuidadosamente utilizando herramientas de precisión y técnicas artesanales
              combinadas con procesos modernos. Nuestro compromiso es garantizar acabados impecables, máxima
              calidad y una atención excepcional durante cada creación.
            </p>
            <div className="sk-stat-grid" aria-label="Indicadores del proceso artesanal">
              {processSteps.map((step) => (
                <div className="sk-stat" key={step.number}>
                  <strong>{step.number}</strong>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
          <figure className="sk-split-media sk-split-media--artisan">
            <img
              src="/assets/images/hero/skama-about-artisan.png"
              alt="Artesano elaborando una joya con herramientas de precisión"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="sk-section sk-section--values" aria-label="Identidad SKAMA">
        <div hidden className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Identidad SKAMA</p>
            <h2 id="values-title">Lujo sobrio, raíces locales y atención personalizada.</h2>
          </div>
        </div>
        <div className="sk-feature-grid">
          {values.map((value) => (
            <article className="sk-card sk-card-feature" key={value.title}>
              <span className="sk-card-feature__icon" aria-hidden="true">
                {value.icon}
              </span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section hidden className="sk-section sk-section--muted" aria-labelledby="featured-title">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Selección destacada</p>
            <h2 id="featured-title">Piezas listas para momentos memorables.</h2>
            <p className="sk-lede">
              Una muestra de la colección activa. El frontend consume la API cuando está disponible
              y mantiene una selección visual local para el prototipo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
