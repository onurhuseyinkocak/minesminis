import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Star, Edit2, Check, X, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserPet,
  createPet,
  feedPet,
  playWithPet,
  updatePetStats,
  getPetMood,
  renamePet,
  VirtualPet,
  PET_TYPES
} from '../services/petService';
import RealisticPetView from './RealisticPetView';

const VirtualPetWidget: React.FC = () => {
  const { user } = useAuth();
  const [pet, setPet] = useState<VirtualPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [petName, setPetName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const creatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.uid) {
      loadPet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
  }, [user]);

  const loadPet = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const userPet = await getUserPet(user.uid);
      if (userPet) {
        const updated = await updatePetStats(userPet);
        setPet(updated);
        setNewName(updated.name);
      } else {
        setShowCreator(true);
      }
    } catch (error) {
      console.error('Error loading pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePet = async () => {
    if (!user?.uid) return;
    try {
      const currentType = PET_TYPES[selectedTypeIndex].type;
      const newPet = await createPet(user.uid, currentType, petName || undefined);
      setPet(newPet);
      setNewName(newPet.name);
      setShowCreator(false);
      toast.success(`Welcome to the family, ${newPet.name}! 🎊`);
    } catch {
      toast.error('Failed to create pet. Please try again.');
    }
  };

  const handleRename = async () => {
    if (!pet || !newName.trim() || !user?.uid) return;
    try {
      await renamePet(user.uid, newName);
      setPet({ ...pet, name: newName });
      setIsEditingName(false);
      toast.success(`Renamed to ${newName}! ✨`);
    } catch {
      toast.error('Failed to rename pet.');
    }
  };

  const nextPet = () => setSelectedTypeIndex((prev) => (prev + 1) % PET_TYPES.length);
  const prevPet = () => setSelectedTypeIndex((prev) => (prev - 1 + PET_TYPES.length) % PET_TYPES.length);

  const handleFeed = async () => {
    if (!pet) return;
    try {
      const fed = await feedPet(pet);
      setPet({ ...fed });
      toast.success('Yummy! Your pet loved that! 😋', { icon: '🍖' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Oops! Try again later!');
    }
  };

  const handlePlay = async () => {
    if (!pet) return;
    try {
      const played = await playWithPet(pet);
      setPet({ ...played });
      toast.success('Playtime was amazing! 🎾✨', { icon: '🎮' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Your pet needs rest!');
    }
  };

  if (loading) return <div className="pet-skeleton">Loading your pal...</div>;

  if (showCreator) {
    const activePet = PET_TYPES[selectedTypeIndex];
    return (
      <div className="pet-creator-arşa" ref={creatorRef}>
        <div className="creator-header">
          <Wand2 className="magic-icon" size={24} />
          <h2>Summon Your Pal</h2>
          <p>A magical creature is waiting for you!</p>
        </div>

        <div className="pet-selection-carousel">
          <button className="carousel-nav prev" onClick={prevPet}><ChevronLeft /></button>

          <div className="active-pet-display">
            <div className="pet-spotlight"></div>
            <div className="preview-mascot-wrapper">
              <RealisticPetView type={activePet.type} state="idle" size={160} />
            </div>
            <div className="active-pet-type-label">{activePet.name}</div>
          </div>

          <button className="carousel-nav next" onClick={nextPet}><ChevronRight /></button>
        </div>

        <div className="creator-form">
          <div className="modern-input-wrapper">
            <input
              type="text"
              placeholder="Name your new friend..."
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="arşa-pet-input"
            />
          </div>
          <button className="summon-btn-premium" onClick={handleCreatePet}>
            SUMMON {activePet.name.toUpperCase()} ✨
          </button>
        </div>
        <style>{`
          .pet-creator-arşa {
              background: var(--glass-bg);
              backdrop-filter: blur(20px);
              border: 2px solid var(--primary);
              border-radius: 32px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 30px 60px rgba(99, 102, 241, 0.2);
              animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .creator-header { margin-bottom: 30px; }
          .magic-icon { color: #F59E0B; margin-bottom: 10px; animation: bounce 2s infinite; }
          .creator-header h2 { font-size: 2rem; font-weight: 900; margin: 0; color: var(--text-dark); }
          .creator-header p { color: var(--text-muted); font-weight: 600; margin-top: 5px; }

          .pet-selection-carousel {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              margin: 40px 0;
          }

          .carousel-nav {
              background: var(--bg-soft);
              border: 2px solid var(--glass-border);
              width: 44px;
              height: 44px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
              color: var(--primary);
          }

          .carousel-nav:hover { background: var(--primary); color: white; transform: scale(1.1); }

          .active-pet-display {
              position: relative;
              width: 180px;
              height: 180px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
          }

          .pet-spotlight {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 140px;
              height: 140px;
              background: radial-gradient(circle, var(--primary-orange-light) 0%, transparent 70%);
              opacity: 0.2;
              z-index: 1;
              border-radius: 50%;
              animation: pulse-spotlight 3s infinite;
          }

          .pet-emoji-hero {
              font-size: 6rem;
              z-index: 2;
              filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
              animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .active-pet-type-label {
              margin-top: 15px;
              font-size: 1.2rem;
              font-weight: 900;
              color: var(--primary);
              letter-spacing: 0.05em;
          }

          .creator-form {
              display: flex;
              flex-direction: column;
              gap: 20px;
              max-width: 300px;
              margin: 0 auto;
          }

          .arşa-pet-input {
              width: 100%;
              padding: 18px;
              border-radius: 16px;
              border: 2px solid var(--glass-border);
              background: var(--bg-soft);
              color: var(--text-dark);
              font-size: 1.1rem;
              font-weight: 700;
              text-align: center;
              transition: all 0.3s;
              outline: none;
          }

          .arşa-pet-input:focus { border-color: var(--primary); background: var(--bg-card); }

          .summon-btn-premium {
              background: linear-gradient(135deg, #6366F1, #4F46E5);
              color: white;
              padding: 18px;
              border-radius: 16px;
              font-weight: 900;
              font-size: 1rem;
              border: none;
              cursor: pointer;
              box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
              transition: all 0.3s;
          }

          .summon-btn-premium:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4); }

          @keyframes popIn {
             from { transform: scale(0.5); opacity: 0; }
             to { transform: scale(1); opacity: 1; }
          }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes pulse-spotlight { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; } 50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; } }
        `}</style>
      </div>
    );
  }

  if (!pet) return null;

  const expProgress = (pet.experience / (pet.level * 100)) * 100;

  return (
    <div className="pet-widget-premium">
      <div className="pet-header-main">
        <div className="pet-avatar-container">
          <RealisticPetView
            type={pet.type}
            state={pet.energy < 25 ? 'idle' : 'idle'}
            size={120}
          />
          <div className="pet-level-badge">LVL {pet.level}</div>
        </div>

        <div className="pet-identity">
          {isEditingName ? (
            <div className="rename-input-box">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <button onClick={handleRename} className="save-btn"><Check size={16} /></button>
              <button onClick={() => setIsEditingName(false)} className="cancel-btn"><X size={16} /></button>
            </div>
          ) : (
            <div className="pet-name-box">
              <h3>{pet.name}</h3>
              <button onClick={() => setIsEditingName(true)} className="edit-name-btn">
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <div className="mood-tag">{getPetMood(pet)}</div>
        </div>
      </div>

      <div className="pet-stats-container">
        <div className="stat-row">
          <div className="stat-label">
            <Heart size={14} className="icon-pulse" />
            <span>HAPPINESS</span>
          </div>
          <div className="stat-bar-outer">
            <div className="stat-bar-inner happiness" style={{ width: `${pet.happiness}%` }} />
          </div>
          <span className="stat-num">{pet.happiness}%</span>
        </div>

        <div className="stat-row">
          <div className="stat-label">
            <Zap size={14} className="icon-bolt" />
            <span>ENERGY</span>
          </div>
          <div className="stat-bar-outer">
            <div className="stat-bar-inner energy" style={{ width: `${pet.energy}%` }} />
          </div>
          <span className="stat-num">{pet.energy}%</span>
        </div>

        <div className="stat-row">
          <div className="stat-label">
            <Star size={14} className="icon-spin" />
            <span>EXPERIENCE</span>
          </div>
          <div className="stat-bar-outer">
            <div className="stat-bar-inner xp" style={{ width: `${expProgress}%` }} />
          </div>
          <span className="stat-num">{pet.experience}/{pet.level * 100}</span>
        </div>
      </div>

      <div className="pet-quick-actions">
        <button onClick={handleFeed} className="action-btn feed">
          <span className="action-icon">🍖</span>
          <span>Feed</span>
        </button>
        <button onClick={handlePlay} className="action-btn play">
          <span className="action-icon">🎾</span>
          <span>Play</span>
        </button>
      </div>

      <style>{`
        .pet-widget-premium {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 24px;
          color: var(--text-main);
          animation: slideUp 0.5s ease-out;
        }

        .pet-header-main { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
        .pet-avatar-container { position: relative; }
        .pet-avatar-glow { font-size: 3.5rem; filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.3)); animation: float 3s infinite ease-in-out; }
        .pet-level-badge { position: absolute; bottom: -5px; right: -5px; background: var(--gradient-primary); color: white; font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 10px; border: 2px solid var(--glass-bg); }
        
        .pet-identity h3 { font-size: 1.4rem; margin: 0; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .pet-name-box { display: flex; align-items: center; gap: 8px; }
        .edit-name-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .edit-name-btn:hover { background: var(--bg-soft); color: var(--primary); }
        
        .rename-input-box { display: flex; align-items: center; gap: 4px; }
        .rename-input-box input { background: var(--bg-soft); border: 1px solid var(--primary); color: var(--text-dark); padding: 4px 8px; border-radius: 8px; width: 120px; font-size: 1rem; outline: none; }
        .save-btn { color: #10B981; background: none; border: none; cursor: pointer; }
        .cancel-btn { color: #EF4444; background: none; border: none; cursor: pointer; }

        .mood-tag { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
        .pet-stats-container { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .stat-row { display: grid; grid-template-columns: 100px 1fr 60px; align-items: center; gap: 12px; }
        .stat-label { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }
        .stat-bar-outer { height: 10px; background: var(--bg-soft); border-radius: 10px; overflow: hidden; border: 1px solid var(--glass-border); }
        .stat-bar-inner { height: 100%; border-radius: 10px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .stat-bar-inner.happiness { background: linear-gradient(90deg, #F87171, #EF4444); }
        .stat-bar-inner.energy { background: linear-gradient(90deg, #FBBF24, #F59E0B); }
        .stat-bar-inner.xp { background: linear-gradient(90deg, #818CF8, #6366F1); }
        .stat-num { font-size: 0.8rem; font-weight: 700; text-align: right; color: var(--text-dark); }
        
        .pet-quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .action-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; color: white; }
        .action-btn.feed { background: linear-gradient(135deg, #F97316, #EA580C); box-shadow: 0 4px 15px rgba(234, 88, 12, 0.2); }
        .action-btn.play { background: linear-gradient(135deg, #06B6D4, #0891B2); box-shadow: 0 4px 15px rgba(8, 145, 178, 0.2); }
        .action-btn:hover { transform: translateY(-3px); }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .icon-pulse { animation: heartBeat 1.5s infinite; }
        @keyframes heartBeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
      `}</style>
    </div>
  );
};

export default VirtualPetWidget;
