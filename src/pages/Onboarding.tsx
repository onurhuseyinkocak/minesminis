import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import './Onboarding.css';

const funAvatars = [
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐰', name: 'Bunny' },
    { emoji: '🦄', name: 'Unicorn' },
    { emoji: '🐸', name: 'Frog' },
    { emoji: '🦋', name: 'Butterfly' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🐶', name: 'Dog' },
    { emoji: '🐻', name: 'Bear' },
    { emoji: '🦉', name: 'Owl' },
    { emoji: '🐙', name: 'Octopus' },
];

const funUsernames = [
    'StarLearner', 'SuperReader', 'WordWizard', 'BrainChamp',
    'SmartCookie', 'GameMaster', 'SpellingStar', 'BookWorm',
    'CleverKid', 'QuizKing', 'EnglishHero', 'VocabNinja',
    'LearningPro', 'MiniGenius', 'BrightSpark', 'StudyStar'
];

const Onboarding: React.FC = () => {
    const { user, refreshUserProfile, setHasSkippedSetup } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [grade, setGrade] = useState('');
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const gradeOptions = [
        { value: 'primary', label: '1st Grade', emoji: '🌟' },
        { value: 'grade2', label: '2nd Grade', emoji: '📚' },
        { value: 'grade3', label: '3rd Grade', emoji: '📖' },
        { value: 'grade4', label: '4th Grade', emoji: '🎓' },
    ];

    const getRandomUsername = () => {
        const randomName = funUsernames[Math.floor(Math.random() * funUsernames.length)];
        const randomNumber = Math.floor(Math.random() * 999) + 1;
        return `${randomName}${randomNumber}`;
    };

    const handleSuggestName = () => {
        setDisplayName(getRandomUsername());
    };

    const handleSkip = () => {
        setHasSkippedSetup(true);
        navigate('/games');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim() || !selectedAvatar || !grade) {
            return;
        }

        if (!user) {
            // Should not happen due to protected route, but safety check
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            await userService.createOrUpdateUserProfile(user, {
                role: 'student',
                displayName: displayName.trim(),
                grade: grade,
                avatar_emoji: selectedAvatar,
            });
            await refreshUserProfile();
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error creating profile. Please try again or skip for now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && selectedAvatar) {
            setStep(2);
        } else if (step === 2 && displayName.trim()) {
            setStep(3);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                <div className="setup-progress">
                    <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <AnimatePresence mode="wait">
                    <form onSubmit={handleSubmit} key={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="setup-step"
                            >
                                <h2>Choose Your Avatar! 🎨</h2>
                                <p>Pick a cool character to represent you</p>

                                <div className="avatar-grid">
                                    {funAvatars.map((avatar) => (
                                        <motion.button
                                            key={avatar.emoji}
                                            type="button"
                                            className={`avatar-option ${selectedAvatar === avatar.emoji ? 'selected' : ''}`}
                                            onClick={() => setSelectedAvatar(avatar.emoji)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="avatar-emoji">{avatar.emoji}</span>
                                            <span className="avatar-name">{avatar.name}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="step-actions">
                                    <motion.button
                                        type="button"
                                        className="next-btn"
                                        onClick={nextStep}
                                        disabled={!selectedAvatar}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Next Step
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="setup-step"
                            >
                                <div className="selected-avatar-display">
                                    <span className="big-avatar">{selectedAvatar}</span>
                                </div>

                                <h2>What's Your Name? ✨</h2>
                                <p>Pick a fun username for your adventure</p>

                                <div className="name-input-container">
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Type your cool name..."
                                        maxLength={20}
                                        className="fun-input"
                                    />
                                    <motion.button
                                        type="button"
                                        className="suggest-btn"
                                        onClick={handleSuggestName}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        🎲 Surprise Me!
                                    </motion.button>
                                </div>

                                <div className="step-actions">
                                    <button type="button" className="back-btn" onClick={prevStep}>
                                        Back
                                    </button>
                                    <motion.button
                                        type="button"
                                        className="next-btn"
                                        onClick={nextStep}
                                        disabled={!displayName.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Next Step
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="setup-step"
                            >
                                <div className="selected-avatar-display">
                                    <span className="big-avatar">{selectedAvatar}</span>
                                    <span className="selected-name">{displayName}</span>
                                </div>

                                <h2>What Grade Are You In? 🎒</h2>
                                <p>This helps us pick the best games for you</p>

                                <div className="grade-grid">
                                    {gradeOptions.map((gradeOpt) => (
                                        <motion.button
                                            key={gradeOpt.value}
                                            type="button"
                                            className={`grade-option ${grade === gradeOpt.value ? 'selected' : ''}`}
                                            onClick={() => setGrade(gradeOpt.value)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="grade-emoji">{gradeOpt.emoji}</span>
                                            <span className="grade-label">{gradeOpt.label}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="step-actions">
                                    <button type="button" className="back-btn" onClick={prevStep}>
                                        Back
                                    </button>
                                    <motion.button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={isSubmitting || !grade}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSubmitting ? 'Creating...' : "Let's Go! 🚀"}
                                    </motion.button>
                                </div>

                                {/* Skip option for offline/testing */}
                                <div className="skip-setup">
                                    <button type="button" onClick={handleSkip} className="skip-link">
                                        Skip setup (Take me to games)
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
