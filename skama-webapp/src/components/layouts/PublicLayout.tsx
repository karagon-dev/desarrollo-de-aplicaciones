import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { BackButton } from '../navigation/BackButton';
import { ROUTES } from '../../routes/routePaths';

export interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const isAuthScreen = location.pathname === ROUTES.login || location.pathname === ROUTES.register;
  const isCollectionsScreen =
    location.pathname === ROUTES.catalog || location.pathname === ROUTES.legacyCatalog;
  const showBackButton = !isAuthScreen && !isCollectionsScreen && location.pathname !== ROUTES.home;

  return (
    <div className={`sk-app-shell${isAuthScreen ? ' sk-app-shell--auth-main' : ''}`}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      {!isAuthScreen && <Navbar />}
      <main id="main-content" tabIndex={-1}>
        {showBackButton && <BackButton />}
        {children}
      </main>
      {!isAuthScreen && <Footer />}
    </div>
  );
}
