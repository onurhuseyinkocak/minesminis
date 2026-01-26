/**
 * ENTERPRISE SECURITY MIDDLEWARE
 * Zero-Trust Architecture Implementation
 * 
 * Features:
 * - Rate Limiting (per-IP and per-user)
 * - Security Headers (OWASP compliant)
 * - Input Sanitization
 * - Request Validation
 * - IP Blocking
 * - Brute Force Protection
 */

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();
const blockedIPs = new Set();
const loginAttempts = new Map();

// Security configuration
const SECURITY_CONFIG = {
    // Rate limiting
    rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100, // requests per window
        maxAuthRequests: 5, // auth requests per window
    },

    // Brute force protection
    bruteForce: {
        maxAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        progressiveDelay: true,
    },

    // IP blocking
    blockedPatterns: [
        /^192\.0\.2\./, // TEST-NET-1
        /^198\.51\.100\./, // TEST-NET-2
        /^203\.0\.113\./, // TEST-NET-3
    ],

    // Allowed origins (CORS)
    allowedOrigins: [
        'http://localhost:5000',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
};

/**
 * Get client IP address
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown';
}

/**
 * Rate Limiter Middleware
 */
export function rateLimiter(options = {}) {
    const { maxRequests = 100, windowMs = 60000, keyGenerator } = options;

    return (req, res, next) => {
        const key = keyGenerator ? keyGenerator(req) : getClientIP(req);
        const now = Date.now();

        // Get or create rate limit entry
        let entry = rateLimitStore.get(key);
        if (!entry || now - entry.windowStart > windowMs) {
            entry = { count: 0, windowStart: now };
            rateLimitStore.set(key, entry);
        }

        entry.count++;

        // Set rate limit headers
        res.set({
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
            'X-RateLimit-Reset': new Date(entry.windowStart + windowMs).toISOString(),
        });

        if (entry.count > maxRequests) {
            console.warn(`⚠️ Rate limit exceeded for ${key}`);
            return res.status(429).json({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.ceil((entry.windowStart + windowMs - now) / 1000),
            });
        }

        next();
    };
}

/**
 * Security Headers Middleware (OWASP Compliant)
 */
export function securityHeaders(req, res, next) {
    // Strict Transport Security (HSTS)
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // Content Security Policy
    res.setHeader('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com wss://*.supabase.co",
        "frame-src 'self' https://js.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ].join('; '));

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy
    res.setHeader('Permissions-Policy', [
        'accelerometer=()',
        'camera=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'payment=(self)',
        'usb=()',
    ].join(', '));

    // Remove fingerprinting headers
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    // Cache control for sensitive data
    if (req.path.includes('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    next();
}

/**
 * IP Blocker Middleware
 */
export function ipBlocker(req, res, next) {
    const ip = getClientIP(req);

    // Check if IP is blocked
    if (blockedIPs.has(ip)) {
        console.warn(`🚫 Blocked request from ${ip}`);
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Your IP address has been blocked.',
        });
    }

    // Check against blocked patterns
    for (const pattern of SECURITY_CONFIG.blockedPatterns) {
        if (pattern.test(ip)) {
            console.warn(`🚫 Blocked request from suspicious IP: ${ip}`);
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied.',
            });
        }
    }

    next();
}

/**
 * Brute Force Protection for Authentication
 */
export function bruteForceProtection(req, res, next) {
    const ip = getClientIP(req);
    const now = Date.now();

    let attempts = loginAttempts.get(ip);

    if (attempts) {
        // Check if lockout is still active
        if (attempts.lockedUntil && attempts.lockedUntil > now) {
            const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000);
            console.warn(`🔒 Login attempt during lockout from ${ip}`);
            return res.status(429).json({
                error: 'Too Many Attempts',
                message: `Account temporarily locked. Try again in ${remainingTime} seconds.`,
                retryAfter: remainingTime,
            });
        }

        // Reset if lockout expired
        if (attempts.lockedUntil && attempts.lockedUntil <= now) {
            attempts = { count: 0, lastAttempt: now };
            loginAttempts.set(ip, attempts);
        }
    } else {
        attempts = { count: 0, lastAttempt: now };
        loginAttempts.set(ip, attempts);
    }

    // Store original json function
    const originalJson = res.json.bind(res);

    res.json = function (data) {
        // Check if login failed
        if (res.statusCode >= 400 && res.statusCode < 500) {
            attempts.count++;
            attempts.lastAttempt = Date.now();

            if (attempts.count >= SECURITY_CONFIG.bruteForce.maxAttempts) {
                attempts.lockedUntil = Date.now() + SECURITY_CONFIG.bruteForce.lockoutDuration;
                console.warn(`🔒 Account locked for IP ${ip} after ${attempts.count} failed attempts`);
                blockedIPs.add(ip); // Temporarily block
                setTimeout(() => blockedIPs.delete(ip), SECURITY_CONFIG.bruteForce.lockoutDuration);
            }
        } else if (res.statusCode >= 200 && res.statusCode < 300) {
            // Reset on successful login
            loginAttempts.delete(ip);
        }

        return originalJson(data);
    };

    next();
}

/**
 * Input Sanitizer - Prevents XSS and SQL Injection
 */
export function sanitizeInput(input) {
    if (typeof input === 'string') {
        return input
            // Remove HTML tags
            .replace(/<[^>]*>/g, '')
            // Escape special characters
            .replace(/[&<>"']/g, (char) => {
                const escapeMap = {
                    '&': '&amp;',
                    '<': '<',
                    '>': '>',
                    '"': '&quot;',
                    "'": '&#x27;',
                };
                return escapeMap[char];
            })
            // Remove null bytes
            .replace(/\0/g, '')
            // Limit length
            .slice(0, 10000);
    }

    if (Array.isArray(input)) {
        return input.map(sanitizeInput);
    }

    if (input && typeof input === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[sanitizeInput(key)] = sanitizeInput(value);
        }
        return sanitized;
    }

    return input;
}

/**
 * Request Validator Middleware
 */
export function validateRequest(schema) {
    return (req, res, next) => {
        try {
            // Sanitize all inputs
            if (req.body) req.body = sanitizeInput(req.body);
            if (req.query) req.query = sanitizeInput(req.query);
            if (req.params) req.params = sanitizeInput(req.params);

            // Validate against schema if provided
            if (schema) {
                const { body, query, params } = schema;

                if (body) {
                    const validation = validateSchema(req.body, body);
                    if (!validation.valid) {
                        return res.status(400).json({
                            error: 'Validation Error',
                            details: validation.errors,
                        });
                    }
                }

                if (query) {
                    const validation = validateSchema(req.query, query);
                    if (!validation.valid) {
                        return res.status(400).json({
                            error: 'Validation Error',
                            details: validation.errors,
                        });
                    }
                }

                if (params) {
                    const validation = validateSchema(req.params, params);
                    if (!validation.valid) {
                        return res.status(400).json({
                            error: 'Validation Error',
                            details: validation.errors,
                        });
                    }
                }
            }

            next();
        } catch (error) {
            console.error('Validation error:', error);
            return res.status(400).json({
                error: 'Invalid Request',
                message: 'Request validation failed.',
            });
        }
    };
}

/**
 * Simple Schema Validator
 */
function validateSchema(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];

        // Required check
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push({ field, message: `${field} is required` });
            continue;
        }

        if (value === undefined || value === null) continue;

        // Type check
        if (rules.type && typeof value !== rules.type) {
            errors.push({ field, message: `${field} must be a ${rules.type}` });
        }

        // Email validation
        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push({ field, message: `${field} must be a valid email` });
        }

        // Min length
        if (rules.minLength && value.length < rules.minLength) {
            errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }

        // Max length
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
        }

        // Pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push({ field, message: `${field} format is invalid` });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Audit Logger
 */
export function auditLog(action, req, details = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        userId: req.user?.id || 'anonymous',
        ...details,
    };

    // In production, send to centralized logging service
    console.log('🔐 AUDIT:', JSON.stringify(logEntry));

    return logEntry;
}

/**
 * Block IP address
 */
export function blockIP(ip, duration = 24 * 60 * 60 * 1000) {
    blockedIPs.add(ip);
    console.warn(`🚫 IP ${ip} blocked for ${duration / 1000}s`);

    if (duration > 0) {
        setTimeout(() => {
            blockedIPs.delete(ip);
            console.log(`✅ IP ${ip} unblocked`);
        }, duration);
    }
}

/**
 * Unblock IP address
 */
export function unblockIP(ip) {
    blockedIPs.delete(ip);
    console.log(`✅ IP ${ip} manually unblocked`);
}

/**
 * Get security status
 */
export function getSecurityStatus() {
    return {
        blockedIPs: Array.from(blockedIPs),
        rateLimitEntries: rateLimitStore.size,
        loginAttemptTracking: loginAttempts.size,
    };
}

export default {
    rateLimiter,
    securityHeaders,
    ipBlocker,
    bruteForceProtection,
    sanitizeInput,
    validateRequest,
    auditLog,
    blockIP,
    unblockIP,
    getSecurityStatus,
    SECURITY_CONFIG,
};
