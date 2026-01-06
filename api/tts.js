// Vercel Serverless Function - OpenAI Text-to-Speech Proxy
// This handles TTS requests in production

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, voice = 'nova' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY not found in environment');
            return res.status(500).json({ error: 'API key not configured' });
        }

        console.log('🔊 Generating TTS audio...');

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text.slice(0, 4000), // Max 4000 chars
                voice: voice,
                response_format: 'mp3'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ OpenAI TTS Error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'OpenAI TTS Error',
                details: errorData.error?.message || 'Unknown error'
            });
        }

        // Get audio buffer and convert to base64
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        console.log('✅ TTS audio generated');

        return res.status(200).json({
            audio: base64Audio,
            format: 'mp3'
        });

    } catch (error) {
        console.error('❌ TTS Server Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
