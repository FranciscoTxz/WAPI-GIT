import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEi_8Z_o95S70CZB28rFme9VQBTrfbHIY",
  authDomain: "wapi-cansado.firebaseapp.com",
  projectId: "wapi-cansado",
  storageBucket: "wapi-cansado.appspot.com",
  messagingSenderId: "55148773458",
  appId: "1:55148773458:web:fe03833848b0e32a235f8b",
  measurementId: "G-QTQPFLV9KN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
