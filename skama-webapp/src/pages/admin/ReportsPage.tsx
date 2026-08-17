import Box from '@mui/material/Box';
import { useState } from 'react';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Table, type TableColumn } from '../../components/tables';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { Loading, ErrorState, EmptyState } from '../../components/feedback';
import { Text } from '../../components/typography';
import { useSalesReports } from '../../hooks';
import {
  downloadSalesReportPdf,
  formatPrice,
  getDefaultDateRange,
  tokens,
} from '../../utils';
import type { ISalesByProductDto } from '../../types';
import { ROUTES } from '../../routes/routePaths';

const salesColumns: TableColumn<ISalesByProductDto>[] = [
  { id: 'customerEmail', label: 'Correo', accessor: 'customerEmail' },
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
  const { salesByProduct, loading, error, fetchReports } = useSalesReports(dateRange);

  async function handleGenerateReport() {
    const rows = await fetchReports();
    if (rows) {
      downloadSalesReportPdf(rows, dateRange);
    }
  }

  return (
    <PageShell
      title="Ventas"
      subtitle="Reporte por cliente y producto"
      breadcrumbs={[
        { label: 'Administracion', path: ROUTES.admin.dashboard },
        { label: 'Ventas' },
      ]}
    >
      <Card>
        <DateRangeFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onStartDateChange={(startDate) => setDateRange((current) => ({ ...current, startDate }))}
          onEndDateChange={(endDate) => setDateRange((current) => ({ ...current, endDate }))}
          onApply={() => void handleGenerateReport()}
          loading={loading}
          applyLabel="Generar reporte"
        />

        <Box sx={{ mt: tokens.spacing.lg }}>
          {loading ? (
            <Loading message="Generando reporte..." />
          ) : error ? (
            <ErrorState description={error} onRetry={() => void fetchReports()} />
          ) : salesByProduct.length === 0 ? (
            <EmptyState
              title="Sin datos"
              description="No hay ventas registradas en el periodo seleccionado."
            />
          ) : (
            <Table
              columns={salesColumns}
              rows={salesByProduct}
              getRowId={(row) => `${row.productId}-${row.customerEmail}`}
              emptyMessage="No hay ventas registradas en el periodo seleccionado"
            />
          )}
        </Box>

        {!loading && !error && (
          <Text variant="caption" muted sx={{ display: 'block', mt: tokens.spacing.md }}>
            {salesByProduct.length} registro(s) de ventas ordenados por mayor monto.
          </Text>
        )}
      </Card>
    </PageShell>
  );
}
