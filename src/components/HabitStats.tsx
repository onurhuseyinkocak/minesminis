/**
 * HabitStats
 * A compact 4-column strip showing key habit metrics:
 * Current Streak | Longest Streak | 30-Day Rate | Total Days
 */
import { Flame, Trophy, TrendingUp, CalendarCheck } from 'lucide-react';
import {
  calculateStreakFromDates,
  getLongestStreak,
  getActivityRate30Days,
  getActivityDates,
} from '../services/habitTracker';
import { useLanguage } from '../contexts/LanguageContext';
import './HabitStats.css';

interface HabitStatsProps {
  userId: string;
  /** Optional override — if not provided, reads from localStorage via habitTracker */
  activityDates?: string[];
}

type TrendDir = 'up' | 'down' | 'neutral';

interface StatCardProps {
  value: string;
  label: string;
  variant: 'streak' | 'longest' | 'rate' | 'total';
  icon: React.ReactNode;
  trend?: TrendDir;
}

function TrendArrow({ dir }: { dir: TrendDir }) {
  if (dir === 'neutral') return null;
  return (
    <span
      className={`habit-stat-trend habit-stat-trend--${dir}`}
      aria-label={dir === 'up' ? 'trending up' : 'trending down'}
    >
      {dir === 'up' ? '▲' : '▼'}
    </span>
  );
}

function StatCard({ value, label, variant, icon, trend }: StatCardProps) {
  return (
    <div className="habit-stat-card">
      <span className={`habit-stat-icon habit-stat-icon--${variant}`} aria-hidden="true">
        {icon}
      </span>
      <div className="habit-stat-value-row">
        <span className={`habit-stat-value habit-stat-value--${variant}`}>{value}</span>
        {trend && trend !== 'neutral' && <TrendArrow dir={trend} />}
      </div>
      <span className="habit-stat-label">{label}</span>
    </div>
  );
}

export default function HabitStats({ userId, activityDates }: HabitStatsProps) {
  const { t } = useLanguage();
  const dates = activityDates ?? getActivityDates(userId);

  const currentStreak = calculateStreakFromDates(dates);
  const longestStreak = getLongestStreak(dates);
  const rate30 = getActivityRate30Days(dates);
  const totalDays = dates.length;

  // Derive a simple trend: is current streak at an all-time high?
  const streakTrend: TrendDir = currentStreak >= longestStreak && currentStreak > 0 ? 'up' : 'neutral';
  // Rate trend: above 70% is good, below 40% is bad
  const rateTrend: TrendDir = rate30 >= 70 ? 'up' : rate30 < 40 ? 'down' : 'neutral';

  return (
    <div className="habit-stats">
      <StatCard
        value={String(currentStreak)}
        label={t('habitStats.currentStreak')}
        variant="streak"
        icon={<Flame size={18} strokeWidth={2} />}
        trend={streakTrend}
      />
      <StatCard
        value={String(longestStreak)}
        label={t('habitStats.bestStreak')}
        variant="longest"
        icon={<Trophy size={18} strokeWidth={2} />}
      />
      <StatCard
        value={`${rate30}%`}
        label={t('habitStats.thirtyDayRate')}
        variant="rate"
        icon={<TrendingUp size={18} strokeWidth={2} />}
        trend={rateTrend}
      />
      <StatCard
        value={String(totalDays)}
        label={t('habitStats.totalDays')}
        variant="total"
        icon={<CalendarCheck size={18} strokeWidth={2} />}
      />
    </div>
  );
}
