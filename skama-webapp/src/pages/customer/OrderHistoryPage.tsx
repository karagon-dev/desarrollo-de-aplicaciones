import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Button } from '../../components/buttons';
import { Table, type TableColumn } from '../../components/tables';
import { Chip, Loading, ErrorState, EmptyState } from '../../components/feedback';
import { useAuth } from '../../hooks';
import { orderService } from '../../services';
import type { IOrderDto } from '../../types';
import { getApiErrorMessage, formatPrice } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns: TableColumn<IOrderDto>[] = useMemo(
    () => [
      { id: 'orderNumber', label: 'Pedido', accessor: 'orderNumber' },
      {
        id: 'createdAt',
        label: 'Fecha',
        render: (row) => new Date(row.createdAt).toLocaleDateString('es-CO'),
      },
      {
        id: 'status',
        label: 'Estado',
        render: (row) => <Chip label={row.status} chipVariant="primary" size="small" />,
      },
      {
        id: 'total',
        label: 'Total',
        align: 'right',
        render: (row) => formatPrice(row.total),
      },
      {
        id: 'actions',
        label: '',
        align: 'right',
        render: (row) => (
          <Button
            component={RouterLink}
            to={ROUTES.orderDetail(row.id)}
            variant="outline"
            size="sm"
          >
            Ver detalle
          </Button>
        ),
      },
    ],
    [],
  );

  const loadOrders = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await orderService.getByUser(user.userId);
      setOrders(data);
    } catch (err) {
      setOrders([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar los pedidos.'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  if (loading) {
    return <Loading fullPage message="Cargando pedidos..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={() => void loadOrders()} />;
  }

  return (
    <PageShell
      title="Historial de pedidos"
      subtitle="Consulta el estado de tus compras"
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Pedidos' },
      ]}
    >
      <Card padding={false}>
        {orders.length === 0 ? (
          <EmptyState
            title="Sin pedidos"
            description="Cuando completes una compra, aparecerá aquí."
          />
        ) : (
          <Table columns={columns} rows={orders} getRowId={(row) => row.id} />
        )}
      </Card>
    </PageShell>
  );
}
