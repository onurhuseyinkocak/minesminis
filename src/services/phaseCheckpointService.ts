/**
 * Phase Checkpoint Service
 * At the end of each Phase, a mini-test checks if the child has truly mastered the material.
 * If score >= 70%, they advance. Otherwise, targeted review is suggested.
 */

import { PHASES } from '../data/curriculumPhases';
import { kidsWords } from '../data/wordsData';
import type { KidsWord } from '../data/wordsData';

const CHECKPOINT_KEY = 'mimi_phase_checkpoints';

export interface CheckpointResult {
  phaseIndex: number;
  passed: boolean;
  score: number;
  total: number;
  date: string;
  attempts: number;
}

function getCheckpoints(): CheckpointResult[] {
  try {
    return JSON.parse(localStorage.getItem(CHECKPOINT_KEY) ?? '[]') as CheckpointResult[];
  } catch { return []; }
}

export function saveCheckpointResult(result: Omit<CheckpointResult, 'date'>): void {
  const checkpoints = getCheckpoints();
  const existing = checkpoints.findIndex(c => c.phaseIndex === result.phaseIndex);
  const entry: CheckpointResult = { ...result, date: new Date().toISOString() };

  if (existing >= 0) {
    // Update attempts, keep best score
    entry.attempts = (checkpoints[existing].attempts ?? 1) + 1;
    if (checkpoints[existing].score > result.score) {
      entry.score = checkpoints[existing].score;
      entry.passed = checkpoints[existing].passed;
    }
    checkpoints[existing] = entry;
  } else {
    entry.attempts = 1;
    checkpoints.push(entry);
  }

  localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(checkpoints));
}

export function hasPassedCheckpoint(phaseIndex: number): boolean {
  return getCheckpoints().some(c => c.phaseIndex === phaseIndex && c.passed);
}

export function getCheckpointResult(phaseIndex: number): CheckpointResult | null {
  return getCheckpoints().find(c => c.phaseIndex === phaseIndex) ?? null;
}

export function isPhaseComplete(phaseIndex: number, unitsCompleted: number, totalUnits: number): boolean {
  // Phase is complete when 80% of units done AND checkpoint passed
  const unitsPct = totalUnits > 0 ? unitsCompleted / totalUnits : 0;
  return unitsPct >= 0.8 && hasPassedCheckpoint(phaseIndex);
}

/**
 * Get questions for a phase checkpoint test.
 * Uses words from that phase's units.
 */
export function getCheckpointQuestions(phaseIndex: number): Array<{
  question: string;
  options: string[];
  correct: string;
  emoji?: string;
}> {
  const phase = PHASES[phaseIndex];
  if (!phase) return [];

  // Get vocabulary themes from this phase
  const themes = phase.units
    .map((u) => u.vocabularyTheme)
    .filter((v): v is string => Boolean(v));

  const phaseWords: KidsWord[] = kidsWords.filter((w) =>
    w.category && themes.includes(w.category)
  );

  // Need at least 5 words total for meaningful questions (1 correct + 3 distractors per question)
  if (phaseWords.length < 5) return [];

  // Pick up to 5 question words randomly
  const questionWords = [...phaseWords].sort(() => Math.random() - 0.5).slice(0, 5);

  return questionWords.map((word) => {
    const correct = word.word;
    // Distractors come from ALL phaseWords (not the limited subset) to ensure 3 unique options
    const distractorPool = phaseWords.filter((w) => w.word !== correct);
    const distractors = [...distractorPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.word);

    // If not enough distractors (< 3), pad with fallbacks to always show 4 options
    const fallbacks = ['cat', 'dog', 'run', 'big', 'red', 'sun'].filter(
      (f) => f !== correct && !distractors.includes(f)
    );
    while (distractors.length < 3 && fallbacks.length > 0) {
      distractors.push(fallbacks.shift()!);
    }

    const options = [...distractors, correct].sort(() => Math.random() - 0.5);

    return {
      question: word.emoji ? `${word.emoji} Bu ne?` : `"${word.turkish}" ne demek?`,
      options,
      correct,
      emoji: word.emoji,
    };
  });
}
