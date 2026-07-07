import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { StatCard } from '../../components/admin/StatCard';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { Table, type TableColumn } from '../../components/tables';
import { Loading, ErrorState } from '../../components/feedback';
import { Text } from '../../components/typography';
import { useDashboardSummary } from '../../hooks';
import { formatPrice, getDefaultDateRange, tokens } from '../../utils';
import type { ITopProductSummary } from '../../types';
import { ROUTES } from '../../routes/routePaths';

const topProductColumns: TableColumn<ITopProductSummary>[] = [
  { id: 'productName', label: 'Producto', accessor: 'productName' },
  {
    id: 'totalQuantitySold',
    label: 'Unidades',
    accessor: 'totalQuantitySold',
    align: 'center',
  },
  {
    id: 'totalSales',
    label: 'Ventas',
    align: 'right',
    render: (row) => formatPrice(row.totalSales),
  },
];

export function DashboardPage() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const { summary, loading, error, refetch } = useDashboardSummary(dateRange);

  if (loading && !summary) {
    return <Loading fullPage message="Cargando dashboard..." />;
  }

  if (error && !summary) {
    return <ErrorState description={error} onRetry={() => void refetch()} />;
  }

  return (
    <PageShell
      title="Dashboard"
      subtitle="Resumen del negocio"
      breadcrumbs={[
        { label: 'Admin', path: ROUTES.admin.dashboard },
        { label: 'Dashboard' },
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
              <StatCard label="Pedidos" value={String(summary.totalOrders)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Ticket promedio" value={formatPrice(summary.averageOrderValue)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Clientes registrados" value={String(summary.registeredCustomers)} />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: tokens.spacing.md }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <Text variant="h3" sx={{ mb: tokens.spacing.sm }}>
                  Stock bajo
                </Text>
                <Text variant="h2" sx={{ color: tokens.color.warning }}>
                  {summary.lowStockProducts}
                </Text>
                <Text variant="small" muted>
                  Productos activos con stock en o por debajo del mínimo
                </Text>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card padding={false}>
                <Box sx={{ p: tokens.spacing.md }}>
                  <Text variant="h3">Top productos</Text>
                </Box>
                <Table
                  columns={topProductColumns}
                  rows={summary.topProducts}
                  getRowId={(row) => row.productId}
                  emptyMessage="Sin ventas en el período seleccionado"
                />
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </PageShell>
  );
}
