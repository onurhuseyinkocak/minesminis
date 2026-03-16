/**
 * Oyun sayfasında evcil hayvan: ekranda gezer, oyuncakla oynar.
 * Açlık/enerji çubukları; yemek ve uyku ile artar.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserPet,
  feedPet,
  playWithPet,
  sleepPet,
  updatePetStats,
  type VirtualPet,
  type PetType,
} from '../services/petService';
import RealisticPetView from './RealisticPetView';
import toast from 'react-hot-toast';

export default function PetPlayground() {
  const { user } = useAuth();
  const [pet, setPet] = useState<VirtualPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [playState, setPlayState] = useState<'idle' | 'play'>('idle');

  const loadPet = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const p = await getUserPet(user.uid);
      if (p) {
        const updated = await updatePetStats(p);
        setPet(updated);
      } else {
        setPet(null);
      }
    } catch (e) {
      console.error('Pet load:', e);
      setPet(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadPet();
    const t = setInterval(loadPet, 60 * 1000);
    return () => clearInterval(t);
  }, [loadPet]);

  const handleFeed = async () => {
    if (!pet) return;
    try {
      const fed = await feedPet(pet);
      setPet(fed);
      toast.success('Yummy! Your pet loved that!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Try again later.');
    }
  };

  const handleSleep = async () => {
    if (!pet) return;
    try {
      const rested = await sleepPet(pet);
      setPet(rested);
      toast.success('Your pet is rested!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Try again.');
    }
  };

  const handlePlay = async () => {
    if (!pet) return;
    try {
      setPlayState('play');
      const played = await playWithPet(pet);
      setPet(played);
      toast.success('Playtime!');
      setTimeout(() => setPlayState('idle'), 2000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Your pet needs rest!');
      setPlayState('idle');
    }
  };

  if (loading || !pet) return null;

  return (
    <div className="pet-playground">
      <div className="pet-playground-stage">
        <div className={`pet-playground-pet pet-playground-pet--${pet.type}`}>
          <RealisticPetView type={pet.type as PetType} state={playState} size={100} />
        </div>
        <div className={`pet-playground-toy pet-playground-toy--${pet.type}`} aria-hidden>
          {pet.type === 'cat' && <div className="toy-yarn" />}
          {pet.type === 'dog' && <div className="toy-ball" />}
          {pet.type === 'bird' && <div className="toy-fly" />}
        </div>
      </div>
      <div className="pet-playground-bars">
        <div className="pet-bar">
          <span className="pet-bar-label">Hunger</span>
          <div className="pet-bar-track">
            <div className="pet-bar-fill hunger" style={{ width: `${pet.hunger}%` }} />
          </div>
          <span className="pet-bar-pct">{pet.hunger}%</span>
        </div>
        <div className="pet-bar">
          <span className="pet-bar-label">Energy</span>
          <div className="pet-bar-track">
            <div className="pet-bar-fill energy" style={{ width: `${pet.energy}%` }} />
          </div>
          <span className="pet-bar-pct">{pet.energy}%</span>
        </div>
      </div>
      <div className="pet-playground-actions">
        <button type="button" className="pet-action-btn feed" onClick={handleFeed} title="Feed">
          Feed
        </button>
        <button type="button" className="pet-action-btn sleep" onClick={handleSleep} title="Sleep">
          Sleep
        </button>
        <button
          type="button"
          className="pet-action-btn play"
          onClick={handlePlay}
          disabled={pet.energy < 15}
          title="Play"
        >
          Play
        </button>
      </div>
    </div>
  );
}
