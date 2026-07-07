import { useState } from 'react';
import Box from '@mui/material/Box';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Table, type TableColumn } from '../../components/tables';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { Button } from '../../components/buttons';
import { Loading, ErrorState, EmptyState } from '../../components/feedback';
import { Text } from '../../components/typography';
import { useSalesReports } from '../../hooks';
import { formatPrice, formatDisplayDate, getDefaultDateRange, tokens } from '../../utils';
import type { ISalesByPeriodDto, ISalesByProductDto } from '../../types';
import { ROUTES } from '../../routes/routePaths';

type ReportView = 'period' | 'product';

const periodColumns: TableColumn<ISalesByPeriodDto>[] = [
  {
    id: 'saleDate',
    label: 'Fecha',
    render: (row) => formatDisplayDate(row.saleDate),
  },
  { id: 'orderCount', label: 'Pedidos', accessor: 'orderCount', align: 'center' },
  {
    id: 'subtotal',
    label: 'Subtotal',
    align: 'right',
    render: (row) => formatPrice(row.subtotal),
  },
  {
    id: 'discountTotal',
    label: 'Descuentos',
    align: 'right',
    render: (row) => formatPrice(row.discountTotal),
  },
  {
    id: 'total',
    label: 'Total',
    align: 'right',
    render: (row) => formatPrice(row.total),
  },
];

const productColumns: TableColumn<ISalesByProductDto>[] = [
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

export function ReportsPage() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [view, setView] = useState<ReportView>('period');
  const { salesByPeriod, salesByProduct, loading, error, fetchReports } =
    useSalesReports(dateRange);

  const rows = view === 'period' ? salesByPeriod : salesByProduct;

  return (
    <PageShell
      title="Reportes"
      subtitle="Análisis de ventas por período"
      breadcrumbs={[
        { label: 'Admin', path: ROUTES.admin.dashboard },
        { label: 'Reportes' },
      ]}
    >
      <Card>
        <DateRangeFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onStartDateChange={(startDate) => setDateRange((current) => ({ ...current, startDate }))}
          onEndDateChange={(endDate) => setDateRange((current) => ({ ...current, endDate }))}
          onApply={() => void fetchReports()}
          loading={loading}
          applyLabel="Generar reporte"
        />

        <Box sx={{ display: 'flex', gap: tokens.spacing.sm, mt: tokens.spacing.lg, mb: tokens.spacing.md }}>
          <Button
            variant={view === 'period' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('period')}
          >
            Por día
          </Button>
          <Button
            variant={view === 'product' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('product')}
          >
            Por producto
          </Button>
        </Box>

        {loading ? (
          <Loading message="Generando reporte..." />
        ) : error ? (
          <ErrorState description={error} onRetry={() => void fetchReports()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Sin datos"
            description="No hay ventas registradas en el período seleccionado."
          />
        ) : view === 'period' ? (
          <Table
            columns={periodColumns}
            rows={salesByPeriod}
            getRowId={(row) => row.saleDate}
          />
        ) : (
          <Table
            columns={productColumns}
            rows={salesByProduct}
            getRowId={(row) => row.productId}
          />
        )}

        {!loading && !error && rows.length > 0 && (
          <Text variant="caption" muted sx={{ display: 'block', mt: tokens.spacing.md }}>
            {view === 'period'
              ? `${salesByPeriod.length} día(s) con ventas`
              : `${salesByProduct.length} producto(s) con ventas`}
          </Text>
        )}
      </Card>
    </PageShell>
  );
}
