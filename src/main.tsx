import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { APIProvider } from '@vis.gl/react-google-maps';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/ThemeToggle';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="voyage-theme">
      <APIProvider apiKey={API_KEY} version="weekly">
        <App />
      </APIProvider>
    </ThemeProvider>
  </StrictMode>,
);
