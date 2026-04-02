/**
 * LEARNING GARDEN — Visual garden that grows as children master phonics sounds.
 * Mobile-first, light mode only, all Tailwind inline.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sprout, Flower2, TreePine, ArrowLeft, Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GARDEN_PLANTS, GARDEN_GROUP_LABELS, getPlantStage } from '../../data/gardenData';
import type { GardenPlant, PlantStage } from '../../data/gardenData';
import { ALL_SOUNDS } from '../../data/phonics';
import { getGardenState, getGardenStats, getWaterDrops, waterPlant, initGardenFromMasteredSounds } from '../../services/gardenService';
import type { GardenPlantState } from '../../services/gardenService';

interface SelectedPlantInfo { plant: GardenPlant; stage: PlantStage; mastery: number; soundName: string; grapheme: string; waterCount: number; }

function PlantIcon({ stageName, color, size = 20 }: { stageName: string; color: string; size?: number }) {
  if (stageName === 'seed') return <Sprout size={size} color="#9CA3AF" />;
  if (stageName === 'sprout') return <Sprout size={size} color={color} />;
  if (stageName === 'growing') return <Leaf size={size} color={color} />;
  if (stageName === 'blooming') return <Flower2 size={size} color={color} />;
  return <TreePine size={size} color={color} />;
}

function LearningGarden() {
  const navigate = useNavigate();
  const [gardenState, setGardenState] = useState<Record<string, GardenPlantState>>({});
  const [selectedPlant, setSelectedPlant] = useState<SelectedPlantInfo | null>(null);
  const [waterDrops, setWaterDrops] = useState(0);
  const [wateringPlant, setWateringPlant] = useState<string | null>(null);
  const [justGrew, setJustGrew] = useState<string | null>(null);

  useEffect(() => { initGardenFromMasteredSounds(); setGardenState(getGardenState()); setWaterDrops(getWaterDrops()); }, []);

  const stats = useMemo(() => getGardenStats(), [gardenState]);
  const gardenLevel = useMemo(() => {
    if (stats.blooming >= 35) return 7; if (stats.blooming >= 25) return 6; if (stats.blooming >= 18) return 5;
    if (stats.blooming >= 12) return 4; if (stats.blooming >= 7) return 3; if (stats.blooming >= 3) return 2; return 1;
  }, [stats.blooming]);

  const levelNames = ['Bare Soil', 'Seedling Patch', 'Little Garden', 'Growing Garden', 'Blooming Garden', 'Lush Paradise', 'Enchanted Garden'];

  const handlePlantTap = useCallback((plant: GardenPlant) => {
    const state = gardenState[plant.soundId];
    const mastery = state?.mastery ?? 0;
    const stage = getPlantStage(plant, mastery);
    const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId);
    setSelectedPlant({ plant, stage, mastery, soundName: sound?.sound ?? plant.soundId, grapheme: sound?.grapheme ?? '', waterCount: state?.waterCount ?? 0 });
  }, [gardenState]);

  const handleWater = useCallback((soundId: string) => {
    if (waterDrops <= 0) return;
    const prevState = getGardenState();
    const prevMastery = prevState[soundId]?.mastery ?? 0;
    const success = waterPlant(soundId);
    if (success) {
      const newState = getGardenState();
      const newMastery = newState[soundId]?.mastery ?? 0;
      setWateringPlant(soundId); setWaterDrops(getWaterDrops()); setGardenState(newState);
      const plant = GARDEN_PLANTS.find((p) => p.soundId === soundId);
      if (plant) {
        const ps = getPlantStage(plant, prevMastery);
        const ns = getPlantStage(plant, newMastery);
        if (ps.name !== ns.name) { setJustGrew(soundId); setTimeout(() => setJustGrew(null), 1500); }
      }
      setTimeout(() => setWateringPlant(null), 1200);
      if (plant && selectedPlant) {
        const s = newState[soundId];
        setSelectedPlant({ ...selectedPlant, mastery: s?.mastery ?? selectedPlant.mastery, stage: getPlantStage(plant, s?.mastery ?? 0), waterCount: s?.waterCount ?? 0 });
      }
    }
  }, [waterDrops, selectedPlant]);

  const groups = useMemo(() => {
    const result: Record<number, GardenPlant[]> = {};
    for (const plant of GARDEN_PLANTS) { const sound = ALL_SOUNDS.find((s) => s.id === plant.soundId); const g = sound?.group ?? 1; if (!result[g]) result[g] = []; result[g].push(plant); }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button type="button" aria-label="Back to dashboard" onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-gray-900">My Learning Garden</h1>
            <p className="text-sm text-gray-500">{levelNames[gardenLevel - 1]} (Level {gardenLevel})</p>
          </div>
          <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-2xl px-3 py-1.5">
            <Droplets size={16} className="text-sky-500" />
            <span className="text-sm font-bold text-sky-700">{waterDrops}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 justify-center">
          <div className="flex items-center gap-1.5"><Flower2 size={16} className="text-pink-500" /><span className="text-sm font-bold text-gray-800">{stats.blooming}</span><span className="text-xs text-gray-500">Blooming</span></div>
          <div className="flex items-center gap-1.5"><Sprout size={16} className="text-emerald-500" /><span className="text-sm font-bold text-gray-800">{stats.growing}</span><span className="text-xs text-gray-500">Growing</span></div>
          <div className="flex items-center gap-1.5"><TreePine size={16} className="text-gray-400" /><span className="text-sm font-bold text-gray-800">{42 - stats.total + stats.seeds}</span><span className="text-xs text-gray-500">Seeds</span></div>
        </div>

        {/* Empty hint */}
        {stats.total === 0 && (
          <div className="text-center py-8">
            <Sprout size={40} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-4">Your garden is waiting! Complete phonics lessons to plant your first seed.</p>
            <button type="button" onClick={() => navigate('/dashboard')} className="min-h-[48px] px-6 rounded-3xl bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 mx-auto active:scale-95 transition-transform">
              <Sprout size={16} /> Start Learning
            </button>
          </div>
        )}

        {/* Garden Grid */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((groupNum) => {
            const groupPlants = groups[groupNum] || [];
            const groupInfo = GARDEN_GROUP_LABELS[groupNum];
            return (
              <div key={groupNum} className="rounded-3xl p-3 border border-gray-100" style={{ backgroundColor: groupInfo?.bgColor ?? '#F9FAFB' }}>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">{groupInfo?.name ?? `Group ${groupNum}`}</p>
                <div className="flex flex-wrap gap-2">
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
                        aria-label={`${sound?.grapheme ?? plant.soundId} plant`}
                        whileTap={{ scale: 0.9 }}
                        animate={didJustGrow ? { scale: [1, 1.3, 1] } : {}}
                        className="w-12 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 relative transition-all"
                        style={{
                          borderColor: isBlooming ? plant.color : isStarted ? '#D1D5DB' : '#E5E7EB',
                          backgroundColor: isBlooming ? `${plant.color}15` : '#F8F9FA',
                        }}
                      >
                        <AnimatePresence>
                          {isWatering && (
                            <motion.span initial={{ opacity: 1, y: -10 }} animate={{ opacity: 0, y: 5 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute -top-2">
                              <Droplets size={12} className="text-sky-500" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isStarted ? (
                          <PlantIcon stageName={isBlooming ? 'flowering' : stage.name} color={plant.color} size={18} />
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">?</span>
                        )}
                        <span className="text-[8px] font-bold text-gray-500">{sound?.grapheme ?? ''}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plant Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
            onClick={() => setSelectedPlant(null)}
            role="button" tabIndex={0} aria-label="Close"
            onKeyDown={(e) => { if (e.key === 'Escape') setSelectedPlant(null); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" aria-label="Close" onClick={() => setSelectedPlant(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={14} className="text-gray-500" />
              </button>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  {selectedPlant.mastery > 0 ? (
                    <PlantIcon stageName={selectedPlant.mastery >= 95 ? 'flowering' : selectedPlant.stage.name} color={selectedPlant.plant.color} size={48} />
                  ) : (
                    <span className="w-14 h-14 rounded-full border-3 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">?</span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-gray-900">Sound: &quot;{selectedPlant.grapheme}&quot;</h3>
                <p className="text-sm text-gray-500">{selectedPlant.mastery > 0 ? selectedPlant.stage.description : 'Not started yet'}</p>

                {/* Mastery bar */}
                <div className="w-full">
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: selectedPlant.plant.color }} initial={{ width: 0 }} animate={{ width: `${selectedPlant.mastery}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">Mastery: {selectedPlant.mastery}%</p>
                </div>

                {/* Water button */}
                {selectedPlant.mastery > 0 && selectedPlant.mastery < 95 && (
                  <button type="button" onClick={() => handleWater(selectedPlant.plant.soundId)} disabled={waterDrops <= 0}
                    className={`min-h-[48px] px-6 rounded-3xl font-bold text-sm flex items-center gap-2 transition-all ${waterDrops > 0 ? 'bg-sky-500 text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    <Droplets size={16} /> Water ({waterDrops} drops)
                  </button>
                )}

                {selectedPlant.waterCount > 0 && <p className="text-xs text-gray-400">Watered {selectedPlant.waterCount} time{selectedPlant.waterCount !== 1 ? 's' : ''}</p>}

                <button type="button" onClick={() => navigate(`/phonics/${selectedPlant.plant.soundId}`)}
                  className="min-h-[48px] w-full rounded-3xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Sprout size={16} /> {selectedPlant.mastery > 0 ? 'Practice Again' : 'Start Learning'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LearningGarden;
