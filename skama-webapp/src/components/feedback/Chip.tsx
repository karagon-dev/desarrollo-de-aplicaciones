import MuiChip, { type ChipProps as MuiChipProps } from '@mui/material/Chip';
import { tokens } from '../../utils';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface ChipProps extends Omit<MuiChipProps, 'color' | 'variant'> {
  chipVariant?: ChipVariant;
}

const variantStyles: Record<ChipVariant, { bg: string; color: string }> = {
  default: { bg: tokens.color.surfaceSecondary, color: tokens.color.textSecondary },
  primary: { bg: tokens.color.primarySoft, color: tokens.color.primary },
  success: { bg: tokens.color.primarySoft, color: tokens.color.success },
  warning: { bg: tokens.color.surfaceSecondary, color: tokens.color.warning },
  danger: { bg: tokens.color.surfaceSecondary, color: tokens.color.danger },
};

export function Chip({ chipVariant = 'default', sx, ...props }: ChipProps) {
  const styles = variantStyles[chipVariant];

  return (
    <MuiChip
      sx={{
        backgroundColor: styles.bg,
        color: styles.color,
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    />
  );
}
