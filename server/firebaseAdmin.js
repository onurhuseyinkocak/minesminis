// TODO: Firebase Admin SDK Integration
// To enable full Firebase Admin functionality:
// 1. Install: npm install firebase-admin
// 2. Generate a service account key from Firebase Console > Project Settings > Service Accounts
// 3. Set environment variable FIREBASE_SERVICE_ACCOUNT_KEY with the JSON key path
// 4. Replace the stub functions below with real implementations

const FIREBASE_NOT_CONFIGURED_MSG =
  '[Firebase Admin] Not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY env var to enable server-side auth.';

// Startup warning
console.warn(FIREBASE_NOT_CONFIGURED_MSG);

export function isFirebaseAdminReady() {
  return false;
}

export async function verifyIdToken(token) {
  if (!token) {
    throw new Error('[Firebase Admin] verifyIdToken called without a token.');
  }
  throw new Error(
    '[Firebase Admin] Cannot verify token — Firebase Admin SDK is not configured. ' +
    'Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable with the path to your service account JSON.'
  );
}

export async function getUser(uid) {
  if (!uid) {
    throw new Error('[Firebase Admin] getUser called without a uid.');
  }
  throw new Error(
    '[Firebase Admin] Cannot fetch user — Firebase Admin SDK is not configured.'
  );
}

export async function setCustomClaims(uid, claims) {
  throw new Error(
    '[Firebase Admin] Cannot set custom claims — Firebase Admin SDK is not configured.'
  );
}
