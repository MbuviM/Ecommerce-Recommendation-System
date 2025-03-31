import { db } from '../config/firebase';

// Sample products data
const products = [
  {
    productDisplayName: "Classic White T-Shirt",
    price: 29.99,
    link: "https://i.ibb.co/wL3nWkm/Pngtree-memphis-style-line-point-line-3797599.png",
    sellers: "Dapper Wear",
    gender: "Men",
    masterCategory: "Clothing",
    subCategory: "T-Shirts"
  },
  {
    productDisplayName: "Denim Jacket",
    price: 89.99,
    link: "https://i.ibb.co/ZK2L8cg/kisspng-fashion-model-hugo-boss-pinpoint-resource-of-oklah-mens-fashion-5a78e637c1bde9-3434957015178.png",
    sellers: "Dapper Wear",
    gender: "Men",
    masterCategory: "Clothing",
    subCategory: "Jackets"
  },
  {
    productDisplayName: "Summer Dress",
    price: 59.99,
    link: "https://i.ibb.co/xmJdGXD/kisspng-slip-dress-clothing-casual-fashion-model-5abb4a319d2986-8864671115222236656438.png",
    sellers: "Dapper Wear",
    gender: "Women",
    masterCategory: "Clothing",
    subCategory: "Dresses"
  }
];

// Function to add products
async function addProducts() {
  for (const product of products) {
    try {
      await db.collection('Products').add(product);
      console.log('Added product:', product.productDisplayName);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
}

// Function to set up security rules
async function setupSecurityRules() {
  const rules = `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Helper functions
        function isAuthenticated() {
          return request.auth != null;
        }
        
        function isOwner(userId) {
          return isAuthenticated() && request.auth.uid == userId;
        }
        
        function isAdmin() {
          return isAuthenticated() && 
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
        }

        // Users collection
        match /users/{userId} {
          allow read: if isAuthenticated();
          allow create: if isAuthenticated() && request.auth.uid == userId;
          allow update: if isOwner(userId) || isAdmin();
          allow delete: if isAdmin();
        }

        // Products collection
        match /products/{productId} {
          allow read: if true;
          allow create, update, delete: if isAdmin();
        }

        // Orders collection
        match /orders/{orderId} {
          allow read: if isAuthenticated() && 
            (resource.data.userId == request.auth.uid || isAdmin());
          allow create: if isAuthenticated();
          allow update: if isAdmin();
          allow delete: if isAdmin();
        }
      }
    }
  `;

  // Note: Security rules need to be deployed through Firebase Console
  console.log('Security rules to be deployed:', rules);
}

// Main setup function
async function setupFirebase() {
  try {
    console.log('Starting Firebase setup...');
    await addProducts();
    await setupSecurityRules();
    console.log('Firebase setup completed!');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

// Run the setup
setupFirebase(); 