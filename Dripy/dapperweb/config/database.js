import { db, storage } from './firebase';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const uploadProductImage = async (file, productId) => {
  try {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const createProduct = async (productId, productData, imageFile) => {
  try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile, productId);
    }
    
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await setDoc(productRef, {
      ...productData,
      imageUrl: imageUrl || productData.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Order Schema
const createOrder = async (orderId, orderData) => {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await setDoc(orderRef, {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Cart Schema
const updateCart = async (userId, cartData) => {
  const cartRef = doc(db, COLLECTIONS.CART, userId);
  await setDoc(cartRef, {
    items: cartData,
    updatedAt: new Date()
  });
};

// Favorites Schema
const updateFavorites = async (userId, favoritesData) => {
  const favoritesRef = doc(db, COLLECTIONS.FAVORITES, userId);
  await setDoc(favoritesRef, {
    items: favoritesData,
    updatedAt: new Date()
  });
};

// Analytics Schema
const logAnalytics = async (analyticsData) => {
  const analyticsRef = collection(db, COLLECTIONS.ANALYTICS);
  await setDoc(doc(analyticsRef), {
    ...analyticsData,
    timestamp: new Date()
  });
};

// Query Functions
const getProducts = async (category = null, limit = 20) => {
  let q = collection(db, COLLECTIONS.PRODUCTS);
  if (category) {
    q = query(q, where('category', '==', category));
  }
  q = query(q, orderBy('createdAt', 'desc'), limit(limit));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getUserOrders = async (userId) => {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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

// Enhanced Image Search Function
const searchByImageUrl = async (imageUrl) => {
  try {
    const response = await fetch('/api/image-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!response.ok) {
      throw new Error('Image search failed');
    }
    
    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error searching by image:', error);
    throw error;
  }
};

export {
  COLLECTIONS,
  createUser,
  createProduct,
  createOrder,
  updateCart,
  updateFavorites,
  logAnalytics,
  getProducts,
  getUserOrders,
  uploadProductImage,
  addToCart,
  searchByImageUrl
}; 