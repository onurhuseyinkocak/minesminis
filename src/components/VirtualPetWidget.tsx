import React, { useState, useEffect } from 'react';
import { Heart, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getUserPet,
  createPet,
  feedPet,
  playWithPet,
  updatePetStats,
  getPetMood,
  VirtualPet,
  PET_TYPES
} from '../services/petService';

const VirtualPetWidget: React.FC = () => {
  const [pet, setPet] = useState<VirtualPet | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedType, setSelectedType] = useState<VirtualPet['type']>('cat');
  const [petName, setPetName] = useState('');

  useEffect(() => {
    const userPet = getUserPet();
    if (userPet) {
      const updated = updatePetStats(userPet);
      setPet(updated);
    } else {
      setShowCreator(true);
    }
  }, []);

  const handleCreatePet = () => {
    const newPet = createPet(selectedType, petName || undefined);
    setPet(newPet);
    setShowCreator(false);
  };

  const handleFeed = () => {
    if (!pet) return;
    try {
      const fed = feedPet(pet);
      setPet(fed);
      toast.success('Yummy! Your pet loved that! 😋', {
        icon: '🍖',
        duration: 2000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Oops! Try again later! 🤗';
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  const handlePlay = () => {
    if (!pet) return;
    try {
      const played = playWithPet(pet);
      setPet(played);
      toast.success('Playtime was amazing! 🎾✨', {
        icon: '🎮',
        duration: 2000
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Your pet needs rest! Try later! 😴';
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  if (showCreator) {
    return (
      <div className="pet-creator">
        <h2>🐾 Create Your Pet!</h2>
        <p>Choose a pet to be your learning companion!</p>

        <div className="pet-types">
          {PET_TYPES.map(type => (
            <button
              key={type.type}
              className={`pet-type-btn ${selectedType === type.type ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.type)}
            >
              <div className="pet-emoji">{type.emoji}</div>
              <div className="pet-name">{type.name}</div>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Give your pet a name (optional)"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="pet-name-input"
        />

        <button className="create-pet-btn" onClick={handleCreatePet}>
          Create My Pet! 🎉
        </button>

        <style>{`
          .pet-creator {
            background: white;
            border-radius: 24px;
            padding: 32px;
            text-align: center;
            max-width: 500px;
            margin: 40px auto;
            box-shadow: var(--shadow-lg);
          }

          .pet-creator h2 {
            font-size: 2rem;
            margin-bottom: 8px;
          }

          .pet-creator p {
            color: #64748B;
            margin-bottom: 24px;
          }

          .pet-types {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }

          .pet-type-btn {
            background: white;
            border: 3px solid #E5E7EB;
            border-radius: 16px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .pet-type-btn.selected {
            border-color: var(--primary);
            background: #F0F4FF;
          }

          .pet-type-btn:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
          }

          .pet-emoji {
            font-size: 3rem;
            margin-bottom: 8px;
          }

          .pet-name {
            font-weight: 600;
            color: #1E293B;
          }

          .pet-name-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            font-size: 1rem;
            margin-bottom: 24px;
          }

          .create-pet-btn {
            width: 100%;
            padding: 16px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  if (!pet) return null;

  const expProgress = (pet.experience / (pet.level * 100)) * 100;

  return (
    <div className="pet-widget">
      <div className="pet-header">
        <div className="pet-avatar">{pet.emoji}</div>
        <div className="pet-info">
          <h3>{pet.name}</h3>
          <p className="pet-level">Level {pet.level}</p>
          <p className="pet-mood">{getPetMood(pet)}</p>
        </div>
      </div>

      <div className="pet-stats">
        <div className="stat">
          <Heart size={16} color="#EF4444" />
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${pet.happiness}%`, background: '#EF4444' }} />
          </div>
          <span>{pet.happiness}%</span>
        </div>

        <div className="stat">
          <Zap size={16} color="#F59E0B" />
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${pet.energy}%`, background: '#F59E0B' }} />
          </div>
          <span>{pet.energy}%</span>
        </div>

        <div className="stat">
          <Star size={16} color="#6366F1" />
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${expProgress}%`, background: '#6366F1' }} />
          </div>
          <span>{pet.experience}/{pet.level * 100}</span>
        </div>
      </div>

      <div className="pet-actions">
        <button onClick={handleFeed} className="pet-action-btn">
          🍖 Feed
        </button>
        <button onClick={handlePlay} className="pet-action-btn">
          🎾 Play
        </button>
      </div>

      <style>{`
        .pet-widget {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--shadow-md);
        }

        .pet-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .pet-avatar {
          font-size: 4rem;
        }

        .pet-info h3 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .pet-level {
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .pet-mood {
          color: #64748B;
          font-size: 0.9rem;
        }

        .pet-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-bar {
          flex: 1;
          height: 12px;
          background: #E5E7EB;
          border-radius: 20px;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .stat span {
          font-size: 0.85rem;
          font-weight: 600;
          min-width: 50px;
          text-align: right;
        }

        .pet-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .pet-action-btn {
          padding: 12px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pet-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .pet-levelup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s;
        }

        .pet-levelup {
          background: white;
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          max-width: 400px;
          animation: bounceIn 0.5s;
        }

        .pet-emoji-large {
          font-size: 6rem;
          margin-bottom: 24px;
        }

        .levelup-close {
          margin-top: 24px;
          padding: 12px 32px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default VirtualPetWidget;
