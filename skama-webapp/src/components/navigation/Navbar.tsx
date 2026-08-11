import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { useAuth, useCart, useThemeMode, useWishlist } from '../../hooks';
import { getLocalCartTotals, LOCAL_CART_UPDATED_EVENT, readLocalCart } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

function useLocalCartCount() {
  const [count, setCount] = useState(() => getLocalCartTotals(readLocalCart()).itemCount);

  useEffect(() => {
    function syncCount() {
      setCount(getLocalCartTotals(readLocalCart()).itemCount);
    }

    window.addEventListener(LOCAL_CART_UPDATED_EVENT, syncCount);
    window.addEventListener('storage', syncCount);
    return () => {
      window.removeEventListener(LOCAL_CART_UPDATED_EVENT, syncCount);
      window.removeEventListener('storage', syncCount);
    };
  }, []);

  return count;
}

export function Navbar() {
  const location = useLocation();
  const { mode, toggleMode } = useThemeMode();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const localCartCount = useLocalCartCount();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = itemCount || localCartCount;
  const accountLabel = useMemo(() => user?.email.split('@')[0] ?? 'Cuenta', [user?.email]);

  function isActive(match: string[]) {
    if (match.includes('/')) {
      return location.pathname === '/';
    }

    return match.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  }

  return (
    <header className={`sk-navbar${isScrolled ? ' is-scrolled' : ''}`} data-navbar>
      <RouterLink className="sk-navbar__brand" to={ROUTES.home} aria-label="SKAMA Jewelry">
        <img
          className="sk-navbar__brand-logo sk-navbar__brand-logo--on-dark"
          src="/assets/images/brand/skama-logo-on-dark.png"
          alt=""
        />
        <img
          className="sk-navbar__brand-logo sk-navbar__brand-logo--on-light"
          src="/assets/images/brand/skama-logo-on-light.png"
          alt=""
        />
      </RouterLink>

      <div className="sk-navbar__actions">
        <RouterLink
          className="sk-icon-button"
          to={ROUTES.home}
          aria-label="Ir al inicio"
          aria-current={isActive([ROUTES.home]) ? 'page' : undefined}
        >
          <HomeOutlinedIcon fontSize="small" />
        </RouterLink>

        <RouterLink
          className="sk-icon-button"
          to={ROUTES.wishlist}
          aria-label="Favoritos"
          aria-current={isActive([ROUTES.wishlist]) ? 'page' : undefined}
        >
          <FavoriteBorderIcon fontSize="small" />
          {wishlistItems.length > 0 && <span className="sk-counter-badge">{wishlistItems.length}</span>}
        </RouterLink>

        <RouterLink
          className="sk-icon-button"
          to={ROUTES.cart}
          aria-label="Carrito"
          aria-current={isActive([ROUTES.cart, ROUTES.checkout]) ? 'page' : undefined}
        >
          <ShoppingBagOutlinedIcon fontSize="small" />
          {cartCount > 0 && <span className="sk-counter-badge">{cartCount}</span>}
        </RouterLink>

        <button
          className="ui-switch sk-theme-switch"
          type="button"
          aria-label={mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
          aria-pressed={mode === 'dark'}
          onClick={toggleMode}
        >
          <span className="slider" aria-hidden="true">
            <span className="circle" />
          </span>
        </button>

        {isAuthenticated ? (
          <>
            <RouterLink className="sk-auth-button" to={ROUTES.profile}>
              <LoginOutlinedIcon fontSize="small" />
              <span>{accountLabel}</span>
            </RouterLink>
            <button className="sk-icon-button" type="button" aria-label="Cerrar sesión" onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </button>
          </>
        ) : (
          <RouterLink className="sk-auth-button" to={ROUTES.login}>
            <LoginOutlinedIcon fontSize="small" />
            <span>Iniciar sesión</span>
          </RouterLink>
        )}
      </div>
    </header>
  );
}
