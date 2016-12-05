import React from 'react';
import firebase from 'firebase';
import RaisedButton from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

class Guest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  guest(event) {
    event.preventDefault();
    this.guestCallback();
  }

  guestCallback() {
    firebase.auth().signInAnonymously()
      .catch((err) => alert(err.message));
  }



  render() {
    return (
      <div className='container'>
        <h1>Continue as Guest</h1>
        <form role='form'>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <RaisedButton label="Continue as Guest" onTouchTap={this.guest}/>
          </MuiThemeProvider>
        </form>
      </div>
    );
  }
}

export default Guest;
