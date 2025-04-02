import { auth, db } from "./config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';

async function emailRegister({ email, password }) {
  console.log("Registering user with email:", email);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered successfully with uid:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Error during registration:", error.code, error.message);
    
    // Translate Firebase errors into more user-friendly messages
    let errorMessage = "Registration failed. Please try again.";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "This email is already registered. Please login instead.";
        break;
      case 'auth/invalid-email':
        errorMessage = "The email address is not valid.";
        break;
      case 'auth/operation-not-allowed':
        errorMessage = "Email/password registration is not enabled.";
        break;
      case 'auth/weak-password':
        errorMessage = "Password is too weak. Please use a stronger password.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your internet connection.";
        break;
    }
    
    // Create a custom error with the friendly message
    const customError = new Error(errorMessage);
    customError.code = error.code;
    throw customError;
  }
}

async function registerDatabase({ id, email, name, surname }) {
  console.log("Creating user document for:", id);
  
  try {
    // Create document in Users collection
    const userRef = doc(db, "Users", id);
    await setDoc(userRef, {
      name,
      surname,
      email,
      createdAt: new Date().toISOString(),
      cart: {},
      favorites: [],
      orders: []
    });
    console.log("User document created successfully");
    return true;
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error("Error creating user profile. Please try again.");
  }
}

async function registerSellerDatabase({id, email, name}) {
  console.log("Creating seller document for:", id);
  
  try {
    // Create document in Users collection
    const sellerRef = doc(db, "Users", id);
    await setDoc(sellerRef, {
      name,
      email,
      products: [],
      addresses: [],
      cart: {},
      favorites: [],
      orders: [],
      phoneNumber: "",
      photoUrl: null,
      role: "seller",
      createdAt: new Date().toISOString()
    });
    console.log("Seller document created successfully");
    return true;
  } catch (error) {
    console.error("Error creating seller document:", error);
    throw new Error("Error creating seller profile. Please try again.");
  }
}

export { emailRegister, registerDatabase, registerSellerDatabase };
