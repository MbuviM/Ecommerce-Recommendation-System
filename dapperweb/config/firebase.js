import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyAlYi1aRw8p4kAE9KBP5sFwCAGkPDuoG3E",
    authDomain: "dapper-ecommerce.firebaseapp.com",
    projectId: "dapper-ecommerce",
    storageBucket: "dapper-ecommerce.firebasestorage.app",
    messagingSenderId: "769404425680",
    appId: "1:769404425680:web:5bf37375ae9c67a8f595d5",
    measurementId: "G-558YEVK1ZM"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, storage, analytics };