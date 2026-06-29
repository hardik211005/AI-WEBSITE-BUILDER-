// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "website-builder-28c46.firebaseapp.com",
  projectId: "website-builder-28c46",
  storageBucket: "website-builder-28c46.firebasestorage.app",
  messagingSenderId: "917022580307",
  appId: "1:917022580307:web:854b6f4f882287297cb0a6",
  measurementId: "G-HSGKNCXNX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
