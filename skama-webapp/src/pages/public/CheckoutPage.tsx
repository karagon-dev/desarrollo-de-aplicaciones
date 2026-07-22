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
  { value: 'SINPE_MOVIL', label: 'SINPE Movil', helper: 'Pago movil nacional.' },
  { value: 'TRANSFERENCIA', label: 'Transferencia', helper: 'Deposito bancario.' },
  { value: 'TARJETA', label: 'Tarjeta', helper: 'Pago con tarjeta.' },
];

const deliveryOptions = ['Retiro acordado', 'Envio', 'Entrega coordinada'];

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
    'Por favor, completa todos los datos de entrega y selecciona un metodo de pago.',
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
      'Hola SKAMA Jewelry, quiero coordinar este pedido:',
      '',
      'Productos:',
      productLines || '- Sin productos seleccionados',
      '',
      `Total: ${formatPrice(totals.total)}`,
      '',
      'Datos de entrega:',
      `Nombre: ${form.firstName} ${form.lastName}`.trim(),
      `Telefono: ${form.phone}`,
      `Correo: ${form.email}`,
      `Tipo de entrega: ${form.deliveryType || 'Pendiente'}`,
      `Direccion: ${form.address || 'Pendiente'}`,
      `Metodo de pago: ${
        paymentOptions.find((option) => option.value === form.paymentMethod)?.label || 'Pendiente'
      }`,
      form.isGift ? `Regalo: Si${form.giftMessage ? ` - ${form.giftMessage}` : ''}` : 'Regalo: No',
    ].join('\n');
  }, [checkoutItems, form, totals.total]);

  function updateField<K extends keyof ICheckoutFormState>(key: K, value: ICheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setValidation('Por favor, completa todos los datos obligatorios antes de finalizar.');
      toast.error('Faltan datos obligatorios del pedido.');
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

      setValidation('Pedido validado. Se abrira WhatsApp con el mensaje formateado.');
      window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
      toast.success('Pedido listo para enviar por WhatsApp.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo finalizar el pedido.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">Pedido por WhatsApp</p>
          <h1>No hay productos seleccionados.</h1>
          <p>Agrega piezas desde colecciones para generar el mensaje de pedido.</p>
          <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
            Ver colecciones
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <header className="sk-page-header sk-container">
        <p className="sk-kicker">Ventas y pedidos</p>
        <h1>Pedido por WhatsApp</h1>
        <p className="sk-lede">
          Completa los datos de entrega para generar el mensaje del pedido y abrir WhatsApp.
        </p>
      </header>

      <section className="sk-checkout-shell">
        <form className="sk-checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="sk-checkout-panel" aria-labelledby="delivery-title">
            <p className="sk-kicker">Datos de entrega</p>
            <h2 id="delivery-title">Informacion del cliente</h2>
            <div className="sk-form-grid">
              <label className="sk-field" htmlFor="checkout-first-name">
                <span className="sk-field__label">Nombre</span>
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
                <span className="sk-field__label">Apellidos</span>
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
                <span className="sk-field__label">Telefono</span>
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
                <span className="sk-field__label">Correo electronico</span>
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
                <span className="sk-field__label">Tipo de entrega</span>
                <select
                  className="sk-input sk-select"
                  id="delivery-type"
                  value={form.deliveryType}
                  onChange={(event) => updateField('deliveryType', event.target.value)}
                  required
                >
                  <option value="">Seleccione una opcion</option>
                  {deliveryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sk-field span-2" htmlFor="checkout-address">
                <span className="sk-field__label">Direccion</span>
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
            <p className="sk-kicker">Metodo de pago</p>
            <h2 id="payment-title">Seleccion obligatoria</h2>
            <fieldset className="sk-radio-grid">
              <legend>Metodo de pago</legend>
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
            <p className="sk-kicker">Regalo</p>
            <h2 id="gift-title">Dedicatoria opcional</h2>
            <label className="sk-choice" htmlFor="is-gift">
              <input
                id="is-gift"
                type="checkbox"
                checked={form.isGift}
                onChange={(event) => updateField('isGift', event.target.checked)}
              />
              <span className="sk-choice__control" aria-hidden="true" />
              <span className="sk-choice__label">Es un regalo</span>
            </label>
            <label className="sk-field" htmlFor="gift-message">
              <span className="sk-field__label">Dedicatoria</span>
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
            {isSubmitting ? 'Finalizando...' : 'Finalizar pedido'}
          </button>
        </form>

        <aside className="sk-checkout-sidebar" aria-label="Resumen y mensaje de pedido">
          <section className="sk-checkout-panel">
            <p className="sk-kicker">Carrito</p>
            <h2>Productos seleccionados</h2>
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
                    <span>Cantidad {item.quantity}</span>
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
            <h2>Mensaje del pedido</h2>
            <label className="sk-field" htmlFor="whatsapp-message">
              <span className="sk-field__label">Mensaje formateado</span>
              <textarea
                className="sk-input sk-input--textarea"
                id="whatsapp-message"
                rows={12}
                value={whatsappMessage}
                readOnly
              />
            </label>
            <p className="sk-validation" data-state={isFormValid ? 'valid' : 'invalid'} aria-live="polite">
              {isFormValid ? 'Pedido listo para enviar por WhatsApp.' : validation}
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
