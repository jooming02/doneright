// 🔑 LEARNING: React entry point — This is where React takes over the DOM.
// The entry point does two things:
// 1. Mount the React app into the DOM (<div id="root">)
// 2. Register the PWA service worker for offline support

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// ─────────────────────────────────────────────────────────
// REACT APP MOUNT
// ─────────────────────────────────────────────────────────

// 🔑 LEARNING: createRoot — React 18's new rendering API.
// The old API was ReactDOM.render(<App />, root).
// The new API enables Concurrent Features (like useTransition, Suspense).
// createRoot creates a "root" container, and render() starts the React tree.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found — check index.html for <div id="root">');
}

ReactDOM.createRoot(rootElement).render(
  // 💡 CONCEPT: StrictMode — Development-only checks that warn about:
  // - Deprecated lifecycle methods
  // - Unexpected side effects
  // - Legacy context API
  // It renders components TWICE in dev to detect impure rendering.
  // In production, StrictMode does nothing (zero overhead).
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ─────────────────────────────────────────────────────────
// PWA SERVICE WORKER REGISTRATION
// ─────────────────────────────────────────────────────────

// 🔑 LEARNING: PWA registration — The service worker is a JavaScript file
// that runs in a separate thread from the main page. It can:
// - Intercept network requests (cache-first, network-first strategies)
// - Receive push notifications
// - Work offline
//
// vite-plugin-pwa auto-generates the SW and provides a registerSW() function.
// The 'autoUpdate' mode means: when a update is found, the new SW activates
// immediately and the page reloads. This is good for timer apps because
// users don't want to be prompted to update while cooking.
//
// 💡 CONCEPT: Dynamic import with type checking — We use a type assertion
// to tell TypeScript about the virtual module that vite-plugin-pwa creates.
// The actual file doesn't exist on disk — Vite generates it during build.
declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
  }
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

// Only register SW in production (not during dev with HMR)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // 🔑 LEARNING: Dynamic import — import() loads a module on demand.
  // We only load the PWA register module when we actually need it,
  // not at the top level. This keeps the initial bundle smaller.
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch((err) => {
      // Graceful degradation — if SW registration fails, the app still works.
      // It just won't have offline support.
      console.warn('PWA service worker registration failed:', err);
    });
}
