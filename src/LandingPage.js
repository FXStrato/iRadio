import React from 'react';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import {AppBar, FlatButton, Tabs, Tab, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Link, hashHistory} from 'react-router';
import SignInForm from './SignIn.js';
import SignUpForm from './SignUp.js'
import Guest from './Guest.js';

//This component will need an auth listener; if the user is authed, then they shouldn't see sign in or sign up options, but create or join rooms.

class LandingPage extends React.Component {
  state = {
    signin: true
  }

  handleTap = () => {
    let currentState = this.state.signin;
    this.setState({signin: !currentState});
  }

  render() {

    let content = null;

    if(this.state.signin) {
      //Display signin
      content = <SignInForm/>
    } else {
      content = <SignUpForm/>
    }

    return (
      <Row>
        <Col s={12}>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <RaisedButton label={this.state.signin ? "Go to Sign Up" : "Go to Sign In"} onTouchTap={this.handleTap}/>
          </MuiThemeProvider>
        </Col>
        <Col s={12}>
          {content}
        </Col>
        <Col s={12}>
          <Guest />
        </Col>
      </Row>
    );
  }
}

export default LandingPage;
