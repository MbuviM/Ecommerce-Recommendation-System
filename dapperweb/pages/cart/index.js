import Head from "next/head";
import styles from "./cart.module.scss";

import Layout from "components/Layout";
import dynamic from 'next/dynamic';
const CartItem = dynamic(() => import('@/components/CartItem'), { ssr: false });
import { useCart } from "hooks/cart.hook";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/firebase/context";
import { useRouter } from "next/router";


export default function CartPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  
  const loading = authLoading || cartLoading;
  const cartLength = cart.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Shopping Cart - Dapper Sales</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Cart</h1>
            <h4>You have {cartLength} items in your cart</h4>
          </div>
          
          {loading ? (
            <p>Loading your cart...</p>
          ) : cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button onClick={() => router.push('/')} className={styles.continueShoppingBtn}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeFromCart}
                />
              ))}
              
              <div className={styles.cartSummary}>
                <div className={styles.subtotal}>
                  <span>Subtotal:</span>
                  <span>${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <button className={styles.checkoutBtn}>Proceed to Checkout</button>
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}