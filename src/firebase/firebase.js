// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// ** UAT
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "generic-app.firebaseapp.com",
  projectId: "generic-app",
  storageBucket: "generic-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ** Live
// const firebaseConfig = {
//   apiKey: "YOUR_LIVE_API_KEY",
//   authDomain: "generic-live.firebaseapp.com",
//   projectId: "generic-live",
//   storageBucket: "generic-live.appspot.com",
//   messagingSenderId: "YOUR_LIVE_SENDER_ID",
//   appId: "YOUR_LIVE_APP_ID"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default getFirestore();