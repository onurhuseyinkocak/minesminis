// Firebase token verification — delegates to the main firebaseAdmin.js
// This module provides the API used by middleware/auth.js

import { verifyIdToken, isFirebaseAdminReady } from '../firebaseAdmin.js';

/**
 * Verify a Firebase ID token.
 * @param {string} idToken
 * @returns {Promise<object>} decoded token
 */
export async function verifyToken(idToken) {
  if (!isFirebaseAdminReady()) {
    throw new Error('Firebase Admin not configured');
  }
  const decoded = await verifyIdToken(idToken);
  if (!decoded || !decoded.uid) {
    throw new Error('Invalid or expired token');
  }
  return decoded;
}

export function isReady() {
  return isFirebaseAdminReady();
}

export function getFirebaseApp() {
  // Imported from firebaseAdmin.js which manages the app instance
  return null; // not directly exposed; use verifyToken instead
}
