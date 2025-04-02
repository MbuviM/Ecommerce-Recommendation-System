import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  signInWithEmailAndPassword  // Add this import
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD0SNIcn7JhsQoWneL90ZpKLGWGUSq7Ao0",
  authDomain: "dapper-wear-1b4b1.firebaseapp.com",
  projectId: "dapper-wear-1b4b1",
  storageBucket: "dapper-wear-1b4b1.firebasestorage.app",
  messagingSenderId: "1010498589131",
  appId: "1:1010498589131:web:97b8d712647deb9780e64e",
  measurementId: "G-ME2EPELH47"
};
  
// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword };  // Add to exports