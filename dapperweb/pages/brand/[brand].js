import React from "react";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Head from "next/head";
import styles from "./brand.module.scss";
import Layout from "components/Layout";
import Button from "@/components/FilterButton";
import ProductCard from "@/components/ProductCard/product-card";
import { useAuth } from "@/firebase/context";

export default function BrandPage({ data, query }) {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Listing {data.length} products for "{query.brand}"
            </h1>
            <div className={styles.headerButtons}>
              <Button type="sort" style={{ marginRight: 20 }} />
              <Button count={0} />
            </div>
          </div>
          <div className={styles.products}>
            {!loading &&
              data.map((product) => {
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
        </main>
      </div>
    </Layout>
  );
}

BrandPage.getInitialProps = async function ({ query }) {
  try {
    const productsRef = collection(db, "fashion");
    // First try to match by 'brand' field
    let q = query(productsRef, where("brand", "==", query.brand));
    let querySnapshot = await getDocs(q);
    
    // If no results, try matching by 'sellers' field which might contain brand info
    if (querySnapshot.empty) {
      q = query(productsRef, where("sellers", "==", query.brand));
      querySnapshot = await getDocs(q);
    }
    
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      data,
      query,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      error,
      query,
    };
  }
};
