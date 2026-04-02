/**
 * DAILY LESSON — Digital Montessori 6-phase learning flow
 * Mobile-first, light mode only, all Tailwind inline. All business logic preserved.
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonCompleteScreen from '../components/LessonCompleteScreen';
import { X, ChevronRight, ChevronLeft, Mic, MicOff, Volume2, Check, RotateCcw, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useGamification } from '../contexts/GamificationContext';
import { speak } from '../services/ttsService';
import { SFX } from '../data/soundLibrary';
import { getTodayLesson, completeDailyLesson, getTodayPhonicsSound, type DailyLessonPlan } from '../services/dailyLessonService';
import { getHomeworkWords } from '../services/homeworkService';
import { getCurrentUnit } from '../services/lessonProgressService';
import { PHASES as CURRICULUM_PHASES } from '../data/curriculumPhases';
import type { KidsWord } from '../data/wordsData';
import type { AgeGroup } from '../types/progress';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES_EN = [
  { id: 1, key: 'listen', title: 'New Words!', subtitle: 'This is SAT. This is SIT. Tap to hear!', icon: '1' },
  { id: 2, key: 'see', title: 'Watch & Learn!', subtitle: 'See each word in a sentence', icon: '2' },
  { id: 3, key: 'play', title: "Let's Play!", subtitle: 'Show me SAT!', icon: '3' },
  { id: 4, key: 'speak', title: 'Say It!', subtitle: 'What is this word? Say it!', icon: '4' },
  { id: 5, key: 'review', title: 'Remember?', subtitle: 'Test what you learned', icon: '5' },
  { id: 6, key: 'story', title: 'Mini Story!', subtitle: 'See the words in a story', icon: '6' },
];

const PHASES_TR = [
  { id: 1, key: 'listen', title: 'Yeni Kelimeler!', subtitle: 'Bu SAT. Bu SIT. Duymak icin dokun!', icon: '1' },
  { id: 2, key: 'see', title: 'Izle ve Ogren!', subtitle: 'Her kelimeyi cumlede gor', icon: '2' },
  { id: 3, key: 'play', title: 'Hadi Oynayalim!', subtitle: 'Hangisi SAT? Goster bana!', icon: '3' },
  { id: 4, key: 'speak', title: 'Soyle!', subtitle: 'Bu kelime ne? Soyle!', icon: '4' },
  { id: 5, key: 'review', title: 'Hatirliyor musun?', subtitle: 'Ogrendiklerini test et', icon: '5' },
  { id: 6, key: 'story', title: 'Mini Hikaye!', subtitle: 'Kelimeleri hikayede gor', icon: '6' },
];

const TOTAL_PHASES = 6;
const REVIEW_CHOICES = 3;

const EXAMPLE_SENTENCES: Record<string, { en: string; tr: string; highlight: string }> = {
  cat: { en: 'The CAT sits on the mat.', tr: 'KEDi paspastin uzerinde oturuyor.', highlight: 'CAT' },
  dog: { en: 'The DOG runs in the park.', tr: 'KOPEK parkta kosuyor.', highlight: 'DOG' },
  apple: { en: 'I eat an APPLE every day.', tr: 'Her gun bir ELMA yerim.', highlight: 'APPLE' },
  milk: { en: 'She drinks MILK at night.', tr: 'Geceleri SUT iciyor.', highlight: 'MILK' },
  sun: { en: 'The SUN is bright today.', tr: 'Bugun GUNES parlak.', highlight: 'SUN' },
  red: { en: 'RED is a warm colour.', tr: 'KIRMIZI sicak bir renk.', highlight: 'RED' },
  run: { en: 'I love to RUN fast!', tr: 'Hizli KOSMAYI seviyorum!', highlight: 'RUN' },
  hat: { en: 'Wear a HAT in the sun.', tr: 'Guneste SAPKA tak.', highlight: 'HAT' },
  sat: { en: 'The boy SAT on the chair.', tr: 'Cocuk sandalyeye OTURDU.', highlight: 'SAT' },
  sit: { en: 'Please SIT down here.', tr: 'Lutfen buraya OTUR.', highlight: 'SIT' },
};

const VERB_SUFFIXES = ['ed', 'ing', 'run', 'sit', 'sat', 'sip', 'tap', 'tip', 'hop', 'cut', 'let', 'put'];
function looksLikeVerb(w: string): boolean { return VERB_SUFFIXES.includes(w.toLowerCase()) || w.endsWith('ed') || w.endsWith('ing'); }

function getSentence(word: KidsWord): { en: string; tr: string; highlight: string } {
  const lower = word.word.toLowerCase();
  if (EXAMPLE_SENTENCES[lower]) return EXAMPLE_SENTENCES[lower];
  const upper = word.word.toUpperCase();
  if (looksLikeVerb(lower)) return { en: `The boy can ${upper}.`, tr: `Cocuk ${word.turkish}.`, highlight: upper };
  return { en: `Look! A big ${upper}.`, tr: `Bak! Buyuk bir ${word.turkish}.`, highlight: upper };
}

// ─── Phase dots ───────────────────────────────────────────────────────────────

function PhaseDots({ current, total, completedPhases }: { current: number; total: number; completedPhases: Set<number> }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        return (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${n === current ? 'bg-orange-500 scale-125' : completedPhases.has(n) ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        );
      })}
    </div>
  );
}

// ─── Card counter dots ────────────────────────────────────────────────────────

function CardDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1 justify-center mb-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < current ? 'bg-emerald-500' : i === current ? 'bg-orange-500' : 'bg-gray-200'}`} />
      ))}
    </div>
  );
}

// ─── Feedback toast ───────────────────────────────────────────────────────────

function FeedbackToast({ message, sad }: { message: string; sad?: boolean }) {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-3xl shadow-lg text-sm font-bold z-50 ${sad ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
      {message}
    </div>
  );
}

// ─── Montessori Nav Bar ───────────────────────────────────────────────────────

type PhaseInfo = { id: number; key: string; title: string; subtitle: string; icon: string };

function MontessoriNav({ phases, currentPhase, completedPhases, onSelectPhase }: {
  phases: PhaseInfo[]; currentPhase: number; completedPhases: Set<number>; onSelectPhase: (id: number) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
      {phases.map((p) => {
        const isActive = currentPhase === p.id;
        const isDone = completedPhases.has(p.id);
        // A phase is unlocked if it's phase 1, already done, or the previous phase is done
        const isLocked = p.id !== 1 && !isDone && !completedPhases.has(p.id - 1);
        return (
          <button key={p.id} type="button" disabled={isLocked} onClick={() => !isLocked && onSelectPhase(p.id)}
            className={`min-h-[40px] min-w-[40px] px-2 rounded-2xl text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all shrink-0 ${
              isActive ? 'bg-orange-500 text-white shadow-sm' : isDone ? 'bg-emerald-100 text-emerald-700' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-extrabold">{p.id}</span>
            <span className="hidden sm:inline">{p.title}</span>
            {isDone && <Check size={10} />}
            {isLocked && <Lock size={10} />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Phase 1: LISTEN ──────────────────────────────────────────────────────────

function PhaseListenStep({ word, index, total, lang, onNext }: { word: KidsWord; index: number; total: number; lang: string; onNext: () => void }) {
  const [entering, setEntering] = useState(true);
  useEffect(() => { setEntering(true); speak(word.word); const t = setTimeout(() => setEntering(false), 400); return () => clearTimeout(t); }, [word.word]);
  const handleTap = useCallback(() => { speak(word.word); }, [word.word]);

  return (
    <>
      <CardDots current={index} total={total} />
      <div onClick={handleTap} role="button" tabIndex={0} aria-label={`${word.word} - tap to hear`}
        className={`rounded-3xl bg-white shadow-lg p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${entering ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
      >
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-extrabold text-orange-600">{word.word.charAt(0).toUpperCase()}</div>
        <span className="text-3xl font-extrabold text-gray-900 tracking-wide">{word.word.toUpperCase()}</span>
        <span className="text-base text-gray-500">{word.turkish}</span>
        <span className="flex items-center gap-1 text-xs text-gray-400"><Volume2 size={12} />{lang === 'tr' ? 'Tekrar duymak icin dokun' : 'Tap to hear again'}</span>
      </div>
      <div className="flex justify-center mt-4">
        <button type="button" onClick={onNext} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold text-base flex items-center gap-2 shadow-md active:scale-95 transition-transform">
          {index < total - 1 ? <>{lang === 'tr' ? 'Ileri' : 'Next'} <ChevronRight size={20} /></> : <>{lang === 'tr' ? 'Tamam' : 'Done'} <Check size={20} /></>}
        </button>
      </div>
    </>
  );
}

// ─── Phase 2: SEE ─────────────────────────────────────────────────────────────

function PhaseSeeStep({ word, index, total, lang, onNext, onPrev }: { word: KidsWord; index: number; total: number; lang: string; onNext: () => void; onPrev: () => void }) {
  const sentence = getSentence(word);
  const parts = sentence.en.split(sentence.highlight);
  useEffect(() => { speak(sentence.en); }, [word.word]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CardDots current={index} total={total} />
      <div className="rounded-3xl bg-white shadow-lg p-6 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-lg font-extrabold text-sky-600">{word.word.charAt(0).toUpperCase()}</div>
        <p className="text-lg text-gray-800 text-center">
          {parts[0]}<span className="font-extrabold text-orange-500 underline decoration-2">{sentence.highlight}</span>{parts[1]}
        </p>
        <p className="text-sm text-gray-500 text-center">{sentence.tr}</p>
        <button type="button" onClick={() => speak(sentence.en)} className="min-h-[40px] px-4 rounded-2xl bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1">
          <Volume2 size={14} /> {lang === 'tr' ? 'Tekrar Dinle' : 'Read Again'}
        </button>
      </div>
      <div className="flex gap-3 justify-center mt-4">
        {index > 0 && <button type="button" onClick={onPrev} className="min-h-[56px] w-14 rounded-3xl bg-gray-200 text-gray-600 flex items-center justify-center"><ChevronLeft size={20} /></button>}
        <button type="button" onClick={onNext} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold text-base flex items-center gap-2 shadow-md active:scale-95 transition-transform">
          {index < total - 1 ? <>{lang === 'tr' ? 'Ileri' : 'Next'} <ChevronRight size={20} /></> : <>{lang === 'tr' ? 'Tamam' : 'Done'} <Check size={20} /></>}
        </button>
      </div>
    </>
  );
}

// ─── Phase 3: PLAY (Word Match) ───────────────────────────────────────────────

interface MatchItem { id: string; text: string; type: 'english' | 'turkish'; wordIndex: number; matched: boolean; }

function PhasePlay({ words, lang, onComplete }: { words: KidsWord[]; lang: string; onComplete: (score: number) => void }) {
  const buildTiles = useCallback((): MatchItem[] => {
    const en: MatchItem[] = words.map((w, i) => ({ id: `en-${i}`, text: w.word.toUpperCase(), type: 'english', wordIndex: i, matched: false }));
    const tr: MatchItem[] = words.map((w, i) => ({ id: `tr-${i}`, text: w.turkish, type: 'turkish', wordIndex: i, matched: false }));
    for (let i = tr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tr[i], tr[j]] = [tr[j], tr[i]]; }
    return [...en, ...tr];
  }, [words]);

  const [tiles, setTiles] = useState<MatchItem[]>(buildTiles);
  const [selectedEn, setSelectedEn] = useState<MatchItem | null>(null);
  const [selectedTr, setSelectedTr] = useState<MatchItem | null>(null);
  const [revealCorrect, setRevealCorrect] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);
  const [allDone, setAllDone] = useState(false);

  const showFB = (msg: string, sad?: boolean) => { setShowFeedback({ msg, sad }); setTimeout(() => setShowFeedback(null), 1400); };

  const handleTile = (tile: MatchItem) => {
    if (tile.matched) return;
    if (tile.type === 'english') { speak(tile.text.toLowerCase()); setSelectedEn((prev) => (prev?.id === tile.id ? null : tile)); }
    else { setSelectedTr((prev) => (prev?.id === tile.id ? null : tile)); }
  };

  useEffect(() => {
    if (!selectedEn || !selectedTr) return;
    if (selectedEn.wordIndex === selectedTr.wordIndex) {
      SFX.correct();
      setTiles((prev) => prev.map((t) => (t.id === selectedEn.id || t.id === selectedTr.id) ? { ...t, matched: true } : t));
      setMatchedCount((c) => c + 1);
      showFB(lang === 'tr' ? 'Harika eslestirme!' : 'Great match!');
    } else {
      SFX.wrong();
      setRevealCorrect(`tr-${selectedEn.wordIndex}`);
      showFB(lang === 'tr' ? 'Neredeyse! Iste dogrusu:' : 'Almost! Here it is:', true);
      setTimeout(() => setRevealCorrect(null), 1200);
    }
    setTimeout(() => { setSelectedEn(null); setSelectedTr(null); }, 300);
  }, [selectedEn, selectedTr, lang]);

  useEffect(() => { if (matchedCount === words.length) setTimeout(() => setAllDone(true), 600); }, [matchedCount, words.length]);

  const handlePlayAgain = useCallback(() => { setTiles(buildTiles()); setSelectedEn(null); setSelectedTr(null); setRevealCorrect(null); setMatchedCount(0); setAllDone(false); setShowFeedback(null); }, [buildTiles]);

  if (allDone) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"><Check size={32} className="text-emerald-600" strokeWidth={3} /></div>
        <p className="text-lg font-bold text-gray-900">{lang === 'tr' ? 'Tum eslesmeleri buldun!' : 'All matched!'}</p>
        <button type="button" onClick={handlePlayAgain} className="min-h-[48px] px-6 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2"><RotateCcw size={16} />{lang === 'tr' ? 'Tekrar Oyna' : 'Play Again'}</button>
        <button type="button" onClick={() => onComplete(100)} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform">{lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} /></button>
      </div>
    );
  }

  const enTiles = tiles.filter((t) => t.type === 'english');
  const trTiles = tiles.filter((t) => t.type === 'turkish');

  return (
    <>
      <div className="flex justify-center mb-3"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Check size={12} />{matchedCount}/{words.length}</span></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {enTiles.map((tile) => (
            <button key={tile.id} type="button" onClick={() => handleTile(tile)}
              className={`min-h-[48px] rounded-2xl px-3 py-2 text-sm font-bold text-center transition-all ${tile.matched ? 'bg-emerald-100 text-emerald-700' : selectedEn?.id === tile.id ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400' : 'bg-white text-gray-800 border border-gray-200'}`}
            >{tile.matched && <Check size={12} className="inline mr-1" />}{tile.text}</button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {trTiles.map((tile) => (
            <button key={tile.id} type="button" onClick={() => handleTile(tile)}
              className={`min-h-[48px] rounded-2xl px-3 py-2 text-sm font-bold text-center transition-all ${tile.matched ? 'bg-emerald-100 text-emerald-700' : revealCorrect === tile.id ? 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-400' : selectedTr?.id === tile.id ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-400' : 'bg-white text-gray-800 border border-gray-200'}`}
            >{(tile.matched || revealCorrect === tile.id) && <Check size={12} className="inline mr-1" />}{tile.text}</button>
          ))}
        </div>
      </div>
      {showFeedback && <FeedbackToast message={showFeedback.msg} sad={showFeedback.sad} />}
    </>
  );
}

// ─── Phase 4: SPEAK ───────────────────────────────────────────────────────────

function PhaseSpeak({ words, lang, onComplete }: { words: KidsWord[]; lang: string; onComplete: (score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; good: boolean } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentWord = words[index];

  const speakCurrent = useCallback(() => { speak(currentWord.word); }, [currentWord.word]);
  useEffect(() => { speakCurrent(); }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setFeedback({ msg: lang === 'tr' ? 'Iyi deneme!' : 'Good try!', good: true }); return; }
    const r = new SR(); recognitionRef.current = r; r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 3;
    r.onstart = () => setListening(true); r.onend = () => setListening(false);
    r.onresult = (event) => {
      const transcripts = Array.from(event.results[0]).map((r2) => r2.transcript.trim().toLowerCase());
      const expected = currentWord.word.toLowerCase();
      const isClose = transcripts.some((t) => t === expected || t.includes(expected) || expected.includes(t) || levenshtein(t, expected) <= 1);
      if (isClose) { setCorrectCount((c) => c + 1); setFeedback({ msg: lang === 'tr' ? 'Mukemmel!' : 'Perfect!', good: true }); }
      else { setFeedback({ msg: lang === 'tr' ? 'Iyi deneme!' : 'Good try!', good: true }); }
    };
    r.onerror = () => { setListening(false); setFeedback({ msg: lang === 'tr' ? 'Iyi deneme!' : 'Good try!', good: true }); };
    r.start();
  }, [currentWord.word, lang]);

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setListening(false); }, []);

  const handleNext = useCallback(() => {
    setFeedback(null);
    if (index >= words.length - 1) { setDone(true); setTimeout(() => onComplete(Math.round((correctCount / words.length) * 100)), 400); }
    else { setIndex((i) => i + 1); }
  }, [index, words.length, correctCount, onComplete]);

  if (done) return <p className="text-center text-gray-500 font-bold py-8">{lang === 'tr' ? 'Bitti! Devam ediyoruz...' : 'Done! Moving on...'}</p>;

  return (
    <>
      <CardDots current={index} total={words.length} />
      <div className="rounded-3xl bg-white shadow-lg p-6 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-xl font-extrabold text-violet-600">{currentWord.word.charAt(0).toUpperCase()}</div>
        <span className="text-2xl font-extrabold text-gray-900">{currentWord.word.toUpperCase()}</span>
        <span className="text-sm text-gray-500">{currentWord.turkish}</span>
        <button type="button" onClick={speakCurrent} className="min-h-[40px] px-4 rounded-2xl bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1"><Volume2 size={14} />{lang === 'tr' ? 'Dinle' : 'Hear it'}</button>
        <button type="button" onClick={listening ? stopListening : startListening} aria-label={listening ? 'Stop' : 'Speak'}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${listening ? 'bg-red-500' : 'bg-orange-500'}`}
        >{listening ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}</button>
        {listening && <span className="text-xs text-gray-400 animate-pulse">{lang === 'tr' ? 'Dinleniyor...' : 'Listening...'}</span>}
        {feedback && <span className="text-sm font-bold text-emerald-600">{feedback.msg}</span>}
        {feedback && <button type="button" onClick={() => setFeedback(null)} className="text-xs text-gray-500 flex items-center gap-1"><RotateCcw size={12} />{lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}</button>}
      </div>
      <div className="flex justify-center mt-4">
        <button type="button" onClick={handleNext} disabled={listening} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform disabled:opacity-50">
          {index < words.length - 1 ? <>{lang === 'tr' ? 'Sonraki' : 'Next'} <ChevronRight size={20} /></> : <>{lang === 'tr' ? 'Bitir' : 'Finish'} <Check size={20} /></>}
        </button>
      </div>
    </>
  );
}

// ─── Phase 5: REVIEW ──────────────────────────────────────────────────────────

interface ReviewQuestion { prompt: string; promptWord: string; choices: string[]; correct: string; questionType: 'en-to-tr' | 'tr-to-en'; }

function buildReviewQuestions(allWords: KidsWord[], lang: string): ReviewQuestion[] {
  return allWords.map((word, i) => {
    if (i % 2 === 0) {
      const correct = word.turkish;
      const distractors = allWords.filter((w) => w.turkish !== correct).sort(() => Math.random() - 0.5).slice(0, REVIEW_CHOICES - 1).map((w) => w.turkish);
      return { prompt: lang === 'tr' ? 'Bu ne demek?' : 'What does this mean?', promptWord: word.word.toUpperCase(), choices: [...distractors, correct].sort(() => Math.random() - 0.5), correct, questionType: 'en-to-tr' as const };
    } else {
      const correct = word.word.toUpperCase();
      const distractors = allWords.filter((w) => w.word !== word.word).sort(() => Math.random() - 0.5).slice(0, REVIEW_CHOICES - 1).map((w) => w.word.toUpperCase());
      return { prompt: lang === 'tr' ? 'Hangi Ingilizce kelime su anlama gelir:' : 'Which English word means:', promptWord: word.turkish, choices: [...distractors, correct].sort(() => Math.random() - 0.5), correct, questionType: 'tr-to-en' as const };
    }
  });
}

function PhaseReview({ newWords, reviewWords, lang, onComplete }: { newWords: KidsWord[]; reviewWords: KidsWord[]; lang: string; onComplete: (score: number) => void }) {
  const allWords = useMemo(() => [...newWords, ...reviewWords].slice(0, 8), [newWords, reviewWords]);
  const [questions, setQuestions] = useState(() => buildReviewQuestions(allWords, lang));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [allReviewDone, setAllReviewDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);
  const q = questions[qIndex];

  const handleChoice = useCallback((choice: string) => {
    if (answered) return;
    setSelected(choice); setAnswered(true);
    if (choice === q.correct) { SFX.correct(); setScore((s) => s + 1); setShowFeedback({ msg: lang === 'tr' ? 'Dogru!' : 'Correct!' }); }
    else { SFX.wrong(); setShowFeedback({ msg: lang === 'tr' ? `Neredeyse! "${q.correct}"` : `Almost! "${q.correct}"`, sad: true }); }
    setTimeout(() => {
      setShowFeedback(null);
      if (qIndex >= questions.length - 1) { const pct = Math.round(((score + (choice === q.correct ? 1 : 0)) / questions.length) * 100); setFinalScore(pct); setAllReviewDone(true); }
      else { setQIndex((i) => i + 1); setSelected(null); setAnswered(false); }
    }, 1300);
  }, [answered, q, qIndex, questions.length, score, lang]);

  const handlePracticeMore = useCallback(() => { setQuestions(buildReviewQuestions(allWords, lang)); setQIndex(0); setSelected(null); setAnswered(false); setScore(0); setAllReviewDone(false); setFinalScore(0); }, [allWords, lang]);

  const handleHearPrompt = useCallback(() => { speak(q?.promptWord ?? ''); }, [q?.promptWord]);

  if (allReviewDone) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center"><Check size={32} className="text-violet-600" strokeWidth={3} /></div>
        <p className="text-lg font-bold text-gray-900">{lang === 'tr' ? `${finalScore}% dogru!` : `${finalScore}% correct!`}</p>
        <button type="button" onClick={handlePracticeMore} className="min-h-[48px] px-6 rounded-3xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2"><RotateCcw size={16} />{lang === 'tr' ? 'Daha Fazla' : 'Practice More'}</button>
        <button type="button" onClick={() => onComplete(finalScore)} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform">{lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} /></button>
      </div>
    );
  }

  const progress = Math.round((qIndex / questions.length) * 100);

  return (
    <>
      <div className="w-full h-2 rounded-full bg-gray-100 mb-4"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} /></div>
      <p className="text-sm text-gray-600 text-center mb-1">{q.prompt}</p>
      <div className="flex items-center justify-center gap-2 mb-3">
        <p className="text-2xl font-extrabold text-gray-900">{q.promptWord}</p>
        {q.questionType === 'en-to-tr' && <button type="button" onClick={handleHearPrompt} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Volume2 size={18} className="text-gray-500" /></button>}
      </div>
      <span className="block text-center text-xs text-gray-400 mb-3">{qIndex + 1}/{questions.length}</span>
      <div className="flex flex-col gap-2">
        {q.choices.map((choice) => (
          <button key={choice} type="button" onClick={() => handleChoice(choice)}
            className={`min-h-[56px] rounded-3xl px-6 text-base font-bold text-center transition-all ${
              answered ? (choice === q.correct ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400' : choice === selected ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-400') : 'bg-white text-gray-800 border-2 border-gray-200 active:scale-95'
            }`}
          >{answered && choice === q.correct && <Check size={16} className="inline mr-1" />}{choice}</button>
        ))}
      </div>
      {showFeedback && <FeedbackToast message={showFeedback.msg} sad={showFeedback.sad} />}
    </>
  );
}

// ─── Phase 6: STORY ───────────────────────────────────────────────────────────

interface StoryPart { text: string; isWord: boolean; }
interface StorySentence { parts: StoryPart[]; }
interface MiniStory { sentences: StorySentence[]; translation: string; }

const STORY_TEMPLATES = [
  { en: 'In the morning, I see a {0}. The {1} is next to the {2}. I feel {3} because the {4} is beautiful!', tr: 'Sabahleyin bir {0} goruyorum. {1}, {2} yaninda duruyor. {3} hissediyorum cunku {4} cok guzel!' },
  { en: 'One day, {0} found a {1} near the {2}. The {3} was very happy. What a {4} adventure!', tr: 'Bir gun, {0} {2} yakininda bir {1} buldu. {3} cok mutluydu. Ne {4} bir macera!' },
  { en: 'The little {0} and the {1} went to find a {2}. They found a beautiful {3} and felt so {4}!', tr: 'Kucuk {0} ve {1} bir {2} aramaya gitti. Guzel bir {3} buldular ve cok {4} hissettiler!' },
];

function generateMiniStory(rawWords: KidsWord[]): MiniStory {
  if (rawWords.length === 0) return { sentences: [{ parts: [{ text: 'Once upon a time...', isWord: false }] }], translation: 'Bir varmis bir yokmus...' };
  const words = [...rawWords]; while (words.length < 5) words.push(rawWords[words.length % rawWords.length]);
  const template = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
  let enText = template.en; let trText = template.tr;
  words.forEach((w, i) => { enText = enText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.word); trText = trText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.turkish); });
  const wordList = words.map((w) => w.word);
  const rawSentences = enText.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const sentences: StorySentence[] = rawSentences.map((sentence) => {
    const parts: StoryPart[] = []; let remaining = sentence;
    while (remaining.length > 0) {
      let matched = false;
      for (const w of wordList) {
        const idx = remaining.toLowerCase().indexOf(w.toLowerCase());
        if (idx === 0) { parts.push({ text: remaining.slice(0, w.length), isWord: true }); remaining = remaining.slice(w.length); matched = true; break; }
        else if (idx > 0) { parts.push({ text: remaining.slice(0, idx), isWord: false }); remaining = remaining.slice(idx); matched = true; break; }
      }
      if (!matched) { parts.push({ text: remaining, isWord: false }); remaining = ''; }
    }
    return { parts };
  });
  return { sentences, translation: trText };
}

function PhaseStory({ words, lang, onComplete }: { words: KidsWord[]; lang: string; onComplete: () => void }) {
  const [story] = useState<MiniStory>(() => generateMiniStory(words));
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-white shadow-lg p-6">
        {story.sentences.map((sentence, i) => (
          <p key={i} className="text-lg text-gray-800 mb-2 leading-relaxed">
            {sentence.parts.map((part, j) => part.isWord ? (
              <span key={j} className="font-extrabold text-orange-500 underline cursor-pointer" onClick={() => speak(part.text)} role="button" tabIndex={0}>{part.text}</span>
            ) : (<span key={j}>{part.text}</span>))}
          </p>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center italic">{story.translation}</p>
      <div className="flex justify-center">
        <button type="button" onClick={onComplete} className="min-h-[56px] px-8 rounded-3xl bg-orange-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform">
          {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

// ─── Levenshtein ──────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length; const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DailyLesson() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  usePageTitle('Gunluk Ders', 'Daily Lesson');
  const { addXP, trackActivity, stats, checkStreak } = useGamification();
  const navigate = useNavigate();
  const userId = user?.uid || 'guest';

  const currentUnitInfo = getCurrentUnit();
  const currentPhaseData = CURRICULUM_PHASES[currentUnitInfo.phaseIndex];
  const currentUnitData = currentPhaseData?.units?.[currentUnitInfo.unitIndex];

  const ageGroup = (localStorage.getItem('mimi_age_group') || 'word-builders') as AgeGroup;
  const [plan] = useState<DailyLessonPlan>(() => getTodayLesson(userId, ageGroup));
  const [homeworkWords] = useState<KidsWord[]>(() => getHomeworkWords(userId));
  const [todaySound] = useState(() => getTodayPhonicsSound(userId));
  const [phase, setPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [listenIndex, setListenIndex] = useState(0);
  const [seeIndex, setSeeIndex] = useState(0);
  const [, setPhaseProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [celebrated, setCelebrated] = useState(false);
  const scoresRef = useRef<Record<number, number>>({ 3: 0, 4: 0, 5: 0 });
  const PHASES = lang === 'tr' ? PHASES_TR : PHASES_EN;

  const markPhaseComplete = useCallback((phaseId: number) => { setCompletedPhases((prev) => { const next = new Set(prev); next.add(phaseId); return next; }); }, []);
  const handleSelectPhase = useCallback((phaseId: number) => { if (phaseId === 1) setListenIndex(0); if (phaseId === 2) setSeeIndex(0); setPhase(phaseId); }, []);

  const handleListenNext = useCallback(() => {
    const nextIndex = listenIndex + 1;
    setPhaseProgress((prev) => ({ ...prev, 1: nextIndex }));
    if (listenIndex < plan.newWords.length - 1) setListenIndex(nextIndex);
    else { markPhaseComplete(1); setPhase(2); }
  }, [listenIndex, plan.newWords.length, markPhaseComplete]);

  const handleSeeNext = useCallback(() => {
    const nextIndex = seeIndex + 1;
    setPhaseProgress((prev) => ({ ...prev, 2: nextIndex }));
    if (seeIndex < plan.newWords.length - 1) setSeeIndex(nextIndex);
    else { markPhaseComplete(2); setPhase(3); }
  }, [seeIndex, plan.newWords.length, markPhaseComplete]);

  const handleSeePrev = useCallback(() => { setSeeIndex((i) => Math.max(0, i - 1)); }, []);

  const handlePhase3Complete = useCallback((score: number) => { scoresRef.current[3] = score; markPhaseComplete(3); setPhaseProgress((prev) => ({ ...prev, 3: score })); setPhase(4); }, [markPhaseComplete]);
  const handlePhase4Complete = useCallback((score: number) => { scoresRef.current[4] = score; markPhaseComplete(4); setPhaseProgress((prev) => ({ ...prev, 4: score })); setPhase(5); }, [markPhaseComplete]);
  const handlePhase5Complete = useCallback((score: number) => { scoresRef.current[5] = score; markPhaseComplete(5); setPhaseProgress((prev) => ({ ...prev, 5: score })); setPhase(6); }, [markPhaseComplete]);
  const handleStoryComplete = useCallback(() => { markPhaseComplete(6); setPhaseProgress((prev) => ({ ...prev, 6: 100 })); }, [markPhaseComplete]);

  useEffect(() => {
    if (completedPhases.size === TOTAL_PHASES && !celebrated) {
      setCelebrated(true);
      const avgScore = Math.round((scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3);
      completeDailyLesson(userId, plan, avgScore);
      const xpEarned = 50 + Math.round((avgScore / 100) * 50);
      addXP(xpEarned, 'daily_lesson_complete').catch(() => {});
      trackActivity('daily_lesson', { score: avgScore, words: plan.newWords.length }).catch(() => {});
      checkStreak().catch(() => {});
    }
  }, [completedPhases, celebrated, userId, plan, addXP, trackActivity, checkStreak]);

  const currentPhaseInfo = PHASES[Math.min(phase, TOTAL_PHASES) - 1];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') navigate('/dashboard');
      if ((e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') && (phase === 1 || phase === 2)) { e.preventDefault(); phase === 1 ? handleListenNext() : handleSeeNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (phase === 2) handleSeePrev(); else if (phase === 1 && listenIndex > 0) setListenIndex((i) => i - 1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, navigate, handleListenNext, handleSeeNext, handleSeePrev, listenIndex]);

  if (celebrated) {
    const avgScore = Math.round((scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3);
    return <LessonCompleteScreen xpEarned={50 + Math.round((avgScore / 100) * 50)} wordsLearned={plan.newWords.map((w) => w.word)} streakDays={stats.streakDays} onContinue={() => navigate('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button type="button" onClick={() => navigate('/dashboard')} aria-label="Close" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
          <X size={18} className="text-gray-500" />
        </button>
        <PhaseDots current={phase} total={TOTAL_PHASES} completedPhases={completedPhases} />
        <span className="text-xs font-bold text-gray-400 ml-auto">{phase}/{TOTAL_PHASES}</span>
      </div>

      {currentUnitData && currentPhaseData && (
        <div className="px-4 mb-2"><span className="text-[10px] font-bold text-gray-400">{lang === 'tr' ? currentPhaseData.nameTr : currentPhaseData.name} -- {lang === 'tr' ? (currentUnitData.titleTr ?? `Unite ${currentUnitInfo.unitIndex + 1}`) : (currentUnitData.title ?? `Unit ${currentUnitInfo.unitIndex + 1}`)}</span></div>
      )}

      <div className="px-4"><MontessoriNav phases={PHASES} currentPhase={phase} completedPhases={completedPhases} onSelectPhase={handleSelectPhase} /></div>

      {/* Phase content */}
      <div className="flex-1 px-4 pb-8">
        <div className="text-center mb-4">
          <p className="text-lg font-extrabold text-gray-900">{currentPhaseInfo.title}</p>
          <p className="text-sm text-gray-500">{currentPhaseInfo.subtitle}</p>
        </div>

        {phase === 1 && listenIndex === 0 && todaySound && (
          <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-4 mb-4 text-center">
            <span className="text-3xl font-extrabold text-emerald-700">{todaySound.grapheme}</span>
            <p className="text-sm text-emerald-600">{todaySound.phoneme}</p>
            <p className="text-xs text-emerald-500">{todaySound.keyword}</p>
            <button type="button" onClick={() => speak(todaySound.grapheme)} className="mt-2 min-h-[40px] px-4 rounded-2xl bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 mx-auto"><Volume2 size={14} />{lang === 'tr' ? 'Sesi duy' : 'Hear the sound'}</button>
          </div>
        )}

        {phase === 1 && plan.newWords.length > 0 && plan.newWords[listenIndex] && <PhaseListenStep word={plan.newWords[listenIndex]} index={listenIndex} total={plan.newWords.length} lang={lang} onNext={handleListenNext} />}
        {phase === 1 && plan.newWords.length === 0 && <p className="text-center text-gray-500 py-8">{lang === 'tr' ? 'Bugun yeni kelime yok.' : 'No new words today.'}</p>}
        {phase === 2 && plan.newWords.length > 0 && plan.newWords[seeIndex] && <PhaseSeeStep word={plan.newWords[seeIndex]} index={seeIndex} total={plan.newWords.length} lang={lang} onNext={handleSeeNext} onPrev={handleSeePrev} />}
        {phase === 3 && <PhasePlay words={plan.newWords} lang={lang} onComplete={handlePhase3Complete} />}
        {phase === 4 && <PhaseSpeak words={plan.newWords.slice(0, 3)} lang={lang} onComplete={handlePhase4Complete} />}
        {phase === 5 && <PhaseReview newWords={plan.newWords} reviewWords={[...plan.reviewWords, ...homeworkWords.filter((hw) => !plan.newWords.some((w) => w.word === hw.word) && !plan.reviewWords.some((w) => w.word === hw.word))]} lang={lang} onComplete={handlePhase5Complete} />}
        {phase === 6 && <PhaseStory words={plan.newWords} lang={lang} onComplete={handleStoryComplete} />}
      </div>
    </div>
  );
}
