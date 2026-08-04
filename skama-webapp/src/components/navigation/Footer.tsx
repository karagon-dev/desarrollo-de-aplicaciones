import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

const shopLinks = [
  { label: 'Colecciones', path: ROUTES.catalog },
  { label: 'Favoritos', path: ROUTES.wishlist },
  { label: 'Orden', path: ROUTES.checkout },
];

const accountLinks = [
  { label: 'Iniciar sesión', path: ROUTES.login },
  { label: 'Crear cuenta', path: ROUTES.register },
  { label: 'Mi perfil', path: ROUTES.profile },
];

export function Footer() {
  return (
    <footer className="sk-footer">
      <div className="sk-footer__inner">
        <div className="sk-footer__brand">
          <RouterLink className="sk-navbar__logo" to={ROUTES.home}>
            SKAMA
          </RouterLink>
          <p>
            Joyería costarricense inspirada en esmeraldas, flora y fauna nativa.
            Piezas elegantes para una experiencia de compra privada y memorable.
          </p>
          <div className="sk-social-links" aria-label="Redes sociales">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
              TikTok
            </a>
          </div>
        </div>

        <nav className="sk-footer__group" aria-label="Compra">
          <h2>Compra</h2>
          {shopLinks.map((link) => (
            <RouterLink key={link.path} to={link.path}>
              {link.label}
            </RouterLink>
          ))}
        </nav>

        <nav className="sk-footer__group" aria-label="Cuenta">
          <h2>Cuenta</h2>
          {accountLinks.map((link) => (
            <RouterLink key={link.path} to={link.path}>
              {link.label}
            </RouterLink>
          ))}
        </nav>

        <div className="sk-footer__newsletter">
          <h2>Contacto</h2>
          <p>Jacó, Santa Teresa, Tamarindo, Multiplaza Escazú, Oxígeno y City Mall.</p>
          <div className="sk-payment-methods" aria-label="Métodos de pago">
            <span>SINPE</span>
            <span>Transferencia</span>
            <span>Tarjeta</span>
          </div>
        </div>

        <div className="sk-footer__bottom">
          <span>© {new Date().getFullYear()} SKAMA Jewelry.</span>
          <span>Experiencia web para catálogo, carrito y órdenes por WhatsApp.</span>
        </div>
      </div>
    </footer>
  );
}
