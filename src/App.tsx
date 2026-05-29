// 🔑 LEARNING: App.tsx — The root component, the "imperative shell" in our
// architecture (types & hooks are the pure "functional core").
//
// 💡 CONCEPT: Single screen — The whole experience now lives on one screen.
// SteakSetup handles picking doneness AND running the cook in-place, so App
// just wires up preferences, the toast container, and the Settings drawer.

import { useState } from 'react';
import { Toaster } from 'sonner';
import { Drawer } from 'vaul';
import { usePreferences } from './hooks/usePreferences';
import { useTheme } from './hooks/useTheme';
import { SteakSetup } from './components/steak/SteakSetup';
import { Settings } from './components/Settings';

export default function App() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const { preferences, updatePreferences } = usePreferences();
  useTheme(preferences.themeId);

  return (
    <>
      {/* Sonner toast container — sits at root so any screen can fire toasts */}
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            border: '1px solid var(--outline)',
            color: 'var(--body)',
          },
        }}
      />

      <SteakSetup onOpenSettings={() => setLeftDrawerOpen(true)} />

      {/* ── Left drawer: Title + Settings ────────────────────
          💡 CONCEPT: Left drawer keeps the cooking screen visible behind
          the overlay so context isn't lost while adjusting preferences.
          The DONERIGHT title lives here instead of on a home page. */}
      <Drawer.Root direction="left" open={leftDrawerOpen} onOpenChange={setLeftDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Drawer.Content
            className="fixed left-0 top-0 bottom-0 z-50 w-[82vw] max-w-xs flex flex-col border-r border-outline"
            style={{ background: 'var(--canvas)' }}
          >
            {/* Title block — editorial treatment from the old home screen */}
            <div className="px-pixel-4 pt-pixel-6 pb-pixel-4 border-b border-outline flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-pixel text-[8px] text-body-muted tracking-[0.15em]">PRECISION</span>
                <div className="h-px flex-1 bg-outline" />
                <span className="text-hi leading-none">◆</span>
              </div>
              <h1
                className="font-heading leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}
              >
                <span className="text-body">DONE</span><span className="text-hi">RIGHT</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-px flex-1 bg-outline" />
                <span className="font-pixel text-[8px] text-body-muted">COOKING TIMER</span>
              </div>
            </div>

            {/* Settings — scrollable, back button closes this drawer */}
            <div className="flex-1 overflow-y-auto pb-8">
              <Settings
                preferences={preferences}
                onUpdate={updatePreferences}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
