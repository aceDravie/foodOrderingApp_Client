import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCt6dJdH4xishapueoyKMXhTupZ-Fqpy5M",
  authDomain: "foodorderingapp-c3d34.firebaseapp.com",
  projectId: "foodorderingapp-c3d34",
  storageBucket: "foodorderingapp-c3d34.appspot.com",
  messagingSenderId: "613695121277",
  appId: "1:613695121277:web:dd5dd4482816610738ce14",
  measurementId: "G-GTLKHE5NM1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
const analytics = getAnalytics(app);
