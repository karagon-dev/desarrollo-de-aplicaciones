import { useEffect, useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import type { ICreateProductRequest, IProductDto, IUpdateProductRequest } from '../../types';
import { Dialog } from '../dialogs';
import { Input, TextArea, Select } from '../inputs';
import { Checkbox } from '../forms';
import { Button } from '../buttons';
import { useCategories } from '../../hooks';
import { tokens } from '../../utils';

export interface ProductFormDialogProps {
  open: boolean;
  product?: IProductDto | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateProductRequest | IUpdateProductRequest) => Promise<void>;
}

interface IFormState {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  minimumStock: string;
  isActive: boolean;
}

const emptyForm: IFormState = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  stockQuantity: '0',
  minimumStock: '0',
  isActive: true,
};

function mapProductToForm(product: IProductDto): IFormState {
  return {
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    minimumStock: String(product.minimumStock),
    isActive: product.isActive,
  };
}

export function ProductFormDialog({
  open,
  product,
  saving = false,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const { categories } = useCategories();
  const [form, setForm] = useState<IFormState>(emptyForm);
  const isEditing = Boolean(product);

  useEffect(() => {
    if (open) {
      setForm(product ? mapProductToForm(product) : emptyForm);
    }
  }, [open, product]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      minimumStock: Number(form.minimumStock),
    };

    if (isEditing && product) {
      await onSubmit({ ...payload, isActive: form.isActive } as IUpdateProductRequest);
    } else {
      await onSubmit(payload as ICreateProductRequest);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar producto' : 'Nuevo producto'}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="product-form" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      }
    >
      <Box
        id="product-form"
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md, pt: 1 }}
      >
        <Select
          label="Categoría"
          options={categoryOptions}
          value={form.categoryId}
          required
          onChange={(event) =>
            setForm((current) => ({ ...current, categoryId: String(event.target.value) }))
          }
        />
        <Input
          label="Nombre"
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <TextArea
          label="Descripción"
          rows={3}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Input
              label="Precio"
              type="number"
              required
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Input
              label="Stock"
              type="number"
              required
              value={form.stockQuantity}
              onChange={(event) =>
                setForm((current) => ({ ...current, stockQuantity: event.target.value }))
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Input
              label="Stock mínimo"
              type="number"
              required
              value={form.minimumStock}
              onChange={(event) =>
                setForm((current) => ({ ...current, minimumStock: event.target.value }))
              }
            />
          </Grid>
        </Grid>
        {isEditing && (
          <Checkbox
            label="Producto activo"
            checked={form.isActive}
            onChange={(event) =>
              setForm((current) => ({ ...current, isActive: event.target.checked }))
            }
          />
        )}
      </Box>
    </Dialog>
  );
}
