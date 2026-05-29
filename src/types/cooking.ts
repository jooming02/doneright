// 🔑 LEARNING: TypeScript types are the "contract" for our data.
// Defining types first (type-driven development) forces you to think about
// the shape of your data before writing implementation. This catches bugs
// at compile time instead of runtime.

/** All supported food categories — adding a new food starts here */
export type FoodCategory = 'steak';

/** Steak doneness levels, from least to most cooked */
export type SteakDoneness = 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done';

/** All doneness types — currently steak only */
export type Doneness = SteakDoneness;

/** Steak thickness options in both metric and imperial */
export type SteakThickness = '0.5in' | '0.75in' | '1in' | '1.5in' | '2in';

// 💡 CONCEPT: Unit preferences — storing user preferences in a typed object
// prevents mixing °C with cm or °F with inch. The type system enforces consistency.
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/** User preferences persisted to localStorage */
export interface Preferences {
  temperatureUnit: TemperatureUnit;
  themeId: string;
}

/** A single doneness option for the setup screen */
export interface DonenessOption {
  id: Doneness;
  label: string;
  description: string;
  imageKey: string; // Key to look up pixel art placeholder
}

/** Temperature range with both units for internal temp display */
export interface TemperatureRange {
  pullTempF: [number, number]; // Range in Fahrenheit
  finalTempF: number; // Final resting temp in Fahrenheit
  pullTempC: [number, number]; // Range in Celsius
  finalTempC: number; // Final resting temp in Celsius
}

/** A single phase of cooking (e.g., "cooking", "cooling") */
export interface CookingPhase {
  id: string;
  label: string;
  durationSeconds: number;
  type: 'cook' | 'rest' | 'done';
  alertSound?: 'flip' | 'done' | 'rest-done'; // Which sound to play at phase end
  /** Seconds-remaining threshold at which to fire a "flip now" reminder
   *  (timer keeps running — no phase split). Only set on the cook phase. */
  flipAtSeconds?: number;
}

/** The complete cooking plan returned by the calculator */
export interface CookingPlan {
  foodId: string;
  foodName: string;
  doneness: Doneness;
  donenessLabel: string;
  phases: CookingPhase[];
  internalTemp?: TemperatureRange; // Only for steak
  totalDurationSeconds: number;
}

// 🔑 LEARNING: Strategy Pattern interface — each food implements this.
// Adding a new food = implementing this interface + adding to the registry.
// Zero changes to existing code (Open/Closed Principle from SOLID).
// This is how you design for extensibility without modification.
export interface FoodPlugin {
  id: FoodCategory;
  name: string;
  icon: string;
  description: string;
  getDonenessOptions(): DonenessOption[];
  calculateTime(params: CookingParams): CookingPlan;
}

/** Parameters needed to calculate cooking time */
export type CookingParams = { food: 'steak'; thickness: SteakThickness; doneness: SteakDoneness };

/** Timer state returned by useTimer hook */
export interface TimerState {
  /** Seconds remaining in current phase */
  remaining: number;
  /** Total seconds for current phase */
  total: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether the timer has completed */
  isComplete: boolean;
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/** App-level screen states for simple routing */
export type AppScreen = 'home' | 'setup' | 'timer' | 'settings';
