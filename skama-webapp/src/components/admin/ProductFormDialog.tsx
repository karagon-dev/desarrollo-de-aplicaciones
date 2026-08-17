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
import { DEFAULT_MINIMUM_STOCK } from '../../constants/inventory';

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
  isLimitedEdition: boolean;
  isActive: boolean;
}

const jewelryCategoryNames = ['plata', 'plata verde', 'oro'];

const emptyForm: IFormState = {
  categoryId: '',
  name: '',
  description: '',
  price: '',
  stockQuantity: '0',
  isLimitedEdition: false,
  isActive: true,
};

function mapProductToForm(product: IProductDto): IFormState {
  return {
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    isLimitedEdition: product.isLimitedEdition,
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

  const materialCategories = categories.filter((category) =>
    jewelryCategoryNames.includes(category.name.trim().toLowerCase()),
  );
  const availableCategories = materialCategories.length > 0 ? materialCategories : categories;
  const categoryOptions = availableCategories.map((category) => ({
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
      minimumStock: DEFAULT_MINIMUM_STOCK,
    };

    if (isEditing && product) {
      await onSubmit({ ...payload, isActive: form.isActive } as IUpdateProductRequest);
    } else {
      await onSubmit({ ...payload, isLimitedEdition: form.isLimitedEdition } as ICreateProductRequest);
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
          label="Categoría de material"
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Precio"
              type="number"
              required
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Input
              label="Inventario"
              type="number"
              required
              value={form.stockQuantity}
              onChange={(event) =>
                setForm((current) => ({ ...current, stockQuantity: event.target.value }))
              }
            />
          </Grid>
        </Grid>
        {!isEditing && (
          <Checkbox
            label="Edición limitada"
            checked={form.isLimitedEdition}
            onChange={(event) =>
              setForm((current) => ({ ...current, isLimitedEdition: event.target.checked }))
            }
          />
        )}
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
