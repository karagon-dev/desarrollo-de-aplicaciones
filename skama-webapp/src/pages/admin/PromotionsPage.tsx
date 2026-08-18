import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Button } from '../../components/buttons';
import { Table, type TableColumn } from '../../components/tables';
import { Chip } from '../../components/feedback';
import { SearchBar } from '../../components/inputs';
import { PromotionFormDialog } from '../../components/admin/PromotionFormDialog';
import { Loading, ErrorState } from '../../components/feedback';
import { useDebouncedValue, useProducts, usePromotions } from '../../hooks';
import { promotionService } from '../../services';
import type {
  ICreatePromotionRequest,
  IPromotionDto,
  IUpdatePromotionRequest,
} from '../../types';
import { getApiErrorMessage } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

function toDateKey(value: string): string {
  return value.slice(0, 10);
}

function formatDate(value: string): string {
  const [year, month, day] = toDateKey(value).split('-').map(Number);
  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString('es-CR', {
    dateStyle: 'medium',
  });
}

function getPromotionStatus(promotion: IPromotionDto): { label: string; variant: 'success' | 'warning' | 'default' } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${toDateKey(promotion.startDate)}T00:00:00`);
  const end = new Date(`${toDateKey(promotion.endDate)}T00:00:00`);

  if (!promotion.isActive) {
    return { label: 'Inactiva', variant: 'default' };
  }

  if (today < start) {
    return { label: 'Programada', variant: 'warning' };
  }

  if (today > end) {
    return { label: 'Vencida', variant: 'default' };
  }

  return { label: 'Vigente', variant: 'success' };
}

async function syncPromotionProducts(promotionId: string, nextProductIds: string[], currentProductIds: string[]) {
  const current = new Set(currentProductIds);
  const next = new Set(nextProductIds);
  const toAdd = nextProductIds.filter((id) => !current.has(id));
  const toRemove = currentProductIds.filter((id) => !next.has(id));

  await Promise.all([
    ...toAdd.map((productId) => promotionService.assignProduct(promotionId, productId)),
    ...toRemove.map((productId) => promotionService.removeProduct(promotionId, productId)),
  ]);
}

export function PromotionsPage() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<IPromotionDto | null>(null);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebouncedValue(search);
  const { promotions, loading, error, refetch } = usePromotions();
  const { products } = useProducts({ includeInactive: false, includeUnavailable: true });

  const filteredPromotions = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) {
      return promotions;
    }

    return promotions.filter((promotion) =>
      `${promotion.name} ${promotion.description ?? ''}`.toLowerCase().includes(query),
    );
  }, [debouncedSearch, promotions]);

  const columns: TableColumn<IPromotionDto>[] = useMemo(
    () => [
      { id: 'name', label: 'Promoción', accessor: 'name' },
      {
        id: 'discount',
        label: 'Descuento',
        align: 'right',
        render: (row) => `-${row.discountPercentage}%`,
      },
      {
        id: 'dates',
        label: 'Vigencia',
        render: (row) => `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,
      },
      {
        id: 'products',
        label: 'Productos',
        align: 'center',
        render: (row) => row.productIds?.length ?? 0,
      },
      {
        id: 'status',
        label: 'Estado',
        render: (row) => {
          const status = getPromotionStatus(row);
          return <Chip label={status.label} chipVariant={status.variant} size="small" />;
        },
      },
      {
        id: 'actions',
        label: 'Acciones',
        align: 'right',
        render: (row) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              size="small"
              aria-label={`Editar ${row.name}`}
              onClick={() => {
                setEditingPromotion(row);
                setDialogOpen(true);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [],
  );

  function openCreateDialog() {
    setEditingPromotion(null);
    setDialogOpen(true);
  }

  async function handleSave(
    data: ICreatePromotionRequest | IUpdatePromotionRequest,
    productIds: string[],
  ) {
    setSaving(true);
    try {
      if (editingPromotion) {
        await promotionService.update(editingPromotion.id, data as IUpdatePromotionRequest);
        await syncPromotionProducts(editingPromotion.id, productIds, editingPromotion.productIds ?? []);
        toast.success('Promoción actualizada.');
      } else {
        const { data: created } = await promotionService.create(data as ICreatePromotionRequest);
        await syncPromotionProducts(created.id, productIds, []);
        toast.success('Promoción creada. El precio rebajado se muestra en el catálogo y el carrito.');
      }

      setDialogOpen(false);
      setEditingPromotion(null);
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo guardar la promoción.'));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      title="Gestión de promociones"
      subtitle="Crea descuentos por producto. El precio rebajado se aplica automáticamente en el catálogo y el carrito."
      breadcrumbs={[
        { label: 'Administración', path: ROUTES.admin.dashboard },
        { label: 'Promociones' },
      ]}
    >
      <Card>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
          <SearchBar
            placeholder="Buscar promociones..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ maxWidth: 400, flex: 1 }}
          />
          <Button onClick={openCreateDialog}>Nueva promoción</Button>
        </Box>

        {loading ? (
          <Loading message="Cargando promociones..." />
        ) : error ? (
          <ErrorState description={error} onRetry={() => void refetch()} />
        ) : (
          <Table columns={columns} rows={filteredPromotions} getRowId={(row) => row.id} />
        )}
      </Card>

      <PromotionFormDialog
        open={dialogOpen}
        promotion={editingPromotion}
        products={products}
        saving={saving}
        onClose={() => {
          setDialogOpen(false);
          setEditingPromotion(null);
        }}
        onSubmit={handleSave}
      />
    </PageShell>
  );
}
