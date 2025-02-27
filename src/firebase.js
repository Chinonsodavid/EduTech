import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBjpo15Nn6pCGpztP8Mr-A6ZQNqox42Fhw",
    authDomain: "edutech-e09a2.firebaseapp.com",
    projectId: "edutech-e09a2",
    storageBucket: "edutech-e09a2.appspot.com", // ✅ Fixed here
    messagingSenderId: "880334951581",
    appId: "1:880334951581:web:fa48708657b2bcaba9b074",
    measurementId: "G-RCDJJ203BW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth };
