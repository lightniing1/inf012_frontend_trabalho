import {initializeApp} from "firebase/app"
import{getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBcQfNQvZnNiILLkAoOgSQqq4TPHSIG0gI",
    authDomain: "pweb-9e12e.firebaseapp.com",
    projectId: "pweb-9e12e",
    storageBucket: "pweb-9e12e.appspot.com",
    messagingSenderId: "935009371073",
    appId: "1:935009371073:web:f9a87e6ce60c399988e540",
    measurementId: "G-2PZCRLMKTV"
  };
  

const app=initializeApp(firebaseConfig);
var auth=null;
if(app){
    auth=getAuth();
}

export default auth;