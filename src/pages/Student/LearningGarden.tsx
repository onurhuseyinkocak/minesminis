/**
 * LEARNING GARDEN
 * A visual garden that grows as children master phonics sounds.
 * Each sound = a plant. Mastery = growth stages.
 */

import { useState, useEffect, useCallback } from 'react';
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
  if (stageName === 'seed') return <Sprout size={size} color="#9CA3AF" />;
  if (stageName === 'sprout') return <Sprout size={size} color={color} />;
  if (stageName === 'growing') return <Leaf size={size} color={color} />;
  if (stageName === 'blooming') return <Flower2 size={size} color={color} />;
  return <TreePine size={size} color={color} />;
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

  const stats = getGardenStats();

  // Garden level based on blooming plants
  const gardenLevel = stats.blooming >= 35
    ? 7
    : stats.blooming >= 25
      ? 6
      : stats.blooming >= 18
        ? 5
        : stats.blooming >= 12
          ? 4
          : stats.blooming >= 7
            ? 3
            : stats.blooming >= 3
              ? 2
              : 1;

  const gardenLevelNames = [
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
          setSelectedPlant({
            ...selectedPlant,
            waterCount: s?.waterCount ?? 0,
          });
        }
      }
    },
    [waterDrops, selectedPlant],
  );

  // Group plants by group number
  const groups: Record<number, GardenPlant[]> = {};
  for (const plant of GARDEN_PLANTS) {
    const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId);
    const groupNum = sound?.group ?? 1;
    if (!groups[groupNum]) groups[groupNum] = [];
    groups[groupNum].push(plant);
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={styles.title}>My Learning Garden</h1>
          <p style={styles.subtitle}>
            {gardenLevelNames[gardenLevel - 1]} (Level {gardenLevel})
          </p>
        </div>
        <div style={styles.waterBadge}>
          <Droplets size={18} color="#3B82F6" />
          <span style={styles.waterCount}>{waterDrops}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <Flower2 size={16} color="#EC4899" />
          <span style={styles.statValue}>{stats.blooming}</span>
          <span style={styles.statLabel}>Blooming</span>
        </div>
        <div style={styles.statItem}>
          <Sprout size={16} color="#22C55E" />
          <span style={styles.statValue}>{stats.growing}</span>
          <span style={styles.statLabel}>Growing</span>
        </div>
        <div style={styles.statItem}>
          <TreePine size={16} color="#A8A29E" />
          <span style={styles.statValue}>{42 - stats.total + stats.seeds}</span>
          <span style={styles.statLabel}>Seeds</span>
        </div>
      </div>

      {/* Garden Grid */}
      <div style={styles.gardenArea}>
        {[1, 2, 3, 4, 5, 6, 7].map((groupNum) => {
          const groupPlants = groups[groupNum] || [];
          const groupInfo = GARDEN_GROUP_LABELS[groupNum];

          return (
            <div key={groupNum} style={{ ...styles.groupRow, backgroundColor: groupInfo?.bgColor ?? '#F9FAFB' }}>
              <div style={styles.groupLabel}>
                <span style={styles.groupLabelText}>{groupInfo?.name ?? `Group ${groupNum}`}</span>
              </div>
              <div style={styles.plantsRow}>
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
                      key={plant.soundId}
                      onClick={() => handlePlantTap(plant)}
                      style={{
                        ...styles.plantCell,
                        borderColor: isBlooming ? plant.color : isStarted ? '#D1D5DB' : '#E5E7EB',
                        backgroundColor: isBlooming ? `${plant.color}15` : '#1C2236',
                      }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        didJustGrow
                          ? { scale: [1, 1.3, 1] }
                          : isBlooming
                            ? {}
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
                            style={styles.waterDrop}
                          >
                            <Droplets size={16} color="#3B82F6" />
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
                            background: '#3B4A68',
                            border: '2px dashed #556',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            color: '#778',
                            verticalAlign: 'middle',
                          }}>?</span>
                        )}
                      </motion.span>

                      {/* Blooming indicator */}
                      {isBlooming && (
                        <motion.span
                          style={styles.sparkle}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Flower2 size={10} color={plant.color} />
                        </motion.span>
                      )}

                      {/* Sound label */}
                      <span style={styles.soundLabel}>
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
            style={styles.overlay}
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={styles.plantModal}
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
                    background: '#3B4A68',
                    border: '3px dashed #556',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#778',
                    verticalAlign: 'middle',
                  }}>?</span>
                )}
              </motion.span>

              {/* Sound info */}
              <h3 style={styles.modalTitle}>
                Sound: &quot;{selectedPlant.grapheme}&quot;
              </h3>

              {/* Stage name */}
              <p style={styles.modalStage}>
                {selectedPlant.mastery > 0 ? selectedPlant.stage.description : 'Not started yet'}
              </p>

              {/* Mastery bar */}
              <div style={styles.masteryBarBg}>
                <motion.div
                  style={{
                    ...styles.masteryBarFill,
                    backgroundColor: selectedPlant.plant.color,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedPlant.mastery}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p style={styles.masteryText}>
                Mastery: {selectedPlant.mastery}%
              </p>

              {/* Growth stages timeline */}
              <div style={styles.stagesTimeline}>
                {selectedPlant.plant.stages.map((s, i) => {
                  const reached = selectedPlant.mastery >= s.masteryThreshold;
                  return (
                    <div key={i} style={styles.timelineItem}>
                      <span
                        style={{
                          ...styles.timelineEmoji,
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
                        style={{
                          ...styles.timelineLabel,
                          color: reached ? '#1A6B5A' : '#A8A29E',
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
                  style={{
                    ...styles.waterBtn,
                    opacity: waterDrops > 0 ? 1 : 0.5,
                    cursor: waterDrops > 0 ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => handleWater(selectedPlant.plant.soundId)}
                  disabled={waterDrops <= 0}
                >
                  <Droplets size={18} />
                  Water ({waterDrops} drops)
                </button>
              )}

              {/* Watered count */}
              {selectedPlant.waterCount > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#888', margin: 0, textAlign: 'center' }}>
                  Watered {selectedPlant.waterCount} time{selectedPlant.waterCount !== 1 ? 's' : ''}
                </p>
              )}

              {/* Close button */}
              <button style={styles.closeBtn} onClick={() => setSelectedPlant(null)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS animations injected inline */}
      <style>{`
        @keyframes gardenSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        @keyframes gardenSparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes waterFall {
          0% { opacity: 1; transform: translateY(-15px); }
          100% { opacity: 0; transform: translateY(15px); }
        }
      `}</style>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0.08) 50%, rgba(16,185,129,0.1) 100%)',
    fontFamily: 'Nunito, sans-serif',
    paddingBottom: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #D1FAE5',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
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
  title: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#16A34A',
    margin: 0,
    fontWeight: 600,
  },
  waterBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#EFF6FF',
    borderRadius: '1rem',
    padding: '0.4rem 0.75rem',
    border: '1px solid #BFDBFE',
  },
  waterCount: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#2563EB',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#333',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#888',
    fontWeight: 500,
  },
  gardenArea: {
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  groupRow: {
    borderRadius: '1rem',
    padding: '0.5rem',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  groupLabel: {
    padding: '0.2rem 0.5rem',
    marginBottom: '0.3rem',
  },
  groupLabelText: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  plantsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0.4rem',
  },
  plantCell: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.15rem',
    padding: '0.4rem 0.2rem',
    borderRadius: '0.75rem',
    border: '2px solid #E5E7EB',
    background: '#1C2236',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    aspectRatio: '1',
    minHeight: '60px',
  },
  soundLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    color: '#999',
    textTransform: 'lowercase' as const,
  },
  sparkle: {
    position: 'absolute' as const,
    top: '2px',
    right: '2px',
    fontSize: '0.7rem',
  },
  waterDrop: {
    position: 'absolute' as const,
    top: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '1rem',
    pointerEvents: 'none' as const,
    zIndex: 2,
  },

  // Modal
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  plantModal: {
    background: '#1C2236',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    maxWidth: '360px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    textAlign: 'center' as const,
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  modalStage: {
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
    fontStyle: 'italic',
  },
  masteryBarBg: {
    width: '100%',
    height: '10px',
    background: '#E5E7EB',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.8s ease',
  },
  masteryText: {
    textAlign: 'center' as const,
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#555',
    margin: 0,
  },
  stagesTimeline: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  timelineEmoji: {
    fontSize: '1.3rem',
    transition: 'all 0.3s',
  },
  timelineLabel: {
    fontSize: '0.65rem',
  },
  waterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.75rem',
    border: '2px solid #3B82F6',
    background: '#EFF6FF',
    color: '#2563EB',
    fontWeight: 700,
    fontFamily: 'Nunito, sans-serif',
    fontSize: '0.9rem',
    cursor: 'pointer',
    margin: '0 auto',
  },
  closeBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    background: '#F3F4F6',
    color: '#555',
    fontWeight: 700,
    fontFamily: 'Nunito, sans-serif',
    fontSize: '0.9rem',
    cursor: 'pointer',
    margin: '0 auto',
  },
};

export default LearningGarden;
