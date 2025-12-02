import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { sendMessageToAI, checkMessageLimit, ChatMessage } from '../services/aiService';
import toast from 'react-hot-toast';

interface AIMascotProps {
  subscriptionTier?: 'free' | 'basic' | 'premium' | 'unlimited';
}

const AIMascot: React.FC<AIMascotProps> = ({ subscriptionTier = 'free' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedMessages, setUsedMessages] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ai_messages_used');
    if (stored) {
      setUsedMessages(parseInt(stored));
    }

    const interval = setInterval(() => {
      if (!isOpen) {
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!checkMessageLimit(usedMessages, subscriptionTier)) {
      toast('You\'ve chatted a lot today! 🌟 Come back tomorrow for more fun!', {
        icon: '💬',
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#FEF3C7',
          color: '#92400E',
        }
      });
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI([...messages, userMessage]);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      const newCount = usedMessages + 1;
      setUsedMessages(newCount);
      localStorage.setItem('ai_messages_used', newCount.toString());
    } catch (error) {
      // Handle different error types with child-friendly messages
      let errorContent = 'Oops! I had a little hiccup. Can you try again? 😊';

      if (error instanceof Error) {
        if (error.message === 'MISSING_API_KEY') {
          errorContent = 'Oh no! Mimi needs a special key to work. Ask a grown-up for help! 🔑';
        } else if (error.message.includes('API_ERROR')) {
          errorContent = 'I\'m having trouble thinking right now. Let\'s try again in a moment! 🤔💭';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorContent = 'Hmm, I can\'t connect right now. Check your internet! 🌐';
        }
      }

      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Failed to get AI response:', error);
      }

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageLimitText = () => {
    switch (subscriptionTier) {
      case 'free':
        return `${usedMessages}/100 messages (testing mode)`;
      case 'basic':
        return `${usedMessages}/50 messages this month`;
      case 'premium':
        return `${usedMessages}/100 messages this month`;
      case 'unlimited':
        return 'Unlimited messages ✨';
      default:
        return `${usedMessages}/100 messages (testing mode)`;
    }
  };

  return (
    <>
      <div className="ai-mascot-container">
        <button
          className={`mascot-btn ${showWelcome ? 'bounce' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="mascot-avatar">🐻</div>
          {showWelcome && (
            <div className="mascot-bubble">
              {usedMessages === 0 ? (
                <>Hi! I'm Mimi! 🌟<br />Let's learn English! 🎉</>
              ) : usedMessages < 10 ? (
                <>Great to see you! 💙<br />Ready to chat? 😊</>
              ) : (
                <>You're doing amazing! ⭐<br />Let's talk! 🚀</>
              )}
            </div>
          )}
        </button>

        {isOpen && (
          <div className="chat-window premium-card">
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="mascot-avatar-small">🐻</div>
                <div>
                  <h3>Mimi - Your English Buddy! 🌟</h3>
                  <p className="message-limit">{getMessageLimitText()}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="welcome-message">
                  <div className="mascot-avatar-large">🐻</div>
                  <h3>Hi! I'm Mimi! 🌟✨</h3>
                  <p>I'm here to make learning English super fun! Let's play, learn, and explore together! 🎉</p>
                  <div className="quick-questions">
                    <button onClick={() => setInputValue('Teach me a fun word! 🎨')}>
                      ✨ Teach me a word
                    </button>
                    <button onClick={() => setInputValue('Tell me a story! 📚')}>
                      📚 Tell me a story
                    </button>
                    <button onClick={() => setInputValue('Let\'s play a game! 🎮')}>
                      🎮 Play a game
                    </button>
                    <button onClick={() => setInputValue('Sing me a song! 🎵')}>
                      🎵 Sing a song
                    </button>
                  </div>
                </div>
              )}


              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.role}`}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    justifyContent: 'flex-start'
                  }}
                >
                  {msg.role === 'assistant' && <div className="message-avatar">🐻</div>}
                  <div
                    className="message-content"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        : '#F1F5F9',
                      color: msg.role === 'user' ? 'white' : '#1E293B',
                      padding: '14px 18px',
                      borderRadius: '18px',
                      maxWidth: '75%',
                      wordWrap: 'break-word',
                      lineHeight: '1.6',
                      fontSize: '0.95rem',
                      borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px'
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && <div className="message-avatar">👤</div>}
                </div>
              ))}

              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">🐻</div>
                  <div className="message-content typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                className="send-btn premium-btn premium-btn-primary"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>

            {subscriptionTier === 'free' && usedMessages >= 3 && (
              <div className="upgrade-prompt">
                <Sparkles size={16} />
                <span>Want more messages? Upgrade to Premium!</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .ai-mascot-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        .mascot-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--gradient-primary);
          border: 4px solid white;
          box-shadow: var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.4);
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }

        .mascot-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg), 0 0 40px rgba(99, 102, 241, 0.6);
        }

        .mascot-btn.bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .mascot-avatar {
          font-size: 2.5rem;
          line-height: 1;
        }

        .mascot-bubble {
          position: absolute;
          bottom: 80px;
          right: 0;
          background: white;
          padding: 12px 16px;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          white-space: nowrap;
          font-size: 0.9rem;
          font-weight: 600;
          animation: fadeIn 0.3s;
        }

        .mascot-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        }

        .chat-window {
          position: absolute;
          bottom: 90px;
          right: 0;
          width: 500px;
          height: 650px;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 2px solid #E5E7EB;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mascot-avatar-small {
          font-size: 2rem;
        }

        .chat-header h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        .message-limit {
          font-size: 0.75rem;
          color: #64748B;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #F1F5F9;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: calc(650px - 200px);
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 10px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }

        .welcome-message {
          text-align: center;
          padding: 20px;
        }

        .mascot-avatar-large {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .welcome-message h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .welcome-message p {
          color: #64748B;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .quick-questions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quick-questions button {
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .quick-questions button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .message {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          width: 100%;
        }

        .message.assistant {
          flex-direction: row;
          justify-content: flex-start;
        }

        .message.user {
          flex-direction: row-reverse;
          justify-content: flex-start;
        }

        .message-avatar {
          font-size: 2rem;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-content {
          padding: 14px 18px;
          border-radius: 18px;
          max-width: 75%;
          word-wrap: break-word;
          word-break: break-word;
          line-height: 1.6;
          font-size: 0.95rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .message.assistant .message-content {
          background: #F1F5F9;
          color: #1E293B;
          border-bottom-left-radius: 4px;
        }

        .message.user .message-content {
          background: var(--gradient-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-content.typing {
          display: flex;
          gap: 4px;
          padding: 16px;
        }

        .message-content.typing span {
          width: 8px;
          height: 8px;
          background: #94A3B8;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .message-content.typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .message-content.typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .chat-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 2px solid #E5E7EB;
        }

        .chat-input input {
          flex: 1;
          padding: 12px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 0.95rem;
          outline: none;
        }

        .chat-input input:focus {
          border-color: var(--primary);
        }

        .send-btn {
          padding: 12px 16px !important;
        }

        .upgrade-prompt {
          background: var(--gradient-secondary);
          color: white;
          padding: 12px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .chat-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 120px);
            right: 16px;
          }

          .mascot-bubble {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
};

export default AIMascot;
