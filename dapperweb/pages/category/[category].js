import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, query as firestoreQuery, where, limit, getDocs, orderBy } from "firebase/firestore";
import Head from "next/head";
import styles from "./category.module.scss";
import Layout from "components/Layout";
import Button from "@/components/FilterButton";
import ProductCard from "@/components/ProductCard/product-card";
import { useAuth } from "@/firebase/context";

const getEmoji = {
  'Apparel': "👚",
  'Footwear': "👠",
  'Accessories': "👜",
  'Sporting Goods': "🤸",
  'Personal Care': "🎁",
  'Home': "🏡",
};

export default function Category({ data, queryParams, debugInfo }) {
  const { user, loading } = useAuth();
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);

  useEffect(() => {
    // Set flag after initial render to confirm component is mounting with data
    setHasLoadedProducts(true);
    console.log("Category component mounted with data:", data);
    console.log("Debug info:", debugInfo);
  }, []);

  let formattedName = queryParams.category;
  if(queryParams.category.includes("_")) {
    formattedName = queryParams.category.replace(/_/g, " ");
  }
  // Capitalize first letter of each word
  formattedName = formattedName.replace(/\b\w/g, l => l.toUpperCase());

  // Fallback emoji if category not found in mapping
  const categoryEmoji = getEmoji[formattedName] || "🛍️";

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>{formattedName} - Fashion Store</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.emoji}>{categoryEmoji}</span>
              {formattedName}
            </h1>
            <div className={styles.headerButtons}>
              <Button type="sort" style={{ marginRight: 20 }} />
              <Button count={0} />
            </div>
          </div>
          
          {data.length === 0 && hasLoadedProducts ? (
            <div className={styles.noProducts}>
              <p>No products found in this category. Please try another category.</p>
              {debugInfo && <pre className={styles.debugInfo}>{JSON.stringify(debugInfo, null, 2)}</pre>}
            </div>
          ) : (
            <div className={styles.products}>
              {!loading &&
                data.map((product) => {
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      brand={product.sellers || product.masterCategory}
                      name={product.productDisplayName}
                      image={product.link || "/placeholder-product.jpg"}
                      price={(product.price || 0) + 142}
                      sale_price={product.price || 0}
                      favorite={user?.favorites?.includes(product.id)}
                    />
                  );
                })}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

Category.getInitialProps = async function ({ query: routeQuery }) {
  try {
    let formattedName = routeQuery.category;
    if (routeQuery.category.includes("_")) {
      formattedName = routeQuery.category.replace(/_/g, " ");
    }
    
    // Format category name for display (capitalized)
    const displayFormattedName = formattedName.replace(/\b\w/g, l => l.toUpperCase());
    
    // Create lowercase version for case-insensitive matching
    const lowercaseFormattedName = formattedName.toLowerCase();

    // Debug information to help diagnose issues
    const debugInfo = {
      queryCategory: routeQuery.category,
      formattedName: formattedName,
      displayFormattedName: displayFormattedName,
      lowercaseFormattedName: lowercaseFormattedName,
      timestamp: new Date().toISOString(),
      searchSteps: []
    };

    console.log("Fetching products for category:", displayFormattedName);
    
    // Initialize data array to store products
    let data = [];
    let querySnapshot;
    const productsRef = collection(db, "fashion");
    
    // Step 1: Try exact match on masterCategory
    const exactMatchQuery = firestoreQuery(
      productsRef,
      where("masterCategory", "==", displayFormattedName),
      limit(30)
    );
    
    querySnapshot = await getDocs(exactMatchQuery);
    debugInfo.searchSteps.push({
      step: "Exact masterCategory match",
      query: displayFormattedName,
      found: querySnapshot.size
    });
    
    console.log(`Found ${querySnapshot.size} products with exact masterCategory match`);
    
    if (querySnapshot.size > 0) {
      data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      // Step 2: Try with original formatted name (not capitalized)
      const originalFormatQuery = firestoreQuery(
        productsRef,
        where("masterCategory", "==", formattedName),
        limit(30)
      );
      
      querySnapshot = await getDocs(originalFormatQuery);
      debugInfo.searchSteps.push({
        step: "Original format masterCategory match",
        query: formattedName,
        found: querySnapshot.size
      });
      
      console.log(`Found ${querySnapshot.size} products with original format masterCategory match`);
      
      if (querySnapshot.size > 0) {
        data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } else {
        // Step 3: Try subCategory match
        const subCategoryQuery = firestoreQuery(
          productsRef,
          where("subCategory", "==", displayFormattedName),
          limit(30)
        );
        
        querySnapshot = await getDocs(subCategoryQuery);
        debugInfo.searchSteps.push({
          step: "Exact subCategory match",
          query: displayFormattedName,
          found: querySnapshot.size
        });
        
        console.log(`Found ${querySnapshot.size} products with subCategory match`);
        
        if (querySnapshot.size > 0) {
          data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          // Step 4: Try subCategory with original format
          const subCategoryOriginalQuery = firestoreQuery(
            productsRef,
            where("subCategory", "==", formattedName),
            limit(30)
          );
          
          querySnapshot = await getDocs(subCategoryOriginalQuery);
          debugInfo.searchSteps.push({
            step: "Original format subCategory match",
            query: formattedName,
            found: querySnapshot.size
          });
          
          console.log(`Found ${querySnapshot.size} products with original format subCategory match`);
          
          if (querySnapshot.size > 0) {
            data = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
          } else {
            // Step 5: Manual case-insensitive search with a limited dataset
            console.log("Trying case-insensitive approach");
            
            const allProductsQuery = firestoreQuery(productsRef, limit(200));
            const allProductsSnapshot = await getDocs(allProductsQuery);
            
            debugInfo.searchSteps.push({
              step: "Manual case-insensitive search",
              totalChecked: allProductsSnapshot.size
            });
            
            console.log(`Checking among ${allProductsSnapshot.size} total products`);
            
            // Log sample document structure for debugging
            if (allProductsSnapshot.size > 0) {
              const sampleDoc = allProductsSnapshot.docs[0].data();
              console.log("Sample document structure:", Object.keys(sampleDoc));
              debugInfo.sampleDocumentKeys = Object.keys(sampleDoc);
            }
            
            // Manual case-insensitive filtering
            const matchingDocs = allProductsSnapshot.docs.filter(doc => {
              const docData = doc.data();
              
              // Check in masterCategory (case-insensitive)
              if (docData.masterCategory && 
                  docData.masterCategory.toLowerCase() === lowercaseFormattedName) {
                return true;
              }
              
              // Check in subCategory (case-insensitive)
              if (docData.subCategory && 
                  docData.subCategory.toLowerCase() === lowercaseFormattedName) {
                return true;
              }
              
              // Check if category name is included in product display name (partial match)
              if (docData.productDisplayName && 
                  docData.productDisplayName.toLowerCase().includes(lowercaseFormattedName)) {
                return true;
              }
              
              return false;
            });
            
            console.log(`Found ${matchingDocs.length} products after manual filtering`);
            debugInfo.searchSteps.push({
              step: "Manual filtering results",
              found: matchingDocs.length
            });
            
            if (matchingDocs.length > 0) {
              data = matchingDocs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
            }
          }
        }
      }
    }
    
    debugInfo.productsFound = data.length;
    console.log(`Returning ${data.length} products`);

    return {
      data,
      queryParams: routeQuery,
      debugInfo
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      error: error.toString(),
      queryParams: routeQuery,
      debugInfo: { error: error.toString() }
    };
  }
};