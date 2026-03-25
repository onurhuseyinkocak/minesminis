// Vercel Serverless Function - OpenAI Text-to-Speech Proxy
// This handles TTS requests in production

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

    // FIX 4: Require authentication for TTS endpoint
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const { text, voice = 'nova' } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (text.length > 4000) {
            return res.status(400).json({ error: 'Text too long (max 4000 chars)' });
        }

        // Validate voice parameter
        const validVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer'];
        const safeVoice = validVoices.includes(voice) ? voice : 'nova';

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        let response;
        try {
            response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text.slice(0, 4000),
                    voice: safeVoice,
                    response_format: 'mp3'
                }),
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            const status = response.status >= 500 ? 502 : response.status;
            return res.status(status).json({
                error: 'TTS service temporarily unavailable',
            });
        }

        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return res.status(200).json({
            audio: base64Audio,
            format: 'mp3'
        });

    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'TTS service timed out' });
        }
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}
