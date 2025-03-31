import React from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.scss';

const ProductList = ({ products, title }) => {
  if (!products || products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <h2>{title || 'Products'}</h2>
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.productListContainer}>
      {title && <h2 className={styles.productListTitle}>{title}</h2>}
      <div className={styles.productList}>
        {products.map(product => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 