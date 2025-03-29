import { db } from '../Firebase';
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

// Product Schema
const createProduct = async (productId, productData, imageFile) => {
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

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const imageData = await response.json();
    const imageUrl = imageData.secure_url;

    // Create product with image URL
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await setDoc(productRef, {
      ...productData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get all products
const getAllProducts = async () => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get product by ID
const getProductById = async (productId) => {
  try {
    const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById
}; 