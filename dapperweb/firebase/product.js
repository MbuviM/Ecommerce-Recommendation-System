import { firebase, auth, db } from "../config/firebase";

function addFavorite(id) {
  const currentUser = auth.currentUser.uid;

  return db
    .collection("Users")
    .doc(currentUser)
    .update({
      favorites: firebase.firestore.FieldValue.arrayUnion(id),
    });
}

function removeFavorite(id) {
  const currentUser = auth.currentUser.uid;

  return db
    .collection("Users")
    .doc(currentUser)
    .update({
      favorites: firebase.firestore.FieldValue.arrayRemove(id),
    });
}

function addToCart(productId, quantity = 1) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be logged in to add items to cart');
  }

  return db.collection("Users").doc(currentUser.uid).get().then(doc => {
    const userData = doc.data();
    const cart = userData.cart || { items: [] };
    
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    return db.collection("Users").doc(currentUser.uid).update({
      cart,
      updatedAt: new Date()
    });
  });
}

export { addFavorite, removeFavorite, addToCart };
