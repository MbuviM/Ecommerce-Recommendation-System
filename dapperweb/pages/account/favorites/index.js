import React, { useState, useEffect } from "react";

import AccountSidebar from "@/components/AccountSidebar";
import Layout from "@/components/Layout";

import styles from "./favorites.module.scss";
import { useAuth } from "@/firebase/context";
import { db, auth } from "@/config/firebase";
import ProductCard from "@/components/ProductCard/product-card";
import { useRouter } from "next/router";

export default function Favorites() {
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const userLoading = useAuth().loading;

  useEffect(() => {
    if (user?.favorites && user.favorites.length > 0) {
      const fetchFavorites = async () => {
        try {
          const productsRef = collection(db, "fashion");
          const querySnapshot = await getDocs(productsRef);
          
          setProducts(
            querySnapshot.docs
              .filter((item) => user.favorites.includes(item.id))
              .map((doc) => {
                return { id: doc.id, ...doc.data() };
              })
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setLoading(false);
        }
      };
      
      fetchFavorites();
    }
  }, [user]);

  if (!user && !userLoading) useRouter().push("/login");

  return (
    <Layout noCategories>
      <AccountSidebar />
      <main className={styles.container}>
        <h1 className={styles.title}>My Favorites</h1>
        <div className={styles.content}>
          <div className={styles.products}>
            {products?.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  brand={product.brand || product.sellers || product.masterCategory}
                  name={product.productDisplayName || product.product_name}
                  image={product.link || product.cover_photo}
                  price={(product.price || 0) + 142}
                  sale_price={product.price || 0}
                  favorite={user?.favorites?.includes(product.id)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
