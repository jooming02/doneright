// 🔑 LEARNING: Notification API — Push notifications even when the app
// is in the background. For a cooking timer, this is critical: the user
// might switch to a recipe app while the steak cooks. The notification
// tells them when to flip or when it's done.
//
// The Notification API has a permission model:
// 1. "default" — Haven't asked yet. Must call requestPermission().
// 2. "granted" — User said yes. We can show notifications.
// 3. "denied" — User said no (or browser blocked it). Can't ask again.
//
// IMPORTANT: You can only request permission from a user gesture (click).
// You can't request it on page load — that's spammy and browsers block it.

import { useCallback, useEffect, useState } from 'react';

interface NotificationHook {
  /** Whether the browser supports notifications */
  isSupported: boolean;
  /** Current permission status */
  permission: NotificationPermission;
  /** Request permission from the user (call from a click handler!) */
  requestPermission: () => Promise<void>;
  /** Show a notification */
  notify: (title: string, options?: NotificationOptions) => void;
}

/**
 * Hook for browser notification support.
 *
 * 💡 CONCEPT: Capability detection + permission management — This hook
 * encapsulates two concerns: (1) does the browser support notifications?
 * and (2) does the user allow them? Both must be true for notifications to work.
 */
export function useNotification(): NotificationHook {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // 🔑 LEARNING: Feature detection for Notification API.
  // 'Notification' in window checks if the global Notification constructor exists.
  // Some environments (SSR, workers) don't have a `window` object.
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  // Initialize permission state on mount
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  /**
   * Request notification permission from the user.
   *
   * 🔑 LEARNING: Permission request flow —
   * 1. Check if already granted or denied (no point asking again)
   * 2. Call Notification.requestPermission() — this shows the browser prompt
   * 3. Update our state with the result
   *
   * CRITICAL: This MUST be called from a user gesture (click handler).
   * Calling it programmatically (e.g., in useEffect) will be silently
   * blocked by most browsers.
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) return;

    // 🔑 LEARNING: Don't re-ask if already decided.
    // If the user denied permission, asking again won't show a prompt —
    // it just returns 'denied' again. The user must go to browser settings
    // to re-enable notifications for your site.
    if (Notification.permission === 'granted') {
      setPermission('granted');
      return;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied. User must enable in browser settings.');
      return;
    }

    // 💡 CONCEPT: Promise-based permission API — Modern browsers return a
    // Promise from requestPermission(). Older browsers used a callback.
    // The Promise version is cleaner and works with async/await.
    const result = await Notification.requestPermission();
    setPermission(result);
  }, [isSupported]);

  /**
   * Show a browser notification.
   *
   * 🔑 LEARNING: Notification options —
   * - icon: Small image shown next to the notification (32x32 or 64x64)
   * - badge: Monochrome icon for the status bar (Android)
   * - vibrate: Vibration pattern for mobile devices [vibrate, pause, vibrate, ...]
   * - tag: ID for grouping — replacing a notification with the same tag
   *        avoids stacking multiple notifications for the same timer
   * - requireInteraction: Keep notification visible until user dismisses
   *   (important for cooking — you don't want to miss "FLIP!" notification)
   */
  const notify = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== 'granted') return;

      try {
        // 💡 CONCEPT: Tag-based notification replacement — If we send a
        // notification with the same tag, it replaces the previous one instead
        // of stacking. This prevents notification spam during a cooking session.
        const notification = new Notification(title, {
          icon: '/images/icon-192.svg',
          badge: '/images/icon-192.svg',
          tag: 'doneright-timer',
          ...options,
        } as NotificationOptions);

        // 🔑 LEARNING: Notification click handler — When the user clicks
        // the notification, we want to focus our app window. This brings
        // the timer back into view so they can see the next step.
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        // Graceful degradation — notification failures shouldn't crash the app
        console.warn('Failed to show notification:', err);
      }
    },
    [isSupported, permission]
  );

  return { isSupported, permission, requestPermission, notify };
}
