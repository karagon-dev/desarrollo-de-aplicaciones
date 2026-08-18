import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth, useCart } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';
import { Dialog } from '../../components/dialogs';
import { SkamaPrice } from '../../components/skama/SkamaPrice';
import {
  CheckoutRatingDialog,
  type CheckoutRatingValue,
} from '../../components/reviews/CheckoutRatingDialog';
import { cartService, orderService } from '../../services';
import type { ICreateOrderResponse, IOrderProductRatingRequest } from '../../types';
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
const cardPaymentMethod = 'TARJETA';
const scheduledPickupDeliveryType = 'Retiro programado';
const locationsPath = `${ROUTES.home}#ubicaciones`;

const paymentOptions = [
  { value: 'SINPE_MOVIL', label: 'SINPE Móvil', helper: 'Pago móvil nacional.' },
  { value: 'TRANSFERENCIA', label: 'Transferencia bancaria', helper: 'Depósito bancario.' },
  { value: cardPaymentMethod, label: 'Tarjeta', helper: 'Pago físico en sucursal.' },
];

const deliveryOptions = ['Retiro programado', 'Envío', 'Entrega coordinada'];

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

function isCheckoutRatingValue(rating?: number): rating is CheckoutRatingValue {
  return typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, refreshCart } = useCart();
  const [localItems, setLocalItems] = useState(() => readLocalCart());
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardPaymentDialogOpen, setCardPaymentDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingsByItemId, setRatingsByItemId] = useState<Partial<Record<string, CheckoutRatingValue>>>({});
  const [ratingValidation, setRatingValidation] = useState('');
  const [validation, setValidation] = useState(
    'Por favor, completa todos los datos de entrega y selecciona un método de pago.',
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
  const isCardPaymentSelected = form.paymentMethod === cardPaymentMethod;

  const isFormValid = Boolean(
    form.firstName.trim() &&
      form.lastName.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      isAuthenticated &&
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
      'Hola SKAMA Jewelry, quiero coordinar esta orden:',
      '',
      'Productos:',
      productLines || '- No hay productos seleccionados',
      '',
      `Total: ${formatPrice(totals.total)}`,
      '',
      'Datos de entrega:',
      `Nombre: ${form.firstName} ${form.lastName}`.trim(),
      `Teléfono: ${form.phone}`,
      `Correo: ${form.email}`,
      `Tipo de entrega: ${form.deliveryType || 'Pendiente'}`,
      `Dirección: ${form.address || 'Pendiente'}`,
      `Método de pago: ${
        paymentOptions.find((option) => option.value === form.paymentMethod)?.label || 'Pendiente'
      }`,
      form.isGift ? `Regalo: Sí${form.giftMessage ? ` - ${form.giftMessage}` : ''}` : 'Regalo: No',
    ].join('\n');
  }, [checkoutItems, form, totals.total]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      email: user?.email ?? '',
    }));
  }, [user?.email]);

  function updateField<K extends keyof ICheckoutFormState>(key: K, value: ICheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePaymentMethodChange(paymentMethod: string) {
    if (paymentMethod === cardPaymentMethod) {
      setCardPaymentDialogOpen(true);
      return;
    }

    updateField('paymentMethod', paymentMethod);
  }

  function acceptCardPaymentMethod() {
    setForm((current) => ({
      ...current,
      paymentMethod: cardPaymentMethod,
      deliveryType: scheduledPickupDeliveryType,
    }));
    setCardPaymentDialogOpen(false);
  }

  function chooseAnotherPaymentMethod() {
    setCardPaymentDialogOpen(false);
  }

  function buildShippingAddress(): string {
    return [
      `Cliente: ${form.firstName} ${form.lastName}`.trim(),
      `Correo: ${user?.email ?? form.email}`,
      `Telefono: ${form.phone}`,
      `Entrega: ${form.deliveryType}`,
      `Direccion: ${form.address}`,
      form.isGift ? `Regalo: Si${form.giftMessage ? ` - ${form.giftMessage}` : ''}` : 'Regalo: No',
    ].join(' | ');
  }

  function updateProductRating(itemId: string, rating: CheckoutRatingValue) {
    setRatingsByItemId((current) => ({ ...current, [itemId]: rating }));
    setRatingValidation('');
  }

  function buildProductRatings(): IOrderProductRatingRequest[] | null {
    const missingRatingItem = checkoutItems.find(
      (item) => !isCheckoutRatingValue(ratingsByItemId[item.id]),
    );

    if (missingRatingItem) {
      setRatingValidation(`Selecciona una calificación para ${missingRatingItem.name}.`);
      return null;
    }

    return checkoutItems.map((item) => ({
      productId: item.productId,
      rating: ratingsByItemId[item.id]!,
    }));
  }

  async function createOrderFromCheckoutCart(
    productRatings: IOrderProductRatingRequest[],
  ): Promise<ICreateOrderResponse> {
    if (!user) {
      throw new Error('Debes iniciar sesion para finalizar la compra.');
    }

    let cartId = cart?.id;

    if (!hasBackendCart && localItems.length > 0) {
      const { data: summary } = await cartService.getOrCreate(user.userId);
      cartId = summary.cartId;

      for (const item of localItems) {
        await cartService.addItem(cartId, {
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    if (!cartId) {
      throw new Error('No hay un carrito activo para crear la orden.');
    }

    const { data: order } = await orderService.createFromCart(cartId, {
      paymentMethod: form.paymentMethod,
      shippingAddress: buildShippingAddress(),
      productRatings,
    });

    clearLocalCart();
    setLocalItems([]);
    await refreshCart();

    return order;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.info('Inicia sesion para finalizar tu compra.');
      navigate(ROUTES.login, { state: { from: ROUTES.checkout } });
      return;
    }

    if (!isFormValid) {
      setValidation('Por favor, completa todos los datos requeridos antes de finalizar.');
      toast.error('Faltan datos requeridos de la orden.');
      return;
    }

    setRatingValidation('');
    setRatingDialogOpen(true);
  }

  async function submitRatedOrder() {
    const productRatings = buildProductRatings();

    if (!productRatings) {
      toast.error('Debes seleccionar una calificación para cada producto.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrderFromCheckoutCart(productRatings);

      setValidation('Pedido registrado. WhatsApp se abrirá con el mensaje formateado.');
      setRatingDialogOpen(false);
      window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
      toast.success(`Pedido ${order.orderNumber} registrado.`);
      navigate(ROUTES.orderDetail(order.orderId));
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo completar la orden.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">Orden por WhatsApp</p>
          <h1>No hay productos seleccionados.</h1>
          <p>Agrega piezas desde las colecciones para generar el mensaje de orden.</p>
          <RouterLink className="sk-button sk-button--primary" to={ROUTES.catalog}>
            Ver colecciones
          </RouterLink>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="sk-container sk-section">
        <div className="sk-empty-state">
          <p className="sk-kicker">Compra con cuenta</p>
          <h1>Inicia sesion para finalizar la compra.</h1>
          <p>Todas las compras requieren una cuenta SKAMA activa para registrar la venta y asociarla a tu correo.</p>
          <div className="sk-actions">
            <RouterLink className="sk-button sk-button--primary" to={ROUTES.login} state={{ from: ROUTES.checkout }}>
              Iniciar sesion
            </RouterLink>
            <RouterLink className="sk-button sk-button--secondary" to={ROUTES.catalog}>
              Ver colecciones
            </RouterLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <header className="sk-page-header sk-container">
        <p className="sk-kicker">Ventas y órdenes</p>
        <h1>Orden por WhatsApp</h1>
        <p className="sk-lede">
          Completa los datos de entrega para generar el mensaje de orden y abrir WhatsApp.
        </p>
      </header>

      <section className="sk-checkout-shell">
        <form className="sk-checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="sk-checkout-panel" aria-labelledby="delivery-title">
            <p className="sk-kicker">Datos de entrega</p>
            <h2 id="delivery-title">Información del cliente</h2>
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
                <span className="sk-field__label">Teléfono</span>
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
                <span className="sk-field__label">Correo electrónico</span>
                <input
                  className="sk-input"
                  id="checkout-email"
                  type="email"
                  value={form.email}
                  readOnly
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
                  disabled={isCardPaymentSelected}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {deliveryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {isCardPaymentSelected && (
                  <span className="sk-field__helper">
                    Retiro programado es requerido para pagos físicos con tarjeta.
                  </span>
                )}
              </label>
              <label className="sk-field span-2" htmlFor="checkout-address">
                <span className="sk-field__label">Dirección</span>
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
            <p className="sk-kicker">Método de pago</p>
            <h2 id="payment-title">Selección requerida</h2>
            <fieldset className="sk-radio-grid">
              <legend>Método de pago</legend>
              {paymentOptions.map((option) => (
                <label className="sk-option" key={option.value}>
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={form.paymentMethod === option.value}
                    onChange={() => handlePaymentMethodChange(option.value)}
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
            {isSubmitting ? 'Finalizando...' : 'Finalizar orden'}
          </button>
        </form>

        <aside className="sk-checkout-sidebar" aria-label="Resumen de orden y mensaje">
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
                    {item.discountPercentage ? (
                      <span>-{item.discountPercentage}% de descuento</span>
                    ) : null}
                  </div>
                  <SkamaPrice
                    price={item.subtotal}
                    originalPrice={
                      item.originalUnitPrice && item.originalUnitPrice > item.unitPrice
                        ? item.originalUnitPrice * item.quantity
                        : undefined
                    }
                    discountPercentage={item.discountPercentage}
                  />
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
            <h2>Mensaje de orden</h2>
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
              {isFormValid ? 'Orden lista para enviar por WhatsApp.' : validation}
            </p>
          </section>
        </aside>
      </section>

      <CheckoutRatingDialog
        open={ratingDialogOpen}
        items={checkoutItems}
        ratingsByItemId={ratingsByItemId}
        validationMessage={ratingValidation}
        isSubmitting={isSubmitting}
        onClose={() => setRatingDialogOpen(false)}
        onRatingChange={updateProductRating}
        onSubmit={() => void submitRatedOrder()}
      />

      <Dialog
        open={cardPaymentDialogOpen}
        onClose={chooseAnotherPaymentMethod}
        title="Pago con tarjeta en sucursal"
        actions={
          <>
            <button className="sk-button sk-button--secondary" type="button" onClick={chooseAnotherPaymentMethod}>
              Otro método de pago
            </button>
            <button className="sk-button sk-button--primary" type="button" onClick={acceptCardPaymentMethod}>
              Aceptar
            </button>
          </>
        }
      >
        <p>
          Para gestionar el pago con tarjeta deberás acercarte a la sucursal SKAMA más cercana y
          realizar el pago de forma física.
        </p>
        <p>
          Puedes verificar nuestras ubicaciones antes de continuar en{' '}
          <RouterLink className="sk-link" to={locationsPath} onClick={chooseAnotherPaymentMethod}>
            el apartado de ubicaciones
          </RouterLink>
          .
        </p>
      </Dialog>
    </div>
  );
}
