import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import styles from "./login.module.scss";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { auth } from "../../config/firebase";

export default function LoginPage() {
  const [page, setPage] = useState("login");
  const router = useRouter();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Create a safety wrapper for auth state listener
    try {
      // Get auth directly to avoid potential issues with imported auth
      const authInstance = auth;
      console.log("Auth instance:", authInstance ? "Valid" : "Invalid");
      
      // Store a flag in sessionStorage to track if this is an intentional login attempt
      // This helps prevent immediate redirects when a user is trying to log out
      if (typeof window !== "undefined" && router.query.redirect === "true") {
        sessionStorage.setItem("intentionalLogin", "true");
      }
      
      const isIntentionalLogin = typeof window !== "undefined" && 
                               (router.query.redirect === "true" || 
                                sessionStorage.getItem("intentionalLogin") === "true");
      
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
        
        // Only redirect if user exists AND this isn't an intentional login/logout attempt
        if (user && !isIntentionalLogin) {
          router.push("/");
        } else if (!user && typeof window !== "undefined") {
          // If no user, clear the intentional login flag
          sessionStorage.removeItem("intentionalLogin");
        }
      });
      
      return () => {
        console.log("Cleaning up auth state listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error in auth state listener setup:", error);
      return () => {}; // Return empty cleanup function
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <a className={styles.logo}>Dapper Wear</a>
      <div className={styles.content}>
        <div className={styles.switchContainer}>
          <button
            className={styles.switchButton}
            onClick={() => setPage("login")}
            style={{ backgroundColor: page === "login" ? "white" : "#f6f6f6" }}
          >
            <span>Login</span>
          </button>
          <button
            className={styles.switchButton}
            onClick={() => setPage("register")}
            style={{
              backgroundColor: page === "register" ? "white" : "#f6f6f6",
            }}
          >
            <span>Register</span>
          </button>
        </div>
        {page === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
