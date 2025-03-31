import React from 'react';
import { useRouter } from 'next/router';
import useCart from '../hooks/useCart';
import styles from './ProductCard.module.scss';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  
  // Check if product is already in cart
  const isInCart = cart[product.id];
  const currentQuantity = isInCart ? cart[product.id].quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    // Optional: show some success feedback
    alert(`Added ${product.name} to cart!`);
  };

  const goToProductPage = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className={styles.productCard} onClick={goToProductPage}>
      <div className={styles.imageContainer}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300'} 
          alt={product.name} 
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>${product.price}</p>
        <button 
          className={styles.addToCartButton}
          onClick={handleAddToCart}
        >
          {isInCart ? `Add More (${currentQuantity} in cart)` : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 