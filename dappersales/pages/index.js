import Head from 'next/head'
import Image from 'next/image'
import Logoutscreen from '../components/Logoutscreen'
import styles from '../styles/Home.module.css'
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../Firebase'
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser, userData } = useAuth();

  return (
    <>
      <Head>
        <title>Dapper Wear - Seller Dashboard</title>
        <meta name="description" content="Dapper Wear seller dashboard" />
      </Head>
      
      {currentUser ? (
        <>
          <div className={styles.mainheadingcomp}>
            <p className={styles.mainheading}>Welcome to Sellers Section Of Dapper Wear</p>
          </div>

          <div className={styles.displaySection}>
            <h2 className={styles.heading}>Your Products</h2>
            {userData?.products?.length > 0 ? (
              <div className={styles.productsGrid}>
                {/* Product listing would go here */}
                <p>You have {userData.products.length} products</p>
              </div>
            ) : (
              <p className={styles.emptyMessage}>You haven't added any products yet.</p>
            )}
          </div>
        </>
      ) : (
        <Logoutscreen />
      )}
    </>
  )
}
