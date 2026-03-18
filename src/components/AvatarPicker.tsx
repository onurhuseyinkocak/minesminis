/**
 * AVATAR PICKER COMPONENT
 * Modal overlay for selecting an emoji avatar
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

interface AvatarPickerProps {
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  // Animals
  '🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🐸', '🐵', '🦄', '🐙', '🐬', '🦋', '🐢',
  '🐧', '🦉', '🐲', '🦈',
  // Fun characters
  '🤖', '👾', '🧙', '🧚', '🦸', '🧑‍🚀', '🧑‍🎨', '🧑‍🔬',
  '🎃', '⭐', '🌈', '🌻',
];

const AvatarPicker: React.FC<AvatarPickerProps> = ({ onClose }) => {
  const { user, userProfile, setUserProfile } = useAuth();
  const [selected, setSelected] = useState<string>(userProfile?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const handleSelect = async (emoji: string) => {
    if (!user?.uid) return;

    setSelected(emoji);
    setSaving(true);

    try {
      await userService.updateUserProfile(user.uid, { avatar_url: emoji });

      // Update local profile state
      if (userProfile) {
        setUserProfile({ ...userProfile, avatar_url: emoji });
      }

      onClose();
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="avatar-picker-overlay" onClick={onClose}>
      <div className="avatar-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h3>Choose Your Avatar</h3>
          <button className="picker-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="picker-grid">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              className={`picker-item ${selected === emoji ? 'selected' : ''}`}
              onClick={() => handleSelect(emoji)}
              disabled={saving}
              aria-label={`Select ${emoji} avatar`}
            >
              <span className="picker-emoji">{emoji}</span>
            </button>
          ))}
        </div>

        {saving && (
          <div className="picker-saving">Saving...</div>
        )}

        <style>{`
          .avatar-picker-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .avatar-picker-modal {
            background: var(--bg-main, #1C2236);
            border-radius: 24px;
            padding: 28px;
            width: 90%;
            max-width: 420px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.25s ease;
          }

          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .picker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .picker-header h3 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--text-main, #333);
          }

          .picker-close {
            width: 36px;
            height: 36px;
            border-radius: 12px;
            border: none;
            background: var(--bg-soft, #f0f0f0);
            color: var(--text-muted, #666);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .picker-close:hover {
            background: var(--glass-border, #ddd);
            color: var(--text-main, #333);
          }

          .picker-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
            gap: 10px;
          }

          .picker-item {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            border: 2px solid transparent;
            background: var(--bg-soft, #f5f5f5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .picker-item:hover {
            transform: scale(1.12);
            border-color: #E8A317;
            box-shadow: 0 4px 12px rgba(232, 163, 23, 0.25);
          }

          .picker-item.selected {
            border-color: #1A6B5A;
            background: rgba(26, 107, 90, 0.1);
            box-shadow: 0 0 0 3px rgba(26, 107, 90, 0.2);
          }

          .picker-item:disabled {
            opacity: 0.6;
            cursor: wait;
          }

          .picker-emoji {
            font-size: 1.6rem;
            line-height: 1;
          }

          .picker-saving {
            text-align: center;
            margin-top: 16px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-muted, #666);
          }
        `}</style>
      </div>
    </div>
  );
};

export default AvatarPicker;
