/**
 * PhonicsLesson — Phonics lesson player.
 * Mobile-first, light mode only, all Tailwind inline. All business logic preserved.
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, ArrowLeft, Sparkles, Mic, BookOpen, PenTool, Trophy, Search, Target } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../../components/ui';
import { BlendingBoard } from '../../components/phonics/BlendingBoard';
import { LetterTracing } from '../../components/phonics/LetterTracing';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import { getSongByGroup } from '../../data/phonicsSongs';
import { ALL_SOUNDS, PHONICS_GROUPS } from '../../data/phonics';
import type { PhonicsSound, PhonicsGroup } from '../../data/phonics';
import MimiGuide from '../../components/MimiGuide';
import LottieCharacter from '../../components/LottieCharacter';
import { SFX } from '../../data/soundLibrary';
import { advanceToNextSound, recordSoundMastery } from '../../services/learningPathService';
import { setActiveUser, recordActivity } from '../../services/adaptiveEngine';
import { logActivity } from '../../services/activityLogger';
import { getPlantForSound, getPlantStage } from '../../data/gardenData';
import { LS_MASTERED_SOUNDS } from '../../config/storageKeys';
import { updatePlantGrowth, addWaterDrops } from '../../services/gardenService';
import { syncStudentProgress, getStudentClassroom, updateStudentProgress as updateClassroomProgress } from '../../services/classroomService';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { useLanguage } from '../../contexts/LanguageContext';

type LessonStep = 'hear' | 'do' | 'see' | 'build' | 'break' | 'write' | 'read' | 'sing' | 'celebrate';
const STEPS: LessonStep[] = ['hear', 'do', 'see', 'build', 'break', 'write', 'read', 'sing', 'celebrate'];
const STEP_LABELS: Record<LessonStep, { tr: string; en: string }> = {
  hear: { tr: 'Dinle', en: 'Listen' }, do: { tr: 'Yap', en: 'Do' }, see: { tr: 'Gor', en: 'See' },
  build: { tr: 'Olustur', en: 'Build' }, break: { tr: 'Bol', en: 'Break' }, write: { tr: 'Yaz', en: 'Write' },
  read: { tr: 'Oku', en: 'Read' }, sing: { tr: 'Soyle', en: 'Sing' }, celebrate: { tr: 'Tebrikler!', en: 'Congrats!' },
};

function speak(text: string, rate = 0.75) { if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate; window.speechSynthesis.speak(u); } }
function getTTSText(sound: PhonicsSound): string { return sound.sound.replace(/\(.*\)$/, '').replace(/\//g, '').trim(); }

function splitToSounds(word: string): string[] {
  const digraphs = ['sh', 'ch', 'th', 'ng', 'ck', 'ph', 'wh', 'qu', 'ai', 'ee', 'oo', 'or', 'ar', 'er', 'ou', 'oi', 'ue', 'ie', 'oa'];
  const sounds: string[] = []; let i = 0; const lower = word.toLowerCase();
  while (i < lower.length) { if (i + 1 < lower.length && digraphs.includes(lower.slice(i, i + 2))) { sounds.push(word.slice(i, i + 2)); i += 2; } else { sounds.push(word[i]); i += 1; } }
  return sounds;
}

function getSoundData(soundId: string) { const sound = ALL_SOUNDS.find((s) => s.id === soundId); if (!sound) return null; const group = PHONICS_GROUPS.find((g) => g.sounds.some((s) => s.id === soundId)); if (!group) return null; return { sound, group }; }

function getBlendingWords(sound: PhonicsSound, group: PhonicsGroup) {
  const graphemes = sound.grapheme.includes('/') ? sound.grapheme.split('/') : [sound.grapheme.toLowerCase()];
  return group.blendableWords.filter((w) => graphemes.some((g) => w.toLowerCase().includes(g.toLowerCase()))).slice(0, 3).map(w => ({ english: w, turkish: '', emoji: '' }));
}

function getSegmentingWords(sound: PhonicsSound, group: PhonicsGroup) {
  const graphemes = sound.grapheme.includes('/') ? sound.grapheme.split('/') : [sound.grapheme.toLowerCase()];
  const words = group.blendableWords.filter((w) => graphemes.some((g) => w.toLowerCase().includes(g.toLowerCase())));
  return words.slice(3, 6).length >= 3 ? words.slice(3, 6) : words.slice(0, 3);
}

const LETTER_COLORS = ['#FF6B35', '#7C3AED', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899'];
function getWordColor(word: string): string { return LETTER_COLORS[word.charCodeAt(0) % LETTER_COLORS.length]; }

function PhonicsLesson() {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addXP } = useGamification();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';

  const data = useMemo(() => (soundId ? getSoundData(soundId) : null), [soundId]);
  const [stepIndex, setStepIndex] = useState(0);
  const [clickedKeywords, setClickedKeywords] = useState<Set<string>>(new Set());
  const [segmentingIndex, setSegmentingIndex] = useState(0);
  const [segmentingRevealed, setSegmentingRevealed] = useState(false);
  const [blendingDone, setBlendingDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  useEffect(() => { setStepIndex(0); setClickedKeywords(new Set()); setSegmentingIndex(0); setSegmentingRevealed(false); setBlendingDone(false); setXpEarned(0); }, [soundId]);

  const goNext = useCallback(() => { if (stepIndex < STEPS.length - 1) { SFX.click(); setStepIndex((s) => s + 1); } }, [stepIndex]);
  const goBack = useCallback(() => { if (stepIndex > 0) setStepIndex((s) => s - 1); }, [stepIndex]);

  // Celebrate side-effects
  useEffect(() => {
    if (currentStep !== 'celebrate' || !soundId) return;
    const totalXP = xpEarned + 50;
    try { const existing = JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[]; if (!existing.includes(soundId)) { existing.push(soundId); localStorage.setItem(LS_MASTERED_SOUNDS, JSON.stringify(existing)); } } catch { /* */ }
    recordSoundMastery(soundId, 100, user?.uid);
    if (user?.uid) { setActiveUser(user.uid); recordActivity({ soundId, activityType: 'phonics-lesson', correct: true, responseTimeMs: (stepIndex + 1) * 45000, totalQuestions: STEPS.length, correctAnswers: STEPS.length }); }
    SFX.celebration();
    updatePlantGrowth(soundId, 100); addWaterDrops(3);
    addXP(totalXP, 'phonics_lesson');
    logActivity({ type: 'phonics', title: `Learned the "${data?.sound.grapheme || soundId}" sound`, duration: Math.round((stepIndex + 1) * 45), accuracy: 100, xpEarned: totalXP, soundId }, user?.uid);
    syncStudentProgress(totalXP);
    const membership = getStudentClassroom();
    if (membership && soundId) updateClassroomProgress(membership.classroomId, membership.studentId, soundId, 100);
  }, [currentStep, soundId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <Search size={48} className="text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-900">{isTr ? 'Ses bulunamadi' : 'Sound not found'}</h2>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>{isTr ? 'Ana Sayfaya Don' : 'Back to Dashboard'}</Button>
      </div>
    );
  }

  const { sound, group } = data;
  const keywords = sound.keywords.slice(0, 6).map((word) => ({ word, color: getWordColor(word) }));
  const blendingWords = getBlendingWords(sound, group);
  const segmentingWords = getSegmentingWords(sound, group);

  const renderHear = () => (
    <motion.div key="hear" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl font-extrabold text-gray-900">{sound.grapheme}</motion.div>
      <p className="text-sm text-gray-600">{isTr ? 'Dinle! Bu harf sunu soyler...' : 'Listen! This letter says...'}</p>
      <button type="button" onClick={() => { const t = getTTSText(sound); speak(t, 0.5); setTimeout(() => speak(t, 0.5), 1000); setTimeout(() => speak(t, 0.5), 2000); }} className="min-h-[56px] px-8 rounded-3xl bg-amber-500 text-white font-bold flex items-center gap-2 shadow-md active:scale-95"><Volume2 size={20} />{isTr ? '3 kez dinle' : 'Listen 3 times'}</button>
      <div className="rounded-2xl bg-emerald-50 p-4 flex items-start gap-3 w-full"><LottieCharacter state="happy" size={40} /><p className="text-sm text-gray-700">{sound.story}</p></div>
      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
    </motion.div>
  );

  const renderDo = () => (
    <motion.div key="do" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${getWordColor(sound.grapheme)} 0%, ${getWordColor(sound.sound)} 100%)` }}>{sound.grapheme.toUpperCase()}</motion.div>
      <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4 text-center w-full"><p className="text-base font-bold text-gray-800">{sound.action}</p></div>
      <div className="flex gap-3 w-full">
        <button type="button" onClick={() => speak(getTTSText(sound), 0.6)} className="flex-1 min-h-[48px] rounded-3xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95"><Volume2 size={18} />{isTr ? 'Beraber soyle!' : 'Say it together!'}</button>
        <button type="button" onClick={() => {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) { toast.error(isTr ? 'Tarayin ses tanima desteklemiyor.' : 'Your browser does not support speech recognition.'); return; }
          const r = new SR(); r.lang = 'en-US'; r.interimResults = false; setIsListening(true);
          r.onresult = () => { setIsListening(false); SFX.correct(); }; r.onerror = () => setIsListening(false); r.onend = () => setIsListening(false); r.start();
        }} disabled={isListening} className="flex-1 min-h-[48px] rounded-3xl bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"><Mic size={18} />{isListening ? (isTr ? 'Dinleniyor...' : 'Listening...') : (isTr ? 'Kaydet!' : 'Record!')}</button>
      </div>
      <p className="text-xs text-gray-500 text-center">{sound.turkishNote}</p>
      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Yaptim!' : 'Done!'}</Button>
    </motion.div>
  );

  const renderSee = () => {
    const allClicked = keywords.every((kw) => clickedKeywords.has(kw.word));
    return (
      <motion.div key="see" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-600">{isTr ? 'Her kelimeye dokunarak dinle!' : 'Tap each word to hear it!'}</p>
        <div className="grid grid-cols-2 gap-3 w-full">
          {keywords.map((kw) => {
            const idx = kw.word.toLowerCase().indexOf(sound.grapheme.toLowerCase());
            const clicked = clickedKeywords.has(kw.word);
            return (
              <motion.button type="button" key={kw.word} whileTap={{ scale: 0.95 }} onClick={() => { speak(kw.word, 0.8); setClickedKeywords((prev) => new Set(prev).add(kw.word)); }}
                className={`min-h-[56px] rounded-2xl px-3 py-2 flex items-center gap-2 border-2 transition-all ${clicked ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: kw.color }}>{kw.word.charAt(0).toUpperCase()}</div>
                <span className="text-sm font-bold text-gray-800">
                  {idx >= 0 ? <>{kw.word.slice(0, idx)}<span className="text-orange-500 underline">{kw.word.slice(idx, idx + sound.grapheme.length)}</span>{kw.word.slice(idx + sound.grapheme.length)}</> : kw.word}
                </span>
              </motion.button>
            );
          })}
        </div>
        {allClicked && <Badge variant="success" icon={<Sparkles size={14} />}>{isTr ? 'Tum kelimeler dinlendi!' : 'All words listened!'}</Badge>}
        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext} disabled={!allClicked}>{isTr ? 'Devam Et' : 'Continue'}</Button>
      </motion.div>
    );
  };

  const renderBuild = () => (
    <motion.div key="build" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
      {blendingDone ? (
        <>
          <Badge variant="success" icon={<Sparkles size={14} />}>{isTr ? 'Birlestirme tamamlandi!' : 'Blending complete!'}</Badge>
          <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
        </>
      ) : (
        <BlendingBoard words={blendingWords} onComplete={(score) => { setXpEarned((prev) => prev + score * 15); setBlendingDone(true); }} />
      )}
    </motion.div>
  );

  const renderBreak = () => {
    if (segmentingWords.length === 0) {
      return (
        <motion.div key="break-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
          <Target size={48} className="text-emerald-600" /><h3 className="text-lg font-bold text-gray-900">{isTr ? 'Harika!' : 'Great job!'}</h3>
          <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
        </motion.div>
      );
    }
    const currentWord = segmentingWords[segmentingIndex] || segmentingWords[0];
    const currentSounds = currentWord ? splitToSounds(currentWord) : [];
    const allDone = segmentingIndex >= segmentingWords.length;
    if (allDone) return (
      <motion.div key="break-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-8">
        <Target size={48} className="text-emerald-600" /><h3 className="text-lg font-bold text-gray-900">{isTr ? 'Harika bolme!' : 'Great segmenting!'}</h3>
        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
      </motion.div>
    );
    return (
      <motion.div key={`break-${segmentingIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-600">{isTr ? 'Bu kelimeyi seslere bol!' : 'Break this word into sounds!'}</p>
        <Badge variant="info">{segmentingIndex + 1}/{segmentingWords.length}</Badge>
        <motion.button type="button" onClick={() => speak(currentWord, 0.8)} whileTap={{ scale: 0.95 }} className="text-3xl font-extrabold text-gray-900 bg-amber-50 border border-amber-200 rounded-3xl px-6 py-4 flex items-center gap-2"><Volume2 size={18} className="text-amber-600" />{currentWord}</motion.button>
        {!segmentingRevealed ? (
          <button type="button" onClick={() => { setSegmentingRevealed(true); currentSounds.forEach((s, i) => { setTimeout(() => speak(s, 0.5), i * 600); }); }} className="min-h-[56px] px-8 rounded-3xl bg-amber-500 text-white font-bold shadow-md active:scale-95">{isTr ? 'Sesleri goster!' : 'Show sounds!'}</button>
        ) : (
          <>
            <div className="flex gap-2">{currentSounds.map((s, i) => <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 }} onClick={() => speak(s, 0.5)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speak(s, 0.5); } }} className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 text-xl font-extrabold flex items-center justify-center cursor-pointer active:scale-95">{s}</motion.div>)}</div>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={() => { setSegmentingRevealed(false); setSegmentingIndex((i) => i + 1); setXpEarned((prev) => prev + 10); }}>
              {segmentingIndex + 1 < segmentingWords.length ? (isTr ? 'Sonraki kelime' : 'Next word') : (isTr ? 'Tamam!' : 'Done!')}
            </Button>
          </>
        )}
      </motion.div>
    );
  };

  const renderWrite = () => (
    <motion.div key="write" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2"><PenTool size={18} className="text-emerald-600" /><p className="text-sm text-gray-600">{isTr ? 'Harfi parmaninla takip et!' : 'Trace the letter with your finger!'}</p></div>
      <LetterTracing letter={sound.grapheme.toLowerCase().charAt(0)} onComplete={(accuracy) => { setXpEarned((prev) => prev + Math.round(accuracy * 0.2)); if (accuracy >= 40) setTimeout(goNext, 1200); }} difficulty="guided" />
    </motion.div>
  );

  const renderRead = () => {
    const decodableText = group.decodableText;
    const words = decodableText.split(/\s+/);
    return (
      <motion.div key="read" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2"><BookOpen size={18} className="text-emerald-600" /><p className="text-sm text-gray-600">{isTr ? 'Kelimeye dokunarak dinle!' : 'Tap any word to hear it!'}</p></div>
        <Card variant="elevated" padding="lg">
          <div className="flex flex-wrap gap-2">
            {words.map((word, i) => <motion.button type="button" key={i} whileTap={{ scale: 0.9 }} onClick={() => { const clean = word.replace(/[^a-zA-Z']/g, ''); if (clean) speak(clean, 0.75); }} className="text-lg font-bold text-gray-800 bg-amber-50 rounded-xl px-2 py-1 active:bg-amber-100">{word}</motion.button>)}
          </div>
        </Card>
        <button type="button" onClick={() => speak(decodableText, 0.8)} className="min-h-[48px] px-6 rounded-3xl bg-amber-500 text-white font-bold text-sm flex items-center gap-2 active:scale-95"><Volume2 size={16} />{isTr ? 'Yuksek sesle oku!' : 'Read aloud!'}</button>
        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
      </motion.div>
    );
  };

  const renderSing = () => {
    const groupSong = getSongByGroup(sound.group);
    if (!groupSong) return (
      <motion.div key="sing-skip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-8">
        <p className="text-sm text-gray-500">{isTr ? 'Bu grup icin henuz sarki yok.' : 'No song available yet.'}</p>
        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>{isTr ? 'Devam Et' : 'Continue'}</Button>
      </motion.div>
    );
    return (
      <motion.div key="sing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <SongPlayer song={groupSong} mode="singalong" onComplete={() => { setXpEarned((prev) => prev + 25); goNext(); }} />
      </motion.div>
    );
  };

  const renderCelebrate = () => {
    const totalXP = xpEarned + 50;
    const gardenPlant = getPlantForSound(soundId!);
    const plantStage = gardenPlant ? getPlantStage(gardenPlant, 100) : null;
    const currentGroup = PHONICS_GROUPS.find((g) => g.sounds.some((s) => s.id === soundId));
    let nextSoundInGroup: PhonicsSound | null = null;
    let isGroupComplete = false;
    if (currentGroup) {
      const idx = currentGroup.sounds.findIndex((s) => s.id === soundId);
      if (idx + 1 < currentGroup.sounds.length) nextSoundInGroup = currentGroup.sounds[idx + 1];
      else { isGroupComplete = true; const gi = PHONICS_GROUPS.indexOf(currentGroup); if (gi + 1 < PHONICS_GROUPS.length) nextSoundInGroup = PHONICS_GROUPS[gi + 1].sounds[0] || null; }
    }
    const handleNextSound = () => { const next = advanceToNextSound(); if (next) navigate(`/phonics/${next.id}`); else navigate('/dashboard'); };

    return (
      <motion.div key="celebrate" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="flex flex-col items-center gap-4">
        <motion.div animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl"><Trophy size={48} color="#fff" /></motion.div>
        <h2 className="text-2xl font-extrabold text-gray-900">{isGroupComplete ? (isTr ? 'Grup Tamamlandi!' : 'Group Complete!') : (isTr ? 'Harika is!' : 'Great job!')}</h2>
        <p className="text-sm text-gray-500 text-center">{isGroupComplete ? (isTr ? `${currentGroup?.name || ''} tum sesleri ogrendin!` : `You learned all sounds in ${currentGroup?.name || 'this group'}!`) : (isTr ? <>&quot;{sound.grapheme}&quot; sesini ogrendin!</> : <>You learned the &quot;{sound.grapheme}&quot; sound!</>)}</p>
        <Card variant="elevated" padding="lg">
          <div className="flex flex-col items-center gap-2">
            <Badge variant="success" icon={<Sparkles size={14} />}>+{totalXP} XP {isTr ? 'kazandin!' : 'earned!'}</Badge>
            {gardenPlant && plantStage && <p className="text-xs text-gray-500">{isTr ? `Bitkin buyudu! ${plantStage.name} asamasinda!` : `Your plant grew to ${plantStage.name}!`}</p>}
          </div>
        </Card>
        <div className="flex flex-col gap-2 w-full">
          {nextSoundInGroup ? (
            <button type="button" onClick={handleNextSound} className="min-h-[56px] w-full rounded-3xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"><ArrowRight size={18} />{isTr ? `Sonraki Ses: ${nextSoundInGroup.grapheme.toUpperCase()}` : `Next Sound: ${nextSoundInGroup.grapheme.toUpperCase()}`}</button>
          ) : isGroupComplete && (
            <button type="button" onClick={() => navigate('/dashboard')} className="min-h-[56px] w-full rounded-3xl bg-amber-500 text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"><Sparkles size={18} />{isTr ? 'Tum Sesler Tamamlandi!' : 'All Sounds Complete!'}</button>
          )}
          <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')} fullWidth>{isTr ? 'Ana Sayfaya Don' : 'Back to Dashboard'}</Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button type="button" onClick={goBack} disabled={stepIndex === 0} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center disabled:opacity-30"><ArrowLeft size={18} className="text-gray-600" /></button>
          <div className="flex-1"><ProgressBar value={progress} variant="success" size="sm" animated /></div>
          <Badge variant="info">{isTr ? STEP_LABELS[currentStep].tr : STEP_LABELS[currentStep].en}</Badge>
        </div>

        {/* Step dots */}
        <div className="flex gap-1 justify-center mb-4">{STEPS.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < stepIndex ? 'bg-emerald-500' : i === stepIndex ? 'bg-emerald-700' : 'bg-gray-300'}`} />)}</div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {currentStep === 'hear' && renderHear()}
          {currentStep === 'do' && renderDo()}
          {currentStep === 'see' && renderSee()}
          {currentStep === 'build' && renderBuild()}
          {currentStep === 'break' && renderBreak()}
          {currentStep === 'write' && renderWrite()}
          {currentStep === 'read' && renderRead()}
          {currentStep === 'sing' && renderSing()}
          {currentStep === 'celebrate' && renderCelebrate()}
        </AnimatePresence>

        {/* Shortcut link */}
        <div className="text-center mt-4">
          <Link to="/phonetics/traps" className="text-xs font-bold text-orange-500 border border-orange-300 rounded-full px-3 py-1.5 inline-flex items-center gap-1">
            {isTr ? 'Turkce Zorluklarim' : 'My Turkish Challenges'}
          </Link>
        </div>

        <MimiGuide message="Listen carefully, then try saying the sound!" messageTr="Dikkatlice dinle, sonra sesi soylemeyi dene!" showOnce="mimi_guide_phonics" position="bottom-left" />
      </div>
    </div>
  );
}

export default PhonicsLesson;
