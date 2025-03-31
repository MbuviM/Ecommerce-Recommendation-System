import React from "react";
import { db } from "@/config/firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import Head from "next/head";
import styles from "./category.module.scss";
import Layout from "components/Layout";
import Button from "@/components/FilterButton";
import ProductCard from "@/components/ProductCard/product-card";
import { useAuth } from "@/firebase/context";

const getEmoji = {
  Apparel: "👚",
  Footwear: "👠",
  Accessories: "👜",
  'Sporting Goods': "🤸",
  'Personal Care': "🎁",
  Home: "🏡",
};

export default function Category({ data, query }) {
  const { user, loading } = useAuth();

  console.log(user, loading);

  // const formattedName =
  //   query.category === "gifts_and_living"
  //     ? "Gifts & Living"
  //     : query.category[0].toUpperCase() + query.category.slice(1);
  let formattedName = query.category
  if(query.category.includes("_")) {
    formattedName = query.category.replace("_", " ")
  }

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
              <span className={styles.emoji}>{getEmoji[query.category]}</span>
              {formattedName}
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
                    brand={product.sellers}
                    name={product.productDisplayName}
                    image={product.link}
                    price={product.price + 142}
                    sale_price={product.price}
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

Category.getInitialProps = async function ({ query }) {
  try {
    let formattedName = query.category;
    if (query.category.includes("_")) {
      formattedName = query.category.replace("_", " ");
    }

    const productsRef = collection(db, "Products");
    const q = query(
      productsRef,
      where("masterCategory", "==", formattedName),
      limit(30)
    );
    const querySnapshot = await getDocs(q);
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
