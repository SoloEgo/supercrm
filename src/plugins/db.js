import firebase from "@/plugins/firebase"
import 'firebase/firestore'
const config = {
    apiKey: "AIzaSyBRnuLWtVJPHwID_3V-uDbW4Gp4sXE1uas",
    authDomain: "my-crm-fca31.firebaseapp.com",
    projectId: "my-crm-fca31",
    storageBucket: "my-crm-fca31.appspot.com",
    messagingSenderId: "169169778793",
    appId: "1:169169778793:web:bb6804d441baba22a50af8",
    measurementId: "G-8TD59M8M7X",
    databaseURL: "https://my-crm-fca31-default-rtdb.europe-west1.firebasedatabase.app/"
};


export const db = firebase.firestore()

//export const db = firebaseStore.initializeApp(config).firestore()