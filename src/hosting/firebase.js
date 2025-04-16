// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzywA4nwZ3Qik8zbiDS57qQ6a3Dvjuxqk",
  authDomain: "petremind-9845c.firebaseapp.com",
  projectId: "petremind-9845c",
  storageBucket: "petremind-9845c.firebasestorage.app",
  messagingSenderId: "721035037357",
  appId: "1:721035037357:web:bc8139f45cc6315947d424",
  measurementId: "G-K24LT9JBKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);