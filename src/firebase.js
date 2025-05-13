// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL7rU512HC13zdPyi7U0cZxSN8cYqxyps",
  authDomain: "smvduverse-30afd.firebaseapp.com",
  projectId: "smvduverse-30afd",
  storageBucket: "smvduverse-30afd.firebasestorage.app",
  messagingSenderId: "797186744914",
  appId: "1:797186744914:web:24b682843118c0e221358b",
  measurementId: "G-7HHPJ22KC9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
