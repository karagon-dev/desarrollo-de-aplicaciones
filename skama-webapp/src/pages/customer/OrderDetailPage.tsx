import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Button } from '../../components/buttons';
import { Table, type TableColumn } from '../../components/tables';
import { Chip, Loading, ErrorState } from '../../components/feedback';
import { Select } from '../../components/inputs';
import { Text } from '../../components/typography';
import { useAuth, useOrder } from '../../hooks';
import { orderService } from '../../services';
import type { IOrderItemDto } from '../../types';
import { formatPrice, getApiErrorMessage, tokens } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

const itemColumns: TableColumn<IOrderItemDto>[] = [
  { id: 'productName', label: 'Producto', accessor: 'productName' },
  { id: 'quantity', label: 'Cant.', accessor: 'quantity', align: 'center' },
  {
    id: 'unitPrice',
    label: 'Precio',
    align: 'right',
    render: (row) => formatPrice(row.unitPrice),
  },
  {
    id: 'discountAmount',
    label: 'Descuento',
    align: 'right',
    render: (row) => (row.discountAmount > 0 ? `-${formatPrice(row.discountAmount)}` : formatPrice(0)),
  },
  {
    id: 'lineTotal',
    label: 'Total',
    align: 'right',
    render: (row) => formatPrice(row.lineTotal),
  },
];

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagada' },
  { value: 'SHIPPED', label: 'Enviada' },
  { value: 'DELIVERED', label: 'Entregada' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

const cancellableStatuses = new Set(['PENDING', 'PAID']);

function getOrderStatusLabel(status: string): string {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function getPaymentMethodLabel(paymentMethod: string): string {
  const labels: Record<string, string> = {
    SINPE_MOVIL: 'SINPE Móvil',
    TRANSFERENCIA: 'Transferencia bancaria',
    TARJETA: 'Tarjeta',
    CASH: 'Efectivo',
  };

  return labels[paymentMethod] ?? paymentMethod;
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAdmin } = useAuth();
  const { order, loading, error, refetch } = useOrder(orderId);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (loading) {
    return <Loading fullPage message="Cargando orden..." />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Orden no encontrada"
        description={error ?? 'No encontramos esta orden.'}
        onRetry={() => void refetch()}
      />
    );
  }

  const canCancel = cancellableStatuses.has(order.status);

  async function handleCancel() {
    setCancelling(true);
    try {
      await orderService.cancel(order!.id);
      toast.success('Orden cancelada.');
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo cancelar la orden.'));
    } finally {
      setCancelling(false);
    }
  }

  async function handleStatusUpdate() {
    if (!status || status === order!.status) {
      return;
    }

    setUpdating(true);
    try {
      await orderService.updateStatus(order!.id, { status });
      toast.success('Estado actualizado.');
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo actualizar el estado.'));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <PageShell
      title={`Orden ${order.orderNumber}`}
      subtitle={`Creada el ${new Date(order.createdAt).toLocaleString('es-CR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })}`}
      badge={getOrderStatusLabel(order.status)}
      breadcrumbs={[
        { label: 'Inicio', path: ROUTES.home },
        { label: 'Pedidos', path: ROUTES.orderHistory },
        { label: order.orderNumber },
      ]}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card padding={false}>
            <Table columns={itemColumns} rows={order.items} getRowId={(row) => row.id} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              <Text variant="h3">Resumen</Text>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text variant="body" muted>Subtotal</Text>
                <Text variant="body">{formatPrice(order.subtotal)}</Text>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text variant="body" muted>Descuentos</Text>
                <Text variant="body">{formatPrice(order.discountTotal)}</Text>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text variant="body" muted>Total</Text>
                <Text variant="h3" sx={{ color: tokens.color.primary }}>
                  {formatPrice(order.total)}
                </Text>
              </Box>
              <Chip label={getPaymentMethodLabel(order.paymentMethod)} chipVariant="default" sx={{ alignSelf: 'flex-start' }} />
              <Text variant="small" muted>
                Envío: {order.shippingAddress}
              </Text>

              {isAdmin && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                  <Select
                    label="Estado de la orden"
                    options={statusOptions}
                    value={status || order.status}
                    onChange={(event) => setStatus(String(event.target.value))}
                  />
                  <Button
                    variant="outline"
                    disabled={updating}
                    onClick={() => void handleStatusUpdate()}
                  >
                    {updating ? 'Actualizando...' : 'Actualizar estado'}
                  </Button>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
                {canCancel && (
                  <Button variant="danger" disabled={cancelling} onClick={() => void handleCancel()}>
                    {cancelling ? 'Cancelando...' : 'Cancelar orden'}
                  </Button>
                )}
                <Button component={RouterLink} to={ROUTES.orderHistory} variant="ghost">
                  Volver al historial
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  );
}
