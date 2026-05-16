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
import type { AppScreen, CookingPlan, CookingParams } from './types/cooking';
import { FOOD_PLUGINS } from './data/cooking-presets';
import { calculateCookingPlan } from './utils/cooking-calculator';
import { usePreferences } from './hooks/usePreferences';
import { PixelCard } from './components/ui/PixelCard';
import { PixelButton } from './components/ui/PixelButton';
import { SteakSetup } from './components/steak/SteakSetup';
import { SteakTimer } from './components/steak/SteakTimer';
import { EggSetup } from './components/egg/EggSetup';
import { EggTimer } from './components/egg/EggTimer';
import { Settings } from './components/Settings';

/**
 * App — Root component with screen management.
 *
 * 🔑 LEARNING: Screen state machine — The app has 4 screens:
 * 1. home → Choose food (steak or eggs)
 * 2. setup → Configure cooking parameters
 * 3. timer → Running timer with alerts
 * 4. settings → Unit preferences
 *
 * Each screen transition is explicit and type-safe. You can't accidentally
 * navigate to a "timer" screen without a cookingPlan being set.
 */
export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [cookingPlan, setCookingPlan] = useState<CookingPlan | null>(null);
  const { preferences, updatePreferences } = usePreferences();

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
  // SCREEN: Home
  // ─────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-stove-950 flex flex-col items-center justify-center p-pixel-4">
        {/* 🔑 LEARNING: App title with pixel art styling —
            The title uses our custom pixel font and warm gold color.
            The glow animation makes it feel alive, like a neon sign. */}
        <div className="mb-pixel-8 text-center">
          <h1 className="font-pixel text-lg text-gold-400 animate-glow mb-pixel-2">
            DONERIGHT
          </h1>
          <p className="font-pixel text-[8px] text-sear-400">
            COOKING TIMER
          </p>
        </div>

        {/* 🔑 LEARNING: Food selection grid — We map over FOOD_PLUGINS
            (the plugin registry) to dynamically render food cards.
            Adding a new food to the registry = automatically appears here. */}
        <div className="flex flex-col gap-pixel-4 w-full max-w-sm">
          {FOOD_PLUGINS.map((plugin) => (
            <PixelCard
              key={plugin.id}
              hoverable
              onClick={() => handleFoodSelect(plugin.id)}
            >
              <div className="flex items-center gap-pixel-4">
                <span className="text-4xl">{plugin.icon}</span>
                <div className="flex flex-col">
                  <span className="font-pixel text-sm text-gold-300">
                    {plugin.name}
                  </span>
                  <span className="font-pixel text-[8px] text-sear-400">
                    {plugin.description}
                  </span>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>

        {/* Settings button */}
        <div className="mt-pixel-8">
          <PixelButton
            variant="secondary"
            onClick={() => setScreen('settings')}
          >
            ⚙ SETTINGS
          </PixelButton>
        </div>

        {/* 🔑 LEARNING: Version footer — Small detail that shows this is
            a learning project. Also serves as a visual anchor at the bottom. */}
        <div className="mt-pixel-8 font-pixel text-[8px] text-sear-700">
          v0.1.0 — PWA Prototype
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // SCREEN: Setup
  // ─────────────────────────────────────────────────────────
  if (screen === 'setup') {
    // 🔑 LEARNING: Dynamic component selection — Instead of a giant
    // if/else, we pick the right setup component based on selectedFood.
    // This is the "factory" pattern — creating the right component for the job.
    if (selectedFood === 'steak') {
      return <SteakSetup onStart={handleCookingStart} onBack={handleBackFromSetup} />;
    }
    if (selectedFood === 'egg') {
      return <EggSetup onStart={handleCookingStart} onBack={handleBackFromSetup} />;
    }
    // Fallback — should never happen, but TypeScript wants it
    return <div>Unknown food</div>;
  }

  // ─────────────────────────────────────────────────────────
  // SCREEN: Timer
  // ─────────────────────────────────────────────────────────
  if (screen === 'timer' && cookingPlan) {
    // 🔑 LEARNING: Same factory pattern for timer components.
    // The cookingPlan has all the data needed — we just pick the right UI.
    if (cookingPlan.foodId === 'steak') {
      return <SteakTimer plan={cookingPlan} onDone={handleTimerDone} onBack={handleBackToHome} />;
    }
    if (cookingPlan.foodId === 'egg') {
      return <EggTimer plan={cookingPlan} onDone={handleTimerDone} onBack={handleBackToHome} />;
    }
  }

  // ─────────────────────────────────────────────────────────
  // SCREEN: Settings
  // ─────────────────────────────────────────────────────────
  if (screen === 'settings') {
    return (
      <Settings
        preferences={preferences}
        onUpdate={updatePreferences}
        onBack={() => setScreen('home')}
      />
    );
  }

  // Fallback — should never reach here
  return (
    <div className="min-h-screen bg-stove-950 flex items-center justify-center">
      <PixelButton onClick={handleBackToHome}>GO HOME</PixelButton>
    </div>
  );
}
