import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import type { ICreatePromotionRequest, IProductDto, IPromotionDto, IUpdatePromotionRequest } from '../../types';
import { Dialog } from '../dialogs';
import { Input, TextArea } from '../inputs';
import { Checkbox } from '../forms';
import { Button } from '../buttons';
import { tokens } from '../../utils';

export interface PromotionFormDialogProps {
  open: boolean;
  promotion?: IPromotionDto | null;
  products: IProductDto[];
  saving?: boolean;
  onClose: () => void;
  onSubmit: (
    data: ICreatePromotionRequest | IUpdatePromotionRequest,
    productIds: string[],
  ) => Promise<void>;
}

interface IFormState {
  name: string;
  description: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
}

const emptyForm: IFormState = {
  name: '',
  description: '',
  discountPercentage: '',
  startDate: '',
  endDate: '',
  isActive: true,
  productIds: [],
};

function toDateInputValue(value?: string): string {
  if (!value) {
    return '';
  }

  return value.slice(0, 10);
}

function mapPromotionToForm(promotion: IPromotionDto): IFormState {
  return {
    name: promotion.name,
    description: promotion.description ?? '',
    discountPercentage: String(promotion.discountPercentage),
    startDate: toDateInputValue(promotion.startDate),
    endDate: toDateInputValue(promotion.endDate),
    isActive: promotion.isActive,
    productIds: promotion.productIds ?? [],
  };
}

export function PromotionFormDialog({
  open,
  promotion,
  products,
  saving = false,
  onClose,
  onSubmit,
}: PromotionFormDialogProps) {
  const [form, setForm] = useState<IFormState>(emptyForm);
  const isEditing = Boolean(promotion);

  useEffect(() => {
    if (open) {
      setForm(promotion ? mapPromotionToForm(promotion) : emptyForm);
    }
  }, [open, promotion]);

  const selectedCount = form.productIds.length;
  const productOptions = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );

  function toggleProduct(productId: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      productIds: checked
        ? [...current.productIds, productId]
        : current.productIds.filter((id) => id !== productId),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      discountPercentage: Number(form.discountPercentage),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    if (isEditing) {
      await onSubmit({ ...payload, isActive: form.isActive } as IUpdatePromotionRequest, form.productIds);
      return;
    }

    await onSubmit(payload as ICreatePromotionRequest, form.productIds);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={isEditing ? 'Editar promoción' : 'Nueva promoción'}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="promotion-form" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      }
    >
      <Box
        id="promotion-form"
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md, pt: 1 }}
      >
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
        <Input
          label="Porcentaje de descuento"
          type="number"
          required
          value={form.discountPercentage}
          onChange={(event) =>
            setForm((current) => ({ ...current, discountPercentage: event.target.value }))
          }
          slotProps={{ htmlInput: { min: 0.01, max: 100, step: 0.01 } }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Input
            label="Fecha de inicio"
            type="date"
            required
            value={form.startDate}
            onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Input
            label="Fecha de fin"
            type="date"
            required
            value={form.endDate}
            onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
        {isEditing && (
          <Checkbox
            label="Promoción activa"
            checked={form.isActive}
            onChange={(event) =>
              setForm((current) => ({ ...current, isActive: event.target.checked }))
            }
          />
        )}
        <Box>
          <Box sx={{ mb: 1, color: tokens.color.textPrimary, fontWeight: 600 }}>
            Productos ({selectedCount})
          </Box>
          <Box
            sx={{
              maxHeight: 240,
              overflowY: 'auto',
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius.md,
              px: 1.5,
              py: 0.5,
            }}
          >
            {productOptions.length === 0 ? (
              <Box sx={{ py: 2, color: tokens.color.textSecondary }}>
                No hay productos activos para asignar.
              </Box>
            ) : (
              productOptions.map((product) => (
                <Checkbox
                  key={product.id}
                  label={`${product.name} (${product.categoryName})`}
                  checked={form.productIds.includes(product.id)}
                  onChange={(event) => toggleProduct(product.id, event.target.checked)}
                />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
