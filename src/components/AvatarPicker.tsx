/**
 * AVATAR PICKER COMPONENT
 * Simple avatar selection for children
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import './AvatarPicker.css';

// EMOJI HEROES for kids
const EMOJI_AVATARS = ['🐶', '🐱', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🦖', '🦄'];

const AvatarPicker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, userProfile, setUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(userProfile?.avatar_url || '');

    const handleSelect = async (url: string) => {
        if (!user) return;

        setLoading(true);
        setSelected(url);

        try {
            const { error } = await supabase
                .from('users')
                .update({ avatar_url: url })
                .eq('id', user.id);

            if (!error && userProfile) {
                setUserProfile({ ...userProfile, avatar_url: url });
            }
        } catch (err) {
            console.error('Error updating avatar:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="avatar-picker-overlay" onClick={onClose}>
            <div className="avatar-picker-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✕</button>

                <h2>🎨 Choose Your Hero</h2>
                <p>Pick an avatar that looks like you!</p>

                <div className="avatar-grid">
                    {EMOJI_AVATARS.map((emoji) => (
                        <button
                            key={emoji}
                            className={`avatar-item ${selected === emoji ? 'active' : ''}`}
                            onClick={() => handleSelect(emoji)}
                            disabled={loading}
                        >
                            <span className="avatar-emoji">{emoji}</span>
                            {selected === emoji && <div className="selected-check">✓</div>}
                        </button>
                    ))}
                </div>

                <div className="picker-footer">
                    <button className="finish-btn" onClick={onClose}>
                        Looks Good! ✨
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarPicker;
