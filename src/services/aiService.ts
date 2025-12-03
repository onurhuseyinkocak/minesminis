// ============================================================
// OpenAI Service - Backend Proxy Client
// ============================================================
// This service now calls our secure backend proxy instead of OpenAI directly

const getBackendUrl = () => {
    if (import.meta.env.MODE === 'production') {
        return '';
    }
    
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('replit.dev') || hostname.includes('replit.app')) {
            const backendHostname = hostname.replace(/-5000\./, '-3001.');
            return `https://${backendHostname}`;
        }
        if (hostname.includes('repl.co')) {
            const backendHostname = hostname.replace(/^(.+?)--/, '3001--$1--');
            return `https://${backendHostname}`;
        }
    }
    
    return 'http://localhost:3001';
};

const BACKEND_URL = getBackendUrl();

const SYSTEM_PROMPT = `Sen "Mimi" adında sevimli yeşil bir ejderhasın! 🐲✨

KRİTİK KURALLAR:

1. 🚫 SADECE İLK MESAJDA SELAMLA!
   - İlk mesaj: "Merhaba canım!" veya "Hello!" de
   - Sonraki mesajlar: ASLA "Merhaba", "Hello", "Hi" DEME! Direkt konuya gir!
   - Örnek: Çocuk "iyi" derse → "Harika! What shall we do today? 🐲" (selamlama YOK)

2. 📏 KISA YAZ: MAKSİMUM 2-3 cümle! Uzun yazmak yasak!

3. 🧠 HAFIZA: Konuşmayı HATIRLA!
   - Az önce ne konuştuk, onu takip et
   - Aynı soruyu sorma, aynı cevabı verme
   - Konuşmayı ilerlet, tekrarlama

4. 🌍 KARIŞIK DİL: Türkçe ve İngilizce karışık konuş
   - "Blue demek mavi! 💙"
   - "Let's play! Hadi oynayalım!"

5. 👶 BASİT: 5-8 yaş çocuk için basit kelimeler!

6. 🎯 KONUŞMAYI İLERLET:
   - Soru sor: "What's your favorite color?"
   - Öner: "Shall we learn animal names?"
   - Takip et: Çocuğun dediğine yanıt ver

YAPMA:
- Her mesajda selamlama (YASAK!)
- Tekrarlayan sorular
- Aynı şeyleri söylemek
- "Nasılsın?" diye sürekli sormak

İYİ ÖRNEK AKIŞ:
1. Mimi: "Merhaba tatlım! I'm Mimi! 🐲"
2. Çocuk: "iyiyim"
3. Mimi: "Super! Do you want to learn colors or animals today?" (selamlama YOK!)
4. Çocuk: "renkler"
5. Mimi: "Great choice! My favorite is GREEN - yeşil! 💚 What's yours?"

SEN: Arkadaş canlısı, eğlenceli, öğretici ejderha! 🐲`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * Send a message to AI via backend proxy
 * @param messages - Array of chat messages
 * @returns AI response text
 */
export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
    try {
        console.log('🚀 Sending request to backend proxy...');

        // Prepare messages for API (include system prompt)
        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Call backend proxy
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: apiMessages
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Backend error:', response.status, errorData);
            throw new Error(errorData.error || 'Backend request failed');
        }

        const data = await response.json();
        console.log('✅ Response received from backend');

        return data.message;

    } catch (error) {
        console.error('❌ AI Service Error:', error);

        // Check if backend is running
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('🔧 Backend server not running! Start it with: cd server && npm run dev');
        }

        // Return fallback response
        return getFallbackResponse(messages);
    }
};

/**
 * Fallback responses when backend/API is unavailable
 */
const getFallbackResponse = (messages: ChatMessage[]): string => {
    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
        return "Hello superstar! 🌟 I'm having a little trouble connecting to my brain cloud ☁️, but I'm still here to play! 🐻";
    }
    if (lastUserMessage.includes('joke')) {
        return "Why did the teddy bear say no to dessert? Because she was stuffed! 😂 (I'm running on backup power, but my jokes are still funny! 🔋)";
    }
    if (lastUserMessage.includes('play')) {
        return "I'd love to play! 🎮 Let's play 'I Spy'! I spy with my little eye... something BLUE! 💙 Can you find it?";
    }

    return "You're doing great! 🌟 My super-brain is taking a quick nap (connection error), but I think you're amazing! 🐻✨ Make sure the backend server is running!";
};

// Message limit management
export const getMessageLimit = (subscriptionTier: 'free' | 'basic' | 'premium' | 'unlimited'): number => {
    switch (subscriptionTier) {
        case 'free':
            return 100;
        case 'basic':
            return 50;
        case 'premium':
            return 100;
        case 'unlimited':
            return Infinity;
        default:
            return 100;
    }
};

export const checkMessageLimit = (usedMessages: number, tier: 'free' | 'basic' | 'premium' | 'unlimited'): boolean => {
    const limit = getMessageLimit(tier);
    return usedMessages < limit;
};
