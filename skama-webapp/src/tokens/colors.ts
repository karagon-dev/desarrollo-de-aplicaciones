export interface IColorTokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorPrimarySoft: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  danger: string;
  warning: string;
  success: string;
}

export const lightColors: IColorTokens = {
  colorPrimary: '#4EA65F',
  colorPrimaryHover: '#438F52',
  colorPrimarySoft: '#EAF6EC',
  background: '#F8FAF8',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F2',
  border: '#D8E3DA',
  textPrimary: '#1D2A20',
  textSecondary: '#5E6B60',
  muted: '#94A39A',
  danger: '#D9534F',
  warning: '#F0AD4E',
  success: '#4EA65F',
};

export const darkColors: IColorTokens = {
  colorPrimary: '#4EA65F',
  colorPrimaryHover: '#63B873',
  colorPrimarySoft: '#1D3422',
  background: '#111714',
  surface: '#18201B',
  surfaceSecondary: '#202A23',
  border: '#2F3A33',
  textPrimary: '#F4F8F4',
  textSecondary: '#B8C6BB',
  muted: '#7F9184',
  danger: '#E57373',
  warning: '#FFC857',
  success: '#4EA65F',
};

export const colorTokenKeys: (keyof IColorTokens)[] = [
  'colorPrimary',
  'colorPrimaryHover',
  'colorPrimarySoft',
  'background',
  'surface',
  'surfaceSecondary',
  'border',
  'textPrimary',
  'textSecondary',
  'muted',
  'danger',
  'warning',
  'success',
];

export const colorCssVarMap: Record<keyof IColorTokens, string> = {
  colorPrimary: '--color-primary',
  colorPrimaryHover: '--color-primary-hover',
  colorPrimarySoft: '--color-primary-soft',
  background: '--background',
  surface: '--surface',
  surfaceSecondary: '--surface-secondary',
  border: '--border',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  muted: '--muted',
  danger: '--danger',
  warning: '--warning',
  success: '--success',
};
