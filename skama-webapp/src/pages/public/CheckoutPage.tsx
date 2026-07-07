import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { TextArea, Select } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { Text } from '../../components/typography';
import { Loading, EmptyState } from '../../components/feedback';
import { useCart } from '../../hooks';
import { orderService } from '../../services';
import { getApiErrorMessage, formatPrice, tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

const paymentOptions = [
  { value: 'CREDIT_CARD', label: 'Tarjeta de crédito' },
  { value: 'DEBIT_CARD', label: 'Tarjeta débito' },
  { value: 'TRANSFER', label: 'Transferencia' },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading, refreshCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading && !cart) {
    return <Loading fullPage message="Cargando checkout..." />;
  }

  if (!cart?.items.length) {
    return (
      <PageShell
        title="Checkout"
        subtitle="Completa tu pedido"
        breadcrumbs={[
          { label: 'Inicio', path: ROUTES.home },
          { label: 'Carrito', path: ROUTES.cart },
          { label: 'Checkout' },
        ]}
      >
        <Card>
          <EmptyState
            title="Carrito vacío"
            description="Agrega productos antes de finalizar la compra."
            actionLabel="Ir al catálogo"
            onAction={() => navigate(ROUTES.catalog)}
          />
        </Card>
      </PageShell>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!shippingAddress.trim()) {
      toast.error('Ingresa una dirección de envío.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await orderService.createFromCart(cart!.id, {
        paymentMethod,
        shippingAddress: shippingAddress.trim(),
      });
      toast.success(`Pedido creado: ${data.orderNumber}`);
      await refreshCart();
      navigate(ROUTES.orderHistory);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo crear el pedido.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Checkout"
      subtitle="Completa tu pedido"
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Carrito', path: ROUTES.cart },
        { label: 'Checkout' },
      ]}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}
            >
              <Text variant="h3">Envío y pago</Text>
              <TextArea
                label="Dirección de envío"
                placeholder="Calle, número, ciudad..."
                rows={3}
                required
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
              />
              <Select
                label="Método de pago"
                options={paymentOptions}
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(String(event.target.value))}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <Text variant="h3" sx={{ mb: tokens.spacing.md }}>
              Resumen
            </Text>
            {cart.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: tokens.spacing.sm,
                }}
              >
                <Text variant="small" muted>
                  {item.productName} × {item.quantity}
                </Text>
                <Text variant="small">{formatPrice(item.subtotal)}</Text>
              </Box>
            ))}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: tokens.spacing.md,
                pt: tokens.spacing.md,
                borderTop: `1px solid ${tokens.color.border}`,
              }}
            >
              <Text variant="body" muted>
                Total
              </Text>
              <Text variant="h3" sx={{ color: tokens.color.primary }}>
                {formatPrice(cart.total)}
              </Text>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
}
