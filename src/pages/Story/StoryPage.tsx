/**
 * STORY PAGE - Mimi's Infinite Adventure
 * Main orchestrator: connects engine, scene, narrator, choices, audio
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Star, Package, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { WORLDS, TRAIT_NAMES } from '../../data/storyWorlds';
import type { TraitId } from '../../data/storyWorlds';
import type { StoryNode, StoryChoice } from '../../data/storyTemplates';
import { ALL_NODES } from '../../data/storyTemplates';
import {
  createDefaultState,
  substituteText,
  resolveChoice,
  getStoryProgress,
  getDominantTrait,
} from '../../data/storyEngine';
import type { StoryState, ChoiceResult } from '../../data/storyEngine';
import { initOrLoadStory, saveStoryState, resetStoryProgress } from '../../services/storyService';
import { playMusic, stopMusic, playSFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { updateWordProgress } from '../../data/spacedRepetition';
import toast from 'react-hot-toast';
import type { MusicKey, SFXKey } from '../../data/soundLibrary';
import StoryScene from '../../components/Story/StoryScene';
import StoryNarrator from '../../components/Story/StoryNarrator';
import StoryChoices from '../../components/Story/StoryChoices';
import './StoryPage.css';

const StoryPage = React.memo(() => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { addXP } = useGamification();

  const [storyState, setStoryState] = useState<StoryState | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mm_story_sound');
    return saved === null ? true : saved === 'true';
  });
  const [showStats, setShowStats] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [choiceResult, setChoiceResult] = useState<ChoiceResult | null>(null);
  const [vocabDismissed, setVocabDismissed] = useState(false);
  const [vocabUpdating, setVocabUpdating] = useState(false);

  const musicStopRef = useRef<(() => void) | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ─── Init story ───
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const init = async () => {
      const displayName = userProfile?.display_name || 'Mimi';
      const mascotId = (userProfile?.settings as Record<string, string>)?.mascotId || 'mimi_dragon';
      const state = await initOrLoadStory(user.uid, displayName, mascotId);

      // Find current node
      const node = ALL_NODES.find(n => n.id === state.currentNodeId);
      if (!node) {
        // Fallback to start of current world
        const startNodes = ALL_NODES.filter(n => n.world === state.currentWorld && n.tags.includes('start'));
        const fallback = startNodes[0] || ALL_NODES[0];
        state.currentNodeId = fallback.id;
        setCurrentNode(fallback);
      } else {
        setCurrentNode(node);
      }

      setStoryState(state);
      setLoading(false);
    };

    init();

    return () => {
      stopMusic();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [user, userProfile, navigate]);

  // ─── Play music when node changes ───
  useEffect(() => {
    if (!currentNode || !soundEnabled) return;

    // Play background music
    if (musicStopRef.current) musicStopRef.current();
    try {
      const stop = playMusic(currentNode.music as MusicKey);
      musicStopRef.current = stop;
    } catch {
      // Music key might not exist
    }

    // Play SFX
    if (currentNode.sfx) {
      currentNode.sfx.forEach((sfx, i) => {
        setTimeout(() => {
          try {
            playSFX(sfx as SFXKey);
          } catch {
            // SFX key might not exist
          }
        }, i * 500);
      });
    }
  }, [currentNode, soundEnabled]);

  // ─── Toggle sound ───
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('mm_story_sound', String(next));
      if (prev) {
        stopMusic();
        musicStopRef.current = null;
      }
      return next;
    });
  }, []);

  // ─── Narrator complete ───
  const handleNarratorComplete = useCallback(() => {
    setShowChoices(true);
  }, []);

  // ─── Make a choice ───
  const handleChoice = useCallback(async (choice: StoryChoice) => {
    if (!storyState || transitioning) return;

    setTransitioning(true);
    setShowChoices(false);

    const result = resolveChoice(storyState, choice);
    setChoiceResult(result);

    // Add XP to gamification system
    try {
      await addXP(result.xpGained, 'Story choice');
    } catch {
      // Gamification might not be ready
    }

    // Transition animation
    setTimeout(() => {
      setCurrentNode(result.nextNode);
      setStoryState(result.newState);
      setChoiceResult(null);
      setTransitioning(false);
      setShowChoices(false);
      setVocabDismissed(false);

      // Debounced save
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveStoryState(result.newState);
      }, 2000);
    }, 800);
  }, [storyState, transitioning, addXP]);

  // ─── Reset story ───
  const handleReset = useCallback(async () => {
    if (!user || !storyState) return;
    if (!window.confirm('Are you sure you want to restart your adventure? All progress will be lost.')) return;

    await resetStoryProgress(user.uid);
    const displayName = userProfile?.display_name || 'Mimi';
    const mascotId = (userProfile?.settings as Record<string, string>)?.mascotId || 'mimi_dragon';
    const newState = createDefaultState(user.uid, displayName, mascotId);
    const startNode = ALL_NODES.find(n => n.id === newState.currentNodeId) || ALL_NODES[0];

    setStoryState(newState);
    setCurrentNode(startNode);
    setShowChoices(false);
    setChoiceResult(null);
    await saveStoryState(newState);
  }, [user, storyState, userProfile]);

  // ─── Loading ───
  if (loading || !storyState || !currentNode) {
    return (
      <div className="story-page">
        <div className="story-page__loading">
          <div className="story-page__loading-spinner" />
          <p>Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  // ─── TTS helper ───
  const speakWord = (word: string) => {
    speak(word, 0.9).catch(() => {/* fallback handled inside speak() */});
  };

  const hasVocabulary = currentNode.vocabulary && currentNode.vocabulary.length > 0;
  const showVocabCard = hasVocabulary && showChoices && !vocabDismissed;
  const showChoiceButtons = showChoices && (!hasVocabulary || vocabDismissed);

  const world = WORLDS[storyState.currentWorld];
  const progress = getStoryProgress(storyState);
  const dominantTrait = getDominantTrait(storyState.traits);
  const dominantTraitInfo = TRAIT_NAMES[dominantTrait];

  // Find NPC info
  const npc = currentNode.npcId
    ? world.npcs.find(n => n.id === currentNode.npcId)
    : null;

  // Get items from inventory
  const inventoryItems = storyState.inventory.map(itemId => {
    for (const w of Object.values(WORLDS)) {
      const item = w.items.find(i => i.id === itemId);
      if (item) return item;
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="story-page">
      {/* Top bar */}
      <div className="story-page__topbar">
        <button type="button" className="story-page__back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>

        <div className="story-page__world-badge" style={{ background: world.color }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>{world.name.charAt(0).toUpperCase()}</div>
          <span>{world.name}</span>
        </div>

        <div className="story-page__topbar-actions">
          <button
            className="story-page__icon-btn"
            onClick={() => setShowStats(!showStats)}
            title="Stats"
            aria-label="View stats"
          >
            <Star size={18} />
          </button>
          <button
            className="story-page__icon-btn"
            onClick={() => setShowInventory(!showInventory)}
            title="Inventory"
            aria-label="View inventory"
          >
            <Package size={18} />
          </button>
          <button type="button" className="story-page__icon-btn" onClick={toggleSound} title="Sound" aria-label="Toggle sound">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button type="button" className="story-page__icon-btn" onClick={handleReset} title="Restart" aria-label="Restart story">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Stats panel */}
      {showStats && (
        <div className="story-page__panel story-page__stats-panel">
          <h3>Adventure Stats</h3>
          <div className="story-page__traits">
            {(Object.entries(storyState.traits) as [TraitId, number][]).map(([trait, val]) => {
              const info = TRAIT_NAMES[trait];
              return (
                <div key={trait} className="story-page__trait">
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: info.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{info.name.charAt(0).toUpperCase()}</div>
                  <span className="story-page__trait-name">{info.name}</span>
                  <div className="story-page__trait-bar">
                    <div
                      className="story-page__trait-fill"
                      style={{ width: `${Math.min(val * 2, 100)}%`, background: info.color }}
                    />
                  </div>
                  <span className="story-page__trait-val">{val}</span>
                </div>
              );
            })}
          </div>
          <div className="story-page__stats-row">
            <span>Scenes visited: {progress.nodesVisited}</span>
            <span>Worlds explored: {progress.worldsExplored.length}/5</span>
            <span>Items: {progress.itemsCollected}</span>
            <span>Total XP: {storyState.totalXP}</span>
          </div>
          <div className="story-page__stats-row">
            <span>Dominant trait: {dominantTraitInfo.name}</span>
            <span>Sessions: {storyState.sessionCount}</span>
          </div>
        </div>
      )}

      {/* Inventory panel */}
      {showInventory && (
        <div className="story-page__panel story-page__inventory-panel">
          <h3>Inventory</h3>
          {inventoryItems.length === 0 ? (
            <p className="story-page__empty">No items yet. Keep exploring!</p>
          ) : (
            <div className="story-page__items">
              {inventoryItems.map(item => item && (
                <div key={item.id} className={`story-page__item story-page__item--${item.rarity}`}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }} className="story-page__item-emoji">{item.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="story-page__item-name">{item.name}</div>
                    <div className="story-page__item-desc">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Choice result feedback */}
      {choiceResult && (
        <div className="story-page__feedback">
          <span className="story-page__feedback-xp">+{choiceResult.xpGained} XP</span>
          {Object.entries(choiceResult.traitChanges).map(([trait, val]) => {
            const info = TRAIT_NAMES[trait as TraitId];
            return val ? (
              <span key={trait} className="story-page__feedback-trait" style={{ color: info.color }}>
                +{val}
              </span>
            ) : null;
          })}
          {choiceResult.itemGained && (
            <span className="story-page__feedback-item">New item!</span>
          )}
          {choiceResult.worldChanged && (
            <span className="story-page__feedback-world">World changed!</span>
          )}
        </div>
      )}

      {/* Main scene */}
      <div className={`story-page__scene ${transitioning ? 'story-page__scene--transitioning' : ''}`}>
        <StoryScene background={currentNode.background}>
          <StoryNarrator
            text={substituteText(currentNode.text, storyState)}
            npcName={npc?.name}
            npcEmoji={npc?.emoji}
            location={currentNode.location}
            onComplete={handleNarratorComplete}
          />

          {showVocabCard && !transitioning && (
            <div className="story-page__vocab-card">
              <h4 className="story-page__vocab-title">New Words!</h4>
              <div className="story-page__vocab-list">
                {currentNode.vocabulary!.map((v) => (
                  <div key={v.word} className="story-page__vocab-item">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }} className="story-page__vocab-emoji">{v.word.charAt(0).toUpperCase()}</div>
                    <span className="story-page__vocab-word">{v.word}</span>
                    <span className="story-page__vocab-turkish">{v.turkish}</span>
                    <button
                      className="story-page__vocab-speak"
                      onClick={() => speakWord(v.word)}
                      title={`Listen: ${v.word}`}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="story-page__vocab-continue"
                disabled={vocabUpdating}
                onClick={() => {
                  if (vocabUpdating) return;
                  setVocabUpdating(true);
                  const words = currentNode.vocabulary!;
                  words.forEach((v) => updateWordProgress(v.word, true));
                  toast.success(`${words.length} new word${words.length > 1 ? 's' : ''} added to your review list!`);
                  setVocabDismissed(true);
                  setVocabUpdating(false);
                }}
              >
                {vocabUpdating ? 'Saving...' : 'Got it! Continue'}
              </button>
            </div>
          )}

          {showChoiceButtons && !transitioning && (
            <StoryChoices
              choices={currentNode.choices}
              onChoose={handleChoice}
            />
          )}
        </StoryScene>
      </div>
    </div>
  );
});

StoryPage.displayName = 'StoryPage';

export default StoryPage;
