import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCE9tzFNZmNAQty-SxR2DHc5l8_yAXAM80",
    authDomain: "instagram-react-a7d21.firebaseapp.com",
    databaseURL: "https://instagram-react-a7d21.firebaseio.com",
    projectId: "instagram-react-a7d21",
    storageBucket: "instagram-react-a7d21.appspot.com",
    messagingSenderId: "323365485711",
    appId: "1:323365485711:web:874ee5bef3ade22c5384fa",
    measurementId: "G-8LK4K6FDKN"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};

