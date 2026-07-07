import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { PageShell } from '../../components/layouts/PageShell';
import { Card } from '../../components/cards';
import { Button } from '../../components/buttons';
import { Table, type TableColumn } from '../../components/tables';
import { Chip } from '../../components/feedback';
import { SearchBar } from '../../components/inputs';
import { Dialog } from '../../components/dialogs';
import { ProductFormDialog } from '../../components/admin/ProductFormDialog';
import { ProductImagesDialog } from '../../components/admin/ProductImagesDialog';
import { Loading, ErrorState } from '../../components/feedback';
import { useDebouncedValue, useProducts } from '../../hooks';
import { productService } from '../../services';
import type { ICreateProductRequest, IProductDto, IUpdateProductRequest } from '../../types';
import { formatPrice, getApiErrorMessage } from '../../utils';
import { ROUTES } from '../../routes/routePaths';

export function ProductManagementPage() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProductDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IProductDto | null>(null);
  const [imagesProduct, setImagesProduct] = useState<IProductDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebouncedValue(search);
  const filters = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      includeInactive: true,
    }),
    [debouncedSearch],
  );

  const { products, loading, error, refetch } = useProducts(filters);

  const columns: TableColumn<IProductDto>[] = useMemo(
    () => [
      { id: 'name', label: 'Producto', accessor: 'name' },
      { id: 'category', label: 'Categoría', accessor: 'categoryName' },
      {
        id: 'price',
        label: 'Precio',
        align: 'right',
        render: (row) => formatPrice(row.price),
      },
      { id: 'stock', label: 'Stock', accessor: 'stockQuantity', align: 'center' },
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
      {
        id: 'actions',
        label: 'Acciones',
        align: 'right',
        render: (row) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton
              size="small"
              aria-label={`Editar ${row.name}`}
              onClick={() => {
                setEditingProduct(row);
                setDialogOpen(true);
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label={`Imágenes de ${row.name}`}
              onClick={() => setImagesProduct(row)}
            >
              <ImageOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label={`Eliminar ${row.name}`}
              onClick={() => setDeleteTarget(row)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [],
  );

  function openCreateDialog() {
    setEditingProduct(null);
    setDialogOpen(true);
  }

  async function handleSave(data: ICreateProductRequest | IUpdateProductRequest) {
    setSaving(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data as IUpdateProductRequest);
        toast.success('Producto actualizado.');
      } else {
        await productService.create(data as ICreateProductRequest);
        toast.success('Producto creado.');
      }
      setDialogOpen(false);
      setEditingProduct(null);
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo guardar el producto.'));
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      toast.success('Producto eliminado.');
      setDeleteTarget(null);
      await refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo eliminar el producto.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageShell
      title="Gestión de productos"
      subtitle="Administra el catálogo de joyería"
      breadcrumbs={[
        { label: 'Admin', path: ROUTES.admin.dashboard },
        { label: 'Productos' },
      ]}
    >
      <Card>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
          <SearchBar
            placeholder="Buscar productos..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ maxWidth: 400, flex: 1 }}
          />
          <Button onClick={openCreateDialog}>Nuevo producto</Button>
        </Box>

        {loading ? (
          <Loading message="Cargando productos..." />
        ) : error ? (
          <ErrorState description={error} onRetry={() => void refetch()} />
        ) : (
          <Table columns={columns} rows={products} getRowId={(row) => row.id} />
        )}
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        product={editingProduct}
        saving={saving}
        onClose={() => {
          setDialogOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSave}
      />

      <ProductImagesDialog
        open={Boolean(imagesProduct)}
        product={imagesProduct}
        onClose={() => setImagesProduct(null)}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar producto"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => void handleDelete()} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </>
        }
      >
        ¿Deseas eliminar <strong>{deleteTarget?.name}</strong>? Esta acción desactiva el producto.
      </Dialog>
    </PageShell>
  );
}
