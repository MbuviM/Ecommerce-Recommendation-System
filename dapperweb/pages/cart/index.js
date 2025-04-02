import Head from "next/head";
import styles from "./cart.module.scss";

import Layout from "components/Layout";
import CartItem from "@/components/CartItem";
import { useCart, useCartOnce } from "hooks/cart.hook";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/firebase/context";
import { addToCart } from "@/firebase/product";
import { useRouter } from "next/router";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { data } = useCart();

  // Calculate cart length by summing up quantities of all items
  const cartLength = data && typeof data === 'object' ? 
    Object.values(data).reduce((total, item) => total + (item.quantity || 1), 0) : 0;

  const router = useRouter();

  if (!loading && !user && typeof window !== "undefined") router.push("/login");
  
  // Check if data is available and is an object
  const hasItems = data && typeof data === 'object' && Object.keys(data).length > 0;

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Cart</h1>
            <h4>You have {cartLength} items in your cart</h4>
          </div>
          {hasItems ? (
            Object.entries(data).map(([id, item]) => {
              // Check if item has the necessary properties
              if (!item || typeof item !== 'object') return null;
              
              return (
                <CartItem
                  key={id}
                  item={{
                    id: id,
                    name: item.name || 'Product',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    imageUrl: item.imageUrl || item.cover_photo
                  }}
                  updateQuantity={(id, quantity) => {
                    const newCart = { ...data };
                    if (!newCart[id]) newCart[id] = {};
                    newCart[id].quantity = quantity;
                    addToCart(newCart);
                  }}
                  removeItem={(id) => {
                    const newCart = { ...data };
                    delete newCart[id];
                    addToCart(newCart);
                  }}
                />
              );
            })
          ) : (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button onClick={() => router.push('/')} className={styles.continueShoppingBtn}>
                Continue Shopping
              </button>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}