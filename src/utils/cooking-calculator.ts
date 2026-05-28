// 🔑 LEARNING: Pure functions for business logic — This file contains ONLY
// pure functions (same input → same output, no side effects). This makes them:
// 1. Easy to unit test (just call with args, assert result)
// 2. Easy to reason about (no hidden state mutations)
// 3. Composable (output of one = input of another)
// This is the "functional core" of our "functional core, imperative shell" architecture.

import type {
  CookingPlan,
  CookingPhase,
  CookingParams,
  FoodPlugin,
  SteakDoneness,
  SteakThickness,
} from '../types/cooking';

import {
  STEAK_TIMES,
  STEAK_TEMPS,
  STEAK_REST_SECONDS,
  STEAK_DONENESS_OPTIONS,
  FOOD_PLUGINS,
} from '../data/cooking-presets';

// ─────────────────────────────────────────────────────────
// STEAK CALCULATOR
// ─────────────────────────────────────────────────────────

/**
 * Calculate the full cooking plan for a steak.
 *
 * 💡 CONCEPT: Phased cooking plan — A steak has 3 phases:
 * 1. Cook first side
 * 2. Flip and cook second side
 * 3. Rest (carryover cooking continues)
 *
 * Each phase has a duration, label, and optional alert sound.
 * The timer component advances through phases sequentially.
 */
function calculateSteakTime(thickness: SteakThickness, doneness: SteakDoneness): CookingPlan {
  const minutesPerSide = STEAK_TIMES[thickness][doneness];
  const secondsPerSide = Math.round(minutesPerSide * 60);

  // 🔑 LEARNING: Building phases as an array of objects.
  // This is the "command pattern" — each phase is a command that the
  // timer executes sequentially. The timer doesn't know about steak;
  // it just knows about phases.
  const phases: CookingPhase[] = [
    {
      id: 'cook-side-1',
      label: 'Cook Side 1',
      durationSeconds: secondsPerSide,
      type: 'cook',
    },
    {
      id: 'flip',
      label: 'FLIP!',
      durationSeconds: 3, // 3 seconds to flip — just enough time to see the alert
      type: 'flip',
      alertSound: 'flip',
    },
    {
      id: 'cook-side-2',
      label: 'Cook Side 2',
      durationSeconds: secondsPerSide,
      type: 'cook',
    },
    {
      id: 'rest',
      label: 'Rest',
      durationSeconds: STEAK_REST_SECONDS,
      type: 'rest',
      alertSound: 'done',
    },
    {
      id: 'serve',
      label: 'Serve!',
      durationSeconds: 0,
      type: 'done',
      alertSound: 'rest-done',
    },
  ];

  const totalDuration = phases.reduce((sum, p) => sum + p.durationSeconds, 0);

  return {
    foodId: 'steak',
    foodName: 'Steak',
    doneness,
    donenessLabel: STEAK_DONENESS_OPTIONS.find((o) => o.id === doneness)?.label ?? doneness,
    phases,
    internalTemp: STEAK_TEMPS[doneness],
    totalDurationSeconds: totalDuration,
  };
}

// ─────────────────────────────────────────────────────────
// GENERIC CALCULATOR
// ─────────────────────────────────────────────────────────

/** Main calculator — currently steak only */
export function calculateCookingPlan(params: CookingParams): CookingPlan {
  return calculateSteakTime(params.thickness, params.doneness);
}

// ─────────────────────────────────────────────────────────
// FOOD PLUGIN IMPLEMENTATIONS
// 🔑 LEARNING: Strategy Pattern — Each food is a "strategy" that implements
// the FoodPlugin interface. The app doesn't care about the internals; it just
// calls getDonenessOptions() and calculateTime() on whatever plugin is selected.
// This is polymorphism without inheritance (using interfaces instead of classes).
// ─────────────────────────────────────────────────────────

/** Steak plugin implementation */
const steakPlugin: FoodPlugin = {
  id: 'steak',
  name: 'Steak',
  icon: '🥩',
  description: 'Pan-sear timer',
  getDonenessOptions: () => STEAK_DONENESS_OPTIONS,
  calculateTime: (params) => {
    if (params.food !== 'steak') {
      throw new Error('Steak plugin received non-steak params');
    }
    return calculateSteakTime(params.thickness, params.doneness);
  },
};

FOOD_PLUGINS.push(steakPlugin);

export { steakPlugin };

// ─────────────────────────────────────────────────────────
// UTILITY: Format seconds → MM:SS
// ─────────────────────────────────────────────────────────

/** Format seconds into MM:SS display string */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────
// UTILITY: Format temperature with unit
// ─────────────────────────────────────────────────────────

/** Format a temperature value with unit suffix */
export function formatTemp(fahrenheit: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'celsius') {
    const celsius = Math.round((fahrenheit - 32) * 5 / 9);
    return `${celsius}°C`;
  }
  return `${fahrenheit}°F`;
}
