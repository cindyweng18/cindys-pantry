// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4GKghpcOqT4Ngu1aOVD1psxYZn1EBETU",
  authDomain: "cindys-pantry.firebaseapp.com",
  projectId: "cindys-pantry",
  storageBucket: "cindys-pantry.appspot.com",
  messagingSenderId: "1094232030132",
  appId: "1:1094232030132:web:771b7e8692d813c62e90e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore}