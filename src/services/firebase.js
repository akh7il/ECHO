import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1sI5L6wKizmGQOPjFcyM93klW6I6JLFA",
  authDomain: "echo-55958.firebaseapp.com",
  projectId: "echo-55958",
  storageBucket: "echo-55958.firebasestorage.app",
  messagingSenderId: "542660838713",
  appId: "1:542660838713:web:143049fb019563a327d4e8",
  measurementId: "G-QQ98P18WQ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  
export const db = getFirestore(app);
export const storage = getStorage(app)