import { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { PageShell } from '../../components/layouts/PageShell';
import { StatCard } from '../../components/admin/StatCard';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { Table, type TableColumn } from '../../components/tables';
import { Loading, ErrorState, Chip } from '../../components/feedback';
import { Button } from '../../components/buttons';
import { Dialog } from '../../components/dialogs';
import { useDashboardSummary, useProducts, useRegisteredCustomers } from '../../hooks';
import { formatPrice, getDefaultDateRange, tokens } from '../../utils';
import type { IProductDto, IUserDto } from '../../types';
import { ROUTES } from '../../routes/routePaths';
import { LOW_STOCK_THRESHOLD } from '../../constants/inventory';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

const customerColumns: TableColumn<IUserDto>[] = [
  { id: 'email', label: 'Correo', accessor: 'email' },
  { id: 'roleName', label: 'Rol', accessor: 'roleName' },
  {
    id: 'createdAt',
    label: 'Registro',
    render: (row) => formatDate(row.createdAt),
  },
  {
    id: 'status',
    label: 'Estado',
    render: (row) => (
      <Chip
        label={row.isActive ? 'Activo' : 'Inactivo'}
        chipVariant={row.isActive ? 'success' : 'default'}
        size="small"
      />
    ),
  },
];

const lowStockColumns: TableColumn<IProductDto>[] = [
  { id: 'name', label: 'Producto', accessor: 'name' },
  { id: 'categoryName', label: 'Material', accessor: 'categoryName' },
  {
    id: 'stockQuantity',
    label: 'Stock',
    accessor: 'stockQuantity',
    align: 'center',
  },
  {
    id: 'price',
    label: 'Precio',
    align: 'right',
    render: (row) => formatPrice(row.price),
  },
  {
    id: 'productStatus',
    label: 'Estado',
    render: (row) => (
      <Chip
        label={row.isLimitedEdition ? 'Limitada' : 'Regular'}
        chipVariant={row.isLimitedEdition ? 'warning' : 'success'}
        size="small"
      />
    ),
  },
];

export function DashboardPage() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [customersDialogOpen, setCustomersDialogOpen] = useState(false);
  const [lowStockDialogOpen, setLowStockDialogOpen] = useState(false);
  const { summary, loading, error, refetch } = useDashboardSummary(dateRange);
  const {
    customers,
    loading: customersLoading,
    error: customersError,
    refetch: refetchCustomers,
  } = useRegisteredCustomers(dateRange);
  const productFilters = useMemo(() => ({ includeInactive: true }), []);
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(productFilters);

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) => product.isActive && product.stockQuantity < LOW_STOCK_THRESHOLD,
      ),
    [products],
  );

  const customerCount =
    customersError && customers.length === 0 && summary
      ? summary.registeredCustomers
      : customers.length;
  const lowStockCount =
    productsError && products.length === 0 && summary
      ? summary.lowStockProducts
      : lowStockProducts.length;

  if (loading && !summary) {
    return <Loading fullPage message="Cargando panel..." />;
  }

  if (error && !summary) {
    return <ErrorState description={error} onRetry={() => void refetch()} />;
  }

  return (
    <PageShell
      title="Panel administrativo"
      subtitle="Resumen del negocio"
      breadcrumbs={[
        { label: 'Administración', path: ROUTES.admin.dashboard },
        { label: 'Panel' },
      ]}
    >
      <DateRangeFilter
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onStartDateChange={(startDate) => setDateRange((current) => ({ ...current, startDate }))}
        onEndDateChange={(endDate) => setDateRange((current) => ({ ...current, endDate }))}
        onApply={() => void refetch()}
        loading={loading}
      />

      {summary && (
        <>
          <Grid container spacing={3} sx={{ mt: tokens.spacing.md }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Ventas totales" value={formatPrice(summary.totalSales)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Órdenes" value={String(summary.totalOrders)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Valor promedio por orden" value={formatPrice(summary.averageOrderValue)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Clientes registrados"
                value={customersLoading && customers.length === 0 ? '...' : String(customerCount)}
                helperText="Ver listado del periodo"
                onClick={() => setCustomersDialogOpen(true)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: tokens.spacing.md }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Stock bajo"
                value={productsLoading && products.length === 0 ? '...' : String(lowStockCount)}
                helperText={`Productos activos con menos de ${LOW_STOCK_THRESHOLD} unidades`}
                onClick={() => setLowStockDialogOpen(true)}
              />
            </Grid>
          </Grid>

          <Dialog
            open={customersDialogOpen}
            onClose={() => setCustomersDialogOpen(false)}
            title="Clientes registrados"
            maxWidth="md"
            actions={
              <>
                <Button variant="ghost" onClick={() => void refetchCustomers()} disabled={customersLoading}>
                  Actualizar
                </Button>
                <Button onClick={() => setCustomersDialogOpen(false)}>Cerrar</Button>
              </>
            }
          >
            {customersLoading && customers.length === 0 ? (
              <Loading message="Cargando clientes..." />
            ) : customersError ? (
              <ErrorState description={customersError} onRetry={() => void refetchCustomers()} />
            ) : (
              <Table
                columns={customerColumns}
                rows={customers}
                getRowId={(row) => row.id}
                emptyMessage="No hay clientes registrados en el periodo seleccionado"
              />
            )}
          </Dialog>

          <Dialog
            open={lowStockDialogOpen}
            onClose={() => setLowStockDialogOpen(false)}
            title="Detalle de stock bajo"
            maxWidth="md"
            actions={
              <>
                <Button variant="ghost" onClick={() => void refetchProducts()} disabled={productsLoading}>
                  Actualizar
                </Button>
                <Button onClick={() => setLowStockDialogOpen(false)}>Cerrar</Button>
              </>
            }
          >
            {productsLoading && products.length === 0 ? (
              <Loading message="Cargando stock..." />
            ) : productsError ? (
              <ErrorState description={productsError} onRetry={() => void refetchProducts()} />
            ) : (
              <Table
                columns={lowStockColumns}
                rows={lowStockProducts}
                getRowId={(row) => row.id}
                emptyMessage={`No hay productos activos con menos de ${LOW_STOCK_THRESHOLD} unidades`}
              />
            )}
          </Dialog>
        </>
      )}
    </PageShell>
  );
}
