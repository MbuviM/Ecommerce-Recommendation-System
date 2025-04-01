import React, { useState } from "react";
import styles from "./product.module.scss";
import HeartIcon from "@/icons/heart";
import Link from "next/link";
import HeartFilled from "@/icons/heart-filled";
import { addFavorite, removeFavorite } from "@/firebase/product";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/context";
import useCart from "@/hooks/useCart";

export default function ProductCard({
  bgColor,
  id,
  brand,
  name,
  price,
  sale_price,
  image,
  favorite,
  ...props
}) {
  const [isFavorite, setFavorite] = useState(favorite);
  const [addedToCart, setAddedToCart] = useState(false);

  const { user, loading } = useAuth();
  const { addToCart } = useCart();

  const router = useRouter();

  const removeEvent = (id) => {
    removeFavorite(id);
    setFavorite(false);
  };
  const addEvent = (id) => {
    addFavorite(id);
    setFavorite(true);
  };

  const favoriteEvent = () => {
    if (user && !loading) isFavorite ? removeEvent(id) : addEvent(id);
    else typeof window !== "undefined" && router.push("/login");
  };

  const goToProduct = (target) => {
    console.log(target);
    target?.localName !== "button" &&
      typeof window !== "undefined" &&
      router.push(`/product/${id}`);
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const product = {
      id,
      name,
      price: sale_price || price,
      imageUrl: image,
      brand
    };
    
    addToCart(product);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: bgColor || "",
      }}
      onClick={(e) => goToProduct(e.target)}
      {...props}
    >
      <button className={styles.favContainer} onClick={favoriteEvent}>
        {isFavorite ? (
          <HeartFilled width={16} height={16} />
        ) : (
          <HeartIcon width={16} height={16} />
        )}
      </button>
      <button 
        className={`${styles.cartButton} ${addedToCart ? styles.added : ''}`} 
        onClick={handleAddToCart}
      >
        {addedToCart ? '✓ Added' : 'Add to Cart'}
      </button>
      <Link href={`/product/${id}`} className={styles.imageContainer}>
        <img src={image} alt={name} />
      </Link>
      <div className={styles.textContainer}>
        <div className={styles.brandWrapper}>
          <Link href={`/brand/${brand}`} className={styles.brandLink}>
            {brand}
          </Link>
        </div>
        <Link href={`/product/${id}`} className={styles.name}>
          {name}
        </Link>
        {sale_price ? (
          <div className={styles.priceContainer}>
            <div className={styles.discount}>
              {(((price - sale_price) / price) * 100) | 0}%
            </div>
            <div className={styles.prices}>
              <span className={styles.priceText}>{price}$</span>
              <span className={styles.salePriceText}>{sale_price}$</span>
            </div>
          </div>
        ) : (
          <span className={styles.price}>{price || 0}$</span>
        )}
      </div>
    </div>
  );
}