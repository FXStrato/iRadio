import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import firebase from 'firebase';

  localStorage.setItem("updated", JSON.stringify(false));

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVGyJq21xT2zRpbNMqBAtvq9haT7gMI08",
    authDomain: "iradio-614db.firebaseapp.com",
    databaseURL: "https://iradio-614db.firebaseio.com",
    storageBucket: "iradio-614db.appspot.com",
    messagingSenderId: "552716146199"
  };
  firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
