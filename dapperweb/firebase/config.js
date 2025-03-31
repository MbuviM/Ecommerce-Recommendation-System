// Import Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlYi1aRw8p4kAE9KBP5sFwCAGkPDuoG3E",
  authDomain: "dapper-ecommerce.firebaseapp.com",
  projectId: "dapper-ecommerce",
  storageBucket: "dapper-ecommerce.firebasestorage.app",
  messagingSenderId: "769404425680",
  appId: "1:769404425680:web:5bf37375ae9c67a8f595d5",
  measurementId: "G-558YEVK1ZM"
};

// Initialize Firebase only if it hasn't been initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the initialized services
const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };