import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import Room from './Room';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import './index.css';
import LandingPage from './LandingPage.js';

// Needed for onTouchTap
injectTapEventPlugin();

// Needed for users joining in the middle of a song
localStorage.setItem("updated", JSON.stringify(false));

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBMndQIkM87gzotseHEbGs72_gCCgKs88k",
  authDomain: "iradio-e3e09.firebaseapp.com",
  databaseURL: "https://iradio-e3e09.firebaseio.com",
  storageBucket: "iradio-e3e09.appspot.com",
  messagingSenderId: "701096491094"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage} />
      <Route path="room/:roomID" component={Room}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
