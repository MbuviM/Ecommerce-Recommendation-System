import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmFe4_zOoo34MPl9T9HDG91nl8oEA1jo8",
  authDomain: "dripy-e1420.firebaseapp.com",
  projectId: "dripy-e1420",
  storageBucket: "dripy-e1420.appspot.com",
  messagingSenderId: "270889450216",
  appId: "1:270889450216:web:9b9d1c544072f35df7275d",
  measurementId: "G-1NLPYJVY64"
};


// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app); 