// hooks/useFirebase.js
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* your config */ };

export function useFirebase() {
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    setApp(app);
    setAuth(getAuth(app));
    setDb(getFirestore(app));
  }, []);

  return { app, auth, db };
}