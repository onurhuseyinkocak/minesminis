/**
 * HabitStats
 * A compact 4-column strip showing key habit metrics:
 * Current Streak | Longest Streak | 30-Day Rate | Total Days
 */
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

interface StatCardProps {
  value: string;
  label: string;
  variant: 'streak' | 'longest' | 'rate' | 'total';
}

function StatCard({ value, label, variant }: StatCardProps) {
  return (
    <div className="habit-stat-card">
      <span className={`habit-stat-value habit-stat-value--${variant}`}>{value}</span>
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

  return (
    <div className="habit-stats">
      <StatCard
        value={String(currentStreak)}
        label={t('habitStats.currentStreak')}
        variant="streak"
      />
      <StatCard
        value={String(longestStreak)}
        label={t('habitStats.bestStreak')}
        variant="longest"
      />
      <StatCard
        value={`${rate30}%`}
        label={t('habitStats.thirtyDayRate')}
        variant="rate"
      />
      <StatCard
        value={String(totalDays)}
        label={t('habitStats.totalDays')}
        variant="total"
      />
    </div>
  );
}
