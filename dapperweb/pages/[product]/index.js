import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { db } from "@/firebase/config";
import { useAuth } from "@/firebase/context";
import { useCart } from "hooks/cart.hook";
import { removeFavorite, addFavorite, addToCart } from "@/firebase/product";
import { collection, doc, getDoc, query, where, documentId, getDocs } from "firebase/firestore";

import styles from "./product.module.scss";

import Layout from "components/Layout";
import Button from "@/components/Button";
import HeartIcon from "@/icons/heart";
import HeartFilled from "@/icons/heart-filled";
import ErrorPage from "pages/404";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard/product-card";

export default function Product({ data, query }) {
  if (!data.productData || !data.productData.productDisplayName) {
    return <ErrorPage />;
  }

  const [selectedSize, setSelectedSize] = useState();
  const [isFavorite, setFavorite] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  const product_data = data.productData;
  const prod_id = product_data.id;
  const product_name = product_data.productDisplayName;
  const price = 142 + (product_data.price || 0); // Adding markup or using fallback
  const sale_price = product_data.price || 0;
  const image = product_data.link || "/placeholder-product.jpg"; // Fallback image
  const gender = product_data.gender;
  const masterCategory = product_data.masterCategory;
  const subCategory = product_data.subCategory;
  const articleType = product_data.articleType;
  const baseColour = product_data.baseColour;
  const season = product_data.season;
  const usage = product_data.usage;
  const year = product_data.year;

  // Format product information to display relevant details
  const information = `${gender}'s ${articleType} - ${baseColour}
Color: ${baseColour}
Category: ${masterCategory} > ${subCategory} > ${articleType}
Usage: ${usage}
Season: ${season} ${year}`;

  const id = query?.product;

  useEffect(() => {
    user && setFavorite(user.favorites?.includes(id));
  }, [user, id]);

  const removeEvent = (id) => {
    removeFavorite(id);
    setFavorite(false);
  };
  
  const addEvent = (id) => {
    addFavorite(id);
    setFavorite(true);
  };

  const favoriteEvent = () => {
    user
      ? isFavorite
        ? removeEvent(id)
        : addEvent(id)
      : typeof window !== "undefined" && router.push("/login");
  };

  const cart = useCart().data;

  const addCartEvent = () => {
    if (!user && !loading && typeof window !== "undefined")
      router.push("/login");
    else {
      if (selectedSize) {
        const newCart = {
          ...cart,
          [id]: cart.hasOwnProperty(id)
            ? [...cart[id], selectedSize]
            : [selectedSize],
        };
        addToCart(newCart);
      } else {
        // If no size is selected or available
        const newCart = {
          ...cart,
          [id]: cart.hasOwnProperty(id) ? [...cart[id], "-"] : ["-"],
        };
        addToCart(newCart);
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>{product_name} | Fashion Store</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.photosContainer}>
            <div className={styles.carouselContainer}>
              <img src={image} loading="lazy" alt={product_name} />
            </div>
            <hr />
          </div>
          <div className={styles.productInfos}>
            <div className={styles.header}>
              <h1 className={styles.productTitle}>{product_name || ""}</h1>
              <div className={styles.categoryLabel}>{masterCategory} / {subCategory}</div>
            </div>
            <span className={styles.priceText}>{price}$</span>
            <div className={styles.saleContainer}>
              <span className={styles.saleText}>{sale_price}$</span>
              <span className={styles.savedText}>
                {"(You will be saved " + (price - sale_price) + "$!)"}
              </span>
            </div>
            <hr />
            <div className={styles.buttons}>
              <Button style={{ margin: 0 }} onClick={addCartEvent}>
                Add to Cart
              </Button>
              <button className={styles.favButton} onClick={favoriteEvent}>
                {isFavorite ? (
                  <HeartFilled width={24} height={24} />
                ) : (
                  <HeartIcon width={24} height={24} />
                )}
              </button>
            </div>
            <hr />
            <div className={styles.infoContainer}>
              <h4 className={styles.sizesText}>Product Information</h4>
              <p className={styles.infoText}>{information}</p>
            </div>
          </div>
        </main>
        <hr />
        <div className={styles.recommendContainer}>
          <h2>Similar Products</h2>
          <div className={styles.products}>
            {!loading && data.recommendedProducts &&
              data.recommendedProducts.map((product) => {
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
        </div>
      </div>
    </Layout>
  );
}

Product.getInitialProps = async function ({ query }) {
  let data = {};
  let error = null;
  let productData = {};
  let recommendedProducts = [];
  
  try {
    // Fetch the product details from the fashion database
    const productDocRef = doc(db, "fashion", query.product);
    const productDocSnap = await getDoc(productDocRef);
    
    if (productDocSnap.exists()) {
      productData = { id: productDocSnap.id, ...productDocSnap.data() };
      
      // For recommended products - find products with same category, articleType, or gender
      const productsRef = collection(db, "fashion");
      
      // Query for similar products
      let similarQuery;
      
      if (productData.articleType) {
        // Get products with same articleType (e.g., "Tshirts")
        similarQuery = query(
          productsRef, 
          where("articleType", "==", productData.articleType),
          where("id", "!=", productData.id)
        );
      } else if (productData.subCategory) {
        // Fallback to subCategory
        similarQuery = query(
          productsRef, 
          where("subCategory", "==", productData.subCategory),
          where("id", "!=", productData.id)
        );
      } else {
        // Last fallback to masterCategory
        similarQuery = query(
          productsRef, 
          where("masterCategory", "==", productData.masterCategory),
          where("id", "!=", productData.id)
        );
      }
      
      const recommendedSnapshot = await getDocs(similarQuery);
      
      // Limit to 4 recommended products
      recommendedProducts = recommendedSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .slice(0, 4);
      
      // If recommendation API is working, uncomment this section
      /* 
      // Alternative approach using your recommendation API
      const res = await fetch(`http://localhost:5000/recommend?id=${productData.id}`);
      const recommendedProductsIds = await res.json();
      
      if (recommendedProductsIds && recommendedProductsIds.result) {
        const recommendIdStrings = recommendedProductsIds.result.map(id => id.toString());
        
        // Fetch the recommended products from Firestore
        const recommendedByIdQuery = query(
          productsRef, 
          where(documentId(), "in", recommendIdStrings)
        );
        
        const recommendedByIdSnapshot = await getDocs(recommendedByIdQuery);
        recommendedProducts = recommendedByIdSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      */
      
    } else {
      console.error("Product not found");
      error = "Product not found";
    }
    
  } catch (e) {
    console.error("Error fetching product data:", e);
    error = e.message;
  }

  data = {
    productData,
    recommendedProducts
  };

  return {
    data,
    error,
    query,
  };
};