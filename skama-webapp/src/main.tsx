import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getStoredThemeMode, applyThemeTokens } from './theme';
import './index.css';
import App from './App.tsx';

applyThemeTokens(getStoredThemeMode());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
