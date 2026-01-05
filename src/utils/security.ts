/**
 * FRONTEND SECURITY UTILITIES
 * Client-side security measures for MinesMinis
 * 
 * Features:
 * - Input Sanitization (XSS Prevention)
 * - CSRF Token Management
 * - Secure Storage
 * - Rate Limiting (client-side)
 * - Security Event Logging
 */

// ============================================================
// INPUT SANITIZATION
// ============================================================

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Escape HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Remove null bytes
        .replace(/\0/g, '')
        // Trim whitespace
        .trim();
}

/**
 * Sanitize HTML content (for rich text that needs some HTML)
 */
export function sanitizeHTML(html: string, allowedTags: string[] = ['b', 'i', 'u', 'strong', 'em']): string {
    if (typeof html !== 'string') return '';

    // Create a whitelist regex
    const tagPattern = allowedTags.map(tag => `<\/?${tag}>`).join('|');
    const allowedRegex = new RegExp(tagPattern, 'gi');

    // Remove all tags except allowed ones
    return html.replace(/<[^>]*>/g, (match) => {
        return allowedRegex.test(match) ? match : '';
    });
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
    if (typeof email !== 'string') return null;

    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string | null {
    if (typeof url !== 'string') return null;

    try {
        const parsed = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }

        return parsed.href;
    } catch {
        return null;
    }
}

// ============================================================
// SECURE STORAGE
// ============================================================

const STORAGE_PREFIX = 'mm_';
const ENCRYPTION_KEY = 'minesminis_secure_2024';

/**
 * Obfuscate data for storage (not true encryption, but prevents casual reading)
 */
function obfuscate(data: string): string {
    return btoa(encodeURIComponent(data));
}

/**
 * Deobfuscate data from storage
 */
function deobfuscate(data: string): string {
    try {
        return decodeURIComponent(atob(data));
    } catch {
        return '';
    }
}

/**
 * Securely store data in localStorage
 */
export function secureStore(key: string, value: unknown): void {
    try {
        const data = JSON.stringify({
            value,
            timestamp: Date.now(),
        });
        localStorage.setItem(STORAGE_PREFIX + key, obfuscate(data));
    } catch (error) {
        console.error('Secure storage error:', error);
    }
}

/**
 * Securely retrieve data from localStorage
 */
export function secureRetrieve<T>(key: string, maxAge?: number): T | null {
    try {
        const stored = localStorage.getItem(STORAGE_PREFIX + key);
        if (!stored) return null;

        const data = JSON.parse(deobfuscate(stored));

        // Check expiry if maxAge provided
        if (maxAge && Date.now() - data.timestamp > maxAge) {
            localStorage.removeItem(STORAGE_PREFIX + key);
            return null;
        }

        return data.value as T;
    } catch (error) {
        console.error('Secure retrieval error:', error);
        return null;
    }
}

/**
 * Securely remove data from localStorage
 */
export function secureRemove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Clear all secure storage
 */
export function secureClear(): void {
    Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
}

// ============================================================
// CSRF PROTECTION
// ============================================================

let csrfToken: string | null = null;

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    secureStore('csrf', csrfToken);
    return csrfToken;
}

/**
 * Get current CSRF token
 */
export function getCSRFToken(): string {
    if (!csrfToken) {
        csrfToken = secureRetrieve<string>('csrf') || generateCSRFToken();
    }
    return csrfToken;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
    return token === getCSRFToken();
}

// ============================================================
// CLIENT-SIDE RATE LIMITING
// ============================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if action is rate limited
 */
export function isRateLimited(action: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(action);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(action, { count: 1, resetTime: now + windowMs });
        return false;
    }

    entry.count++;

    if (entry.count > maxRequests) {
        console.warn(`Rate limit exceeded for action: ${action}`);
        return true;
    }

    return false;
}

/**
 * Reset rate limit for an action
 */
export function resetRateLimit(action: string): void {
    rateLimitStore.delete(action);
}

// ============================================================
// INPUT VALIDATION
// ============================================================

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    url?: boolean;
    custom?: (value: string) => boolean;
    message?: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate input against rules
 */
export function validateInput(value: string, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];

    if (rules.required && (!value || value.trim() === '')) {
        errors.push(rules.message || 'This field is required');
        return { valid: false, errors };
    }

    if (!value) return { valid: true, errors };

    if (rules.minLength && value.length < rules.minLength) {
        errors.push(rules.message || `Must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(rules.message || `Must be at most ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message || 'Invalid format');
    }

    if (rules.email && !sanitizeEmail(value)) {
        errors.push(rules.message || 'Invalid email address');
    }

    if (rules.url && !sanitizeURL(value)) {
        errors.push(rules.message || 'Invalid URL');
    }

    if (rules.custom && !rules.custom(value)) {
        errors.push(rules.message || 'Validation failed');
    }

    return { valid: errors.length === 0, errors };
}

// ============================================================
// SECURITY EVENT LOGGING
// ============================================================

export interface SecurityEvent {
    type: string;
    timestamp: number;
    details?: Record<string, unknown>;
}

const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 100;

/**
 * Log a security event
 */
export function logSecurityEvent(type: string, details?: Record<string, unknown>): void {
    const event: SecurityEvent = {
        type,
        timestamp: Date.now(),
        details,
    };

    securityEvents.push(event);

    // Keep only recent events
    if (securityEvents.length > MAX_EVENTS) {
        securityEvents.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
        console.log('🔐 Security Event:', event);
    }
}

/**
 * Get recent security events
 */
export function getSecurityEvents(): SecurityEvent[] {
    return [...securityEvents];
}

// ============================================================
// CONTENT SECURITY
// ============================================================

/**
 * Check if content contains potentially dangerous patterns
 */
export function detectMaliciousContent(content: string): boolean {
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onclick, onerror, etc.
        /data:\s*text\/html/gi,
        /eval\s*\(/gi,
        /document\.(cookie|write|location)/gi,
        /window\.(location|open)/gi,
        /innerHTML\s*=/gi,
    ];

    return dangerousPatterns.some(pattern => pattern.test(content));
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.{2,}/g, '.')
        .substring(0, 255);
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type.toLowerCase();

    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return extension === type.slice(1);
        }
        if (type.endsWith('/*')) {
            return mimeType.startsWith(type.slice(0, -1));
        }
        return mimeType === type;
    });
}

// ============================================================
// DEVICE FINGERPRINTING (Basic)
// ============================================================

/**
 * Generate a basic device fingerprint
 */
export function generateDeviceFingerprint(): string {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown',
        navigator.platform,
    ];

    const fingerprint = components.join('|');

    // Simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16);
}

// ============================================================
// EXPORT ALL
// ============================================================

export default {
    // Sanitization
    sanitizeInput,
    sanitizeHTML,
    sanitizeEmail,
    sanitizeURL,
    sanitizeFileName,

    // Storage
    secureStore,
    secureRetrieve,
    secureRemove,
    secureClear,

    // CSRF
    generateCSRFToken,
    getCSRFToken,
    validateCSRFToken,

    // Rate Limiting
    isRateLimited,
    resetRateLimit,

    // Validation
    validateInput,
    validateFileType,

    // Security Events
    logSecurityEvent,
    getSecurityEvents,

    // Content Security
    detectMaliciousContent,

    // Device
    generateDeviceFingerprint,
};
