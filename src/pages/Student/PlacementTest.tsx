/**
 * PlacementTest — Level assessment test for young children.
 * Mobile-first, light mode only, all Tailwind inline. All business logic preserved.
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Check, Star } from 'lucide-react';
import { Button, ProgressBar, StarBurst } from '../../components/ui';
import { SFX } from '../../data/soundLibrary';
import MimiGuide from '../../components/MimiGuide';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { LS_PLACEMENT_RESULT } from '../../config/storageKeys';

// ─── SVG Illustrations ───────────────────────────────────────────────────────

function CatSVG() { return <svg viewBox="0 0 100 100" width="80" height="80"><circle cx="50" cy="55" r="30" fill="#94A3B8" /><polygon points="25,35 20,10 40,30" fill="#94A3B8" /><polygon points="27,32 23,15 37,30" fill="#F9A8D4" /><polygon points="75,35 80,10 60,30" fill="#94A3B8" /><polygon points="73,32 77,15 63,30" fill="#F9A8D4" /><circle cx="38" cy="50" r="5" fill="#22C55E" /><circle cx="62" cy="50" r="5" fill="#22C55E" /><circle cx="39" cy="49" r="2" fill="#0C0F1A" /><circle cx="63" cy="49" r="2" fill="#0C0F1A" /><polygon points="50,58 47,62 53,62" fill="#F9A8D4" /><path d="M47,64 Q50,68 53,64" fill="none" stroke="#64748B" strokeWidth="1.5" /></svg>; }
function HatSVG() { return <svg viewBox="0 0 100 100" width="80" height="80"><ellipse cx="50" cy="78" rx="45" ry="8" fill="#1E40AF" /><rect x="28" y="30" width="44" height="48" rx="3" fill="#2563EB" /><rect x="25" y="28" width="50" height="6" rx="2" fill="#1E40AF" /><rect x="28" y="60" width="44" height="6" fill="#FBBF24" /></svg>; }
function BatSVG() { return <svg viewBox="0 0 120 80" width="90" height="60"><ellipse cx="60" cy="45" rx="12" ry="18" fill="#475569" /><circle cx="60" cy="25" r="10" fill="#475569" /><polygon points="52,18 48,5 56,16" fill="#475569" /><polygon points="68,18 72,5 64,16" fill="#475569" /><circle cx="56" cy="23" r="2.5" fill="#FBBF24" /><circle cx="64" cy="23" r="2.5" fill="#FBBF24" /><path d="M48,38 Q20,20 5,45 Q15,40 25,42 Q18,50 10,55 Q25,48 35,50 Q30,55 28,62 L48,50Z" fill="#334155" /><path d="M72,38 Q100,20 115,45 Q105,40 95,42 Q102,50 110,55 Q95,48 85,50 Q90,55 92,62 L72,50Z" fill="#334155" /></svg>; }
function PinSVG() { return <svg viewBox="0 0 60 100" width="50" height="80"><circle cx="30" cy="22" r="18" fill="#EF4444" /><circle cx="30" cy="22" r="8" fill="#FCA5A5" /><rect x="28" y="38" width="4" height="40" fill="#94A3B8" /><polygon points="28,78 32,78 30,95" fill="#64748B" /></svg>; }
function PenSVG() { return <svg viewBox="0 0 100 100" width="70" height="70"><rect x="20" y="35" width="55" height="14" rx="2" fill="#3B82F6" transform="rotate(-30 50 42)" /><rect x="15" y="40" width="15" height="10" rx="1" fill="#1E40AF" transform="rotate(-30 22 45)" /><polygon points="72,58 85,68 70,63" fill="#94A3B8" transform="rotate(-5 75 62)" /></svg>; }
function PanSVG() { return <svg viewBox="0 0 120 80" width="90" height="60"><ellipse cx="50" cy="45" rx="35" ry="25" fill="#475569" /><ellipse cx="50" cy="42" rx="30" ry="20" fill="#64748B" /><rect x="82" y="38" width="35" height="8" rx="3" fill="#92400E" /></svg>; }
function BigDogSVG() { return <svg viewBox="0 0 120 130" width="110" height="110"><ellipse cx="60" cy="80" rx="40" ry="25" fill="#92400E" /><circle cx="60" cy="38" r="25" fill="#A16207" /><circle cx="50" cy="35" r="4" fill="#0C0F1A" /><circle cx="70" cy="35" r="4" fill="#0C0F1A" /><ellipse cx="60" cy="45" rx="5" ry="3.5" fill="#0C0F1A" /><rect x="30" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="50" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="60" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="80" y="98" width="10" height="22" rx="4" fill="#92400E" /></svg>; }
function SmallDogSVG() { return <svg viewBox="0 0 120 130" width="55" height="55"><ellipse cx="60" cy="80" rx="40" ry="25" fill="#92400E" /><circle cx="60" cy="38" r="25" fill="#A16207" /><circle cx="50" cy="35" r="4" fill="#0C0F1A" /><circle cx="70" cy="35" r="4" fill="#0C0F1A" /><rect x="30" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="50" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="60" y="98" width="10" height="22" rx="4" fill="#92400E" /><rect x="80" y="98" width="10" height="22" rx="4" fill="#92400E" /></svg>; }
function MimiDragonSVG() { return <svg viewBox="0 0 120 140" width="120" height="140"><ellipse cx="60" cy="100" rx="30" ry="25" fill="#22C55E" /><ellipse cx="60" cy="105" rx="20" ry="18" fill="#86EFAC" /><circle cx="60" cy="55" r="28" fill="#22C55E" /><ellipse cx="48" cy="48" rx="7" ry="8" fill="#fff" /><ellipse cx="72" cy="48" rx="7" ry="8" fill="#fff" /><circle cx="50" cy="49" r="4" fill="#FBBF24" /><circle cx="74" cy="49" r="4" fill="#FBBF24" /><circle cx="51" cy="48" r="2" fill="#0C0F1A" /><circle cx="75" cy="48" r="2" fill="#0C0F1A" /><path d="M45,68 Q60,80 75,68" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" /><polygon points="45,30 40,12 50,28" fill="#FBBF24" /><polygon points="75,30 80,12 70,28" fill="#FBBF24" /></svg>; }

const ptContent = {
  en: { letsPlay: "Let's Play!", funQuestions: '5 fun questions', go: 'Go!', allDone: 'All Done!', startLearning: 'Start Learning!', great: 'Great!', almost: 'Almost!' },
  tr: { letsPlay: 'Hadi Oynayalim!', funQuestions: '5 eglenceli soru', go: 'Basla!', allDone: 'Tamamlandi!', startLearning: 'Ogrenmeye Basla!', great: 'Harika!', almost: 'Neredeyse!' },
} as const;

type QuestionType = 'phoneme' | 'letter-sound' | 'blending' | 'decoding' | 'comprehension';
interface PlacementQuestion { id: number; type: QuestionType; ttsPrompt?: string; display?: string; soundTiles?: string[]; soundOptions?: string[]; options: string[]; correctIndex: number; mimiEncouragement: string; mimiEncouragementTr: string; }
interface PlacementResult { score: number; total: number; phase: number; group: number; phaseLabel: string; timestamp: string; }

const QUESTIONS: PlacementQuestion[] = [
  { id: 1, type: 'phoneme', ttsPrompt: 'sun', options: ['S', 'M', 'B'], correctIndex: 0, mimiEncouragement: 'Great listening!', mimiEncouragementTr: 'Harika dinleme!' },
  { id: 2, type: 'letter-sound', display: 'T', soundOptions: ['tuh', 'puh', 'kuh'], options: ['1', '2', '3'], correctIndex: 0, mimiEncouragement: 'You know your letters!', mimiEncouragementTr: 'Harfleri biliyorsun!' },
  { id: 3, type: 'blending', soundTiles: ['C', 'A', 'T'], options: ['cat', 'hat', 'bat'], correctIndex: 0, mimiEncouragement: 'Perfect blending!', mimiEncouragementTr: 'Mukemmel birlestirme!' },
  { id: 4, type: 'decoding', display: 'pin', options: ['pin', 'pen', 'pan'], correctIndex: 0, mimiEncouragement: 'You can read!', mimiEncouragementTr: 'Okuyabiliyorsun!' },
  { id: 5, type: 'comprehension', display: 'The dog is big.', options: ['big', 'small'], correctIndex: 0, mimiEncouragement: 'You understood it!', mimiEncouragementTr: 'Anladin!' },
];

function getPlacementResult(score: number, isTr: boolean) {
  if (score <= 1) return { phase: 1, group: 1, phaseLabel: isTr ? 'Asama 1: Ilk Sesler' : 'Phase 1: First Sounds' };
  if (score === 2) return { phase: 1, group: 2, phaseLabel: isTr ? 'Asama 1: Daha Fazla Harf' : 'Phase 1: More Letters' };
  if (score === 3) return { phase: 2, group: 3, phaseLabel: isTr ? 'Asama 2: Gelisen Harfler' : 'Phase 2: Growing Letters' };
  if (score === 4) return { phase: 3, group: 5, phaseLabel: isTr ? 'Asama 3: Zor Sesler' : 'Phase 3: Tricky Sounds' };
  return { phase: 4, group: 7, phaseLabel: isTr ? 'Asama 4: Son Sesler' : 'Phase 4: Final Sounds' };
}

function speakTTS(text: string, rate = 0.75) {
  if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate; window.speechSynthesis.speak(u); }
}

function renderPicture(key: string) {
  switch (key) { case 'cat': return <CatSVG />; case 'hat': return <HatSVG />; case 'bat': return <BatSVG />; case 'pin': return <PinSVG />; case 'pen': return <PenSVG />; case 'pan': return <PanSVG />; case 'big': return <BigDogSVG />; case 'small': return <SmallDogSVG />; default: return null; }
}

const SOUND_COLORS = ['#EF4444', '#3B82F6', '#22C55E'];

type Screen = 'intro' | 'question' | 'feedback' | 'result';

function PlacementTest() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const isTr = lang === 'tr';
  const txt = ptContent[lang];
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const question = QUESTIONS[currentQ];

  useEffect(() => {
    if (screen === 'question' && question) {
      const timer = setTimeout(() => {
        if (question.ttsPrompt) speakTTS(question.ttsPrompt, 0.7);
        if (question.soundTiles) question.soundTiles.forEach((s, i) => { setTimeout(() => speakTTS(s, 0.5), i * 700); });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [screen, currentQ, question]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedIndex !== null) return;
    const correct = index === question.correctIndex;
    setSelectedIndex(index); setIsCorrect(correct);
    if (correct) SFX.correct(); else SFX.wrong();
    setAnswers((a) => [...a, correct]); setScreen('feedback');
    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) { setCurrentQ((q) => q + 1); setSelectedIndex(null); setScreen('question'); }
      else {
        const newAnswers = [...answers, correct];
        const finalScore = newAnswers.filter(Boolean).length;
        const placement = getPlacementResult(finalScore, isTr);
        const res: PlacementResult = { score: finalScore, total: QUESTIONS.length, ...placement, timestamp: new Date().toISOString() };
        setResult(res);
        localStorage.setItem(LS_PLACEMENT_RESULT, String(res.group));
        localStorage.setItem('mimi_placement_detail', JSON.stringify({ ...res, phaseIndex: res.phase - 1 }));
        if (user) {
          const uid = user.uid;
          if (uid) { userService.getUserProfile(uid).then(existing => { const base = (existing?.settings as Record<string, unknown>) ?? {}; userService.updateUserProfile(uid, { settings: { ...base, placement_phase: res.phase, placement_group: res.group, placement_score: res.score, placement_date: res.timestamp, setup_completed: true } }).catch(() => {}); }).catch(() => {}); }
        }
        setShowStarBurst(true); setTimeout(() => setShowStarBurst(false), 1500); setScreen('result');
      }
    }, 1500);
  }, [selectedIndex, question, currentQ, answers, isTr, user]);

  // ── Intro
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}><MimiDragonSVG /></motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900">{txt.letsPlay}</h1>
          <p className="text-lg text-gray-500">{txt.funQuestions}</p>
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setScreen('question')} className="min-h-[80px] px-12 rounded-3xl bg-orange-500 text-white text-2xl font-extrabold shadow-xl active:scale-95 transition-transform">{txt.go}</motion.button>
        </motion.div>
        <MimiGuide message="Just try your best! There's no pressure." messageTr="Sadece elinden gelenin en iyisini yap!" showOnce="mimi_guide_placement" />
      </div>
    );
  }

  // ── Result
  if (screen === 'result' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4">
        {showStarBurst && <StarBurst count={16} />}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><MimiDragonSVG /></motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900">{txt.allDone}</h1>
          <div className="flex gap-2">{answers.map((correct, i) => <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }} className={`w-10 h-10 rounded-full flex items-center justify-center ${correct ? 'bg-emerald-500' : 'bg-amber-400'}`}>{correct && <Check size={18} color="#fff" strokeWidth={3} />}</motion.div>)}</div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2"><Star size={18} className="text-orange-500" fill="#F97316" /><span className="text-sm font-bold text-gray-800">{result.phaseLabel}</span></div>
          <Button variant="primary" size="xl" onClick={() => navigate('/dashboard')} style={{ minHeight: 80, fontSize: '1.3rem' }} fullWidth>{txt.startLearning}</Button>
        </motion.div>
      </div>
    );
  }

  // ── Question + Feedback
  const progress = ((currentQ + (screen === 'feedback' ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-6 flex flex-col items-center">
      {/* Progress dots */}
      <div className="flex gap-2 mb-3">{QUESTIONS.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < currentQ ? (answers[i] ? 'bg-emerald-500' : 'bg-amber-400') : i === currentQ ? 'bg-orange-500 scale-125' : 'bg-gray-200'}`} />)}</div>
      <div className="w-full max-w-sm mb-6"><ProgressBar value={progress} variant="success" size="sm" animated /></div>

      <AnimatePresence mode="wait">
        {screen === 'feedback' ? (
          <motion.div key="feedback" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="flex flex-col items-center gap-4 py-8">
            {isCorrect ? (
              <>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}><Check size={72} className="text-emerald-500" strokeWidth={3} /></motion.div>
                <p className="text-2xl font-extrabold text-emerald-600">{txt.great}</p>
              </>
            ) : (
              <>
                <span className="text-5xl font-extrabold text-amber-500">~</span>
                <p className="text-xl font-bold text-amber-600">{txt.almost}</p>
                <div className="flex justify-center">{renderPicture(question.options[question.correctIndex])}</div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key={`q-${question.id}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} className="w-full max-w-sm flex flex-col items-center gap-4">
            {question.type === 'phoneme' && (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{isTr ? 'Dinle!' : 'Listen!'}</h2>
                <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => speakTTS(question.ttsPrompt!, 0.7)} className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-md"><Volume2 size={40} className="text-gray-700" /></motion.button>
                <div className="flex gap-3 w-full">{question.options.map((letter, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(i)} disabled={selectedIndex !== null} className={`flex-1 min-h-[96px] rounded-3xl flex items-center justify-center border-3 transition-all ${selectedIndex !== null ? (selectedIndex === i ? (i === question.correctIndex ? 'bg-emerald-100 border-emerald-400' : 'bg-amber-100 border-amber-400') : 'opacity-40 border-gray-200') : 'bg-white border-gray-200 shadow-sm active:scale-95'}`}><span className="text-5xl font-extrabold text-gray-900">{letter}</span></motion.button>)}</div>
              </>
            )}
            {question.type === 'letter-sound' && (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{isTr ? 'Hangi ses?' : 'What sound?'}</h2>
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}><span className="text-7xl font-extrabold text-gray-900">{question.display}</span></motion.div>
                <div className="flex gap-3 w-full">{question.options.map((_, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.92 }} onClick={() => { if (question.soundOptions) speakTTS(question.soundOptions[i], 0.5); if (selectedIndex === null) handleAnswer(i); }} disabled={selectedIndex !== null} className="flex-1 min-h-[80px] rounded-3xl flex flex-col items-center justify-center gap-1 border-3 transition-all" style={{ borderColor: selectedIndex !== null ? (selectedIndex === i ? (i === question.correctIndex ? '#22C55E' : '#F59E0B') : 'transparent') : SOUND_COLORS[i], opacity: selectedIndex !== null && selectedIndex !== i ? 0.4 : 1 }}><Play size={24} color={SOUND_COLORS[i]} fill={SOUND_COLORS[i]} /><span className="text-sm font-bold text-gray-500">{i + 1}</span></motion.button>)}</div>
              </>
            )}
            {question.type === 'blending' && (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{isTr ? 'Kelimeyi olustur!' : 'Build the word!'}</h2>
                <div className="flex gap-3">{(question.soundTiles ?? []).map((tile, i) => <motion.button type="button" key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} onClick={() => speakTTS(tile, 0.5)} className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 text-2xl font-extrabold flex items-center justify-center shadow-sm active:scale-95">{tile}</motion.button>)}</div>
                <div className="flex gap-3 w-full">{question.options.map((key, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(i)} disabled={selectedIndex !== null} className={`flex-1 min-h-[100px] rounded-3xl flex items-center justify-center border-3 transition-all ${selectedIndex !== null ? (selectedIndex === i ? (i === question.correctIndex ? 'bg-emerald-100 border-emerald-400' : 'bg-amber-100 border-amber-400') : 'opacity-40 border-gray-200') : 'bg-white border-gray-200 shadow-sm active:scale-95'}`}>{renderPicture(key)}</motion.button>)}</div>
              </>
            )}
            {question.type === 'decoding' && (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{isTr ? 'Bunu oku!' : 'Read this!'}</h2>
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}><span className="text-5xl font-extrabold text-gray-900">{question.display}</span></motion.div>
                <div className="flex gap-3 w-full">{question.options.map((key, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(i)} disabled={selectedIndex !== null} className={`flex-1 min-h-[100px] rounded-3xl flex items-center justify-center border-3 transition-all ${selectedIndex !== null ? (selectedIndex === i ? (i === question.correctIndex ? 'bg-emerald-100 border-emerald-400' : 'bg-amber-100 border-amber-400') : 'opacity-40 border-gray-200') : 'bg-white border-gray-200 shadow-sm active:scale-95'}`}>{renderPicture(key)}</motion.button>)}</div>
              </>
            )}
            {question.type === 'comprehension' && (
              <>
                <h2 className="text-xl font-extrabold text-gray-900">{isTr ? 'Hangisi?' : 'Which one?'}</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-3xl px-6 py-4"><span className="text-xl font-bold text-gray-800">{question.display}</span></div>
                <div className="flex gap-4 w-full">{question.options.map((key, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.93 }} onClick={() => handleAnswer(i)} disabled={selectedIndex !== null} className={`flex-1 min-h-[140px] rounded-3xl flex items-center justify-center border-3 transition-all ${selectedIndex !== null ? (selectedIndex === i ? (i === question.correctIndex ? 'bg-emerald-100 border-emerald-400' : 'bg-amber-100 border-amber-400') : 'opacity-40 border-gray-200') : 'bg-white border-gray-200 shadow-sm active:scale-95'}`}>{renderPicture(key)}</motion.button>)}</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlacementTest;
