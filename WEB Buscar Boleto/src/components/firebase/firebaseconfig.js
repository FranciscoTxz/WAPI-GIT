// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEi_8Z_o95S70CZB28rFme9VQBTrfbHIY",
  authDomain: "wapi-cansado.firebaseapp.com",
  projectId: "wapi-cansado",
  storageBucket: "wapi-cansado.appspot.com",
  messagingSenderId: "55148773458",
  appId: "1:55148773458:web:16095b9670b5d418235f8b",
  measurementId: "G-KY6ETS0199"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);