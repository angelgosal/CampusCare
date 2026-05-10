import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOYzeLr7ligJPSQ6ZppZXVbDVRtpG1sK8",
  authDomain: "campuscare-8f3e4.firebaseapp.com",
  projectId: "campuscare-8f3e4",
  storageBucket: "campuscare-8f3e4.firebasestorage.app",
  messagingSenderId: "48238727852",
  appId: "1:48238727852:web:4e9e8f9b896d913af10509"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, doc };