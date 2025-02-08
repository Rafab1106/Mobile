// firebaseConfig.js
import { initializeApp } from "firebase/app";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAAyJ9PXgcVr8w3zFYA9zhzO5fJyDWlAf8",
    authDomain: "crypto-ae090.firebaseapp.com",
    projectId: "crypto-ae090",
    storageBucket: "crypto-ae090.firebasestorage.app",
    messagingSenderId: "555110624069",
    appId: "1:555110624069:web:66d63db3bec7e15b8b2c2c",
    measurementId: "G-5SSLVXMFKV"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

export default app;