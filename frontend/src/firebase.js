// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';


// const firebaseConfig = {
//   apiKey: "AIzaSyD48H6dZtTtgYJ2HaKFaxynMtNVX82ySDU",
//   authDomain: "fir-authentication-605d6.firebaseapp.com",
//   projectId: "fir-authentication-605d6",
//   storageBucket: "fir-authentication-605d6.firebasestorage.app",
//   messagingSenderId: "444297858298",
//   appId: "1:444297858298:web:3d024b2bc764e863878d43"
// };

// firebase.initializeApp(firebaseConfig);

// auth = firebase.auth();
// googleProvider = new firebase.auth.GoogleAuthProvider();

// export { auth, googleProvider, firebase };



// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD48H6dZtTtgYJ2HaKFaxynMtNVX82ySDU",
  authDomain: "fir-authentication-605d6.firebaseapp.com",
  projectId: "fir-authentication-605d6",
  storageBucket: "fir-authentication-605d6.appspot.com", // ⚠️ fix incorrect domain
  messagingSenderId: "444297858298",
  appId: "1:444297858298:web:3d024b2bc764e863878d43"
};

firebase.initializeApp(firebaseConfig);

// ✅ Properly declare variables before exporting
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider, firebase };
