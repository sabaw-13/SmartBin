// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnuBD17tgnyKcNPymCiIYHzNwM-Tj79Mk",
  authDomain: "smartbinproject-61eef.firebaseapp.com",
  databaseURL: "https://smartbinproject-61eef-default-rtdb.firebaseio.com",
  projectId: "smartbinproject-61eef",
  storageBucket: "smartbinproject-61eef.firebasestorage.app",
  messagingSenderId: "1051466190335",
  appId: "1:1051466190335:web:e1dfa2476b4634c3ea6bca"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
