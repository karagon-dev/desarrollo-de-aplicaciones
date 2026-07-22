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
    label: 'Date',
    render: (row) => formatDisplayDate(row.saleDate),
  },
  { id: 'orderCount', label: 'Orders', accessor: 'orderCount', align: 'center' },
  {
    id: 'subtotal',
    label: 'Subtotal',
    align: 'right',
    render: (row) => formatPrice(row.subtotal),
  },
  {
    id: 'discountTotal',
    label: 'Discounts',
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
  { id: 'productName', label: 'Product', accessor: 'productName' },
  {
    id: 'totalQuantitySold',
    label: 'Units',
    accessor: 'totalQuantitySold',
    align: 'center',
  },
  {
    id: 'totalSales',
    label: 'Sales',
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
      title="Reports"
      subtitle="Sales analysis by period"
      breadcrumbs={[
        { label: 'Admin', path: ROUTES.admin.dashboard },
        { label: 'Reports' },
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
          applyLabel="Generate report"
        />

        <Box sx={{ display: 'flex', gap: tokens.spacing.sm, mt: tokens.spacing.lg, mb: tokens.spacing.md }}>
          <Button
            variant={view === 'period' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('period')}
          >
            By day
          </Button>
          <Button
            variant={view === 'product' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('product')}
          >
            By product
          </Button>
        </Box>

        {loading ? (
          <Loading message="Generating report..." />
        ) : error ? (
          <ErrorState description={error} onRetry={() => void fetchReports()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No data"
            description="No sales registered in the selected period."
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
              ? `${salesByPeriod.length} day(s) with sales`
              : `${salesByProduct.length} product(s) with sales`}
          </Text>
        )}
      </Card>
    </PageShell>
  );
}
