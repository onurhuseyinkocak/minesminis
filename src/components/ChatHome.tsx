import React, { useState, useEffect, useRef } from 'react';
import ProfessorPaws from './ProfessorPaws';
import './ChatHome.css';

/* ============================================================
   CHAT HOME - COZY INTERFACE
   ============================================================ */

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatHomeProps {
    onClose: () => void;
    onSendMessage: (text: string) => Promise<string>; // Hook up to AI service
}

const QUICK_REPLIES = [
    { text: "Hello! 👋", value: "Hello! 👋" },
    { text: "Tell me a joke! 😂", value: "Tell me a joke! 😂" },
    { text: "I love you! ❤️", value: "I love you! ❤️" },
    { text: "Let's play! 🎮", value: "Let's play! 🎮" }
];

const ChatHome: React.FC<ChatHomeProps> = ({ onClose, onSendMessage }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Welcome to my cozy home! 🏠✨ I'm so happy you're here! What should we talk about? 🐻",
            timestamp: Date.now()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const speak = (text: string) => {
        if (!isTTSEnabled) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.2; // Higher pitch for cute bear voice
        utterance.rate = 1.1;
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

        // Add User Message
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
            // Simulate network delay for "thinking" effect
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get AI Response
            const responseText = await onSendMessage(text);

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
            speak(responseText); // Speak the response
        } catch (error) {
            console.error("Chat Error:", error);
            // Fallback error message
            const errorMsg = "Oops! My ears are a bit fuzzy. Can you say that again? 🐻👂";
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
        <div className="chat-home-overlay">
            <div className="chat-home-container">
                {/* HEADER */}
                <div className="chat-home-header">
                    <div className="header-bear">
                        <ProfessorPaws state="waving" className="mini-bear" />
                    </div>
                    <div className="header-title">
                        <h2>Mimi's Cottage</h2>
                        <p>English Learning Buddy</p>
                    </div>
                    <div className="header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                        <button
                            className="tts-toggle"
                            onClick={toggleTTS}
                            title={isTTSEnabled ? "Mute Voice" : "Enable Voice"}
                            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            {isTTSEnabled ? "🔊" : "🔇"}
                        </button>
                        <button className="close-button" onClick={onClose} aria-label="Close Chat">
                            ✖
                        </button>
                    </div>
                </div>

                {/* MESSAGES AREA */}
                <div className="chat-messages-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div className="avatar-bear">
                                    <ProfessorPaws state="idle" />
                                </div>
                            )}
                            <div className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message-row assistant">
                            <div className="avatar-bear">
                                <ProfessorPaws state="thinking" /> {/* Fallback to idle if thinking not defined */}
                            </div>
                            <div className="message-bubble assistant typing-indicator">
                                <span>•</span><span>•</span><span>•</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT AREA */}
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
                            placeholder="Type a message..."
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
