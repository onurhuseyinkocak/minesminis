import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DragonMascot from './DragonMascot';
import { generateDynamicQuickReplies, getStarterReplies, QuickReply } from '../services/quickReplies';
import { usePremium } from '../contexts/PremiumContext';
import './ChatHome.css';

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

const ChatHome: React.FC<ChatHomeProps> = ({ onClose, onSendMessage }) => {
    const navigate = useNavigate();
    const { isPremium } = usePremium();

    // Daily usage tracking
    const [dailyUsage, setDailyUsage] = useState(() => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('mimi_cave_daily_usage');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === today) {
                return parsed.count;
            }
        }
        return 0;
    });

    const [showLimitReached, setShowLimitReached] = useState(false);

    const incrementDailyUsage = () => {
        const today = new Date().toDateString();
        const newCount = dailyUsage + 1;
        setDailyUsage(newCount);
        localStorage.setItem('mimi_cave_daily_usage', JSON.stringify({ date: today, count: newCount }));
    };

    const canSendMessage = () => {
        if (isPremium) return true;
        return dailyUsage < DAILY_MESSAGE_LIMIT;
    };

    const remainingMessages = Math.max(0, DAILY_MESSAGE_LIMIT - dailyUsage);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Merhaba! Welcome to my cozy cave! 🐲✨ I'm Mimi the dragon! Let's learn English together! What would you like to do today? 🌟",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>(getStarterReplies());
    const [usedReplies, setUsedReplies] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const speak = (text: string) => {
        if (!isTTSEnabled) return;
        const cleanText = text.replace(/[🐲✨🌟💖🎮📚👋😂🎵🔢🌈🐾🍎👨‍👩‍👧🖐️👕🍕☀️📅😊🤔📖⭐👅🎯✏️📝🔤🗣️↔️🎶🤓🤷😎😅💪👂💖]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.pitch = 1.3;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    };

    const toggleTTS = () => {
        setIsTTSEnabled(!isTTSEnabled);
        if (!isTTSEnabled) {
            speak("Voice activated! I can talk now!");
        } else {
            window.speechSynthesis.cancel();
        }
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
            console.error("Chat Error:", error);
            const errorMsg = "Oops! My dragon ears didn't catch that. Can you say it again? 🐲👂";
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend(inputValue);
    };

    const handleGetPremium = () => {
        onClose();
        navigate('/premium');
    };

    return (
        <div className="chat-home-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="chat-home-container">
                <div className="chat-home-header">
                    <div className="header-dragon">
                        <DragonMascot state="waving" />
                    </div>
                    <div className="header-title">
                        <h2>🐲 Mimi's Cave</h2>
                        <p>Your English Learning Dragon</p>
                    </div>

                    {/* Usage Indicator */}
                    {!isPremium && (
                        <div className="usage-indicator">
                            <div className="usage-badge">
                                <span className="usage-icon">💬</span>
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
                            <span>👑</span>
                            <span>Premium</span>
                        </div>
                    )}

                    <div className="header-actions">
                        <button
                            className="tts-toggle"
                            onClick={toggleTTS}
                            title={isTTSEnabled ? "Mute Voice" : "Enable Voice"}
                        >
                            {isTTSEnabled ? "🔊" : "🔇"}
                        </button>
                        <button className="close-button" onClick={onClose} aria-label="Close Chat">
                            ✖
                        </button>
                    </div>
                </div>

                <div className="chat-messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div className="avatar-dragon">
                                    <DragonMascot state="idle" />
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
                                <DragonMascot state="thinking" />
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
                            <div className="limit-modal-icon">🐲💔</div>
                            <h3>Günlük Limit Doldu!</h3>
                            <p>Bugün için 10 ücretsiz mesaj hakkını kullandın.</p>
                            <p className="limit-modal-sub">Premium ile sınırsız sohbet et!</p>
                            <div className="limit-modal-actions">
                                <button className="premium-btn" onClick={handleGetPremium}>
                                    👑 Premium Ol
                                </button>
                                <button className="later-btn" onClick={() => setShowLimitReached(false)}>
                                    Yarın Devam Et
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chat-input-area">
                    {/* Remaining messages warning */}
                    {!isPremium && remainingMessages <= 3 && remainingMessages > 0 && (
                        <div className="low-messages-warning">
                            ⚠️ Sadece {remainingMessages} mesaj kaldı!
                        </div>
                    )}

                    <div className="quick-replies">
                        {quickReplies.map(reply => (
                            <button
                                key={reply.id}
                                onClick={() => handleSend(reply.value)}
                                disabled={!canSendMessage() && !isPremium}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>

                    <div className="input-row">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={canSendMessage() ? "Type a message to Mimi..." : "Limit doldu - Premium'a geç!"}
                            aria-label="Type your message"
                            disabled={!canSendMessage() && !isPremium}
                        />
                        <button
                            className="send-button"
                            onClick={() => handleSend(inputValue)}
                            disabled={!canSendMessage() && !isPremium}
                        >
                            Send 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHome;
