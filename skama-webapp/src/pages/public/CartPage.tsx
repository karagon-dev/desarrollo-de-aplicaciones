import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import { useCart } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import {
  backendCartToCheckoutItems,
  formatPrice,
  getApiErrorMessage,
  getLocalCartTotals,
  localCartToCheckoutItems,
  LOCAL_CART_UPDATED_EVENT,
  readLocalCart,
  removeLocalCartItem,
  updateLocalCartItemQuantity,
} from '../../utils';

export function CartPage() {
  const { cart, updateItemQuantity, removeItem } = useCart();
  const [localItems, setLocalItems] = useState(() => readLocalCart());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    function syncLocalItems() {
      setLocalItems(readLocalCart());
    }

    window.addEventListener(LOCAL_CART_UPDATED_EVENT, syncLocalItems);
    window.addEventListener('storage', syncLocalItems);
    return () => {
      window.removeEventListener(LOCAL_CART_UPDATED_EVENT, syncLocalItems);
      window.removeEventListener('storage', syncLocalItems);
    };
  }, []);

  const hasBackendCart = Boolean(cart?.items.length);
  const checkoutItems = hasBackendCart
    ? backendCartToCheckoutItems(cart)
    : localCartToCheckoutItems(localItems);
  const totals = useMemo(() => {
    if (hasBackendCart) {
      return {
        itemCount: cart!.items.reduce((total, item) => total + item.quantity, 0),
        subtotal: cart!.total,
        total: cart!.total,
      };
    }

    return getLocalCartTotals(localItems);
  }, [cart, hasBackendCart, localItems]);

  async function handleQuantityChange(id: string, productId: string, quantity: number) {
    setIsUpdating(true);
    try {
      if (hasBackendCart) {
        await updateItemQuantity(id, quantity);
      } else {
        setLocalItems(updateLocalCartItemQuantity(productId, quantity));
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update quantity.'));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove(id: string, productId: string) {
    setIsUpdating(true);
    try {
      if (hasBackendCart) {
        await removeItem(id);
      } else {
        setLocalItems(removeLocalCartItem(productId));
      }

      toast.success('Product removed from order.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete product.'));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="sk-page">
      <header className="sk-page-header sk-container">
        <p className="sk-kicker">Cart</p>
        <h1>Selected products</h1>
        <p className="sk-lede">
          Review quantities before generating the WhatsApp order message.
        </p>
      </header>

      <section className="sk-cart-shell" aria-label="Cart details">
        <div className="sk-cart-panel">
          {checkoutItems.length === 0 ? (
            <div className="sk-empty-state">
              <h2>Your cart is empty.</h2>
              <p>Explore collections and add the pieces you want to coordinate.</p>
              <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
                View collections
              </RouterLink>
            </div>
          ) : (
            <div className="sk-order-items">
              {checkoutItems.map((item) => (
                <article className="sk-cart-line" key={item.id}>
                  <img
                    src={item.imageUrl || '/assets/images/hero/skama-hero-jewelry-detail.png'}
                    alt={item.imageAlt || item.name}
                    loading="lazy"
                  />
                  <div className="sk-cart-line__content">
                    <h3>{item.name}</h3>
                    <span>{formatPrice(item.unitPrice)} per unit</span>
                    <div className="sk-cart-line__controls">
                      <label className="sk-field" htmlFor={`quantity-${item.id}`}>
                        <span className="sk-field__label">Quantity</span>
                        <input
                          className="sk-input"
                          id={`quantity-${item.id}`}
                          type="number"
                          min={1}
                          max={99}
                          value={item.quantity}
                          disabled={isUpdating}
                          onChange={(event) =>
                            void handleQuantityChange(item.id, item.productId, Number(event.target.value))
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <div className="sk-cart-line__actions">
                    <strong className="sk-price">{formatPrice(item.subtotal)}</strong>
                    <button
                      className="sk-icon-button"
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      disabled={isUpdating}
                      onClick={() => void handleRemove(item.id, item.productId)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="sk-cart-panel" aria-label="Cart summary">
          <p className="sk-kicker">Summary</p>
          <h2>Order total</h2>
          <div className="sk-total-line">
            <span>Products</span>
            <strong>{totals.itemCount}</strong>
          </div>
          <div className="sk-total-line">
            <span>Total</span>
            <strong className="sk-price">{formatPrice(totals.total)}</strong>
          </div>
          <div className="sk-actions">
            <RouterLink
              className="sk-button sk-button--primary sk-button--lg"
              to={checkoutItems.length > 0 ? ROUTES.checkout : ROUTES.catalog}
            >
              {checkoutItems.length > 0 ? 'Continue to order' : 'View collections'}
            </RouterLink>
          </div>
        </aside>
      </section>
    </div>
  );
}
