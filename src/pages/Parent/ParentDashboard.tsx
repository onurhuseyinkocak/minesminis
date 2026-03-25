/**
 * PARENT DASHBOARD
 * Full progress report for parents — professional, clean design.
 * Reads from activityLogger, adaptiveEngine, spacedRepetition, childProfileService,
 * and GamificationContext.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification, ALL_BADGES } from '../../contexts/GamificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getWeeklySummary,
  getActivityBreakdown,
  getWeeklyActivityData,
  getMonthlyActivityData,
} from '../../services/activityLogger';
import {
  getLearnerProfile,
  getLearnerInsights,
  generateWeeklyReport,
  setActiveUser,
} from '../../services/adaptiveEngine';
import { getSRSState } from '../../services/spacedRepetition';
import { getChildren, ChildProfile } from '../../services/childProfileService';
import { ALL_SOUNDS } from '../../data/phonics';
import { generateAssessment } from '../../services/assessmentService';
import type { PhonicsAssessment } from '../../services/assessmentService';
import AssessmentReport from '../../components/AssessmentReport';
import './ParentDashboard.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardData {
  weeklySummary: ReturnType<typeof getWeeklySummary>;
  activityBreakdown: Record<string, number>;
  weeklyActivity: ReturnType<typeof getWeeklyActivityData>;
  monthlyActivity: ReturnType<typeof getMonthlyActivityData>;
  srsBox1: number;
  srsBox2: number;
  srsBox3: number;
  srsTotal: number;
  weeklyReport: ReturnType<typeof generateWeeklyReport>;
  insights: ReturnType<typeof getLearnerInsights>;
  soundMastery: Record<string, number>; // soundId → mastery 0-100
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildCalendar(
  monthlyActivity: ReturnType<typeof getMonthlyActivityData>,
  streakDays: number,
): Array<{ date: string; hasActivity: boolean; isStreak: boolean; isToday: boolean }> {
  const today = toDateKey(new Date());
  const activityDates = new Set(
    monthlyActivity.filter((d) => d.totalMinutes > 0).map((d) => d.date),
  );

  // Build last 30 days
  const result: Array<{ date: string; hasActivity: boolean; isStreak: boolean; isToday: boolean }> =
    [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = toDateKey(d);
    const isStreak = i < streakDays && i >= 0;
    result.push({
      date: dateKey,
      hasActivity: activityDates.has(dateKey),
      isStreak,
      isToday: dateKey === today,
    });
  }
  return result;
}

function getDayNumber(dateStr: string): number {
  return new Date(dateStr).getDate();
}

function fmtMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Icons (inline SVG — no emoji, no external dep) ──────────────────────────

function IconClock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconBook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconFlame({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17h2a2.5 2.5 0 0 0 0-5H7" />
      <path d="M12 3C8 8 12 13 9 19" />
      <path d="M7.5 8.5c1-2 3-2 5-2s3.5 1 3.5 3" />
    </svg>
  );
}

function IconStar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconZap({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconBarChart({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}

function IconGrid({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3"  width="7" height="7" />
      <rect x="14" y="3"  width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3"  y="14" width="7" height="7" />
    </svg>
  );
}

function IconAward({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IconLightbulb({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="9"  y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function IconUsers({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCalendar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ─── Activity color helper ────────────────────────────────────────────────────

const ACTIVITY_COLORS: Record<string, string> = {
  phonics:   'var(--accent-indigo)',
  game:      'var(--accent-purple)',
  reading:   'var(--success)',
  song:      'var(--accent-pink)',
  review:    'var(--info)',
  challenge: 'var(--primary)',
};

function getActivityColor(type: string): string {
  return ACTIVITY_COLORS[type] ?? 'var(--primary)';
}

// ─── Badge icon mapper ─────────────────────────────────────────────────────────

function BadgeIconNode({ icon }: { icon: string }) {
  switch (icon) {
    case 'fire':
      return <IconFlame size={18} />;
    case 'star':
      return <IconStar size={18} />;
    case 'trophy':
    case 'award':
      return <IconAward size={18} />;
    case 'book':
    case 'reading':
    case 'library':
      return <IconBook size={18} />;
    case 'heart':
    case 'games':
    case 'rocket':
    case 'sparkles':
    case 'video':
    case 'target':
      return <IconStar size={18} />;
    default:
      return <IconAward size={18} />;
  }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function EmptyCard({ message, lang }: { message: string; lang: string }) {
  return (
    <div className="pd-empty">
      <IconBarChart size={32} />
      <p className="pd-empty-title">{lang === 'tr' ? 'Henüz veri yok' : 'No data yet'}</p>
      <p className="pd-empty-sub">{message}</p>
    </div>
  );
}

function SummaryCards({
  data,
  childProfile,
  lang,
}: {
  data: DashboardData;
  childProfile: ChildProfile | null;
  lang: string;
}) {
  const { weeklySummary } = data;
  const prevDiff = weeklySummary.totalMinutes - weeklySummary.previousWeekMinutes;
  const streakDays = childProfile?.streak_days ?? 0;
  const weeklyXp = childProfile?.xp ?? 0;

  return (
    <div className="pd-summary-grid">
      <div className="pd-stat-card">
        <div className="pd-stat-icon pd-stat-icon--time">
          <IconClock size={18} />
        </div>
        <div className="pd-stat-value">{fmtMinutes(weeklySummary.totalMinutes)}</div>
        <div className="pd-stat-label">
          {lang === 'tr' ? 'Bu haftaki dakika' : 'Minutes this week'}
        </div>
        {weeklySummary.previousWeekMinutes > 0 && (
          <div className={`pd-stat-delta${prevDiff <= 0 ? ' pd-stat-delta--neutral' : ''}`}>
            {prevDiff > 0
              ? lang === 'tr'
                ? `+${fmtMinutes(prevDiff)} geçen haftaya göre`
                : `+${fmtMinutes(prevDiff)} vs last week`
              : lang === 'tr'
                ? `Geçen haftadan ${fmtMinutes(Math.abs(prevDiff))} az`
                : `${fmtMinutes(Math.abs(prevDiff))} less than last week`}
          </div>
        )}
      </div>

      <div className="pd-stat-card">
        <div className="pd-stat-icon pd-stat-icon--words">
          <IconBook size={18} />
        </div>
        <div className="pd-stat-value">{data.srsTotal}</div>
        <div className="pd-stat-label">
          {lang === 'tr' ? 'Takip edilen kelime' : 'Words tracked'}
        </div>
        <div className="pd-stat-delta">
          {data.srsBox3} {lang === 'tr' ? 'öğrenildi' : 'mastered'}
        </div>
      </div>

      <div className="pd-stat-card">
        <div className="pd-stat-icon pd-stat-icon--streak">
          <IconFlame size={18} />
        </div>
        <div className="pd-stat-value">{streakDays}</div>
        <div className="pd-stat-label">
          {lang === 'tr' ? 'Günlük seri' : 'Day streak'}
        </div>
        {streakDays >= 3 && (
          <div className="pd-stat-delta">
            {lang === 'tr' ? 'Devam et!' : 'Keep it going!'}
          </div>
        )}
      </div>

      <div className="pd-stat-card">
        <div className="pd-stat-icon pd-stat-icon--xp">
          <IconZap size={18} />
        </div>
        <div className="pd-stat-value">{weeklyXp.toLocaleString()}</div>
        <div className="pd-stat-label">
          {lang === 'tr' ? 'Toplam XP kazanıldı' : 'Total XP earned'}
        </div>
        {childProfile?.level !== undefined && (
          <div className="pd-stat-delta">
            {lang === 'tr' ? `Seviye ${childProfile.level}` : `Level ${childProfile.level}`}
          </div>
        )}
      </div>
    </div>
  );
}

function StreakCalendar({
  monthlyActivity,
  streakDays,
  lang,
}: {
  monthlyActivity: ReturnType<typeof getMonthlyActivityData>;
  streakDays: number;
  lang: string;
}) {
  const calendar = useMemo(
    () => buildCalendar(monthlyActivity, streakDays),
    [monthlyActivity, streakDays],
  );

  const activeDays = calendar.filter((d) => d.hasActivity).length;

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconCalendar size={16} />
          {lang === 'tr' ? 'Aktivite — son 30 gün' : 'Activity — last 30 days'}
        </h2>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>
          {lang === 'tr'
            ? `${activeDays} / 30 gün aktif`
            : `${activeDays} / 30 days active`}
        </span>
      </div>
      <div className="pd-card-body">
        <div className="pd-calendar">
          {calendar.map((day) => {
            let cls = 'pd-cal-day';
            if (day.isStreak && day.hasActivity) cls += ' pd-cal-day--streak';
            else if (day.hasActivity) cls += ' pd-cal-day--active';
            if (day.isToday) cls += ' pd-cal-day--today';

            return (
              <div key={day.date} className={cls} title={day.date}>
                {getDayNumber(day.date)}
              </div>
            );
          })}
        </div>
        <div className="pd-cal-legend">
          <div className="pd-cal-legend-item">
            <span className="pd-cal-dot pd-cal-dot--streak" />
            {lang === 'tr' ? 'Seri günü' : 'Streak day'}
          </div>
          <div className="pd-cal-legend-item">
            <span className="pd-cal-dot pd-cal-dot--active" />
            {lang === 'tr' ? 'Aktif' : 'Active'}
          </div>
          <div className="pd-cal-legend-item">
            <span className="pd-cal-dot pd-cal-dot--missed" />
            {lang === 'tr' ? 'Kaçırıldı' : 'Missed'}
          </div>
        </div>
      </div>
    </div>
  );
}

function WordMasteryChart({
  box1,
  box2,
  box3,
  total,
  lang,
}: {
  box1: number;
  box2: number;
  box3: number;
  total: number;
  lang: string;
}) {
  if (total === 0) {
    return (
      <div className="pd-card">
        <div className="pd-card-header">
          <h2 className="pd-card-title">
            <IconBook size={16} />
            {lang === 'tr' ? 'Kelime Hakimiyeti' : 'Word Mastery'}
          </h2>
        </div>
        <EmptyCard
          message={
            lang === 'tr'
              ? 'Henüz kelime takip edilmiyor. İlerlemeyi görmek için pratik yapmaya başla.'
              : 'No words tracked yet. Start practicing to see progress.'
          }
          lang={lang}
        />
      </div>
    );
  }

  const rows: Array<{ label: string; count: number; fillClass: string; desc: string }> = [
    {
      label: lang === 'tr' ? 'Öğreniliyor (Kutu 1)' : 'Learning (Box 1)',
      count: box1,
      fillClass: 'pd-bar-fill--box1',
      desc: lang === 'tr' ? 'Her gün tekrar gerekli' : 'Needs daily review',
    },
    {
      label: lang === 'tr' ? 'Gelişiyor (Kutu 2)' : 'Getting better (Box 2)',
      count: box2,
      fillClass: 'pd-bar-fill--box2',
      desc: lang === 'tr' ? '3 günde bir tekrar' : 'Review every 3 days',
    },
    {
      label: lang === 'tr' ? 'Öğrenildi (Kutu 3)' : 'Mastered (Box 3)',
      count: box3,
      fillClass: 'pd-bar-fill--box3',
      desc: lang === 'tr' ? '7 günde bir tekrar' : 'Review every 7 days',
    },
  ];

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconBook size={16} />
          {lang === 'tr' ? 'Kelime Hakimiyeti' : 'Word Mastery'}
        </h2>
      </div>
      <div className="pd-card-body">
        <div className="pd-mastery-bars">
          {rows.map((row) => (
            <div key={row.label} className="pd-mastery-row">
              <div className="pd-mastery-labels">
                <span className="pd-mastery-box-label">{row.label}</span>
                <span className="pd-mastery-count">
                  {row.count} {lang === 'tr' ? 'kelime' : 'words'}
                </span>
              </div>
              <div className="pd-bar-track">
                <div
                  className={`pd-bar-fill ${row.fillClass}`}
                  style={{ width: `${total > 0 ? (row.count / total) * 100 : 0}%` }}
                />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--text-muted)' }}>
                {row.desc}
              </span>
            </div>
          ))}
        </div>
        <p className="pd-mastery-total">
          {lang === 'tr'
            ? `Aralıklı tekrar sisteminde toplam ${total} kelime`
            : `${total} words total in spaced repetition system`}
        </p>
      </div>
    </div>
  );
}

function ActivityBreakdown({
  breakdown,
  lang,
}: {
  breakdown: Record<string, number>;
  lang: string;
}) {
  const ACTIVITY_LABELS_TR: Record<string, string> = {
    phonics:   'Fonik',
    game:      'Oyun',
    reading:   'Okuma',
    song:      'Sarki',
    review:    'Tekrar',
    challenge: 'Meydan Okuma',
  };

  const entries = Object.entries(breakdown)
    .map(([type, seconds]) => ({ type, minutes: Math.round(seconds / 60) }))
    .filter((e) => e.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const maxMinutes = entries.length > 0 ? entries[0].minutes : 1;

  const activityIconClass: Record<string, string> = {
    phonics:   'pd-activity-icon--phonics',
    game:      'pd-activity-icon--game',
    reading:   'pd-activity-icon--reading',
    song:      'pd-activity-icon--song',
    review:    'pd-activity-icon--review',
    challenge: 'pd-activity-icon--challenge',
  };

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconBarChart size={16} />
          {lang === 'tr' ? 'Aktivite Dağılımı' : 'Activity Breakdown'}
        </h2>
      </div>
      {entries.length === 0 ? (
        <EmptyCard
          message={lang === 'tr' ? 'Henüz aktivite kaydedilmedi.' : 'No activities logged yet.'}
          lang={lang}
        />
      ) : (
        <div className="pd-card-body">
          <div className="pd-activity-list">
            {entries.map(({ type, minutes }) => (
              <div key={type} className="pd-activity-row">
                <div className={`pd-activity-icon ${activityIconClass[type] ?? 'pd-activity-icon--phonics'}`}>
                  {type === 'phonics'   && <IconGrid size={14} />}
                  {type === 'game'      && <IconZap size={14} />}
                  {type === 'reading'   && <IconBook size={14} />}
                  {type === 'song'      && <IconStar size={14} />}
                  {type === 'review'    && <IconClock size={14} />}
                  {type === 'challenge' && <IconFlame size={14} />}
                  {!['phonics','game','reading','song','review','challenge'].includes(type) && <IconBarChart size={14} />}
                </div>
                <span className="pd-activity-label">{lang === 'tr' ? (ACTIVITY_LABELS_TR[type] ?? type) : type}</span>
                <div className="pd-activity-bar-wrap">
                  <div
                    className="pd-activity-bar-fill"
                    style={{
                      width: `${(minutes / maxMinutes) * 100}%`,
                      background: getActivityColor(type),
                    }}
                  />
                </div>
                <span className="pd-activity-minutes">{fmtMinutes(minutes)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PhonicsProgress({
  soundMastery,
  lang,
}: {
  soundMastery: Record<string, number>;
  lang: string;
}) {
  const soundsWithData = ALL_SOUNDS.map((sound) => ({
    id: sound.id,
    grapheme: sound.grapheme,
    mastery: soundMastery[sound.id] ?? 0,
    hasPracticed: (soundMastery[sound.id] ?? 0) > 0,
  }));

  const mastered = soundsWithData.filter((s) => s.mastery >= 80).length;
  const learning = soundsWithData.filter((s) => s.mastery > 0 && s.mastery < 80).length;

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconGrid size={16} />
          {lang === 'tr' ? 'Fonik İlerleme' : 'Phonics Progress'}
        </h2>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>
          {lang === 'tr'
            ? `${mastered} öğrenildi · ${learning} devam ediyor · toplam ${ALL_SOUNDS.length} ses`
            : `${mastered} mastered · ${learning} in progress · ${ALL_SOUNDS.length} total sounds`}
        </span>
      </div>
      <div className="pd-card-body">
        <div className="pd-phonics-grid">
          {soundsWithData.map((sound) => {
            let chipClass = 'pd-phonics-chip pd-phonics-chip--new';
            if (sound.mastery >= 80) chipClass = 'pd-phonics-chip pd-phonics-chip--mastered';
            else if (sound.mastery > 0) chipClass = 'pd-phonics-chip pd-phonics-chip--learning';

            return (
              <div key={sound.id} className={chipClass} title={`${sound.grapheme}: ${sound.mastery}%`}>
                <span className="pd-phonics-grapheme">{sound.grapheme}</span>
                {sound.hasPracticed && (
                  <span className="pd-phonics-pct">{sound.mastery}%</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="pd-phonics-legend">
          <div className="pd-phonics-legend-item">
            <span className="pd-phonics-legend-dot pd-phonics-legend-dot--mastered" />
            {lang === 'tr' ? 'Öğrenildi (%80+)' : 'Mastered (80%+)'}
          </div>
          <div className="pd-phonics-legend-item">
            <span className="pd-phonics-legend-dot pd-phonics-legend-dot--learning" />
            {lang === 'tr' ? 'Devam ediyor' : 'In progress'}
          </div>
          <div className="pd-phonics-legend-item">
            <span className="pd-phonics-legend-dot pd-phonics-legend-dot--new" />
            {lang === 'tr' ? 'Başlanmadı' : 'Not started'}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentBadges({ badgeIds, lang }: { badgeIds: string[]; lang: string }) {
  const recent = badgeIds.slice(-3).reverse();
  const badgeMap = Object.fromEntries(ALL_BADGES.map((b) => [b.id, b]));

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconAward size={16} />
          {lang === 'tr' ? 'Son Başarımlar' : 'Recent Achievements'}
        </h2>
      </div>
      {recent.length === 0 ? (
        <EmptyCard
          message={
            lang === 'tr'
              ? 'Henüz rozet kazanılmadı — pratik yapmaya devam et!'
              : 'No badges earned yet — keep practicing!'
          }
          lang={lang}
        />
      ) : (
        <div className="pd-card-body">
          <div className="pd-badges-list">
            {recent.map((id) => {
              const badge = badgeMap[id];
              if (!badge) return null;
              return (
                <div key={id} className="pd-badge-row">
                  <div className="pd-badge-icon">
                    <BadgeIconNode icon={badge.icon} />
                  </div>
                  <div>
                    <div className="pd-badge-name">{lang === 'tr' ? badge.nameTr : badge.name}</div>
                    <div className="pd-badge-desc">{lang === 'tr' ? badge.descriptionTr : badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WeeklyInsight({ data, lang }: { data: DashboardData; lang: string }) {
  const { weeklyReport, insights } = data;
  const firstInsight = insights.length > 0 ? insights[0] : null;

  if (weeklyReport.sessionsCompleted === 0 && !firstInsight) {
    return (
      <div className="pd-card">
        <div className="pd-card-header">
          <h2 className="pd-card-title">
            <IconLightbulb size={16} />
            {lang === 'tr' ? 'Haftalık İpucu' : 'Weekly Insight'}
          </h2>
        </div>
        <EmptyCard
          message={
            lang === 'tr'
              ? 'Bu hafta henüz oturum tamamlanmadı. Öneriler için pratik yapmaya başla.'
              : 'No sessions completed this week. Start practicing to get insights.'
          }
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="pd-card">
      <div className="pd-card-header">
        <h2 className="pd-card-title">
          <IconLightbulb size={16} />
          {lang === 'tr' ? 'Haftalık İpucu' : 'Weekly Insight'}
        </h2>
      </div>
      <div className="pd-card-body">
        <div className="pd-insight">
          <p className="pd-insight-recommendation">{weeklyReport.recommendation}</p>
          {firstInsight && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.6 }}>
              {lang === 'tr' ? firstInsight.descriptionTr : firstInsight.description}
            </p>
          )}
          <div className="pd-insight-meta">
            <div className="pd-insight-stat">
              <IconClock size={12} />
              <span>
                {lang === 'tr' ? 'Bu haftaki oturum: ' : 'Sessions this week: '}
                <strong>{weeklyReport.sessionsCompleted}</strong>
              </span>
            </div>
            <div className="pd-insight-stat">
              <IconStar size={12} />
              <span>
                {lang === 'tr' ? 'Doğruluk: ' : 'Accuracy: '}
                <strong>{weeklyReport.overallAccuracy}%</strong>
              </span>
            </div>
            <div className="pd-insight-stat">
              <IconAward size={12} />
              <span>
                {lang === 'tr' ? 'Öğrenilen sesler: ' : 'Sounds mastered: '}
                <strong>{weeklyReport.soundsMastered.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="pd-skeleton">
      <div className="pd-skeleton-row">
        <div className="pd-skel pd-skel--h80 pd-skel--w1" />
        <div className="pd-skel pd-skel--h80 pd-skel--w1" />
        <div className="pd-skel pd-skel--h80 pd-skel--w1" />
        <div className="pd-skel pd-skel--h80 pd-skel--w1" />
      </div>
      <div className="pd-skeleton-row">
        <div className="pd-skel pd-skel--h160 pd-skel--w2" />
        <div className="pd-skel pd-skel--h160 pd-skel--w1" />
      </div>
      <div className="pd-skeleton-row">
        <div className="pd-skel pd-skel--h240 pd-skel--w1" />
        <div className="pd-skel pd-skel--h240 pd-skel--w1" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ParentDashboard() {
  const { user, userProfile } = useAuth();
  const { stats } = useGamification();
  const { lang } = useLanguage();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<PhonicsAssessment | null>(null);

  const handleGenerateReport = useCallback(() => {
    if (!activeChildId) return;
    try {
      const assessment = generateAssessment(activeChildId, '30days');
      setReportData(assessment);
    } catch {
      // Assessment generation can fail if there is no data yet
      setReportData(null);
    }
  }, [activeChildId]);

  const handlePrintReport = useCallback(() => {
    window.print();
  }, []);

  // Load children list
  useEffect(() => {
    if (!user?.uid) return;
    const list = getChildren(user.uid);
    setChildren(list);
    if (list.length > 0) {
      setActiveChildId(list[0].id);
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  // Load dashboard data whenever the selected child changes
  useEffect(() => {
    if (!activeChildId) return;

    setLoading(true);

    // Set adaptive engine to operate on this child's data
    setActiveUser(activeChildId);

    const weeklySummary     = getWeeklySummary(activeChildId);
    const activityBreakdown = getActivityBreakdown(activeChildId);
    const weeklyActivity    = getWeeklyActivityData(activeChildId);
    const monthlyActivity   = getMonthlyActivityData(activeChildId);
    const srsState          = getSRSState(activeChildId);
    const weeklyReport      = generateWeeklyReport();
    const insights          = getLearnerInsights();
    const learnerProfile    = getLearnerProfile();

    // SRS box counts
    const wordEntries = Object.values(srsState.words);
    const srsBox1 = wordEntries.filter((w) => w.box === 1).length;
    const srsBox2 = wordEntries.filter((w) => w.box === 2).length;
    const srsBox3 = wordEntries.filter((w) => w.box === 3).length;
    const srsTotal = wordEntries.length;

    // Sound mastery map from adaptive engine profile
    const soundMastery: Record<string, number> = {};
    for (const [id, data] of Object.entries(learnerProfile.soundMastery)) {
      soundMastery[id] = data.mastery;
    }

    setDashData({
      weeklySummary,
      activityBreakdown,
      weeklyActivity,
      monthlyActivity,
      srsBox1,
      srsBox2,
      srsBox3,
      srsTotal,
      weeklyReport,
      insights,
      soundMastery,
    });

    setLoading(false);
  }, [activeChildId]);

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId) ?? null,
    [children, activeChildId],
  );

  // When no children and using parent's own stats (fallback)
  const badgeIds: string[] = stats.badges ?? [];

  // Guard: only parent role
  if (userProfile && userProfile.role !== 'parent') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="pd-page">
      {/* Header */}
      <header className="pd-header">
        <div className="pd-header-title">
          <div className="pd-header-icon">
            <IconUsers size={22} />
          </div>
          <div>
            <h1>{lang === 'tr' ? 'Ebeveyn Paneli' : 'Parent Dashboard'}</h1>
            <p className="pd-header-sub">
              {activeChild
                ? lang === 'tr'
                  ? `${activeChild.name} için ilerleme görüntüleniyor`
                  : `Viewing progress for ${activeChild.name}`
                : lang === 'tr'
                  ? 'Çocuğunuzun öğrenme ilerlemesine genel bakış'
                  : "Your child's learning progress at a glance"}
            </p>
          </div>
        </div>

        {/* Child selector tabs */}
        {children.length > 0 && (
          <div className="pd-child-selector" role="tablist" aria-label={lang === 'tr' ? 'Çocuk seçici' : 'Child selector'}>
            {children.map((child) => (
              <button
                key={child.id}
                role="tab"
                aria-selected={child.id === activeChildId}
                className={`pd-child-tab${child.id === activeChildId ? ' pd-child-tab--active' : ''}`}
                onClick={() => setActiveChildId(child.id)}
              >
                <span className="pd-child-avatar">{child.avatar}</span>
                {child.name}
              </button>
            ))}
          </div>
        )}

        {/* Generate report button */}
        {activeChildId && !loading && (
          <button
            className="pd-report-btn"
            onClick={handleGenerateReport}
            title={lang === 'tr' ? 'Fonik Değerlendirme Raporu Oluştur' : 'Generate Phonics Assessment Report'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {lang === 'tr' ? 'Rapor Oluştur' : 'Generate Report'}
          </button>
        )}
      </header>

      {/* Content */}
      {!loading && children.length === 0 ? (
        <main className="pd-content">
          <div className="pd-card">
            <div className="pd-empty">
              <IconUsers size={40} />
              <p className="pd-empty-title">
                {lang === 'tr' ? 'Henüz bir profil eklenmedi' : 'No child profiles yet'}
              </p>
              <p className="pd-empty-sub">
                {lang === 'tr'
                  ? 'Ilerlemeyi takip etmek icin cocuk profili ekleyin.'
                  : 'Add a child profile to start tracking progress.'}
              </p>
            </div>
          </div>
        </main>
      ) : loading || !dashData ? (
        <LoadingSkeleton />
      ) : (
        <main className="pd-content">
          {/* This week summary */}
          <section aria-label={lang === 'tr' ? 'Haftalık özet' : 'Weekly summary'}>
            <p className="pd-section-label">{lang === 'tr' ? 'Bu hafta' : 'This week'}</p>
            <SummaryCards data={dashData} childProfile={activeChild} lang={lang} />
          </section>

          {/* Streak calendar + Word mastery */}
          <div className="pd-three-col">
            <StreakCalendar
              monthlyActivity={dashData.monthlyActivity}
              streakDays={activeChild?.streak_days ?? 0}
              lang={lang}
            />
            <WordMasteryChart
              box1={dashData.srsBox1}
              box2={dashData.srsBox2}
              box3={dashData.srsBox3}
              total={dashData.srsTotal}
              lang={lang}
            />
          </div>

          {/* Activity breakdown + Recent badges */}
          <div className="pd-two-col">
            <ActivityBreakdown breakdown={dashData.activityBreakdown} lang={lang} />
            <RecentBadges badgeIds={badgeIds} lang={lang} />
          </div>

          {/* Phonics progress */}
          <section aria-label={lang === 'tr' ? 'Fonik ilerleme' : 'Phonics progress'}>
            <PhonicsProgress soundMastery={dashData.soundMastery} lang={lang} />
          </section>

          {/* Weekly insight */}
          <section aria-label={lang === 'tr' ? 'Haftalık ipucu' : 'Weekly insight'}>
            <WeeklyInsight data={dashData} lang={lang} />
          </section>
        </main>
      )}

      {/* Assessment report overlay */}
      {reportData && activeChildId && (
        <AssessmentReport
          assessment={reportData}
          studentName={activeChild?.name ?? (lang === 'tr' ? 'Öğrenci' : 'Student')}
          userId={activeChildId}
          onPrint={handlePrintReport}
          onClose={() => setReportData(null)}
        />
      )}
    </div>
  );
}
