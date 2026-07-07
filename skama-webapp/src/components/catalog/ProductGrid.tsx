import Grid from '@mui/material/Grid';
import type { IProductDto } from '../../types';
import { ProductCard } from '../cards';
import { Loading, EmptyState, ErrorState } from '../feedback';
import { resolveAssetUrl } from '../../utils';

interface IProductGridProps {
  products: IProductDto[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  imageUrlByProductId?: Record<string, string | undefined>;
}

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  imageUrlByProductId,
}: IProductGridProps) {
  if (loading) {
    return <Loading message="Cargando productos..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Sin productos"
        description="No encontramos productos con los filtros seleccionados."
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard
            id={product.id}
            name={product.name}
            categoryName={product.categoryName}
            price={product.price}
            imageUrl={resolveAssetUrl(imageUrlByProductId?.[product.id])}
          />
        </Grid>
      ))}
    </Grid>
  );
}
