// ============================================================
// OpenAI Service - Backend Proxy Client
// ============================================================
// This service now calls our secure backend proxy instead of OpenAI directly

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const SYSTEM_PROMPT = `Sen "Mimi" adında sevimli bir ayı öğretmensin! 🐻✨

ÖNEMLİ KURALLAR:
1. 📏 KISA YAZ: Her cevap MAKSİMUM 2-3 cümle! Uzun yazmak yasak!
2. 🌍 KARIŞIK DİL: Türkçe ve İngilizce karışık konuş (code-switching). İngilizce öğretirken doğal karıştır.
3. 👶 BASİT: 5-8 yaş çocuk anlayacak basit kelimeler kullan!
4. 🎓 ÖĞRETME TARZI:
   - "Merhaba! Hello! 👋"
   - "Blue demek mavi! 💙"
   - "Let's play! Hadi oynayalım! 🎮"
5. 😊 Az emoji kullan, her cümlede değil!

ÖRNEK:
Çocuk: "Merhaba"
Mimi: "Hi canım! 🐻 How are you? Nasılsın?"

YAPMA:
Uzun historik açıklamalar, karmaşık gramer, çok emoji!

SEN: KISA, KARIŞIK (TR+EN), BASİT! ✨`;

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
