/**
 * Reading Progress Service
 * Persists WPM records and quiz scores per user via localStorage.
 */

import { LS_READING_PROGRESS } from '../config/storageKeys';

interface ReadingRecord {
  contentId: string;
  completedAt: string; // ISO
  wpm: number;
  quizScore?: number;
}

const LS_KEY = LS_READING_PROGRESS;

type ProgressStore = Record<string, ReadingRecord[]>;

function loadStore(): ProgressStore {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

function saveStore(store: ProgressStore): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function getReadingHistory(userId: string): ReadingRecord[] {
  const store = loadStore();
  return store[userId] ?? [];
}

const MAX_RECORDS_PER_USER = 500;

export function saveReadingRecord(userId: string, record: ReadingRecord): void {
  const store = loadStore();
  if (!store[userId]) {
    store[userId] = [];
  }
  store[userId].push(record);

  // Prevent unbounded localStorage growth — keep most recent records
  if (store[userId].length > MAX_RECORDS_PER_USER) {
    store[userId] = store[userId].slice(-MAX_RECORDS_PER_USER);
  }

  saveStore(store);
}

export function getAverageWPM(userId: string): number {
  const history = getReadingHistory(userId);
  if (history.length === 0) return 0;
  const total = history.reduce((sum, r) => sum + r.wpm, 0);
  return Math.round(total / history.length);
}

export function getBestWPM(userId: string): number {
  const history = getReadingHistory(userId);
  if (history.length === 0) return 0;
  return Math.max(...history.map((r) => r.wpm));
}

export function hasCompletedContent(userId: string, contentId: string): boolean {
  const history = getReadingHistory(userId);
  return history.some((r) => r.contentId === contentId);
}

export function getBestWPMForContent(userId: string, contentId: string): number | null {
  const history = getReadingHistory(userId);
  const records = history.filter((r) => r.contentId === contentId);
  if (records.length === 0) return null;
  return Math.max(...records.map((r) => r.wpm));
}
