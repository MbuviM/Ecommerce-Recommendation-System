import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import cloudinary from './cloudinary';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  CART: 'cart',
  FAVORITES: 'favorites',
  ANALYTICS: 'analytics'
};

// User Schema
const createUser = async (userId, userData) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Product Schema
const createProduct = async (productData, imageFile) => {
  try {
    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const imageData = await response.json();
    const imageUrl = imageData.secure_url;

    // Create product with image URL
    const productRef = doc(collection(db, COLLECTIONS.PRODUCTS));
    await setDoc(productRef, {
      ...productData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return productRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Cart Schema
const updateCart = async (userId, cartData) => {
  const cartRef = doc(db, COLLECTIONS.CART, userId);
  await setDoc(cartRef, {
    items: cartData,
    updatedAt: new Date()
  });
};

// Add to Cart Function
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const cartRef = doc(db, COLLECTIONS.CART, userId);
    const cartDoc = await getDoc(cartRef);
    
    let cartData = { items: [] };
    if (cartDoc.exists()) {
      cartData = cartDoc.data();
    }
    
    const existingItemIndex = cartData.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cartData.items[existingItemIndex].quantity += quantity;
    } else {
      cartData.items.push({ productId, quantity });
    }
    
    await updateCart(userId, cartData.items);
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Search by Image URL
const searchByImageUrl = async (imageUrl) => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, orderBy('createdAt'), limit(10));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching by image:', error);
    throw error;
  }
};

export {
  createUser,
  createProduct,
  updateCart,
  addToCart,
  searchByImageUrl
}; 