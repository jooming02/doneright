// 🔑 LEARNING: localStorage persistence hook — This hook wraps localStorage
// in a type-safe, React-friendly interface. Key concepts:
//
// 1. localStorage is synchronous and blocking — reads/writes happen immediately.
//    This is fine for small data (preferences), but don't store large objects.
//
// 2. localStorage stores ONLY strings — you must JSON.stringify/parse for objects.
//
// 3. React state + localStorage sync — We use state as the "source of truth"
//    for the React tree, and localStorage as the "persistence layer".
//    State changes → write to localStorage. On mount → read from localStorage.
//
// 4. SSR safety — localStorage doesn't exist on the server (no `window`).
//    We must check before accessing it.

import { useState, useCallback } from 'react';
import type { Preferences } from '../types/cooking';
import { DEFAULT_THEME_ID } from '../data/themes';

// 💡 CONCEPT: Default preferences — Always provide defaults so the app
// works even if localStorage is empty or corrupted.
const DEFAULT_PREFERENCES: Preferences = {
  temperatureUnit: 'fahrenheit',
  lengthUnit: 'inch',
  themeId: DEFAULT_THEME_ID,
};

const STORAGE_KEY = 'doneright-preferences';

/**
 * Hook for persisting user preferences to localStorage.
 *
 * 🔑 LEARNING: Custom hook for side effects — Instead of scattering
 * localStorage calls throughout the codebase, we centralize them here.
 * This gives us a single place to:
 * - Handle JSON serialization/deserialization
 * - Handle errors (localStorage can throw in private browsing)
 * - Handle SSR safety checks
 * - Provide type-safe access
 */
export function usePreferences() {
  const [preferences, setPreferencesState] = useState<Preferences>(() => {
    // 🔑 LEARNING: Lazy state initialization — The function passed to
    // useState() is only called ONCE on the initial render. This is the
    // perfect place to read from localStorage, because:
    // 1. It only runs once (not on every render)
    // 2. It runs before the first paint (no flash of default values)
    try {
      if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;

      const parsed = JSON.parse(stored) as Partial<Preferences>;
      // 💡 CONCEPT: Merge with defaults — Only override defaults with
      // values that exist in storage. This handles the case where we
      // add new preference fields in future versions — old stored data
      // won't have the new fields, so they get the default value.
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
      };
    } catch {
      // localStorage can throw: quota exceeded, private browsing, etc.
      // We catch and return defaults — the app works, just without persistence.
      return DEFAULT_PREFERENCES;
    }
  });

  /**
   * Update preferences and persist to localStorage.
   *
   * 🔑 LEARNING: Partial update pattern — Like setState(prev =>({...prev, ...update})),
   * we merge the partial update with existing preferences. This lets components
   * update just one field (e.g., temperatureUnit) without knowing about others.
   */
  const updatePreferences = useCallback((update: Partial<Preferences>) => {
    setPreferencesState((prev) => {
      const next = { ...prev, ...update };

      // 💡 CONCEPT: Side effect in setState — We write to localStorage
      // inside the setState callback to ensure it's always in sync with
      // the React state. If we did it separately, they could get out of sync
      // if the state update was batched or discarded.
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        console.warn('Failed to persist preferences to localStorage');
      }

      return next;
    });
  }, []);

  return { preferences, updatePreferences };
}
