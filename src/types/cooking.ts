// 🔑 LEARNING: TypeScript types are the "contract" for our data.
// Defining types first (type-driven development) forces you to think about
// the shape of your data before writing implementation. This catches bugs
// at compile time instead of runtime.

/** All supported food categories — adding a new food starts here */
export type FoodCategory = 'steak' | 'egg';

/** Steak doneness levels, from least to most cooked */
export type SteakDoneness = 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done';

/** Egg cooking methods — each has different doneness options */
export type EggMethod = 'boiled' | 'fried';

/** Boiled egg doneness — determined by cook time in boiling water */
export type BoiledDoneness = 'soft-boiled' | 'medium-boiled' | 'hard-boiled';

/** Fried egg doneness — determined by cook time and whether to flip */
export type FriedDoneness = 'sunny-side-up' | 'over-easy' | 'over-medium' | 'over-hard';

/** Union of all egg doneness types */
export type EggDoneness = BoiledDoneness | FriedDoneness;

/** All doneness types across foods — used in generic components */
export type Doneness = SteakDoneness | EggDoneness;

/** Steak thickness options in both metric and imperial */
export type SteakThickness = '0.5in' | '0.75in' | '1in' | '1.5in' | '2in';

// 💡 CONCEPT: Unit preferences — storing user preferences in a typed object
// prevents mixing °C with cm or °F with inch. The type system enforces consistency.
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type LengthUnit = 'cm' | 'inch';

/** User preferences persisted to localStorage */
export interface Preferences {
  temperatureUnit: TemperatureUnit;
  lengthUnit: LengthUnit;
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

/** A single phase of cooking (e.g., "cook side 1", "flip", "rest") */
export interface CookingPhase {
  id: string;
  label: string;
  durationSeconds: number;
  type: 'cook' | 'flip' | 'rest' | 'done';
  alertSound?: 'flip' | 'done' | 'rest-done'; // Which sound to play at phase end
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

/** Parameters needed to calculate cooking time — varies by food */
export type CookingParams =
  | { food: 'steak'; thickness: SteakThickness; doneness: SteakDoneness }
  | { food: 'egg'; method: EggMethod; doneness: EggDoneness };

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
