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
  colorPrimary: '#D6B76A',
  colorPrimaryHover: '#E8D299',
  colorPrimarySoft: '#173B33',
  background: '#09241F',
  surface: '#0F352F',
  surfaceSecondary: '#123D34',
  border: '#2D5148',
  textPrimary: '#FDFBF7',
  textSecondary: '#D8D2C6',
  muted: '#AFA79A',
  danger: '#D78A96',
  warning: '#E0B068',
  success: '#7FC9AD',
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
