import React from 'react';
import {Link} from 'react-router';
import firebase from 'firebase';
//import md5 from 'js-md5';

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
    this.signUpCallback(this.state.email, this.state.user, this.state.password, this.state.match);
  }

  signUpCallback(email, handle, password, match) {
    /* Create a new user and save their information */
   
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        //include information (for app-level content)
        firebaseUser.sendEmailVerification();
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
        return Promise.all(profilePromise, userPromise); //do both at once!
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

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6});
    var matchErrors = this.validate(this.state.match, {required:true, passwordInput:this.state.password})//check match error 
    var handleErrors = this.validate(this.state.user, {required:true, minLength:3});

    //button validation
    var signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && handleErrors.isValid && matchErrors.isValid);

    return (
      <div className="container">
        <h1>Sign Up Here!</h1>
        <form role="form" className="sign-up-form">

          <ValidatedInput field="email" type="email" label="Email" changeCallback={this.handleChange} errors={emailErrors} />

          <ValidatedInput field="user" type="text" label="User" changeCallback={this.handleChange} errors={handleErrors} />

          <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />


          <ValidatedInput field="match" type="password" label="Confirm Password" changeCallback={this.handleChange} errors={matchErrors} />

          {/* full html for the URL (because image) */}

          <div className="form-group sign-up-buttons">
            <button className="btn btn-primary" disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign-up</button>
            <p> Already have an account?<Link to="/login" activeClassName="activeLink">SIGN IN</Link></p>
          </div>
        </form>
      </div>
    );
  }
}

//to enforce proptype declaration
/*SignUpForm.propTypes = {
  signUpCallback: React.PropTypes.func.isRequired,
  signInCallback: React.PropTypes.func.isRequired
};*/


//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
  render() {
    //<Textfield id={this.props.field} type={this.props.type} label={this.props.field} floatingLabel style={{width: '200px'}} onChange={this.props.changeCallback}/>
    return (
      <div className={"form-group "+this.props.errors.style}>
        <label htmlFor={this.props.field} className="control-label">{this.props.label}</label>
        <input id={this.props.field} type={this.props.type} name={this.props.field} className="form-control" onChange={this.props.changeCallback} />
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
      </div>
    );
  }
}


//simple wrapper for displaying the form
class SignUpApp extends React.Component {

  //basic callbacks to prove things work!
  signUp(email, password, user) {
    window.alert("Signing up:", email, 'with handle', user);
  }

  signIn(email, password) {
    window.alert("Signing in:", email);
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Sign Up!</h1>
        </header>
        <SignUpForm signUpCallback={this.signUp} signInCallback={this.signIn} />
      </div>
    );
  }
}


export { SignUpApp, SignUpForm}; //for testing/demonstration
export default SignUpForm;
