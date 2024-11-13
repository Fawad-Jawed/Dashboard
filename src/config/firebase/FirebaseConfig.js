import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWJ-jCRhg8TmO4s6aazF_YKXR0_EqDu4I",
    authDomain: "dashboard-fff21.firebaseapp.com",
    projectId: "dashboard-fff21",
    storageBucket: "dashboard-fff21.appspot.com",
    messagingSenderId: "906909182153",
    appId: "1:906909182153:web:7807b8db4dd829f5380518",
    measurementId: "G-G7X27BPF3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);         // Firebase Authentication
const db = getFirestore(app);       // Firestore Database
const storage = getStorage(app);    // Firebase Storage

// Export services for use in the application
export {
    auth,
    db,
    storage,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
};
