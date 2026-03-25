/**
 * STREAK PROTECTION BADGE
 * Compact inline badge that shows the user's remaining streak freeze charges.
 * Shows a shield icon + count when active, "Koruma yok" when empty.
 * Includes a hover/focus tooltip.
 */
import './StreakProtectionBadge.css';

export interface StreakProtectionBadgeProps {
  /** Number of streak freeze charges currently available. */
  count: number;
  size?: 'sm' | 'md';
}

const ShieldIcon = () => (
  <svg
    className="spb__icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);

export default function StreakProtectionBadge({
  count,
  size = 'sm',
}: StreakProtectionBadgeProps) {
  const sizeClass = size === 'md' ? 'spb--md' : 'spb--sm';
  const stateClass = count > 0 ? 'spb--active' : 'spb--empty';

  const tooltipText =
    count > 0
      ? `Seri koruması: ${count} gün kalan`
      : 'Seri koruması yok';

  return (
    <span
      className={`spb ${sizeClass} ${stateClass}`}
      role="status"
      aria-label={tooltipText}
      tabIndex={0}
    >
      <ShieldIcon />
      {count > 0 ? (
        <span>{count}</span>
      ) : (
        <span>Koruma yok</span>
      )}
      <span className="spb__popover" aria-hidden="true">
        {tooltipText}
      </span>
    </span>
  );
}
