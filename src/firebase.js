import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "spendzy-97125.firebaseapp.com",
  projectId: "spendzy-97125",
  storageBucket: "spendzy-97125.appspot.com",
  messagingSenderId: "155582038704",
  appId: "1:155582038704:web:9d7dd5646a8c81a844f175",
  measurementId: "G-MC41B8Y8H0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };