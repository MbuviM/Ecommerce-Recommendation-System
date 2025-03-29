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
const createProduct = async (productId, productData) => {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await setDoc(productRef, {
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
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

export {
  COLLECTIONS,
  createUser,
  createProduct,
  createOrder,
  updateCart,
  updateFavorites,
  logAnalytics,
  getProducts,
  getUserOrders
}; 