/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React from 'react';
import {TextField, RaisedButton} from 'material-ui';
import {Row, Col} from 'react-materialize';
//import {Link} from 'react-router';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


/**
 * A form for signing up and logging into a website.
 * Specifies email, password, user handle
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignUpForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'email': undefined,
      'password': undefined,
      'match':undefined,//find a match password
      'user':undefined,
      emailvalidate: false,
      passwordvalidate: false,
      matchvalidate: false,
      uservalidate: false
    };

    //function binding
    this.handleChange = this.handleChange.bind(this);
  }

  //update state for specific field
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //handle signUp button
  signUp(event) {
    event.preventDefault(); //don't submit
    if(!this.state.email) {
      alert('Please fill out the form first!');
    } else {
      this.signUpCallback(this.state.email, this.state.user, this.state.password);
    }
  }

  signUpCallback(email, handle, password) {
    /* Create a new user and save their information */

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        //include information (for app-level content)
        //firebaseUser.sendEmailVerification();
        //var link = 'https://www.gravatar.com/avatar/' + md5(email);
        var profilePromise = firebaseUser.updateProfile({
          displayName: handle,
          photoURL: 'https://www.gravatar.com/avatar/'
        }); //return promise for chaining

        //create new entry in the Cloud DB (for others to reference)
				var userRef = firebase.database().ref('users/'+firebaseUser.uid);
        var userData = {
          handle:handle,
          avatar:'https://www.gravatar.com/avatar/'
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining
        //return Promise.all(profilePromise, userPromise); //do both at once!
      })

  }


  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g.,
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    var errors = {isValid: true, style:''};

    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      //handle minLength
      if(validations.minLength && value.length < validations.minLength){
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }
      if(validations.passwordInput && validations.passwordInput !== value){
        errors.passwordInput = true;
        errors.isValid = false;
      }

      let valid;
      //handle email type ??
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }

      if(validations.user) {
        valid = !/[^a-zA-Z0-9]/.test(value)
        if(!valid) {
          errors.isValid = false;
          errors.specialcharacters = true;
        }
      }

      //handle password type
      if(validations.password){
        valid = /^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{6,15}$/.test(value)
        if(!valid){
          errors.password = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  handleEmailValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, email:true});
    this.setState({emailvalidate: errors.isValid})
  }

  handlePasswordValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, minLength:6, password:true});
    this.setState({passwordvalidate: errors.isValid})
  }

  handleMatchValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, passwordInput:this.state.password})
    this.setState({matchvalidate: errors.isValid})
  }

  handleUserValidate = (event) => {
    this.handleChange(event);
    let errors = this.validate(event.target.value, {required:true, minLength:3, user:true});
    this.setState({uservalidate: errors.isValid});
  }

  render() {
    let buttonDisabled;
    if(this.state.uservalidate && this.state.passwordvalidate && this.state.matchvalidate && this.state.emailvalidate) {
      //Everything is valid
      buttonDisabled = false;
    } else {
      buttonDisabled = true;
    }

    return (
      <div>
        <Row>
          <Col s={12}>
            <h1>Sign Up Here!</h1>
            <form role="form">
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField id="signin-email" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Email" name="email" type="email" onChange={this.handleEmailValidate} errorText={!this.state.emailvalidate && this.state.email ? 'Not a valid email address':''} />
                </MuiThemeProvider>
              </div>
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField id="signin-user" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="User Handle" name="user" type="text" onChange={this.handleUserValidate} errorText={!this.state.uservalidate && this.state.user ? 'Must be at least 3 characters in length and not contain special characters or spaces':''} />
                </MuiThemeProvider>
              </div>
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField id="signin-password" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Password" name="password" type="password" onChange={this.handlePasswordValidate} errorText={!this.state.passwordvalidate && this.state.password ? 'Must contain at least 1 digit and alpha and be between 6-15 characters': ''} />
                </MuiThemeProvider>
              </div>
              <div className="form-group">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <TextField id="signin-user" style={{color: '#039BE5'}} fullWidth={true} floatingLabelText="Confirm Password" name="match" type="password" onChange={this.handleMatchValidate} errorText={!this.state.matchvalidate && this.state.match ? 'Passwords do not match':''} />
                </MuiThemeProvider>
              </div>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <RaisedButton label="Sign Up" labelStyle={!buttonDisabled ? {color: '#fff'} : {}} disabled={buttonDisabled} primary={true} onTouchTap={(e) => {this.signUp(e)}}/>
              </MuiThemeProvider>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignUpForm;
