// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// 🔥 BU BİLGİLERİ FIREBASE KONSOLDAN AL
const firebaseConfig = {
  apiKey: "AIzaSyBzdd8qiHM3qe99EFeNj_1fC0W--VyZ9h4",
  authDomain: "minesminis-4e4cd.firebaseapp.com",
  projectId: "minesminis-4e4cd",
  storageBucket: "minesminis-4e4cd.appspot.com",
  messagingSenderId: "123456789", // BU NUMARAYI KONSOLDAN AL
  appId: "1:123456789:web:abcdef123456" // BU FORMATTA OLACAK
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();