import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDgoFJ9Poo7qrqUA1GAvMVOlAHjeN0CuRc",
  authDomain: "raizes-s.firebaseapp.com",
  projectId: "raizes-s",
  storageBucket: "raizes-s.firebasestorage.app",
  messagingSenderId: "596304097338",
  appId: "1:596304097338:web:ca39d5af85c0ec75070503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;