import Head from "next/head";
import styles from "./cart.module.scss";
import Layout from "components/Layout";
import CartItem from "@/components/CartItem";
import { useCart } from "hooks/cart.hook";
import React from "react";
import { useAuth } from "@/firebase/context";
import { useRouter } from "next/router";
import { addToCart } from "@/firebase/product";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { data, loading: cartLoading } = useCart();
  const router = useRouter();

  const cartItems = data?.items || [];

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!loading && !user && typeof window !== "undefined") {
    router.push("/login");
    return null;
  }

  if (cartLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Shopping Cart - Dapper Wear</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Cart</h1>
            <h4>You have {cartItems.length} items in your cart</h4>
          </div>
          {cartItems.map((item, index) => (
            <CartItem
              key={index}
              id={item.productId}
              quantity={item.quantity}
              onAdd={() => handleAddToCart(item.productId)}
            />
          ))}
        </main>
      </div>
    </Layout>
  );
}
