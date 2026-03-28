// ============================================================
// PhonicsIntroActivity — Animated sound introduction card
// Used for 'sound-intro' activity type in the phonics curriculum
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Check, ChevronRight } from 'lucide-react';
import { PHONICS_GROUPS } from '../../data/phonics';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Activity } from '../../data/curriculum';

interface PhonicsIntroActivityProps {
  activity: Activity & { titleTr?: string };
  phonicsFocus: string[]; // e.g. ['g1_s', 'g1_a']
  onComplete: (score: number, total: number) => void;
  lang: string;
}

// Derive the sound grapheme from phonicsFocus IDs by looking up PHONICS_GROUPS
function getSoundsFromFocus(phonicsFocus: string[]) {
  const sounds: Array<{
    id: string;
    grapheme: string;
    sound: string;
    ipa: string;
    action: string;
    actionTr: string;
    keywords: string[];
    mnemonicEmoji: string;
    turkishNote: string;
    story: string;
    storyTr: string;
  }> = [];

  for (const focusId of phonicsFocus) {
    for (const group of PHONICS_GROUPS) {
      const found = group.sounds.find((s) => s.id === focusId);
      if (found) {
        sounds.push(found);
        break;
      }
    }
  }
  return sounds;
}

function speakText(text: string, rate = 0.75) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

/**
 * Speak the phoneme sound, not the letter name.
 * Single-char graphemes are repeated 3x slowly to produce the isolated phoneme sound
 * (e.g. "sss" sounds like /s/, not "ess"). Multi-char digraphs speak as-is.
 */
function speakPhonemeSound(grapheme: string, rate = 0.55) {
  const soundText = grapheme.length === 1
    ? `${grapheme}${grapheme}${grapheme}` // repeat to isolate phoneme
    : grapheme; // digraphs like "sh", "ch" — speak as word
  speakText(soundText, rate);
}

const VOWEL_GRAPHEMES = new Set(['a', 'e', 'i', 'o', 'u', 'ai', 'ee', 'oo', 'ie', 'oa', 'ou', 'ue']);

function isVowelSound(grapheme: string): boolean {
  return VOWEL_GRAPHEMES.has(grapheme.toLowerCase());
}

export function PhonicsIntroActivity({
  activity,
  phonicsFocus,
  onComplete,
  lang,
}: PhonicsIntroActivityProps) {
  const { t } = useLanguage();
  const isTr = lang === 'tr';
  const sounds = getSoundsFromFocus(phonicsFocus);
  const [currentSoundIdx, setCurrentSoundIdx] = useState(0);
  const [played, setPlayed] = useState(false);
  const [done, setDone] = useState(false);

  const currentSound = sounds[currentSoundIdx];

  // Auto-play the phoneme sound on mount and when sound changes
  useEffect(() => {
    if (currentSound) {
      const timer = setTimeout(() => {
        speakPhonemeSound(currentSound.grapheme);
        setPlayed(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentSoundIdx, currentSound]);

  const handlePlaySound = useCallback(() => {
    if (!currentSound) return;
    speakPhonemeSound(currentSound.grapheme);
    setPlayed(true);
  }, [currentSound]);

  const handlePlayWord = useCallback((word: string) => {
    speakText(word, 0.75);
  }, []);

  const handleNext = useCallback(() => {
    if (currentSoundIdx < sounds.length - 1) {
      setCurrentSoundIdx((i) => i + 1);
      setPlayed(false);
    } else {
      setDone(true);
      setTimeout(() => onComplete(1, 1), 600);
    }
  }, [currentSoundIdx, sounds.length, onComplete]);

  // No phonics sound data available — show description and complete
  if (!currentSound) {
    return (
      <div className="phonics-intro phonics-intro--description-only">
        <p className="phonics-intro__desc">{activity.instructions}</p>
        <button
          type="button"
          className="phonics-intro__done-btn"
          onClick={() => onComplete(1, 1)}
        >
          <Check size={18} />
          {t('games.phonicsGotIt')}
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        className="phonics-intro phonics-intro--done"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="phonics-intro__done-icon">
          <Check size={48} strokeWidth={3} />
        </div>
        <p className="phonics-intro__done-text">
          {t('games.phonicsAmazing')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="phonics-intro">
      {/* Sound counter if multiple sounds in unit */}
      {sounds.length > 1 && (
        <p className="phonics-intro__counter">
          {currentSoundIdx + 1} / {sounds.length}
        </p>
      )}

      {/* Big grapheme display — tapping plays the SOUND (phoneme), not the letter name */}
      <motion.button
        type="button"
        className="phonics-intro__grapheme-btn"
        onClick={handlePlaySound}
        whileTap={{ scale: 0.92 }}
        aria-label={`Play phoneme sound for: ${currentSound.grapheme}`}
      >
        <span className="phonics-intro__grapheme">{currentSound.grapheme}</span>
        {/* Show both uppercase and lowercase so children learn the pair together */}
        <span className="phonics-intro__grapheme-case-pair">
          {currentSound.grapheme.toUpperCase()} / {currentSound.grapheme.toLowerCase()}
        </span>
        <span className="phonics-intro__grapheme-ipa">{currentSound.ipa}</span>
        <Volume2 size={20} className="phonics-intro__play-icon" />
      </motion.button>

      {/* Vowel / Consonant badge — explicit pedagogy */}
      <div className="phonics-intro__sound-type-badge" aria-label={isVowelSound(currentSound.grapheme) ? 'Vowel sound' : 'Consonant sound'}>
        {isVowelSound(currentSound.grapheme) ? (
          <span className="phonics-intro__vowel-badge">
            {t('games.phonicsVowel')}
          </span>
        ) : (
          <span className="phonics-intro__consonant-badge">
            {t('games.phonicsConsonant')}
          </span>
        )}
      </div>

      {/* Action / mnemonic */}
      <div className="phonics-intro__action">
        <span className="phonics-intro__mnemonic-emoji" aria-hidden="true">
          {currentSound.mnemonicEmoji}
        </span>
        <p className="phonics-intro__action-text">
          {isTr ? currentSound.actionTr : currentSound.action}
        </p>
      </div>

      {/* Story / description */}
      <p className="phonics-intro__story">
        {isTr ? currentSound.storyTr : currentSound.story}
      </p>

      {/* Turkish trap (if any) */}
      {currentSound.turkishNote && isTr && (
        <div className="phonics-intro__turkish-note">
          <span className="phonics-intro__turkish-note-label">Dikkat!</span>
          {currentSound.turkishNote}
        </div>
      )}

      {/* Keywords row */}
      {currentSound.keywords && currentSound.keywords.length > 0 && (
        <div className="phonics-intro__keywords">
          {currentSound.keywords.slice(0, 6).map((kw) => (
            <button
              key={kw}
              type="button"
              className="phonics-intro__keyword"
              onClick={() => handlePlayWord(kw)}
              aria-label={`Say: ${kw}`}
            >
              {kw}
              <Volume2 size={12} className="phonics-intro__kw-icon" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Next / Done button */}
      <button
        type="button"
        className={`phonics-intro__next-btn${!played ? ' phonics-intro__next-btn--disabled' : ''}`}
        onClick={played ? handleNext : handlePlaySound}
        aria-label={played ? (currentSoundIdx < sounds.length - 1 ? 'Next sound' : 'Complete') : 'Play sound first'}
        aria-disabled={!played}
      >
        {!played ? (
          <>
            <Volume2 size={18} />
            {t('games.phonicsListenFirst')}
          </>
        ) : currentSoundIdx < sounds.length - 1 ? (
          <>
            {t('games.phonicsNextSound')}
            <ChevronRight size={18} />
          </>
        ) : (
          <>
            <Check size={18} />
            {t('games.phonicsGotIt')}
          </>
        )}
      </button>
    </div>
  );
}
