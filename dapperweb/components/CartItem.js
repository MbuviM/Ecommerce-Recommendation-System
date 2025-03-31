import React from 'react';
import Image from 'next/image';
import styles from './CartItem.module.scss';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/80'} 
          alt={item.name}
          className={styles.productImage}
        />
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{item.name}</h3>
        <p className={styles.productPrice}>${item.price}</p>
      </div>
      
      <div className={styles.quantityControls}>
        <button 
          className={styles.quantityBtn}
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className={styles.quantityInput}
        />
        <button 
          className={styles.quantityBtn}
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <div className={styles.itemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      <button 
        className={styles.removeBtn}
        onClick={handleRemove}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
};

export default CartItem; 