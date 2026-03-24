/**
 * STORY READER PAGE
 * Read a single AI-generated story scene by scene.
 * Supports: typewriter narration, choices, vocabulary, progress, i18n
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, MapPin, Volume2, BookOpen, RotateCcw } from 'lucide-react';
import { speak } from '../services/ttsService';
import './StoryReader.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VocabWord {
  word: string;
  word_tr?: string;
  turkish?: string;
  emoji?: string;
  pronunciation?: string;
}

interface StoryScene {
  id: number;
  narration?: string;
  narrationTr?: string;
  text?: string;
  text_tr?: string;
  sceneDescription?: string;
  location?: string;
  background?: string;
  characters?: string[];
  mood?: string;
  soundEffects?: string[];
  animations?: string[];
  sound_effect?: string;
  animation_cue?: string;
  vocabulary?: VocabWord[];
  choices?: Array<{ text: string; textTr?: string; text_tr?: string; leadsTo?: number; next_scene_id?: string }>;
}

interface Story {
  id: string;
  title: string;
  title_tr?: string;
  summary?: string;
  summary_tr?: string;
  moral?: string;
  moral_tr?: string;
  vocabulary?: VocabWord[];
  scenes: StoryScene[];
  target_age?: number[];
}

// ─── Typewriter hook ─────────────────────────────────────────────────────────

function useTypewriter(
  text: string,
  speed = 28,
  onComplete?: () => void
) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    const tick = () => {
      if (indexRef.current < textRef.current.length) {
        indexRef.current++;
        setDisplayed(textRef.current.slice(0, indexRef.current));
        timerRef.current = setTimeout(tick, speed);
      } else {
        setDone(true);
        onComplete?.();
      }
    };

    timerRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  const skip = useCallback(() => {
    clearTimeout(timerRef.current);
    setDisplayed(textRef.current);
    setDone(true);
    onComplete?.();
  }, [onComplete]);

  return { displayed, done, skip };
}

// ─── Background class from scene text ────────────────────────────────────────

function getBgClass(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('forest') || t.includes('tree') || t.includes('orman')) return 'story-reader__bg-forest';
  if (t.includes('ocean') || t.includes('sea') || t.includes('water') || t.includes('deniz')) return 'story-reader__bg-ocean';
  if (t.includes('space') || t.includes('star') || t.includes('uzay')) return 'story-reader__bg-space';
  if (t.includes('mountain') || t.includes('snow') || t.includes('dağ')) return 'story-reader__bg-mountain';
  if (t.includes('desert') || t.includes('sand') || t.includes('çöl')) return 'story-reader__bg-desert';
  return 'story-reader__bg-default';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StoryReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Fetch story
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    fetch(`/api/stories/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(d => {
        setStory(d.story || d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const currentScene: StoryScene | undefined = story?.scenes?.[sceneIndex];
  const totalScenes = story?.scenes?.length ?? 0;
  const progress = totalScenes > 0 ? ((sceneIndex + 1) / totalScenes) * 100 : 0;

  const narrationText = currentScene
    ? (lang === 'tr'
        ? (currentScene.narrationTr || currentScene.text_tr || currentScene.narration || currentScene.text || '')
        : (currentScene.narration || currentScene.text || ''))
    : '';

  const bgClass = currentScene ? getBgClass(narrationText) : 'story-reader__bg-default';

  const handleNarratorComplete = useCallback(() => {
    setShowChoices(true);
  }, []);

  const { displayed, done, skip } = useTypewriter(narrationText, 28, handleNarratorComplete);

  // Reset choices on scene change
  useEffect(() => {
    setShowChoices(false);
  }, [sceneIndex]);

  const handleChoiceClick = useCallback((choice: { next_scene_id?: string; leadsTo?: number }) => {
    if (transitioning) return;
    setTransitioning(true);
    setShowChoices(false);

    // Find next scene by id or leadsTo number
    setTimeout(() => {
      const targetId = choice.next_scene_id || String(choice.leadsTo);
      const nextIdx = story?.scenes?.findIndex(s => String(s.id) === targetId) ?? -1;
      if (nextIdx !== -1) {
        setSceneIndex(nextIdx);
      } else if (sceneIndex + 1 < totalScenes) {
        setSceneIndex(i => i + 1);
      }
      setTransitioning(false);
    }, 400);
  }, [transitioning, story, sceneIndex, totalScenes]);

  const handleSkipTypewriter = useCallback(() => {
    if (!done) {
      skip();
    }
  }, [done, skip]);

  const speakWord = useCallback((word: string) => {
    speak(word, 0.9).catch(() => {});
  }, []);

  // ── Render ──

  if (loading) {
    return (
      <div className="story-reader">
        <div className={`story-reader__bg story-reader__bg-default`} />
        <div className="story-reader__loading">
          <div className="story-reader__spinner" />
          <p>{lang === 'tr' ? 'Hikaye yükleniyor...' : 'Loading story...'}</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="story-reader">
        <div className="story-reader__bg story-reader__bg-default" />
        <div className="story-reader__error">
          <p>{lang === 'tr' ? 'Hikaye bulunamadı.' : 'Story not found.'}</p>
          <button className="story-reader__error-btn" onClick={() => navigate('/stories')}>
            {lang === 'tr' ? 'Hikayelere Dön' : 'Back to Stories'}
          </button>
        </div>
      </div>
    );
  }

  const storyTitle = lang === 'tr' ? story.title_tr : story.title;

  return (
    <div className="story-reader" onClick={!done ? handleSkipTypewriter : undefined}>
      {/* Background */}
      <div className={`story-reader__bg ${bgClass}`} />

      {/* Topbar */}
      <div className="story-reader__topbar">
        <button
          className="story-reader__back-btn"
          onClick={e => { e.stopPropagation(); navigate('/stories'); }}
          aria-label={lang === 'tr' ? 'Geri' : 'Back'}
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="story-reader__title">{storyTitle}</h1>

        <div className="story-reader__progress">
          <span className="story-reader__progress-label">
            {sceneIndex + 1}/{totalScenes}
          </span>
          <div className="story-reader__progress-bar">
            <div
              className="story-reader__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scene content */}
      {!showCompletion && currentScene && (
        <div className={`story-reader__body ${transitioning ? 'story-reader__transitioning' : ''}`}>

          {/* Location badge */}
          {currentScene.location && (
            <div className="story-reader__location">
              <MapPin size={12} />
              {currentScene.location}
            </div>
          )}

          {/* Characters */}
          {currentScene.characters && currentScene.characters.length > 0 && (
            <div className="story-reader__characters">
              {currentScene.characters.map((char, i) => (
                <div key={i} className="story-reader__char">
                  <span>{typeof char === 'string' ? char : (char as { name?: string }).name || ''}</span>
                </div>
              ))}
            </div>
          )}

          {/* Narration */}
          <div className="story-reader__narration">
            <p className="story-reader__narration-text">
              {displayed}
              {!done && <span className="story-reader__cursor" aria-hidden="true" />}
            </p>
          </div>

          {/* Sound / animation cues */}
          {done && (currentScene.sound_effect || currentScene.animation_cue) && (
            <div className="story-reader__cues">
              {currentScene.sound_effect && (
                <div className="story-reader__cue">
                  <Volume2 size={11} />
                  {currentScene.sound_effect}
                </div>
              )}
              {currentScene.animation_cue && (
                <div className="story-reader__cue">
                  {currentScene.animation_cue}
                </div>
              )}
            </div>
          )}

          {/* Vocabulary */}
          {done && ((currentScene.vocabulary && currentScene.vocabulary.length > 0) || (sceneIndex === 0 && story?.vocabulary && story.vocabulary.length > 0)) && (
            <div className="story-reader__vocab">
              <div className="story-reader__vocab-title">
                {lang === 'tr' ? 'Yeni Kelimeler' : 'New Words'}
              </div>
              <div className="story-reader__vocab-list">
                {(currentScene.vocabulary || (sceneIndex === 0 ? story?.vocabulary : []) || []).map((v, i) => (
                  <div key={i} className="story-reader__vocab-item">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{v.english?.charAt(0).toUpperCase() ?? '?'}</div>
                    <span className="story-reader__vocab-word">{v.word}</span>
                    {(v.word_tr || v.turkish) && (
                      <span className="story-reader__vocab-tr">— {v.word_tr || v.turkish}</span>
                    )}
                    <button
                      className="story-reader__vocab-speak"
                      onClick={e => { e.stopPropagation(); speakWord(v.word); }}
                      aria-label={`Listen: ${v.word}`}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skip typewriter hint */}
      {!showCompletion && !done && (
        <button
          className="story-reader__skip"
          onClick={e => { e.stopPropagation(); skip(); }}
          aria-label={lang === 'tr' ? 'Atla' : 'Skip'}
        >
          {lang === 'tr' ? 'Atla ▸' : 'Skip ▸'}
        </button>
      )}

      {/* Completion Screen */}
      {showCompletion && (
        <div className="story-reader__completion">
          <div className="story-reader__completion-confetti" aria-hidden="true">
            <BookOpen size={48} style={{ color: '#E8A317' }} />
          </div>
          <h2 className="story-reader__completion-title">
            {lang === 'tr' ? 'Hikaye Bitti!' : 'Story Complete!'}
          </h2>
          {story && (
            <p className="story-reader__completion-subtitle">
              {lang === 'tr'
                ? (story.title_tr ?? story.title)
                : story.title}
            </p>
          )}
          <div className="story-reader__completion-xp">
            +{Math.max(10, totalScenes * 5)} XP {lang === 'tr' ? 'kazandın!' : 'earned!'}
          </div>

          {/* Moral of the story */}
          {story && (story.moral || story.moral_tr) && (
            <div className="story-reader__completion-moral">
              <div className="story-reader__completion-moral-label">
                {lang === 'tr' ? 'Hikayenin Mesajı' : 'Moral of the Story'}
              </div>
              <p className="story-reader__completion-moral-text">
                {lang === 'tr' ? (story.moral_tr ?? story.moral) : story.moral}
              </p>
            </div>
          )}

          {/* Vocabulary summary */}
          {(() => {
            const allVocab: VocabWord[] = [];
            if (story?.vocabulary) allVocab.push(...story.vocabulary);
            story?.scenes?.forEach(s => { if (s.vocabulary) allVocab.push(...s.vocabulary); });
            const unique = allVocab.filter((v, i, arr) => arr.findIndex(x => x.word === v.word) === i);
            if (unique.length === 0) return null;
            return (
              <div className="story-reader__completion-vocab">
                <div className="story-reader__completion-vocab-title">
                  {lang === 'tr' ? `Öğrendiğin ${unique.length} Kelime` : `${unique.length} Words You Learned`}
                </div>
                <div className="story-reader__completion-vocab-list">
                  {unique.map((v, i) => (
                    <div key={i} className="story-reader__completion-vocab-chip">
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{v.english?.charAt(0).toUpperCase() ?? '?'}</div>
                      <strong>{v.word}</strong>
                      {(v.word_tr || v.turkish) && (
                        <span>— {v.word_tr || v.turkish}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Action buttons */}
          <div className="story-reader__completion-actions">
            <button
              className="story-reader__completion-btn-primary"
              onClick={() => navigate('/stories')}
            >
              <BookOpen size={18} />
              {lang === 'tr' ? 'Başka Hikaye Oku' : 'Read Another Story'}
            </button>
            <button
              className="story-reader__completion-btn-secondary"
              onClick={() => {
                setShowCompletion(false);
                setSceneIndex(0);
                setShowChoices(false);
              }}
            >
              <RotateCcw size={16} />
              {lang === 'tr' ? 'Başa Dön' : 'Back to Stories'}
            </button>
          </div>
        </div>
      )}

      {/* Choices */}
      {!showCompletion && showChoices && currentScene && (
        <div className="story-reader__choices" onClick={e => e.stopPropagation()}>
          {currentScene.choices && currentScene.choices.length > 0 ? (
            currentScene.choices.map((choice, i) => (
              <button
                key={i}
                className="story-reader__choice-btn"
                onClick={() => handleChoiceClick(choice)}
              >
                <span className="story-reader__choice-icon">{String.fromCharCode(65 + i)}</span>
                {lang === 'tr' ? (choice.textTr || choice.text_tr || choice.text) : choice.text}
              </button>
            ))
          ) : sceneIndex + 1 < totalScenes ? (
            // No choices — simple "continue" button
            <button
              className="story-reader__choice-btn"
              onClick={() => {
                setTransitioning(true);
                setShowChoices(false);
                setTimeout(() => {
                  setSceneIndex(i => i + 1);
                  setTransitioning(false);
                }, 300);
              }}
            >
              <span className="story-reader__choice-icon">→</span>
              {lang === 'tr' ? 'Devam Et' : 'Continue'}
            </button>
          ) : (
            // Last scene — show completion screen
            <button
              className="story-reader__choice-btn"
              onClick={() => setShowCompletion(true)}
            >
              <span className="story-reader__choice-icon"><BookOpen size={16} /></span>
              {lang === 'tr' ? 'Hikayeyi Tamamla!' : 'Complete Story!'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
