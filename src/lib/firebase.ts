import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCz0Upp_x1XSGVAzgFWF_WZcUBULEis07k",
  authDomain: "fire-arena-2-26881.firebaseapp.com",
  projectId: "fire-arena-2-26881",
  storageBucket: "fire-arena-2-26881.firebasestorage.app",
  messagingSenderId: "450907597107",
  appId: "1:450907597107:web:165a2661cbbb0989253646",
  measurementId: "G-7YXSH8P39R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
