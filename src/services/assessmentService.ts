/**
 * PHONICS ASSESSMENT SERVICE
 * Generates detailed phonics progress assessments for children.
 * Used by Parent and Teacher dashboards to produce PDF-style reports.
 */

import { ALL_SOUNDS, PHONICS_GROUPS } from '../data/phonics';
import { getLearnerProfile, setActiveUser } from './adaptiveEngine';
import { getRecentActivities } from './activityLogger';

// ============================================================
// TYPES
// ============================================================

export interface SoundAssessmentResult {
  soundId: string;
  soundLabel: string;
  phonicsGroup: number;
  masteryPercent: number;
  status: 'mastered' | 'in_progress' | 'needs_work' | 'not_started';
  correctAttempts: number;
  totalAttempts: number;
  lastPracticed: string | null;
}

export interface PhonicsAssessment {
  studentName: string;
  dateGenerated: string;
  assessmentPeriod: string;

  // Overall summary
  phonicsGroupsMastered: number;
  soundsMastered: number;
  soundsInProgress: number;
  soundsNotStarted: number;
  overallMasteryPercent: number;

  // Per-sound breakdown
  soundResults: SoundAssessmentResult[];

  // Activity stats
  totalLessonsCompleted: number;
  totalTimeMinutes: number;
  averageAccuracy: number;
  streakDays: number;

  // Reading level
  estimatedReadingLevel: string;
  estimatedReadingLevelTr: string;

  // Recommendations
  recommendations: string[];
  recommendationsTr: string[];
}

// ============================================================
// READING LEVEL HELPERS
// ============================================================

export function estimateReadingLevel(
  masteryPercent: number,
  soundsMastered: number,
): string {
  if (soundsMastered === 0 || masteryPercent < 10) return 'Pre-reader';
  if (soundsMastered < 6 || masteryPercent < 25)  return 'Emergent';
  if (soundsMastered < 14 || masteryPercent < 45)  return 'Early';
  if (soundsMastered < 28 || masteryPercent < 70)  return 'Developing';
  return 'Fluent';
}

export function getReadingLevelTr(level: string): string {
  const map: Record<string, string> = {
    'Pre-reader': 'Okuma Öncesi',
    'Emergent':   'Başlangıç',
    'Early':      'Erken Okuyucu',
    'Developing': 'Gelişmekte',
    'Fluent':     'Akıcı Okuyucu',
  };
  return map[level] ?? level;
}

// ============================================================
// STATUS CLASSIFICATION
// ============================================================

function classifyStatus(
  mastery: number,
  attempts: number,
): SoundAssessmentResult['status'] {
  if (attempts === 0) return 'not_started';
  if (mastery >= 80)  return 'mastered';
  if (mastery >= 40)  return 'in_progress';
  return 'needs_work';
}

// ============================================================
// RECOMMENDATIONS
// ============================================================

export function generateRecommendations(
  assessment: PhonicsAssessment,
): { en: string[]; tr: string[] } {
  const en: string[] = [];
  const tr: string[] = [];

  // 1. Streak-based
  if (assessment.streakDays === 0) {
    en.push('Start a daily practice habit — even 5 minutes a day makes a big difference.');
    tr.push('Günlük pratik alışkanlığı edinin — günde 5 dakika bile büyük fark yaratır.');
  } else if (assessment.streakDays < 5) {
    en.push(`Keep the streak going! ${assessment.streakDays} day streak is a great start.`);
    tr.push(`Seriyi sürdürün! ${assessment.streakDays} günlük seri harika bir başlangıç.`);
  } else {
    en.push(`Excellent ${assessment.streakDays}-day streak! Consistency is the key to phonics mastery.`);
    tr.push(`Mükemmel ${assessment.streakDays} günlük seri! Tutarlılık fonik ustalığının anahtarı.`);
  }

  // 2. Accuracy-based
  if (assessment.averageAccuracy < 60) {
    en.push('Focus on accuracy over speed — take extra time with each sound before moving on.');
    tr.push('Hızdan önce doğruluğa odaklanın — bir sonraki sese geçmeden önce her sesle fazladan zaman geçirin.');
  } else if (assessment.averageAccuracy < 80) {
    en.push('Good accuracy! Try the blending exercises to reinforce sounds that are almost mastered.');
    tr.push('Güzel doğruluk! Neredeyse ustalık kazanılan sesleri pekiştirmek için birleştirme egzersizlerini deneyin.');
  }

  // 3. Needs-work sounds
  const needsWork = assessment.soundResults.filter(
    (r) => r.status === 'needs_work',
  );
  if (needsWork.length > 0) {
    const labels = needsWork
      .slice(0, 3)
      .map((r) => `/${r.soundLabel}/`)
      .join(', ');
    en.push(`Prioritize practice on these sounds: ${labels}. Short, frequent sessions work best.`);
    tr.push(`Bu seslere öncelik vererek pratik yapın: ${labels}. Kısa ve sık seanslar en iyi sonucu verir.`);
  }

  // 4. Group-based (introduce next group)
  const masteredGroups = PHONICS_GROUPS.filter((group) => {
    const groupSounds = assessment.soundResults.filter(
      (r) => r.phonicsGroup === group.group,
    );
    return (
      groupSounds.length > 0 &&
      groupSounds.every((r) => r.status === 'mastered')
    );
  });

  if (masteredGroups.length > 0 && masteredGroups.length < 7) {
    const nextGroup = PHONICS_GROUPS[masteredGroups.length];
    if (nextGroup) {
      en.push(
        `Group ${masteredGroups.length} is mastered! Ready to introduce Group ${nextGroup.group}: ${nextGroup.name}.`,
      );
      tr.push(
        `Grup ${masteredGroups.length} tamamlandı! Grup ${nextGroup.group} tanıtmaya hazır: ${nextGroup.nameTr}.`,
      );
    }
  }

  // 5. Not-started sounds prompt
  const notStarted = assessment.soundResults.filter(
    (r) => r.status === 'not_started',
  );
  if (notStarted.length > 5) {
    en.push(
      `${notStarted.length} sounds haven't been introduced yet. Follow the curriculum order for best results.`,
    );
    tr.push(
      `${notStarted.length} ses henüz tanıtılmadı. En iyi sonuçlar için müfredat sırasını takip edin.`,
    );
  }

  // 6. Reading level advancement
  if (
    assessment.estimatedReadingLevel === 'Pre-reader' ||
    assessment.estimatedReadingLevel === 'Emergent'
  ) {
    en.push(
      'Read simple CVC (consonant-vowel-consonant) words together every day to build reading confidence.',
    );
    tr.push(
      'Okuma güvenini oluşturmak için her gün birlikte basit ÜSÜ (ünsüz-sesli-ünsüz) kelimeleri okuyun.',
    );
  }

  return {
    en: en.slice(0, 5),
    tr: tr.slice(0, 5),
  };
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generateAssessment(
  userId: string,
  period: '30days' | 'alltime',
): PhonicsAssessment {
  // Point the adaptive engine at the right user
  setActiveUser(userId);
  const profile = getLearnerProfile();

  // Date window for filtering
  const now = new Date();
  const cutoff = period === '30days'
    ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    : new Date(0);

  // Recent activities
  const recentActivities = getRecentActivities(500, userId).filter(
    (a) => new Date(a.timestamp) >= cutoff,
  );

  // Total lessons and time
  const totalLessonsCompleted = recentActivities.length;
  const totalTimeMinutes = Math.round(
    recentActivities.reduce((sum, a) => sum + a.duration, 0) / 60,
  );

  // Average accuracy
  const accuracyLogs = recentActivities.filter(
    (a) => a.accuracy !== undefined,
  );
  const averageAccuracy =
    accuracyLogs.length > 0
      ? Math.round(
          accuracyLogs.reduce((sum, a) => sum + (a.accuracy ?? 0), 0) /
            accuracyLogs.length,
        )
      : 0;

  // Build per-sound results from adaptive engine profile
  const soundResults: SoundAssessmentResult[] = ALL_SOUNDS.map((sound) => {
    const masteryData = profile.soundMastery[sound.id];

    if (!masteryData || masteryData.attempts === 0) {
      return {
        soundId: sound.id,
        soundLabel: sound.grapheme,
        phonicsGroup: sound.group,
        masteryPercent: 0,
        status: 'not_started',
        correctAttempts: 0,
        totalAttempts: 0,
        lastPracticed: null,
      };
    }

    const masteryPercent = Math.round(masteryData.mastery);
    const status = classifyStatus(masteryPercent, masteryData.attempts);

    return {
      soundId: sound.id,
      soundLabel: sound.grapheme,
      phonicsGroup: sound.group,
      masteryPercent,
      status,
      correctAttempts: masteryData.correctAttempts,
      totalAttempts: masteryData.attempts,
      lastPracticed: masteryData.lastPracticed ?? null,
    };
  });

  // Aggregate counts
  const soundsMastered  = soundResults.filter((r) => r.status === 'mastered').length;
  const soundsInProgress = soundResults.filter(
    (r) => r.status === 'in_progress' || r.status === 'needs_work',
  ).length;
  const soundsNotStarted = soundResults.filter(
    (r) => r.status === 'not_started',
  ).length;

  const overallMasteryPercent =
    soundResults.length > 0
      ? Math.round(
          soundResults.reduce((sum, r) => sum + r.masteryPercent, 0) /
            soundResults.length,
        )
      : 0;

  // Phonics groups mastered (all sounds in group are mastered)
  const phonicsGroupsMastered = PHONICS_GROUPS.filter((group) => {
    const groupSounds = soundResults.filter(
      (r) => r.phonicsGroup === group.group,
    );
    return (
      groupSounds.length > 0 &&
      groupSounds.every((r) => r.status === 'mastered')
    );
  }).length;

  // Reading level
  const estimatedReadingLevel = estimateReadingLevel(
    overallMasteryPercent,
    soundsMastered,
  );
  const estimatedReadingLevelTr = getReadingLevelTr(estimatedReadingLevel);

  // Period label
  const assessmentPeriod =
    period === '30days' ? 'Last 30 days' : 'All time';

  // Date
  const dateGenerated = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Student name placeholder — caller should set this
  const studentName = '';

  const assessment: PhonicsAssessment = {
    studentName,
    dateGenerated,
    assessmentPeriod,
    phonicsGroupsMastered,
    soundsMastered,
    soundsInProgress,
    soundsNotStarted,
    overallMasteryPercent,
    soundResults,
    totalLessonsCompleted,
    totalTimeMinutes,
    averageAccuracy,
    streakDays: profile.currentStreak,
    estimatedReadingLevel,
    estimatedReadingLevelTr,
    recommendations: [],
    recommendationsTr: [],
  };

  const recs = generateRecommendations(assessment);
  assessment.recommendations = recs.en;
  assessment.recommendationsTr = recs.tr;

  return assessment;
}
