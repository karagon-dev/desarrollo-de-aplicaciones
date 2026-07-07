import Typography, { type TypographyProps } from '@mui/material/Typography';
import { tokens } from '../../utils';
import { typographyScale, type TypographyVariant } from '../../tokens';

export interface TextProps extends Omit<TypographyProps, 'variant'> {
  variant?: TypographyVariant;
  muted?: boolean;
}

const variantComponentMap: Record<TypographyVariant, TypographyProps['component']> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  bodyLarge: 'p',
  body: 'p',
  small: 'p',
  caption: 'span',
};

export function Text({
  variant = 'body',
  muted = false,
  children,
  sx,
  ...props
}: TextProps) {
  const scale = typographyScale[variant];

  return (
    <Typography
      component={variantComponentMap[variant]}
      sx={{
        ...scale,
        color: muted ? tokens.color.muted : tokens.color.textPrimary,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
