import React, { useState, useEffect, useRef } from 'react';
import DragonMascot from './DragonMascot';
import { generateDynamicQuickReplies, getStarterReplies, QuickReply, ChatMessage as QRChatMessage } from '../services/quickReplies';
import './ChatHome.css';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatHomeProps {
    onClose: () => void;
    onSendMessage: (history: Array<{role: 'user' | 'assistant', content: string}>) => Promise<string>;
}

const ChatHome: React.FC<ChatHomeProps> = ({ onClose, onSendMessage }) => {
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const speak = (text: string) => {
        if (!isTTSEnabled) return;
        const cleanText = text.replace(/[🐲✨🌟💖🎮📚👋😂🎵🔢🌈]/g, '');
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

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const responseText = await onSendMessage(text);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
            speak(responseText);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = "Oops! My dragon ears didn't catch that. Can you say it again? 🐲👂";
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: errorMsg,
                timestamp: Date.now()
            }]);
            speak(errorMsg);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend(inputValue);
    };

    return (
        <div className="chat-home-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="chat-home-container">
                <div className="chat-home-header">
                    <div className="header-dragon">
                        <DragonMascot state="waving" />
                    </div>
                    <div className="header-title">
                        <h2>Mimi's Cave</h2>
                        <p>Your English Learning Dragon</p>
                    </div>
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

                <div className="chat-input-area">
                    <div className="quick-replies">
                        {QUICK_REPLIES.map(reply => (
                            <button key={reply.value} onClick={() => handleSend(reply.value)}>
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
                            placeholder="Type a message to Mimi..."
                            aria-label="Type your message"
                        />
                        <button className="send-button" onClick={() => handleSend(inputValue)}>
                            Send 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHome;
