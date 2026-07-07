export const spacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export type SpacingToken = keyof typeof spacingTokens;

export const spacingCssVarMap: Record<SpacingToken, string> = {
  xs: '--spacing-xs',
  sm: '--spacing-sm',
  md: '--spacing-md',
  lg: '--spacing-lg',
  xl: '--spacing-xl',
  '2xl': '--spacing-2xl',
  '3xl': '--spacing-3xl',
};
