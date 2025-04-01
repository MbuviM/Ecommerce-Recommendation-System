import { firebase, auth, db } from "@/firebase/config";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

async function addFavorite(id) {
  try {
    const currentUser = auth.currentUser.uid;
    const userRef = doc(db, "Users", currentUser);
    
    await updateDoc(userRef, {
      favorites: arrayUnion(id),
    });
    
    return true;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return false;
  }
}

async function removeFavorite(id) {
  try {
    const currentUser = auth.currentUser.uid;
    const userRef = doc(db, "Users", currentUser);
    
    await updateDoc(userRef, {
      favorites: arrayRemove(id),
    });
    
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
}

async function addToCart(newCart) {
  try {
    const currentUser = auth.currentUser.uid;
    const userRef = doc(db, "Users", currentUser);
    
    await updateDoc(userRef, {
      cart: newCart,
    });
    
    return true;
  } catch (error) {
    console.error("Error updating cart:", error);
    return false;
  }
}
