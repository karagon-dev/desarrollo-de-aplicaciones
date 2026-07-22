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
    title: 'Mission',
    text: 'Create exclusive jewelry that celebrates elegance, Costa Rican identity, and the natural beauty of emeralds.',
  },
  {
    icon: 'V',
    title: 'Vision',
    text: 'Establish our brand as a jewelry house recognized for quiet luxury and timeless collections.',
  },
  {
    icon: 'S',
    title: 'Values',
    text: 'Authenticity, artisanal excellence, premium quality, trust, and a sophisticated shopping experience.',
  },
  {
    icon: 'U',
    title: 'Locations',
    text: 'Multiplaza Escazu, Oxigeno, City Mall, Jaco, Santa Teresa, and Playa Tamarindo.',
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
            <p className="sk-kicker">From Costa Rica to the world</p>
            <h1 id="home-hero-title">Discover the luxury of emeralds.</h1>
            <p className="sk-lede">
              Inspired by the natural richness of Costa Rica, our collections combine
              contemporary design, premium materials, and carefully selected emeralds.
            </p>
            <div className="sk-actions" aria-label="Primary actions">
              <RouterLink className="sk-button sk-button--primary sk-button--lg" to={ROUTES.catalog}>
                Explore collections
              </RouterLink>
              <a className="sk-button sk-button--secondary sk-button--lg" href="#brand-story">
                Discover the story
              </a>
            </div>
            <div className="sk-stat-grid" aria-label="Brand indicators">
              <div className="sk-stat">
                <strong>16</strong>
                <span>Collections</span>
              </div>
              <div className="sk-stat">
                <strong>100%</strong>
                <span>Natural emeralds</span>
              </div>
              <div className="sk-stat">
                <strong>500+</strong>
                <span>Satisfied customers</span>
              </div>
              <div className="sk-stat">
                <strong>Editions</strong>
                <span>Limited</span>
              </div>
            </div>
          </div>

          <div className="sk-hero-showcase" aria-label="Editorial composition of our jewelry">
            <span className="sk-hero-showcase__halo" aria-hidden="true" />
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--portrait">
              <img
                src="/assets/images/hero/skama-hero-exterior.png"
                alt="Modern exterior of SKAMA jewelry in Jaco"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--landscape">
              <img
                src="/assets/images/hero/skama-hero-jewelry-detail.png"
                alt="Jewelry with necklaces, rings, earrings, and emeralds in a display case"
              />
            </picture>
            <picture className="sk-hero-showcase__image sk-hero-showcase__image--detail">
              <img
                src="/assets/images/hero/skama-hero-interior.png"
                alt="Jewelry store interior with display cases, black marble, and gold details"
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
              alt="Full exterior of SKAMA Jewelry"
              loading="lazy"
            />
          </figure>
          <div className="sk-split-copy">
            <p className="sk-kicker">Our story</p>
            <h2 id="brand-story-title">A jewelry house created to express Costa Rican nature.</h2>
            <p>
              Our beginnings took shape in Jaco in 2025 with the vision of transforming
              the country natural richness into fine jewelry inspired by its flora and fauna.
            </p>
            <p>
              Each collection represents elegance, sophistication, and the pride of reflecting a nation
              recognized for its biodiversity and warmth.
            </p>
          </div>
        </div>
      </section>

      <section className="sk-section sk-section--muted" aria-labelledby="craft-title">
        <div className="sk-split sk-split--reverse">
          <div className="sk-split-copy">
            <p className="sk-kicker">Our process</p>
            <h2 id="craft-title">Every detail reflects the dedication of our artisans.</h2>
            <p>
              Each piece is crafted by fine jewelry specialists who combine
              precision tools, noble materials, and artisanal techniques.
            </p>
            <div className="sk-stat-grid" aria-label="Artisanal process indicators">
              <div className="sk-stat">
                <strong>01</strong>
                <span>Exclusive design</span>
              </div>
              <div className="sk-stat">
                <strong>02</strong>
                <span>Premium materials</span>
              </div>
              <div className="sk-stat">
                <strong>03</strong>
                <span>Artisanal crafting</span>
              </div>
              <div className="sk-stat">
                <strong>04</strong>
                <span>Careful delivery</span>
              </div>
            </div>
          </div>
          <figure className="sk-split-media">
            <img
              src="/assets/images/hero/skama-about-artisan.png"
              alt="Artisan crafting a jewel with precision tools"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="values-title">
        <div className="sk-container">
          <div className="sk-section-heading">
            <p className="sk-kicker">SKAMA identity</p>
            <h2 id="values-title">Quiet luxury, local roots, and personalized attention.</h2>
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
            <p className="sk-kicker">Featured selection</p>
            <h2 id="featured-title">Pieces ready for memorable moments.</h2>
            <p className="sk-lede">
              A sample of the active collection. The frontend consumes the API when it is available
              and keeps a local visual selection for the prototype.
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
