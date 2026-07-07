import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Button } from '../../components/buttons';
import { Chip, Loading, ErrorState } from '../../components/feedback';
import { Text } from '../../components/typography';
import { ReviewForm, ReviewList } from '../../components/reviews';
import {
  useAuth,
  useCart,
  useEligibleReviewOrders,
  useProduct,
  useProductReviews,
  useWishlist,
} from '../../hooks';
import { getApiErrorMessage, tokens, resolveAssetUrl, formatPrice } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const { product, images, loading, error, refetch } = useProduct(productId);
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useProductReviews(productId);
  const { eligibleOrders, loading: eligibleOrdersLoading } = useEligibleReviewOrders(
    user?.userId,
    productId,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const mainImageUrl = useMemo(() => {
    const mainImage = images.find((image) => image.isMain) ?? images[0];
    return resolveAssetUrl(mainImage?.imageUrl);
  }, [images]);

  if (loading) {
    return <Loading fullPage message="Cargando producto..." />;
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Producto no disponible"
        description={error ?? 'No encontramos este producto.'}
        onRetry={() => void refetch()}
      />
    );
  }

  const inStock = product.stockQuantity > 0 && product.isActive;
  const favorited = isFavorite(product.id);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.productDetail(productId!) } });
      return;
    }

    setIsAdding(true);
    try {
      await addItem(product!.id, 1);
      toast.success('Producto agregado al carrito.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo agregar al carrito.'));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.productDetail(product!.id) } });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const isNowFavorite = await toggleFavorite(product!.id);
      toast.success(isNowFavorite ? 'Agregado a favoritos.' : 'Eliminado de favoritos.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo actualizar favoritos.'));
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  return (
    <PageShell
      title={product.name}
      subtitle={product.description}
      badge={inStock ? 'En stock' : 'Agotado'}
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Catálogo', path: ROUTES.catalog },
        { label: product.name },
      ]}
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              aspectRatio: '1',
              borderRadius: tokens.radius.lg,
              backgroundColor: tokens.color.surfaceSecondary,
              border: `1px solid ${tokens.color.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.color.muted,
              overflow: 'hidden',
            }}
          >
            {mainImageUrl ? (
              <Box
                component="img"
                src={mainImageUrl}
                alt={product.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              'Sin imagen'
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              <Chip label={product.categoryName} chipVariant="primary" sx={{ alignSelf: 'flex-start' }} />
              <Text variant="h2" sx={{ color: tokens.color.primary }}>
                {formatPrice(product.price)}
              </Text>
              <Text variant="body" muted>
                {product.description}
              </Text>
              <Text variant="caption" muted>
                Stock disponible: {product.stockQuantity}
              </Text>
              <Box sx={{ display: 'flex', gap: tokens.spacing.md, mt: tokens.spacing.md, flexWrap: 'wrap' }}>
                <Button disabled={!inStock || isAdding} onClick={() => void handleAddToCart()}>
                  {isAdding ? 'Agregando...' : 'Agregar al carrito'}
                </Button>
                <Button
                  variant="outline"
                  disabled={isTogglingFavorite}
                  onClick={() => void handleToggleFavorite()}
                  startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                >
                  {favorited ? 'En favoritos' : 'Agregar a favoritos'}
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: tokens.spacing['2xl'] }}>
        <Text variant="h2" sx={{ mb: tokens.spacing.lg }}>
          Reseñas
        </Text>
        {reviewsLoading ? (
          <Loading message="Cargando reseñas..." />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg }}>
            <ReviewList reviews={reviews} />
            {isAuthenticated && user && (
              <ReviewForm
                userId={user.userId}
                productId={product.id}
                eligibleOrders={eligibleOrders}
                loadingOrders={eligibleOrdersLoading}
                onSuccess={() => void refetchReviews()}
              />
            )}
          </Box>
        )}
      </Box>
    </PageShell>
  );
}
