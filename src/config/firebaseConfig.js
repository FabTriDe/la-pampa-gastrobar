import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_kT9QJdh1t7yR7bqmcUL1XEjch6q8tVQ",
  authDomain: "la-pampa-app-f6066.firebaseapp.com",
  projectId: "la-pampa-app-f6066",
  storageBucket: "la-pampa-app-f6066.appspot.com",
  messagingSenderId: "12663113587",
  appId: "1:12663113587:web:d4a50b94fd6590d4a56706",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };