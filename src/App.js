/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import {RaisedButton, FlatButton, Dialog, TextField, List, ListItem, AppBar} from 'material-ui';
import _ from 'lodash';
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
    };
    this.searchCallback = this.searchCallback.bind(this);
  }

  //Callback to handle search results
  searchCallback = result => {
    console.log(result);
  }

  componentDidMount() {
    this.unregister =  firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('Auth state changed: logged in as', user.email);
        this.setState({userId:user.uid});
      } else {
        console.log('Auth state changed: logged out');
        this.setState({userId: null});
        hashHistory.push('/login');
      }
    })
  }

  render() {

    return (
      <div>
        <header>
          <Navbar/>
        </header>
        <main className="container">
          {this.props.children}
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

class Navbar extends Component {

  handleClick = () => {
    console.log("iRadio");
  };

  render() {

    const styles = {
      title: {
        cursor: 'pointer',
      },
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <AppBar
          title={<span style={styles.title}>iRadio</span>}
          onTitleTouchTap={this.handleClick()}
          iconElementRight={<FlatButton label="User" />}
        />
      </MuiThemeProvider>
    );
  };

}

export default App;
