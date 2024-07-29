// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export {app, firebaseConfig}