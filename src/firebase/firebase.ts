import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCY2emdtdEm0308_y99aKw3YFYQrTTcyfs",
  authDomain: "commodify-561a2.firebaseapp.com",
  projectId: "commodify-561a2",
  storageBucket: "commodify-561a2.appspot.com",
  messagingSenderId: "16011491368",
  appId: "1:16011491368:web:b380fc82db5efcaf989d1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
