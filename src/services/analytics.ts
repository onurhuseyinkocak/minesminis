// Thin wrapper around GA4 — fails silently if GA not loaded
export const analytics = {
  track(event: string, params?: Record<string, unknown>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params);
    }
  },

  // Predefined events for key moments
  lessonComplete(lessonId: string, score: number, xp: number) {
    this.track('lesson_complete', { lesson_id: lessonId, score, xp_earned: xp });
  },
  gameComplete(gameType: string, score: number) {
    this.track('game_complete', { game_type: gameType, score });
  },
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
