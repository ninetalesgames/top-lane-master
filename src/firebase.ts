import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCjLKX9qdJ52smnWLDDFoeQG2oXNC1zlX0',
  authDomain: 'lol-matchup-master.firebaseapp.com',
  projectId: 'lol-matchup-master',
  storageBucket: 'lol-matchup-master.firebasestorage.app',
  messagingSenderId: '252989715190',
  appId: '1:252989715190:web:19b397a8a37828f690b2d7',
  measurementId: 'G-N0RZ36TKEM'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();