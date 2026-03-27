/**
 * Lightweight A/B testing — deterministic bucketing via userId hash
 * No external dependencies, persists to localStorage
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ABTest {
  id: string;
  variants: string[];
  weight?: number[];
  description?: string;
}

export interface ABEvent {
  testId: string;
  variant: string;
  event: string;
  value?: number;
  timestamp: number;
}

// ── Active Tests ───────────────────────────────────────────────────────────────

const ACTIVE_TESTS: ABTest[] = [
  {
    id: 'lesson_phase_order',
    variants: ['standard', 'speak_first'],
    description: 'Test if speaking early improves engagement',
  },
  {
    id: 'mascot_frequency',
    variants: ['normal', 'frequent', 'minimal'],
    description: 'How often Mimi appears in lessons',
  },
  {
    id: 'hearts_system',
    variants: ['enabled', 'disabled'],
    description: 'A/B test hearts vs no hearts for older users',
  },
  {
    id: 'reward_style',
    variants: ['stars', 'xp_only', 'badges'],
    description: 'Which reward visual is more motivating',
  },
];

// ── Internals ──────────────────────────────────────────────────────────────────

/**
 * djb2 hash — maps a string to a non-negative 32-bit integer.
 * Deterministic: same input always produces the same output.
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // >>> 0 converts to unsigned 32-bit integer
  return hash >>> 0;
}

/**
 * Resolve which bucket index a hash falls into, respecting optional weights.
 * If weights are omitted every variant gets equal probability.
 */
function resolveBucketIndex(hash: number, test: ABTest): number {
  const { variants, weight } = test;

  if (!weight || weight.length !== variants.length) {
    return hash % variants.length;
  }

  const total = weight.reduce((sum, w) => sum + w, 0);
  const position = hash % total;

  let cumulative = 0;
  for (let i = 0; i < weight.length; i++) {
    cumulative += weight[i];
    if (position < cumulative) return i;
  }

  // Fallback (should never reach here)
  return variants.length - 1;
}

function getStorageKey(userId: string): string {
  return `mm_ab_events_${userId}`;
}

function loadEvents(userId: string): ABEvent[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ABEvent[];
  } catch {
    return [];
  }
}

function saveEvents(userId: string, events: ABEvent[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(events));
  } catch {
    // localStorage can throw in private mode / when quota exceeded — fail silently
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Returns the variant assigned to `userId` for `testId`.
 * Deterministic: same userId always gets the same variant for a given test.
 * Returns empty string if the test is not found in ACTIVE_TESTS.
 */
export function getVariant(userId: string, testId: string): string {
  const test = ACTIVE_TESTS.find((t) => t.id === testId);
  if (!test) return '';

  const hash = djb2Hash(`${userId}:${testId}`);
  const index = resolveBucketIndex(hash, test);
  return test.variants[index];
}

/**
 * Returns a map of testId → variant for every active test.
 */
export function getAllVariants(userId: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const test of ACTIVE_TESTS) {
    result[test.id] = getVariant(userId, test.id);
  }
  return result;
}

/**
 * Logs a conversion/engagement event for the given test.
 * Stored in localStorage under `mm_ab_events_${userId}`.
 */
export function trackEvent(
  userId: string,
  testId: string,
  event: string,
  value?: number,
): void {
  const variant = getVariant(userId, testId);
  if (!variant) return; // unknown test — skip

  const entry: ABEvent = {
    testId,
    variant,
    event,
    value,
    timestamp: Date.now(),
  };

  const events = loadEvents(userId);
  events.push(entry);
  saveEvents(userId, events);
}

/**
 * Returns a per-test summary: which variant the user is in and all events
 * they have generated for that test.
 */
export function getTestResults(
  userId: string,
): Record<string, { variant: string; events: ABEvent[] }> {
  const events = loadEvents(userId);
  const result: Record<string, { variant: string; events: ABEvent[] }> = {};

  for (const test of ACTIVE_TESTS) {
    const variant = getVariant(userId, test.id);
    result[test.id] = {
      variant,
      events: events.filter((e) => e.testId === test.id),
    };
  }

  return result;
}

/**
 * Convenience boolean — true when the user is in a specific variant.
 */
export function isInVariant(
  userId: string,
  testId: string,
  variant: string,
): boolean {
  return getVariant(userId, testId) === variant;
}
