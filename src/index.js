import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {SignUpForm} from './SignUp';
import {SignInForm} from './SignIn';
import {Queue} from './SongList';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import './index.css';
import firebase from 'firebase';

// Needed for onTouchTap
injectTapEventPlugin();
var config = {
  apiKey: "AIzaSyBVGyJq21xT2zRpbNMqBAtvq9haT7gMI08",
  authDomain: "iradio-614db.firebaseapp.com",
  databaseURL: "https://iradio-614db.firebaseio.com",
  storageBucket: "iradio-614db.appspot.com",
  messagingSenderId: "552716146199"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={hashHistory}>
  <Route path="/" component={App}>
    <Route path="login" component={SignInForm} />
    <Route path="join" component={SignUpForm} />
    <Route path="now" component={Queue} />
  </Route>
</Router>,
  document.getElementById('root')
);
