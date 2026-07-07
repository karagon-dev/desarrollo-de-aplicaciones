import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeMode } from './applyTokens';
import { fontFamily } from '../tokens';

function cssVar(name: string): string {
  return `var(${name})`;
}

export function createSkamaTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: cssVar('--color-primary'),
        dark: cssVar('--color-primary-hover'),
        light: cssVar('--color-primary-soft'),
        contrastText: cssVar('--surface'),
      },
      secondary: {
        main: cssVar('--text-secondary'),
      },
      background: {
        default: cssVar('--background'),
        paper: cssVar('--surface'),
      },
      text: {
        primary: cssVar('--text-primary'),
        secondary: cssVar('--text-secondary'),
        disabled: cssVar('--muted'),
      },
      divider: cssVar('--border'),
      error: {
        main: cssVar('--danger'),
      },
      warning: {
        main: cssVar('--warning'),
      },
      success: {
        main: cssVar('--success'),
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
