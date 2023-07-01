import firebase from 'firebase';
import "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyChMvCE7bUN4BoUmG18DyXe51512fyj9n0",
    authDomain: "houseed-50461.firebaseapp.com",
    projectId: "houseed-50461",
    storageBucket: "houseed-50461.appspot.com",
    messagingSenderId: "289236507834",
    appId: "1:289236507834:web:33070f821f22771ca1f683"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };