import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// Storage importunu KALDIRIYORUZ - Artık Vercel Blob kullanıyoruz

const firebaseConfig = {
  apiKey: "AIzaSyBzdd8qiHM3qe99EFeNj_1fC0W--VyZ9h4",
  authDomain: "minesminis-4e4cd.firebaseapp.com",
  projectId: "minesminis-4e4cd",
  storageBucket: "minesminis-4e4cd.appspot.com", // Bu satır kalabilir ama kullanmıyoruz
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Storage exportunu KALDIRIYORUZ
// export const storage = getStorage(app); // BU SATIRI SİLİN

export default app;