import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const useCart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Set up real-time listener for cart data
        const userDocRef = doc(db, "Users", currentUser.uid);
        const cartUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setData(docSnap.data().cart || []);
          } else {
            setData([]);
          }
          setLoading(false);
        }, (err) => {
          setError(err);
          setLoading(false);
        });
        
        return () => cartUnsubscribe();
      } else {
        setData([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    data,
    loading,
    error,
  };
};

const useCartOnce = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFromFirestore = async () => {
      if (!auth.currentUser) {
        setData([]);
        setLoading(false);
        return;
      }
      
      try {
        const userDocRef = doc(db, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data().cart || []);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFromFirestore();
  }, [auth.currentUser]);

  return {
    data,
    loading,
    error,
  };
};

export { useCart, useCartOnce };