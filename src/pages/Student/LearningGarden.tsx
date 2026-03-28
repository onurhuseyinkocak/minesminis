/**
 * LEARNING GARDEN
 * A visual garden that grows as children master phonics sounds.
 * Each sound = a plant. Mastery = growth stages.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sprout, Flower2, TreePine, ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GARDEN_PLANTS, GARDEN_GROUP_LABELS, getPlantStage } from '../../data/gardenData';
import type { GardenPlant, PlantStage } from '../../data/gardenData';
import { ALL_SOUNDS } from '../../data/phonics';
import {
  getGardenState,
  getGardenStats,
  getWaterDrops,
  waterPlant,
  initGardenFromMasteredSounds,
} from '../../services/gardenService';
import type { GardenPlantState } from '../../services/gardenService';
import './LearningGarden.css';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SelectedPlantInfo {
  plant: GardenPlant;
  stage: PlantStage;
  mastery: number;
  soundName: string;
  grapheme: string;
  waterCount: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function PlantStageIcon({ stageName, color, size = 20 }: { stageName: string; color: string; size?: number }) {
  if (stageName === 'seed') return <Sprout size={size} color="var(--color-gray-400, #9CA3AF)" />;
  if (stageName === 'sprout') return <Sprout size={size} color={color} />;
  if (stageName === 'growing') return <Leaf size={size} color={color} />;
  if (stageName === 'blooming') return <Flower2 size={size} color={color} />;
  return <TreePine size={size} color={color} />;
}

function getStage(mastery: number): string {
  if (mastery === 0) return 'seed';
  if (mastery < 25) return 'sprout';
  if (mastery < 50) return 'growing';
  if (mastery < 75) return 'blooming';
  return 'flowering';
}

// ─── Component ──────────────────────────────────────────────────────────────

function LearningGarden() {
  const navigate = useNavigate();
  const [gardenState, setGardenState] = useState<Record<string, GardenPlantState>>({});
  const [selectedPlant, setSelectedPlant] = useState<SelectedPlantInfo | null>(null);
  const [waterDrops, setWaterDrops] = useState(0);
  const [wateringPlant, setWateringPlant] = useState<string | null>(null);
  const [justGrew, setJustGrew] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    initGardenFromMasteredSounds();
    setGardenState(getGardenState());
    setWaterDrops(getWaterDrops());
  }, []);

  const stats = useMemo(() => getGardenStats(), [gardenState]);

  // Garden level based on blooming plants
  const gardenLevel = useMemo(() => {
    if (stats.blooming >= 35) return 7;
    if (stats.blooming >= 25) return 6;
    if (stats.blooming >= 18) return 5;
    if (stats.blooming >= 12) return 4;
    if (stats.blooming >= 7) return 3;
    if (stats.blooming >= 3) return 2;
    return 1;
  }, [stats.blooming]);

  const gardenLevelNames: readonly string[] = [
    'Bare Soil',
    'Seedling Patch',
    'Little Garden',
    'Growing Garden',
    'Blooming Garden',
    'Lush Paradise',
    'Enchanted Garden',
  ];

  const handlePlantTap = useCallback(
    (plant: GardenPlant) => {
      const state = gardenState[plant.soundId];
      const mastery = state?.mastery ?? 0;
      const stage = getPlantStage(plant, mastery);
      const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId);

      setSelectedPlant({
        plant,
        stage,
        mastery,
        soundName: sound?.sound ?? plant.soundId,
        grapheme: sound?.grapheme ?? '',
        waterCount: state?.waterCount ?? 0,
      });
    },
    [gardenState],
  );

  const handleWater = useCallback(
    (soundId: string) => {
      if (waterDrops <= 0) return;

      const prevState = getGardenState();
      const prevMastery = prevState[soundId]?.mastery ?? 0;
      const success = waterPlant(soundId);
      if (success) {
        const newState = getGardenState();
        const newMastery = newState[soundId]?.mastery ?? 0;

        setWateringPlant(soundId);
        setWaterDrops(getWaterDrops());
        setGardenState(newState);

        // Trigger growth animation if mastery stage changed
        const plant = GARDEN_PLANTS.find((p) => p.soundId === soundId);
        if (plant) {
          const prevStage = getPlantStage(plant, prevMastery);
          const newStageVal = getPlantStage(plant, newMastery);
          if (prevStage.name !== newStageVal.name) {
            setJustGrew(soundId);
            setTimeout(() => setJustGrew(null), 1500);
          }
        }

        setTimeout(() => setWateringPlant(null), 1200);

        // Refresh selected plant info
        if (plant && selectedPlant) {
          const s = newState[soundId];
          const updatedMastery = s?.mastery ?? selectedPlant.mastery;
          const updatedStage = getPlantStage(plant, updatedMastery);
          setSelectedPlant({
            ...selectedPlant,
            mastery: updatedMastery,
            stage: updatedStage,
            waterCount: s?.waterCount ?? 0,
          });
        }
      }
    },
    [waterDrops, selectedPlant],
  );

  // Group plants by group number
  const groups = useMemo(() => {
    const result: Record<number, GardenPlant[]> = {};
    for (const plant of GARDEN_PLANTS) {
      const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId);
      const groupNum = sound?.group ?? 1;
      if (!result[groupNum]) result[groupNum] = [];
      result[groupNum].push(plant);
    }
    return result;
  }, []);

  return (
    <div className="lg-container">
      {/* Header */}
      <div className="lg-header">
        <button type="button" onClick={() => navigate('/dashboard')} className="lg-backBtn">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="lg-title">My Learning Garden</h1>
          <p className="lg-subtitle">
            {gardenLevelNames[gardenLevel - 1]} (Level {gardenLevel})
          </p>
        </div>
        <div className="lg-waterBadge">
          <Droplets size={18} color="var(--color-blue-500, #3B82F6)" />
          <span className="lg-waterCount">{waterDrops}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="lg-statsBar">
        <div className="lg-statItem">
          <Flower2 size={16} color="var(--color-pink-500, #EC4899)" />
          <span className="lg-statValue">{stats.blooming}</span>
          <span className="lg-statLabel">Blooming</span>
        </div>
        <div className="lg-statItem">
          <Sprout size={16} color="var(--color-green-500, #22C55E)" />
          <span className="lg-statValue">{stats.growing}</span>
          <span className="lg-statLabel">Growing</span>
        </div>
        <div className="lg-statItem">
          <TreePine size={16} color="var(--color-stone-400, #A8A29E)" />
          <span className="lg-statValue">{42 - stats.total + stats.seeds}</span>
          <span className="lg-statLabel">Seeds</span>
        </div>
      </div>

      {/* Empty garden hint */}
      {stats.total === 0 && (
        <div className="lg-emptyHint">
          <Sprout size={32} color="var(--mimi, #4CAF50)" />
          <p className="lg-emptyHintText">
            Your garden is waiting! Complete phonics lessons to plant your first seed.
          </p>
          <button
            type="button"
            className="lg-waterBtn"
            style={{ backgroundColor: 'var(--mimi, #4CAF50)', borderColor: 'var(--mimi, #4CAF50)', color: '#fff' }}
            onClick={() => navigate('/dashboard')}
          >
            <Sprout size={18} />
            Start Learning
          </button>
        </div>
      )}

      {/* Garden Grid */}
      <div className="lg-gardenArea">
        {[1, 2, 3, 4, 5, 6, 7].map((groupNum) => {
          const groupPlants = groups[groupNum] || [];
          const groupInfo = GARDEN_GROUP_LABELS[groupNum];

          return (
            <div key={groupNum} className="lg-groupRow" style={{ backgroundColor: groupInfo?.bgColor ?? '#F9FAFB' }}>
              <div className="lg-groupLabel">
                <span className="lg-groupLabelText">{groupInfo?.name ?? `Group ${groupNum}`}</span>
              </div>
              <div className="lg-plantsRow">
                {groupPlants.map((plant) => {
                  const state = gardenState[plant.soundId];
                  const mastery = state?.mastery ?? 0;
                  const stage = getPlantStage(plant, mastery);
                  const isStarted = mastery > 0;
                  const isBlooming = mastery >= 95;
                  const isWatering = wateringPlant === plant.soundId;
                  const didJustGrow = justGrew === plant.soundId;
                  const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId);

                  return (
                    <motion.button
                      type="button"
                      key={plant.soundId}
                      onClick={() => handlePlantTap(plant)}
                      className="lg-plantCell"
                      aria-label={`${sound?.grapheme ?? plant.soundId} plant, ${getStage(mastery)} stage`}
                      data-stage={getStage(mastery)}
                      style={{
                        borderColor: isBlooming ? plant.color : isStarted ? '#D1D5DB' : 'var(--border-light, #E5E7EB)',
                        backgroundColor: isBlooming ? `${plant.color}15` : 'var(--bg-elevated, #F8F9FA)',
                      }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        didJustGrow
                          ? { scale: [1, 1.3, 1] }
                          : {}
                      }
                    >
                      {/* Watering animation */}
                      <AnimatePresence>
                        {isWatering && (
                          <motion.span
                            initial={{ opacity: 1, y: -20 }}
                            animate={{ opacity: 0, y: 10 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="lg-waterDrop"
                          >
                            <Droplets size={16} color="var(--color-blue-500, #3B82F6)" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Plant icon */}
                      <motion.span
                        style={{
                          fontSize: '1.6rem',
                          display: 'block',
                        }}
                        animate={
                          isBlooming
                            ? { rotate: [0, -3, 3, 0] }
                            : isStarted
                              ? { rotate: [0, -2, 2, 0] }
                              : {}
                        }
                        transition={
                          isBlooming
                            ? { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                            : isStarted
                              ? { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                              : {}
                        }
                      >
                        {isStarted ? (
                          <PlantStageIcon stageName={isBlooming ? 'flowering' : stage.name} color={plant.color} size={22} />
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            width: '1.4rem',
                            height: '1.4rem',
                            borderRadius: '50%',
                            background: 'var(--border-light, #E5E7EB)',
                            border: '2px dashed var(--border, #CBD5E1)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            color: 'var(--text-muted, #94A3B8)',
                            verticalAlign: 'middle',
                          }}>?</span>
                        )}
                      </motion.span>

                      {/* Blooming indicator */}
                      {isBlooming && (
                        <motion.span
                          className="lg-sparkle"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Flower2 size={10} color={plant.color} />
                        </motion.span>
                      )}

                      {/* Sound label */}
                      <span className="lg-soundLabel">
                        {sound?.grapheme ?? ''}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plant Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg-overlay"
            onClick={() => setSelectedPlant(null)}
            role="button"
            tabIndex={0}
            aria-label="Close plant details"
            onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') setSelectedPlant(null); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="lg-plantModal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Plant display */}
              <motion.span
                style={{ fontSize: '4rem', display: 'block', textAlign: 'center' }}
                animate={
                  selectedPlant.mastery >= 95
                    ? { rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }
                    : { rotate: [0, -3, 3, 0] }
                }
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                {selectedPlant.mastery > 0 ? (
                  <PlantStageIcon
                    stageName={selectedPlant.mastery >= 95 ? 'flowering' : selectedPlant.stage.name}
                    color={selectedPlant.plant.color}
                    size={56}
                  />
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: 'var(--border-light, #E5E7EB)',
                    border: '3px dashed var(--border, #CBD5E1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--text-muted, #94A3B8)',
                    verticalAlign: 'middle',
                  }}>?</span>
                )}
              </motion.span>

              {/* Sound info */}
              <h3 className="lg-modalTitle">
                Sound: &quot;{selectedPlant.grapheme}&quot;
              </h3>

              {/* Stage name */}
              <p className="lg-modalStage">
                {selectedPlant.mastery > 0 ? selectedPlant.stage.description : 'Not started yet'}
              </p>

              {/* Mastery bar */}
              <div className="lg-masteryBarBg">
                <motion.div
                  className="lg-masteryBarFill"
                  style={{
                    backgroundColor: selectedPlant.plant.color,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedPlant.mastery}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="lg-masteryText">
                Mastery: {selectedPlant.mastery}%
              </p>

              {/* Growth stages timeline */}
              <div className="lg-stagesTimeline">
                {selectedPlant.plant.stages.map((s, i) => {
                  const reached = selectedPlant.mastery >= s.masteryThreshold;
                  return (
                    <div key={i} className="lg-timelineItem">
                      <span
                        className="lg-timelineEmoji"
                        style={{
                          opacity: reached ? 1 : 0.3,
                        }}
                      >
                        <PlantStageIcon
                          stageName={i === selectedPlant.plant.stages.length - 1 ? 'flowering' : s.name}
                          color={selectedPlant.plant.color}
                          size={16}
                        />
                      </span>
                      <span
                        className="lg-timelineLabel"
                        style={{
                          color: reached ? 'var(--color-emerald-800, #065F46)' : 'var(--color-stone-400, #A8A29E)',
                          fontWeight: selectedPlant.stage.name === s.name ? 700 : 400,
                        }}
                      >
                        {s.masteryThreshold}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Water button */}
              {selectedPlant.mastery > 0 && selectedPlant.mastery < 95 && (
                <button
                  type="button"
                  className="lg-waterBtn"
                  style={{
                    opacity: waterDrops > 0 ? 1 : 0.5,
                    cursor: waterDrops > 0 ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => handleWater(selectedPlant.plant.soundId)}
                  disabled={waterDrops <= 0}
                  aria-label={`Water this plant (${waterDrops} drops remaining)`}
                >
                  <Droplets size={18} />
                  Water ({waterDrops} drops)
                </button>
              )}

              {/* Watered count */}
              {selectedPlant.waterCount > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #888)', margin: 0, textAlign: 'center' }}>
                  Watered {selectedPlant.waterCount} time{selectedPlant.waterCount !== 1 ? 's' : ''}
                </p>
              )}

              {/* Practice this sound button */}
              <button
                type="button"
                className="lg-waterBtn"
                style={{ backgroundColor: 'var(--mimi, #4CAF50)', borderColor: 'var(--mimi, #4CAF50)', color: '#fff' }}
                onClick={() => navigate(`/phonics/${selectedPlant.plant.soundId}`)}
              >
                <Sprout size={18} />
                {selectedPlant.mastery > 0 ? 'Practice Again' : 'Start Learning'}
              </button>

              {/* Close button */}
              <button type="button" className="lg-closeBtn" onClick={() => setSelectedPlant(null)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default LearningGarden;
