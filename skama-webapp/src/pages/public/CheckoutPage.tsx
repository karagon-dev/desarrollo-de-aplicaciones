import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth, useCart } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import { orderService } from '../../services';
import {
  backendCartToCheckoutItems,
  clearLocalCart,
  formatPrice,
  getApiErrorMessage,
  getLocalCartTotals,
  localCartToCheckoutItems,
  LOCAL_CART_UPDATED_EVENT,
  readLocalCart,
} from '../../utils';

const whatsappPhone = '50672054536';

const paymentOptions = [
  { value: 'SINPE_MOVIL', label: 'SINPE Movil', helper: 'National mobile payment.' },
  { value: 'TRANSFERENCIA', label: 'Bank transfer', helper: 'Bank deposit.' },
  { value: 'TARJETA', label: 'Card', helper: 'Card payment.' },
];

const deliveryOptions = ['Scheduled pickup', 'Shipping', 'Coordinated delivery'];

interface ICheckoutFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryType: string;
  address: string;
  paymentMethod: string;
  isGift: boolean;
  giftMessage: string;
}

const initialForm: ICheckoutFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  deliveryType: '',
  address: '',
  paymentMethod: '',
  isGift: false,
  giftMessage: '',
};

export function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const { cart, refreshCart } = useCart();
  const [localItems, setLocalItems] = useState(() => readLocalCart());
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState(
    'Please complete all delivery details and select a payment method.',
  );

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

  const hasBackendCart = Boolean(isAuthenticated && cart?.items.length);
  const checkoutItems = hasBackendCart
    ? backendCartToCheckoutItems(cart)
    : localCartToCheckoutItems(localItems);
  const totals = hasBackendCart
    ? {
        itemCount: cart!.items.reduce((total, item) => total + item.quantity, 0),
        subtotal: cart!.total,
        total: cart!.total,
      }
    : getLocalCartTotals(localItems);

  const isFormValid = Boolean(
    form.firstName.trim() &&
      form.lastName.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.deliveryType &&
      form.address.trim() &&
      form.paymentMethod &&
      checkoutItems.length > 0,
  );

  const whatsappMessage = useMemo(() => {
    const productLines = checkoutItems
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} (${formatPrice(item.subtotal)})`,
      )
      .join('\n');

    return [
      'Hello SKAMA Jewelry, I want to coordinate this order:',
      '',
      'Products:',
      productLines || '- No selected products',
      '',
      `Total: ${formatPrice(totals.total)}`,
      '',
      'Delivery details:',
      `Name: ${form.firstName} ${form.lastName}`.trim(),
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Delivery type: ${form.deliveryType || 'Pending'}`,
      `Address: ${form.address || 'Pending'}`,
      `Payment method: ${
        paymentOptions.find((option) => option.value === form.paymentMethod)?.label || 'Pending'
      }`,
      form.isGift ? `Gift: Yes${form.giftMessage ? ` - ${form.giftMessage}` : ''}` : 'Gift: No',
    ].join('\n');
  }, [checkoutItems, form, totals.total]);

  function updateField<K extends keyof ICheckoutFormState>(key: K, value: ICheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setValidation('Please complete all required details before finishing.');
      toast.error('Required order details are missing.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasBackendCart && cart) {
        await orderService.createFromCart(cart.id, {
          paymentMethod: form.paymentMethod,
          shippingAddress: `${form.deliveryType}: ${form.address}`,
        });
        await refreshCart();
      } else {
        clearLocalCart();
        setLocalItems([]);
      }

      setValidation('Order validated. WhatsApp will open with the formatted message.');
      window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
      toast.success('Order ready to send by WhatsApp.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not complete the order.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">WhatsApp order</p>
          <h1>There are no selected products.</h1>
          <p>Add pieces from collections to generate the order message.</p>
          <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
            View collections
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <header className="sk-page-header sk-container">
        <p className="sk-kicker">Sales and orders</p>
        <h1>WhatsApp order</h1>
        <p className="sk-lede">
          Complete the delivery details to generate the order message and open WhatsApp.
        </p>
      </header>

      <section className="sk-checkout-shell">
        <form className="sk-checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="sk-checkout-panel" aria-labelledby="delivery-title">
            <p className="sk-kicker">Delivery details</p>
            <h2 id="delivery-title">Customer information</h2>
            <div className="sk-form-grid">
              <label className="sk-field" htmlFor="checkout-first-name">
                <span className="sk-field__label">First name</span>
                <input
                  className="sk-input"
                  id="checkout-first-name"
                  type="text"
                  value={form.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  required
                />
              </label>
              <label className="sk-field" htmlFor="checkout-last-name">
                <span className="sk-field__label">Last name</span>
                <input
                  className="sk-input"
                  id="checkout-last-name"
                  type="text"
                  value={form.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  required
                />
              </label>
              <label className="sk-field" htmlFor="checkout-phone">
                <span className="sk-field__label">Phone</span>
                <input
                  className="sk-input"
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                />
              </label>
              <label className="sk-field" htmlFor="checkout-email">
                <span className="sk-field__label">Email address</span>
                <input
                  className="sk-input"
                  id="checkout-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                />
              </label>
              <label className="sk-field" htmlFor="delivery-type">
                <span className="sk-field__label">Delivery type</span>
                <select
                  className="sk-input sk-select"
                  id="delivery-type"
                  value={form.deliveryType}
                  onChange={(event) => updateField('deliveryType', event.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {deliveryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sk-field span-2" htmlFor="checkout-address">
                <span className="sk-field__label">Address</span>
                <textarea
                  className="sk-input sk-input--textarea"
                  id="checkout-address"
                  rows={4}
                  value={form.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  required
                />
              </label>
            </div>
          </section>

          <section className="sk-checkout-panel" aria-labelledby="payment-title">
            <p className="sk-kicker">Payment method</p>
            <h2 id="payment-title">Required selection</h2>
            <fieldset className="sk-radio-grid">
              <legend>Payment method</legend>
              {paymentOptions.map((option) => (
                <label className="sk-option" key={option.value}>
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={form.paymentMethod === option.value}
                    onChange={() => updateField('paymentMethod', option.value)}
                    required
                  />
                  <strong>{option.label}</strong>
                  <span>{option.helper}</span>
                </label>
              ))}
            </fieldset>
          </section>

          <section className="sk-checkout-panel" aria-labelledby="gift-title">
            <p className="sk-kicker">Gift</p>
            <h2 id="gift-title">Optional dedication</h2>
            <label className="sk-choice" htmlFor="is-gift">
              <input
                id="is-gift"
                type="checkbox"
                checked={form.isGift}
                onChange={(event) => updateField('isGift', event.target.checked)}
              />
              <span className="sk-choice__control" aria-hidden="true" />
              <span className="sk-choice__label">This is a gift</span>
            </label>
            <label className="sk-field" htmlFor="gift-message">
              <span className="sk-field__label">Dedication</span>
              <textarea
                className="sk-input sk-input--textarea"
                id="gift-message"
                rows={4}
                value={form.giftMessage}
                onChange={(event) => updateField('giftMessage', event.target.value)}
              />
            </label>
          </section>

          <button className="sk-button sk-button--primary sk-button--lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Finishing...' : 'Finish order'}
          </button>
        </form>

        <aside className="sk-checkout-sidebar" aria-label="Order summary and message">
          <section className="sk-checkout-panel">
            <p className="sk-kicker">Cart</p>
            <h2>Selected products</h2>
            <div className="sk-order-items">
              {checkoutItems.map((item) => (
                <article className="sk-order-item" key={item.id}>
                  <img
                    src={item.imageUrl || '/assets/images/hero/skama-hero-jewelry-detail.png'}
                    alt={item.imageAlt || item.name}
                    loading="lazy"
                  />
                  <div>
                    <p>{item.name}</p>
                    <span>Quantity {item.quantity}</span>
                  </div>
                  <strong className="sk-price">{formatPrice(item.subtotal)}</strong>
                </article>
              ))}
            </div>
            <div className="sk-total-line">
              <span className="sk-kicker">Total</span>
              <strong>{formatPrice(totals.total)}</strong>
            </div>
          </section>

          <section className="sk-checkout-panel">
            <p className="sk-kicker">WhatsApp</p>
            <h2>Order message</h2>
            <label className="sk-field" htmlFor="whatsapp-message">
              <span className="sk-field__label">Formatted message</span>
              <textarea
                className="sk-input sk-input--textarea"
                id="whatsapp-message"
                rows={12}
                value={whatsappMessage}
                readOnly
              />
            </label>
            <p className="sk-validation" data-state={isFormValid ? 'valid' : 'invalid'} aria-live="polite">
              {isFormValid ? 'Order ready to send by WhatsApp.' : validation}
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
