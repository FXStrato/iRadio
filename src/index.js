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
  apiKey: "AIzaSyDXZgOUaCyE383c5EDHJ0ku6GseX5J6BM8",
  authDomain: "iradio-f1ac9.firebaseapp.com",
  databaseURL: "https://iradio-f1ac9.firebaseio.com",
  storageBucket: "iradio-f1ac9.appspot.com",
  messagingSenderId: "213823088604"
};
firebase.initializeApp(config);

//load other CSS files
import '../node_modules/materialize-css/dist/css/materialize.min.css';

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
