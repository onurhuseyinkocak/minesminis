// Utility for announcing messages to screen readers via a live region.
// Requires a <div id="sr-announcer"> to exist in the DOM (added in App.tsx).
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const el = document.getElementById('sr-announcer');
  if (!el) return;
  el.setAttribute('aria-live', politeness);
  el.textContent = '';
  // Force reflow before setting text so screen readers pick up the change
  void el.offsetHeight;
  el.textContent = message;
}
