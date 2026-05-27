// 🔑 LEARNING: App.tsx — The root component that manages app-level state
// and screen routing. This is the "imperative shell" in our architecture:
// - Types & hooks are the "functional core" (pure, testable)
// - App.tsx is the "imperative shell" (stateful, side-effectful, orchestrating)
//
// 💡 CONCEPT: Simple screen routing — For v0, we don't need React Router.
// We use a discriminated union (AppScreen type) and conditional rendering.
// This avoids the complexity of a router while still being type-safe.
// When you need URL-based routing later, swap in React Router.

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { AppScreen, CookingPlan, CookingParams } from './types/cooking';
import { FOOD_PLUGINS } from './data/cooking-presets';
import { calculateCookingPlan } from './utils/cooking-calculator';
import { usePreferences } from './hooks/usePreferences';
import { useTheme } from './hooks/useTheme';
import { PixelButton } from './components/ui/PixelButton';
import { SteakSetup } from './components/steak/SteakSetup';
import { SteakTimer } from './components/steak/SteakTimer';
import { EggSetup } from './components/egg/EggSetup';
import { EggTimer } from './components/egg/EggTimer';
import { Settings } from './components/Settings';

// Shared transition config for all screen changes.
// Defined once here so all screens get identical enter/exit behaviour.
const SCREEN_TRANSITION = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * App — Root component with screen management.
 *
 * 🔑 LEARNING: Screen state machine — The app has 4 screens:
 * 1. home     → Choose food (steak or eggs)
 * 2. setup    → Configure cooking parameters
 * 3. timer    → Running timer with alerts
 * 4. settings → Unit preferences + theme picker
 *
 * Each screen transition is explicit and type-safe. You can't accidentally
 * navigate to a "timer" screen without a cookingPlan being set.
 */
export default function App() {
  const [screen, setScreen]             = useState<AppScreen>('home');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [cookingPlan, setCookingPlan]   = useState<CookingPlan | null>(null);
  const { preferences, updatePreferences } = usePreferences();
  useTheme(preferences.themeId);

  // 🔑 LEARNING: Navigation handlers — Each handler encapsulates a screen
  // transition. Using useCallback prevents unnecessary re-renders of child
  // components that receive these handlers as props.
  const handleFoodSelect = useCallback((foodId: string) => {
    setSelectedFood(foodId);
    setScreen('setup');
  }, []);

  const handleCookingStart = useCallback((params: CookingParams) => {
    const plan = calculateCookingPlan(params);
    setCookingPlan(plan);
    setScreen('timer');
  }, []);

  const handleTimerDone = useCallback(() => {
    setCookingPlan(null);
    setSelectedFood(null);
    setScreen('home');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCookingPlan(null);
    setSelectedFood(null);
    setScreen('home');
  }, []);

  const handleBackFromSetup = useCallback(() => {
    setSelectedFood(null);
    setScreen('home');
  }, []);

  // ─────────────────────────────────────────────────────────
  // Compute current screen content
  // 💡 CONCEPT: Single-return with AnimatePresence — We switched from
  // multiple early returns to a single return so AnimatePresence can
  // detect when content changes and play exit + enter animations.
  // The `key={screen}` tells Motion "this is a different screen" whenever
  // the screen state changes, triggering the exit/enter transition.
  // ─────────────────────────────────────────────────────────
  let content: React.ReactNode = null;

  // ─── SCREEN: Home ────────────────────────────────────────
  if (screen === 'home') {
    content = (
      <div className="flex flex-col min-h-screen px-pixel-4 pt-pixel-6 pb-pixel-6 max-w-sm mx-auto">

        {/* ── Title block — editorial left-aligned treatment ──
            🔑 LEARNING: clamp() for fluid typography — font-size responds
            to the viewport width without needing breakpoints. The three values
            are: minimum, preferred (viewport-relative), maximum. */}
        <div className="animate-fade-up mb-pixel-4">
          {/* Decorative rule above title */}
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[8px] text-body-muted tracking-[0.15em]">PRECISION</span>
            <div className="h-px flex-1 bg-outline" />
            <span className="text-hi leading-none">◆</span>
          </div>

          {/* Main title — DONE in body color, RIGHT in accent color.
              This typographic split is the "one unforgettable thing." */}
          <h1
            className="font-heading leading-none tracking-tight animate-glow"
            style={{ fontSize: 'clamp(3rem, 14vw, 4.5rem)' }}
          >
            <span className="text-body">DONE</span><span className="text-hi">RIGHT</span>
          </h1>

          {/* Decorative rule below title */}
          <div className="flex items-center gap-3 mt-2">
            <div className="h-px flex-1 bg-outline" />
            <span className="font-pixel text-[8px] text-body-muted">COOKING TIMER</span>
          </div>
        </div>

        {/* ── Food selection — separate bordered cards, same style as method picker ── */}
        <div className="flex flex-col gap-pixel-3">
          {FOOD_PLUGINS.map((plugin, i) => (
            <button
              key={plugin.id}
              onClick={() => handleFoodSelect(plugin.id)}
              className="
                flex items-center gap-pixel-4 px-pixel-4 py-pixel-4
                border border-solid border-outline rounded-lg
                bg-surface hover:border-hi hover:bg-panel
                transition-all duration-150 animate-fade-up text-left
              "
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              <span className="text-4xl">{plugin.icon}</span>
              <div>
                <div className="font-heading text-xl text-hi">{plugin.name}</div>
                <div className="font-pixel text-[8px] text-body-muted mt-1">{plugin.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Footer row — settings left, version right ── */}
        <div
          className="mt-auto pt-pixel-4 flex items-center justify-between animate-fade-up"
          style={{ animationDelay: '380ms' }}
        >
          <PixelButton variant="secondary" onClick={() => setScreen('settings')}>
            ⚙ SETTINGS
          </PixelButton>
          <span className="font-pixel text-[8px] text-body-muted">v0.1.0</span>
        </div>
      </div>
    );

  // ─── SCREEN: Setup ───────────────────────────────────────
  } else if (screen === 'setup') {
    // 🔑 LEARNING: Dynamic component selection — Instead of a giant
    // if/else, we pick the right setup component based on selectedFood.
    // This is the "factory" pattern — creating the right component for the job.
    if (selectedFood === 'steak') {
      content = <SteakSetup onStart={handleCookingStart} onBack={handleBackFromSetup} />;
    } else if (selectedFood === 'egg') {
      content = <EggSetup onStart={handleCookingStart} onBack={handleBackFromSetup} />;
    }

  // ─── SCREEN: Timer ───────────────────────────────────────
  } else if (screen === 'timer' && cookingPlan) {
    // 🔑 LEARNING: Same factory pattern for timer components.
    // The cookingPlan has all the data needed — we just pick the right UI.
    if (cookingPlan.foodId === 'steak') {
      content = <SteakTimer plan={cookingPlan} onDone={handleTimerDone} onBack={handleBackToHome} />;
    } else if (cookingPlan.foodId === 'egg') {
      content = <EggTimer plan={cookingPlan} onDone={handleTimerDone} onBack={handleBackToHome} />;
    }

  // ─── SCREEN: Settings ────────────────────────────────────
  } else if (screen === 'settings') {
    content = (
      <Settings
        preferences={preferences}
        onUpdate={updatePreferences}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={screen} {...SCREEN_TRANSITION}>
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
