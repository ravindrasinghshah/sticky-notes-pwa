// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, Auth, signOut } from "firebase/auth"; // Import the Auth service
import { getFirestore, Firestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyD1glfWlK1Xon2_Oojz7aNr67mUlrkxR7U",
  authDomain: "sticky-notes-fc76b.firebaseapp.com",
  projectId: "sticky-notes-fc76b",
  storageBucket: "sticky-notes-fc76b.firebasestorage.app",
  messagingSenderId: "157757958250",
  appId: "1:157757958250:web:db722d9171c57071bc8213",
  measurementId: "G-48CWWT5LN2",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);
const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app);
const logOut = () => {
  signOut(auth);
  window.location.href = "/";
};
export { auth, analytics, googleAuthProvider, db, logOut };
