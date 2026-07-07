import type { LinkProps } from 'react-router-dom';
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type CustomButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'color' | 'size'> &
  CustomButtonProps &
  Partial<LinkProps>;

const sizeMap: Record<ButtonSize, MuiButtonProps['size']> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

function mapVariant(variant: ButtonVariant): {
  muiVariant: NonNullable<MuiButtonProps['variant']>;
  color: NonNullable<MuiButtonProps['color']>;
} {
  switch (variant) {
    case 'primary':
      return { muiVariant: 'contained', color: 'primary' };
    case 'secondary':
      return { muiVariant: 'contained', color: 'secondary' };
    case 'outline':
      return { muiVariant: 'outlined', color: 'primary' };
    case 'ghost':
      return { muiVariant: 'text', color: 'primary' };
    case 'danger':
      return { muiVariant: 'contained', color: 'error' };
    default:
      return { muiVariant: 'contained', color: 'primary' };
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const { muiVariant, color } = mapVariant(variant);

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={sizeMap[size]}
      {...(props as MuiButtonProps)}
    >
      {children}
    </MuiButton>
  );
}
