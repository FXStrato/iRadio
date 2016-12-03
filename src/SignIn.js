import React from 'react';
import {Link} from 'react-router';
import firebase from 'firebase';

class SignInForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      'email': undefined,
      'password': undefined,
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
  }    

  //handle signIn button
  signIn(event) {
    event.preventDefault(); //don't submit
    this.signInCallback(this.state.email, this.state.password);
  }

  signInCallback(email, password) {
    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
  }

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

      //handle email type 
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

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6, password:true});

    //button validation
    var signInEnabled = (emailErrors.isValid && passwordErrors.isValid);

    return (
      <div className="container">
        <h1>Sign In Here!</h1>
        <form role="form" className="sign-up-form">

          <ValidatedInput field="email" type="email" label="Email" changeCallback={this.handleChange} errors={emailErrors} />

          <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

          {/* full html for the URL (because image) */}

          <div className="form-group sign-up-buttons">
            <button className="btn btn-primary" disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign-in</button>
            <p> Don't have an account yet?<Link to="/join" activeClassName="activeLink">SIGN UP</Link></p>
          </div>
        </form>
      </div>
    );
  }
}

class ValidatedInput extends React.Component {
  render() {
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
        {this.props.errors.password &&
          <p className="help-block">Must contain a digit and a alpha with size 6-15</p>
        }
      </div>
    );
  }
}

export {SignInForm}
export default SignInForm;










