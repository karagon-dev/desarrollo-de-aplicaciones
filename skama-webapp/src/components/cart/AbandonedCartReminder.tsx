import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { useCart } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import {
  getLocalCartTotals,
  LOCAL_CART_UPDATED_EVENT,
  readLocalCart,
} from '../../utils';

const reminderDelayMs = 20_000;
const reminderTitle = '\u00a1Tienes productos en tu carrito \u{1F6CD}\uFE0F!';
const reminderQuestion = '\u00bfQuieres finalizar tu compra?';

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

function isSuppressedRoute(pathname: string) {
  const isAdminRoute =
    pathname === ROUTES.admin.root || pathname.startsWith(`${ROUTES.admin.root}/`);
  const isAuthRoute = pathname === ROUTES.login || pathname === ROUTES.register;

  return isAdminRoute || isAuthRoute || pathname === ROUTES.checkout;
}

export function AbandonedCartReminder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const localCartCount = useLocalCartCount();
  const [isVisible, setIsVisible] = useState(false);

  const cartCount = itemCount || localCartCount;
  const canRemind = cartCount > 0 && !isSuppressedRoute(location.pathname);

  useEffect(() => {
    if (!canRemind) {
      setIsVisible(false);
      return;
    }

    if (isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsVisible(true);
    }, reminderDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [canRemind, isVisible]);

  function continueShopping() {
    setIsVisible(false);
  }

  function goToCheckout() {
    setIsVisible(false);
    navigate(ROUTES.checkout);
  }

  if (!canRemind || !isVisible) {
    return null;
  }

  return (
    <aside className="sk-abandoned-cart-reminder" aria-label="Recordatorio de carrito" aria-live="polite">
      <div className="sk-abandoned-cart-reminder__icon" aria-hidden="true">
        <ShoppingBagOutlinedIcon fontSize="small" />
      </div>
      <div className="sk-abandoned-cart-reminder__content">
        <h2>{reminderTitle}</h2>
        <p>{reminderQuestion}</p>
        <div className="sk-abandoned-cart-reminder__actions">
          <button
            className="sk-abandoned-cart-reminder__button sk-abandoned-cart-reminder__button--secondary"
            type="button"
            onClick={continueShopping}
          >
            Continuar comprando
          </button>
          <button
            className="sk-abandoned-cart-reminder__button sk-abandoned-cart-reminder__button--primary"
            type="button"
            onClick={goToCheckout}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </aside>
  );
}
