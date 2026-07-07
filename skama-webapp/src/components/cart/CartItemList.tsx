import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import type { ICartItemDto } from '../../types';
import { Input } from '../inputs';
import { tokens, formatPrice } from '../../utils';

interface ICartItemListProps {
  items: ICartItemDto[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  onRemove: (cartItemId: string) => Promise<void>;
  isUpdating?: boolean;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: ICartItemListProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: tokens.spacing.md,
            p: tokens.spacing.md,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: tokens.radius.md,
            backgroundColor: tokens.color.surfaceSecondary,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: tokens.color.textPrimary }}>
              {item.productName}
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.color.textSecondary }}>
              {formatPrice(item.unitPrice)} c/u
            </Typography>
            {!item.isActive && (
              <Typography variant="caption" sx={{ color: tokens.color.warning }}>
                Producto no disponible
              </Typography>
            )}
          </Box>

          <Input
            label="Cantidad"
            type="number"
            key={`${item.id}-${item.quantity}`}
            defaultValue={item.quantity}
            disabled={isUpdating}
            slotProps={{ htmlInput: { min: 1, max: item.stockQuantity } }}
            onBlur={(event) => {
              const quantity = Number(event.target.value);
              if (quantity >= 1 && quantity !== item.quantity) {
                void onUpdateQuantity(item.id, quantity);
              }
            }}
            sx={{ width: { xs: '100%', sm: 120 } }}
          />

          <Typography
            sx={{
              fontWeight: 700,
              color: tokens.color.primary,
              minWidth: 100,
              textAlign: { xs: 'left', sm: 'right' },
            }}
          >
            {formatPrice(item.subtotal)}
          </Typography>

          <IconButton
            aria-label={`Eliminar ${item.productName}`}
            onClick={() => void onRemove(item.id)}
            disabled={isUpdating}
            sx={{ color: tokens.color.danger, alignSelf: { xs: 'flex-end', sm: 'center' } }}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
