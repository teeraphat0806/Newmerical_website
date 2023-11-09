
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAgqsMYBBPu6GgcbpRGX8lVP-n_SYkQUOs",
  authDomain: "tdatabase-2eda0.firebaseapp.com",
  databaseURL: "https://tdatabase-2eda0-default-rtdb.firebaseio.com",
  projectId: "tdatabase-2eda0",
  storageBucket: "tdatabase-2eda0.appspot.com",
  messagingSenderId: "672970078360",
  appId: "1:672970078360:web:3ed36ae2aee1f31cc738ed",
  measurementId: "G-BMLBZ9V9WY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
