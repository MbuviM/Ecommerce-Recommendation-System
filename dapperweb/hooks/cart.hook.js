import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/context";
import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "carts", currentUser.uid);
    const unsubscribe = onSnapshot(cartRef, (doc) => {
      if (doc.exists()) {
        setCart(doc.data().items || []);
      } else {
        setCart([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cart:", error);
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addToCart = async (product) => {
    if (!currentUser) {
      setError("Please login to add items to cart");
      return;
    }

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const currentCart = cartDoc.data().items || [];
        const existingItem = currentCart.find(item => item.id === product.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          currentCart.push({ ...product, quantity: 1 });
        }
        
        await setDoc(cartRef, { items: currentCart });
      } else {
        await setDoc(cartRef, { items: [{ ...product, quantity: 1 }] });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError(error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) {
      setError("Please login to remove items from cart");
      return;
    }

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const currentCart = cartDoc.data().items || [];
        const updatedCart = currentCart.filter(item => item.id !== productId);
        await setDoc(cartRef, { items: updatedCart });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError(error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) {
      setError("Please login to update cart");
      return;
    }

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const currentCart = cartDoc.data().items || [];
        const updatedCart = currentCart.map(item => {
          if (item.id === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        await setDoc(cartRef, { items: updatedCart });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error);
    }
  };

  const clearCart = async () => {
    if (!currentUser) {
      setError("Please login to clear cart");
      return;
    }

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartRef, { items: [] });
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error);
    }
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}

export default useCart;
