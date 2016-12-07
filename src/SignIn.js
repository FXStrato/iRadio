/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React from 'react';
import {TextField, RaisedButton} from 'material-ui';
//import {Link} from 'react-router';
import firebase from 'firebase';
import {Row, Col} from 'react-materialize';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


class SignInForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: undefined,
      password: undefined,
      errorText: ''
    };
    //function binding
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
      var field = event.target.name;
      var value = event.target.value;
      var changes = {}; //object to hold changes
      changes[field] = value; //change this field
      this.setState(changes); //update state
      this.setState({errorText: ''});
  }

  //handle signIn button
  signIn = event => {
    event.preventDefault(); //don't submit
    this.signInCallback(this.state.email, this.state.password);
  }

  signInCallback(email, password) {
    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => {

        this.setState({errorText: err.message});
      });
  }

  render() {

    return (
      <div>
        <Row>
          <Col s={12}>
            <h1>Sign In Here!</h1>
            <div style={{color: '#E53935'}}>{this.state.errorText}</div>
            <form role="form">
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField style={{color: '#039BE5'}} floatingLabelText="Email" fullWidth={true} type="email" name="email" onChange={(e) => {this.handleChange(e)}} />
                </MuiThemeProvider>
              </div>
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField style={{color: '#039BE5'}} floatingLabelText="Password" fullWidth={true} type="password" name="password" onChange={(e) => {this.handleChange(e)}}/>
                </MuiThemeProvider>
              </div>
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <RaisedButton label="Sign In" primary={true} disabled={this.state.email && this.state.password ? false : true} labelStyle={{color: '#fff'}} onTouchTap={this.signIn}/>
                </MuiThemeProvider>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignInForm;
