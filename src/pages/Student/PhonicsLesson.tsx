import { useState, useCallback, useEffect, useMemo } from 'react';
import './PhonicsLesson.css';
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

// ─── Types ─────────────────────────────────────────────────────────────────

type LessonStep = 'hear' | 'do' | 'see' | 'build' | 'break' | 'write' | 'read' | 'sing' | 'celebrate';

const STEPS: LessonStep[] = ['hear', 'do', 'see', 'build', 'break', 'write', 'read', 'sing', 'celebrate'];

const STEP_LABELS: Record<LessonStep, string> = {
  hear: 'Dinle',
  do: 'Yap',
  see: 'Gör',
  build: 'Oluştur',
  break: 'Böl',
  write: 'Yaz',
  read: 'Oku',
  sing: 'Söyle',
  celebrate: 'Tebrikler!',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function speak(text: string, rate = 0.75) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }
}

function splitToSounds(word: string): string[] {
  const digraphs = ['sh', 'ch', 'th', 'ng', 'ck', 'qu', 'ai', 'ee', 'oo', 'or', 'ar', 'er', 'ou', 'oi', 'ue', 'ie', 'oa'];
  const sounds: string[] = [];
  let i = 0;
  const lower = word.toLowerCase();
  while (i < lower.length) {
    if (i + 1 < lower.length) {
      const pair = lower.slice(i, i + 2);
      if (digraphs.includes(pair)) {
        sounds.push(word.slice(i, i + 2));
        i += 2;
        continue;
      }
    }
    sounds.push(word[i]);
    i += 1;
  }
  return sounds;
}

function getSoundData(soundId: string): { sound: PhonicsSound; group: PhonicsGroup } | null {
  const sound = ALL_SOUNDS.find((s) => s.id === soundId);
  if (!sound) return null;
  const group = PHONICS_GROUPS.find((g) => g.sounds.some((s) => s.id === soundId));
  if (!group) return null;
  return { sound, group };
}

/** Build blending words for a sound from the group's blendableWords */
function getBlendingWords(sound: PhonicsSound, group: PhonicsGroup): { english: string; turkish: string; emoji: string }[] {
  // For digraphs like "c/k", split and check each part
  const graphemes = sound.grapheme.includes('/')
    ? sound.grapheme.split('/')
    : [sound.grapheme.toLowerCase()];

  return group.blendableWords
    .filter((w) => graphemes.some((g) => w.toLowerCase().includes(g.toLowerCase())))
    .slice(0, 3)
    .map(w => ({ english: w, turkish: w, emoji: '' }));
}

/** Build segmenting words (same logic, different slice) */
function getSegmentingWords(sound: PhonicsSound, group: PhonicsGroup): string[] {
  // For digraphs like "c/k", split and check each part
  const graphemes = sound.grapheme.includes('/')
    ? sound.grapheme.split('/')
    : [sound.grapheme.toLowerCase()];

  const words = group.blendableWords.filter((w) => graphemes.some((g) => w.toLowerCase().includes(g.toLowerCase())));
  // Pick different words from blending if possible
  return words.slice(3, 6).length >= 3 ? words.slice(3, 6) : words.slice(0, 3);
}

/** Word letter colors for keyword cards — cycles through palette */
const LETTER_COLORS = ['#FF6B35', '#7C3AED', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899'];
function getWordColor(word: string): string {
  const idx = word.charCodeAt(0) % LETTER_COLORS.length;
  return LETTER_COLORS[idx];
}

/** Get keywords from the sound */
function getKeywords(sound: PhonicsSound): { word: string; color: string }[] {
  return sound.keywords.slice(0, 6).map((word) => ({
    word,
    color: getWordColor(word),
  }));
}

// ─── Component ─────────────────────────────────────────────────────────────

function PhonicsLesson() {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addXP } = useGamification();

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

  // Reset when sound changes
  useEffect(() => {
    setStepIndex(0);
    setClickedKeywords(new Set());
    setSegmentingIndex(0);
    setSegmentingRevealed(false);
    setBlendingDone(false);
    setXpEarned(0);
  }, [soundId]);

  const goNext = useCallback(() => {
    if (stepIndex < STEPS.length - 1) {
      SFX.click();
      setStepIndex((s) => s + 1);
    }
  }, [stepIndex]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1);
    }
  }, [stepIndex]);

  // ── Celebrate side-effects (moved out of renderCelebrate to obey Rules of Hooks) ──
  useEffect(() => {
    if (currentStep !== 'celebrate' || !soundId) return;

    const totalXP = xpEarned + 50; // base completion XP

    try {
      const existing = JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[];
      if (!existing.includes(soundId)) {
        existing.push(soundId);
        localStorage.setItem(LS_MASTERED_SOUNDS, JSON.stringify(existing));
      }
    } catch {
      // ignore
    }

    // Record mastery via learning path service (score 100 for completion)
    recordSoundMastery(soundId, 100, user?.uid);

    // Record activity in adaptive engine
    if (user?.uid) {
      setActiveUser(user.uid);
      recordActivity({
        soundId: soundId,
        activityType: 'phonics-lesson',
        correct: true,
        responseTimeMs: (stepIndex + 1) * 45000,
        totalQuestions: STEPS.length,
        correctAnswers: STEPS.length,
      });
    }

    SFX.celebration();

    // Update garden plant growth
    updatePlantGrowth(soundId, 100);
    // Award water drops for completing a lesson
    addWaterDrops(3);

    // Actually award XP via GamificationContext (BUG 2 fix)
    addXP(totalXP, 'phonics_lesson');

    // Log this phonics lesson for the activity logger
    logActivity({
      type: 'phonics',
      title: `Learned the "${data?.sound.grapheme || soundId}" sound`,
      duration: Math.round((stepIndex + 1) * 45), // ~45s per step estimate
      accuracy: 100,
      xpEarned: totalXP,
      soundId: soundId,
    }, user?.uid);

    // Sync progress to classroom (for teacher dashboard)
    syncStudentProgress(totalXP);

    // Sync phonics mastery per sound to classroom
    const membership = getStudentClassroom();
    if (membership && soundId) {
      updateClassroomProgress(membership.classroomId, membership.studentId, soundId, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: celebrate runs once when step becomes 'celebrate'; other deps (data, user, addXP, etc.) are stable refs
  }, [currentStep, soundId]);

  // ── Not found ──
  if (!data) {
    return (
      <div className="pl-container">
        <Card variant="elevated" padding="xl">
          <div className="pl-not-found">
            <Search size={48} color="var(--green-800, #1A6B5A)" />
            <h2 className="pl-not-found__title">Ses bulunamadı</h2>
            <p className="pl-not-found__subtitle">Bu ses dersini bulamadık.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Ana Sayfaya Dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { sound, group } = data;
  const keywords = getKeywords(sound);
  const blendingWords = getBlendingWords(sound, group);
  const segmentingWords = getSegmentingWords(sound, group);

  // ── Step renderers ──

  const renderHear = () => (
    <motion.div
      key="hear"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pl-stepContent"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="pl-bigLetter"
      >
        {sound.grapheme}
      </motion.div>

      <p className="pl-stepDesc">Dinle! Bu harf şunu söyler...</p>

      <Button
        variant="primary"
        size="xl"
        icon={<Volume2 size={24} />}
        onClick={() => {
          speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5);
          setTimeout(() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5), 1000);
          setTimeout(() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5), 2000);
        }}
        style={{ backgroundColor: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}
      >
        3 kez dinle
      </Button>

      <div className="pl-mimiBox">
        <LottieCharacter state="happy" size={40} />
        <p className="pl-mimiText">
          {sound.story}
        </p>
      </div>

      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
        Devam Et
      </Button>
    </motion.div>
  );

  const renderDo = () => (
    <motion.div
      key="do"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pl-stepContent"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{
          width: 96, height: 96, borderRadius: '50%',
          background: `linear-gradient(135deg, ${getWordColor(sound.grapheme)} 0%, ${getWordColor(sound.sound)} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto', boxShadow: `0 8px 24px ${getWordColor(sound.grapheme)}44`,
        }}
      >
        <span className="pl-letter-text">
          {sound.grapheme.toUpperCase()}
        </span>
      </motion.div>

      <div className="pl-actionBox">
        <p className="pl-actionText">{sound.action}</p>
      </div>

      <div className="pl-btn-row">
        <Button
          variant="primary"
          size="lg"
          icon={<Volume2 size={20} />}
          onClick={() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.6)}
          style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
        >
          Beraber söyle!
        </Button>

        <Button
          variant="primary"
          size="lg"
          icon={<Mic size={20} />}
          onClick={() => {
            const SpeechRecognitionAPI =
              (window as unknown as Record<string, unknown>).SpeechRecognition ||
              (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
            if (SpeechRecognitionAPI) {
              const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognition)();
              recognition.lang = 'en-US';
              recognition.interimResults = false;
              setIsListening(true);
              recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                void transcript; // acknowledged
                setIsListening(false);
                // Any result = good effort for kids
                SFX.correct();
              };
              recognition.onerror = () => setIsListening(false);
              recognition.onend = () => setIsListening(false);
              recognition.start();
            }
          }}
          disabled={isListening}
          style={{ backgroundColor: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}
        >
          {isListening ? 'Dinleniyor...' : 'Kaydet!'}
        </Button>
      </div>

      <p className="pl-turkishNote">{sound.turkishNote}</p>

      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
        Yaptım!
      </Button>
    </motion.div>
  );

  const renderSee = () => {
    const allClicked = keywords.every((kw) => clickedKeywords.has(kw.word));
    return (
      <motion.div
        key="see"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="pl-stepContent"
      >
        <p className="pl-stepDesc">Her kelimeye dokunarak dinle!</p>

        <div className="pl-keywordsGrid">
          {keywords.map((kw) => {
            const idx = kw.word.toLowerCase().indexOf(sound.grapheme.toLowerCase());
            const clicked = clickedKeywords.has(kw.word);
            return (
              <motion.button
                key={kw.word}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  speak(kw.word, 0.8);
                  setClickedKeywords((prev) => new Set(prev).add(kw.word));
                }}
                className="pl-keywordCard"
                style={{
                  borderColor: clicked ? '#1A6B5A' : '#E5E7EB',
                  backgroundColor: clicked ? 'rgba(34,197,94,0.1)' : '#F8F9FA',
                }}
              >
                <div className="pl-keyword-avatar" style={{ background: kw.color }}>
                  {kw.word.charAt(0).toUpperCase()}
                </div>
                <span className="pl-keyword-label">
                  {idx >= 0 ? (
                    <>
                      {kw.word.slice(0, idx)}
                      <span className="pl-keyword-highlight">
                        {kw.word.slice(idx, idx + sound.grapheme.length)}
                      </span>
                      {kw.word.slice(idx + sound.grapheme.length)}
                    </>
                  ) : (
                    kw.word
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        {allClicked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              Tüm kelimeler dinlendi!
            </Badge>
          </motion.div>
        )}

        <Button
          variant="secondary"
          size="lg"
          icon={<ArrowRight size={18} />}
          onClick={goNext}
          disabled={!allClicked}
        >
          Devam Et
        </Button>
      </motion.div>
    );
  };

  const renderBuild = () => (
    <motion.div
      key="build"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pl-stepContent"
    >
      {blendingDone ? (
        <div className="pl-blending-done">
          <Badge variant="success" icon={<Sparkles size={14} />}>
            Birleştirme tamamlandı!
          </Badge>
          <div className="pl-blending-actions">
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
              Devam Et
            </Button>
          </div>
        </div>
      ) : (
        <BlendingBoard
          words={blendingWords}
          onComplete={(score, _total) => {
            setXpEarned((prev) => prev + score * 15);
            setBlendingDone(true);
          }}
        />
      )}
    </motion.div>
  );

  const renderBreak = () => {
    const currentWord = segmentingWords[segmentingIndex] || segmentingWords[0];
    const currentSounds = currentWord ? splitToSounds(currentWord) : [];
    const allDone = segmentingIndex >= segmentingWords.length;

    if (allDone) {
      return (
        <motion.div
          key="break-done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pl-stepContent"
        >
          <div className="pl-not-found">
            <Target size={48} color="var(--green-800, #1A6B5A)" />
            <h3 className="pl-not-found__title">Harika bölme!</h3>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
              Devam Et
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={`break-${segmentingIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="pl-stepContent"
      >
        <p className="pl-stepDesc">Bu kelimeyi seslere böl!</p>

        <div className="pl-segmenting-counter">
          <Badge variant="info">{segmentingIndex + 1}/{segmentingWords.length}</Badge>
        </div>

        <motion.button
          onClick={() => speak(currentWord, 0.8)}
          className="pl-wordDisplay"
          whileTap={{ scale: 0.95 }}
        >
          <Volume2 size={18} className="pl-volume-icon" />
          {currentWord}
        </motion.button>

        {!segmentingRevealed ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setSegmentingRevealed(true);
              // Play each sound
              currentSounds.forEach((s, i) => {
                setTimeout(() => speak(s, 0.5), i * 600);
              });
            }}
            style={{ backgroundColor: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}
          >
            Sesleri göster!
          </Button>
        ) : (
          <>
            <div className="pl-tilesRow">
              {currentSounds.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => speak(s, 0.5)}
                  className="pl-revealedTile"
                >
                  {s}
                </motion.div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => {
                setSegmentingRevealed(false);
                setSegmentingIndex((i) => i + 1);
                setXpEarned((prev) => prev + 10);
              }}
            >
              {segmentingIndex + 1 < segmentingWords.length ? 'Sonraki kelime' : 'Tamam!'}
            </Button>
          </>
        )}
      </motion.div>
    );
  };

  const renderWrite = () => {
    const grapheme = sound.grapheme.toLowerCase();
    const firstLetter = grapheme.charAt(0);

    return (
      <motion.div
        key="write"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="pl-stepContent"
      >
        <div className="pl-reading-header">
          <PenTool size={20} color="var(--green-800, #1A6B5A)" />
          <p className="pl-stepDesc pl-stepDesc--no-margin">Harfi parmağınla takip et!</p>
        </div>

        <LetterTracing
          letter={firstLetter}
          onComplete={(accuracy) => {
            setXpEarned((prev) => prev + Math.round(accuracy * 0.2));
            if (accuracy >= 40) {
              setTimeout(goNext, 1200);
            }
          }}
          difficulty="guided"
        />
      </motion.div>
    );
  };

  const renderRead = () => {
    const decodableText = group.decodableText;
    const words = decodableText.split(/\s+/);

    return (
      <motion.div
        key="read"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="pl-stepContent"
      >
        <div className="pl-reading-header">
          <BookOpen size={20} color="var(--green-800, #1A6B5A)" />
          <p className="pl-stepDesc pl-stepDesc--no-margin">Herhangi bir kelimeye dokunarak dinle!</p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="pl-words-flex">
            {words.map((word, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const clean = word.replace(/[^a-zA-Z']/g, '');
                  if (clean) speak(clean, 0.75);
                }}
                className="pl-readableWord"
              >
                {word}
              </motion.button>
            ))}
          </div>
        </Card>

        <Button
          variant="primary"
          size="lg"
          icon={<Volume2 size={18} />}
          onClick={() => speak(decodableText, 0.8)}
          style={{ backgroundColor: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}
        >
          Yüksek sesle oku!
        </Button>

        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
          Devam Et
        </Button>
      </motion.div>
    );
  };

  const renderSing = () => {
    const groupSong = getSongByGroup(sound.group);

    if (!groupSong) {
      // No song for this group — skip to next step
      return (
        <motion.div
          key="sing-skip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="pl-stepContent"
        >
          <p className="pl-stepDesc">Bu grup için henüz şarkı yok.</p>
          <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
            Devam Et
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="sing"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="pl-stepContent"
      >
        <SongPlayer
          song={groupSong}
          mode="singalong"
          onComplete={() => {
            setXpEarned((prev) => prev + 25);
            goNext();
          }}
        />
      </motion.div>
    );
  };

  const renderCelebrate = () => {
    const totalXP = xpEarned + 50; // base completion XP

    // Get garden plant info for this sound
    const gardenPlant = getPlantForSound(soundId!);
    const plantStage = gardenPlant ? getPlantStage(gardenPlant, 100) : null;

    // Find next sound and check if group is complete
    const currentGroup = PHONICS_GROUPS.find((g) => g.sounds.some((s) => s.id === soundId));
    let nextSoundInGroup: PhonicsSound | null = null;
    let isGroupComplete = false;

    if (currentGroup) {
      const idx = currentGroup.sounds.findIndex((s) => s.id === soundId);
      if (idx + 1 < currentGroup.sounds.length) {
        nextSoundInGroup = currentGroup.sounds[idx + 1];
      } else {
        // Last sound in group — check if it's the last group too
        const groupIdx = PHONICS_GROUPS.indexOf(currentGroup);
        if (groupIdx + 1 < PHONICS_GROUPS.length) {
          isGroupComplete = true;
          // Next group's first sound
          nextSoundInGroup = PHONICS_GROUPS[groupIdx + 1].sounds[0] || null;
        } else {
          isGroupComplete = true;
          // All groups done
          nextSoundInGroup = null;
        }
      }
    }

    const handleNextSound = () => {
      const next = advanceToNextSound();
      if (next) {
        navigate(`/phonics/${next.id}`);
      } else {
        navigate('/dashboard');
      }
    };

    return (
      <motion.div
        key="celebrate"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="pl-stepContent"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-500) 0%, #FF6B35 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 8px 24px color-mix(in srgb, var(--gold-500) 40%, transparent)',
          }}
        >
          <Trophy size={48} color="#fff" />
        </motion.div>

        <h2 className="pl-completion-title">
          {isGroupComplete ? 'Grup Tamamlandı!' : 'Harika iş!'}
        </h2>
        <p className="pl-completion-subtitle">
          {isGroupComplete
            ? `${currentGroup?.name || 'Bu gruptaki'} tüm sesleri öğrendin!`
            : <>&quot;{sound.grapheme}&quot; sesini öğrendin!</>}
        </p>

        <Card variant="elevated" padding="lg">
          <div className="pl-completion-card">
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{totalXP} XP kazandın!
            </Badge>
            {gardenPlant && plantStage && (
              <p className="pl-plant-grew">
                Bitkini büyüdü! Artık {plantStage.name === 'flowering' ? 'tam çiçek açtı' : `${plantStage.name} aşamasında`}!
              </p>
            )}
            <p className="pl-mastery-note">
              &quot;{sound.grapheme}&quot; sesi ustalık tablona eklendi
            </p>
          </div>
        </Card>

        <div className="pl-next-actions">
          {nextSoundInGroup ? (
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={handleNextSound}
              style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
              fullWidth
            >
              Sonraki Ses: {nextSoundInGroup.grapheme.toUpperCase()}
            </Button>
          ) : (
            isGroupComplete && (
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkles size={18} />}
                onClick={() => navigate('/dashboard')}
                style={{ backgroundColor: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}
                fullWidth
              >
                Tüm Sesler Tamamlandı!
              </Button>
            )
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            fullWidth
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </motion.div>
    );
  };

  // ─── Main render ─────────────────────────────────────────────────────

  return (
    <div className="pl-container">
      {/* Header */}
      <div className="pl-header">
        <button type="button" onClick={goBack} disabled={stepIndex === 0} className="pl-backBtn">
          <ArrowLeft size={20} />
        </button>
        <div className="pl-progress-row">
          <ProgressBar value={progress} variant="success" size="sm" animated />
        </div>
        <Badge variant="info">{STEP_LABELS[currentStep]}</Badge>
      </div>

      {/* Step indicators */}
      <div className="pl-stepsRow">
        {STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i < stepIndex ? '#10b981' : i === stepIndex ? '#1A6B5A' : '#334155',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

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

      {/* Shortcut to Turkish pronunciation trap trainer */}
      <div style={{
        textAlign: 'center',
        padding: '0.5rem 0 0.25rem',
      }}>
        <Link
          to="/phonetics/traps"
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '99px',
            border: '1.5px solid var(--primary)',
            background: 'transparent',
          }}
        >
          Türkçe Zorluklarım
        </Link>
      </div>

      <MimiGuide
        message="Listen carefully, then try saying the sound!"
        messageTr="Dikkatlice dinle, sonra sesi söylemeyi dene!"
        showOnce="mimi_guide_phonics"
        position="bottom-left"
      />
    </div>
  );
}


export default PhonicsLesson;
