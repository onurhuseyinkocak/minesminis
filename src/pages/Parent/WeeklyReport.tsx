/**
 * PARENT WEEKLY REPORT
 * MinesMinis — Beautiful 7-day progress card for parents.
 * Shows totals, per-day breakdown, words learned this week,
 * and an encouragement message.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { KidsWord } from '../../data/wordsData';
import './WeeklyReport.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayData {
  label: string;
  labelTr: string;
  dateStr: string;
  completed: boolean;
  wordsLearned: number;
  score: number;
}

interface WeeklyData {
  totalWords: number;
  lessonsCompleted: number;
  avgScore: number;
  streak: number;
  days: DayData[];
  wordsThisWeek: Array<{ english: string; turkish: string; emoji: string }>;
}

// ─── Data helper ─────────────────────────────────────────────────────────────

function getWeeklyData(userId: string): WeeklyData {
  const days: DayData[] = [];
  let totalWords = 0;
  let lessonsCompleted = 0;
  let totalScore = 0;
  let scoreCount = 0;
  const wordsThisWeek: Array<{ english: string; turkish: string; emoji: string }> = [];

  const DAY_NAMES    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAY_NAMES_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const key = `mm_daily_${userId}_${dateStr}`;
    const saved = localStorage.getItem(key);

    const dayData: DayData = {
      label: DAY_NAMES[d.getDay()],
      labelTr: DAY_NAMES_TR[d.getDay()],
      dateStr,
      completed: false,
      wordsLearned: 0,
      score: 0,
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          completed?: boolean;
          score?: number;
          newWords?: KidsWord[];
        };
        if (parsed.completed) {
          dayData.completed = true;
          dayData.wordsLearned = parsed.newWords?.length ?? 0;
          dayData.score = parsed.score ?? 0;
          totalWords += dayData.wordsLearned;
          lessonsCompleted++;
          totalScore += dayData.score;
          scoreCount++;

          if (parsed.newWords) {
            parsed.newWords.forEach((w) => {
              if (!wordsThisWeek.find((x) => x.english === w.word)) {
                wordsThisWeek.push({
                  english: w.word,
                  turkish: w.turkish,
                  emoji: w.emoji ?? '',
                });
              }
            });
          }
        }
      } catch {
        // ignore
      }
    }

    days.push(dayData);
  }

  return {
    totalWords,
    lessonsCompleted,
    avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
    streak: lessonsCompleted,
    days,
    wordsThisWeek,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WeeklyReport() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const userId = user?.uid ?? 'guest';
  const weekData = useMemo(() => getWeeklyData(userId), [userId]);

  const isTr = lang === 'tr';

  const encouragement =
    weekData.avgScore >= 80
      ? isTr
        ? '🌟 Harika gidiyorsun! Devam et!'
        : '🌟 Amazing progress! Keep it up!'
      : weekData.avgScore >= 50
      ? isTr
        ? '💪 İyi gidiyorsun! Her gün biraz daha iyi!'
        : '💪 Good effort! Getting better every day!'
      : isTr
      ? "🤗 Her adım önemli! Devam edelim!"
      : "🤗 Every step counts! Let's keep going!";

  return (
    <div className="wr">
      {/* Header */}
      <div className="wr-header">
        <Link to="/parent" className="wr-back-btn" aria-label={isTr ? 'Geri' : 'Back'}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="wr-title">
          <BarChart3 size={22} />
          {isTr ? 'Haftalık Rapor' : 'Weekly Report'}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="wr-summary">
        <div className="wr-stat">
          <span className="wr-stat__num">{weekData.totalWords}</span>
          <span className="wr-stat__label">{isTr ? 'Yeni Kelime' : 'New Words'}</span>
        </div>
        <div className="wr-stat">
          <span className="wr-stat__num">{weekData.lessonsCompleted}</span>
          <span className="wr-stat__label">{isTr ? 'Ders Tamamlandı' : 'Lessons Done'}</span>
        </div>
        <div className="wr-stat">
          <span className="wr-stat__num">
            {weekData.avgScore > 0 ? `${weekData.avgScore}%` : '—'}
          </span>
          <span className="wr-stat__label">{isTr ? 'Ortalama Skor' : 'Avg Score'}</span>
        </div>
        <div className="wr-stat">
          <span className="wr-stat__num">{weekData.streak}</span>
          <span className="wr-stat__label">{isTr ? 'Gün Streak' : 'Day Streak'}</span>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="wr-section">
        <h2 className="wr-section__title">
          {isTr ? 'Günlük Detay' : 'Daily Breakdown'}
        </h2>
        <div className="wr-days">
          {weekData.days.map((day, i) => (
            <div
              key={i}
              className={`wr-day${day.completed ? ' wr-day--done' : ''}`}
            >
              <span className="wr-day__icon">
                {day.completed ? '✅' : '⬜'}
              </span>
              <span className="wr-day__date">
                {isTr ? day.labelTr : day.label}
              </span>
              <div className="wr-day__info">
                <span className="wr-day__words">
                  {day.wordsLearned} {isTr ? 'kelime' : 'words'}
                </span>
                <span className="wr-day__score">
                  {day.completed ? `${day.score}%` : '—'}
                </span>
              </div>
              {day.completed && (
                <div
                  className="wr-day__bar"
                  style={{ width: `${day.score}%` }}
                  aria-label={`${day.score}%`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Words Learned This Week */}
      {weekData.wordsThisWeek.length > 0 && (
        <div className="wr-section">
          <h2 className="wr-section__title">
            {isTr ? 'Bu Hafta Öğrenilen Kelimeler' : 'Words Learned This Week'}
          </h2>
          <div className="wr-words-grid">
            {weekData.wordsThisWeek.map((w, i) => (
              <div key={i} className="wr-word-chip">
                <span className="wr-word-chip__emoji">{w.emoji}</span>
                <span className="wr-word-chip__english">{w.english}</span>
                <span className="wr-word-chip__sep">—</span>
                <span className="wr-word-chip__turkish">{w.turkish}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weekData.wordsThisWeek.length === 0 && (
        <div className="wr-empty">
          <p>
            {isTr
              ? 'Bu hafta henüz ders tamamlanmadı. Haydi başlayalım!'
              : "No lessons completed this week yet. Let's get started!"}
          </p>
          <Link to="/daily-lesson" className="wr-cta-btn">
            {isTr ? 'Derse Başla' : 'Start Lesson'}
          </Link>
        </div>
      )}

      {/* Encouragement */}
      <div className="wr-encouragement">{encouragement}</div>
    </div>
  );
}
