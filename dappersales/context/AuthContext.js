import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      let message = 'Login failed';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email format';
          break;
        case 'auth/user-disabled':
          message = 'Account disabled';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid credentials';
          break;
      }
      throw new Error(message);
    }
  }

  async function register(name, email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      try {
        await setDoc(doc(db, "Sellers", user.uid), {
          email,
          name,
          products: [],
          cart: {},
          phoneNumber: "",
          photoUrl: null,
          createdAt: new Date().toISOString()
        });
      } catch (dbError) {
        // Rollback user creation if Firestore fails
        await user.delete();
        throw new Error('Failed to create user profile');
      }

      return userCredential;
    } catch (error) {
      let message = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email already registered';
          break;
        case 'auth/weak-password':
          message = 'Password too weak (min 6 chars)';
          break;
      }
      throw new Error(message);
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Sellers", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}