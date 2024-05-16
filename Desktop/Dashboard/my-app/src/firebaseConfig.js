import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    x = "input your firebase config information here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
//export cái firebaseConfig ra ngoài để App.jsx nhận
export const db = getFirestore(app);
export const auth = getAuth(app);
export default firebaseConfig;