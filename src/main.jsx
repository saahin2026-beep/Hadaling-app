import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import AppShell from './components/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './utils/DataContext';
import { initObservability } from './utils/observability';
import './index.css';

initObservability();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell>
        <ErrorBoundary>
          <DataProvider>
            <App />
            <Analytics />
            <SpeedInsights />
          </DataProvider>
        </ErrorBoundary>
      </AppShell>
    </BrowserRouter>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
