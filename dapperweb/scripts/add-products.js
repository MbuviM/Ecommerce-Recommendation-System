// Import Firebase v9 modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlYi1aRw8p4kAE9KBP5sFwCAGkPDuoG3E",
  authDomain: "dapper-ecommerce.firebaseapp.com",
  projectId: "dapper-ecommerce",
  storageBucket: "dapper-ecommerce.firebasestorage.app",
  messagingSenderId: "769404425680",
  appId: "1:769404425680:web:5bf37375ae9c67a8f595d5",
  measurementId: "G-558YEVK1ZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    productDisplayName: "Classic White T-Shirt",
    price: 29.99,
    link: "https://example.com/ai-images/african-tshirt-design.jpg",
    sellers: "Dapper Wear",
    gender: "Men",
    masterCategory: "Clothing",
    subCategory: "T-Shirts"
  },
  {
    productDisplayName: "Denim Jacket",
    price: 89.99,
    link: "https://example.com/ai-images/african-denim-jacket.jpg",
    sellers: "Dapper Wear",
    gender: "Men",
    masterCategory: "Clothing",
    subCategory: "Jackets"
  },
  {
    productDisplayName: "Summer Dress",
    price: 59.99,
    link: "https://example.com/ai-images/african-print-dress.jpg",
    sellers: "Dapper Wear",
    gender: "Women",
    masterCategory: "Clothing",
    subCategory: "Dresses"
  },
  {
    productDisplayName: "Leather Sneakers",
    price: 79.99,
    link: "https://example.com/ai-images/african-tribal-sneakers.jpg",
    sellers: "Dapper Wear",
    gender: "Unisex",
    masterCategory: "Footwear",
    subCategory: "Sneakers"
  },
  {
    productDisplayName: "Designer Handbag",
    price: 129.99,
    link: "https://example.com/ai-images/african-beaded-handbag.jpg",
    sellers: "Dapper Wear",
    gender: "Women",
    masterCategory: "Accessories",
    subCategory: "Bags"
  }
];

async function addProducts() {
  console.log('Starting to add products...');
  
  for (const product of products) {
    try {
      // Using Firebase v9 syntax to add to 'fashion' collection
      const docRef = await addDoc(collection(db, 'fashion'), product);
      console.log('Added product:', product.productDisplayName, 'with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
  
  console.log('Finished adding products!');
}

// Run the function
addProducts();