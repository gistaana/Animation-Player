import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDkh9Rbu0gpzhjuRzjP-oh1QArT222ORcQ",
    authDomain: "animation-player.firebaseapp.com",
    databaseURL: "https://animation-player-default-rtdb.firebaseio.com",
    projectId: "animation-player",
    storageBucket: "animation-player.appspot.com",
    messagingSenderId: "159151867230",
    appId: "1:159151867230:web:44bfc932c48ff3ba507bcf",
    measurementId: "G-620CRV9VHJ"
  };


const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
export const db = getFirestore(app);

export default app; 