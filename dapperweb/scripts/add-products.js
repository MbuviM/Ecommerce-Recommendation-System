const { db } = require('../config/firebase');

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
      await db.collection('Products').add(product);
      console.log('Added product:', product.productDisplayName);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
  
  console.log('Finished adding products!');
}

// Run the function
addProducts();