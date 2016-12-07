/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AppBar} from 'material-ui';
import _ from 'lodash';
import RadioPlayer from './ReactPlayer';
import Search from './Search';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import firebase from 'firebase';
import {Link, hashHistory} from 'react-router';

import LandingPage from './LandingPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: null,
      userID: null
    };
    this.searchCallback = this.searchCallback.bind(this);
  }

  signOut = () =>  {
    if(hashHistory.getCurrentLocation().pathname !== '/') {
      firebase.auth().signOut().then(() => hashHistory.push('/'))
    }
    else {
      firebase.auth().signOut().then(() => this.forceUpdate())
    }
  }

  goHome = () => {
    if(hashHistory.getCurrentLocation().pathname !== '/') {
      hashHistory.push('/');
    }
  }

  componentDidMount() {
   /* Add a listener and callback for authentication events */
   firebase.auth().onAuthStateChanged(user => {
     if(user) {
       console.log('Auth state changed: logged in as', user.email);
       this.setState({userID:user.uid});
       this.setState({userEmail:user.email})
     }
     else{
       console.log('Auth state changed: logged out');
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null})
     }
   })
 }

  //Callback to handle search results
  searchCallback = result => {
    console.log(result);
  }

  render() {

    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <AppBar
              title={<span style={{cursor: 'pointer'}} onClick={this.goHome}>iRadio</span>}
              iconElementRight={<FlatButton label={this.state.userEmail ? this.state.userEmail + " | Sign Out" : "Not logged In"} onTouchTap={this.state.userID ? this.signOut : this.goHome} />}
              showMenuIconButton={false}
            />
          </MuiThemeProvider>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
