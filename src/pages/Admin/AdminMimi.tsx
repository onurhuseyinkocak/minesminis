import { useState, useRef, useEffect, useCallback } from 'react';
import {
    X,
    Send,
    Shield,
    Sparkles,
    Database,
    Users,
    BarChart3,
    FileText,
    ChevronDown,
    Crown,
    Terminal,
    AlertTriangle,
    Copy,
    Trash2
} from 'lucide-react';
import UnifiedMascot from '../../components/UnifiedMascot';
import { adminFetch } from '../../utils/adminApi';
import { errorLogger } from '../../services/errorLogger';
import './AdminMimi.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface QuickAction {
    icon: React.ReactNode;
    label: string;
    prompt: string;
}

const quickActions: QuickAction[] = [
    { icon: <BarChart3 size={16} />, label: 'Haftalık Rapor', prompt: 'Haftalık performans raporu oluştur' },
    { icon: <Users size={16} />, label: 'Aktif Kullanıcılar', prompt: 'Son 24 saatte aktif olan kullanıcıları listele' },
    { icon: <FileText size={16} />, label: 'Nerede Yapılır?', prompt: 'Admin şunu nereden yapabilirim?' },
    { icon: <Database size={16} />, label: 'DB Durumu', prompt: 'Veritabanı durumunu kontrol et' },
    { icon: <Crown size={16} />, label: 'Premium Analizi', prompt: 'Premium dönüşüm oranını analiz et' },
    { icon: <AlertTriangle size={16} />, label: 'Sorun Tespiti', prompt: 'Sistemde olası sorunları kontrol et' },
];

/**
 * Send admin chat message to backend AI endpoint.
 * Falls back to a basic offline response if the backend is unreachable.
 */
async function fetchAdminAIResponse(
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
    try {
        const res = await adminFetch('/api/admin/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: chatHistory,
                context: 'admin_assistant',
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errMsg = (errorData as Record<string, string>).error || `Backend error (${res.status})`;
            throw new Error(errMsg);
        }

        const data = await res.json() as { message?: string; response?: string };
        const responseText = data.message || data.response;
        if (!responseText) {
            throw new Error('Empty response from AI backend');
        }
        return responseText;
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown AI error';
        errorLogger.log({
            severity: 'medium',
            message: `AdminMimi AI call failed: ${msg}`,
            component: 'AdminMimi',
        });
        return `Bağlantı hatası: ${msg}\n\nBackend sunucusunun çalıştığından emin olun. Tekrar deneyin.`;
    }
}

function AdminMimi() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '**Admin Mimi Aktif!**\n\nMerhaba Admin! Ben sizin özel yardımcınızım.\n\n• Raporlar oluşturabilirim\n• Sistem durumunu kontrol edebilirim\n• Kullanıcı analizleri yapabilirim\n\nNasıl yardımcı olabilirim?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            // Build chat history for context
            const chatHistory = updatedMessages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .slice(-20) // Keep last 20 messages for context
                .map(m => ({ role: m.role, content: m.content }));

            const response = await fetchAdminAIResponse(chatHistory);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : 'Beklenmeyen bir hata oluştu';
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `**Hata:** ${errMsg}\n\nLütfen tekrar deneyin.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [inputValue, isTyping, messages]);

    const handleQuickAction = useCallback((prompt: string) => {
        setInputValue(prompt);
        // Focus the input ref directly instead of querying the DOM
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    }, []);

    const handleCopyMessage = useCallback((content: string) => {
        navigator.clipboard.writeText(content).catch(() => {
            // Fallback for browsers without clipboard API access
            const textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }, []);

    const clearChat = useCallback(() => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: '**Sohbet temizlendi.** Yeni bir konuşmaya başlayalım!\n\nNasıl yardımcı olabilirim?',
            timestamp: new Date()
        }]);
    }, []);

    if (!isOpen) {
        return (
            <button
                type="button"
                className="admin-mimi-fab"
                onClick={() => setIsOpen(true)}
                title="Admin Mimi'yi Aç"
            >
                <div className="admin-mimi-fab-icon">
                    <UnifiedMascot id="mimi_dragon" state="idle" size={40} />
                    <Shield size={14} className="admin-mimi-shield" />
                </div>
                <span className="admin-mimi-fab-badge">∞</span>
            </button>
        );
    }

    return (
        <div className={`admin-mimi-container ${isMinimized ? 'minimized' : ''}`}>
            {/* Header */}
            <div className="admin-mimi-header">
                <div className="admin-mimi-header-left">
                    <div className="admin-mimi-avatar">
                        <UnifiedMascot id="mimi_dragon" state="idle" size={36} />
                        <Shield size={12} className="admin-mimi-avatar-badge" />
                    </div>
                    <div className="admin-mimi-header-info">
                        <h3>Admin Mimi</h3>
                        <span className="admin-mimi-status">
                            <Sparkles size={12} /> Sınırsız Mod
                        </span>
                    </div>
                </div>
                <div className="admin-mimi-header-actions">
                    <button type="button" onClick={clearChat} title="Sohbeti Temizle">
                        <Trash2 size={16} />
                    </button>
                    <button type="button" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Genişlet' : 'Küçült'}>
                        <ChevronDown size={18} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    <button type="button" onClick={() => setIsOpen(false)} title="Kapat">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Quick Actions */}
                    <div className="admin-mimi-quick-actions">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                type="button"
                                className="quick-action-btn"
                                onClick={() => handleQuickAction(action.prompt)}
                            >
                                {action.icon}
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="admin-mimi-messages">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`admin-mimi-message ${message.role}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="message-avatar">
                                        <UnifiedMascot id="mimi_dragon" state="idle" size={32} />
                                    </div>
                                )}
                                <div className="message-content">
                                    <p className="message-text">
                                        {message.content.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                                                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                                )}
                                                {i < message.content.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </p>
                                    {message.role === 'assistant' && (
                                        <button
                                            type="button"
                                            className="message-copy-btn"
                                            onClick={() => handleCopyMessage(message.content)}
                                            title="Kopyala"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    )}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="admin-mimi-message assistant">
                                <div className="message-avatar">
                                    <UnifiedMascot id="mimi_dragon" state="thinking" size={32} />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="admin-mimi-input">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Rapor, analiz veya yardım isteyin..."
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="send-btn"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="admin-mimi-footer">
                        <Terminal size={12} />
                        <span>Admin Mode • Sınırsız Mesaj • Gelişmiş Analiz</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminMimi;
