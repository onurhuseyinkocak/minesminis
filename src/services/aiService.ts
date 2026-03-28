// ============================================================
// OpenAI Service - Backend Proxy Client
// ============================================================
// This service now calls our secure backend proxy instead of OpenAI directly

import { auth } from '../config/firebase';
import { errorLogger } from './errorLogger';

const getBackendUrl = () => {
    // Check if running in browser
    if (typeof window === 'undefined') {
        return 'http://localhost:3001';
    }

    const hostname = window.location.hostname;

    // LOCALHOST / LOCAL DEVELOPMENT - Always use localhost:3001
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:3001';

    // PRODUCTION (Vercel) - Use same origin API routes
    if (hostname.includes('vercel.app') || hostname.includes('minesminis')) return '';

    // Manual override from env
    if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;

    return 'http://localhost:3001';
};

const BACKEND_URL = getBackendUrl();

// SECURITY: System prompt is now server-side ONLY (server/server.js & api/chat.js).
// The client must NOT send a system prompt — the server ignores any system messages from the client.

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
        // Send only user/assistant messages — system prompt is server-side only
        const apiMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Call backend proxy
        const token = await auth.currentUser?.getIdToken().catch(() => null);
        const csrfToken = typeof document !== 'undefined'
            ? document.cookie.match(/csrf_token=([^;]+)/)?.[1] || ''
            : '';
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
            },
            body: JSON.stringify({
                messages: apiMessages
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            errorLogger.log({
                severity: 'high',
                message: `Backend error: ${response.status} ${errorData.error || 'Backend request failed'}`,
                component: 'aiService',
                metadata: { status: response.status, errorData },
            });
            throw new Error(errorData.error || 'Backend request failed');
        }

        const data = await response.json();
        return data.message;

    } catch (error) {
        errorLogger.log({ severity: 'medium', message: `AI Service: ${error instanceof Error ? error.message : String(error)}`, component: 'aiService' });
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
            return 50;
        case 'basic':
            return 150;
        case 'premium':
            return 500;
        case 'unlimited':
            return Infinity;
        default:
            return 50;
    }
};

export const checkMessageLimit = (usedMessages: number, tier: 'free' | 'basic' | 'premium' | 'unlimited'): boolean => {
    const limit = getMessageLimit(tier);
    return usedMessages < limit;
};
