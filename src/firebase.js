// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXI3xF8WD5bi-RZ4ALh2mI_NOUg8lbPG8",
  authDomain: "netflix-react-yt-1a5fb.firebaseapp.com",
  projectId: "netflix-react-yt-1a5fb",
  storageBucket: "netflix-react-yt-1a5fb.appspot.com",
  messagingSenderId: "221248813334",
  appId: "1:221248813334:web:64929886f4dda0605ef837"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
