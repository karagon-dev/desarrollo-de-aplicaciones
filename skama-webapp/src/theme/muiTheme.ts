import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeMode } from './applyTokens';
import { darkColors, fontFamily, lightColors } from '../tokens';

function cssVar(name: string): string {
  return `var(${name})`;
}

export function createSkamaTheme(mode: ThemeMode): Theme {
  const colors = mode === 'light' ? lightColors : darkColors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.colorPrimary,
        dark: colors.colorPrimaryHover,
        light: colors.colorPrimarySoft,
        contrastText: colors.surface,
      },
      secondary: {
        main: colors.textSecondary,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        disabled: colors.muted,
      },
      divider: colors.border,
      error: {
        main: colors.danger,
      },
      warning: {
        main: colors.warning,
      },
      success: {
        main: colors.success,
      },
    },
    typography: {
      fontFamily: fontFamily.sans,
      h1: { fontFamily: fontFamily.display },
      h2: { fontFamily: fontFamily.display },
      h3: { fontFamily: fontFamily.display },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: cssVar('--background'),
            color: cssVar('--text-primary'),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: cssVar('--radius-md'),
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: cssVar('--radius-lg'),
            boxShadow: cssVar('--shadow-sm'),
            border: `1px solid ${cssVar('--border')}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: cssVar('--radius-md'),
            backgroundColor: cssVar('--color-surface'),
            color: cssVar('--color-input-text'),
            transition: 'color 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: cssVar('--color-border-subtle'),
              transition: 'border-color 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: cssVar('--color-border-strong'),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: cssVar('--color-input-focus'),
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              backgroundColor: cssVar('--color-surface-muted'),
              color: cssVar('--color-text-disabled'),
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: cssVar('--color-danger'),
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: cssVar('--color-border-subtle'),
            },
            '&.Mui-disabled .MuiOutlinedInput-input': {
              WebkitTextFillColor: cssVar('--color-text-disabled'),
            },
          },
          input: {
            color: cssVar('--color-input-text'),
            caretColor: cssVar('--color-input-focus'),
            WebkitTextFillColor: 'currentColor',
            '&::placeholder': {
              color: cssVar('--color-text-muted'),
              opacity: 0.72,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: cssVar('--color-text-secondary'),
            transition: 'color 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            '&.Mui-focused': {
              color: cssVar('--color-input-focus'),
            },
            '&.Mui-error': {
              color: cssVar('--color-danger'),
            },
            '&.Mui-disabled': {
              color: cssVar('--color-text-disabled'),
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: cssVar('--color-text-muted'),
            '&.Mui-error': {
              color: cssVar('--color-danger'),
            },
          },
        },
      },
    },
  });
}
