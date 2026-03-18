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

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY not found in environment');
            return res.status(500).json({ error: 'API key not configured' });
        }

        console.log('🚀 Sending request to OpenAI API...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 150,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ OpenAI API Error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'OpenAI API Error',
                details: errorData.error?.message || 'Unknown error'
            });
        }

        const data = await response.json();
        console.log('✅ OpenAI response received');

        const message = data.choices?.[0]?.message?.content || 'No response from AI';

        return res.status(200).json({ message });

    } catch (error) {
        console.error('❌ Server Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
