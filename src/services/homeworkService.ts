/**
 * HOMEWORK SERVICE
 * MinesMinis — Parent-assigned word practice
 *
 * Parents can assign specific word categories for their child to practice.
 * Homework words are injected into the DailyLesson review phase so the
 * child encounters them even if they are not yet due in spaced repetition.
 */

import { kidsWords, type KidsWord } from '../data/wordsData';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomeworkEntry {
  /** English word (lowercase, matches KidsWord.word) */
  word: string;
  /** ISO timestamp when parent assigned this word */
  assignedAt: string;
  /** Category label shown in the UI */
  category: string;
}

export interface HomeworkData {
  userId: string;
  words: HomeworkEntry[];
  updatedAt: string;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

function homeworkKey(userId: string): string {
  return `mm_homework_${userId}`;
}

// ─── Read / Write ─────────────────────────────────────────────────────────────

export function getHomework(userId: string): HomeworkData {
  try {
    const raw = localStorage.getItem(homeworkKey(userId));
    if (raw) return JSON.parse(raw) as HomeworkData;
  } catch {
    // ignore
  }
  return { userId, words: [], updatedAt: new Date().toISOString() };
}

function saveHomework(data: HomeworkData): void {
  try {
    localStorage.setItem(homeworkKey(data.userId), JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function assignHomeworkWord(userId: string, word: string, category: string): void {
  const data = getHomework(userId);
  const lower = word.toLowerCase();
  if (data.words.some((e) => e.word === lower)) return; // already assigned
  data.words.push({ word: lower, assignedAt: new Date().toISOString(), category });
  data.updatedAt = new Date().toISOString();
  saveHomework(data);
}

export function removeHomeworkWord(userId: string, word: string): void {
  const data = getHomework(userId);
  data.words = data.words.filter((e) => e.word !== word.toLowerCase());
  data.updatedAt = new Date().toISOString();
  saveHomework(data);
}

export function clearHomework(userId: string): void {
  const data = getHomework(userId);
  data.words = [];
  data.updatedAt = new Date().toISOString();
  saveHomework(data);
}

// ─── Resolved KidsWord list ───────────────────────────────────────────────────

/** Return the KidsWord objects for the current homework list.
 *  Words not found in the curriculum are silently skipped. */
export function getHomeworkWords(userId: string): KidsWord[] {
  const data = getHomework(userId);
  const wordMap = new Map(kidsWords.map((w) => [w.word.toLowerCase(), w]));
  return data.words
    .map((e) => wordMap.get(e.word))
    .filter((w): w is KidsWord => w !== undefined);
}

// ─── Category summary ─────────────────────────────────────────────────────────

/** Unique categories present in the full word list — used for the assign UI. */
export function getWordCategories(): string[] {
  const cats = new Set(kidsWords.map((w) => w.category));
  return Array.from(cats).sort();
}

/** Words in a given category */
export function getWordsByCategory(category: string): KidsWord[] {
  return kidsWords.filter((w) => w.category === category);
}
