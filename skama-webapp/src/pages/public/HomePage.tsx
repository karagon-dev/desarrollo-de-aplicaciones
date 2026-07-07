import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import { PageShell } from '../../components/layouts/PageShell';
import { Button } from '../../components/buttons';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { Card, PromotionCard } from '../../components/cards';
import { ErrorState, Loading } from '../../components/feedback';
import { Text } from '../../components/typography';
import { useActivePromotions, useProductMainImages, useProducts } from '../../hooks';
import { tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function HomePage() {
  const { products, loading, error, refetch } = useProducts({ includeInactive: false });
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
    refetch: refetchPromotions,
  } = useActivePromotions();
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const imageMap = useProductMainImages(featuredProducts.map((product) => product.id));

  return (
    <>
      <Box
        sx={{
          borderRadius: tokens.radius.lg,
          background: `linear-gradient(135deg, ${tokens.color.primarySoft} 0%, ${tokens.color.surface} 100%)`,
          border: `1px solid ${tokens.color.border}`,
          p: { xs: tokens.spacing.lg, md: tokens.spacing['2xl'] },
          mb: tokens.spacing['2xl'],
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: tokens.spacing.xl,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Text variant="display" sx={{ fontFamily: '"Playfair Display", Georgia, serif', mb: tokens.spacing.md }}>
            Esmeraldas que cuentan historias
          </Text>
          <Text variant="bodyLarge" muted sx={{ mb: tokens.spacing.lg, maxWidth: 520 }}>
            Descubre joyería artesanal con esmeralda colombiana. Diseños únicos para momentos inolvidables.
          </Text>
          <Box sx={{ display: 'flex', gap: tokens.spacing.md, flexWrap: 'wrap' }}>
            <Button component={RouterLink} to={ROUTES.catalog}>
              Ver catálogo
            </Button>
            <Button component={RouterLink} to={ROUTES.register} variant="outline">
              Crear cuenta
            </Button>
          </Box>
        </Box>
        <Card
          padding
          sx={{
            flex: { md: '0 0 280px' },
            textAlign: 'center',
            backgroundColor: tokens.color.surface,
          }}
        >
          <Text variant="h3" sx={{ color: tokens.color.primary, mb: tokens.spacing.sm }}>
            SKAMA
          </Text>
          <Text variant="small" muted>
            Joyería con esmeralda · Calidad certificada
          </Text>
        </Card>
      </Box>

      {(promotionsLoading || promotions.length > 0 || promotionsError) && (
        <Box sx={{ mb: tokens.spacing['2xl'] }}>
          <PageShell
            title="Promociones activas"
            subtitle="Aprovecha descuentos exclusivos en joyería con esmeralda"
          >
            {promotionsLoading ? (
              <Loading message="Cargando promociones..." />
            ) : promotionsError ? (
              <ErrorState
                title="Promociones no disponibles"
                description={promotionsError}
                onRetry={() => void refetchPromotions()}
              />
            ) : (
              <Grid container spacing={3}>
                {promotions.map((promotion) => (
                  <Grid key={promotion.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <PromotionCard promotion={promotion} />
                  </Grid>
                ))}
              </Grid>
            )}
          </PageShell>
        </Box>
      )}
      <PageShell
        title="Destacados"
        subtitle="Piezas seleccionadas de nuestra colección"
      >
        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
          onRetry={() => void refetch()}
          imageUrlByProductId={imageMap}
        />
      </PageShell>
    </>
  );
}
