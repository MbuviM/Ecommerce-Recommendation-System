import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/context";
import { db } from "@/firebase/config";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

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
    const unsubscribe = onSnapshot(
      cartRef,
      (doc) => {
        setCart(doc.exists() ? doc.data().items || [] : []);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cart:", error);
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const updateCart = async (updater) => {
    if (!currentUser) {
      setError("Please login to modify cart");
      return;
    }

    try {
      const cartRef = doc(db, "carts", currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      const currentCart = cartDoc.exists() ? cartDoc.data().items || [] : [];
      const updatedCart = updater(currentCart);
      await setDoc(cartRef, { items: updatedCart });
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error);
    }
  };

  const addToCart = (product) => updateCart((currentCart) => {
    const existingItem = currentCart.find(item => item.id === product.id);
    if (existingItem) {
      return currentCart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    }
    return [...currentCart, { ...product, quantity: 1 }];
  });

  const removeFromCart = (productId) => updateCart((currentCart) => 
    currentCart.filter(item => item.id !== productId)
  );

  const updateQuantity = (productId, quantity) => updateCart((currentCart) =>
    currentCart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    )
  );

  const clearCart = () => updateCart(() => []);

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