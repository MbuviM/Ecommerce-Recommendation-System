import { auth } from "./config";

export default async function emailLogin({ email, password }) {
  console.log("Login attempt with email:", email);
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("Login successful for:", userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    
    // Translate Firebase errors into more user-friendly messages
    let errorMessage = "Login failed. Please check your email and password.";
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = "The email address is not valid.";
        break;
      case 'auth/user-disabled':
        errorMessage = "This account has been disabled.";
        break;
      case 'auth/user-not-found':
        errorMessage = "No account found with this email.";
        break;
      case 'auth/wrong-password':
        errorMessage = "Invalid password. Please try again.";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many failed login attempts. Please try again later.";
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
