import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { SkamaProductCard } from '../../components/skama/SkamaProductCard';
import {
  limitedProducts,
  mapApiProductToSkamaProduct,
  skamaSegments,
} from '../../data/skamaCatalog';
import { useProductMainImages, useProducts } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

const values = [
  {
    icon: 'M',
    title: 'Mision',
    text: 'Crear joyas exclusivas que celebren la elegancia, la identidad costarricense y la belleza natural de las esmeraldas.',
  },
  {
    icon: 'V',
    title: 'Vision',
    text: 'Consolidar nuestra firma como una casa de joyeria reconocida por su lujo sereno y sus colecciones atemporales.',
  },
  {
    icon: 'S',
    title: 'Valores',
    text: 'Autenticidad, excelencia artesanal, calidad premium, confianza y una experiencia de compra sofisticada.',
  },
  {
    icon: 'U',
    title: 'Ubicaciones',
    text: 'Multiplaza Escazu, Oxigeno, City Mall, Jaco, Santa Teresa y Playa Tamarindo.',
  },
];

export function HomePage() {
  const { products } = useProducts({ includeInactive: false });
  const imageMap = useProductMainImages(products.slice(0, 4).map((product) => product.id));

  const featuredProducts = useMemo(() => {
    if (products.length > 0) {
      return products
        .slice(0, 4)
        .map((product, index) => mapApiProductToSkamaProduct(product, imageMap[product.id], index));
    }

    return [limitedProducts[1], ...skamaSegments[0].products.slice(0, 3)];
  }, [imageMap, products]);

  return (
    <div className="sk-page">
      <section className="sk-hero-home" aria-labelledby="home-hero-title">
        <div className="sk-hero-home__inner">
          <div className="sk-hero-home__copy">
            <p className="sk-kicker">Desde Costa Rica para el mundo</p>
            <h1 id="home-hero-title">Descubre el lujo de las esmeraldas.</h1>
            <p className="sk-lede">
              Inspiradas en la riqueza natural del pais, nuestras colecciones combinan diseno
              contemporaneo, materiales de alta calidad y esmeraldas cuidadosamente seleccionadas.
            </p>
            <div className="sk-actions" aria-label="Acciones principales">
              <RouterLink className="sk-button sk-button--primary sk-button--lg" to={ROUTES.catalog}>
                Explorar colecciones
              </RouterLink>
              <a className="sk-button sk-button--secondary sk-button--lg" href="#brand-story">
                Conocer la historia
              </a>
            </div>
            <div className="sk-stat-grid" aria-label="Indicadores de marca">
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

          <div className="sk-hero-showcase" aria-label="Composicion editorial de nuestra joyeria">
            <span className="sk-hero-showcase__halo" aria-hidden="true" />
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--portrait">
              <img
                src="/assets/images/hero/skama-hero-exterior.png"
                alt="Exterior moderno de la joyeria SKAMA en Jaco"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--landscape">
              <img
                src="/assets/images/hero/skama-hero-jewelry-detail.png"
                alt="Joyas con collares, anillos, aretes y esmeraldas en vitrina"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--detail">
              <img
                src="/assets/images/hero/skama-hero-interior.png"
                alt="Interior de joyeria con vitrinas, marmol negro y detalles dorados"
              />
            </picture>
            <div className="sk-hero-showcase__caption" aria-hidden="true">
              <span>Editorial</span>
              <strong>Emerald Focus</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="sk-section" id="brand-story" aria-labelledby="brand-story-title">
        <div className="sk-split">
          <figure className="sk-split-media">
            <img
              src="/assets/images/hero/skama-about-exterior-complete.png"
              alt="Exterior completo de la joyeria SKAMA"
              loading="lazy"
            />
          </figure>
          <div className="sk-split-copy">
            <p className="sk-kicker">Nuestra historia</p>
            <h2 id="brand-story-title">Una joyeria nacida para plasmar la naturaleza costarricense.</h2>
            <p>
              Nuestros inicios se plasmaron en Jaco durante el 2025 con la vision de transformar
              la riqueza natural del pais en piezas de alta joyeria inspiradas en su flora y fauna.
            </p>
            <p>
              Cada coleccion representa elegancia, sofisticacion y el orgullo de reflejar una nacion
              reconocida por su biodiversidad y su calidez.
            </p>
          </div>
        </div>
      </section>

      <section className="sk-section sk-section--muted" aria-labelledby="craft-title">
        <div className="sk-split sk-split--reverse">
          <div className="sk-split-copy">
            <p className="sk-kicker">Nuestro proceso</p>
            <h2 id="craft-title">Cada detalle refleja la dedicacion de nuestros artesanos.</h2>
            <p>
              Cada pieza es elaborada por profesionales especializados en alta joyeria que combinan
              herramientas de precision, materiales nobles y tecnicas artesanales.
            </p>
            <div className="sk-stat-grid" aria-label="Indicadores de proceso artesanal">
              <div className="sk-stat">
                <strong>01</strong>
                <span>Diseno exclusivo</span>
              </div>
              <div className="sk-stat">
                <strong>02</strong>
                <span>Materiales premium</span>
              </div>
              <div className="sk-stat">
                <strong>03</strong>
                <span>Elaboracion artesanal</span>
              </div>
              <div className="sk-stat">
                <strong>04</strong>
                <span>Entrega cuidada</span>
              </div>
            </div>
          </div>
          <figure className="sk-split-media">
            <img
              src="/assets/images/hero/skama-about-artisan.png"
              alt="Artesana elaborando una joya con herramientas de precision"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="values-title">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Identidad SKAMA</p>
            <h2 id="values-title">Lujo sereno, raiz local y atencion personalizada.</h2>
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

      <section className="sk-section sk-section--muted" aria-labelledby="featured-title">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">Seleccion destacada</p>
            <h2 id="featured-title">Piezas listas para momentos memorables.</h2>
            <p className="sk-lede">
              Una muestra de la coleccion activa. El frontend consume el API cuando esta disponible
              y mantiene una seleccion visual local para prototipo.
            </p>
          </div>
        </div>
        <div className="sk-product-grid">
          {featuredProducts.map((product) => (
            <SkamaProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
