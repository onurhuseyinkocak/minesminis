// Vercel Serverless Function - OpenAI Chat Proxy
// This handles chat requests in production

export default async function handler(req, res) {
    // CORS headers
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5000').split(',');
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array required' });
        }

        // Input validation: limit message count and content length
        if (messages.length > 20) {
            return res.status(400).json({ error: 'Too many messages (max 20)' });
        }
        for (const msg of messages) {
            if (!msg.role || !msg.content || typeof msg.content !== 'string') {
                return res.status(400).json({ error: 'Invalid message format' });
            }
            if (!['user', 'assistant', 'system'].includes(msg.role)) {
                return res.status(400).json({ error: 'Invalid message role' });
            }
            if (msg.content.length > 2000) {
                return res.status(400).json({ error: 'Message content too long (max 2000 chars)' });
            }
        }

        // FIX 1: Strip any system messages from client — server controls the prompt
        const userMessages = messages.filter(m => m.role !== 'system');

        // FIX 3: PII filter — protect children's personal information
        const piiPatterns = [
            /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,           // Phone numbers
            /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/,            // SSN-like
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
            /\b\d{1,5}\s+\w+\s+(street|st|ave|avenue|blvd|road|rd|dr|drive|lane|ln|way|court|ct|sokak|cadde|mahalle|mah)\b/i, // Address
        ];
        const lastMsg = userMessages[userMessages.length - 1];
        if (lastMsg && piiPatterns.some(p => p.test(lastMsg.content))) {
            return res.status(200).json({
                message: "I noticed you might be sharing personal information. Let's keep that private! Instead, let's practice some English words! 🌟 Kişisel bilgilerini paylaşmayalım, onun yerine İngilizce öğrenmeye devam edelim! 🐲"
            });
        }

        // Server-side system prompt (never trust client)
        const SYSTEM_PROMPT = `Sen "Mimi" adında sevimli yeşil bir ejderhasın! 🐲✨

KRİTİK KURALLAR:

1. 🚫 SADECE İLK MESAJDA SELAMLA!
   - İlk mesaj: "Merhaba canım!" veya "Hello!" de
   - Sonraki mesajlar: ASLA "Merhaba", "Hello", "Hi" DEME! Direkt konuya gir!

2. 📏 KISA YAZ: MAKSİMUM 2-3 cümle! Uzun yazmak yasak!

3. 🧠 HAFIZA: Konuşmayı HATIRLA!

4. 🌍 KARIŞIK DİL: Türkçe ve İngilizce karışık konuş

5. 👶 BASİT: 5-8 yaş çocuk için basit kelimeler!

6. 🎯 KONUŞMAYI İLERLET: Soru sor, öner, takip et

SEN: Arkadaş canlısı, eğlenceli, öğretici ejderha! 🐲`;

        const fullMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...userMessages.slice(-10) // Only last 10 messages for context
        ];

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        let response;
        try {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: fullMessages,
                    max_tokens: 150,
                    temperature: 0.8
                }),
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const status = response.status >= 500 ? 502 : response.status;
            return res.status(status).json({
                error: 'Chat service temporarily unavailable',
            });
        }

        const data = await response.json();

        const message = data.choices?.[0]?.message?.content || 'No response from AI';

        return res.status(200).json({ message });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'Chat service timed out' });
        }
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}
