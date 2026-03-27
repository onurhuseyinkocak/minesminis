/**
 * StreakCalendar
 * Reusable daily-activity calendar for MinesMinis.
 * Compact: 5×7 grid of the last 35 days.
 * Full: proper month calendar with navigation.
 */
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './StreakCalendar.css';

export interface StreakCalendarProps {
  /** ISO date strings when user was active e.g. ['2025-03-01', ...] */
  activityDates: string[];
  /** Current streak count */
  streakDays: number;
  /** Dates where a freeze was consumed (shown in blue) */
  freezeUsedDates?: string[];
  /** How many months to show in full mode (default 1) */
  months?: number;
  /** compact = last 35 days grid, full = proper month calendar */
  size?: 'compact' | 'full';
}

// ----------------------------------------------------------------
// helpers
// ----------------------------------------------------------------

function toISO(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function todayISO(): string {
  return toISO(new Date());
}

type DayState = 'active' | 'streak' | 'freeze' | 'none' | 'future' | 'empty';

function getDayState(
  iso: string,
  activitySet: Set<string>,
  freezeSet: Set<string>,
  today: string,
  streakDates: Set<string>,
): DayState {
  if (iso > today) return 'future';
  if (freezeSet.has(iso)) return 'freeze';
  if (streakDates.has(iso)) return 'streak';
  if (activitySet.has(iso)) return 'active';
  return 'none';
}

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ----------------------------------------------------------------
// Compact Mode
// ----------------------------------------------------------------

interface CompactProps {
  activityDates: string[];
  streakDays: number;
  freezeUsedDates: string[];
}

function CompactCalendar({ activityDates, streakDays, freezeUsedDates }: CompactProps) {
  const today = todayISO();
  const activitySet = new Set(activityDates);
  const freezeSet = new Set(freezeUsedDates);

  // Build streak dates: last `streakDays` days ending today (or yesterday)
  const streakDates = new Set<string>();
  if (streakDays > 0) {
    const base = new Date();
    // Check if today is active; if not, streak ends yesterday
    if (!activitySet.has(today)) base.setDate(base.getDate() - 1);
    for (let i = 0; i < streakDays; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      streakDates.add(toISO(d));
    }
  }

  // Build last 35 days (5×7 grid), index 0 = oldest
  const days: string[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toISO(d));
  }

  return (
    <div className="streak-calendar streak-calendar--compact">
      {/* Weekday orientation row */}
      <div className="sc-weekdays sc-weekdays--compact">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={`wl-${i}`} className="sc-weekday-label">
            {label}
          </div>
        ))}
      </div>
      <div className="sc-grid">
        {days.map((iso) => {
          const state = getDayState(iso, activitySet, freezeSet, today, streakDates);
          const isToday = iso === today;
          return (
            <div
              key={iso}
              className={[
                'sc-day',
                `sc-day--${state}`,
                isToday ? 'sc-day--today' : '',
              ].join(' ')}
              title={iso}
              aria-label={`${iso}: ${state}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Full Mode
// ----------------------------------------------------------------

interface FullProps {
  activityDates: string[];
  streakDays: number;
  freezeUsedDates: string[];
}

function FullCalendar({ activityDates, streakDays, freezeUsedDates }: FullProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-based

  const today = todayISO();
  const activitySet = new Set(activityDates);
  const freezeSet = new Set(freezeUsedDates);

  // Build streak dates
  const streakDates = new Set<string>();
  if (streakDays > 0) {
    const base = new Date();
    if (!activitySet.has(today)) base.setDate(base.getDate() - 1);
    for (let i = 0; i < streakDays; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      streakDates.add(toISO(d));
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    const futureYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const futureMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const futureDate = new Date(futureYear, futureMonth, 1);
    // Don't navigate past current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (futureDate > currentMonthStart) return;

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // First day of month (0=Sun … 6=Sat), convert to Mon-based index (0=Mon … 6=Sun)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const rawDow = firstDayOfMonth.getDay(); // 0 Sun
  const startOffset = rawDow === 0 ? 6 : rawDow - 1; // Mon-based

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build grid: leading empty slots + actual days
  type Cell = { type: 'empty' } | { type: 'day'; iso: string; dayNum: number };
  const cells: Cell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ type: 'empty' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ type: 'day', iso, dayNum: d });
  }

  const isAtCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  return (
    <div className="streak-calendar streak-calendar--full">
      {/* Header */}
      <div className="sc-header">
        <button
          type="button"
          className="sc-nav-btn"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="sc-header-title">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="sc-nav-btn"
          onClick={nextMonth}
          disabled={isAtCurrentMonth}
          aria-label="Next month"
          style={{ opacity: isAtCurrentMonth ? 0.3 : 1 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="sc-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="sc-weekday-label">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="sc-grid">
        {cells.map((cell, idx) => {
          if (cell.type === 'empty') {
            return <div key={`e-${idx}`} className="sc-day sc-day--empty" />;
          }
          const state = getDayState(cell.iso, activitySet, freezeSet, today, streakDates);
          const isToday = cell.iso === today;
          return (
            <div
              key={cell.iso}
              className={[
                'sc-day',
                `sc-day--${state}`,
                isToday ? 'sc-day--today' : '',
              ].join(' ')}
              title={cell.iso}
              aria-label={`${cell.iso}: ${state}`}
            >
              {cell.dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="sc-legend">
        <span className="sc-legend-item">
          <span className="sc-legend-dot sc-legend-dot--streak" />
          Streak
        </span>
        <span className="sc-legend-item">
          <span className="sc-legend-dot sc-legend-dot--active" />
          Active
        </span>
        <span className="sc-legend-item">
          <span className="sc-legend-dot sc-legend-dot--freeze" />
          Freeze used
        </span>
        <span className="sc-legend-item">
          <span className="sc-legend-dot sc-legend-dot--none" />
          No activity
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main export
// ----------------------------------------------------------------

export default function StreakCalendar({
  activityDates,
  streakDays,
  freezeUsedDates = [],
  size = 'compact',
}: StreakCalendarProps) {
  if (size === 'full') {
    return (
      <FullCalendar
        activityDates={activityDates}
        streakDays={streakDays}
        freezeUsedDates={freezeUsedDates}
      />
    );
  }

  return (
    <CompactCalendar
      activityDates={activityDates}
      streakDays={streakDays}
      freezeUsedDates={freezeUsedDates}
    />
  );
}
