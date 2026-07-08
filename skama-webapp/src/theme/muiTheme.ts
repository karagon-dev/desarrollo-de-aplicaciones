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
          },
        },
      },
    },
  });
}
