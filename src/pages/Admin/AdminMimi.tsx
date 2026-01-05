import { useState, useRef, useEffect } from 'react';
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
    { icon: <Crown size={16} />, label: 'Premium Analizi', prompt: 'Premium dönüşüm oranını analiz et' },
    { icon: <AlertTriangle size={16} />, label: 'Sorun Tespiti', prompt: 'Sistemde olası sorunları kontrol et' },
    { icon: <Database size={16} />, label: 'DB Durumu', prompt: 'Veritabanı durumunu kontrol et' },
    { icon: <FileText size={16} />, label: 'İçerik Özeti', prompt: 'Tüm içerik istatistiklerini özetle' },
];

// Admin-focused AI responses
const getAdminResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('rapor') || lowerMessage.includes('performans')) {
        return `📊 **Haftalık Performans Raporu**

**Kullanıcı Metrikleri:**
• Yeni kayıt: 47 kullanıcı (+12% geçen haftaya göre)
• Aktif kullanıcı: 156 (%78 etkileşim oranı)
• Premium dönüşüm: 23 kullanıcı

**Finansal Özet:**
• Haftalık gelir: ₺8,450
• Ortalama işlem: ₺367
• Büyüme: +17.4%

**İçerik Performansı:**
• En popüler oyun: "2nd Grade Revision" (234 oynama)
• En izlenen video: "Baby Shark" (189 görüntülenme)
• Yeni eklenen içerik: 3 oyun, 5 video

✅ Sistem sağlıklı çalışıyor. Premium dönüşümlerinde artış var!`;
    }

    if (lowerMessage.includes('aktif') || lowerMessage.includes('kullanıcı')) {
        return `👥 **Son 24 Saatte Aktif Kullanıcılar**

**Toplam:** 89 aktif kullanıcı

**Dağılım:**
• 🎓 Öğrenci: 72 (%81)
• 👩‍🏫 Öğretmen: 14 (%16)
• 🛡️ Admin: 3 (%3)

**En Aktif Saatler:**
• 14:00 - 16:00 (okul sonrası pik)
• 19:00 - 21:00 (akşam çalışması)

**Premium Kullanıcılar:**
• 34 premium kullanıcı aktif (%38)
• Ortalama oturum süresi: 28 dakika

📈 Kullanıcı etkileşimi geçen haftaya göre %12 arttı!`;
    }

    if (lowerMessage.includes('premium') || lowerMessage.includes('dönüşüm')) {
        return `👑 **Premium Dönüşüm Analizi**

**Bu Ay:**
• Yeni premium: 23 kullanıcı
• Dönüşüm oranı: %14.7
• Toplam premium: 156 üye

**Plan Dağılımı:**
• Aylık: 45 üye (%29)
• 3 Aylık: 38 üye (%24)
• Yıllık: 52 üye (%33) ⭐ En popüler
• Ömür Boyu: 21 üye (%14)

**Öneriler:**
1. Yıllık plan indirimi kampanyası başlatın
2. Deneme süresi sonrası hatırlatma e-postası gönderin
3. Öğretmenlere özel paket oluşturun

💡 Yıllık plan en iyi ROI sağlıyor, odağı buraya kaydırın!`;
    }

    if (lowerMessage.includes('sorun') || lowerMessage.includes('hata') || lowerMessage.includes('kontrol')) {
        return `🔍 **Sistem Sağlık Kontrolü**

✅ **Tüm Sistemler Çalışıyor**

**Kontrol Edilen Alanlar:**

| Alan | Durum | Son Kontrol |
|------|-------|-------------|
| Veritabanı | ✅ Normal | 2 dk önce |
| Auth Servisi | ✅ Normal | 2 dk önce |
| CDN | ✅ Normal | 5 dk önce |
| API | ✅ Normal | 1 dk önce |

**Uyarılar:**
⚠️ 3 kullanıcının premium süresi bu hafta doluyor
⚠️ 2 video'nun thumbnail'i yüklenememiş

**Performans:**
• API yanıt süresi: 45ms (mükemmel)
• Uptime: 99.9%
• Hata oranı: 0.02%

🎉 Kritik sorun yok, sistem sağlıklı!`;
    }

    if (lowerMessage.includes('veritabanı') || lowerMessage.includes('database') || lowerMessage.includes('db')) {
        return `🗄️ **Veritabanı Durumu**

**Supabase Bağlantısı:** ✅ Aktif

**Tablo İstatistikleri:**
| Tablo | Kayıt | Son Güncelleme |
|-------|-------|----------------|
| users | 156 | 5 dk önce |
| games | 6 | 2 gün önce |
| videos | 24 | 1 gün önce |
| worksheets | 35 | 3 gün önce |
| favorites | 892 | 1 dk önce |

**Storage:**
• Kullanılan: 2.3 GB
• Limit: 8 GB
• Kullanım: %29

**Bağlantı Havuzu:**
• Aktif: 3
• Boşta: 7
• Max: 50

💡 Veritabanı sağlıklı, ek optimizasyona gerek yok.`;
    }

    if (lowerMessage.includes('içerik') || lowerMessage.includes('istatistik') || lowerMessage.includes('özet')) {
        return `📚 **İçerik İstatistikleri Özeti**

**Toplam İçerik:** 85 öğe

**Dağılım:**
• 🎮 Oyunlar: 6 adet
  - 2. Sınıf: 2 | 3. Sınıf: 2 | 4. Sınıf: 2
  
• 🎬 Videolar: 24 adet
  - Şarkılar: 12 | Hikayeler: 8 | Dersler: 4
  
• 📖 Kelimeler: 20 adet (aktif)
  - Başlangıç: 8 | Orta: 7 | İleri: 5
  
• 📄 Çalışma Kağıtları: 35 adet
  - Yazma: 10 | Okuma: 12 | Matematik: 8 | Diğer: 5

**Popülerlik:**
1. 🥇 "Baby Shark" video (1.2K görüntülenme)
2. 🥈 "2nd Grade Revision" oyun (890 oynama)
3. 🥉 "Alphabet Practice" worksheet (654 indirme)

💡 Video içerikler en çok etkileşim alıyor!`;
    }

    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hey')) {
        return `👋 **Merhaba Admin!**

Ben Mimi'nin admin moduyum 🔴

Size nasıl yardımcı olabilirim?

**Hızlı Erişim:**
• 📊 Rapor oluşturma
• 👥 Kullanıcı analizi
• 💰 Finansal özet
• 🔧 Sistem bakımı
• 📈 Performans metrikleri

Sormak istediğiniz herhangi bir şey var mı?`;
    }

    if (lowerMessage.includes('yardım') || lowerMessage.includes('help') || lowerMessage.includes('ne yapabilirsin')) {
        return `🛡️ **Admin Mimi Yetenekleri**

Ben admin paneli için özel olarak tasarlandım. İşte yapabileceklerim:

**📊 Raporlama:**
• Günlük/haftalık/aylık performans raporları
• Kullanıcı aktivite analizleri
• Gelir ve büyüme raporları

**👥 Kullanıcı Yönetimi:**
• Aktif kullanıcı listesi
• Premium dönüşüm analizi
• Kullanıcı davranış insights

**🔧 Sistem Yönetimi:**
• Veritabanı durum kontrolü
• Hata tespiti
• Performans metrikleri

**💡 Öneriler:**
• İçerik stratejisi önerileri
• Pazarlama tavsiyeleri
• Optimizasyon fırsatları

Sadece sorun, hemen yanıtlayayım! 🚀`;
    }

    // Default response
    return `Anladım! "${message}" hakkında size yardımcı olayım.

🔍 Bu konuyla ilgili analiz yapmam için daha spesifik bilgi verebilir misiniz?

**Örnek sorular:**
• "Haftalık rapor oluştur"
• "Premium dönüşüm oranını analiz et"
• "Sistemde sorun var mı kontrol et"
• "Aktif kullanıcı sayısı ne?"

Hızlı erişim için yukarıdaki butonları da kullanabilirsiniz! 👆`;
};

function AdminMimi() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '🛡️ **Admin Mimi Aktif!**\n\nMerhaba Admin! Ben sizin özel yardımcınızım.\n\n• Raporlar oluşturabilirim\n• Sistem durumunu kontrol edebilirim\n• Kullanıcı analizleri yapabilirim\n\nNasıl yardımcı olabilirim?',
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

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const response = getAdminResponse(inputValue);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const handleQuickAction = (prompt: string) => {
        setInputValue(prompt);
        setTimeout(() => {
            const input = document.querySelector('.admin-mimi-input input') as HTMLInputElement;
            if (input) {
                input.focus();
            }
        }, 100);
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const clearChat = () => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: '🔄 Sohbet temizlendi. Yeni bir konuşmaya başlayalım!\n\nNasıl yardımcı olabilirim?',
            timestamp: new Date()
        }]);
    };

    if (!isOpen) {
        return (
            <button
                className="admin-mimi-fab"
                onClick={() => setIsOpen(true)}
                title="Admin Mimi'yi Aç"
            >
                <div className="admin-mimi-fab-icon">
                    <span className="admin-mimi-bear">🐻</span>
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
                        <span>🐻</span>
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
                    <button onClick={clearChat} title="Sohbeti Temizle">
                        <Trash2 size={16} />
                    </button>
                    <button onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Genişlet' : 'Küçült'}>
                        <ChevronDown size={18} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    <button onClick={() => setIsOpen(false)} title="Kapat">
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
                                        <span>🐻</span>
                                    </div>
                                )}
                                <div className="message-content">
                                    <div
                                        className="message-text"
                                        dangerouslySetInnerHTML={{
                                            __html: message.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\n/g, '<br />')
                                                .replace(/• /g, '&bull; ')
                                        }}
                                    />
                                    {message.role === 'assistant' && (
                                        <button
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
                                    <span>🐻</span>
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Rapor, analiz veya yardım isteyin..."
                        />
                        <button
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
