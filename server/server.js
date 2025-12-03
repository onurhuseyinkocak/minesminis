// ============================================================
// Backend Proxy Server for OpenAI API
// ============================================================
// This server acts as a secure proxy between the frontend and OpenAI API
// - Keeps API key secure (server-side only)
// - Eliminates CORS issues
// - Adds request validation and logging
// - In production, serves the built frontend static files

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? 5000 : 3001);

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

// OpenAI Text-to-Speech Endpoint for child-friendly voice
app.post('/api/tts', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid request: text string required'
            });
        }

        console.log('🔊 TTS request:', text.substring(0, 50) + '...');

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: 'nova', // Nova is friendly and child-appropriate
                response_format: 'mp3',
                speed: 0.95 // Slightly slower for children
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

        // Stream the audio back
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        
        console.log('✅ TTS audio generated successfully');
        
        res.json({
            audio: base64Audio,
            format: 'mp3'
        });

    } catch (error) {
        console.error('❌ TTS Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
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
                max_tokens: 150,
                temperature: 0.6,
                frequency_penalty: 0.3,
                presence_penalty: 0.2
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

// In production, serve the built frontend static files
if (isProduction) {
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Serve static files from the dist folder
    app.use(express.static(distPath));
    
    // Handle SPA routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
    
    console.log('📁 Serving static files from:', distPath);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`✅ Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`✅ Ready to proxy requests to OpenAI API`);
});
