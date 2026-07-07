import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { EmptyState, Loading, ErrorState } from '../../components/feedback';
import { Button } from '../../components/buttons';
import { CartItemList } from '../../components/cart/CartItemList';
import { Text } from '../../components/typography';
import { useAuth, useCart } from '../../hooks';
import { getApiErrorMessage, formatPrice, tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, error, refreshCart, updateItemQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isAuthenticated) {
    return (
      <PageShell
        title="Carrito"
        subtitle="Revisa los productos antes de finalizar tu compra"
        breadcrumbs={[
          { label: 'Inicio', path: ROUTES.home },
          { label: 'Carrito' },
        ]}
      >
        <Card>
          <EmptyState
            title="Inicia sesión para ver tu carrito"
            description="Accede a tu cuenta para agregar productos y completar tu compra."
            actionLabel="Iniciar sesión"
            onAction={() => navigate(ROUTES.login, { state: { from: ROUTES.cart } })}
          />
        </Card>
      </PageShell>
    );
  }

  if (isLoading && !cart) {
    return <Loading fullPage message="Cargando carrito..." />;
  }

  if (error && !cart) {
    return <ErrorState description={error} onRetry={() => void refreshCart()} />;
  }

  const isEmpty = !cart?.items.length;

  async function handleUpdateQuantity(cartItemId: string, quantity: number) {
    setIsUpdating(true);
    try {
      await updateItemQuantity(cartItemId, quantity);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo actualizar la cantidad.'));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove(cartItemId: string) {
    setIsUpdating(true);
    try {
      await removeItem(cartItemId);
      toast.success('Producto eliminado del carrito.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo eliminar el producto.'));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <PageShell
      title="Carrito"
      subtitle="Revisa los productos antes de finalizar tu compra"
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Carrito' },
      ]}
    >
      <Card>
        {isEmpty ? (
          <EmptyState
            title="Tu carrito está vacío"
            description="Explora el catálogo y agrega piezas que te encanten."
            actionLabel="Ver catálogo"
            onAction={() => navigate(ROUTES.catalog)}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
            <CartItemList
              items={cart!.items}
              isUpdating={isUpdating}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: tokens.spacing.md,
                pt: tokens.spacing.md,
                borderTop: `1px solid ${tokens.color.border}`,
              }}
            >
              <Text variant="h3" sx={{ color: tokens.color.primary }}>
                Total: {formatPrice(cart!.total)}
              </Text>
              <Button component={RouterLink} to={ROUTES.checkout}>
                Ir al checkout
              </Button>
            </Box>
          </Box>
        )}
      </Card>
    </PageShell>
  );
}
