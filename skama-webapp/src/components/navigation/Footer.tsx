import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

const shopLinks = [
  { label: 'Collections', path: ROUTES.catalog },
  { label: 'Favorites', path: ROUTES.wishlist },
  { label: 'Order', path: ROUTES.checkout },
];

const accountLinks = [
  { label: 'Sign in', path: ROUTES.login },
  { label: 'Create account', path: ROUTES.register },
  { label: 'My profile', path: ROUTES.profile },
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
            Costa Rican jewelry inspired by emeralds, flora, and native fauna.
            Elegant pieces for a private and memorable shopping experience.
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

        <nav className="sk-footer__group" aria-label="Account">
          <h2>Account</h2>
          {accountLinks.map((link) => (
            <RouterLink key={link.path} to={link.path}>
              {link.label}
            </RouterLink>
          ))}
        </nav>

        <div className="sk-footer__newsletter">
          <h2>Contacto</h2>
          <p>Jaco, Santa Teresa, Tamarindo, Multiplaza Escazu, Oxigeno, and City Mall.</p>
          <div className="sk-payment-methods" aria-label="Payment methods">
            <span>SINPE</span>
            <span>Transferencia</span>
            <span>Tarjeta</span>
          </div>
        </div>

        <div className="sk-footer__bottom">
          <span>© {new Date().getFullYear()} SKAMA Jewelry.</span>
          <span>Web experience for catalog, cart, and WhatsApp orders.</span>
        </div>
      </div>
    </footer>
  );
}
