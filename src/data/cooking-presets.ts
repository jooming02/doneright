// 🔑 LEARNING: Data module pattern — Separating data from logic is a
// fundamental software design principle called "Separation of Concerns".
// This file contains ONLY data constants. The cooking-calculator.ts contains
// ONLY logic. This makes both testable and maintainable independently.

import type {
  SteakDoneness,
  SteakThickness,
  BoiledDoneness,
  FriedDoneness,
  DonenessOption,
  TemperatureRange,
  FoodPlugin,
} from '../types/cooking';

// ─────────────────────────────────────────────────────────
// STEAK DATA
// ─────────────────────────────────────────────────────────

// 💡 CONCEPT: Typed constant matrices — Using Record<Thickness, Record<Doneness, number>>
// creates a lookup table that TypeScript enforces at compile time.
// If you forget a thickness or doneness, you get a compile error, not a runtime bug.

/** Time per side in minutes, indexed by thickness × doneness */
export const STEAK_TIMES: Record<SteakThickness, Record<SteakDoneness, number>> = {
  '0.5in': { rare: 1, 'medium-rare': 2, medium: 3, 'medium-well': 4, 'well-done': 5 },
  '0.75in': { rare: 2, 'medium-rare': 3, medium: 4, 'medium-well': 5, 'well-done': 6 },
  '1in': { rare: 3, 'medium-rare': 4, medium: 5, 'medium-well': 6, 'well-done': 7.5 },
  '1.5in': { rare: 4, 'medium-rare': 5, medium: 6, 'medium-well': 7.5, 'well-done': 9.5 },
  '2in': { rare: 5, 'medium-rare': 6.5, medium: 8, 'medium-well': 10, 'well-done': 12 },
};

/** Internal temperature reference for each doneness level */
export const STEAK_TEMPS: Record<SteakDoneness, TemperatureRange> = {
  rare: {
    pullTempF: [115, 120],
    finalTempF: 125,
    pullTempC: [46, 49],
    finalTempC: 52,
  },
  'medium-rare': {
    pullTempF: [125, 130],
    finalTempF: 135,
    pullTempC: [52, 54],
    finalTempC: 57,
  },
  medium: {
    pullTempF: [135, 140],
    finalTempF: 145,
    pullTempC: [57, 60],
    finalTempC: 63,
  },
  'medium-well': {
    pullTempF: [140, 145],
    finalTempF: 150,
    pullTempC: [60, 63],
    finalTempC: 66,
  },
  'well-done': {
    pullTempF: [160, 165],
    finalTempF: 165,
    pullTempC: [71, 74],
    finalTempC: 74,
  },
};

/** Steak rest time in seconds — all doneness levels */
export const STEAK_REST_SECONDS = 5 * 60;

/** Display labels for steak thickness options */
export const STEAK_THICKNESS_LABELS: Record<SteakThickness, string> = {
  '0.5in': '½" (1.3cm)',
  '0.75in': '¾" (2cm)',
  '1in': '1" (2.5cm)',
  '1.5in': '1½" (3.8cm)',
  '2in': '2" (5cm)',
};

/** Steak doneness options for the setup screen */
export const STEAK_DONENESS_OPTIONS: DonenessOption[] = [
  { id: 'rare', label: 'Rare', description: 'Red center, seared outside', imageKey: 'steak-rare' },
  { id: 'medium-rare', label: 'Med Rare', description: 'Pink center, juicy', imageKey: 'steak-medium-rare' },
  { id: 'medium', label: 'Medium', description: 'Pink center, firm', imageKey: 'steak-medium' },
  { id: 'medium-well', label: 'Med Well', description: 'Slight pink, mostly brown', imageKey: 'steak-medium-well' },
  { id: 'well-done', label: 'Well Done', description: 'Fully brown throughout', imageKey: 'steak-well-done' },
];

// ─────────────────────────────────────────────────────────
// EGG DATA
// ─────────────────────────────────────────────────────────

/** Boiled egg cook times in minutes from boiling water */
export const BOILED_EGG_TIMES: Record<BoiledDoneness, number> = {
  'soft-boiled': 6,
  'medium-boiled': 7.5,
  'hard-boiled': 9.5,
};

/** Boiled egg yolk descriptions */
export const BOILED_EGG_YOLK: Record<BoiledDoneness, string> = {
  'soft-boiled': 'Runny yolk',
  'medium-boiled': 'Semi-solid yolk',
  'hard-boiled': 'Fully set yolk',
};

/** Fried egg parameters — total time + flip time (null = no flip) */
export const FRIED_EGG_PARAMS: Record<FriedDoneness, { totalTimeMin: number; firstSideMin: number; secondSideMin: number | null; notes: string }> = {
  'sunny-side-up': { totalTimeMin: 2.5, firstSideMin: 2.5, secondSideMin: null, notes: 'No flip — cook covered' },
  'over-easy': { totalTimeMin: 3, firstSideMin: 2, secondSideMin: 10 / 60, notes: 'Quick flip, runny yolk' },
  'over-medium': { totalTimeMin: 4, firstSideMin: 2, secondSideMin: 2, notes: 'Flip 2 min, jammy yolk' },
  'over-hard': { totalTimeMin: 5, firstSideMin: 2, secondSideMin: 3, notes: 'Flip 3 min, firm yolk' },
};

/** Boiled egg doneness options for the setup screen */
export const BOILED_DONENESS_OPTIONS: DonenessOption[] = [
  { id: 'soft-boiled', label: 'Soft', description: 'Runny yolk', imageKey: 'egg-soft-boiled' },
  { id: 'medium-boiled', label: 'Medium', description: 'Semi-solid yolk', imageKey: 'egg-medium-boiled' },
  { id: 'hard-boiled', label: 'Hard', description: 'Fully set yolk', imageKey: 'egg-hard-boiled' },
];

/** Fried egg doneness options for the setup screen */
export const FRIED_DONENESS_OPTIONS: DonenessOption[] = [
  { id: 'sunny-side-up', label: 'Sunny', description: 'No flip, runny yolk', imageKey: 'egg-sunny-side-up' },
  { id: 'over-easy', label: 'Over Easy', description: 'Quick flip, runny yolk', imageKey: 'egg-over-easy' },
  { id: 'over-medium', label: 'Over Med', description: 'Flip 2min, jammy yolk', imageKey: 'egg-over-medium' },
  { id: 'over-hard', label: 'Over Hard', description: 'Flip 3min, firm yolk', imageKey: 'egg-over-hard' },
];

// ─────────────────────────────────────────────────────────
// FOOD PLUGIN REGISTRY
// 🔑 LEARNING: Plugin Registry pattern — Instead of hardcoding food types
// in the app, we register "plugins" that implement a common interface.
// This follows the Open/Closed Principle: open for extension, closed for modification.
// To add "Chicken" later, you just create a new plugin — no changes to App.tsx.
// ─────────────────────────────────────────────────────────

/** All registered food plugins — the app iterates over this to build the home screen */
export const FOOD_PLUGINS: FoodPlugin[] = [];
// Plugins are registered at the bottom of their respective calculator files
// to avoid circular dependencies. See cooking-calculator.ts.
