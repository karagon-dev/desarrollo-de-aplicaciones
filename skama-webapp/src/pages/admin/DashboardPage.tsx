import { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { PageShell } from '../../components/layouts/PageShell';
import { StatCard } from '../../components/admin/StatCard';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { SalesTrendChart } from '../../components/admin/SalesTrendChart';
import { TopProductsBoard } from '../../components/admin/TopProductsBoard';
import { Table, type TableColumn } from '../../components/tables';
import { Loading, ErrorState, Chip } from '../../components/feedback';
import { Button } from '../../components/buttons';
import { Dialog } from '../../components/dialogs';
import { Text } from '../../components/typography';
import { Card } from '../../components/cards';
import {
  useAuth,
  useDashboardSummary,
  useProducts,
  useRegisteredCustomers,
  useSalesByPeriod,
} from '../../hooks';
import { formatPrice, getDefaultDateRange } from '../../utils';
import type { IProductDto, IUserDto } from '../../types';
import { ROUTES } from '../../routes/routePaths';
import { LOW_STOCK_THRESHOLD } from '../../constants/inventory';

const periodPresets = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value.includes('T') ? value : `${value}T00:00:00`));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Buenos días';
  }
  if (hour < 18) {
    return 'Buenas tardes';
  }
  return 'Buenas noches';
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
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [customersDialogOpen, setCustomersDialogOpen] = useState(false);
  const [lowStockDialogOpen, setLowStockDialogOpen] = useState(false);
  const { summary, loading, error, refetch } = useDashboardSummary(dateRange);
  const { salesByPeriod, loading: trendLoading } = useSalesByPeriod(dateRange);
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

  const inventoryMix = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive);
    const totals = new Map<string, number>();

    for (const product of activeProducts) {
      const material = product.categoryName?.trim() || 'Sin material';
      totals.set(material, (totals.get(material) ?? 0) + 1);
    }

    const max = Math.max(...totals.values(), 1);
    return [...totals.entries()]
      .map(([label, count]) => ({ label, count, width: (count / max) * 100 }))
      .sort((left, right) => right.count - left.count);
  }, [products]);

  const limitedCount = useMemo(
    () => products.filter((product) => product.isActive && product.isLimitedEdition).length,
    [products],
  );

  const salesSparkline = useMemo(
    () => salesByPeriod.map((row) => row.total),
    [salesByPeriod],
  );

  const activePresetDays = useMemo(() => {
    const expected = periodPresets.find((preset) => {
      const range = getDefaultDateRange(preset.days);
      return range.startDate === dateRange.startDate && range.endDate === dateRange.endDate;
    });
    return expected?.days;
  }, [dateRange.endDate, dateRange.startDate]);

  const customerCount =
    customersError && customers.length === 0 && summary
      ? summary.registeredCustomers
      : customers.length;
  const lowStockCount =
    productsError && products.length === 0 && summary
      ? summary.lowStockProducts
      : lowStockProducts.length;

  const accountLabel = user?.email?.split('@')[0] ?? 'atelier';

  if (loading && !summary) {
    return <Loading fullPage message="Afinando el panel..." />;
  }

  if (error && !summary) {
    return <ErrorState description={error} onRetry={() => void refetch()} />;
  }

  return (
    <PageShell
      title="Panel administrativo"
      subtitle="Pulso del atelier: ventas, inventario y clientes en un solo lienzo."
      breadcrumbs={[
        { label: 'Administración', path: ROUTES.admin.dashboard },
        { label: 'Panel' },
      ]}
    >
      <section className="sk-admin-dashboard">
        <Card className="sk-admin-hero">
          <div className="sk-admin-hero__copy">
            <p className="sk-kicker">Atelier SKAMA</p>
            <Text variant="h3" sx={{ fontFamily: 'var(--font-family-display)', fontWeight: 500 }}>
              {getGreeting()}, {accountLabel}
            </Text>
            <Text variant="small" muted>
              Periodo del {formatDate(dateRange.startDate)} al {formatDate(dateRange.endDate)}
            </Text>
          </div>
          <div className="sk-admin-hero__controls">
            <div className="sk-admin-presets" role="group" aria-label="Periodos rápidos">
              {periodPresets.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  className={`sk-admin-preset${activePresetDays === preset.days ? ' is-active' : ''}`}
                  onClick={() => setDateRange(getDefaultDateRange(preset.days))}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <DateRangeFilter
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onStartDateChange={(startDate) => setDateRange((current) => ({ ...current, startDate }))}
              onEndDateChange={(endDate) => setDateRange((current) => ({ ...current, endDate }))}
              onApply={() => void refetch()}
              loading={loading}
            />
          </div>
        </Card>

        {summary && (
          <>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <StatCard
                  label="Ventas totales"
                  value={formatPrice(summary.totalSales)}
                  helperText="Ingresos del periodo"
                  icon={<PaymentsOutlinedIcon fontSize="small" />}
                  tone="accent"
                  sparkline={salesSparkline}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <StatCard
                  label="Órdenes"
                  value={String(summary.totalOrders)}
                  helperText="Pedidos pagados"
                  icon={<ReceiptLongOutlinedIcon fontSize="small" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <StatCard
                  label="Ticket promedio"
                  value={formatPrice(summary.averageOrderValue)}
                  helperText="Valor medio por orden"
                  icon={<ShowChartOutlinedIcon fontSize="small" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                <StatCard
                  label="Clientes nuevos"
                  value={customersLoading && customers.length === 0 ? '...' : String(customerCount)}
                  helperText="Ver listado del periodo"
                  icon={<GroupOutlinedIcon fontSize="small" />}
                  onClick={() => setCustomersDialogOpen(true)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card className="sk-admin-panel">
                  <div className="sk-admin-panel__header">
                    <div>
                      <p className="sk-kicker">Curva de ventas</p>
                      <Text variant="h3">El ritmo del periodo</Text>
                    </div>
                    <Button variant="ghost" size="sm" component={RouterLink} to={ROUTES.admin.reports}>
                      Abrir ventas
                    </Button>
                  </div>
                  <SalesTrendChart
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    rows={salesByPeriod}
                    loading={trendLoading}
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card className="sk-admin-panel">
                  <div className="sk-admin-panel__header">
                    <div>
                      <p className="sk-kicker">Colección</p>
                      <Text variant="h3">Joyas más pedidas</Text>
                    </div>
                  </div>
                  <TopProductsBoard products={summary.topProducts} />
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card className="sk-admin-panel">
                  <div className="sk-admin-panel__header">
                    <div>
                      <p className="sk-kicker">Inventario</p>
                      <Text variant="h3">Mezcla de materiales</Text>
                    </div>
                    <span className="sk-stat-card__icon">
                      <Inventory2OutlinedIcon fontSize="small" />
                    </span>
                  </div>
                  {inventoryMix.length === 0 ? (
                    <Text variant="small" muted>
                      No hay productos activos para armar la mezcla.
                    </Text>
                  ) : (
                    <ul className="sk-admin-mix">
                      {inventoryMix.map((item) => (
                        <li key={item.label}>
                          <div className="sk-admin-mix__row">
                            <span>{item.label}</span>
                            <strong>{item.count}</strong>
                          </div>
                          <span className="sk-admin-mix__track">
                            <span style={{ width: `${item.width}%` }} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="sk-admin-limited">
                    <DiamondOutlinedIcon fontSize="small" />
                    <span>
                      {limitedCount} {limitedCount === 1 ? 'edición limitada' : 'ediciones limitadas'} en catálogo
                    </span>
                  </div>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  className="sk-admin-panel sk-admin-panel--interactive"
                  onClick={() => setLowStockDialogOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setLowStockDialogOpen(true);
                    }
                  }}
                >
                  <div className="sk-admin-panel__header">
                    <div>
                      <p className="sk-kicker">Alerta de taller</p>
                      <Text variant="h3">Stock bajo</Text>
                    </div>
                    <span className={`sk-admin-count${lowStockCount > 0 ? ' is-warning' : ''}`}>
                      {productsLoading && products.length === 0 ? '...' : lowStockCount}
                    </span>
                  </div>
                  <Text variant="small" muted>
                    Piezas activas con menos de {LOW_STOCK_THRESHOLD} unidades. Toca para ver el detalle.
                  </Text>
                  <ul className="sk-admin-preview">
                    {lowStockProducts.slice(0, 3).map((product) => (
                      <li key={product.id}>
                        <span>{product.name}</span>
                        <Chip label={`${product.stockQuantity} u.`} chipVariant="warning" size="small" />
                      </li>
                    ))}
                    {lowStockCount === 0 && (
                      <li className="sk-admin-preview--empty">Inventario saludable en este momento.</li>
                    )}
                  </ul>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  className="sk-admin-panel sk-admin-panel--interactive"
                  onClick={() => setCustomersDialogOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setCustomersDialogOpen(true);
                    }
                  }}
                >
                  <div className="sk-admin-panel__header">
                    <div>
                      <p className="sk-kicker">Comunidad</p>
                      <Text variant="h3">Clientes del periodo</Text>
                    </div>
                    <span className="sk-stat-card__icon">
                      <GroupOutlinedIcon fontSize="small" />
                    </span>
                  </div>
                  <ul className="sk-admin-preview">
                    {customers.slice(0, 4).map((customer) => (
                      <li key={customer.id}>
                        <span>{customer.email}</span>
                        <Chip label={formatDate(customer.createdAt)} size="small" />
                      </li>
                    ))}
                    {customerCount === 0 && (
                      <li className="sk-admin-preview--empty">Nadie se registró en estas fechas.</li>
                    )}
                  </ul>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </section>

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
    </PageShell>
  );
}
