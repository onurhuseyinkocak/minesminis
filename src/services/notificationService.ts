/**
 * Push Notification Management Service
 * Handles FCM token acquisition, local notifications, and streak reminders.
 */

import app from '../config/firebase';
import { supabase } from '../config/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationPermissionResult {
  granted: boolean;
  token: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY ?? '';

const LS_LESSON_COUNT = 'mm_lesson_complete_count';
const LS_NOTIFICATION_PROMPT = 'mm_notification_prompt_shown';

/** Stores IDs of all active setTimeout handles so they can be cancelled. */
const _pendingTimers: ReturnType<typeof setTimeout>[] = [];

// ─── FCM helpers ──────────────────────────────────────────────────────────────

/**
 * Lazily initialise Firebase Messaging.
 * Returns null if the environment does not support FCM
 * (e.g. non-HTTPS, Safari without permission, old browsers).
 */
async function getMessagingInstance() {
  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Request notification permission from the browser.
 * If granted, also retrieves the FCM token.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionResult> {
  if (!('Notification' in window)) {
    return { granted: false, token: null };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { granted: false, token: null };
    }

    const token = await getFCMToken();
    return { granted: true, token };
  } catch {
    return { granted: false, token: null };
  }
}

/**
 * Get the FCM registration token.
 * Returns null if FCM is not supported or permission is denied.
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    // Ensure service worker is registered before requesting token
    if (!('serviceWorker' in navigator)) return null;

    const registration = await navigator.serviceWorker.ready;

    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch {
    return null;
  }
}

/**
 * Persist the user's FCM token in Supabase so the server can send targeted pushes.
 */
export async function saveUserFCMToken(userId: string, token: string): Promise<void> {
  try {
    // Fetch current settings first to avoid overwriting other fields
    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .single();
    const existing = (data?.settings as Record<string, unknown>) ?? {};
    const updatedSettings: Record<string, unknown> = {
      ...existing,
      fcm_token: token,
      fcm_updated_at: new Date().toISOString(),
    };
    const { error: updateError } = await supabase
      .from('users')
      .update({ settings: updatedSettings })
      .eq('id', userId);
    if (updateError) {
      console.warn('[notificationService] saveUserFCMToken update failed:', updateError.message);
    }
  } catch (e) {
    console.warn('[notificationService] saveUserFCMToken failed:', e);
  }
}

/**
 * Schedule a one-shot local notification using setTimeout + the Notification API.
 * Only fires if Notification permission is already granted.
 */
export function scheduleLocalNotification(title: string, body: string, delayMs: number): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const id = setTimeout(() => {
    try {
      new Notification(title, { body, icon: '/icon-192.png' });
    } catch {
      // Notification constructor can throw in some edge cases (e.g., focus lost on iOS)
    }
  }, delayMs);

  _pendingTimers.push(id);
}

/**
 * Schedule a daily streak reminder at 20:00 (8 pm) local time.
 * Only schedules if the user has not completed a lesson today.
 *
 * @param lastLessonDate - ISO date string of the last completed lesson, or null
 * @param streakDays     - Current streak count (used in the message)
 */
export function scheduleStreakReminder(lastLessonDate: string | null, streakDays: number): void {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // User already did a lesson today — no reminder needed
  if (lastLessonDate && lastLessonDate.slice(0, 10) === today) return;

  const target = new Date(now);
  target.setHours(20, 0, 0, 0); // 8:00 pm

  // If it is already past 8 pm today, skip — the user will see it tomorrow
  if (target <= now) return;

  const delayMs = target.getTime() - now.getTime();

  const streakMsg =
    streakDays > 0
      ? `${streakDays} günlük serini korumak için oyna!`
      : 'Serinini korumak için oyna!';

  scheduleLocalNotification(
    'MinesMinis',
    `Bugün ders yaptın mı? ${streakMsg}`,
    delayMs,
  );
}

/**
 * Cancel every pending local notification scheduled by this service.
 */
export function cancelAllNotifications(): void {
  _pendingTimers.forEach((id) => clearTimeout(id));
  _pendingTimers.length = 0;
}

// ─── Lesson count helpers ─────────────────────────────────────────────────────

/**
 * Increment the lesson-completion counter stored in localStorage.
 * Call this from any lesson completion screen.
 * Returns the new count.
 */
export function incrementLessonCount(): number {
  const current = parseInt(localStorage.getItem(LS_LESSON_COUNT) ?? '0', 10);
  const next = (isNaN(current) ? 0 : current) + 1;
  localStorage.setItem(LS_LESSON_COUNT, String(next));
  return next;
}

/**
 * Read the current lesson completion count.
 */
export function getLessonCount(): number {
  const val = parseInt(localStorage.getItem(LS_LESSON_COUNT) ?? '0', 10);
  return isNaN(val) ? 0 : val;
}

/**
 * Check whether the notification prompt has already been shown/answered.
 */
export function hasSeenNotificationPrompt(): boolean {
  return localStorage.getItem(LS_NOTIFICATION_PROMPT) !== null;
}

/**
 * Mark the notification prompt as shown so it never appears again.
 */
export function markNotificationPromptShown(decision: 'accepted' | 'declined'): void {
  localStorage.setItem(LS_NOTIFICATION_PROMPT, decision);
}

// ─── Foreground message listener (optional, call once at app boot) ────────────

/**
 * Listen for FCM messages while the app is in the foreground.
 * Displays a local Notification for each incoming message.
 * Safe to call even if FCM is not supported — will silently no-op.
 */
export async function initForegroundMessageListener(): Promise<void> {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    const { onMessage } = await import('firebase/messaging');
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? 'MinesMinis';
      const body = payload.notification?.body ?? '';
      scheduleLocalNotification(title, body, 0);
    });
  } catch {
    // FCM not available — degrade gracefully
  }
}
