// ==========================
// Firebase
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


// ==========================
// TU CONFIGURACIÓN
// Reemplaza estos valores con
// los de tu proyecto en Firebase
// ==========================

const firebaseConfig = {
    apiKey: "AIzaSyC8Vo0vch-KOeR9EGDipAJzrricn8Kdxo8",
    authDomain: "nattback-5ba54.firebaseapp.com",
    projectId: "nattback-5ba54",
    storageBucket: "nattback-5ba54.firebasestorage.app",
    messagingSenderId: "917743600242",
    appId: "1:917743600242:web:6d521fda4d941977cbf8eb",
    measurementId: "G-WP27RZC24S"
  };

// ==========================

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);


// ==========================
// Función para guardar la cita
// ==========================

window.saveToFirebase = async function(data) {

    try {

        await addDoc(
            collection(db, "citas"),
            {
                ...data,
                createdAt: serverTimestamp()
            }
        );

        console.log("Cita guardada en Firebase ✓");
        return true;

    } catch (error) {

        console.error("Error al guardar:", error);
        return false;

    }

};
