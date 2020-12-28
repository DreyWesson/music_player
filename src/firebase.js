// import firebase from "firebase";
import firebase from "firebase/app";
import "firebase/firestore";
// import "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTWMlpJnezM3Xlr5xZRkoB2MEfOqOs0ZQ",
  authDomain: "music-player-351e8.firebaseapp.com",
  projectId: "music-player-351e8",
  storageBucket: "music-player-351e8.appspot.com",
  messagingSenderId: "34596090778",
  appId: "1:34596090778:web:cb396f091469881ec30023",
  measurementId: "G-X2SPK5DNB2",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
// const auth = firebase.auth();
// const provider = new firebase.auth.GoogleAuthProvider();

// export { auth, provider };
export default db;
