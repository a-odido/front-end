
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyBSIiFvwqKbbD3592Gzne-6WUik3kNk2N0",
  authDomain: "tailor-boy.firebaseapp.com",
  projectId: "tailor-boy",
  storageBucket: "tailor-boy.firebasestorage.app",
  messagingSenderId: "594958770184",
  appId: "1:594958770184:web:499794b4d28ca5de6cb1bd",
  measurementId: "G-ETMPFEZ1K5"
};


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
