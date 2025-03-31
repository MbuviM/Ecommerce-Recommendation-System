const { db } = require('../config/firebase');

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
  },
  {
    productDisplayName: "Leather Sneakers",
    price: 79.99,
    link: "https://i.ibb.co/0yKq1HK/kindpng-4043322.png",
    sellers: "Dapper Wear",
    gender: "Unisex",
    masterCategory: "Footwear",
    subCategory: "Sneakers"
  },
  {
    productDisplayName: "Designer Handbag",
    price: 129.99,
    link: "https://i.ibb.co/68XpWPB/pngkey-com-ladies-purse-png-2499694.png",
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