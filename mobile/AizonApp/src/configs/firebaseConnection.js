import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
  apiKey: "AIzaSyDnz-rdYl-4fmVmAoWzJfv9K8Z-2N1RPP4",
  authDomain: "meuappreact-6f2d8.firebaseapp.com",
  databaseURL: "https://meuappreact-6f2d8.firebaseio.com",
  projectId: "meuappreact-6f2d8",
  storageBucket: "meuappreact-6f2d8.appspot.com",
  messagingSenderId: "333943617127",
  appId: "1:333943617127:web:8737d359ad488df69746c2",
  measurementId: "G-VEWDY39522"
};

if(!firebase.apps.length){
  //Abrir minha conexao
  firebase.initializeApp(firebaseConfig);
}

export default firebase;