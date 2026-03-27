// Firebase Admin SDK — real implementation
// Priority: FIREBASE_SERVICE_ACCOUNT_JSON > FIREBASE_PROJECT_ID + ADC > graceful stub

import admin from 'firebase-admin';

let app = null;
let ready = false;

try {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (admin.apps.length > 0) {
    // Already initialized (e.g. by lib/firebase.js) — reuse default
    app = admin.apps[0];
    ready = true;
    console.log('[Firebase Admin] Reusing existing app');
  } else if (serviceAccountJson) {
    const credential = JSON.parse(serviceAccountJson);
    app = admin.initializeApp({
      credential: admin.credential.cert(credential),
      projectId: credential.project_id,
    });
    ready = true;
    console.log('[Firebase Admin] Initialized with service account JSON');
  } else if (projectId) {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    ready = true;
    console.log('[Firebase Admin] Initialized with ADC, project:', projectId);
  } else {
    console.warn(
      '[Firebase Admin] Not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID env var to enable server-side auth.'
    );
  }
} catch (err) {
  console.warn('[Firebase Admin] Init error:', err.message, '— running in stub mode.');
}

export function isFirebaseAdminReady() {
  return ready;
}

export async function verifyIdToken(token) {
  if (!token) {
    throw new Error('[Firebase Admin] verifyIdToken called without a token.');
  }
  if (!ready || !app) {
    throw new Error('[Firebase Admin] Not configured — cannot verify token.');
  }
  try {
    return await app.auth().verifyIdToken(token);
  } catch (err) {
    // Return null on verification failure so callers can handle gracefully
    return null;
  }
}

export async function getUser(uid) {
  if (!uid) {
    throw new Error('[Firebase Admin] getUser called without a uid.');
  }
  if (!ready || !app) {
    throw new Error('[Firebase Admin] Not configured — cannot fetch user.');
  }
  return app.auth().getUser(uid);
}

export async function setCustomClaims(uid, claims) {
  if (!ready || !app) {
    throw new Error('[Firebase Admin] Not configured — cannot set custom claims.');
  }
  return app.auth().setCustomUserClaims(uid, claims);
}
