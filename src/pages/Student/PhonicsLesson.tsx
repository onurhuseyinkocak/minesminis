import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, ArrowLeft, Sparkles, Mic, BookOpen, PenTool } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../../components/ui';
import { BlendingBoard } from '../../components/phonics/BlendingBoard';
import { LetterTracing } from '../../components/phonics/LetterTracing';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import { getSongByGroup } from '../../data/phonicsSongs';
import { ALL_SOUNDS, PHONICS_GROUPS } from '../../data/phonics';
import type { PhonicsSound, PhonicsGroup } from '../../data/phonics';
import MimiGuide from '../../components/MimiGuide';
import { SFX } from '../../data/soundLibrary';
import { advanceToNextSound, recordSoundMastery } from '../../services/learningPathService';
import { logActivity } from '../../services/activityLogger';
import { getPlantForSound, getPlantStage } from '../../data/gardenData';
import { LS_MASTERED_SOUNDS } from '../../config/storageKeys';
import { updatePlantGrowth, addWaterDrops } from '../../services/gardenService';
import { syncStudentProgress } from '../../services/classroomService';

// ─── Types ─────────────────────────────────────────────────────────────────

type LessonStep = 'hear' | 'do' | 'see' | 'build' | 'break' | 'write' | 'read' | 'sing' | 'celebrate';

const STEPS: LessonStep[] = ['hear', 'do', 'see', 'build', 'break', 'write', 'read', 'sing', 'celebrate'];

const STEP_LABELS: Record<LessonStep, string> = {
  hear: 'Hear It',
  do: 'Do It',
  see: 'See It',
  build: 'Build It',
  break: 'Break It',
  write: 'Write It',
  read: 'Read It',
  sing: 'Sing It',
  celebrate: 'Celebrate!',
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
function getBlendingWords(sound: PhonicsSound, group: PhonicsGroup): string[] {
  const grapheme = sound.grapheme.toLowerCase();
  return group.blendableWords
    .filter((w) => w.toLowerCase().includes(grapheme))
    .slice(0, 3);
}

/** Build segmenting words (same logic, different slice) */
function getSegmentingWords(sound: PhonicsSound, group: PhonicsGroup): string[] {
  const grapheme = sound.grapheme.toLowerCase();
  const words = group.blendableWords.filter((w) => w.toLowerCase().includes(grapheme));
  // Pick different words from blending if possible
  return words.slice(3, 6).length >= 3 ? words.slice(3, 6) : words.slice(0, 3);
}

/** Word-to-emoji mapping for keyword cards */
const WORD_EMOJI: Record<string, string> = {
  sun: '\u2600\uFE0F', sit: '\uD83E\uDE91', sat: '\uD83E\uDE91', sip: '\uD83E\uDD64', sad: '\uD83D\uDE22', six: '6\uFE0F\u20E3', set: '\uD83C\uDFAF', see: '\uD83D\uDC40',
  ant: '\uD83D\uDC1C', at: '\uD83D\uDCCD', and: '\u2795', apple: '\uD83C\uDF4E', add: '\u2795',
  tap: '\uD83D\uDC46', tin: '\uD83E\uDD6B', ten: '\uD83D\uDD1F', top: '\uD83D\uDD1D', tip: '\uD83D\uDCA1',
  in: '\uD83D\uDCE5', it: '\uD83D\uDC49', is: '\u2705', ink: '\uD83D\uDD8A\uFE0F',
  pan: '\uD83C\uDF73', pin: '\uD83D\uDCCC', pat: '\u270B', pen: '\uD83D\uDD8A\uFE0F', pig: '\uD83D\uDC37', pot: '\uD83C\uDF6F',
  nap: '\uD83D\uDE34', net: '\uD83E\uDD45', nit: '\uD83D\uDD0D', nut: '\uD83E\uDD5C', nod: '\uD83D\uDC4D',
  cat: '\uD83D\uDC31', cup: '\u2615', cap: '\uD83E\uDDE2', car: '\uD83D\uDE97', can: '\uD83E\uDD6B',
  hat: '\uD83C\uDFA9', hen: '\uD83D\uDC14', hit: '\uD83D\uDCA5', hot: '\uD83D\uDD25', hut: '\uD83D\uDED6',
  red: '\uD83D\uDD34', run: '\uD83C\uDFC3', rat: '\uD83D\uDC00', rug: '\uD83D\uDFEB', rip: '\uD83D\uDC94',
  man: '\uD83D\uDC68', map: '\uD83D\uDDFA\uFE0F', mat: '\uD83E\uDDF9', mud: '\uD83D\uDCA9', mix: '\uD83D\uDD04',
  dog: '\uD83D\uDC15', dad: '\uD83D\uDC68', dig: '\u26CF\uFE0F', dot: '\u26AB', dip: '\uD83E\uDED5',
  got: '\u2705', gun: '\uD83D\uDD2B', gum: '\uD83E\uDEE7', gap: '\uD83D\uDD73\uFE0F', gas: '\u26FD',
  on: '\uD83D\uDD1B', off: '\uD83D\uDCF4', odd: '\uD83E\uDD14', ox: '\uD83D\uDC02',
  up: '\u2B06\uFE0F', us: '\uD83D\uDC65', bus: '\uD83D\uDE8C', bug: '\uD83D\uDC1B', bun: '\uD83C\uDF5E', but: '\u27A1\uFE0F',
  log: '\uD83E\uDEB5', lip: '\uD83D\uDC44', leg: '\uD83E\uDDB5', lot: '\uD83D\uDCE6', lid: '\uD83E\uDED9',
  fun: '\uD83C\uDF89', fog: '\uD83C\uDF2B\uFE0F', fig: '\uD83E\uDED8', fit: '\uD83D\uDCAA', fan: '\uD83C\uDF00',
  big: '\uD83C\uDFD4\uFE0F', bed: '\uD83D\uDECF\uFE0F', bat: '\uD83E\uDD87', box: '\uD83D\uDCE6', bit: '\uD83D\uDD39',
};

/** Get keywords with emojis from the sound */
function getKeywords(sound: PhonicsSound): { word: string; emoji: string }[] {
  return sound.keywords.slice(0, 6).map((word) => ({
    word,
    emoji: WORD_EMOJI[word.toLowerCase()] || sound.mnemonicEmoji,
  }));
}

// ─── Component ─────────────────────────────────────────────────────────────

function PhonicsLesson() {
  const { soundId } = useParams<{ soundId: string }>();
  const navigate = useNavigate();

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

  // ── Not found ──
  if (!data) {
    return (
      <div style={styles.container}>
        <Card variant="elevated" padding="xl">
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h2 style={{ color: '#1A6B5A' }}>Sound not found</h2>
            <p style={{ color: '#666' }}>We couldn&apos;t find this sound lesson.</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
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
      style={styles.stepContent}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={styles.bigLetter}
      >
        {sound.grapheme}
      </motion.div>

      <p style={styles.stepDesc}>Listen! This letter says...</p>

      <Button
        variant="primary"
        size="xl"
        icon={<Volume2 size={24} />}
        onClick={() => {
          speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5);
          setTimeout(() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5), 1000);
          setTimeout(() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.5), 2000);
        }}
        style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
      >
        Listen 3 times
      </Button>

      <div style={styles.mimiBox}>
        <span style={{ fontSize: '2rem' }}>🐉</span>
        <p style={styles.mimiText}>
          {sound.story}
        </p>
      </div>

      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
        Continue
      </Button>
    </motion.div>
  );

  const renderDo = () => (
    <motion.div
      key="do"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={styles.stepContent}
    >
      <motion.span
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ fontSize: '4rem', display: 'block', textAlign: 'center' }}
      >
        {sound.mnemonicEmoji}
      </motion.span>

      <div style={styles.actionBox}>
        <p style={styles.actionText}>{sound.action}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          size="lg"
          icon={<Volume2 size={20} />}
          onClick={() => speak(sound.grapheme.length === 1 ? sound.grapheme : sound.sound, 0.6)}
          style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
        >
          Say it with me!
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
              recognition.onresult = () => setIsListening(false);
              recognition.onerror = () => setIsListening(false);
              recognition.onend = () => setIsListening(false);
              recognition.start();
            }
          }}
          disabled={isListening}
          style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
        >
          {isListening ? 'Listening...' : 'Record me!'}
        </Button>
      </div>

      <p style={styles.turkishNote}>{sound.turkishNote}</p>

      <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
        I did it!
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
        style={styles.stepContent}
      >
        <p style={styles.stepDesc}>Tap each word to hear it!</p>

        <div style={styles.keywordsGrid}>
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
                style={{
                  ...styles.keywordCard,
                  borderColor: clicked ? '#1A6B5A' : '#e0e0e0',
                  backgroundColor: clicked ? '#f0fdf4' : '#fff',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{kw.emoji}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {idx >= 0 ? (
                    <>
                      {kw.word.slice(0, idx)}
                      <span style={{ color: '#E8A317', fontWeight: 800 }}>
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
              All words heard!
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
          Continue
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
      style={styles.stepContent}
    >
      {blendingDone ? (
        <div style={{ textAlign: 'center' }}>
          <Badge variant="success" icon={<Sparkles size={14} />}>
            Blending complete!
          </Badge>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
              Continue
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
          style={styles.stepContent}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🎯</span>
            <h3 style={{ color: '#1A6B5A' }}>Great segmenting!</h3>
            <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
              Continue
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
        style={styles.stepContent}
      >
        <p style={styles.stepDesc}>Break this word into sounds!</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Badge variant="info">{segmentingIndex + 1}/{segmentingWords.length}</Badge>
        </div>

        <motion.button
          onClick={() => speak(currentWord, 0.8)}
          style={styles.wordDisplay}
          whileTap={{ scale: 0.95 }}
        >
          <Volume2 size={18} style={{ marginRight: '0.5rem' }} />
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
            style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
          >
            Show sounds!
          </Button>
        ) : (
          <>
            <div style={styles.tilesRow}>
              {currentSounds.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  onClick={() => speak(s, 0.5)}
                  style={styles.revealedTile}
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
              {segmentingIndex + 1 < segmentingWords.length ? 'Next word' : 'Done!'}
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
        style={styles.stepContent}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <PenTool size={20} color="#1A6B5A" />
          <p style={{ ...styles.stepDesc, margin: 0 }}>Trace the letter with your finger!</p>
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
        style={styles.stepContent}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <BookOpen size={20} color="#1A6B5A" />
          <p style={{ ...styles.stepDesc, margin: 0 }}>Tap any word to hear it!</p>
        </div>

        <Card variant="elevated" padding="lg">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', lineHeight: 2.2 }}>
            {words.map((word, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const clean = word.replace(/[^a-zA-Z']/g, '');
                  if (clean) speak(clean, 0.75);
                }}
                style={styles.readableWord}
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
          style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
        >
          Read it aloud!
        </Button>

        <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
          Continue
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
          style={styles.stepContent}
        >
          <p style={styles.stepDesc}>No song available yet for this group.</p>
          <Button variant="secondary" size="lg" icon={<ArrowRight size={18} />} onClick={goNext}>
            Continue
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
        style={styles.stepContent}
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

    // Save mastery to localStorage (both legacy key and new learning path)
    useEffect(() => {
      try {
        const existing = JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[];
        if (!existing.includes(soundId!)) {
          existing.push(soundId!);
          localStorage.setItem(LS_MASTERED_SOUNDS, JSON.stringify(existing));
        }
      } catch {
        // ignore
      }
      // Record mastery via learning path service (score 100 for completion)
      recordSoundMastery(soundId!, 100);
      SFX.celebration();

      // Update garden plant growth
      updatePlantGrowth(soundId!, 100);
      // Award water drops for completing a lesson
      addWaterDrops(3);

      // Log this phonics lesson for the activity logger
      logActivity({
        type: 'phonics',
        title: `Learned the "${sound.grapheme}" sound`,
        duration: Math.round((stepIndex + 1) * 45), // ~45s per step estimate
        accuracy: 100,
        xpEarned: totalXP,
        soundId: soundId!,
      });

      // Sync progress to classroom (for teacher dashboard)
      syncStudentProgress(totalXP);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        style={styles.stepContent}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ fontSize: '5rem', display: 'block', textAlign: 'center' }}
        >
          {isGroupComplete ? '\uD83C\uDF89' : '\uD83C\uDF89'}
        </motion.span>

        <h2 style={{ textAlign: 'center', color: '#1A6B5A', margin: 0 }}>
          {isGroupComplete ? 'Group Complete!' : 'Amazing work!'}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>
          {isGroupComplete
            ? `You mastered all sounds in ${currentGroup?.name || 'this group'}!`
            : <>You learned the &quot;{sound.grapheme}&quot; sound!</>}
        </p>

        <Card variant="elevated" padding="lg">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{totalXP} XP earned!
            </Badge>
            {gardenPlant && plantStage && (
              <p style={{ fontSize: '0.95rem', color: '#1A6B5A', margin: 0, fontWeight: 700 }}>
                Your {gardenPlant.emoji} grew! It&apos;s now {plantStage.name === 'flowering' ? 'fully bloomed' : `a ${plantStage.name}`}!
              </p>
            )}
            <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
              Sound &quot;{sound.grapheme}&quot; added to your mastery chart
            </p>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          {nextSoundInGroup ? (
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={handleNextSound}
              style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
              fullWidth
            >
              Next Sound: {nextSoundInGroup.grapheme.toUpperCase()} {nextSoundInGroup.mnemonicEmoji}
            </Button>
          ) : (
            isGroupComplete && (
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkles size={18} />}
                onClick={() => navigate('/dashboard')}
                style={{ backgroundColor: '#E8A317', borderColor: '#E8A317' }}
                fullWidth
              >
                All Sounds Complete!
              </Button>
            )
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            fullWidth
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    );
  };

  // ─── Main render ─────────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={goBack} disabled={stepIndex === 0} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar value={progress} variant="success" size="sm" animated />
        </div>
        <Badge variant="info">{STEP_LABELS[currentStep]}</Badge>
      </div>

      {/* Step indicators */}
      <div style={styles.stepsRow}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i < stepIndex ? '#10b981' : i === stepIndex ? '#1A6B5A' : '#e0e0e0',
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

      <MimiGuide
        message="Listen carefully, then try saying the sound!"
        messageTr="Dikkatlice dinle, sonra sesi soylemeyi dene!"
        showOnce="mimi_guide_phonics"
        position="bottom-left"
      />
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem 1.5rem 2rem',
    minHeight: '100vh',
    fontFamily: 'Nunito, sans-serif',
    maxWidth: '540px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1A6B5A',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
  },
  stepsRow: {
    display: 'flex',
    gap: '0.4rem',
    justifyContent: 'center',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    alignItems: 'center',
    padding: '1rem 0',
  },
  bigLetter: {
    fontSize: '6rem',
    fontWeight: 800,
    color: '#1A6B5A',
    lineHeight: 1,
    textAlign: 'center' as const,
  },
  stepDesc: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#555',
    textAlign: 'center' as const,
    margin: 0,
  },
  mimiBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f0fdf4',
    borderRadius: '1rem',
    width: '100%',
  },
  mimiText: {
    fontSize: '0.95rem',
    color: '#333',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.5,
  },
  actionBox: {
    padding: '1.25rem',
    background: '#FFF8E1',
    borderRadius: '1rem',
    width: '100%',
    textAlign: 'center' as const,
  },
  actionText: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#333',
    margin: 0,
  },
  turkishNote: {
    fontSize: '0.85rem',
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    margin: 0,
  },
  keywordsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    width: '100%',
  },
  keywordCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.75rem 0.5rem',
    borderRadius: '0.75rem',
    border: '2px solid #e0e0e0',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.2s',
  },
  wordDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 2rem',
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    background: '#f0fdf4',
    borderRadius: '1rem',
    border: '3px solid #1A6B5A',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
  },
  tilesRow: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  revealedTile: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '0.75rem',
    border: '3px solid #E8A317',
    backgroundColor: '#FFF8E1',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#E8A317',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  readableWord: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Nunito, sans-serif',
    padding: '0.15rem 0.3rem',
    borderRadius: '0.25rem',
    transition: 'background 0.15s',
  },
};

export default PhonicsLesson;
