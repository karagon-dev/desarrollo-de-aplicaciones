export const fontFamily = {
  sans: '"Inter", "Segoe UI", Roboto, system-ui, sans-serif',
  display: '"Playfair Display", Georgia, serif',
} as const;

export const typographyScale = {
  display: { fontSize: '3rem', lineHeight: 1.15, fontWeight: 600 },
  h1: { fontSize: '2.25rem', lineHeight: 1.2, fontWeight: 600 },
  h2: { fontSize: '1.75rem', lineHeight: 1.25, fontWeight: 600 },
  h3: { fontSize: '1.25rem', lineHeight: 1.3, fontWeight: 600 },
  bodyLarge: { fontSize: '1.125rem', lineHeight: 1.6, fontWeight: 400 },
  body: { fontSize: '1rem', lineHeight: 1.6, fontWeight: 400 },
  small: { fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 400 },
  caption: { fontSize: '0.75rem', lineHeight: 1.4, fontWeight: 400 },
} as const;

export type TypographyVariant = keyof typeof typographyScale;
