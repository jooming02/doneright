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
  BoiledDoneness,
  FriedDoneness,
} from '../types/cooking';

import {
  STEAK_TIMES,
  STEAK_TEMPS,
  STEAK_REST_SECONDS,
  STEAK_DONENESS_OPTIONS,
  BOILED_EGG_TIMES,
  FRIED_EGG_PARAMS,
  BOILED_DONENESS_OPTIONS,
  FRIED_DONENESS_OPTIONS,
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
// EGG CALCULATORS
// ─────────────────────────────────────────────────────────

/** Calculate the cooking plan for a boiled egg */
function calculateBoiledEggTime(doneness: BoiledDoneness): CookingPlan {
  const minutes = BOILED_EGG_TIMES[doneness];
  const seconds = Math.round(minutes * 60);

  const phases: CookingPhase[] = [
    {
      id: 'boil',
      label: 'Boiling',
      durationSeconds: seconds,
      type: 'cook',
    },
    {
      id: 'ice-bath',
      label: 'Ice Bath!',
      durationSeconds: 0,
      type: 'done',
      alertSound: 'done',
    },
  ];

  return {
    foodId: 'egg',
    foodName: 'Egg (Boiled)',
    doneness,
    donenessLabel: BOILED_DONENESS_OPTIONS.find((o) => o.id === doneness)?.label ?? doneness,
    phases,
    totalDurationSeconds: seconds,
  };
}

/** Calculate the cooking plan for a fried egg */
function calculateFriedEggTime(doneness: FriedDoneness): CookingPlan {
  const params = FRIED_EGG_PARAMS[doneness];
  const firstSideSeconds = Math.round(params.firstSideMin * 60);

  const phases: CookingPhase[] = [];

  // Phase 1: Cook first side
  phases.push({
    id: 'cook-first',
    label: 'Cook First Side',
    durationSeconds: firstSideSeconds,
    type: 'cook',
  });

  // 🔑 LEARNING: Conditional phases — Not all fried eggs get flipped.
  // Sunny-side-up has no flip phase. Over-easy/medium/hard do.
  // The CookingPhase array encodes this logic as data, not conditionals in the UI.
  if (params.secondSideMin !== null) {
    const secondSideSeconds = Math.round(params.secondSideMin * 60);

    phases.push({
      id: 'flip',
      label: 'FLIP!',
      durationSeconds: 3,
      type: 'flip',
      alertSound: 'flip',
    });

    phases.push({
      id: 'cook-second',
      label: 'Cook Second Side',
      durationSeconds: secondSideSeconds,
      type: 'cook',
    });
  }

  phases.push({
    id: 'serve',
    label: 'Done!',
    durationSeconds: 0,
    type: 'done',
    alertSound: 'done',
  });

  const totalDuration = phases.reduce((sum, p) => sum + p.durationSeconds, 0);

  return {
    foodId: 'egg',
    foodName: 'Egg (Fried)',
    doneness,
    donenessLabel: FRIED_DONENESS_OPTIONS.find((o) => o.id === doneness)?.label ?? doneness,
    phases,
    totalDurationSeconds: totalDuration,
  };
}

// ─────────────────────────────────────────────────────────
// GENERIC CALCULATOR (dispatches to food-specific ones)
// ─────────────────────────────────────────────────────────

/**
 * Main calculator — dispatches to the correct food calculator.
 *
 * 💡 CONCEPT: Dispatcher pattern — A single entry point that routes to
 * the correct implementation based on the food type. The caller doesn't
 * need to know which calculator to use; they just pass the params.
 */
export function calculateCookingPlan(params: CookingParams): CookingPlan {
  switch (params.food) {
    case 'steak':
      return calculateSteakTime(params.thickness, params.doneness);
    case 'egg':
      if (params.method === 'boiled') {
        return calculateBoiledEggTime(params.doneness as BoiledDoneness);
      }
      return calculateFriedEggTime(params.doneness as FriedDoneness);
    default:
      // 🔑 LEARNING: Exhaustive check — TypeScript's `never` type ensures
      // we handle all cases. If we add a new food and forget to add a case,
      // this will fail at compile time.
      const _exhaustive: never = params;
      return _exhaustive;
  }
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

/** Egg plugin implementation */
const eggPlugin: FoodPlugin = {
  id: 'egg',
  name: 'Eggs',
  icon: '🍳',
  description: 'Boiled & fried timer',
  getDonenessOptions: () => {
    // Eggs need method context, so we return both sets with labels
    return [
      ...BOILED_DONENESS_OPTIONS.map((o) => ({ ...o, label: `Boiled: ${o.label}` })),
      ...FRIED_DONENESS_OPTIONS.map((o) => ({ ...o, label: `Fried: ${o.label}` })),
    ];
  },
  calculateTime: (params) => {
    if (params.food !== 'egg') {
      throw new Error('Egg plugin received non-egg params');
    }
    return calculateCookingPlan(params);
  },
};

// 🔑 LEARNING: Plugin registration — Mutating an imported array is a simple
// form of the Registry pattern. More sophisticated apps would use a Map or
// a formal DI container, but for v0 this is fine.
FOOD_PLUGINS.push(steakPlugin, eggPlugin);

// Export for direct use if needed
export { steakPlugin, eggPlugin };

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
