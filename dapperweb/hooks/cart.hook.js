import { db, auth } from "@/config/firebase";
import { useState, useEffect } from "react";

const useCart = () => {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setData({ items: [] });
      setLoading(false);
      return;
    }

    const unsubscribe = db
      .collection("Users")
      .doc(auth.currentUser.uid)
      .onSnapshot(
        (doc) => {
          if (doc.exists()) {
            setData(doc.data().cart || { items: [] });
          } else {
            setData({ items: [] });
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching cart:", error);
          setError(error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [auth.currentUser]);

  return {
    data,
    loading,
    error,
  };
};

const useCartOnce = (id) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("once");

  useEffect(() => {
    async function fetchFromFirestore() {
      console.log("once inner");

      db.collection("Users")
        .doc(auth.currentUser?.uid)
        .get()
        .then(function (doc) {
          setData(doc.data().cart);
          setLoading(false);
        })
        .catch((e) => setError(e));
    }
    auth.currentUser?.uid && fetchFromFirestore();
  }, [auth.currentUser]);

  return {
    data,
    loading,
    error,
  };
};

export default useCart;
export { useCartOnce };
