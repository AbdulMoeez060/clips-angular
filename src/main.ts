import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import firebase from "firebase/compat/app";
import "firebase/compat/auth"
const firebaseConfig = {
  apiKey: "AIzaSyAJDY4cRHZQCm2jMk8ngMbK5aun3trOIRU",
  authDomain: "clips-7d7f4.firebaseapp.com",
  projectId: "clips-7d7f4",
  storageBucket: "clips-7d7f4.appspot.com",
  messagingSenderId: "177933045398",
  appId: "1:177933045398:web:3b8f8d6577a8d674fafcb7",
  measurementId: "G-XXG6RQ9270"
};
firebase.initializeApp(firebaseConfig)
let appInit = false;

firebase.auth().onAuthStateChanged(()=>{
  if (!appInit) {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
    appInit = true
  }

})

