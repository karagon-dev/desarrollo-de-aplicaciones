import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getStoredThemeMode, applyThemeTokens } from './theme';
import './index.css';
import './styles/skama-tokens.css';
import './styles/skama-themes.css';
import './styles/skama-base.css';
import './styles/skama-components.css';
import './styles/skama-utilities.css';
import './styles/skama-pages.css';
import App from './App.tsx';

applyThemeTokens(getStoredThemeMode());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
