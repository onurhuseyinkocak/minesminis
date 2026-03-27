/**
 * formatUtils — Locale-aware formatting helpers for dates, numbers, and relative time.
 */

export type AppLang = 'tr' | 'en';

/**
 * Format a number with locale-appropriate thousand separators.
 * tr-TR: 1.250 (dot as thousands, comma as decimal)
 * en-US: 1,250
 */
export function formatNumber(value: number, lang: AppLang): string {
  return value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');
}

/**
 * Format XP with locale-aware separators.
 */
export function formatXP(value: number, lang: AppLang): string {
  return `${formatNumber(value, lang)} XP`;
}

/**
 * Format a date string/Date with locale-appropriate long format.
 * tr-TR: "27 Mart 2026"
 * en-US: "March 27, 2026"
 */
export function formatDateLong(date: Date | string, lang: AppLang): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date with short month.
 * tr-TR: "27 Mar 2026"
 * en-US: "Mar 27, 2026"
 */
export function formatDateShort(date: Date | string, lang: AppLang): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time (HH:MM) with locale.
 * tr-TR: 24-hour format
 * en-US: 12-hour with AM/PM
 */
export function formatTime(date: Date | string, lang: AppLang): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a price with locale-appropriate currency.
 * TRY: "399,99 TL" (tr-TR)
 * USD: "$3.99" (en-US)
 */
export function formatCurrency(amount: number, lang: AppLang, currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): string {
  if (lang === 'tr' && currency === 'TRY') {
    return `${amount.toLocaleString('tr-TR')} TL`;
  }
  return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Relative time display using Intl.RelativeTimeFormat.
 * tr: "3 gün önce", "2 saat önce"
 * en: "3 days ago", "2 hours ago"
 */
export function formatRelativeTime(date: Date | string | number, lang: AppLang): string {
  const d = typeof date === 'number' ? new Date(date) : typeof date === 'string' ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(lang === 'tr' ? 'tr' : 'en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  return rtf.format(diffDay, 'day');
}

/**
 * Pluralize a count with English grammar rules.
 * For Turkish, singular form is always used (no plural suffix needed in this context).
 */
export function pluralize(count: number, singular: string, plural: string, lang: AppLang): string {
  if (lang === 'tr') return `${count} ${singular}`;
  return `${count} ${count === 1 ? singular : plural}`;
}
