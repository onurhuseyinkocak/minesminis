/**
 * AnswerFeedbackPanel — headless event bridge.
 * Dispatches a 'mm:feedback' CustomEvent consumed by GameMascot.
 * Renders nothing itself — the mascot in the right rail handles all UI.
 */
import { useEffect } from 'react';

interface AnswerFeedbackPanelProps {
  feedback: 'correct' | 'wrong' | 'timeout' | null;
  correctAnswer?: string;
  streakCount?: number;
  xpEarned?: number;
  onContinue: () => void;
  continueLabel?: string;
  correctLabel?: string;
  wrongLabel?: string;
  timeoutLabel?: string;
  answerWasLabel?: string;
}

export default function AnswerFeedbackPanel({
  feedback,
  correctAnswer,
  xpEarned = 10,
  onContinue,
  continueLabel = 'Devam',
  answerWasLabel = 'Doğru cevap:',
}: AnswerFeedbackPanelProps) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('mm:feedback', {
        detail: { feedback, onContinue, xpEarned, correctAnswer, answerWasLabel, continueLabel },
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  return null;
}
