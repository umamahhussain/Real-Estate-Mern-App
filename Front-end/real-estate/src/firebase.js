// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-real-estate-e7ac7.firebaseapp.com",
	projectId: "mern-real-estate-e7ac7",
	storageBucket: "mern-real-estate-e7ac7.firebasestorage.app",
	messagingSenderId: "1005954517356",
	appId: "1:1005954517356:web:4923244f4b8bc8b6830b49",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
