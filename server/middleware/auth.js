// Auth middleware — Firebase token verification

import { verifyToken, isReady } from '../lib/firebase.js';

/**
 * Require a valid Firebase Bearer token.
 * Attaches req.user = { uid, email, role }
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Empty token' });
  }

  if (!isReady()) {
    return res.status(401).json({ error: 'Auth service not configured' });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      role: decoded.role || null,
    };
    next();
  } catch (err) {
    console.warn('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth — same as requireAuth but calls next() even if no token.
 * Sets req.user = null when unauthenticated.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7).trim();
  if (!token || !isReady()) {
    req.user = null;
    return next();
  }

  try {
    const decoded = await verifyToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      role: decoded.role || null,
    };
  } catch {
    req.user = null;
  }
  next();
}
