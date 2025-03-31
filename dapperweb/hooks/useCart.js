import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Create a hook for cart management that works for both logged-in and anonymous users
export default function useCart() {
  const [cart, setCart] = useState(() => {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('anonymousCart') || '{}');
});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize cart
  useEffect(() => {
  if (typeof window === 'undefined') return;
    console.log("useCart hook initializing");
    
    // First check localStorage for anonymous users
    try {
      const localCart = JSON.parse(localStorage.getItem('anonymousCart') || '{}');
      if (Object.keys(localCart).length > 0) {
        console.log("Found cart in localStorage:", Object.keys(localCart).length, "items");
        setCart(localCart);
      }
    } catch (err) {
      console.error("Error parsing localStorage cart:", err);
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.uid}` : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        // User is logged in, fetch cart from Firestore
        try {
          const userDoc = doc(db, "Users", currentUser.uid);
          const userSnap = await getDoc(userDoc);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("User document exists:", userData);
            
            if (userData.cart) {
              console.log("User has cart in Firestore with", Object.keys(userData.cart).length, "items");
              setCart(userData.cart);
            } else {
              console.log("User has no cart in Firestore");
              
              // Try to merge localStorage cart if it exists
              const localCart = JSON.parse(localStorage.getItem('anonymousCart') || '{}');
              if (Object.keys(localCart).length > 0) {
                console.log("Merging localStorage cart with user account");
                try {
                  await updateDoc(userDoc, { cart: localCart });
                  setCart(localCart);
                  localStorage.removeItem('anonymousCart');
                  console.log("Successfully merged cart and cleared localStorage");
                } catch (error) {
                  console.error("Error merging cart:", error);
                }
              }
            }
          } else {
            console.log("User document doesn't exist in Firestore");
            
            // Try to create user document with localStorage cart
            const localCart = JSON.parse(localStorage.getItem('anonymousCart') || '{}');
            try {
              await setDoc(userDoc, { 
                cart: localCart,
                email: currentUser.email || "",
                name: currentUser.displayName || "",
                createdAt: new Date().toISOString()
              });
              setCart(localCart);
              localStorage.removeItem('anonymousCart');
              console.log("Created new user document with cart");
            } catch (error) {
              console.error("Error creating user document:", error);
            }
          }
        } catch (error) {
          console.error("Error accessing Firestore:", error);
        }
      } else {
        // No user logged in, keep using localStorage cart
        console.log("No user logged in, using localStorage cart");
        const localCart = JSON.parse(localStorage.getItem('anonymousCart') || '{}');
        setCart(localCart);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    console.log("Adding to cart:", product.name || product.id, "quantity:", quantity);
    
    try {
      const newCart = { ...cart };
      
      if (newCart[product.id]) {
        newCart[product.id].quantity += quantity;
        console.log("Increased quantity of existing product");
      } else {
        newCart[product.id] = {
          ...product,
          quantity
        };
        console.log("Added new product to cart");
      }
      
      setCart(newCart);
      
      if (user) {
        // User is logged in, update Firestore
        console.log("Updating Firestore cart for user:", user.uid);
        const userDoc = doc(db, "Users", user.uid);
        
        try {
          await updateDoc(userDoc, { cart: newCart });
          console.log("Successfully updated cart in Firestore");
        } catch (error) {
          console.error("Error updating cart in Firestore:", error);
          
          // If document doesn't exist, create it
          if (error.code === 'not-found') {
            try {
              console.log("Document not found, creating new one");
              await setDoc(userDoc, { 
                cart: newCart,
                email: user.email || "",
                name: user.displayName || "",
                createdAt: new Date().toISOString()
              });
              console.log("Successfully created user document with cart");
            } catch (setDocError) {
              console.error("Error creating user document:", setDocError);
            }
          }
        }
      } else {
        // No user, use localStorage
        console.log("Saving cart to localStorage");
        localStorage.setItem('anonymousCart', JSON.stringify(newCart));
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const addChatbotToCart = async (productData) => {
    try {
      const product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrl
      };

      setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[product.id]) {
          newCart[product.id].quantity += 1;
        } else {
          newCart[product.id] = { ...product, quantity: 1 };
        }
        localStorage.setItem('anonymousCart', JSON.stringify(newCart));
        return newCart;
      });

      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        await updateDoc(userDoc, {
          cart: cart
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Chatbot cart add error:', error);
      return { success: false, error: error.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    console.log("Removing from cart:", productId);
    
    try {
      const newCart = { ...cart };
      delete newCart[productId];
      
      setCart(newCart);
      
      if (user) {
        // User is logged in, update Firestore
        console.log("Updating Firestore after removal");
        const userDoc = doc(db, "Users", user.uid);
        
        try {
          await updateDoc(userDoc, { cart: newCart });
          console.log("Successfully updated cart in Firestore after removal");
        } catch (error) {
          console.error("Error updating cart in Firestore after removal:", error);
        }
      } else {
        // No user, use localStorage
        console.log("Updating localStorage after removal");
        localStorage.setItem('anonymousCart', JSON.stringify(newCart));
      }
      
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    console.log("Updating quantity for:", productId, "to", quantity);
    
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      
      const newCart = { ...cart };
      if (newCart[productId]) {
        newCart[productId].quantity = quantity;
        
        setCart(newCart);
        
        if (user) {
          // User is logged in, update Firestore
          console.log("Updating Firestore after quantity change");
          const userDoc = doc(db, "Users", user.uid);
          
          try {
            await updateDoc(userDoc, { cart: newCart });
            console.log("Successfully updated cart in Firestore after quantity change");
          } catch (error) {
            console.error("Error updating cart in Firestore after quantity change:", error);
          }
        } else {
          // No user, use localStorage
          console.log("Updating localStorage after quantity change");
          localStorage.setItem('anonymousCart', JSON.stringify(newCart));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    console.log("Clearing cart");
    
    try {
      setCart({});
      
      if (user) {
        // User is logged in, update Firestore
        console.log("Clearing cart in Firestore");
        const userDoc = doc(db, "Users", user.uid);
        
        try {
          await updateDoc(userDoc, { cart: {} });
          console.log("Successfully cleared cart in Firestore");
        } catch (error) {
          console.error("Error clearing cart in Firestore:", error);
        }
      } else {
        // No user, use localStorage
        console.log("Clearing cart in localStorage");
        localStorage.removeItem('anonymousCart');
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isAuthenticated: !!user
  };
}