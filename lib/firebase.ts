import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCse1lVLJJ9buR2oudQpDJUtz32kLdgFR4",
  authDomain: "marketer-simulator.firebaseapp.com",
  projectId: "marketer-simulator",
  storageBucket: "marketer-simulator.firebasestorage.app",
  messagingSenderId: "481743210056",
  appId: "1:481743210056:web:98a96f45ba1a582732fa7d",
  measurementId: "G-GTNE7BMS03"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db }; 