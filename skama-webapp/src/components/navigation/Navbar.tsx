import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { useAuth, useCart, useThemeMode, useWishlist } from '../../hooks';
import { getLocalCartTotals, LOCAL_CART_UPDATED_EVENT, readLocalCart } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

const navLinks = [
  { label: 'Home', path: ROUTES.home, match: ['/'] },
  { label: 'Collections', path: ROUTES.catalog, match: [ROUTES.catalog, ROUTES.legacyCatalog] },
  { label: 'Favorites', path: ROUTES.wishlist, match: [ROUTES.wishlist] },
  { label: 'Order', path: ROUTES.checkout, match: [ROUTES.checkout, ROUTES.cart] },
];

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
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const localCartCount = useLocalCartCount();
  const [mobileOpen, setMobileOpen] = useState(false);
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
  const accountLabel = useMemo(() => user?.email.split('@')[0] ?? 'Account', [user?.email]);

  function isActive(match: string[]) {
    if (match.includes('/')) {
      return location.pathname === '/';
    }

    return match.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  }

  const mobileNav = (
    <div className={`sk-drawer${mobileOpen ? ' is-open' : ''}`} aria-hidden={!mobileOpen}>
      <div className="sk-drawer__panel">
        <div className="sk-drawer__header">
          <span className="sk-navbar__logo">SKAMA</span>
          <button
            className="sk-icon-button"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        <nav className="sk-drawer-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <RouterLink
              key={link.path}
              to={link.path}
              aria-current={isActive(link.match) ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </RouterLink>
          ))}
          {isAdmin && (
            <RouterLink to={ROUTES.admin.dashboard} onClick={() => setMobileOpen(false)}>
              Admin
            </RouterLink>
          )}
          {isAuthenticated ? (
            <button
              className="sk-drawer-nav__button"
              type="button"
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
            >
              Sign out
            </button>
          ) : (
            <RouterLink to={ROUTES.login} onClick={() => setMobileOpen(false)}>
              Sign in
            </RouterLink>
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <>
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

        <nav className="sk-navbar__links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <RouterLink
              key={link.path}
              to={link.path}
              aria-current={isActive(link.match) ? 'page' : undefined}
            >
              {link.label}
            </RouterLink>
          ))}
          {isAdmin && (
            <RouterLink
              to={ROUTES.admin.dashboard}
              aria-current={location.pathname.startsWith('/admin') ? 'page' : undefined}
            >
              Admin
            </RouterLink>
          )}
        </nav>

        <div className="sk-navbar__actions">
          <button
            className="ui-switch sk-theme-switch"
            type="button"
            aria-label={mode === 'light' ? 'Enable dark mode' : 'Enable light mode'}
            aria-pressed={mode === 'dark'}
            onClick={toggleMode}
          >
            <span className="slider" aria-hidden="true">
              <span className="circle" />
            </span>
          </button>

          <RouterLink className="sk-icon-button" to={ROUTES.wishlist} aria-label="Favorites">
            <FavoriteBorderIcon fontSize="small" />
            {wishlistItems.length > 0 && <span className="sk-counter-badge">{wishlistItems.length}</span>}
          </RouterLink>

          <RouterLink className="sk-icon-button" to={ROUTES.cart} aria-label="Cart">
            <ShoppingBagOutlinedIcon fontSize="small" />
            {cartCount > 0 && <span className="sk-counter-badge">{cartCount}</span>}
          </RouterLink>

          {isAuthenticated ? (
            <>
              <RouterLink className="sk-auth-button" to={ROUTES.profile}>
                <LoginOutlinedIcon fontSize="small" />
                <span>{accountLabel}</span>
              </RouterLink>
              <button className="sk-icon-button" type="button" aria-label="Sign out" onClick={logout}>
                <LogoutOutlinedIcon fontSize="small" />
              </button>
            </>
          ) : (
            <RouterLink className="sk-auth-button" to={ROUTES.login}>
              <LoginOutlinedIcon fontSize="small" />
              <span>Sign in</span>
            </RouterLink>
          )}

          <button
            className="sk-icon-button sk-navbar__menu"
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon fontSize="small" />
          </button>
        </div>
      </header>
      {mobileNav}
    </>
  );
}
