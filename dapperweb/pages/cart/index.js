import Head from "next/head";
import styles from "./cart.module.scss";

import Layout from "components/Layout";
import dynamic from 'next/dynamic';
const CartItem = dynamic(() => import('@/components/CartItem'), { ssr: false });
import { useCart, useCartOnce } from "hooks/cart.hook";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/firebase/context";
import { addToCart } from "@/firebase/product";
import { useRouter } from "next/router";


export default function CartPage() {
  const { user, loading } = useAuth();
  const { data = {} } = typeof window !== 'undefined' ? useCart() || {} : {};
  const [clientData, setClientData] = useState({});
  useEffect(() => {
    setClientData(data);
  }, [data]);

  const cartLength = Object.keys(clientData).reduce((a, b) => a + clientData[b].length, 0);

  const cartItems =
    cartLength > 0
      ? Object.keys(data)
          .map((item) => {
            return data[item].map((size) => {
              return {
                name: item,
                size,
              };
            });
          })
          .flat(1)
      : [];

  const sizeCount = cartItems.reduce(
    (acc, value) => ({
      ...acc,
      [value.name + "__size__" + value.size]:
        (acc[value.name + "__size__" + value.size] || 0) + 1,
    }),
    {}
  );

  const cartItemsArray = cartItems.length > 0 
  ? [
      ...new Set(
        cartItems.filter(
          (v, i, a) =>
            a.findIndex((t) => t.name === v.name && t.size === v.size) === i
        )
      )
    ].map((item) => ({
      ...item,
      count: sizeCount[item.name + "__size__" + item.size] || 0
    }))
  : [];

  const addCartEvent = (id, size) => {
    const newCart = size
      ? {
          ...clientData,
          [id]: clientData.hasOwnProperty(id) ? [...clientData[id], size] : [size],
        }
      : {
          ...clientData,
          [id]: clientData.hasOwnProperty(id) ? [...clientData[id], "-"] : ["-"],
        };
    addToCart(newCart);
  };

  const router = useRouter();




  if (!loading && !user && typeof window !== "undefined") router.push("/login");



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
          {cartItemsArray.map((item, index) => {
            return (
              <CartItem
                key={index}
                id={item.name}
                size={item.size}
                count={item.count}
                onAdd={addCartEvent}
              />
            );
          })}
        </main>
      </div>
    </Layout>
  );
}