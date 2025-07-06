// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth , GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb3O0BHBA49-19rWqYwRwnhziIiya2Eig",
  authDomain: "spendzy-97125.firebaseapp.com",
  projectId: "spendzy-97125",
  storageBucket: "spendzy-97125.appspot.com",
  messagingSenderId: "155582038704",
  appId: "1:155582038704:web:9d7dd5646a8c81a844f175",
  measurementId: "G-MC41B8Y8H0"
};

// Initialize Firebase`
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let analytics;
if(typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export {db, auth, provider, doc, setDoc};