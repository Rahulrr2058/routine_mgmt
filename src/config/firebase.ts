// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAK93Pe0ecg3sM91Ygng-hvZWheYSDJ_nw",
    authDomain: "damipasal-b38c4.firebaseapp.com",
    projectId: "damipasal-b38c4",
    storageBucket: "damipasal-b38c4.firebasestorage.app",
    messagingSenderId: "982613959255",
    appId: "1:982613959255:web:517fa3116637c48aeab912"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);