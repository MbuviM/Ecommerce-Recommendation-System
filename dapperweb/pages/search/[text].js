import React from "react";
import Head from "next/head";
import styles from "./search.module.scss";
import Layout from "components/Layout";
import Button from "@/components/FilterButton";
import ProductCard from "@/components/ProductCard/product-card";
import { useAuth } from "@/firebase/context";

export default function SearchPage({ data = [], query, error = null }) {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Search Results for {query.text}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {error ? "Error loading results" : `Found ${data.length} items for "${query.text}"`}
            </h1>
            <div className={styles.headerButtons}>
              <Button type="sort" style={{ marginRight: 20 }} />
              <Button count={0} />
            </div>
          </div>

          {error ? (
            <div className={styles.error}>
              <p>Couldn't load search results. Please try again.</p>
              {process.env.NODE_ENV === 'development' && (
                <details>
                  <summary>Error details</summary>
                  <pre>{error.message}</pre>
                </details>
              )}
            </div>
          ) : (
            <div className={styles.products}>
              {data.length > 0 ? (
                data.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    brand={product.seller}
                    name={product.productDisplayName}
                    image={product.link}
                    price={product.price + 78}
                    sale_price={product.price}
                    favorite={user?.favorites?.includes(product.id)}
                  />
                ))
              ) : (
                <p className={styles.noResults}>No matching products found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

SearchPage.getInitialProps = async function ({ query }) {
  try {
    const res = await fetch(`/api/search?text=${encodeURIComponent(query.text)}`);
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const result = await res.json();
    
    return {
      data: result.searchResult || [],
      query
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      data: [],
      error: { message: error.message },
      query
    };
  }
};
