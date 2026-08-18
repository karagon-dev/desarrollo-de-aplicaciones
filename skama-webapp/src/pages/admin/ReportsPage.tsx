import Box from '@mui/material/Box';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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

function formatRating(value?: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Sin calificación';
  }

  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}/5`;
}

const ratingStars = [1, 2, 3, 4, 5] as const;

function renderRating(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return formatRating(value);
  }

  const filledStars = Math.max(0, Math.min(5, Math.round(value)));
  const label = formatRating(value);

  return (
    <Box
      aria-label={`Calificacion ${label}`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          display: 'inline-flex',
          color: tokens.color.warning,
          lineHeight: 1,
        }}
      >
        {ratingStars.map((star) =>
          star <= filledStars ? (
            <StarIcon key={star} sx={{ fontSize: 17 }} />
          ) : (
            <StarBorderIcon key={star} sx={{ fontSize: 17 }} />
          ),
        )}
      </Box>
      <span>{label}</span>
    </Box>
  );
}

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
    id: 'averageRating',
    label: 'Calificación',
    align: 'center',
    render: (row) => renderRating(row.averageRating),
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
