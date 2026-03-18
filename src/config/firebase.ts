import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Check if configuration is missing
const hasConfig = Object.values(firebaseConfig).every(val => val !== '');
if (!hasConfig) {
    console.warn('⚠️ Firebase configuration is incomplete. Please add Firebase credentials to .env file.');
    console.warn('See AUTH_SETUP.md for setup instructions.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Don't initialize analytics — COPPA compliance
// Analytics should only be enabled after parental consent
// analytics = getAnalytics(app);  // DISABLED
const analytics: Analytics | null = null;
export { analytics };

// Initialize Google Auth Provider (no prompt = faster for returning users)
export const googleProvider = new GoogleAuthProvider();

export default app;
