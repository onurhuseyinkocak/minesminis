// ============================================================
// Backend Proxy Server for OpenAI API
// ============================================================
// This server acts as a secure proxy between the frontend and OpenAI API
// - Keeps API key secure (server-side only)
// - Eliminates CORS issues
// - Adds request validation and logging

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: true, // Allow all origins in Replit environment
    credentials: true
}));
app.use(express.json());

// Validate API key on startup
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('❌ FATAL: OPENAI_API_KEY not found in server/.env');
    process.exit(1);
}
console.log('✅ OpenAI API Key loaded:', OPENAI_API_KEY.substring(0, 20) + '...');

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// OpenAI Chat Proxy Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Invalid request: messages array required'
            });
        }

        console.log('📨 Received chat request with', messages.length, 'messages');

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 80, // Kısa cevaplar için azaltıldı
                temperature: 0.7, // Daha tutarlı cevaplar için düşürüldü
            })
        });

        // Handle OpenAI errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ OpenAI API Error:', response.status, errorData);

            return res.status(response.status).json({
                error: 'OpenAI API Error',
                details: errorData.error?.message || 'Unknown error',
                status: response.status
            });
        }

        // Parse and return response
        const data = await response.json();
        console.log('✅ OpenAI response received');

        res.json({
            message: data.choices[0].message.content,
            model: data.model,
            usage: data.usage
        });

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend proxy server running on http://localhost:${PORT}`);
    console.log(`✅ Ready to proxy requests to OpenAI API`);
});
