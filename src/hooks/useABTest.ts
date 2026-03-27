/**
 * useABTest — React hook for easy A/B test consumption.
 * Returns the assigned variant and a pre-bound track helper.
 */
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getVariant, trackEvent } from '../services/abTest';

export function useABTest(testId: string): {
  variant: string;
  track: (event: string, value?: number) => void;
} {
  const { user } = useAuth();
  const userId = user?.uid ?? 'anonymous';

  const variant = getVariant(userId, testId);

  const track = useCallback(
    (event: string, value?: number) => {
      trackEvent(userId, testId, event, value);
    },
    [userId, testId],
  );

  return { variant, track };
}
