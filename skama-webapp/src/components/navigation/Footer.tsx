import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';

const navigationLinks = [
  { label: 'Inicio', path: ROUTES.home },
  { label: 'Colecciones', path: ROUTES.catalog },
  { label: 'Mis pedidos', path: ROUTES.orderHistory },
  { label: 'Nosotros', path: `${ROUTES.home}#brand-story` },
  { label: 'Contacto', path: ROUTES.contact },
  { label: 'Pol\u00edtica de Privacidad', path: ROUTES.privacyPolicy },
];

export function Footer() {
  const location = useLocation();

  return (
    <footer id="footer" className="sk-footer">
      <div className="sk-footer__inner">
        <div className="sk-footer__content">
          <section className="sk-footer__brand" aria-label="SKAMA">
            <RouterLink className="sk-footer__logo" to={ROUTES.home}>
              SKAMA
            </RouterLink>
            <p>{'Joyer\u00eda de lujo con una experiencia digital sobria, moderna y preparada para crecer.'}</p>
          </section>

          <nav className="sk-footer__nav" aria-label="Navegación">
            <h2>{'NAVEGACI\u00d3N'}</h2>
            <ul>
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <RouterLink to={link.path} aria-current={location.pathname === link.path ? 'page' : undefined}>
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sk-footer__bottom">
          <span>&copy; {new Date().getFullYear()} SKAMA Jewelry. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
