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
    // Automatic cart addition with error handling
    if (!isInCart) {
      router.push('/cart');
    }
  };

  const goToProductPage = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Link href={`/product/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img 
          src={product.imageUrl || '/african-default.jpg'} 
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
    </Link>
  );
};

export default ProductCard;