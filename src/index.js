import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import './index.css';

// Needed for onTouchTap
injectTapEventPlugin();

ReactDOM.render(
  <Router history={hashHistory}>
  <Route path="/" component={App}>
  </Route>
</Router>,
  document.getElementById('root')
);
