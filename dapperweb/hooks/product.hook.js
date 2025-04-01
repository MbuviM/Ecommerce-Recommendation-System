import { db } from "@/config/firebase";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const useProduct = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productDoc = doc(db, "fashion", id);
          const productSnap = await getDoc(productDoc);
          
          if (productSnap.exists()) {
            setData(productSnap.data());
          }
          setLoading(false);
        } catch (e) {
          console.error("Error fetching product:", e);
          setError(e);
          setLoading(false);
        }
      };
      
      fetchProduct();
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
      const fetchCategoryProducts = async () => {
        try {
          const productsRef = collection(db, "fashion");
          const q = query(productsRef, where("masterCategory", "==", category));
          const querySnapshot = await getDocs(q);
          
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setData(products);
          setLoading(false);
        } catch (e) {
          console.error("Error fetching category products:", e);
          setError(e);
          setLoading(false);
        }
      };
      
      fetchCategoryProducts();
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
