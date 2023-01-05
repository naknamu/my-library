import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { collection, addDoc } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyANa1SMpeifgc5ljTC08GL_k8Aoc_sUfkQ",
    authDomain: "library-6224e.firebaseapp.com",
    projectId: "library-6224e",
    storageBucket: "library-6224e.appspot.com",
    messagingSenderId: "180612957769",
    appId: "1:180612957769:web:0963d8ce9e50582dfea198"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;

// try {
//     const docRef = await addDoc(collection(db, "users"), {
//         first: "Naruto",
//         last: "Uzumaki",
//         born: 1801
//     });
//     console.log("Document written with ID: ", docRef.id );
// } catch(e) {
//     console.log("Error adding document: ", e);
// }