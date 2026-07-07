import Typography, { type TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { tokens } from '../../utils';
import { typographyScale, type TypographyVariant } from '../../tokens';

export interface SectionTitleProps extends Omit<TypographyProps, 'variant'> {
  title: string;
  subtitle?: string;
  variant?: TypographyVariant;
  align?: 'left' | 'center' | 'right';
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

export function SectionTitle({
  title,
  subtitle,
  variant = 'h2',
  align = 'left',
  ...props
}: SectionTitleProps) {
  const scale = typographyScale[variant];

  return (
    <Box sx={{ mb: tokens.spacing.lg, textAlign: align }}>
      <Typography
        component={variantComponentMap[variant]}
        sx={{
          ...scale,
          color: tokens.color.textPrimary,
          fontFamily: variant.startsWith('h') || variant === 'display'
            ? 'var(--font-display, "Playfair Display", Georgia, serif)'
            : 'inherit',
        }}
        {...props}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{ color: tokens.color.textSecondary, mt: tokens.spacing.sm }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
