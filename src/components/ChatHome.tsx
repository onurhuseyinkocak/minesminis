import React, { useState, useEffect, useRef, useMemo } from 'react';
import { errorLogger } from '../services/errorLogger';
import './ChatHome.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UnifiedMascot from './UnifiedMascot';
import { generateDynamicQuickReplies, getStarterReplies, QuickReply } from '../services/quickReplies';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GLINTS } from '../config/GlintsConfig';
import { LS_CAVE_DAILY_USAGE } from '../config/storageKeys';
import { MessageCircle, Crown, Volume2, VolumeX, AlertTriangle, Send, X } from 'lucide-react';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatHomeProps {
    onClose: () => void;
    onSendMessage: (history: Array<{ role: 'user' | 'assistant', content: string }>) => Promise<string>;
}

const DAILY_MESSAGE_LIMIT = 10;

const WELCOME_BY_MASCOT: Record<string, string> = {
    mimi_dragon: "Merhaba! Welcome to my cozy cave! Let's learn English together! What would you like to do today?",
    nova_fox: "Hey there! I'm Nova the cosmic fox! Let's zoom through words at lightning speed! What shall we explore?",
    bubbles_octo: "Hello friend! I'm Bubbles! Let's dive into sounds and music together! What would you like to listen to?",
    sparky_alien: "Greetings earthling! I'm Sparky! My brain works super fast - let's solve puzzles and grammar together! Ready?",
};

const ChatHome: React.FC<ChatHomeProps> = ({ onClose, onSendMessage }) => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const { isPremium } = usePremium();
    const { t } = useLanguage();
    const mascotId = ((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon';
    const mascotConfig = useMemo(() => GLINTS[mascotId] || GLINTS.mimi_dragon, [mascotId]);

    // Daily usage tracking
    const [dailyUsage, setDailyUsage] = useState(() => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem(LS_CAVE_DAILY_USAGE);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.date === today) return parsed.count;
            } catch { /* corrupted localStorage */ }
        }
        return 0;
    });

    const [showLimitReached, setShowLimitReached] = useState(false);

    const incrementDailyUsage = () => {
        const today = new Date().toDateString();
        const newCount = dailyUsage + 1;
        setDailyUsage(newCount);
        localStorage.setItem(LS_CAVE_DAILY_USAGE, JSON.stringify({ date: today, count: newCount }));
    };

    const canSendMessage = () => {
        if (isPremium) return true;
        return dailyUsage < DAILY_MESSAGE_LIMIT;
    };

    const remainingMessages = Math.max(0, DAILY_MESSAGE_LIMIT - dailyUsage);

    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: 'welcome',
            role: 'assistant',
            content: WELCOME_BY_MASCOT[mascotId] || WELCOME_BY_MASCOT.mimi_dragon,
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>(getStarterReplies());
    const [usedReplies, setUsedReplies] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const speak = (text: string) => {
        if (!isTTSEnabled) return;
// Strip emojis for TTS (Unicode property avoids misleading-character-class)
        const cleanText = text.replace(/\p{Extended_Pictographic}/gu, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.pitch = 1.3;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    };

    const toggleTTS = () => {
        const next = !isTTSEnabled;
        setIsTTSEnabled(next);
        if (!next) window.speechSynthesis.cancel();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const updateQuickReplies = (allMessages: ChatMessage[]) => {
        const historyForReplies = allMessages.map(m => ({
            role: m.role,
            content: m.content
        }));
        const newReplies = generateDynamicQuickReplies(historyForReplies, usedReplies);
        setQuickReplies(newReplies);
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // Check message limit
        if (!canSendMessage()) {
            setShowLimitReached(true);
            return;
        }

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        // Increment usage for non-premium users
        if (!isPremium) {
            incrementDailyUsage();
        }

        const clickedReply = quickReplies.find(r => r.value === text);
        if (clickedReply) {
            setUsedReplies(prev => new Set([...prev, clickedReply.id]));
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const historyForAI = updatedMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const responseText = await onSendMessage(historyForAI);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };

            const finalMessages = [...updatedMessages, aiMsg];
            setMessages(finalMessages);
            speak(responseText);

            updateQuickReplies(finalMessages);

        } catch (error) {
            errorLogger.log({ severity: 'high', message: 'Chat Error', component: 'ChatHome', metadata: { error: String(error) } });
            const errorMsg = t('chatHome.errorMessage');
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: errorMsg,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
            speak(errorMsg);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) handleSend(inputValue);
    };

    const handleGetPremium = () => {
        onClose();
        navigate('/premium');
    };

    return (
        <div className="chat-home-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="chat-home-container" data-mascot={mascotId}>
                <div className="chat-home-header" style={{ background: `linear-gradient(135deg, ${mascotConfig.color} 0%, ${mascotConfig.accentColor} 100%)` }}>
                    <div className="header-dragon">
                        <UnifiedMascot
                            id={mascotId}
                            state="waving"
                            size={72}
                        />
                    </div>
                    <div className="header-title">
                        <h2>{mascotConfig.name}'s Chat</h2>
                        <p>{mascotConfig.title}</p>
                    </div>

                    {/* Usage Indicator */}
                    {!isPremium && (
                        <div className="usage-indicator">
                            <div className="usage-badge">
                                <MessageCircle size={14} className="usage-icon" />
                                <span className="usage-count">{remainingMessages}</span>
                            </div>
                            <div className="usage-progress">
                                <div
                                    className="usage-fill"
                                    style={{ width: `${(remainingMessages / DAILY_MESSAGE_LIMIT) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {isPremium && (
                        <div className="premium-badge-header">
                            <Crown size={14} />
                            <span>Premium</span>
                        </div>
                    )}

                    <div className="header-actions">
                        <button
                            type="button"
                            className="tts-toggle"
                            onClick={toggleTTS}
                            title={isTTSEnabled ? "Mute Voice" : "Enable Voice"}
                        >
                            {isTTSEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <button type="button" className="close-button" onClick={onClose} aria-label="Close Chat">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="chat-messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div className="avatar-dragon">
                                    <UnifiedMascot
                                        id={mascotId}
                                        state="idle"
                                        size={40}
                                    />
                                </div>
                            )}
                            <div className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message-row assistant">
                            <div className="avatar-dragon">
                                <UnifiedMascot
                                    id={mascotId}
                                    state="thinking"
                                    size={40}
                                />
                            </div>
                            <div className="message-bubble assistant typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Limit Reached Modal */}
                {showLimitReached && (
                    <div className="limit-modal-overlay">
                        <div className="limit-modal">
                            <div className="limit-modal-icon"><AlertTriangle size={40} /></div>
                            <h3>{t('chatHome.limitTitle')}</h3>
                            <p>{t('chatHome.limitMessage')}</p>
                            <p className="limit-modal-sub">{t('chatHome.limitSub')}</p>
                            <div className="limit-modal-actions">
                                <button type="button" className="premium-btn" onClick={handleGetPremium}>
                                    <Crown size={16} /> {t('chatHome.goPremium')}
                                </button>
                                <button type="button" className="later-btn" onClick={() => setShowLimitReached(false)}>
                                    {t('chatHome.continueTomorrow')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chat-input-area">
                    {/* Remaining messages warning */}
                    {!isPremium && remainingMessages <= 3 && remainingMessages > 0 && (
                        <div className="low-messages-warning">
                            <AlertTriangle size={14} /> {t('chatHome.onlyNLeft').replace('{count}', String(remainingMessages))}
                        </div>
                    )}

                    <div className="quick-replies">
                        {quickReplies.map(reply => (
                            <button
                                key={reply.id}
                                type="button"
                                onClick={() => handleSend(reply.value)}
                                disabled={!canSendMessage() && !isPremium}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>

                    <div className="input-row">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={canSendMessage() ? t('chatHome.typePlaceholder').replace('{name}', mascotConfig.name) : t('chatHome.limitPlaceholder')}
                            aria-label="Type your message"
                            disabled={!canSendMessage() && !isPremium}
                        />
                        <button
                            type="button"
                            className="send-button"
                            onClick={() => handleSend(inputValue)}
                            disabled={!canSendMessage() && !isPremium}
                        >
                            {t('chatHome.send')} <Send size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHome;
