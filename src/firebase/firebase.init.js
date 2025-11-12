// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Dangers work do not share publicly

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC40sRDPFjoBuITTQg67gcYVh3Z-QTHdS4",
  authDomain: "email-pass-auth-37764.firebaseapp.com",
  projectId: "email-pass-auth-37764",
  storageBucket: "email-pass-auth-37764.firebasestorage.app",
  messagingSenderId: "650907677923",
  appId: "1:650907677923:web:bd4921d8127cb5183b41d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Export app for other Firebase services (Firestore, Storage, etc.)
export { app };