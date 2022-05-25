// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAvn_h4Xr55_IyUBggmsfy1NQ27CVq0eH8",
  authDomain: "josborne-dev.firebaseapp.com",
  projectId: "josborne-dev",
  storageBucket: "josborne-dev.appspot.com",
  messagingSenderId: "102599981598",
  appId: "1:102599981598:web:07914a5f817c74aad6cc0f",
  measurementId: "G-8K3V40GE51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
