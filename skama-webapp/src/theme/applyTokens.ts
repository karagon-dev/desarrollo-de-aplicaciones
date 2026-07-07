import {
  colorCssVarMap,
  darkColors,
  lightColors,
  radiusCssVarMap,
  radiusTokens,
  shadowCssVarMap,
  shadowTokens,
  spacingCssVarMap,
  spacingTokens,
  type IColorTokens,
} from '../tokens';

export type ThemeMode = 'light' | 'dark';

function applyColorTokens(colors: IColorTokens, root: HTMLElement): void {
  (Object.keys(colorCssVarMap) as (keyof IColorTokens)[]).forEach((key) => {
    root.style.setProperty(colorCssVarMap[key], colors[key]);
  });
}

function applyStaticTokens(root: HTMLElement): void {
  (Object.keys(spacingTokens) as (keyof typeof spacingTokens)[]).forEach(
    (key) => {
      root.style.setProperty(spacingCssVarMap[key], spacingTokens[key]);
    },
  );

  (Object.keys(radiusTokens) as (keyof typeof radiusTokens)[]).forEach(
    (key) => {
      root.style.setProperty(radiusCssVarMap[key], radiusTokens[key]);
    },
  );

  (Object.keys(shadowTokens) as (keyof typeof shadowTokens)[]).forEach(
    (key) => {
      root.style.setProperty(shadowCssVarMap[key], shadowTokens[key]);
    },
  );
}

export function applyThemeTokens(mode: ThemeMode): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  applyColorTokens(mode === 'light' ? lightColors : darkColors, root);
  applyStaticTokens(root);
}

export function getStoredThemeMode(): ThemeMode {
  const stored = localStorage.getItem('skama-theme-mode');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function storeThemeMode(mode: ThemeMode): void {
  localStorage.setItem('skama-theme-mode', mode);
}
