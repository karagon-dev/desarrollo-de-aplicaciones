import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { PageShell } from '../../components/layouts/PageShell';
import { SearchBar, Select } from '../../components/inputs';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { useCategories, useDebouncedValue, useProductMainImages, useProducts } from '../../hooks';
import { ROUTES } from '../../routes/routePaths';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { categories } = useCategories();

  const filters = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      categoryId: categoryId || undefined,
      includeInactive: false,
    }),
    [debouncedSearch, categoryId],
  );

  const { products, loading, error, refetch } = useProducts(filters);
  const imageMap = useProductMainImages(products.map((product) => product.id));

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Todas las categorías' },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categories],
  );

  return (
    <PageShell
      title="Catálogo"
      subtitle="Explora nuestra colección de joyería con esmeralda"
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Catálogo' },
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <SearchBar
          placeholder="Buscar productos..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ maxWidth: { md: 480 }, flex: 1 }}
        />
        <Select
          label="Categoría"
          options={categoryOptions}
          value={categoryId}
          onChange={(event) => setCategoryId(String(event.target.value))}
          sx={{ minWidth: { md: 240 } }}
        />
      </Box>

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={() => void refetch()}
        imageUrlByProductId={imageMap}
      />
    </PageShell>
  );
}
