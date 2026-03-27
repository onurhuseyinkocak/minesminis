// Thin wrapper around GA4 — fails silently if GA not loaded or consent not given
import { LS_COOKIE_CONSENT } from '../config/storageKeys';

function hasConsent(): boolean {
  try {
    return localStorage.getItem(LS_COOKIE_CONSENT) === 'accepted';
  } catch {
    return false;
  }
}

export const analytics = {
  track(event: string, params?: Record<string, unknown>) {
    if (!hasConsent()) return;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params);
    }
  },

  // ── Auth funnel ──────────────────────────────────────────────────────────────

  signup(method: 'email' | 'google') {
    this.track('sign_up', { method });
  },

  login(method: 'email' | 'google') {
    this.track('login', { method });
  },

  // ── Onboarding funnel ────────────────────────────────────────────────────────

  onboardingComplete(ageGroup: string, placementScore: number, startingGroup: number) {
    this.track('onboarding_complete', { age_group: ageGroup, placement_score: placementScore, starting_group: startingGroup });
  },

  placementTestComplete(score: number, questionsAnswered: number, startingGroup: number) {
    this.track('placement_test_completed', { score, questions_answered: questionsAnswered, starting_group: startingGroup });
  },

  // ── Lesson funnel ────────────────────────────────────────────────────────────

  lessonStarted(lessonId: string, worldId: string) {
    this.track('lesson_started', { lesson_id: lessonId, world_id: worldId });
  },

  lessonComplete(lessonId: string, score: number, xp: number) {
    this.track('lesson_complete', { lesson_id: lessonId, score, xp_earned: xp });
  },

  // ── Game funnel ──────────────────────────────────────────────────────────────

  gameComplete(gameType: string, score: number) {
    this.track('game_complete', { game_type: gameType, score });
  },

  // ── Monetisation funnel ──────────────────────────────────────────────────────

  subscriptionStarted(planId: string, billingInterval: 'monthly' | 'yearly', provider: 'stripe' | 'iyzico' | 'lemonsqueezy') {
    this.track('subscription_started', { plan_id: planId, billing_interval: billingInterval, provider });
  },

  // ── Engagement ───────────────────────────────────────────────────────────────

  streakMilestone(days: number) {
    this.track('streak_milestone', { days });
  },

  wordLearned(word: string, category: string) {
    this.track('word_learned', { word, category });
  },
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
