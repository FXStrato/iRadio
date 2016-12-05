import React from 'react';
import {TextField, RaisedButton} from 'material-ui';
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


      //handle email type ??
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }

      //handle password type
      if(validations.password){
        var valid = /^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{6,15}$/.test(value)
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
    let errors = this.validate(event.target.value, {required:true, minLength:3});
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
      <div className="container">
        <h1>Sign Up Here!</h1>
        <form role="form">
          <div className="form-group">
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <TextField id="signin-email" style={{color: '#039BE5'}} floatingLabelText="Email" name="email" type="email" onChange={this.handleEmailValidate} errorText={!this.state.emailvalidate && this.state.email ? 'Not a valid email address':''} />
            </MuiThemeProvider>
          </div>
          <div className="form-group">
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <TextField id="signin-user" style={{color: '#039BE5'}} floatingLabelText="User Handle" name="user" type="text" onChange={this.handleUserValidate} errorText={!this.state.uservalidate && this.state.user ? 'Must be at least 3 characters in length':''} />
            </MuiThemeProvider>
          </div>
          <div className="form-group">
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <TextField id="signin-password" style={{color: '#039BE5'}} floatingLabelText="Password" name="password" type="password" onChange={this.handlePasswordValidate} errorText={!this.state.passwordvalidate && this.state.password ? 'Must contain at least 1 digit and alpha and be between 6-15 characters': ''} />
            </MuiThemeProvider>
          </div>
          <div className="form-group">
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <TextField id="signin-user" style={{color: '#039BE5'}} floatingLabelText="Confirm Password" name="match" type="password" onChange={this.handleMatchValidate} errorText={!this.state.matchvalidate && this.state.match ? 'Passwords do not match':''} />
            </MuiThemeProvider>
          </div>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <RaisedButton label="Sign Up" disabled={buttonDisabled} onTouchTap={(e) => {this.signUp(e)}}/>
          </MuiThemeProvider>
        </form>
      </div>
    );
  }
}

//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
  render() {
    //<Textfield id={this.props.field} type={this.props.type} label={this.props.field} floatingLabel style={{width: '200px'}} onChange={this.props.changeCallback}/>
    return (
      <div className={"form-group "+this.props.errors.style}>
        <label htmlFor={this.props.field} className="control-label">{this.props.label}</label>
        <input id={this.props.field} type={this.props.type} name={this.props.field} className="input" onChange={this.props.changeCallback} />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }
}

//a component to represent and display validation errors
class ValidationErrors extends React.Component {
  render() {
    return (
      <div>
        {this.props.errors.required &&
          <p className="help-block">Required!</p>
        }
        {this.props.errors.email &&
          <p className="help-block">Not an email address!</p>
        }
        {this.props.errors.minLength &&
          <p className="help-block">Must be at least {this.props.errors.minLength} characters.</p>
        }
        {this.props.errors.passwordInput &&
          <p className="help-block">Must match with the previous password</p>
        }
        {this.props.errors.password &&
          <p className="help-block">Must contain a digit and a alpha with size 6-15</p>
        }
      </div>
    );
  }
}

export default SignUpForm;
