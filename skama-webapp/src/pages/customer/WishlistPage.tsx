import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../components/layouts/PageShell';
import { ProductCard } from '../../components/cards';
import { Loading, ErrorState, EmptyState } from '../../components/feedback';
import { useWishlist } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, isLoading, error, refreshWishlist } = useWishlist();

  if (isLoading) {
    return <Loading fullPage message="Cargando favoritos..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={() => void refreshWishlist()} />;
  }

  return (
    <PageShell
      title="Favoritos"
      subtitle="Productos guardados para más tarde"
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Favoritos' },
      ]}
    >
      {items.length === 0 ? (
        <EmptyState
          title="Sin favoritos"
          description="Guarda productos que te gusten para verlos aquí."
          actionLabel="Explorar catálogo"
          onAction={() => navigate(ROUTES.catalog)}
        />
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProductCard
                id={item.productId}
                name={item.productName}
                price={item.price}
                isFavorite
              />
            </Grid>
          ))}
        </Grid>
      )}
    </PageShell>
  );
}
