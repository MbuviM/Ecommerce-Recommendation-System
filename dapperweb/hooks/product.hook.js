import { db } from "@/config/firebase";
import { useState, useEffect } from "react";

const useProduct = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      db.collection("Products")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setData(doc.data());
          }
          setLoading(false);
        })
        .catch((e) => {
          setError(e);
          setLoading(false);
        });
    }
  }, [id]);

  return {
    data,
    loading,
    error,
  };
};

const useCategoryProducts = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      db.collection("Products")
        .where("masterCategory", "==", category)
        .get()
        .then((querySnapshot) => {
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(products);
          setLoading(false);
        })
        .catch((e) => {
          setError(e);
          setLoading(false);
        });
    }
  }, [category]);

  return {
    data,
    loading,
    error,
  };
};

export default useProduct;
export { useCategoryProducts };
