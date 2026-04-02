import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { ArrowLeft, ArrowRight, Volume2, Highlighter, CheckCircle, XCircle } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import type { DecodableStory, HighlightedWord } from '../services/decodableStoryService';
import { findWord } from '../data/decodableWordbank';
import { speak as ttsSpeak, stopSpeech } from '../services/ttsService';
import './DecodableStoryReader.css';

// ─── Audio file player (prefers WAV files over browser TTS) ─────────────────
const audioRef = { current: null as HTMLAudioElement | null };

function playStoryAudio(storyId: string, fileId: string, fallbackText: string): void {
  // Stop any playing audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  stopSpeech();

  const url = `/audio/stories/${storyId}/${fileId}.wav`;
  const audio = new Audio(url);
  audioRef.current = audio;

  audio.onerror = () => {
    // WAV not found — fallback to browser TTS
    audioRef.current = null;
    ttsSpeak(fallbackText, { rate: 0.75 });
  };
  audio.play().catch(() => {
    // Play failed — fallback
    audioRef.current = null;
    ttsSpeak(fallbackText, { rate: 0.75 });
  });
}

function stopStoryAudio(): void {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  stopSpeech();
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DecodableStoryReaderProps {
  story: DecodableStory;
  onComplete: () => void;
  highlightMode?: boolean;
  lang?: 'en' | 'tr';
}

// ─── Word Popup ────────────────────────────────────────────────────────────────

interface WordPopupProps {
  word: string;
  type: HighlightedWord['type'];
}

function WordPopup({ word, type }: WordPopupProps) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  const entry = findWord(clean);

  const phonemeBreakdown = entry
    ? clean.split('').join('-')
    : clean.split('').join('-');

  const typeLabel = type === 'decodable'
    ? 'decodable'
    : type === 'sight'
    ? 'sight word'
    : 'tricky word';

  return (
    <span className="dsr-word-popup" role="tooltip">
      <span className="dsr-word-popup__phonemes">{phonemeBreakdown}</span>
      <span className={`dsr-word-popup__type dsr-word-popup__type--${type}`}>
        {typeLabel}
      </span>
    </span>
  );
}

// ─── Word Token ───────────────────────────────────────────────────────────────

interface WordTokenProps {
  token: string;
  type: HighlightedWord['type'];
  highlight: boolean;
  onSpeak: (word: string) => void;
}

function WordToken({ token, type, highlight, onSpeak }: WordTokenProps) {
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    const bare = token.replace(/[^a-zA-Z]/g, '');
    if (bare) {
      onSpeak(bare);
    }
    setShowPopup(true);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setShowPopup(false), 2400);
  }, [token, onSpeak]);

  const bare = token.replace(/[^a-zA-Z]/g, '');
  if (!bare) {
    return <span>{token}</span>;
  }

  const wordClass = highlight
    ? `dsr-word dsr-word--${type}`
    : 'dsr-word';

  return (
    <span
      className={wordClass}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Say: ${bare}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {token}
      {showPopup && highlight && (
        <WordPopup word={bare} type={type} />
      )}
    </span>
  );
}

// ─── Scene View ───────────────────────────────────────────────────────────────

interface SceneViewProps {
  scene: NonNullable<DecodableStory['scenes'][number]>;
  highlight: boolean;
  lang: 'en' | 'tr';
  onSpeak: (word: string) => void;
}

function SceneView({ scene, highlight, lang, onSpeak }: SceneViewProps) {
  return (
    <div className="dsr-scene">
      <div className="dsr-location">
        {scene.location}
      </div>

      <div className="dsr-text-card">
        <div className={`dsr-text${highlight ? '' : ' dsr-text--no-highlight'}`}>
          {scene.highlightedWords.map((hw, i) => (
            <WordToken
              key={i}
              token={hw.word}
              type={hw.type}
              highlight={highlight}
              onSpeak={onSpeak}
            />
          ))}
        </div>

        <div className="dsr-text-tr">
          {lang === 'tr' ? scene.textTr : ''}
        </div>
      </div>

      {highlight && (
        <div className="dsr-legend">
          <span className="dsr-legend__item">
            <span className="dsr-legend__dot dsr-legend__dot--decodable" />
            Decodable
          </span>
          <span className="dsr-legend__item">
            <span className="dsr-legend__dot dsr-legend__dot--sight" />
            Sight word
          </span>
          <span className="dsr-legend__item">
            <span className="dsr-legend__dot dsr-legend__dot--tricky" />
            Tricky
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Comprehension Quiz ────────────────────────────────────────────────────────

interface QuizProps {
  story: DecodableStory;
  lang: 'en' | 'tr';
  onDone: () => void;
  userId?: string;
}

function saveStoryCompletion(storyId: string, userId?: string): void {
  try {
    localStorage.setItem(`mm_story_completed_${storyId}`, '1');
  } catch {
    // storage full — ignore
  }

  // Async sync to Supabase
  if (userId) {
    import('../services/supabaseDataService').then(({ saveStoryCompletionToSupabase }) => {
      saveStoryCompletionToSupabase(userId, storyId);
    }).catch(() => {});
  }
}

function ComprehensionQuiz({ story, lang, onDone, userId }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const question = lang === 'tr'
    ? story.comprehensionQuestionTr
    : story.comprehensionQuestion;

  const answers = lang === 'tr'
    ? story.comprehensionAnswersTr
    : story.comprehensionAnswers;

  const letters = ['A', 'B', 'C'];

  return (
    <div className="dsr-quiz">
      <p className="dsr-quiz__title">
        {lang === 'tr' ? 'Anlama Sorusu' : 'Comprehension Check'}
      </p>

      <p className="dsr-quiz__question">{question}</p>

      <div className="dsr-quiz__answers">
        {answers.map((answer, idx) => {
          let cls = 'dsr-quiz__answer-btn';
          if (selected !== null) {
            if (idx === story.correctAnswerIndex) cls += ' dsr-quiz__answer-btn--correct';
            else if (idx === selected) cls += ' dsr-quiz__answer-btn--wrong';
          }
          return (
            <button
              type="button"
              key={idx}
              className={cls}
              onClick={() => { if (selected === null) setSelected(idx); }}
              disabled={selected !== null}
            >
              <span className="dsr-quiz__letter">{letters[idx]}</span>
              {answer}
              {selected !== null && idx === story.correctAnswerIndex && (
                <CheckCircle size={18} style={{ marginLeft: 'auto', color: 'var(--success)' }} />
              )}
              {selected !== null && idx === selected && idx !== story.correctAnswerIndex && (
                <XCircle size={18} style={{ marginLeft: 'auto', color: 'var(--error)' }} />
              )}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button type="button" className="dsr-quiz__done-btn" onClick={() => { saveStoryCompletion(story.id, userId); onDone(); }}>
          {lang === 'tr' ? 'Tamamlandı' : 'Done'}
          <CheckCircle size={18} />
        </button>
      )}
    </div>
  );
}

// ─── Main Reader Component ─────────────────────────────────────────────────────

export default function DecodableStoryReader({
  story,
  onComplete,
  highlightMode = true,
  lang = 'en',
}: DecodableStoryReaderProps) {
  const { user } = useContext(AuthContext);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [highlight, setHighlight] = useState(highlightMode);
  const [showQuiz, setShowQuiz] = useState(false);

  const totalScenes = story.scenes.length;
  const isLastScene = sceneIndex === totalScenes - 1;
  const progressPct = showQuiz
    ? 100
    : Math.round(((sceneIndex + 1) / (totalScenes + 1)) * 100);

  // Cancel audio on unmount
  useEffect(() => {
    return () => { stopStoryAudio(); };
  }, []);

  // Speak a single word (clicked by child) — use browser TTS for individual words
  const speak = useCallback((text: string) => {
    stopStoryAudio();
    ttsSpeak(text, { rate: 0.75 });
  }, []);

  // Speak entire scene — prefer WAV file, fallback to browser TTS
  const speakScene = useCallback(() => {
    const scene = story.scenes[sceneIndex];
    if (scene) {
      playStoryAudio(story.id, `scene_${sceneIndex + 1}`, scene.text);
    }
  }, [story.id, story.scenes, sceneIndex]);

  const goNext = useCallback(() => {
    if (isLastScene) {
      setShowQuiz(true);
    } else {
      setSceneIndex(prev => prev + 1);
    }
  }, [isLastScene]);

  const goPrev = useCallback(() => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (sceneIndex > 0) {
      setSceneIndex(prev => prev - 1);
    }
    // At scene 0, do nothing — back button is disabled in the nav
  }, [showQuiz, sceneIndex]);

  const currentScene = story.scenes[sceneIndex];

  if (!currentScene && !showQuiz) {
    return (
      <div className="dsr-wrapper">
        <div className="dsr-empty">
          <p>{lang === 'tr' ? 'Hikaye bulunamadı.' : 'No story scenes found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dsr-wrapper">
      {/* Toolbar */}
      <div className="dsr-toolbar">
        <button type="button" className="dsr-toolbar__back" onClick={goPrev} aria-label="Back">
          <ArrowLeft size={18} />
        </button>

        <h1 className="dsr-toolbar__title">
          {lang === 'tr' ? story.titleTr : story.title}
        </h1>

        <span className="dsr-toolbar__badge">
          {lang === 'tr' ? `Grup ${story.phonicsGroup}` : `Group ${story.phonicsGroup}`}
        </span>

        <button
          type="button"
          className={`dsr-toolbar__highlight-btn${highlight ? ' dsr-toolbar__highlight-btn--active' : ''}`}
          onClick={() => setHighlight(h => !h)}
          aria-label="Toggle highlights"
        >
          <Highlighter size={14} />
          {highlight
            ? (lang === 'tr' ? 'Renk: Açık' : 'Color: On')
            : (lang === 'tr' ? 'Renk: Kapalı' : 'Color: Off')}
        </button>
      </div>

      {/* Progress */}
      <div className="dsr-progress">
        <div className="dsr-progress__fill" style={{ width: `${progressPct}%` }} />
        <span className="dsr-progress__label">
          {showQuiz
            ? (lang === 'tr' ? 'Quiz' : 'Quiz')
            : `${sceneIndex + 1} / ${totalScenes}`}
        </span>
      </div>

      {/* Stats */}
      <div className="dsr-stats">
        <span className="dsr-stat">
          <span className="dsr-stat__value">{story.wordCount}</span>
          {lang === 'tr' ? 'kelime' : 'words'}
        </span>
        <span className="dsr-stat dsr-stat--score">
          <span className="dsr-stat__value">{story.decodabilityScore}%</span>
          {lang === 'tr' ? 'çözümlenebilir' : 'decodable'}
        </span>
        <span className="dsr-stat">
          <span className="dsr-stat__value">{story.sightWordCount}</span>
          {lang === 'tr' ? 'görsel kelime' : 'sight words'}
        </span>
      </div>

      {/* Content */}
      {showQuiz ? (
        <ComprehensionQuiz story={story} lang={lang} onDone={onComplete} userId={user?.uid} />
      ) : (
        currentScene && (
          <SceneView
            scene={currentScene}
            highlight={highlight}
            lang={lang}
            onSpeak={speak}
          />
        )
      )}

      {/* Navigation */}
      {!showQuiz && (
        <div className="dsr-nav">
          <button
            type="button"
            className="dsr-nav__btn dsr-nav__btn--prev"
            onClick={goPrev}
            disabled={sceneIndex === 0}
            aria-label={lang === 'tr' ? 'Önceki' : 'Previous'}
          >
            <ArrowLeft size={16} />
            {lang === 'tr' ? 'Önceki' : 'Prev'}
          </button>

          <button
            type="button"
            className="dsr-nav__listen-btn"
            onClick={speakScene}
            aria-label={lang === 'tr' ? 'Dinle' : 'Listen'}
          >
            <Volume2 size={16} />
            {lang === 'tr' ? 'Dinle' : 'Listen'}
          </button>

          <button
            type="button"
            className="dsr-nav__btn dsr-nav__btn--next"
            onClick={goNext}
            aria-label={isLastScene
              ? (lang === 'tr' ? 'Soruya Geç' : 'Take Quiz')
              : (lang === 'tr' ? 'Sonraki' : 'Next')}
          >
            {isLastScene
              ? (lang === 'tr' ? 'Soruya Geç' : 'Take Quiz')
              : (lang === 'tr' ? 'Sonraki' : 'Next')}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
